const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.join(__dirname, "..");

function runArtifactCheck(artifact) {
  return spawnSync(process.execPath, ["scripts/check-selected-artifact.js"], {
    cwd: root,
    env: Object.assign({}, process.env, {
      UROLOGY_PREVISIT_CAPTURE: path.join("tests", "fixtures", "review-closeout-complete.md"),
      UROLOGY_PREVISIT_ARTIFACT: artifact
    }),
    encoding: "utf8"
  });
}

test("selected artifact check passes for a completed evidence-backed artifact", () => {
  const result = runArtifactCheck(path.join("tests", "fixtures", "selected-artifact-complete-summary.md"));

  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /Selected artifact check passed:/);
  assert.match(result.stdout, /artifact has no reviewer-evidence placeholders/);
});

test("selected artifact check rejects an unfilled starter", () => {
  const result = runArtifactCheck(path.join(
    "docs",
    "reviews",
    "2026-04-23-urology-review",
    "artifact-starters",
    "one-page-summary-mockup.md"
  ));

  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /FAIL artifact has no reviewer-evidence placeholders/);
  assert.match(result.stderr, /Selected artifact check failed:/);
});
