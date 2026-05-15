const test = require("node:test");
const assert = require("node:assert/strict");
const {
  QUESTION_BANK,
  buildCurrentState,
  explainSelection,
  rankCandidateQuestions,
  retrieveCandidateQuestions
} = require("../../core/adaptive_questioning");

test("spec-shaped wrappers expose state, retrieval, ranking, and explanation", () => {
  const state = buildCurrentState({
    transcript: "I wake up several times at night to pee.",
    answers: {},
    askedQuestionIds: [],
    questionBank: QUESTION_BANK
  });

  const candidates = retrieveCandidateQuestions({
    currentStateText: state.currentStateText,
    detectedSymptoms: state.detectedSymptoms.map((item) => item.label),
    missingSlots: state.missingSlots,
    askedQuestionIds: state.askedQuestionIds,
    questionBank: QUESTION_BANK
  });

  const ranking = rankCandidateQuestions({
    transcript: "I wake up several times at night to pee.",
    answers: {},
    askedQuestionIds: [],
    questionBank: QUESTION_BANK
  });
  const explanation = explainSelection(ranking);

  assert.ok(candidates.some((candidate) => candidate.questionId === "compact_storage_symptoms"));
  assert.equal(ranking.selected.question.id, "compact_storage_symptoms");
  assert.ok(explanation.selectedReason);
  assert.ok(explanation.missingSlotsFilled.includes("compactStorageSymptoms"));
});

test("red flag terms increase safety-priority questions without diagnosis", () => {
  const result = rankCandidateQuestions({
    transcript: "It burns when I pee and I have fever and chills.",
    answers: { painBurning: "有" },
    askedQuestionIds: ["pain_burning"],
    questionBank: QUESTION_BANK
  });

  assert.equal(result.selected.question.id, "compact_pain_systemic");
  assert.ok(result.selected.components.safety >= 0.8);
  assert.doesNotMatch(result.selected.question.text, /diagnosis|treatment|antibiotic|cancer|infection likely/i);
});
