(function () {
const facts = typeof require === "function" ? require("./extractFacts") : window.UrologyAdaptiveQuestioning;
const {
  FIELD_LABELS,
  countKeywordHits,
  hasAnswer,
  tokenize
} = facts;

const DEFAULT_WEIGHTS = {
  semantic: 0.4,
  missingInfo: 0.25,
  workflow: 0.2,
  ambiguityReduction: 0.1,
  safety: 0.05
};

function semanticSimilarity(stateText, question) {
  const stateTokens = new Set(tokenize(stateText));
  const questionTokens = tokenize([
    question.text,
    question.value,
    question.explanation,
    (question.keywords || []).join(" "),
    (question.symptoms || []).join(" "),
    (question.nextUsefulWhen || []).join(" ")
  ].join(" "));
  if (!stateTokens.size || !questionTokens.length) return 0;
  const tokenHits = questionTokens.filter((token) => stateTokens.has(token)).length;
  const keywordHits = countKeywordHits(stateText, question.keywords || []);
  return Math.min(1, tokenHits / Math.max(questionTokens.length, 1) + keywordHits * 0.18);
}

function symptomMatchScore(symptoms, question) {
  if (!symptoms.length || !question.symptoms?.length) return 0;
  const matched = question.symptoms.filter((symptom) => symptoms.includes(symptom)).length;
  return matched / question.symptoms.length;
}

function missingInfoScore(question, answers = {}) {
  const fields = question.asksFor || [];
  if (!fields.length) return 0.2;
  const missing = fields.filter((field) => !hasAnswer(answers, field)).length;
  return missing / fields.length;
}

function dependencyAllowed(question, answers = {}, symptoms = []) {
  if (question.id === "leakage_trigger") return hasAnswer(answers, "leakage") || symptoms.includes("leakage");
  if (question.id === "current_retention") return hasAnswer(answers, "unableToUrinate") || symptoms.includes("retention");
  if (question.id === "hematuria_pattern") return hasAnswer(answers, "visibleBlood") || symptoms.includes("hematuria");
  if (question.id === "visible_blood_color") return hasAnswer(answers, "visibleBlood") || symptoms.includes("hematuria");
  if (question.id === "urgency_hold_time") return hasAnswer(answers, "urgency") || symptoms.includes("urgency");
  if (question.id === "nocturia_sleep_impact") return hasAnswer(answers, "nocturiaCount") || symptoms.includes("nocturia");
  return true;
}

function scoreQuestion({ question, stateText, symptoms, answers, asked, activeAmbiguity, weights = DEFAULT_WEIGHTS }) {
  const isClarificationForActiveAmbiguity = activeAmbiguity && question.id === activeAmbiguity.questionId;
  const isOtherQuestionDuringAmbiguity = activeAmbiguity && question.id !== activeAmbiguity.questionId;
  const semantic = Math.max(semanticSimilarity(stateText, question), symptomMatchScore(symptoms, question));
  const missingInfo = missingInfoScore(question, answers);
  const inactiveClarification = question.ambiguityType && !isClarificationForActiveAmbiguity;
  const ambiguityReduction = isClarificationForActiveAmbiguity ? 1 : (inactiveClarification ? 0.05 : (question.ambiguityReduction || question.clarificationValue || 0));
  const workflow = question.clinicalWorkflowValue || question.workflowValue || 0;
  const safety = question.safetyPriority || 0;
  const alreadyAskedPenalty = asked.has(question.id) ? 1 : 0;
  const answeredPenalty = (question.asksFor || []).every((field) => hasAnswer(answers, field)) ? 0.72 : 0;
  const dependencyPenalty = dependencyAllowed(question, answers, symptoms) ? 0 : 0.45;
  const ambiguityPenalty = isOtherQuestionDuringAmbiguity ? 0.65 : 0;
  const inactiveClarificationPenalty = inactiveClarification ? 0.55 : 0;
  const outOfScopePenalty = question.safetyLevel === "out_of_scope" ? 1 : 0;
  const score = (semantic * weights.semantic) +
    (missingInfo * weights.missingInfo) +
    (workflow * weights.workflow) +
    (ambiguityReduction * weights.ambiguityReduction) +
    (safety * weights.safety) -
    alreadyAskedPenalty -
    answeredPenalty -
    dependencyPenalty -
    ambiguityPenalty -
    inactiveClarificationPenalty -
    outOfScopePenalty;
  const reasons = buildReasons({
    question,
    symptoms,
    semantic,
    missingInfo,
    ambiguityReduction,
    workflow,
    safety,
    activeAmbiguity,
    isClarificationForActiveAmbiguity,
    alreadyAskedPenalty,
    answeredPenalty,
    dependencyPenalty,
    ambiguityPenalty,
    inactiveClarificationPenalty,
    outOfScopePenalty
  });
  return {
    score: Number(score.toFixed(4)),
    components: {
      semantic: Number(semantic.toFixed(3)),
      missingInfo: Number(missingInfo.toFixed(3)),
      workflow: Number(workflow.toFixed(3)),
      ambiguityReduction: Number(ambiguityReduction.toFixed(3)),
      safety: Number(safety.toFixed(3)),
      ambiguity: Number((isClarificationForActiveAmbiguity ? 1 : ambiguityPenalty ? -1 : 0).toFixed(3))
    },
    reasons
  };
}

function buildReasons({
  question,
  symptoms,
  semantic,
  missingInfo,
  ambiguityReduction,
  workflow,
  safety,
  activeAmbiguity,
  isClarificationForActiveAmbiguity,
  alreadyAskedPenalty,
  answeredPenalty,
  dependencyPenalty,
  ambiguityPenalty,
  inactiveClarificationPenalty,
  outOfScopePenalty
}) {
  const reasons = [];
  if (isClarificationForActiveAmbiguity) reasons.push(`先釐清：${activeAmbiguity.reason}`);
  if (ambiguityReduction && !isClarificationForActiveAmbiguity && question.ambiguityType) reasons.push("這是釐清題，但目前沒有對應的 active ambiguity");
  if (ambiguityPenalty) reasons.push("目前描述仍模糊，先降權一般 retrieval 題，避免過早判斷方向");
  const matchedSymptoms = (question.symptoms || []).filter((symptom) => symptoms.includes(symptom));
  if (matchedSymptoms.length) reasons.push(`語意狀態符合：${matchedSymptoms.join(", ")}`);
  if (semantic >= 0.35) reasons.push("目前回答與這題語意接近");
  if (missingInfo > 0) reasons.push(`補足缺口：${(question.asksFor || []).map((field) => FIELD_LABELS[field] || field).join("、")}`);
  if (workflow >= 0.8) reasons.push("對門診前摘要有高流程價值");
  if (safety >= 0.55) reasons.push("含現場優先告知資訊，需提早標出");
  if (alreadyAskedPenalty) reasons.push("已問過，因此降權，避免病人重複回答");
  if (answeredPenalty) reasons.push("對應欄位已有答案，因此降權");
  if (dependencyPenalty) reasons.push("前置資訊尚不足，因此暫緩");
  if (outOfScopePenalty) reasons.push("超出此 demo 的門診前整理範圍，因此排除");
  if (inactiveClarificationPenalty) reasons.push("沒有 active ambiguity，因此釐清題降權");
  if (!reasons.length) reasons.push("作為一般背景補問候選");
  return reasons;
}

const api = {
  DEFAULT_WEIGHTS,
  buildReasons,
  dependencyAllowed,
  missingInfoScore,
  scoreQuestion,
  semanticSimilarity,
  symptomMatchScore
};

if (typeof module !== "undefined") {
  module.exports = api;
}

if (typeof window !== "undefined") {
  window.UrologyAdaptiveQuestioning = Object.assign({}, window.UrologyAdaptiveQuestioning || {}, api);
}
}());
