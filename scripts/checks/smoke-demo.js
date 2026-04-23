#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { SYNTHETIC_CASES } = require("../../data/synthetic_cases");
const previsit = require("../../app/shared/summary");
const { validateIntakeRecord } = require("../../data/schema/intake-record");

const root = path.resolve(__dirname, "..", "..");
const checks = [];

function relPath(relativePath) {
  return path.join(root, relativePath);
}

function read(relativePath) {
  return fs.readFileSync(relPath(relativePath), "utf8");
}

function record(name, passed, detail = "") {
  checks.push({ name, passed: Boolean(passed), detail });
}

function assertFile(relativePath) {
  record(`file exists: ${relativePath}`, fs.existsSync(relPath(relativePath)));
}

function assertNoPath(relativePath) {
  record(`removed stale path: ${relativePath}`, !fs.existsSync(relPath(relativePath)));
}

function assertCompiles(relativePath) {
  const result = spawnSync(process.execPath, ["-c", relPath(relativePath)], { encoding: "utf8" });
  record(`script compiles: ${relativePath}`, result.status === 0, result.stderr || result.stdout);
}

function walk(startRelativePath) {
  const start = relPath(startRelativePath);
  if (!fs.existsSync(start)) return [];
  const stat = fs.statSync(start);
  if (stat.isFile()) return [start];
  return fs.readdirSync(start).flatMap((entry) => {
    const absolute = path.join(start, entry);
    const entryStat = fs.statSync(absolute);
    const relative = path.relative(root, absolute);
    return entryStat.isDirectory() ? walk(relative) : [absolute];
  });
}

function repoTextFiles() {
  return ["README.md", "app", "core", "data", "docs", "experiments", "scripts", "tests"]
    .flatMap(walk)
    .filter((file) => /\.(html|js|json|md|css)$/.test(file));
}

function assertNoRepositoryText(pattern, label) {
  const hits = repoTextFiles()
    .filter((file) => pattern.test(fs.readFileSync(file, "utf8")))
    .map((file) => path.relative(root, file));
  record(`no stale text: ${label}`, hits.length === 0, hits.join(", "));
}

function checkStructure() {
  [
    "app/patient/index.html",
    "app/patient/app.js",
    "app/nurse/index.html",
    "app/nurse/nurse.js",
    "app/clinician/index.html",
    "app/clinician/clinician.js",
    "app/clinician/visit-packet/index.html",
    "app/clinician/visit-packet/visit-packet.js",
    "app/reviewer/index.html",
    "app/reviewer/reviewer.js",
    "app/reviewer/packet/index.html",
    "app/shared/summary.js",
    "app/shared/cases.js",
    "app/shared/review.js",
    "core/summary/index.js",
    "core/missing_fields/index.js",
    "core/attribution/index.js",
    "core/role_transform/index.js",
    "core/safety/index.js",
    "data/synthetic_cases/index.js",
    "data/schema/intake-record.js",
    "data/schema/intake-record.schema.json",
    "experiments/phase1/plan.md",
    "experiments/phase1/scorecard.md",
    "experiments/phase1/decision-memo.md",
    "docs/product/README.md",
    "docs/safety/README.md",
    "docs/workflow/README.md",
    "docs/research/README.md",
    "docs/reviews/README.md"
  ].forEach(assertFile);

  [
    "app/patient-demo",
    "app/nurse-workbench",
    "app/clinician-summary",
    "app/reviewer-workbench",
    "app/review-packet",
    "app/visit-packet",
    "app/v1",
    "docs/samples"
  ].forEach(assertNoPath);
}

function checkScripts() {
  [
    "core/safety/index.js",
    "core/attribution/index.js",
    "core/missing_fields/index.js",
    "core/summary/index.js",
    "core/role_transform/index.js",
    "data/schema/intake-record.js",
    "data/synthetic_cases/index.js",
    "app/shared/summary.js",
    "app/shared/cases.js",
    "app/shared/review.js",
    "scripts/checks/smoke-demo.js",
    "scripts/generators/generate-workflow-rehearsal.js",
    "scripts/generators/generate-samples.js",
    "scripts/experiment/run-phase1.js",
    "scripts/experiment/check-phase1.js"
  ].forEach(assertCompiles);
}

function checkBrowserScriptOrder() {
  const pages = [
    "app/patient/index.html",
    "app/nurse/index.html",
    "app/clinician/index.html",
    "app/clinician/visit-packet/index.html"
  ];
  for (const page of pages) {
    const html = read(page);
    const safety = html.indexOf("core/safety/index.js");
    const summary = html.indexOf("app/shared/summary.js") > -1
      ? html.indexOf("app/shared/summary.js")
      : html.indexOf("../shared/summary.js");
    const cases = html.indexOf("data/synthetic_cases/index.js");
    record(`${page}: core loads before shared adapter`, safety > -1 && summary > safety);
    record(`${page}: data loads before cases adapter`, cases > -1 && html.indexOf("shared/cases.js") > cases);
  }
}

function checkCoreContract() {
  record("exactly five synthetic cases", SYNTHETIC_CASES.length === 5);
  for (const sampleCase of SYNTHETIC_CASES) {
    const recordObject = previsit.buildCanonicalRecord(sampleCase.answers);
    const validation = validateIntakeRecord(recordObject);
    const text = previsit.summaryToText(recordObject.derived_summary).toLowerCase();
    record(`${sampleCase.id}: canonical record validates`, validation.valid, validation.errors.join("; "));
    record(`${sampleCase.id}: source attribution present`, recordObject.attribution.field_sources.length > 0);
    record(`${sampleCase.id}: physician review required`, recordObject.derived_summary.requiresPhysicianReview === true);
    record(
      `${sampleCase.id}: no diagnosis/treatment claims`,
      !/likely infection|probable cancer|take medication|diagnosed with|you have/.test(text)
    );
  }
}

function checkDocsAndExperiments() {
  const plan = read("experiments/phase1/plan.md");
  const scorecard = read("experiments/phase1/scorecard.md");
  const memo = read("experiments/phase1/decision-memo.md");
  record("phase1 plan has objective", /## Objective/.test(plan));
  record("phase1 plan has hypothesis", /## Hypothesis/.test(plan));
  record("phase1 metrics declared", ["time_saved", "missing_field_reduction", "clinician_trust"].every((metric) => plan.includes(metric)));
  record("scorecard has required columns", /\| case \| time_saved \| nurse_fix \| trust_score \| issues \|/.test(scorecard));
  record("decision memo asks continue/revise/stop", /continue \/ revise \/ stop/.test(memo));
  record("README points to evaluation", read("README.md").includes("npm run experiment:phase1"));
}

function printResults() {
  for (const item of checks) {
    const prefix = item.passed ? "ok" : "FAIL";
    const detail = item.detail ? ` - ${String(item.detail).trim().split("\n")[0]}` : "";
    console.log(`${prefix} ${item.name}${detail}`);
  }
  const failed = checks.filter((item) => !item.passed);
  if (failed.length) {
    console.error("");
    console.error(`Smoke check failed: ${failed.length}/${checks.length} checks failed.`);
    process.exitCode = 1;
  } else {
    console.log("");
    console.log(`Smoke check passed: ${checks.length}/${checks.length} checks passed.`);
  }
}

checkStructure();
checkScripts();
checkBrowserScriptOrder();
checkCoreContract();
checkDocsAndExperiments();
printResults();
