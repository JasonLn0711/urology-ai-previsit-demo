#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { SYNTHETIC_CASES } = require("../../data/synthetic_cases");
const { buildClinicianSummary } = require("../../core/summary");

const root = path.resolve(__dirname, "..", "..");
const outPath = path.join(root, "docs", "workflow", "rehearsal.md");

function lines(items, emptyLabel = "None recorded.") {
  return items && items.length
    ? items.map((item) => `- ${item}`).join("\n")
    : `- ${emptyLabel}`;
}

function caseSection(sampleCase) {
  const summary = buildClinicianSummary(sampleCase.answers);
  return [
    `## ${sampleCase.id}`,
    "",
    `Label: ${sampleCase.label}`,
    "",
    "### Expected Output",
    "",
    `- Completion: ${summary.completionStatus.label}`,
    `- Active modules: ${summary.activeModules.join(", ")}`,
    `- Pattern: ${summary.symptomPattern}`,
    "",
    "### Nurse Check",
    "",
    lines(summary.nurseCues),
    "",
    "### Clinician Review Flags",
    "",
    lines(summary.clinicianReviewFlags),
    "",
    "### Missing Fields",
    "",
    lines(summary.missingInformation),
    ""
  ].join("\n");
}

function generate() {
  return [
    "# Workflow Rehearsal",
    "",
    "> Generated from `data/synthetic_cases` and `core/summary`.",
    "> Synthetic data only. This rehearsal does not diagnose, triage, or recommend treatment.",
    "",
    "Use this as a quick before-demo check that the role surfaces read the same canonical record while showing different role views.",
    "",
    ...SYNTHETIC_CASES.map(caseSection),
    "## Stop Rules",
    "",
    "- Stop and revise if any page suggests diagnosis, triage, or treatment.",
    "- Stop and revise if missing fields disappear from view.",
    "- Stop and revise if patient/family, nurse, clinician, and reviewer views disagree about the same canonical record.",
    "- Stop and revise if field-level attribution is absent from clinician-facing output.",
    ""
  ].join("\n");
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${generate().trimEnd()}\n`, "utf8");
console.log(`Generated ${path.relative(root, outPath)}`);
