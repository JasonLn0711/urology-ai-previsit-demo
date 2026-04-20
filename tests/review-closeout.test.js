const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.join(__dirname, "..");

function runCloseout(fixture) {
  return spawnSync(process.execPath, ["scripts/check-review-closeout.js"], {
    cwd: root,
    env: Object.assign({}, process.env, {
      UROLOGY_PREVISIT_CAPTURE: path.join("tests", "fixtures", fixture)
    }),
    encoding: "utf8"
  });
}

test("post-review closeout passes when completed capture is internally consistent", () => {
  const result = runCloseout("review-closeout-complete.md");

  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /Review closeout passed:/);
  assert.match(result.stdout, /selected artifact matches decision/);
});

test("post-review closeout rejects an artifact that does not match the decision", () => {
  const result = runCloseout("review-closeout-mismatched-artifact.md");

  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /FAIL selected artifact matches decision/);
  assert.match(result.stderr, /Review closeout failed:/);
});
