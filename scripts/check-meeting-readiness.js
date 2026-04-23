#!/usr/bin/env node

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const baseUrl = process.env.UROLOGY_PREVISIT_BASE_URL || "http://localhost:4173";

const requiredFiles = [
  "docs/meeting-demo-script.md",
  "docs/mvp-review-packet.md",
  "docs/meeting-capture-template.md",
  "docs/post-review-action-playbook.md",
  "docs/workflow-rehearsal.md",
  "docs/samples/README.md",
  "docs/reviews/2026-04-23-urology-review/README.md",
  "docs/reviews/2026-04-23-urology-review/reviewer-one-page-handout.md",
  "docs/reviews/2026-04-23-urology-review/post-review-closeout.md",
  "docs/reviews/2026-04-23-urology-review/artifact-starters/README.md",
  "docs/reviews/2026-04-23-urology-review/decision-capture.md",
  "app/review-packet/index.html",
  "app/patient-demo/index.html",
  "app/reviewer-workbench/index.html"
];

const requiredRoutes = [
  "/app/review-packet/",
  "/app/patient-demo/",
  "/app/clinician-summary/",
  "/app/reviewer-workbench/",
  "/docs/reviews/2026-04-23-urology-review/reviewer-one-page-handout.md",
  "/docs/reviews/2026-04-23-urology-review/post-review-closeout.md",
  "/docs/reviews/2026-04-23-urology-review/artifact-starters/",
  "/docs/reviews/2026-04-23-urology-review/decision-capture.md",
  "/docs/post-review-action-playbook.md"
];

const results = [];

function record(name, passed, detail = "") {
  results.push({ name, passed: Boolean(passed), detail });
}

function relPath(relativePath) {
  return path.join(root, relativePath);
}

function read(relativePath) {
  return fs.readFileSync(relPath(relativePath), "utf8");
}

function runStep(name, args) {
  const result = spawnSync(args[0], args.slice(1), {
    cwd: root,
    encoding: "utf8"
  });
  record(name, result.status === 0, result.stderr || result.stdout);
}

function checkRequiredFiles() {
  for (const file of requiredFiles) {
    record(`required file exists: ${file}`, fs.existsSync(relPath(file)));
  }
}

function checkPendingDecisionCapture() {
  const capture = read("docs/reviews/2026-04-23-urology-review/decision-capture.md");
  const lower = capture.toLowerCase();
  record("decision capture is pending review or follow-up", /Status: pending (review|follow-up)/.test(capture));
  record("decision capture includes four-case table", ["Frequent urination at night", "Difficulty emptying", "Incomplete leakage intake", "Recurrent infection context"].every((item) => capture.includes(item)));
  record("decision capture has no prefilled decision", !/decision: continue|decision: revise|decision: narrow|decision: pause/.test(lower));
  record("decision capture keeps boundary wording", capture.includes("No diagnosis") && capture.includes("No treatment advice"));
}

function checkReviewPacketRoutes() {
  const html = read("app/review-packet/index.html");
  const packet = read("docs/mvp-review-packet.md");
  record("browser packet links dated capture", html.includes("../../docs/reviews/2026-04-23-urology-review/decision-capture.md"));
  record("browser packet links reviewer handout", html.includes("../../docs/reviews/2026-04-23-urology-review/reviewer-one-page-handout.md"));
  record("browser packet links post-review closeout", html.includes("../../docs/reviews/2026-04-23-urology-review/post-review-closeout.md"));
  record("browser packet links artifact starters", html.includes("../../docs/reviews/2026-04-23-urology-review/artifact-starters/"));
  record("markdown packet links dated capture", packet.includes("docs/reviews/2026-04-23-urology-review/decision-capture.md"));
  record("markdown packet links reviewer handout", packet.includes("docs/reviews/2026-04-23-urology-review/reviewer-one-page-handout.md"));
  record("markdown packet links post-review closeout", packet.includes("docs/reviews/2026-04-23-urology-review/post-review-closeout.md"));
  record("markdown packet links artifact starters", packet.includes("docs/reviews/2026-04-23-urology-review/artifact-starters/"));
  record("markdown packet links action playbook", packet.includes("docs/post-review-action-playbook.md"));
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
    const detail = item.detail ? ` - ${String(item.detail).trim().split("\n")[0]}` : "";
    console.log(`${prefix} ${item.name}${detail}`);
  }

  const failed = results.filter((item) => !item.passed);
  if (failed.length) {
    console.error("");
    console.error(`Meeting readiness failed: ${failed.length}/${results.length} checks failed.`);
    console.error(`Start the static server with: npm start`);
    process.exitCode = 1;
  } else {
    console.log("");
    console.log(`Meeting readiness passed: ${results.length}/${results.length} checks passed.`);
    console.log(`Review entrypoint: ${baseUrl}/app/review-packet/`);
    console.log("Next action: run the four-case review and fill docs/reviews/2026-04-23-urology-review/decision-capture.md with real reviewer evidence.");
  }
}

async function main() {
  checkRequiredFiles();
  checkPendingDecisionCapture();
  checkReviewPacketRoutes();
  runStep("smoke checks pass", [process.execPath, "scripts/smoke-demo.js"]);
  runStep("node tests pass", [process.execPath, "--test"]);
  await checkServerRoutes();
  printResults();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
