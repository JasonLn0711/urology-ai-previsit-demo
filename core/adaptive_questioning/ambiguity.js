(function () {
const engine = typeof require === "function" ? require("./detectAmbiguity") : window.UrologyAdaptiveQuestioning;

function detectAnswerAmbiguity(transcript = "", answers = {}) {
  const items = engine.detectAmbiguity(transcript, answers);
  const active = items.find((item) => item.active);
  return {
    status: active ? "ambiguous" : "clear",
    active,
    items
  };
}

const api = {
  AMBIGUITY_PATTERNS: engine.AMBIGUITY_PATTERNS,
  detectAnswerAmbiguity
};

if (typeof module !== "undefined") {
  module.exports = api;
}

if (typeof window !== "undefined") {
  window.UrologyAdaptiveQuestioning = Object.assign({}, window.UrologyAdaptiveQuestioning || {}, api);
}
}());
