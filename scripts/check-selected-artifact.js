#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const capturePath = process.env.UROLOGY_PREVISIT_CAPTURE ||
  "docs/reviews/2026-04-23-urology-review/decision-capture.md";

const starterByArtifact = {
  "revised question tree": "docs/reviews/2026-04-23-urology-review/artifact-starters/revised-question-tree.md",
  "one-page summary mockup": "docs/reviews/2026-04-23-urology-review/artifact-starters/one-page-summary-mockup.md",
  "assisted workflow test": "docs/reviews/2026-04-23-urology-review/artifact-starters/assisted-workflow-test.md",
  "pause note with rejected assumptions": "docs/reviews/2026-04-23-urology-review/artifact-starters/pause-note-with-rejected-assumptions.md"
};

const requiredBoundaryItems = [
  "Synthetic data only.",
  "No diagnosis.",
  "No triage.",
  "No treatment advice.",
  "Clinician review remains required."
];

const results = [];

function record(name, passed, detail = "") {
  results.push({ name, passed: Boolean(passed), detail });
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

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function readRelative(relativePath) {
  const fullPath = path.join(root, relativePath);
  record(`file exists: ${relativePath}`, fs.existsSync(fullPath));
  if (!fs.existsSync(fullPath)) return "";
  return fs.readFileSync(fullPath, "utf8");
}

function tableValue(text, label) {
  const pattern = new RegExp(`^\\|\\s*${escapeRegExp(label)}\\s*\\|\\s*([^|]+?)\\s*\\|\\s*$`, "im");
  const match = text.match(pattern);
  return match ? match[1].trim() : "";
}

function selectedArtifact(text) {
  const match = text.match(/^Selected artifact:\s*(.+?)\s*$/im);
  return match ? match[1].trim() : "";
}

function artifactPathFor(selected) {
  return process.env.UROLOGY_PREVISIT_ARTIFACT || starterByArtifact[selected] || "";
}

function checkCapture(text) {
  const status = normalize((text.match(/^Status:\s*(.+?)\s*$/im) || [])[1]);
  const tableArtifact = normalize(tableValue(text, "Smallest next artifact"));
  const selected = normalize(selectedArtifact(text));

  record("capture status is complete", status === "complete", status || "missing");
  record("capture has no pending review placeholders", !text.toLowerCase().includes("pending review"));
  record("selected artifact is known", Boolean(starterByArtifact[selected]), selected || "missing");
  record(
    "table artifact matches selected artifact",
    isFilled(tableArtifact) && isFilled(selected) && tableArtifact === selected,
    `${tableArtifact || "missing"} vs ${selected || "missing"}`
  );

  return selected;
}

function checkArtifact(text, selected, relativePath) {
  const lower = text.toLowerCase();

  record("artifact names selected artifact", lower.includes(selected), selected || "missing");
  record("artifact links decision capture", lower.includes("decision-capture.md"));
  record("artifact has source evidence section", text.includes("## Source Evidence"));
  record("artifact has done condition section", text.includes("## Done Condition"));
  record("artifact has no reviewer-evidence placeholders", !text.includes("TBD from reviewer evidence"));
  record("artifact has no pending review placeholders", !lower.includes("pending review"));
  record("artifact avoids clinical advice wording", !/likely infection|probable cancer|take medication/.test(lower));

  for (const item of requiredBoundaryItems) {
    record(`artifact keeps boundary: ${item}`, text.includes(item));
  }
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
    console.error(`Selected artifact check failed: ${failed.length}/${results.length} checks failed.`);
    console.error("Do not treat the next artifact as ready until placeholders are replaced with captured reviewer evidence.");
    process.exitCode = 1;
  } else {
    console.log("");
    console.log(`Selected artifact check passed: ${results.length}/${results.length} checks passed.`);
    console.log("Next action: review the completed artifact against docs/post-review-action-playbook.md.");
  }
}

function main() {
  const capture = readRelative(capturePath);
  const selected = capture ? checkCapture(capture) : "";
  const artifactPath = artifactPathFor(selected);
  record("artifact path selected", Boolean(artifactPath), artifactPath || "missing");
  const artifact = artifactPath ? readRelative(artifactPath) : "";
  if (artifact) checkArtifact(artifact, selected, artifactPath);
  printResults();
}

main();
