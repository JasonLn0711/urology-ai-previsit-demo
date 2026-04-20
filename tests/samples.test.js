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
