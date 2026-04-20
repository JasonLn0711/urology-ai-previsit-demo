#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { SYNTHETIC_CASES } = require("../app/shared/cases.js");
const { buildClinicianSummary, summaryToText } = require("../app/shared/summary.js");
const { buildReviewRecord, reviewRecordToText } = require("../app/shared/review.js");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "docs", "samples");

const reviewScenarios = [
  {
    id: "continue",
    title: "Continue Decision Example",
    inputs: {
      workflowPain: "clear",
      summaryUsefulness: "would-read",
      staffBurden: "acceptable",
      patientFit: "mixed",
      safetyBoundary: "acceptable",
      workflowSlot: "exists",
      existingProcess: "not-sufficient",
      decision: "continue",
      nextArtifact: "Revised question tree",
      reviewerRole: "Physician",
      mostUsefulLine: "Patient-reported pattern is concise enough to read before entering the room.",
      noisiestLine: "Noisy line not identified in this supporting review.",
      missingInformation: "Need clinic-specific preferred summary order.",
      unsafeWording: "None recorded.",
      expectedWorkflowSlot: "Nurse rooming or check-in.",
      staffBurdenConcern: "Keep medication review optional unless staff workflow supports it.",
      caseEvidence: "Frequency/nocturia and recurrent infection context were useful; leakage may need assisted completion.",
      reviewerNotes: "Clinician sees potential value if the question tree stays short and the summary remains review-only."
    }
  },
  {
    id: "narrow",
    title: "Narrow Decision Example",
    inputs: {
      workflowPain: "clear",
      summaryUsefulness: "would-read",
      staffBurden: "acceptable",
      patientFit: "assisted-only",
      safetyBoundary: "acceptable",
      workflowSlot: "exists",
      existingProcess: "not-sufficient",
      decision: "narrow",
      nextArtifact: "Assisted workflow test",
      reviewerRole: "Nurse",
      mostUsefulLine: "Completion support and missing fields are visible.",
      noisiestLine: "Self-filled flow may imply too much independence for older patients.",
      missingInformation: "Need which staff member owns clarification.",
      unsafeWording: "None recorded.",
      expectedWorkflowSlot: "Nurse-assisted rooming only.",
      staffBurdenConcern: "Clarifying missing fields may add work unless limited to selected patients.",
      caseEvidence: "Incomplete leakage intake showed assisted flow value; self-filled route should be narrowed.",
      reviewerNotes: "The workflow appears useful only when staff or family can help with completion."
    }
  },
  {
    id: "revise",
    title: "Revise Decision Example",
    inputs: {
      workflowPain: "clear",
      summaryUsefulness: "needs-rewrite",
      staffBurden: "unclear",
      patientFit: "mixed",
      safetyBoundary: "needs-wording",
      workflowSlot: "unclear",
      existingProcess: "unclear",
      decision: "revise",
      nextArtifact: "One-page summary mockup",
      reviewerRole: "Product / workflow reviewer",
      mostUsefulLine: "Priority review statements are visible without assigning urgency.",
      noisiestLine: "Summary format may be too paragraph-like for quick scanning.",
      missingInformation: "Need preferred one-page layout from clinician.",
      unsafeWording: "Review-only boundary should be repeated near priority statements.",
      expectedWorkflowSlot: "Unclear until summary format is simplified.",
      staffBurdenConcern: "Staff burden unknown without a clearer rooming workflow.",
      caseEvidence: "All four cases produced signal, but the summary format should be mocked as one page.",
      reviewerNotes: "The concept may be useful, but summary wording and workflow slot need another pass."
    }
  },
  {
    id: "pause",
    title: "Pause Decision Example",
    inputs: {
      workflowPain: "mixed",
      summaryUsefulness: "no",
      staffBurden: "unacceptable",
      patientFit: "unrealistic",
      safetyBoundary: "acceptable",
      workflowSlot: "none",
      existingProcess: "sufficient",
      decision: "pause",
      nextArtifact: "Pause note with rejected assumptions",
      reviewerRole: "Governance reviewer",
      mostUsefulLine: "No line was useful enough to justify workflow change.",
      noisiestLine: "The summary duplicates existing intake work.",
      missingInformation: "Need proof that existing forms fail before adding a new intake layer.",
      unsafeWording: "None recorded.",
      expectedWorkflowSlot: "No workflow slot.",
      staffBurdenConcern: "New intake layer adds unacceptable work.",
      caseEvidence: "Four-case run did not show enough workflow value.",
      reviewerNotes: "The current clinic flow may not have a practical slot for this MVP."
    }
  }
];

function frontMatter(fields) {
  return [
    "---",
    ...Object.entries(fields).map(([key, value]) => `${key}: ${JSON.stringify(value)}`),
    "---",
    ""
  ].join("\n");
}

function sampleWarning() {
  return [
    "> Synthetic sample only. Do not use with real patient data.",
    "> This artifact does not diagnose, triage, or recommend treatment.",
    ""
  ].join("\n");
}

function writeFile(filename, content) {
  fs.writeFileSync(path.join(outDir, filename), `${content.trimEnd()}\n`, "utf8");
}

function generateClinicianSamples(cases) {
  return cases.map((sampleCase) => {
    const filename = `clinician-summary-${sampleCase.id}.md`;
    const summary = buildClinicianSummary(sampleCase.answers);
    writeFile(
      filename,
      [
        frontMatter({
          type: "synthetic-clinician-summary",
          case_id: sampleCase.id,
          source: "app/shared/cases.js",
          status: "sample"
        }),
        `# ${sampleCase.label}`,
        "",
        sampleWarning(),
        "```text",
        summaryToText(summary),
        "```"
      ].join("\n")
    );
    return filename;
  });
}

function generateReviewSamples() {
  return reviewScenarios.map((scenario) => {
    const filename = `reviewer-record-${scenario.id}.md`;
    const record = buildReviewRecord(scenario.inputs);
    writeFile(
      filename,
      [
        frontMatter({
          type: "synthetic-reviewer-record",
          decision: record.decision,
          status: "sample"
        }),
        `# ${scenario.title}`,
        "",
        sampleWarning(),
        "```text",
        reviewRecordToText(record),
        "```"
      ].join("\n")
    );
    return filename;
  });
}

function generateIndex(clinicianFiles, reviewFiles) {
  writeFile(
    "README.md",
    [
      "# Synthetic Sample Outputs",
      "",
      "These files are generated from synthetic cases and reviewer presets.",
      "",
      "They are meeting artifacts for demonstrating what the MVP produces before any real patient-data use is considered.",
      "",
      "## Boundaries",
      "",
      "- Synthetic data only.",
      "- No diagnosis.",
      "- No triage.",
      "- No treatment advice.",
      "- Clinician review remains required.",
      "",
      "## Clinician Summary Samples",
      "",
      ...clinicianFiles.map((file) => `- [${file}](./${file})`),
      "",
      "## Reviewer Record Samples",
      "",
      ...reviewFiles.map((file) => `- [${file}](./${file})`),
      "",
      "## Regenerate",
      "",
      "```bash",
      "npm run samples",
      "```"
    ].join("\n")
  );
}

function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const clinicianFiles = generateClinicianSamples(SYNTHETIC_CASES);
  const reviewFiles = generateReviewSamples();
  generateIndex(clinicianFiles, reviewFiles);
  console.log(`Generated ${clinicianFiles.length + reviewFiles.length + 1} sample files in ${path.relative(root, outDir)}`);
}

main();
