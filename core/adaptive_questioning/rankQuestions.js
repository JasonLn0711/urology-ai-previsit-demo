(function () {
const facts = typeof require === "function" ? require("./extractFacts") : window.UrologyAdaptiveQuestioning;
const ambiguityEngine = typeof require === "function" ? require("./detectAmbiguity") : window.UrologyAdaptiveQuestioning;
const scoring = typeof require === "function" ? require("./scoring") : window.UrologyAdaptiveQuestioning;
const questionBankModule = typeof require === "function" ? require("./questionBank") : window.UrologyAdaptiveQuestioning;

const { extractFacts, hasAnswer } = facts;
const { detectAmbiguity } = ambiguityEngine;
const { DEFAULT_WEIGHTS, scoreQuestion } = scoring;
const { QUESTION_BANK } = questionBankModule;

const CLOSING_QUESTION_ID = "compact_closing_note";
const FINAL_QUESTION_INDEX = 11;

function isFreshIntake(transcript, answers = {}, askedQuestionIds = []) {
  return !String(transcript || "").trim() &&
    !askedQuestionIds.length &&
    !Object.keys(answers || {}).some((field) => hasAnswer(answers, field));
}

function promoteInitialQuestion(ranked) {
  const index = ranked.findIndex((item) => item.question.id === "compact_primary_concern");
  if (index <= 0) return ranked;
  return [
    ranked[index],
    ...ranked.slice(0, index),
    ...ranked.slice(index + 1)
  ];
}

function candidateQuestionPool(questionBank, asked) {
  const finalTurn = asked.size >= FINAL_QUESTION_INDEX;
  return questionBank.filter((question) => finalTurn
    ? question.id === CLOSING_QUESTION_ID
    : question.id !== CLOSING_QUESTION_ID);
}

function rankQuestions({
  transcript = "",
  answers = {},
  askedQuestionIds = [],
  questionBank = QUESTION_BANK,
  weights = DEFAULT_WEIGHTS
} = {}) {
  const asked = new Set(askedQuestionIds);
  const extracted = extractFacts({ transcript, answers, questionBank });
  const ambiguity = detectAmbiguity(transcript, answers);
  const activeAmbiguity = ambiguity.find((item) => item.active);
  const scoredQuestions = candidateQuestionPool(questionBank, asked).map((question) => {
    const scored = scoreQuestion({
      question,
      stateText: extracted.stateText,
      symptoms: extracted.symptoms,
      answers,
      asked,
      activeAmbiguity,
      weights
    });
    return {
      id: question.id,
      question,
      score: scored.score,
      components: scored.components,
      reasons: scored.reasons
    };
  }).sort((a, b) => b.score - a.score);
  const ranked = isFreshIntake(transcript, answers, askedQuestionIds)
    ? promoteInitialQuestion(scoredQuestions)
    : scoredQuestions;

  return {
    selected: ranked.find((item) => item.score > -0.5) || ranked[0] || null,
    ranked,
    state: {
      symptoms: extracted.symptoms,
      answeredFields: extracted.answeredFields,
      missingFields: extracted.missingFields,
      stateText: extracted.stateText,
      ambiguity,
      ambiguityStatus: activeAmbiguity ? "clarification_needed" : "clear_enough"
    }
  };
}

const api = { rankQuestions };

if (typeof module !== "undefined") {
  module.exports = api;
}

if (typeof window !== "undefined") {
  window.UrologyAdaptiveQuestioning = Object.assign({}, window.UrologyAdaptiveQuestioning || {}, api);
}
}());
