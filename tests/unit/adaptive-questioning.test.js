const test = require("node:test");
const assert = require("node:assert/strict");
const {
  QUESTION_BANK,
  LEGACY_QUESTION_BANK,
  COMPACT_PREVISIT_QUESTION_BANK,
  MAX_PREVISIT_QUESTIONS,
  rankQuestions
} = require("../../core/adaptive_questioning");

test("adaptive ranking selects nocturia follow-up from night urination transcript", () => {
  const result = rankQuestions({
    transcript: "我最近晚上一直起來尿，而且有時候突然很急。",
    answers: {},
    askedQuestionIds: [],
    questionBank: QUESTION_BANK
  });

  assert.equal(result.selected.question.id, "compact_storage_symptoms");
  assert.ok(result.state.symptoms.includes("nocturia"));
  assert.ok(result.ranked[0].reasons.some((reason) => reason.includes("補足缺口")));
});

test("adaptive ranking starts fresh intake on the primary concern question", () => {
  const result = rankQuestions({
    transcript: "",
    answers: {},
    askedQuestionIds: [],
    questionBank: QUESTION_BANK
  });

  assert.equal(result.selected.question.id, "compact_primary_concern");
  assert.equal(result.ranked[0].question.id, "compact_primary_concern");
});

test("adaptive ranking does not repeat already answered question", () => {
  const result = rankQuestions({
    transcript: "我晚上一直起來尿。",
    answers: { compactStorageSymptoms: ["晚上睡著後會起床尿尿"] },
    askedQuestionIds: ["compact_storage_symptoms"],
    questionBank: QUESTION_BANK
  });

  assert.notEqual(result.selected.question.id, "compact_storage_symptoms");
});

test("adaptive ranking prioritizes safety-visible systemic symptoms", () => {
  const result = rankQuestions({
    transcript: "尿尿會刺痛，昨天晚上有發燒，也有點腰痛。",
    answers: { painBurning: "有" },
    askedQuestionIds: ["pain_burning"],
    questionBank: QUESTION_BANK
  });

  assert.equal(result.selected.question.id, "compact_pain_systemic");
  assert.ok(result.selected.components.safety > 0.8);
});

test("adaptive ranking follows dysuria with governed pain or duration follow-up", () => {
  const result = rankQuestions({
    transcript: "尿尿會刺痛，而且有灼熱感。",
    answers: {},
    askedQuestionIds: [],
    questionBank: QUESTION_BANK
  });

  assert.ok(["compact_pain_systemic", "compact_duration_bother"].includes(result.selected.question.id));
  assert.ok(result.state.symptoms.includes("pain"));
  assert.ok(QUESTION_BANK.some((question) => question.id === result.selected.question.id));
});

test("adaptive ranking follows hematuria with compact visible-blood question", () => {
  const result = rankQuestions({
    transcript: "今天看到紅色尿，好像有血塊。",
    answers: {},
    askedQuestionIds: [],
    questionBank: QUESTION_BANK
  });

  assert.equal(result.selected.question.id, "compact_visible_blood");
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

test("adaptive question banks expose governed metadata and preserve legacy bank", () => {
  assert.equal(QUESTION_BANK.length, MAX_PREVISIT_QUESTIONS);
  assert.equal(COMPACT_PREVISIT_QUESTION_BANK.length, MAX_PREVISIT_QUESTIONS);
  assert.ok(LEGACY_QUESTION_BANK.length >= 40);
  assert.ok(LEGACY_QUESTION_BANK.some((question) => question.id === "nocturia_count"));
  assert.ok(LEGACY_QUESTION_BANK.some((question) => question.id === "visible_blood"));

  for (const question of QUESTION_BANK.concat(LEGACY_QUESTION_BANK)) {
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
    assert.ok(question.answerType);
    assert.ok(Array.isArray(question.options));
    assert.ok(question.explanationTemplate);
  }
});

test("adaptive ranking supports English demo cases from the v2 spec", () => {
  const nocturia = rankQuestions({
    transcript: "I wake up many times at night to pee.",
    answers: {},
    askedQuestionIds: [],
    questionBank: QUESTION_BANK
  });
  assert.ok(["compact_storage_symptoms", "compact_duration_bother"].includes(nocturia.selected.question.id));

  const dysuria = rankQuestions({
    transcript: "It burns when I pee.",
    answers: {},
    askedQuestionIds: [],
    questionBank: QUESTION_BANK
  });
  assert.ok(["compact_pain_systemic", "compact_duration_bother"].includes(dysuria.selected.question.id));

  const vaguePain = rankQuestions({
    transcript: "I feel pain down there.",
    answers: {},
    askedQuestionIds: [],
    questionBank: QUESTION_BANK
  });
  assert.equal(vaguePain.selected.question.type, "clarification");
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

test("compact previsit bank can finish within the 12-question design cap", () => {
  const transcript = "我最近晚上起來尿，尿尿刺痛，有時候漏尿，也看到紅色尿，尿流變弱。";
  const answers = {};
  const askedQuestionIds = [];

  for (let turn = 0; turn < MAX_PREVISIT_QUESTIONS; turn += 1) {
    const result = rankQuestions({ transcript, answers, askedQuestionIds, questionBank: QUESTION_BANK });
    const question = result.selected.question;
    if (askedQuestionIds.includes(question.id)) break;
    askedQuestionIds.push(question.id);
    answers[question.asksFor[0]] = question.answerType === "multi_choice"
      ? [question.options[0]]
      : question.options[0] || "補充內容";
  }

  assert.ok(askedQuestionIds.length <= MAX_PREVISIT_QUESTIONS);
  assert.equal(new Set(askedQuestionIds).size, askedQuestionIds.length);
  assert.ok(askedQuestionIds.includes("compact_storage_symptoms"));
  assert.ok(askedQuestionIds.includes("compact_pain_systemic"));
  assert.ok(askedQuestionIds.includes("compact_visible_blood"));
});

test("compact closing note is locked to the twelfth question", () => {
  const nonClosingQuestionIds = QUESTION_BANK
    .filter((question) => question.id !== "compact_closing_note")
    .map((question) => question.id);
  const answers = {
    compactPrimaryConcern: ["頻尿、夜尿或急尿"],
    compactDurationBother: ["1 到 7 天"],
    compactStorageSymptoms: ["晚上睡著後會起床尿尿"],
    compactLeakagePattern: ["咳嗽、大笑或用力時會漏尿"],
    compactVoidingSymptoms: ["尿流變細或變弱"],
    compactPainSystemic: ["尿尿會刺痛或灼熱"],
    compactVisibleBlood: ["粉紅或紅色尿"],
    compactBackgroundMedication: ["可以提供藥袋、藥單或藥物照片"]
  };

  const beforeFinalTurn = rankQuestions({
    transcript: "我還有其他事情想補充給醫師知道。",
    answers,
    askedQuestionIds: nonClosingQuestionIds.slice(0, 10),
    questionBank: QUESTION_BANK
  });
  const earlyClosing = beforeFinalTurn.ranked.find((item) => item.question.id === "compact_closing_note");

  assert.notEqual(beforeFinalTurn.selected.question.id, "compact_closing_note");
  assert.ok(earlyClosing.score <= -0.5);
  assert.ok(earlyClosing.reasons.some((reason) => reason.includes("第 12 題固定結尾題")));

  const finalTurn = rankQuestions({
    transcript: "我還有其他事情想補充給醫師知道。",
    answers,
    askedQuestionIds: nonClosingQuestionIds,
    questionBank: QUESTION_BANK
  });

  assert.equal(finalTurn.selected.question.id, "compact_closing_note");
});
