const test = require("node:test");
const assert = require("node:assert/strict");
const { QUESTION_BANK, rankQuestions } = require("../../core/adaptive_questioning");

test("adaptive ranking selects nocturia follow-up from night urination transcript", () => {
  const result = rankQuestions({
    transcript: "我最近晚上一直起來尿，而且有時候突然很急。",
    answers: {},
    askedQuestionIds: [],
    questionBank: QUESTION_BANK
  });

  assert.equal(result.selected.question.id, "nocturia_count");
  assert.ok(result.state.symptoms.includes("nocturia"));
  assert.ok(result.ranked[0].reasons.some((reason) => reason.includes("補足缺口")));
});

test("adaptive ranking does not repeat already answered question", () => {
  const result = rankQuestions({
    transcript: "我晚上一直起來尿。",
    answers: { nocturiaCount: "3 次以上" },
    askedQuestionIds: ["nocturia_count"],
    questionBank: QUESTION_BANK
  });

  assert.notEqual(result.selected.question.id, "nocturia_count");
});

test("adaptive ranking prioritizes safety-visible systemic symptoms", () => {
  const result = rankQuestions({
    transcript: "尿尿會刺痛，昨天晚上有發燒，也有點腰痛。",
    answers: { painBurning: "有" },
    askedQuestionIds: ["pain_burning"],
    questionBank: QUESTION_BANK
  });

  assert.equal(result.selected.question.id, "systemic_symptoms");
  assert.ok(result.selected.components.safety > 0.7);
});

test("adaptive ranking follows dysuria with governed pain or duration follow-up", () => {
  const result = rankQuestions({
    transcript: "尿尿會刺痛，而且有灼熱感。",
    answers: {},
    askedQuestionIds: [],
    questionBank: QUESTION_BANK
  });

  assert.ok(["pain_burning", "duration", "systemic_symptoms"].includes(result.selected.question.id));
  assert.ok(result.state.symptoms.includes("pain"));
  assert.ok(QUESTION_BANK.some((question) => question.id === result.selected.question.id));
});

test("adaptive ranking follows hematuria with pattern question after visible blood is answered", () => {
  const result = rankQuestions({
    transcript: "今天看到紅色尿，好像有血塊。",
    answers: { visibleBlood: "有" },
    askedQuestionIds: ["visible_blood"],
    questionBank: QUESTION_BANK
  });

  assert.equal(result.selected.question.id, "hematuria_pattern");
});

test("adaptive ranking asks clarification before vague lower-body pain retrieval", () => {
  const result = rankQuestions({
    transcript: "我下面會痛，但我說不太清楚是哪裡痛。",
    answers: {},
    askedQuestionIds: [],
    questionBank: QUESTION_BANK
  });

  assert.equal(result.selected.question.id, "clarify_pain_location");
  assert.equal(result.state.ambiguityStatus, "clarification_needed");
  assert.equal(result.state.ambiguity[0].type, "pain_location");
  assert.ok(result.ranked[1].reasons.some((reason) => reason.includes("先降權一般 retrieval")));
});

test("adaptive ranking asks symptom-type clarification before vague urinary retrieval", () => {
  const result = rankQuestions({
    transcript: "我尿尿怪怪的，怪怪不舒服，但不知道怎麼講。",
    answers: {},
    askedQuestionIds: [],
    questionBank: QUESTION_BANK
  });

  assert.equal(result.selected.question.id, "clarify_urinary_symptom_type");
  assert.equal(result.state.ambiguityStatus, "clarification_needed");
  assert.equal(result.state.ambiguity[0].type, "urinary_symptom_type");
});

test("adaptive question bank exposes governed metadata required for v2 explanation", () => {
  for (const question of QUESTION_BANK) {
    assert.ok(question.id);
    assert.ok(question.text);
    assert.ok(question.type);
    assert.ok(Array.isArray(question.asksFor));
    assert.ok(Array.isArray(question.symptoms));
    assert.ok(question.domain);
    assert.equal(typeof question.clinicalValue, "number");
    assert.equal(typeof question.ambiguityReduction, "number");
    assert.equal(typeof question.safetyPriority, "number");
    assert.equal(typeof question.redFlag, "boolean");
    assert.ok(Array.isArray(question.nextUsefulWhen));
    assert.ok(Array.isArray(question.avoidWhen));
  }
});

test("adaptive ranking resumes normal retrieval after ambiguity clarification is answered", () => {
  const result = rankQuestions({
    transcript: "我下面會痛，但我說不太清楚是哪裡痛。",
    answers: { painLocationClarification: "尿尿時尿道刺痛" },
    askedQuestionIds: ["clarify_pain_location"],
    questionBank: QUESTION_BANK
  });

  assert.notEqual(result.selected.question.id, "clarify_pain_location");
  assert.equal(result.state.ambiguityStatus, "clear_enough");
});
