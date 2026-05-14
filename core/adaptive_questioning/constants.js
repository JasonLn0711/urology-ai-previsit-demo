(function () {
const facts = typeof require === "function" ? require("./extractFacts") : window.UrologyAdaptiveQuestioning;
const scoring = typeof require === "function" ? require("./scoring") : window.UrologyAdaptiveQuestioning;

const api = {
  CORE_FIELDS: facts.CORE_FIELDS,
  DEFAULT_WEIGHTS: scoring.DEFAULT_WEIGHTS,
  FIELD_LABELS: facts.FIELD_LABELS,
  SYMPTOM_KEYWORDS: facts.SYMPTOM_KEYWORDS
};

if (typeof module !== "undefined") {
  module.exports = api;
}

if (typeof window !== "undefined") {
  window.UrologyAdaptiveQuestioning = Object.assign({}, window.UrologyAdaptiveQuestioning || {}, api);
}
}());
