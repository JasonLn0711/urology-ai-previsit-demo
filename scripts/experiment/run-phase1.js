#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { SYNTHETIC_CASES } = require("../../data/synthetic_cases");
const { buildCanonicalRecord } = require("../../core/role_transform");
const { validateIntakeRecord } = require("../../data/schema/intake-record");

const root = path.resolve(__dirname, "..", "..");
const logDir = path.join(root, "experiments", "phase1", "logs");

function nowIso() {
  return new Date().toISOString();
}

function experimentLog(sampleCase) {
  const canonicalRecord = buildCanonicalRecord(sampleCase.answers);
  const validation = validateIntakeRecord(canonicalRecord);
  return {
    experiment: "phase1",
    case_id: sampleCase.id,
    created_at: nowIso(),
    raw_case: sampleCase,
    system_output: canonicalRecord,
    human_feedback: {
      reviewer_role: "",
      time_saved_minutes: null,
      missing_field_reduction: null,
      clinician_trust_score: null,
      notes: ""
    },
    failure_points: validation.valid ? [] : validation.errors,
    decision_state: "pending_human_review"
  };
}

fs.mkdirSync(logDir, { recursive: true });

const written = SYNTHETIC_CASES.map((sampleCase) => {
  const filename = `${sampleCase.id}.json`;
  fs.writeFileSync(
    path.join(logDir, filename),
    `${JSON.stringify(experimentLog(sampleCase), null, 2)}\n`,
    "utf8"
  );
  return filename;
});

console.log(`Wrote ${written.length} Phase 1 experiment logs to ${path.relative(root, logDir)}`);
console.log("Next: fill human_feedback, update experiments/phase1/scorecard.md, then write decision-memo.md.");
