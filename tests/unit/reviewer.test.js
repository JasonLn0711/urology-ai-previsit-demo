const test = require("node:test");
const assert = require("node:assert/strict");
const {
  buildReviewRecord,
  reviewRecordToText,
  suggestedDecision
} = require("../../core/role_transform");

test("reviewer decision model uses continue, revise, stop", () => {
  assert.equal(suggestedDecision({
    workflowPain: "clear",
    summaryUsefulness: "would-read",
    staffBurden: "acceptable",
    patientFit: "mixed",
    safetyBoundary: "acceptable",
    workflowSlot: "exists",
    existingProcess: "not-sufficient"
  }), "continue");

  assert.equal(suggestedDecision({ safetyBoundary: "unacceptable" }), "stop");
  assert.equal(suggestedDecision({ workflowPain: "mixed", workflowSlot: "unclear" }), "revise");
});

test("review record keeps safety boundary and avoids clinical advice", () => {
  const record = buildReviewRecord({
    decision: "continue",
    reviewerRole: "Physician",
    workflowPain: "clear",
    summaryUsefulness: "would-read",
    staffBurden: "acceptable",
    patientFit: "mixed",
    safetyBoundary: "acceptable",
    workflowSlot: "exists",
    existingProcess: "not-sufficient",
    caseEvidence: "Summary may save repeated questioning."
  });
  const text = reviewRecordToText(record).toLowerCase();

  assert.equal(record.decision, "continue");
  assert.match(text, /no diagnosis/);
  assert.match(text, /no treatment advice/);
  assert.doesNotMatch(text, /likely infection|take medication/);
});
