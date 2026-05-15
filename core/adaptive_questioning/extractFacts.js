(function () {
const FIELD_LABELS = {
  compactPrimaryConcern: "主要泌尿問題",
  durationBother: "病程與困擾程度",
  compactStorageSymptoms: "頻尿、夜尿或急尿",
  compactLeakagePattern: "漏尿情境",
  compactVoidingSymptoms: "排尿不順",
  compactPainSystemic: "疼痛、灼熱或發燒發冷",
  compactVisibleBlood: "血尿或血塊",
  compactBackgroundMedication: "背景病史與用藥資料",
  compactClosingNote: "最後補充",
  duration: "病程",
  botherScore: "困擾程度",
  nocturiaCount: "夜尿次數",
  urgency: "急尿",
  daytimeFrequencyCount: "白天頻率",
  leakage: "漏尿",
  leakageTriggers: "漏尿情境",
  unableToUrinate: "排尿困難",
  currentlyUnableToUrinate: "目前是否尿不出來",
  painBurning: "尿痛或灼熱",
  systemicSymptoms: "發燒、發冷或腰側痛",
  visibleBlood: "血尿或血塊",
  hematuriaPattern: "血尿型態",
  painLocationDetail: "疼痛詳細位置",
  painTiming: "疼痛發生時間",
  lowerAbdominalPain: "下腹疼痛或壓迫",
  flankPain: "腰側或背側疼痛",
  feverChills: "發燒或發冷",
  symptomStartPattern: "症狀起始方式",
  nocturiaSleepImpact: "夜尿睡眠影響",
  fluidContext: "飲水或咖啡因背景",
  daytimeUrgencyImpact: "急尿日間影響",
  incompleteEmptying: "尿不乾淨感",
  weakStream: "尿流變弱",
  straining: "排尿需用力",
  stoneHistory: "結石病史",
  utiHistory: "泌尿感染病史",
  urologicSurgeryHistory: "泌尿手術病史",
  diabetesKidneyHistory: "糖尿病或腎臟病史",
  medicationListStatus: "用藥資料",
  newMedicationContext: "近期新藥",
  clinicianPriority: "最希望醫師知道的事",
  closingReview: "結尾補充",
  painBurningConflict: "尿痛矛盾釐清",
  painLocationClarification: "疼痛位置釐清",
  urinarySymptomClarification: "泌尿症狀類型釐清"
};

const LEGACY_CORE_FIELDS = [
  "duration",
  "botherScore",
  "nocturiaCount",
  "urgency",
  "daytimeFrequencyCount",
  "painBurning",
  "visibleBlood",
  "systemicSymptoms"
];

const CORE_FIELDS = [
  "compactPrimaryConcern",
  "durationBother",
  "compactStorageSymptoms",
  "compactLeakagePattern",
  "compactVoidingSymptoms",
  "compactPainSystemic",
  "compactVisibleBlood",
  "compactBackgroundMedication",
  "compactClosingNote"
];

const SYMPTOM_KEYWORDS = {
  frequency: ["頻尿", "一直尿", "一直跑廁所", "白天", "次數", "frequent", "often"],
  nocturia: ["夜尿", "晚上", "睡覺", "起來尿", "night", "nocturia", "wake up"],
  urgency: ["急", "忍不住", "來不及", "urgency", "rush", "urgent"],
  leakage: ["漏尿", "滲", "護墊", "尿失禁", "leak", "incontinence"],
  voiding: ["尿不出來", "尿流", "排尿困難", "用力", "weak stream", "slow stream"],
  retention: ["完全尿不出來", "卡住", "retention"],
  pain: ["痛", "刺痛", "灼熱", "burning", "burns", "pain", "hurts"],
  infection: ["感染", "發燒", "發冷", "抗生素", "fever", "chills"],
  hematuria: ["血尿", "紅色尿", "茶色尿", "血塊", "blood", "clot"],
  flank_pain: ["腰痛", "腰側", "背痛", "flank", "back pain"],
  lower_abdominal_pain: ["下腹", "膀胱", "小腹", "lower abdomen"],
  red_flag: ["發燒", "發冷", "腰痛", "尿不出來", "血塊", "fever", "clot"],
  context: ["藥", "藥袋", "藥單", "病史", "糖尿病", "腎臟病", "medication", "history"]
};

function normalizeText(value) {
  return String(value || "").toLowerCase();
}

function tokenize(value) {
  const normalized = normalizeText(value)
    .replace(/[，。！？、；：,.!?;:()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!normalized) return [];
  const ascii = normalized.match(/[a-z0-9]+/g) || [];
  const zh = normalized
    .replace(/[a-z0-9\s]/g, "")
    .split("")
    .filter(Boolean);
  return ascii.concat(zh);
}

function countKeywordHits(text, keywords) {
  const normalized = normalizeText(text);
  return keywords.filter((keyword) => normalized.includes(normalizeText(keyword))).length;
}

function hasAnswer(answers, field) {
  const value = answers && answers[field];
  return Array.isArray(value) ? value.length > 0 : Boolean(value);
}

function answeredFields(answers) {
  return Object.keys(answers || {}).filter((field) => hasAnswer(answers, field));
}

function inferSymptoms(transcript, answers = {}) {
  const source = [
    transcript,
    Object.entries(answers)
      .filter(([, value]) => typeof value === "string" || Array.isArray(value))
      .map(([field, value]) => `${field} ${Array.isArray(value) ? value.join(" ") : value}`)
      .join(" ")
  ].join(" ");

  return Object.entries(SYMPTOM_KEYWORDS)
    .map(([symptom, keywords]) => ({ symptom, hits: countKeywordHits(source, keywords) }))
    .filter((item) => item.hits > 0)
    .sort((a, b) => b.hits - a.hits)
    .map((item) => item.symptom);
}

function buildStateText(transcript, answers = {}, symptoms = []) {
  const answerText = Object.entries(answers)
    .filter(([, value]) => Array.isArray(value) ? value.length > 0 : Boolean(value))
    .map(([field, value]) => `${field}: ${Array.isArray(value) ? value.join(" ") : value}`)
    .join(" | ");
  return [transcript, symptoms.join(" "), answerText].filter(Boolean).join(" | ");
}

function missingFields(answers = {}, questionBank = []) {
  const fields = new Set(CORE_FIELDS);
  for (const question of questionBank) {
    for (const field of question.asksFor || []) fields.add(field);
  }
  return Array.from(fields).filter((field) => !hasAnswer(answers, field));
}

function extractFacts({ transcript = "", answers = {}, questionBank = [] } = {}) {
  const symptoms = inferSymptoms(transcript, answers);
  return {
    symptoms,
    answeredFields: answeredFields(answers),
    missingFields: missingFields(answers, questionBank),
    stateText: buildStateText(transcript, answers, symptoms)
  };
}

const api = {
  CORE_FIELDS,
  LEGACY_CORE_FIELDS,
  FIELD_LABELS,
  SYMPTOM_KEYWORDS,
  answeredFields,
  buildStateText,
  countKeywordHits,
  extractFacts,
  hasAnswer,
  inferSymptoms,
  missingFields,
  normalizeText,
  tokenize
};

if (typeof module !== "undefined") {
  module.exports = api;
}

if (typeof window !== "undefined") {
  window.UrologyAdaptiveQuestioning = Object.assign({}, window.UrologyAdaptiveQuestioning || {}, api);
}
}());
