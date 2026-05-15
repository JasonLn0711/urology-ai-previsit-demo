(function () {
function explainSelection(rankingResult = {}) {
  const selected = rankingResult.selected;
  if (!selected) {
    return {
      selectedReason: "目前沒有可選的受治理題目。",
      matchedFacts: [],
      missingSlotsFilled: [],
      ambiguityNotes: [],
      safetyNotes: [],
      skippedReasons: []
    };
  }

  return {
    selectedQuestion: selected.question,
    selectedReason: selected.question.explanationTemplate || selected.question.explanation || selected.question.value,
    matchedFacts: selected.reasons.filter((reason) => reason.includes("語意狀態符合") || reason.includes("語意接近")),
    missingSlotsFilled: selected.question.asksFor || [],
    ambiguityNotes: selected.reasons.filter((reason) => reason.includes("釐清") || reason.includes("模糊")),
    safetyNotes: selected.question.redFlag ? ["需醫療人員確認；系統不產生診斷或治療建議。"] : [],
    skippedReasons: (rankingResult.ranked || [])
      .filter((item) => item.id !== selected.id)
      .flatMap((item) => item.reasons.filter((reason) => reason.includes("降權") || reason.includes("暫緩") || reason.includes("已問過")))
      .slice(0, 5)
  };
}

const api = { explainSelection };

if (typeof module !== "undefined") {
  module.exports = api;
}

if (typeof window !== "undefined") {
  window.UrologyAdaptiveQuestioning = Object.assign({}, window.UrologyAdaptiveQuestioning || {}, api);
}
}());
