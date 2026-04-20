#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const capturePath = process.env.UROLOGY_PREVISIT_CAPTURE ||
  "docs/reviews/2026-04-23-urology-review/decision-capture.md";

const allowedArtifacts = {
  continue: ["revised question tree", "one-page summary mockup"],
  revise: ["one-page summary mockup", "revised question tree"],
  narrow: ["assisted workflow test"],
  pause: ["pause note with rejected assumptions"]
};

const requiredBoundaryItems = [
  "Synthetic data only.",
  "No diagnosis.",
  "No triage.",
  "No treatment advice.",
  "Clinician review remains required.",
  "No real patient identifiers were entered."
];

const requiredCases = [
  "Frequent urination at night",
  "Difficulty emptying",
  "Incomplete leakage intake",
  "Recurrent infection context"
];

const requiredSignals = [
  "Repeated-question pain",
  "Summary usefulness",
  "Workflow slot",
  "Staff burden",
  "Patient or assisted completion",
  "Existing process gap",
  "Safety boundary"
];

const results = [];

function record(name, passed, detail = "") {
  results.push({ name, passed: Boolean(passed), detail });
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalize(value) {
  return String(value || "")
    .replace(/`/g, "")
    .trim()
    .toLowerCase();
}

function isFilled(value) {
  const normalized = normalize(value);
  return Boolean(normalized) && normalized !== "pending review" && normalized !== "not selected";
}

function tableValue(text, label) {
  const pattern = new RegExp(`^\\|\\s*${escapeRegExp(label)}\\s*\\|\\s*([^|]+?)\\s*\\|\\s*$`, "im");
  const match = text.match(pattern);
  return match ? match[1].trim() : "";
}

function tableRow(text, label) {
  const pattern = new RegExp(`^\\|\\s*${escapeRegExp(label)}\\s*\\|(.+?)\\|\\s*$`, "im");
  const match = text.match(pattern);
  return match ? match[0] : "";
}

function selectedArtifact(text) {
  const match = text.match(/^Selected artifact:\s*(.+?)\s*$/im);
  return match ? match[1].trim() : "";
}

function readCapture() {
  const fullPath = path.join(root, capturePath);
  record(`capture file exists: ${capturePath}`, fs.existsSync(fullPath));
  if (!fs.existsSync(fullPath)) return "";
  return fs.readFileSync(fullPath, "utf8");
}

function checkStatus(text) {
  const status = (text.match(/^Status:\s*(.+?)\s*$/im) || [])[1] || "";
  record("status is complete", normalize(status) === "complete", `found: ${status || "missing"}`);
  record("no pending review placeholders remain", !text.toLowerCase().includes("pending review"));
}

function checkBoundary(text) {
  for (const item of requiredBoundaryItems) {
    const pattern = new RegExp(`^- \\[[xX]\\] ${escapeRegExp(item)}$`, "m");
    record(`boundary confirmed: ${item}`, pattern.test(text));
  }
}

function checkIdentity(text) {
  record("reviewer role captured", isFilled(tableValue(text, "Reviewer role")));
  record("owner captured", isFilled(tableValue(text, "Owner")));
  record("due date captured", isFilled(tableValue(text, "Due date")));
}

function checkCaseEvidence(text) {
  for (const label of requiredCases) {
    const row = tableRow(text, label);
    record(`case evidence captured: ${label}`, row && !row.toLowerCase().includes("pending review"));
  }
}

function checkDecisionSignals(text) {
  for (const signal of requiredSignals) {
    const row = tableRow(text, signal);
    const parts = row.split("|").map((part) => part.trim()).filter(Boolean);
    const status = normalize(parts[1]);
    const evidence = parts[2] || "";
    record(
      `signal has status and evidence: ${signal}`,
      ["supporting", "uncertain", "blocking"].includes(status) && isFilled(evidence),
      row || "missing"
    );
  }
}

function checkDecisionAndArtifact(text) {
  const decision = normalize(tableValue(text, "Decision"));
  const artifactFromTable = normalize(tableValue(text, "Smallest next artifact"));
  const selected = normalize(selectedArtifact(text));
  const allowed = allowedArtifacts[decision] || [];

  record("decision is one of continue/revise/narrow/pause", Boolean(allowedArtifacts[decision]), decision || "missing");
  record("smallest next artifact is captured", isFilled(artifactFromTable), artifactFromTable || "missing");
  record("selected artifact is captured", isFilled(selected), selected || "missing");
  record(
    "table artifact matches selected artifact",
    isFilled(artifactFromTable) && isFilled(selected) && artifactFromTable === selected,
    `${artifactFromTable || "missing"} vs ${selected || "missing"}`
  );
  record("selected artifact matches decision", allowed.includes(selected), `decision=${decision || "missing"} artifact=${selected || "missing"}`);
}

function checkWorkbenchRecord(text) {
  const section = text.split("## Copied Reviewer Workbench Record")[1] || "";
  const beforeNext = section.split("## Selected Next Artifact")[0] || "";
  record("copied reviewer workbench record present", beforeNext.includes("Urology previsit MVP reviewer record"));
  record("reviewer record includes meeting evidence", beforeNext.includes("Meeting evidence:"));
  record("reviewer record keeps safety boundary", beforeNext.includes("No diagnosis.") && beforeNext.includes("No treatment advice."));
}

function checkHardStopNotes(text) {
  const section = text.split("## Hard Stop Notes")[1] || "";
  const beforeNext = section.split("## Copied Reviewer Workbench Record")[0] || "";
  record("hard stop notes resolved", !beforeNext.toLowerCase().includes("pending review"));
}

function printResults() {
  for (const item of results) {
    const prefix = item.passed ? "ok" : "FAIL";
    const detail = item.detail ? ` - ${String(item.detail).trim()}` : "";
    console.log(`${prefix} ${item.name}${detail}`);
  }

  const failed = results.filter((item) => !item.passed);
  if (failed.length) {
    console.error("");
    console.error(`Review closeout failed: ${failed.length}/${results.length} checks failed.`);
    console.error("Do not start the next artifact until decision-capture.md is complete or explicitly marked pending follow-up.");
    process.exitCode = 1;
  } else {
    console.log("");
    console.log(`Review closeout passed: ${results.length}/${results.length} checks passed.`);
    console.log("Next action: create exactly one artifact from docs/post-review-action-playbook.md.");
  }
}

function main() {
  const text = readCapture();
  if (text) {
    checkStatus(text);
    checkBoundary(text);
    checkIdentity(text);
    checkCaseEvidence(text);
    checkDecisionSignals(text);
    checkDecisionAndArtifact(text);
    checkWorkbenchRecord(text);
    checkHardStopNotes(text);
  }
  printResults();
}

main();
