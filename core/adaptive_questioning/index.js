(function () {
const questionBank = typeof require === "function" ? require("./questionBank") : window.UrologyAdaptiveQuestioning;
const facts = typeof require === "function" ? require("./extractFacts") : window.UrologyAdaptiveQuestioning;
const ambiguity = typeof require === "function" ? require("./detectAmbiguity") : window.UrologyAdaptiveQuestioning;
const scoring = typeof require === "function" ? require("./scoring") : window.UrologyAdaptiveQuestioning;
const ranking = typeof require === "function" ? require("./rankQuestions") : window.UrologyAdaptiveQuestioning;
const constants = typeof require === "function" ? require("./constants") : window.UrologyAdaptiveQuestioning;
const normalize = typeof require === "function" ? require("./normalize") : window.UrologyAdaptiveQuestioning;
const state = typeof require === "function" ? require("./state") : window.UrologyAdaptiveQuestioning;
const retrieval = typeof require === "function" ? require("./retrieve") : window.UrologyAdaptiveQuestioning;
const rank = typeof require === "function" ? require("./rank") : window.UrologyAdaptiveQuestioning;
const explain = typeof require === "function" ? require("./explain") : window.UrologyAdaptiveQuestioning;

const api = Object.assign(
  {},
  questionBank,
  facts,
  ambiguity,
  scoring,
  ranking,
  constants,
  normalize,
  state,
  retrieval,
  rank,
  explain
);

if (typeof module !== "undefined") {
  module.exports = api;
}

if (typeof window !== "undefined") {
  window.UrologyAdaptiveQuestioning = Object.assign({}, window.UrologyAdaptiveQuestioning || {}, api);
}
}());
