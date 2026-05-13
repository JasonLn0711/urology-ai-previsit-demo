(function () {
const bank = typeof require === "function"
  ? require("../../core/adaptive_questioning/questionBank")
  : window.UrologyAdaptiveQuestioning;

const UROLOGY_ADAPTIVE_QUESTION_BANK = bank.QUESTION_BANK;

if (typeof module !== "undefined") {
  module.exports = {
    QUESTION_BANK: UROLOGY_ADAPTIVE_QUESTION_BANK,
    UROLOGY_ADAPTIVE_QUESTION_BANK
  };
}

if (typeof window !== "undefined") {
  window.UrologyAdaptiveQuestioning = Object.assign({}, window.UrologyAdaptiveQuestioning || {}, {
    QUESTION_BANK: UROLOGY_ADAPTIVE_QUESTION_BANK,
    UROLOGY_ADAPTIVE_QUESTION_BANK
  });
}
}());
