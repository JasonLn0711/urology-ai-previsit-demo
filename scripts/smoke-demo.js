#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { SYNTHETIC_CASES } = require("../app/shared/cases.js");
const { buildClinicianSummary, summaryToText } = require("../app/shared/summary.js");
const { buildReviewRecord, reviewRecordToText } = require("../app/shared/review.js");

const root = path.resolve(__dirname, "..");
const checks = [];

function relPath(...parts) {
  return path.join(root, ...parts);
}

function read(relativePath) {
  return fs.readFileSync(relPath(relativePath), "utf8");
}

function record(name, passed, detail = "") {
  checks.push({ name, passed: Boolean(passed), detail });
}

function contains(relativePath, text) {
  return read(relativePath).includes(text);
}

function indexOf(relativePath, text) {
  return read(relativePath).indexOf(text);
}

function assertFile(relativePath) {
  record(`file exists: ${relativePath}`, fs.existsSync(relPath(relativePath)));
}

function assertScriptCompiles(relativePath) {
  const result = spawnSync(process.execPath, ["-c", relPath(relativePath)], {
    encoding: "utf8"
  });
  record(
    `script compiles: ${relativePath}`,
    result.status === 0,
    result.stderr || result.stdout
  );
}

function walkFiles(startRelativePath) {
  const start = relPath(startRelativePath);
  if (!fs.existsSync(start)) return [];
  const stat = fs.statSync(start);
  if (stat.isFile()) return [start];

  const results = [];
  for (const entry of fs.readdirSync(start)) {
    const absolute = path.join(start, entry);
    const entryStat = fs.statSync(absolute);
    if (entryStat.isDirectory()) {
      results.push(...walkFiles(path.relative(root, absolute)));
    } else {
      results.push(absolute);
    }
  }
  return results;
}

function readRepoTextFiles() {
  const roots = ["README.md", "package.json", "app", "docs", "scripts", "tests"];
  return roots.flatMap(walkFiles).filter((file) => {
    return /\.(html|js|json|md|css)$/.test(file);
  });
}

function assertNoRepositoryText(pattern, label) {
  const hits = [];
  for (const file of readRepoTextFiles()) {
    const text = fs.readFileSync(file, "utf8");
    if (pattern.test(text)) {
      hits.push(path.relative(root, file));
    }
  }
  record(`no stale text: ${label}`, hits.length === 0, hits.join(", "));
}

function checkEntrypoints() {
  [
    "app/patient-demo/index.html",
    "app/patient-demo/app.js",
    "app/clinician-summary/index.html",
    "app/reviewer-workbench/index.html",
    "app/reviewer-workbench/reviewer.js",
    "app/shared/summary.js",
    "app/shared/cases.js",
    "app/shared/review.js",
    "assets/bladder-flow.svg",
    "docs/samples/README.md"
  ].forEach(assertFile);

  [
    "app/patient-demo/app.js",
    "app/shared/summary.js",
    "app/shared/cases.js",
    "app/shared/review.js",
    "app/reviewer-workbench/reviewer.js",
    "scripts/generate-samples.js",
    "scripts/smoke-demo.js"
  ].forEach(assertScriptCompiles);
}

function checkBrowserScriptOrder() {
  const patientSummaryIndex = indexOf("app/patient-demo/index.html", "../shared/summary.js");
  const patientCasesIndex = indexOf("app/patient-demo/index.html", "../shared/cases.js");
  const patientAppIndex = indexOf("app/patient-demo/index.html", "./app.js");
  record(
    "patient demo loads shared scripts before app",
    patientSummaryIndex > -1 &&
      patientCasesIndex > patientSummaryIndex &&
      patientAppIndex > patientCasesIndex
  );

  const clinicianSummaryIndex = indexOf("app/clinician-summary/index.html", "../shared/summary.js");
  const clinicianCasesIndex = indexOf("app/clinician-summary/index.html", "../shared/cases.js");
  record(
    "clinician summary loads case source after summary library",
    clinicianSummaryIndex > -1 && clinicianCasesIndex > clinicianSummaryIndex
  );

  record(
    "reviewer workbench loads review library before page script",
    indexOf("app/reviewer-workbench/index.html", "../shared/review.js") <
      indexOf("app/reviewer-workbench/index.html", "./reviewer.js")
  );
}

function checkSyntheticCases() {
  record("three synthetic cases available", SYNTHETIC_CASES.length === 3);

  for (const sampleCase of SYNTHETIC_CASES) {
    record(`${sampleCase.id}: labeled synthetic`, /^Synthetic case:/.test(sampleCase.label));
    record(`${sampleCase.id}: has short label`, Boolean(sampleCase.shortLabel));
    record(`${sampleCase.id}: has demo meta`, Boolean(sampleCase.meta));
    record(`${sampleCase.id}: has answers`, Boolean(sampleCase.answers && sampleCase.answers.chiefConcern));

    const summary = buildClinicianSummary(sampleCase.answers);
    const text = summaryToText(summary).toLowerCase();
    record(`${sampleCase.id}: summary has safety notice`, text.includes("use synthetic data only"));
    record(`${sampleCase.id}: summary has clinician review boundary`, text.includes("clinician review required"));
    record(`${sampleCase.id}: summary avoids likely/probable claims`, !/likely|probable|diagnosed with|take medication/.test(text));
  }
}

function checkGeneratedSamples() {
  const sampleFiles = SYNTHETIC_CASES.map((sampleCase) => `docs/samples/clinician-summary-${sampleCase.id}.md`);
  for (const file of sampleFiles) {
    assertFile(file);
    record(`${file}: source points to shared cases`, contains(file, 'source: "app/shared/cases.js"'));
    record(`${file}: synthetic warning present`, contains(file, "Synthetic sample only"));
    record(`${file}: no treatment advice`, contains(file, "does not diagnose, triage, or recommend treatment"));
  }

  const sampleIndex = read("docs/samples/README.md");
  for (const file of sampleFiles) {
    record(`sample index links ${path.basename(file)}`, sampleIndex.includes(path.basename(file)));
  }
}

function checkReviewerBoundary() {
  const recordText = reviewRecordToText(buildReviewRecord({
    workflowPain: "clear",
    summaryUsefulness: "would-read",
    staffBurden: "acceptable",
    patientFit: "mixed",
    safetyBoundary: "acceptable",
    workflowSlot: "exists",
    existingProcess: "not-sufficient"
  })).toLowerCase();

  record("review record includes no diagnosis boundary", recordText.includes("no diagnosis"));
  record("review record includes no treatment boundary", recordText.includes("no treatment advice"));
  record("review record avoids clinical advice wording", !/likely infection|probable cancer|take medication/.test(recordText));
}

function checkNoStaleReferences() {
  record(
    "patient app uses shared synthetic cases",
    contains("app/patient-demo/app.js", "const SCENARIOS = SYNTHETIC_CASES;")
  );
  record(
    "patient app no longer embeds scenario array",
    !contains("app/patient-demo/app.js", "const SCENARIOS = [")
  );

  assertNoRepositoryText(/data\/synthetic-cases\/cases\.json/, "old synthetic cases json path");
  assertNoRepositoryText(/\bentryMode\b|\bsymptomCategory\b|\bfrequencyDay\b|\bphoneComfort\b|\bsupportNeeds\b/, "old answer field names");
}

function main() {
  checkEntrypoints();
  checkBrowserScriptOrder();
  checkSyntheticCases();
  checkGeneratedSamples();
  checkReviewerBoundary();
  checkNoStaleReferences();

  const failed = checks.filter((check) => !check.passed);
  for (const check of checks) {
    const mark = check.passed ? "ok" : "FAIL";
    const detail = check.detail ? ` -- ${check.detail}` : "";
    console.log(`${mark} ${check.name}${detail}`);
  }

  if (failed.length) {
    console.error(`\nSmoke check failed: ${failed.length}/${checks.length} checks failed.`);
    process.exit(1);
  }

  console.log(`\nSmoke check passed: ${checks.length}/${checks.length} checks passed.`);
}

main();
