const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..", "..");
const manifest = require("../../VERSION.json");
const runtimeVersion = require("../../core/version");
const packageJson = require("../../package.json");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("product version is synchronized across manifest, runtime, package, README, and changelog", () => {
  assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
  assert.equal(manifest.versionLabel, `v${manifest.version}`);
  assert.equal(packageJson.version, manifest.version);
  assert.equal(runtimeVersion.version, manifest.version);
  assert.equal(runtimeVersion.versionLabel, manifest.versionLabel);
  assert.ok(read("README.md").includes(manifest.versionLabel));
  assert.ok(read("docs/CHANGELOG.md").includes(`## ${manifest.versionLabel} - ${manifest.updatedAt}`));
});

test("version manifest preserves safety and verification traceability", () => {
  assert.ok(manifest.safetyBoundary.includes("no diagnosis"));
  assert.ok(manifest.safetyBoundary.includes("no treatment recommendation"));
  assert.ok(manifest.safetyBoundary.includes("no LLM runtime"));
  assert.ok(manifest.verificationCommands.includes("npm run version:check"));
  assert.ok(manifest.verificationCommands.includes("npm run demo:v2-freeze"));
});
