#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { validateIntakeRecord } = require("../../data/schema/intake-record");

const root = path.resolve(__dirname, "..", "..");
const phaseDir = path.join(root, "experiments", "phase1");
const logsDir = path.join(phaseDir, "logs");
const checks = [];

function record(name, passed, detail = "") {
  checks.push({ name, passed: Boolean(passed), detail });
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function requiredFile(relativePath) {
  record(`file exists: ${relativePath}`, fs.existsSync(path.join(root, relativePath)));
}

function checkPlan() {
  requiredFile("experiments/phase1/plan.md");
  const plan = read("experiments/phase1/plan.md");
  record("plan objective present", plan.includes("## Objective"));
  record("plan hypothesis present", plan.includes("## Hypothesis"));
  record("plan metrics present", ["time_saved", "missing_field_reduction", "clinician_trust"].every((metric) => plan.includes(metric)));
}

function checkScorecard() {
  requiredFile("experiments/phase1/scorecard.md");
  const scorecard = read("experiments/phase1/scorecard.md");
  record("scorecard table has required header", /\| case \| time_saved \| nurse_fix \| trust_score \| issues \|/.test(scorecard));
}

function checkDecisionMemo() {
  requiredFile("experiments/phase1/decision-memo.md");
  const memo = read("experiments/phase1/decision-memo.md");
  record("memo has decision line", /continue \/ revise \/ stop/.test(memo));
  record("memo asks what works", /## What Works/.test(memo));
  record("memo asks what fails", /## What Fails/.test(memo));
  record("memo asks what to remove", /## What To Remove/.test(memo));
}

function checkLogs() {
  record("logs directory exists", fs.existsSync(logsDir));
  const files = fs.existsSync(logsDir)
    ? fs.readdirSync(logsDir).filter((file) => file.endsWith(".json"))
    : [];
  record("at least one experiment log exists", files.length > 0);

  for (const file of files) {
    const log = JSON.parse(fs.readFileSync(path.join(logsDir, file), "utf8"));
    record(`${file}: raw_case captured`, Boolean(log.raw_case && log.raw_case.answers));
    record(`${file}: system_output captured`, Boolean(log.system_output));
    record(`${file}: human_feedback captured`, Boolean(log.human_feedback));
    record(`${file}: failure_points captured`, Array.isArray(log.failure_points));
    const validation = validateIntakeRecord(log.system_output);
    record(`${file}: canonical system_output validates`, validation.valid, validation.errors.join("; "));
    record(`${file}: attribution present`, log.system_output.attribution.field_sources.length > 0);
    record(`${file}: physician review flag present`, log.system_output.derived_summary.requiresPhysicianReview === true);
  }
}

checkPlan();
checkScorecard();
checkDecisionMemo();
checkLogs();

for (const item of checks) {
  const prefix = item.passed ? "ok" : "FAIL";
  const detail = item.detail ? ` - ${String(item.detail).trim()}` : "";
  console.log(`${prefix} ${item.name}${detail}`);
}

const failed = checks.filter((item) => !item.passed);
if (failed.length) {
  console.error("");
  console.error(`Phase 1 experiment check failed: ${failed.length}/${checks.length} checks failed.`);
  process.exitCode = 1;
} else {
  console.log("");
  console.log(`Phase 1 experiment check passed: ${checks.length}/${checks.length} checks passed.`);
}
