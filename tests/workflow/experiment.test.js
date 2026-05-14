const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { validateIntakeRecord } = require("../../data/schema/intake-record");

const root = path.resolve(__dirname, "..", "..");

test("phase1 experiment logs capture raw case, output, feedback, and failures", () => {
  const result = spawnSync(process.execPath, ["scripts/experiment/run-phase1.js"], {
    cwd: root,
    encoding: "utf8"
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);

  const logDir = path.join(root, "experiments", "phase1", "logs");
  const files = fs.readdirSync(logDir).filter((file) => file.endsWith(".json"));
  assert.ok(files.length >= 5);

  for (const file of files) {
    const log = JSON.parse(fs.readFileSync(path.join(logDir, file), "utf8"));
    assert.ok(log.raw_case.answers);
    assert.ok(log.system_output);
    assert.ok(log.human_feedback);
    assert.ok(Array.isArray(log.failure_points));
    const validation = validateIntakeRecord(log.system_output);
    assert.equal(validation.valid, true, validation.errors.join("; "));
  }
});

test("phase1 check script validates experiment framework", () => {
  const result = spawnSync(process.execPath, ["scripts/experiment/check-phase1.js"], {
    cwd: root,
    encoding: "utf8"
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
