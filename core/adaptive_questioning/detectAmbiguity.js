(function () {
const facts = typeof require === "function" ? require("./extractFacts") : window.UrologyAdaptiveQuestioning;
const { hasAnswer, normalizeText } = facts;

const AMBIGUITY_PATTERNS = [
  {
    type: "pain_location",
    questionId: "clarify_pain_location",
    field: "painLocationClarification",
    label: "疼痛位置不清楚",
    patterns: ["下面痛", "下面會痛", "下面不舒服", "那邊痛", "那邊會痛", "私密處", "下體痛", "會陰不舒服", "尿道痛", "生殖器痛", "pain down there", "private area pain", "pain around my private area", "hurts down there"],
    clearPatterns: ["尿尿時", "排尿時", "下腹", "陰囊", "睪丸", "會陰", "尿道刺痛", "尿道灼熱", "during urination", "lower abdomen", "testicle", "scrotum", "perineum"],
    reason: "病人描述疼痛位置模糊，先定位尿道、下腹、生殖器或會陰，避免直接誤導到感染方向。"
  },
  {
    type: "urinary_symptom_type",
    questionId: "clarify_urinary_symptom_type",
    field: "urinarySymptomClarification",
    label: "泌尿主訴類型不清楚",
    patterns: ["尿尿怪怪", "尿尿怪", "小便怪怪", "解尿怪怪", "尿尿不舒服", "說不出來", "怪怪的", "urination feels weird", "pee feels weird", "i am not sure", "i don't know", "not sure"],
    clearPatterns: ["夜尿", "頻尿", "尿不出來", "尿流", "漏尿", "血尿", "尿痛", "刺痛", "灼熱", "血塊", "nocturia", "frequency", "burning", "blood", "leak"],
    reason: "使用者只說尿尿怪怪的，系統先區分症狀類型，再進入一般題庫 ranking。"
  },
  {
    type: "pain_burning_conflict",
    questionId: "clarify_pain_burning_conflict",
    field: "painBurningConflict",
    label: "尿痛描述前後不一致",
    patterns: ["尿尿會痛", "尿尿刺痛", "尿尿灼熱", "burns when i pee", "burning when urinating", "pain when urinating"],
    clearPatterns: [],
    reason: "先前已記錄沒有尿痛，但目前回答提到排尿疼痛或灼熱，需先釐清目前是否存在。"
  },
  {
    type: "headache_surface",
    questionId: null,
    field: "headPainClarification",
    label: "頭痛與頭皮痛類比",
    patterns: ["頭痛", "頭皮痛", "頭會痛"],
    clearPatterns: ["頭皮碰到會痛", "頭裡面痛", "偏頭痛"],
    reason: "這是一般語意模糊類比：病人常把部位與感覺混在一起，系統應先釐清而不是裝懂。"
  }
];

function detectAmbiguity(transcript = "", answers = {}) {
  const normalized = normalizeText(transcript);
  return AMBIGUITY_PATTERNS
    .filter((pattern) => !hasAnswer(answers, pattern.field))
    .map((pattern) => {
      const patternHits = pattern.patterns.filter((item) => normalized.includes(normalizeText(item)));
      const clearHits = pattern.clearPatterns.filter((item) => normalized.includes(normalizeText(item)));
      const painConflict = pattern.type === "pain_burning_conflict" &&
        ["沒有", "no", "none"].includes(normalizeText(answers.painBurning));
      const active = Boolean(pattern.questionId) && patternHits.length > 0 && clearHits.length === 0 &&
        (pattern.type !== "pain_burning_conflict" || painConflict);
      return {
        type: pattern.type,
        label: pattern.label,
        questionId: pattern.questionId,
        field: pattern.field,
        active,
        patternHits,
        clearHits,
        reason: active ? pattern.reason : ""
      };
    })
    .filter((item) => item.active || item.patternHits.length || item.clearHits.length);
}

const api = { AMBIGUITY_PATTERNS, detectAmbiguity };

if (typeof module !== "undefined") {
  module.exports = api;
}

if (typeof window !== "undefined") {
  window.UrologyAdaptiveQuestioning = Object.assign({}, window.UrologyAdaptiveQuestioning || {}, api);
}
}());
