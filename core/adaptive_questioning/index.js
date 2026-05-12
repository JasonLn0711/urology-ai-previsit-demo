(function () {
const questionBank = typeof require === "function" ? require("./questionBank") : window.UrologyAdaptiveQuestioning;
const facts = typeof require === "function" ? require("./extractFacts") : window.UrologyAdaptiveQuestioning;
const ambiguity = typeof require === "function" ? require("./detectAmbiguity") : window.UrologyAdaptiveQuestioning;
const scoring = typeof require === "function" ? require("./scoring") : window.UrologyAdaptiveQuestioning;
const ranking = typeof require === "function" ? require("./rankQuestions") : window.UrologyAdaptiveQuestioning;

const api = Object.assign({}, questionBank, facts, ambiguity, scoring, ranking);

if (typeof module !== "undefined") {
  module.exports = api;
}

if (typeof window !== "undefined") {
  window.UrologyAdaptiveQuestioning = Object.assign({}, window.UrologyAdaptiveQuestioning || {}, api);
}
}());
