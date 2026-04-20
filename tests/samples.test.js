const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const sampleDir = path.join(__dirname, "..", "docs", "samples");

test("sample artifacts are present for meeting demos", () => {
  const files = fs.readdirSync(sampleDir).sort();

  assert.ok(files.includes("README.md"));
  assert.ok(files.some((file) => file.startsWith("clinician-summary-")));
  assert.ok(files.some((file) => file.startsWith("reviewer-record-")));
  assert.ok(files.includes("reviewer-record-continue.md"));
  assert.ok(files.includes("reviewer-record-pause.md"));
  assert.ok(fs.existsSync(path.join(__dirname, "..", "docs", "workflow-rehearsal.md")));
});

test("sample artifacts keep safety boundaries explicit", () => {
  const files = fs.readdirSync(sampleDir).filter((file) => file.endsWith(".md"));
  const combined = files
    .map((file) => fs.readFileSync(path.join(sampleDir, file), "utf8"))
    .join("\n")
    .toLowerCase();

  assert.match(combined, /synthetic/);
  assert.match(combined, /does not diagnose/);
  assert.match(combined, /no treatment advice|does not diagnose, triage, or recommend treatment/);
  assert.doesNotMatch(combined, /likely infection/);
  assert.doesNotMatch(combined, /probable cancer/);
  assert.doesNotMatch(combined, /take medication/);
});

test("workflow rehearsal covers all synthetic cases without clinical advice", () => {
  const rehearsal = fs.readFileSync(path.join(__dirname, "..", "docs", "workflow-rehearsal.md"), "utf8");

  assert.match(rehearsal, /synthetic-frequency-older-adult/);
  assert.match(rehearsal, /synthetic-emptying-difficulty/);
  assert.match(rehearsal, /synthetic-incomplete-leakage/);
  assert.match(rehearsal, /Patient Flow Check/);
  assert.match(rehearsal, /Nurse Workflow Cues/);
  assert.match(rehearsal, /Reviewer Questions/);
  assert.match(rehearsal, /does not diagnose, triage, or recommend treatment/);
  assert.doesNotMatch(rehearsal.toLowerCase(), /likely infection/);
  assert.doesNotMatch(rehearsal.toLowerCase(), /probable cancer/);
  assert.doesNotMatch(rehearsal.toLowerCase(), /take medication/);
});
