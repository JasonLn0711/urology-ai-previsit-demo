const test = require("node:test");
const assert = require("node:assert/strict");
const {
  blockingSignals,
  buildReviewRecord,
  reviewRecordToText,
  suggestedDecision
} = require("../app/shared/review.js");

test("suggests continue when workflow value and safety are clear", () => {
  const decision = suggestedDecision({
    workflowPain: "clear",
    summaryUsefulness: "would-read",
    staffBurden: "acceptable",
    patientFit: "mixed",
    safetyBoundary: "acceptable",
    workflowSlot: "exists",
    existingProcess: "not-sufficient"
  });

  assert.equal(decision, "continue");
});

test("pauses when safety boundary is unacceptable", () => {
  const blockers = blockingSignals({
    safetyBoundary: "unacceptable",
    workflowSlot: "exists"
  });

  assert.equal(suggestedDecision({ safetyBoundary: "unacceptable" }), "pause");
  assert.ok(blockers.includes("Safety boundary is unacceptable."));
});

test("narrow is suggested for assisted-only workflow value", () => {
  const decision = suggestedDecision({
    workflowPain: "clear",
    summaryUsefulness: "would-read",
    staffBurden: "acceptable",
    patientFit: "assisted-only",
    safetyBoundary: "acceptable",
    workflowSlot: "exists",
    existingProcess: "not-sufficient"
  });

  assert.equal(decision, "narrow");
});

test("builds a reviewer record without clinical advice", () => {
  const record = buildReviewRecord({
    workflowPain: "clear",
    summaryUsefulness: "would-read",
    staffBurden: "acceptable",
    patientFit: "mixed",
    safetyBoundary: "acceptable",
    workflowSlot: "exists",
    existingProcess: "not-sufficient",
    decision: "continue",
    nextArtifact: "Revised question tree",
    reviewerNotes: "Summary may save repeated questioning."
  });
  const text = reviewRecordToText(record).toLowerCase();

  assert.equal(record.decision, "continue");
  assert.match(text, /no diagnosis/);
  assert.match(text, /no treatment advice/);
  assert.doesNotMatch(text, /take medication/);
  assert.doesNotMatch(text, /likely infection/);
});
