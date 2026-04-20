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
    "app/review-packet/index.html",
    "app/clinician-summary/index.html",
    "app/reviewer-workbench/index.html",
    "app/reviewer-workbench/reviewer.js",
    "app/shared/summary.js",
    "app/shared/cases.js",
    "app/shared/review.js",
    "assets/bladder-flow.svg",
    "docs/mvp-review-packet.md",
    "docs/meeting-capture-template.md",
    "docs/post-review-action-playbook.md",
    "docs/reviews/2026-04-23-urology-review/README.md",
    "docs/reviews/2026-04-23-urology-review/pre-meeting-readiness.md",
    "docs/reviews/2026-04-23-urology-review/reviewer-one-page-handout.md",
    "docs/reviews/2026-04-23-urology-review/post-review-closeout.md",
    "docs/reviews/2026-04-23-urology-review/decision-capture.md",
    "docs/workflow-rehearsal.md",
    "docs/samples/README.md"
  ].forEach(assertFile);

  [
    "app/patient-demo/app.js",
    "app/shared/summary.js",
    "app/shared/cases.js",
    "app/shared/review.js",
    "app/reviewer-workbench/reviewer.js",
    "scripts/generate-workflow-rehearsal.js",
    "scripts/generate-samples.js",
    "scripts/check-meeting-readiness.js",
    "scripts/check-review-closeout.js",
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
  record("four synthetic cases available", SYNTHETIC_CASES.length === 4);

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

function checkWorkflowRehearsal() {
  const text = read("docs/workflow-rehearsal.md");
  record("workflow rehearsal declares generated sources", text.includes("Generated from `app/shared/cases.js`"));
  record("workflow rehearsal has patient flow check", text.includes("### Patient Flow Check"));
  record("workflow rehearsal has nurse workflow cues", text.includes("### Nurse Workflow Cues"));
  record("workflow rehearsal has reviewer questions", text.includes("### Reviewer Questions"));
  record("workflow rehearsal has stop rules", text.includes("## Stop Rules"));
  record("workflow rehearsal keeps safety boundary", text.includes("does not diagnose, triage, or recommend treatment"));
  record("workflow rehearsal avoids clinical advice wording", !/likely infection|probable cancer|take medication/.test(text.toLowerCase()));

  for (const sampleCase of SYNTHETIC_CASES) {
    record(`workflow rehearsal includes ${sampleCase.id}`, text.includes(`Case id: \`${sampleCase.id}\``));
  }
}

function checkReviewPacket() {
  const text = read("docs/mvp-review-packet.md");
  record("review packet has non-negotiable boundary", text.includes("## Non-Negotiable Boundary"));
  record("review packet routes demo surfaces", text.includes("http://localhost:4173/app/patient-demo/"));
  record("review packet includes artifact map", text.includes("## Artifact Map"));
  record("review packet includes reviewer roles", text.includes("## Reviewer Roles"));
  record("review packet includes decision scorecard", text.includes("## Decision Scorecard"));
  record("review packet includes decision rules", text.includes("## Decision Rules"));
  record("review packet includes hard stop conditions", text.includes("## Hard Stop Conditions"));
  record("review packet routes reviewer workbench", text.includes("Reviewer workbench"));
  record("review packet references workflow rehearsal", text.includes("docs/workflow-rehearsal.md"));
  record("review packet covers four cases", text.includes("Run The Four Cases"));
  record("review packet includes recurrent infection case", text.includes("Recurrent infection context"));
  record("review packet references action playbook", text.includes("docs/post-review-action-playbook.md"));
  record("review packet references pre-meeting readiness", text.includes("docs/reviews/2026-04-23-urology-review/pre-meeting-readiness.md"));
  record("review packet references reviewer handout", text.includes("docs/reviews/2026-04-23-urology-review/reviewer-one-page-handout.md"));
  record("review packet references post-review closeout", text.includes("docs/reviews/2026-04-23-urology-review/post-review-closeout.md"));
  record("review packet references dated decision capture", text.includes("docs/reviews/2026-04-23-urology-review/decision-capture.md"));
  record("review packet keeps safety boundary", text.includes("No diagnosis.") && text.includes("No treatment advice."));
  record("review packet avoids clinical advice wording", !/likely infection|probable cancer|take medication/.test(text.toLowerCase()));
  record("review packet has no stale three-case wording", !/three synthetic scenario|Run The Three Cases|Three-case walkthrough/i.test(text));
}

function checkBrowserReviewPacket() {
  const text = read("app/review-packet/index.html");
  const lower = text.toLowerCase();

  record("browser review packet has title", text.includes("MVP review packet"));
  record("browser review packet links patient demo", text.includes('href="../patient-demo/"'));
  record("browser review packet links clinician summary", text.includes('href="../clinician-summary/"'));
  record("browser review packet links reviewer workbench", text.includes('href="../reviewer-workbench/"'));
  record("browser review packet links workflow rehearsal", text.includes("../../docs/workflow-rehearsal.md"));
  record("browser review packet links markdown packet", text.includes("../../docs/mvp-review-packet.md"));
  record("browser review packet links action playbook", text.includes("../../docs/post-review-action-playbook.md"));
  record("browser review packet links pre-meeting readiness", text.includes("../../docs/reviews/2026-04-23-urology-review/pre-meeting-readiness.md"));
  record("browser review packet links reviewer handout", text.includes("../../docs/reviews/2026-04-23-urology-review/reviewer-one-page-handout.md"));
  record("browser review packet links post-review closeout", text.includes("../../docs/reviews/2026-04-23-urology-review/post-review-closeout.md"));
  record("browser review packet links dated decision capture", text.includes("../../docs/reviews/2026-04-23-urology-review/decision-capture.md"));
  record("browser review packet covers four cases", text.includes("Four-case walkthrough"));
  record(
    "browser review packet has decision outcomes",
    ["Continue", "Revise", "Narrow", "Pause"].every((outcome) => text.includes(`<h3>${outcome}</h3>`))
  );
  record(
    "browser review packet keeps safety boundary",
    text.includes("No diagnosis, triage, or treatment advice.") &&
      text.includes("Clinician review remains required.")
  );
  record("browser review packet avoids clinical advice wording", !/likely infection|probable cancer|take medication/.test(lower));
  record("browser review packet has no stale three-case wording", !/three-case walkthrough/i.test(lower));
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
  record("review record includes meeting evidence", recordText.includes("meeting evidence"));
  record("review record avoids clinical advice wording", !/likely infection|probable cancer|take medication/.test(recordText));
}

function checkMeetingCaptureTemplate() {
  const text = read("docs/meeting-capture-template.md");
  const lower = text.toLowerCase();

  record("meeting capture has four-case evidence", text.includes("## Four-Case Evidence"));
  record("meeting capture includes recurrent infection case", text.includes("Recurrent infection context"));
  record("meeting capture has decision signals", text.includes("## Decision Signals"));
  record("meeting capture has hard stop notes", text.includes("## Hard Stop Notes"));
  record("meeting capture references action playbook", text.includes("docs/post-review-action-playbook.md"));
  record("meeting capture avoids clinical advice wording", !/likely infection|probable cancer|take medication/.test(lower));
}

function checkPostReviewActionPlaybook() {
  const text = read("docs/post-review-action-playbook.md");
  const lower = text.toLowerCase();

  record("action playbook maps decisions", text.includes("## Decision-To-Artifact Map"));
  record("action playbook has continue artifact", text.includes("## Continue Artifact: Revised Question Tree"));
  record("action playbook has summary mockup artifact", text.includes("## Continue Or Revise Artifact: One-Page Summary Mockup"));
  record("action playbook has narrow artifact", text.includes("## Narrow Artifact: Assisted Workflow Test"));
  record("action playbook has pause artifact", text.includes("## Pause Artifact: Pause Note With Rejected Assumptions"));
  record("action playbook has hard stop", text.includes("## Hard Stop"));
  record("action playbook references dated decision capture", text.includes("docs/reviews/2026-04-23-urology-review/decision-capture.md"));
  record("action playbook avoids clinical advice wording", !/likely infection|probable cancer|take medication/.test(lower));
}

function checkDatedReviewWorkspace() {
  const capture = read("docs/reviews/2026-04-23-urology-review/decision-capture.md");
  const readme = read("docs/reviews/2026-04-23-urology-review/README.md");
  const readiness = read("docs/reviews/2026-04-23-urology-review/pre-meeting-readiness.md");
  const handout = read("docs/reviews/2026-04-23-urology-review/reviewer-one-page-handout.md");
  const closeout = read("docs/reviews/2026-04-23-urology-review/post-review-closeout.md");
  const lower = `${capture}\n${readme}`.toLowerCase();

  record("dated review workspace is pending", capture.includes("Status: pending review"));
  record("dated review workspace includes four cases", ["Frequent urination at night", "Difficulty emptying", "Incomplete leakage intake", "Recurrent infection context"].every((item) => capture.includes(item)));
  record("dated review workspace has no prefilled decision", !/decision: continue|decision: revise|decision: narrow|decision: pause/.test(lower));
  record("dated review workspace has no clinical advice wording", !/likely infection|probable cancer|take medication/.test(lower));
  record("dated review workspace warns against prefill", readme.includes("Do not pre-fill reviewer conclusions"));
  record("dated review workspace has readiness checklist", readiness.includes("npm run meeting:check"));
  record("dated review workspace has reviewer handout", handout.includes("## Decision Choices"));
  record("dated review workspace has post-review closeout", closeout.includes("npm run review:closeout"));
  record("dated readiness checklist avoids clinical advice wording", !/likely infection|probable cancer|take medication/.test(readiness.toLowerCase()));
  record("dated reviewer handout avoids clinical advice wording", !/likely infection|probable cancer|take medication/.test(handout.toLowerCase()));
  record("dated post-review closeout avoids clinical advice wording", !/likely infection|probable cancer|take medication/.test(closeout.toLowerCase()));
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
  checkWorkflowRehearsal();
  checkReviewPacket();
  checkBrowserReviewPacket();
  checkMeetingCaptureTemplate();
  checkPostReviewActionPlaybook();
  checkDatedReviewWorkspace();
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
