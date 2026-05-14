(function () {
const facts = typeof require === "function" ? require("./extractFacts") : window.UrologyAdaptiveQuestioning;
const ambiguity = typeof require === "function" ? require("./detectAmbiguity") : window.UrologyAdaptiveQuestioning;
const bank = typeof require === "function" ? require("./questionBank") : window.UrologyAdaptiveQuestioning;

function buildCurrentState({
  transcript = "",
  answers = {},
  askedQuestionIds = [],
  questionBank = bank.QUESTION_BANK,
  sessionId = "demo-session-001",
  turnIndex = askedQuestionIds.length
} = {}) {
  const extracted = facts.extractFacts({ transcript, answers, questionBank });
  const ambiguityItems = ambiguity.detectAmbiguity(transcript, answers);
  const activeAmbiguity = ambiguityItems.find((item) => item.active);
  return {
    sessionId,
    turnIndex,
    rawAnswers: [],
    detectedSymptoms: extracted.symptoms.map((label) => ({ label, confidence: 0.7, evidence: transcript })),
    possibleDomains: Array.from(new Set(questionBank
      .filter((question) => question.symptoms?.some((symptom) => extracted.symptoms.includes(symptom)))
      .map((question) => question.domain))),
    answeredSlots: extracted.answeredFields,
    missingSlots: extracted.missingFields,
    ambiguity: {
      status: activeAmbiguity ? "ambiguous" : "clear",
      type: activeAmbiguity?.type || null,
      notes: ambiguityItems.map((item) => item.reason).filter(Boolean),
      items: ambiguityItems
    },
    redFlags: extracted.symptoms.includes("red_flag") ? ["red_flag_terms_detected"] : [],
    askedQuestionIds,
    currentStateText: extracted.stateText
  };
}

const api = { buildCurrentState };

if (typeof module !== "undefined") {
  module.exports = api;
}

if (typeof window !== "undefined") {
  window.UrologyAdaptiveQuestioning = Object.assign({}, window.UrologyAdaptiveQuestioning || {}, api);
}
}());
