#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const level = process.argv[2];
const summary = process.argv.slice(3).join(" ").trim();

const LEVELS = new Set(["major", "minor", "patch"]);

function relPath(relativePath) {
  return path.join(root, relativePath);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(relPath(relativePath), "utf8"));
}

function writeJson(relativePath, value) {
  fs.writeFileSync(relPath(relativePath), `${JSON.stringify(value, null, 2)}\n`);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function bump(version, bumpLevel) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!match) throw new Error(`Invalid semantic version: ${version}`);
  let [, major, minor, patch] = match.map(Number);
  if (bumpLevel === "major") {
    major += 1;
    minor = 0;
    patch = 0;
  } else if (bumpLevel === "minor") {
    minor += 1;
    patch = 0;
  } else {
    patch += 1;
  }
  return `${major}.${minor}.${patch}`;
}

function renderCoreVersion(manifest) {
  return `(function initUroPrevisitVersion(globalScope) {
  const VERSION = ${JSON.stringify(manifest, null, 4).replace(/^/gm, "  ").trimStart()};

  if (typeof module !== "undefined" && module.exports) {
    module.exports = VERSION;
  }

  if (globalScope) {
    globalScope.UroPrevisitVersion = VERSION;
  }
})(typeof window !== "undefined" ? window : globalThis);
`;
}

function updateChangelog(manifest, bumpLevel, changeSummary) {
  const changelogPath = relPath("docs/CHANGELOG.md");
  const changelog = fs.readFileSync(changelogPath, "utf8");
  const heading = `## ${manifest.versionLabel} - ${manifest.updatedAt}`;
  if (changelog.includes(heading)) return;

  const entry = `${heading}

Stage: \`${manifest.stage}\`

### Changed

- ${changeSummary}

### Versioning

- Bump type: \`${bumpLevel}\`
- Verification command to run before freeze or commit: \`npm run version:check\`

`;

  fs.writeFileSync(changelogPath, changelog.replace("\n## ", `\n${entry}## `));
}

function main() {
  if (!LEVELS.has(level) || !summary) {
    console.error("Usage: npm run version:bump -- <major|minor|patch> \"Short change summary\"");
    process.exit(1);
  }

  const manifest = readJson("VERSION.json");
  const packageJson = readJson("package.json");
  const nextVersion = bump(manifest.version, level);
  const date = today();

  manifest.version = nextVersion;
  manifest.versionLabel = `v${nextVersion}`;
  manifest.updatedAt = date;
  manifest.summary = summary;

  packageJson.version = nextVersion;

  writeJson("VERSION.json", manifest);
  writeJson("package.json", packageJson);
  fs.writeFileSync(relPath("core/version/index.js"), renderCoreVersion(manifest));
  updateChangelog(manifest, level, summary);

  console.log(`Updated product version to ${manifest.versionLabel}`);
}

main();
