(function () {
const facts = typeof require === "function" ? require("./extractFacts") : window.UrologyAdaptiveQuestioning;
const { inferSymptoms, normalizeText, tokenize } = facts;

function normalizeAnswer({ transcript = "", answers = {} } = {}) {
  const normalizedText = normalizeText(transcript).trim();
  return {
    rawText: transcript,
    normalizedText,
    tokens: tokenize(normalizedText),
    symptomHints: inferSymptoms(transcript, answers)
  };
}

const api = { normalizeAnswer };

if (typeof module !== "undefined") {
  module.exports = api;
}

if (typeof window !== "undefined") {
  window.UrologyAdaptiveQuestioning = Object.assign({}, window.UrologyAdaptiveQuestioning || {}, api);
}
}());
