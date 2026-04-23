#!/usr/bin/env node

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { SYNTHETIC_CASES } = require("../app/shared/cases.js");
const { buildClinicianSummary, summaryToText } = require("../app/shared/summary.js");

const root = path.resolve(__dirname, "..");
const baseUrl = process.env.UROLOGY_PREVISIT_BASE_URL || "http://localhost:4173";
const results = [];

const requiredFiles = [
  "app/v1/index.html",
  "app/v1/styles.css",
  "app/v1/v1.js",
  "app/shared/cases.js",
  "app/shared/summary.js",
  "docs/v1-mvp-handoff-packet.md",
  "docs/source-verification.md",
  "docs/research/README.md",
  "docs/research/v1-phase-0-clinician-review-protocol.md",
  "docs/research/v1-phase0-review-session-script.md",
  "docs/research/v1-phase0-reviewer-ask.md",
  "docs/research/v1-phase0-review-capture.md",
  "docs/research/v1-priority-flow-shortlist.md",
  "docs/research/v1-priority-flow-review-worksheet.md",
  "docs/research/v1-review-scorecard.md",
  "docs/research/v1-phase0-analysis-template.md",
  "docs/research/v1-phase0-decision-memo-template.md",
  "docs/research/v1-governance-gate-register.md",
  "docs/workflow-rehearsal.md",
  "docs/samples/README.md",
  "docs/samples/clinician-summary-synthetic-hematuria-occult-blood.md"
];

const requiredRoutes = [
  "/app/v1/",
  "/docs/v1-mvp-handoff-packet.md",
  "/docs/research/",
  "/docs/research/v1-phase0-review-capture.md",
  "/docs/research/v1-review-scorecard.md",
  "/docs/research/v1-priority-flow-review-worksheet.md",
  "/docs/research/v1-phase0-analysis-template.md"
];

const priorityFlows = [
  "頻尿或夜尿",
  "小便困難或尿不出來",
  "血尿或健檢發現潛血"
];

const priorityCaseIds = [
  "synthetic-frequency-older-adult",
  "synthetic-emptying-difficulty",
  "synthetic-hematuria-occult-blood"
];

const safetyPhrases = [
  "synthetic data only",
  "not for clinical use",
  "physician review required",
  "regulatory status not determined",
  "no real patient identifiers",
  "no live his",
  "no diagnosis",
  "no autonomous exam ordering"
];

function relPath(relativePath) {
  return path.join(root, relativePath);
}

function read(relativePath) {
  return fs.readFileSync(relPath(relativePath), "utf8");
}

function record(name, passed, detail = "") {
  results.push({ name, passed: Boolean(passed), detail });
}

function runStep(name, args) {
  const result = spawnSync(args[0], args.slice(1), {
    cwd: root,
    encoding: "utf8"
  });
  record(name, result.status === 0, result.stderr || result.stdout);
}

function requestHead(route) {
  const url = new URL(route, baseUrl);
  return new Promise((resolve) => {
    const request = http.request(url, { method: "HEAD", timeout: 1500 }, (response) => {
      response.resume();
      resolve({
        route,
        statusCode: response.statusCode,
        passed: response.statusCode >= 200 && response.statusCode < 400
      });
    });

    request.on("timeout", () => {
      request.destroy(new Error("timeout"));
    });
    request.on("error", (error) => {
      resolve({ route, statusCode: 0, passed: false, error: error.message });
    });
    request.end();
  });
}

function checkRequiredFiles() {
  for (const file of requiredFiles) {
    record(`required file exists: ${file}`, fs.existsSync(relPath(file)));
  }
}

function checkPackageScript() {
  const packageJson = JSON.parse(read("package.json"));
  record(
    "package exposes phase0:check",
    packageJson.scripts && packageJson.scripts["phase0:check"] === "node scripts/check-phase0-readiness.js"
  );
}

function checkSyntheticCaseSet() {
  record("exactly five synthetic cases are present", SYNTHETIC_CASES.length === 5);
  for (const caseId of priorityCaseIds) {
    record(`priority case present: ${caseId}`, Boolean(SYNTHETIC_CASES.find((sampleCase) => sampleCase.id === caseId)));
  }

  for (const sampleCase of SYNTHETIC_CASES) {
    const summary = buildClinicianSummary(sampleCase.answers);
    const text = summaryToText(summary).toLowerCase();
    record(`${sampleCase.id}: summary says synthetic only`, text.includes("use synthetic data only"));
    record(`${sampleCase.id}: summary requires clinician review`, text.includes("clinician review required"));
    record(
      `${sampleCase.id}: summary avoids diagnosis/treatment claims`,
      !/likely|probable|diagnosed with|take medication|treat with/.test(text)
    );
  }
}

function checkV1Boundary() {
  const html = read("app/v1/index.html");
  const script = read("app/v1/v1.js");
  const combined = `${html}\n${script}`.toLowerCase();

  record("v1 route uses product wording", html.includes("Urology AI Previsit v1 MVP"));
  record("v1 route avoids user-facing demo path", !/app\/demo|demo product route/i.test(`${html}\n${script}`));
  record("v1 route has role tabs", ["Intake", "Nurse", "Physician", "Exam Prep", "Export", "Research"].every((label) => html.includes(label)));
  record("v1 route uses mock export only", script.includes('integrationMode: "mock_export_only"') && script.includes("liveHisWriteback: false"));
  record("v1 route says no order is placed", script.includes("orderPlaced: false") && combined.includes("no exam order is placed"));
  record("v1 route keeps safety boundary", safetyPhrases.slice(0, 4).every((phrase) => combined.includes(phrase)));
  record("v1 route avoids settled regulatory claims", !/not a medical device|tfda approved|fda approved|non-device status is settled/.test(combined));
  record("v1 route avoids diagnosis/treatment claims", !/likely infection|probable cancer|take medication|start antibiotic|start blocker/.test(combined));
}

function checkCaptureSheet() {
  const capture = read("docs/research/v1-phase0-review-capture.md");
  const lower = capture.toLowerCase();
  const allCaseIds = SYNTHETIC_CASES.map((sampleCase) => sampleCase.id);

  record("capture sheet is blank current-session template", capture.includes("Status: blank current-session capture template"));
  record("capture sheet includes five-case review", capture.includes("## Five-Case Summary Review"));
  record("capture sheet includes priority-flow decision", capture.includes("## Priority Flow Decision"));
  record("capture sheet includes governance gates", capture.includes("## Governance Gate Triggers"));
  record("capture sheet includes closeout checklist", capture.includes("## Immediate Closeout Checklist"));
  record("capture sheet includes all synthetic case ids", allCaseIds.every((caseId) => capture.includes(caseId)));
  record("capture sheet includes proposed priority flows", priorityFlows.every((flow) => capture.includes(flow)));
  record("capture sheet keeps safety boundary", safetyPhrases.every((phrase) => lower.includes(phrase)));
  record("capture sheet blocks real-patient details", lower.includes("if a reviewer starts describing a real patient"));
  record("capture sheet avoids prefilled decision", !/- \\[x\\] (Continue|Revise|Narrow|Pause|Governance review before next step)/.test(capture));
}

function checkResearchRouting() {
  const readme = read("docs/research/README.md");
  const sessionScript = read("docs/research/v1-phase0-review-session-script.md");
  const analysis = read("docs/research/v1-phase0-analysis-template.md");
  const scorecard = read("docs/research/v1-review-scorecard.md");
  const worksheet = read("docs/research/v1-priority-flow-review-worksheet.md");
  const handoff = read("docs/v1-mvp-handoff-packet.md");
  const sourceTrace = read("docs/source-verification.md");
  const combined = `${readme}\n${sessionScript}\n${analysis}\n${scorecard}\n${worksheet}\n${handoff}\n${sourceTrace}`;

  record("research README points to readiness command", readme.includes("npm run phase0:check"));
  record("session script routes live capture", sessionScript.includes("v1-phase0-review-capture.md"));
  record("analysis template routes live capture", analysis.includes("v1-phase0-review-capture.md"));
  record("scorecard routes priority worksheet", scorecard.includes("v1-priority-flow-review-worksheet.md"));
  record("handoff packet points to readiness command", handoff.includes("npm run phase0:check"));
  record("source trace points to readiness command", sourceTrace.includes("npm run phase0:check"));
  record("research materials include priority flows", priorityFlows.every((flow) => combined.includes(flow)));
  record("research routing avoids clinical-use claims", !/tfda approved|fda approved|not a medical device|live his writeback is ready/i.test(combined));
}

async function checkServerRoutes() {
  const checks = await Promise.all(requiredRoutes.map(requestHead));
  for (const check of checks) {
    const detail = check.error ? check.error : `HTTP ${check.statusCode}`;
    record(`server route ready: ${check.route}`, check.passed, detail);
  }
}

function printResults() {
  for (const item of results) {
    const prefix = item.passed ? "ok" : "FAIL";
    const firstDetailLine = String(item.detail || "").trim().split("\n")[0];
    const detail = firstDetailLine ? ` - ${firstDetailLine}` : "";
    console.log(`${prefix} ${item.name}${detail}`);
  }

  const failed = results.filter((item) => !item.passed);
  if (failed.length) {
    console.error("");
    console.error(`Phase 0 readiness failed: ${failed.length}/${results.length} checks failed.`);
    console.error("Start the static server with: npm start");
    console.error(`Or point this check at a running server: UROLOGY_PREVISIT_BASE_URL=${baseUrl} npm run phase0:check`);
    process.exitCode = 1;
  } else {
    console.log("");
    console.log(`Phase 0 readiness passed: ${results.length}/${results.length} checks passed.`);
    console.log(`V1 route: ${baseUrl}/app/v1/`);
    console.log("Next action: run the Phase 0 review and fill docs/research/v1-phase0-review-capture.md with reviewer evidence.");
  }
}

async function main() {
  checkRequiredFiles();
  checkPackageScript();
  checkSyntheticCaseSet();
  checkV1Boundary();
  checkCaptureSheet();
  checkResearchRouting();
  runStep("smoke checks pass", [process.execPath, "scripts/smoke-demo.js"]);
  runStep("node tests pass", [process.execPath, "--test"]);
  await checkServerRoutes();
  printResults();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
