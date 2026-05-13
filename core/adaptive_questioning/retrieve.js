(function () {
const facts = typeof require === "function" ? require("./extractFacts") : window.UrologyAdaptiveQuestioning;
const scoring = typeof require === "function" ? require("./scoring") : window.UrologyAdaptiveQuestioning;
const bank = typeof require === "function" ? require("./questionBank") : window.UrologyAdaptiveQuestioning;

function retrieveCandidateQuestions({
  currentStateText = "",
  transcript = "",
  detectedSymptoms = [],
  symptoms = detectedSymptoms,
  missingSlots = [],
  missingFields = missingSlots,
  askedQuestionIds = [],
  questionBank = bank.QUESTION_BANK
} = {}) {
  const stateText = currentStateText || facts.buildStateText(transcript, {}, symptoms);
  const asked = new Set(askedQuestionIds);
  return questionBank
    .filter((question) => !asked.has(question.id))
    .map((question) => {
      const matchedSymptoms = (question.symptoms || []).filter((symptom) => symptoms.includes(symptom));
      const matchedMissingSlots = (question.asksFor || []).filter((field) => missingFields.includes(field));
      const rawSimilarity = Math.max(
        scoring.semanticSimilarity(stateText, question),
        scoring.symptomMatchScore(symptoms, question)
      );
      return {
        question,
        questionId: question.id,
        rawSimilarity: Number(rawSimilarity.toFixed(3)),
        matchedSymptoms,
        matchedMissingSlots
      };
    })
    .sort((a, b) => b.rawSimilarity - a.rawSimilarity || b.matchedMissingSlots.length - a.matchedMissingSlots.length);
}

const api = { retrieveCandidateQuestions };

if (typeof module !== "undefined") {
  module.exports = api;
}

if (typeof window !== "undefined") {
  window.UrologyAdaptiveQuestioning = Object.assign({}, window.UrologyAdaptiveQuestioning || {}, api);
}
}());
