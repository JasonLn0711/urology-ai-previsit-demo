#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..", "..");
const checks = [];

const VERSION_FILES = new Set([
  "VERSION.json",
  "core/version/index.js",
  "docs/CHANGELOG.md",
  "package.json"
]);

const MEANINGFUL_PREFIXES = [
  "README.md",
  "VERSION.json",
  "app/",
  "core/",
  "data/",
  "docs/",
  "experiments/",
  "package.json",
  "scripts/",
  "tests/"
];

const IGNORED_PREFIXES = [
  "experiments/phase1/logs/",
  "test-results/",
  ".local/"
];

function relPath(relativePath) {
  return path.join(root, relativePath);
}

function read(relativePath) {
  return fs.readFileSync(relPath(relativePath), "utf8");
}

function record(name, passed, detail = "") {
  checks.push({ name, passed: Boolean(passed), detail });
}

function parseJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function runGit(args) {
  const result = spawnSync("git", args, {
    cwd: root,
    encoding: "utf8"
  });
  if (result.status !== 0) return "";
  return result.stdout;
}

function semverParts(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  return match ? match.slice(1).map(Number) : null;
}

function getChangedFiles() {
  const porcelain = runGit(["status", "--porcelain"]);
  return porcelain
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => line.slice(3).trim())
    .map((file) => file.includes(" -> ") ? file.split(" -> ").pop() : file);
}

function isMeaningful(file) {
  if (!file) return false;
  if (IGNORED_PREFIXES.some((prefix) => file.startsWith(prefix))) return false;
  return MEANINGFUL_PREFIXES.some((prefix) => file === prefix || file.startsWith(prefix));
}

function checkVersionAgreement() {
  const manifest = parseJson("VERSION.json");
  const packageJson = parseJson("package.json");
  const browserVersion = require("../../core/version");
  const changelog = read("docs/CHANGELOG.md");
  const readme = read("README.md");
  const policy = read("docs/versioning-policy.md");

  record("VERSION.json uses semantic version", Boolean(semverParts(manifest.version)), manifest.version);
  record("VERSION.json versionLabel matches version", manifest.versionLabel === `v${manifest.version}`, manifest.versionLabel);
  record("package.json matches VERSION.json", packageJson.version === manifest.version, packageJson.version);
  record("browser version matches VERSION.json", browserVersion.version === manifest.version, browserVersion.version);
  record("browser version label matches VERSION.json", browserVersion.versionLabel === manifest.versionLabel, browserVersion.versionLabel);
  record("CHANGELOG has current version heading", changelog.includes(`## ${manifest.versionLabel} - ${manifest.updatedAt}`));
  record("README exposes current version", readme.includes(manifest.versionLabel));
  record("versioning policy exists", /## Bump Rules/.test(policy));
  record("verification commands include version check", manifest.verificationCommands.includes("npm run version:check"));
}

function checkWorkingTreeVersionBump() {
  const changedFiles = getChangedFiles().filter(isMeaningful);
  const nonVersionChanges = changedFiles.filter((file) => !VERSION_FILES.has(file));
  const versionChanges = changedFiles.filter((file) => VERSION_FILES.has(file));

  if (!nonVersionChanges.length) {
    record("working tree has no non-version meaningful changes", true);
    return;
  }

  record(
    "meaningful changes include a version update",
    versionChanges.length > 0,
    `changed=${changedFiles.join(", ")}`
  );
}

function printResults() {
  for (const item of checks) {
    const prefix = item.passed ? "ok" : "FAIL";
    const detail = item.detail ? ` - ${item.detail}` : "";
    console.log(`${prefix} ${item.name}${detail}`);
  }
  const failed = checks.filter((item) => !item.passed);
  if (failed.length) {
    console.error(`\nVersion check failed: ${failed.length}/${checks.length} checks failed.`);
    process.exit(1);
  }
  console.log(`\nVersion check passed: ${checks.length}/${checks.length} checks passed.`);
}

checkVersionAgreement();
checkWorkingTreeVersionBump();
printResults();
