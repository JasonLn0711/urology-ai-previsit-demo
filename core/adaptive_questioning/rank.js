(function () {
const ranking = typeof require === "function" ? require("./rankQuestions") : window.UrologyAdaptiveQuestioning;

function rankCandidateQuestions(input = {}) {
  return ranking.rankQuestions(input);
}

const api = {
  rankCandidateQuestions,
  rankQuestions: ranking.rankQuestions
};

if (typeof module !== "undefined") {
  module.exports = api;
}

if (typeof window !== "undefined") {
  window.UrologyAdaptiveQuestioning = Object.assign({}, window.UrologyAdaptiveQuestioning || {}, api);
}
}());
