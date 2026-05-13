const test = require("node:test");
const assert = require("node:assert/strict");
const { QUESTION_BANK, rankQuestions } = require("../../core/adaptive_questioning");

test("vague English pain selects governed clarification question", () => {
  const result = rankQuestions({
    transcript: "I feel pain around my private area.",
    answers: {},
    askedQuestionIds: [],
    questionBank: QUESTION_BANK
  });

  assert.equal(result.selected.question.id, "clarify_pain_location");
  assert.equal(result.selected.question.type, "clarification");
  assert.equal(result.state.ambiguityStatus, "clarification_needed");
});

test("not sure urinary wording selects symptom-type clarification", () => {
  const result = rankQuestions({
    transcript: "Urination feels weird and I am not sure how to explain it.",
    answers: {},
    askedQuestionIds: [],
    questionBank: QUESTION_BANK
  });

  assert.equal(result.selected.question.id, "clarify_urinary_symptom_type");
  assert.equal(result.selected.question.type, "clarification");
});

test("conflicting pain statements select conflict clarification", () => {
  const result = rankQuestions({
    transcript: "It burns when I pee.",
    answers: { painBurning: "沒有" },
    askedQuestionIds: ["pain_burning"],
    questionBank: QUESTION_BANK
  });

  assert.equal(result.selected.question.id, "clarify_pain_burning_conflict");
  assert.equal(result.selected.question.type, "clarification");
});
