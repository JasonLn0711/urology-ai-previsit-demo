const test = require("node:test");
const assert = require("node:assert/strict");
const { QUESTION_BANK, rankQuestions } = require("../../core/adaptive_questioning");

const forbidden = /you may have|you have|diagnos|treat|take medication|antibiotic|cancer|infection likely|可能得了|診斷為|建議吃藥|需要做檢查/i;

test("all selected questions come from the governed question bank", () => {
  const bankIds = new Set(QUESTION_BANK.map((question) => question.id));
  const cases = [
    "I wake up many times at night to pee.",
    "It burns when I pee.",
    "I feel pain down there.",
    "I have blood in my urine."
  ];

  for (const transcript of cases) {
    const result = rankQuestions({ transcript, questionBank: QUESTION_BANK });
    assert.ok(bankIds.has(result.selected.question.id));
  }
});

test("question bank does not contain diagnosis or treatment recommendations", () => {
  for (const question of QUESTION_BANK) {
    const text = [
      question.text,
      question.value,
      question.explanation,
      question.explanationTemplate,
      ...(question.nextUsefulWhen || []),
      ...(question.avoidWhen || [])
    ].join(" ");
    assert.doesNotMatch(text, forbidden, question.id);
  }
});
