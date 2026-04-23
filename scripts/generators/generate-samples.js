#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { SYNTHETIC_CASES } = require("../../data/synthetic_cases");
const { summaryToText } = require("../../core/summary");
const { buildCanonicalRecord } = require("../../core/role_transform");

const root = path.resolve(__dirname, "..", "..");
const outDir = path.join(root, "experiments", "phase1", "cases");

function write(filename, content) {
  fs.writeFileSync(path.join(outDir, filename), `${content.trimEnd()}\n`, "utf8");
}

fs.mkdirSync(outDir, { recursive: true });

const files = SYNTHETIC_CASES.map((sampleCase) => {
  const record = buildCanonicalRecord(sampleCase.answers);
  const filename = `${sampleCase.id}.md`;
  write(filename, [
    `# ${sampleCase.label}`,
    "",
    "Synthetic case packet for Phase 1 evidence review.",
    "",
    "## System Output",
    "",
    "```text",
    summaryToText(record.derived_summary),
    "```",
    "",
    "## Missing Fields",
    "",
    record.missing_fields.length
      ? record.missing_fields.map((item) => `- ${item.field}: ${item.label}`).join("\n")
      : "- None",
    "",
    "## Attribution",
    "",
    record.attribution.field_sources.map((item) => `- ${item.field}: ${item.label}`).join("\n")
  ].join("\n"));
  return filename;
});

write("README.md", [
  "# Phase 1 Case Packets",
  "",
  "Generated from `data/synthetic_cases` with `core/role_transform.buildCanonicalRecord`.",
  "",
  ...files.map((file) => `- [${file}](./${file})`)
].join("\n"));

console.log(`Generated ${files.length + 1} files in ${path.relative(root, outDir)}`);
