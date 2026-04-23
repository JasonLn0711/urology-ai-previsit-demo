#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { SYNTHETIC_CASES } = require("../app/shared/cases.js");
const { buildClinicianSummary } = require("../app/shared/summary.js");

const root = path.resolve(__dirname, "..");
const outPath = path.join(root, "docs", "workflow-rehearsal.md");

function lines(items, emptyLabel = "None recorded.") {
  return items && items.length
    ? items.map((item) => `- ${item}`).join("\n")
    : `- ${emptyLabel}`;
}

function activeModules(summary) {
  return summary.activeModules.join(", ");
}

function scenarioPurpose(summary) {
  if (summary.activeModules.includes("storage")) {
    return "Checks whether frequency/nocturia details stay short while still surfacing bladder diary and medication-review cues.";
  }
  if (summary.activeModules.includes("voiding")) {
    return "Checks whether voiding and emptying symptoms are visible without the system assigning urgency, diagnosis, or treatment.";
  }
  if (summary.activeModules.includes("hematuria")) {
    return "Checks whether visible-blood or occult-blood context stays descriptive without cancer inference, reassurance, or automatic exam ordering.";
  }
  if (summary.activeModules.includes("leakage")) {
    return "Checks whether incomplete leakage intake keeps missing information visible and preserves staff-support needs.";
  }
  return "Checks whether a core-only concern can pass through without unnecessary module expansion.";
}

function patientWalkthrough(sampleCase, summary) {
  return [
    "1. Load this case from the synthetic scenario rail.",
    `2. Confirm source and main concern: ${summary.intakeMode}; ${summary.chiefConcern}.`,
    "3. Confirm the patient/family page has no nurse, clinician, visit-packet, or reviewer links.",
    `4. Confirm active conditional modules: ${activeModules(summary)}.`,
    `5. Open the nurse workbench and confirm status: ${summary.completionStatus.label}.`,
    "6. Compare the clinician summary against the patient-reported pattern and source notes."
  ].join("\n");
}

function reviewerQuestions(summary) {
  const questions = [
    "Would a clinician read this summary before entering the room?",
    "Which line is clinically useful and which line is noise?",
    "Does any wording imply diagnosis, triage, or treatment?",
    "Would nursing staff know what, if anything, to clarify before the clinician enters?"
  ];

  if (summary.completionStatus.missingCount > 0) {
    questions.push("Are the missing fields worth repairing, or should they remain for clinician review?");
  }

  if (summary.activeModules.includes("storage")) {
    questions.push("Is the bladder diary cue useful in this clinic workflow?");
  }

  if (summary.activeModules.includes("leakage")) {
    questions.push("Does the containment-support cue help staff, or does it add unnecessary burden?");
  }

  if (summary.activeModules.includes("voiding")) {
    questions.push("Does the voiding/emptying wording stay neutral enough for previsit collection?");
  }

  return questions;
}

function caseSection(sampleCase) {
  const summary = buildClinicianSummary(sampleCase.answers);
  return [
    `## ${sampleCase.label}`,
    "",
    `Case id: \`${sampleCase.id}\``,
    "",
    `Purpose: ${scenarioPurpose(summary)}`,
    "",
    "### Patient Flow Check",
    "",
    patientWalkthrough(sampleCase, summary),
    "",
    "### Expected Summary State",
    "",
    `- Completeness: ${summary.completionStatus.label}`,
    `- Active modules: ${activeModules(summary)}`,
    `- Duration / bother: ${summary.durationBother}`,
    `- Patient-reported pattern: ${summary.symptomPattern}`,
    "",
    "### Priority Review Statements",
    "",
    lines(summary.clinicianReviewFlags),
    "",
    "### Nurse Workflow Cues",
    "",
    lines(summary.nurseCues),
    "",
    "### Missing Information",
    "",
    lines(summary.missingInformation),
    "",
    "### Clinician Summary Check",
    "",
    `- Medication/context: ${summary.medicines}`,
    `- Patient note: ${summary.patientNote}`,
    `- Handoff: ${summary.handoffNote}`,
    "",
    "### Reviewer Questions",
    "",
    lines(reviewerQuestions(summary)),
    ""
  ].join("\n");
}

function generate() {
  return [
    "# MVP Workflow Rehearsal",
    "",
    "> Generated from `app/shared/cases.js` and `app/shared/summary.js`.",
    "> Synthetic data only. This rehearsal does not diagnose, triage, or recommend treatment.",
    "",
    "## Purpose",
    "",
    "Use this document before a meeting or browser walkthrough to check whether the MVP behaves like a bounded previsit workflow instead of a clinical decision system.",
    "",
    "The rehearsal asks four first-principles questions for each case:",
    "",
    "- Can the patient or helper understand what to answer?",
    "- Does the patient/family UI avoid staff-only screens and language?",
    "- Can nursing staff see what may need support or clarification?",
    "- Can the clinician scan the summary without being misled?",
    "- Does the demo keep missing information visible instead of hiding uncertainty?",
    "",
    "## How To Use",
    "",
    "1. Run `npm run rehearsal` after editing shared cases or summary logic.",
    "2. Open `http://localhost:4173/app/patient-demo/`.",
    "3. Load each synthetic case in the same order as below.",
    "4. Confirm patient/family isolation, then inspect `app/nurse-workbench/`, `app/clinician-summary/`, and `app/visit-packet/`.",
    "5. Compare the browser state with this rehearsal document.",
    "6. Record reviewer feedback in the reviewer workbench.",
    "",
    ...SYNTHETIC_CASES.map(caseSection),
    "## Stop Rules",
    "",
    "- Stop and revise if any page suggests diagnosis, triage, or treatment.",
    "- Stop and revise if missing fields disappear from view.",
    "- Stop and revise if the patient/family page exposes nurse, clinician, visit-packet, or reviewer surfaces.",
    "- Stop and revise if family observations and patient self-reports are indistinguishable.",
    "- Stop and revise if a `Not sure` answer opens large follow-up modules without a clear main concern.",
    "- Stop and revise if nurse cues require action the clinic cannot realistically perform.",
    ""
  ].join("\n");
}

function main() {
  fs.writeFileSync(outPath, `${generate().trimEnd()}\n`, "utf8");
  console.log(`Generated ${path.relative(root, outPath)}`);
}

main();
