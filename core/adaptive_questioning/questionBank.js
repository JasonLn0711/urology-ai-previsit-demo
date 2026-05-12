(function () {
const RAW_QUESTION_BANK = [
  {
    id: "clarify_pain_location",
    text: "你說的疼痛或不舒服，位置比較接近哪裡？",
    asksFor: ["painLocationClarification"],
    symptoms: ["pain", "ambiguous_location"],
    ambiguityType: "pain_location",
    keywords: ["下面痛", "下面不舒服", "那邊痛", "私密處", "尿道痛", "生殖器痛", "會陰", "下腹痛"],
    value: "病人常無法精準區分尿道、下腹、生殖器或會陰疼痛；先定位可降低誤導後續題目的風險。",
    explanation: "這是 clarification question，不是診斷題。目的是把模糊位置轉成可用資訊。",
    safety: "clarification",
    safetyLevel: "clarification_only",
    workflowValue: 0.92,
    clinicalWorkflowValue: 0.92,
    safetyPriority: 0.62,
    nextUsefulWhen: ["使用者說下面痛、那邊痛、私密處不舒服、或痛的位置不清楚"],
    skipWhen: ["已經回答 painLocationClarification", "使用者已明確說尿尿時尿道刺痛、下腹痛、生殖器痛或會陰痛"],
    options: ["尿尿時尿道刺痛", "下腹悶痛", "生殖器或陰囊疼痛", "會陰或肛門前方疼痛", "不確定"]
  },
  {
    id: "clarify_urinary_symptom_type",
    text: "你說的「尿尿怪怪的」比較接近哪一種？",
    asksFor: ["urinarySymptomClarification"],
    symptoms: ["ambiguous_urinary"],
    ambiguityType: "urinary_symptom_type",
    keywords: ["尿尿怪怪", "怪怪的", "不舒服", "怪", "說不出來", "不順", "weird"],
    value: "病人只說怪怪的時，先區分頻率、疼痛、排尿困難、血尿或漏尿，避免 similarity 直接誤判方向。",
    explanation: "這題先把模糊主訴拆成可追問的症狀類型。",
    safety: "clarification",
    safetyLevel: "clarification_only",
    workflowValue: 0.94,
    clinicalWorkflowValue: 0.94,
    safetyPriority: 0.58,
    nextUsefulWhen: ["使用者只說尿尿怪怪的、下面不舒服、或無法說清楚是哪一類泌尿問題"],
    skipWhen: ["已經回答 urinarySymptomClarification", "使用者已明確指出夜尿、急尿、尿痛、血尿、漏尿或尿不出來"],
    options: ["次數變多或晚上起來尿", "尿尿會痛或灼熱", "尿不太出來或尿流變弱", "看到紅色或茶色尿", "漏尿", "不確定"]
  },
  {
    id: "duration",
    text: "這個問題大約多久了？",
    asksFor: ["duration"],
    symptoms: ["general"],
    keywords: ["多久", "開始", "最近", "today", "week", "month", "duration"],
    value: "建立病程，讓後續摘要能區分急性與慢性問題。",
    explanation: "先建立病程，避免只有症狀方向但缺少時間脈絡。",
    safety: "non_diagnostic",
    safetyLevel: "routine",
    workflowValue: 0.82,
    clinicalWorkflowValue: 0.82,
    safetyPriority: 0.25,
    nextUsefulWhen: ["任何主訴已出現但尚未建立病程"],
    skipWhen: ["已經回答 duration"],
    options: ["今天", "1 到 7 天", "1 到 4 週", "超過 1 個月", "不確定"]
  },
  {
    id: "bother_score",
    text: "如果 0 分是不困擾、10 分是非常困擾，現在大約幾分？",
    asksFor: ["botherScore"],
    symptoms: ["general"],
    keywords: ["困擾", "嚴重", "受不了", "bother", "severity"],
    value: "量化病人主觀困擾，協助醫師快速抓到優先關切。",
    explanation: "補足病人主觀負擔，而不是推論診斷。",
    safety: "non_diagnostic",
    safetyLevel: "routine",
    workflowValue: 0.76,
    clinicalWorkflowValue: 0.76,
    safetyPriority: 0.2,
    nextUsefulWhen: ["已有主訴但缺少困擾程度"],
    skipWhen: ["已經回答 botherScore"],
    options: ["0-2", "3-5", "6-8", "9-10", "不確定"]
  },
  {
    id: "nocturia_count",
    text: "晚上睡著後通常會起來尿尿幾次？",
    asksFor: ["nocturiaCount"],
    symptoms: ["frequency", "nocturia", "urgency"],
    keywords: ["晚上", "夜尿", "睡覺", "起來尿", "nocturia", "night"],
    value: "使用者提到夜尿時，這題最能補足頻率與負擔。",
    explanation: "夜尿被提到時，次數是最直接的下一個缺口。",
    safety: "non_diagnostic",
    safetyLevel: "routine",
    workflowValue: 0.9,
    clinicalWorkflowValue: 0.9,
    safetyPriority: 0.28,
    nextUsefulWhen: ["使用者提到晚上起來尿、夜尿或睡眠被尿意打斷"],
    skipWhen: ["已經回答 nocturiaCount"],
    options: ["0 次", "1 次", "2 次", "3 次以上", "不確定"]
  },
  {
    id: "urgency",
    text: "會突然很想尿，而且很難忍住嗎？",
    asksFor: ["urgency"],
    symptoms: ["frequency", "urgency", "leakage"],
    keywords: ["急", "忍不住", "來不及", "urgency", "rush"],
    value: "釐清是否有急尿，決定是否需要追問漏尿或頻率。",
    explanation: "急尿會影響後續是否追問漏尿與情境。",
    safety: "non_diagnostic",
    safetyLevel: "routine",
    workflowValue: 0.86,
    clinicalWorkflowValue: 0.86,
    safetyPriority: 0.24,
    nextUsefulWhen: ["使用者提到急、忍不住或來不及"],
    skipWhen: ["已經回答 urgency"],
    options: ["沒有", "有", "不確定"]
  },
  {
    id: "daytime_frequency",
    text: "白天大約尿尿幾次？",
    asksFor: ["daytimeFrequencyCount"],
    symptoms: ["frequency", "nocturia", "urgency"],
    keywords: ["頻尿", "一直跑廁所", "白天", "次數", "frequent"],
    value: "使用者描述頻尿時，用區間補足白天頻率。",
    explanation: "白天次數讓頻尿描述從模糊感受變成可摘要資訊。",
    safety: "non_diagnostic",
    safetyLevel: "routine",
    workflowValue: 0.84,
    clinicalWorkflowValue: 0.84,
    safetyPriority: 0.22,
    nextUsefulWhen: ["使用者提到頻尿、一直跑廁所或白天次數增加"],
    skipWhen: ["已經回答 daytimeFrequencyCount"],
    options: ["1 到 4 次", "5 到 8 次", "9 到 12 次", "超過 12 次", "不確定"]
  },
  {
    id: "leakage",
    text: "最近 4 週有尿不小心漏出來嗎？",
    asksFor: ["leakage"],
    symptoms: ["leakage", "urgency"],
    keywords: ["漏尿", "滲出", "褲子", "護墊", "leak", "incontinence"],
    value: "當使用者提到忍不住或漏尿，先建立是否發生漏尿。",
    explanation: "先確認是否真的有漏尿，再決定是否追問量與情境。",
    safety: "non_diagnostic",
    safetyLevel: "routine",
    workflowValue: 0.82,
    clinicalWorkflowValue: 0.82,
    safetyPriority: 0.22,
    nextUsefulWhen: ["使用者提到漏尿、忍不住、護墊或尿會滲出"],
    skipWhen: ["已經回答 leakage"],
    options: ["沒有", "有", "不確定"]
  },
  {
    id: "leakage_trigger",
    text: "漏尿最常在什麼情況發生？",
    asksFor: ["leakageTriggers"],
    symptoms: ["leakage", "urgency"],
    keywords: ["咳嗽", "笑", "運動", "睡覺", "來不及", "trigger"],
    value: "漏尿已成立時，這題補足情境，讓護理端與醫師摘要更可用。",
    explanation: "漏尿情境是護理端補問與醫師摘要的重要背景。",
    safety: "non_diagnostic",
    safetyLevel: "routine",
    workflowValue: 0.78,
    clinicalWorkflowValue: 0.78,
    safetyPriority: 0.18,
    nextUsefulWhen: ["已知道有漏尿或使用者描述來不及、咳嗽笑運動時漏"],
    skipWhen: ["尚未知道是否漏尿", "已經回答 leakageTriggers"],
    options: ["來不及到廁所", "咳嗽、笑或運動", "睡覺時", "沒有明顯原因", "不確定"]
  },
  {
    id: "unable_to_urinate",
    text: "有很想尿卻尿不太出來，或完全尿不出來嗎？",
    asksFor: ["unableToUrinate"],
    symptoms: ["voiding", "retention"],
    keywords: ["尿不出來", "尿流弱", "排尿困難", "卡住", "retention", "weak stream"],
    value: "排尿困難方向的核心問題，也能觸發現場優先告知提醒。",
    explanation: "排尿困難需要先確認是否存在，尤其避免漏掉仍尿不出來的情況。",
    safety: "priority_notice",
    safetyLevel: "priority_notice",
    workflowValue: 0.88,
    clinicalWorkflowValue: 0.88,
    safetyPriority: 0.55,
    nextUsefulWhen: ["使用者提到尿不出來、尿流弱、卡住或排尿困難"],
    skipWhen: ["已經回答 unableToUrinate"],
    options: ["沒有", "有", "不確定"]
  },
  {
    id: "current_retention",
    text: "現在是否還尿不出來？",
    asksFor: ["currentlyUnableToUrinate"],
    symptoms: ["voiding", "retention"],
    keywords: ["現在", "還是", "尿不出來", "retention", "urgent"],
    value: "若現在仍尿不出來，這是現場優先告知資訊。",
    explanation: "這題只確認目前狀態，避免把急需現場告知的資訊埋在摘要後面。",
    safety: "priority_notice",
    safetyLevel: "priority_notice",
    workflowValue: 0.8,
    clinicalWorkflowValue: 0.8,
    safetyPriority: 0.85,
    nextUsefulWhen: ["已知道有尿不出來，需確認現在是否仍發生"],
    skipWhen: ["尚未知道是否尿不出來", "已經回答 currentlyUnableToUrinate"],
    options: ["沒有", "有", "不確定"]
  },
  {
    id: "pain_burning",
    text: "尿尿時會痛、刺痛或灼熱嗎？",
    asksFor: ["painBurning"],
    symptoms: ["pain", "infection"],
    keywords: ["痛", "刺痛", "灼熱", "感染", "burning", "pain"],
    value: "使用者提到疼痛或感染疑慮時，先補足排尿疼痛。",
    explanation: "若疼痛位置已清楚指向尿尿時刺痛，這題補足尿痛/灼熱。",
    safety: "priority_notice",
    safetyLevel: "priority_notice",
    workflowValue: 0.84,
    clinicalWorkflowValue: 0.84,
    safetyPriority: 0.45,
    nextUsefulWhen: ["使用者提到尿尿會痛、刺痛、灼熱或感染疑慮"],
    skipWhen: ["疼痛位置仍模糊時應先問位置釐清", "已經回答 painBurning"],
    options: ["沒有", "有", "不確定"]
  },
  {
    id: "systemic_symptoms",
    text: "最近有發燒、發冷或腰部兩側痛嗎？",
    asksFor: ["systemicSymptoms"],
    symptoms: ["pain", "infection", "red_flag"],
    keywords: ["發燒", "發冷", "腰痛", "腰側", "fever", "chills", "flank"],
    value: "感染疑慮下，這題補足需要現場優先確認的症狀。",
    explanation: "在感染/疼痛方向中，發燒、發冷、腰側痛需要優先標出。",
    safety: "priority_notice",
    safetyLevel: "priority_notice",
    workflowValue: 0.88,
    clinicalWorkflowValue: 0.88,
    safetyPriority: 0.78,
    nextUsefulWhen: ["使用者提到尿痛、感染疑慮、發燒、發冷或腰側痛"],
    skipWhen: ["已經回答 systemicSymptoms"],
    options: ["發燒", "發冷", "腰部兩側痛", "以上都沒有", "不確定"]
  },
  {
    id: "visible_blood",
    text: "有看過尿液變紅、茶色，或看到血塊嗎？",
    asksFor: ["visibleBlood"],
    symptoms: ["hematuria", "red_flag"],
    keywords: ["血尿", "紅色", "茶色", "血塊", "blood", "clot"],
    value: "血尿是看診前摘要必須標出的病人回報。",
    explanation: "先確認是否看見紅色/茶色尿或血塊，不做診斷。",
    safety: "priority_notice",
    safetyLevel: "priority_notice",
    workflowValue: 0.9,
    clinicalWorkflowValue: 0.9,
    safetyPriority: 0.82,
    nextUsefulWhen: ["使用者提到血尿、紅色尿、茶色尿或血塊"],
    skipWhen: ["已經回答 visibleBlood"],
    options: ["沒有", "有", "不確定"]
  },
  {
    id: "hematuria_pattern",
    text: "如果有看到血尿，是一次、反覆，還是最近幾乎每次都有？",
    asksFor: ["hematuriaPattern"],
    symptoms: ["hematuria", "red_flag"],
    keywords: ["一次", "反覆", "每次", "血尿", "blood"],
    value: "血尿已成立時，這題補足發生型態。",
    explanation: "血尿已被標出後，再補足一次/反覆/每次的型態。",
    safety: "priority_notice",
    safetyLevel: "priority_notice",
    workflowValue: 0.78,
    clinicalWorkflowValue: 0.78,
    safetyPriority: 0.66,
    nextUsefulWhen: ["已知道看見血尿或血塊，需補足發生型態"],
    skipWhen: ["尚未知道是否血尿", "已經回答 hematuriaPattern"],
    options: ["一次", "不只一次", "最近幾乎每次都有", "不確定"]
  },
  {
    id: "medication_list",
    text: "今天能不能提供目前藥物資料，例如藥袋、藥單或照片？",
    asksFor: ["medicationListStatus"],
    symptoms: ["context"],
    keywords: ["藥", "藥袋", "藥單", "慢性病", "medication"],
    value: "補足門診前背景資訊，不要求病人背藥名。",
    explanation: "用藥資訊是背景，不要求病人記得藥名。",
    safety: "non_diagnostic",
    safetyLevel: "routine",
    workflowValue: 0.7,
    clinicalWorkflowValue: 0.7,
    safetyPriority: 0.18,
    nextUsefulWhen: ["核心主訴已初步清楚後，補足用藥背景"],
    skipWhen: ["已經回答 medicationListStatus"],
    options: ["可以提供", "只記得一部分", "沒有固定用藥", "不確定"]
  }
];

function inferQuestionType(question) {
  if (question.ambiguityType) return "clarification";
  if (question.safetyLevel === "priority_notice") return "safety_boundary";
  return "follow_up";
}

function inferDomain(question) {
  const symptoms = question.symptoms || [];
  if (question.ambiguityType) return "ambiguity_clarification";
  if (symptoms.includes("nocturia") || symptoms.includes("frequency") || symptoms.includes("urgency") || symptoms.includes("leakage")) return "storage_symptoms";
  if (symptoms.includes("voiding") || symptoms.includes("retention")) return "voiding_symptoms";
  if (symptoms.includes("pain") || symptoms.includes("infection")) return "pain_or_infection_context";
  if (symptoms.includes("hematuria")) return "hematuria_context";
  if (symptoms.includes("context")) return "background_context";
  return "general_history";
}

function inferAmbiguityReduction(question) {
  if (question.ambiguityType) return 0.95;
  if ((question.asksFor || []).some((field) => /duration|bother|count|frequency|pattern|trigger|location/i.test(field))) return 0.7;
  if (question.safetyLevel === "priority_notice") return 0.55;
  return 0.35;
}

function enrichQuestion(question) {
  return Object.assign({
    type: inferQuestionType(question),
    domain: inferDomain(question),
    clinicalValue: question.clinicalWorkflowValue || question.workflowValue || 0,
    ambiguityReduction: inferAmbiguityReduction(question),
    redFlag: question.safetyLevel === "priority_notice",
    avoidWhen: question.skipWhen || []
  }, question);
}

const QUESTION_BANK = RAW_QUESTION_BANK.map(enrichQuestion);

if (typeof module !== "undefined") {
  module.exports = { QUESTION_BANK };
}

if (typeof window !== "undefined") {
  window.UrologyAdaptiveQuestionBank = { QUESTION_BANK };
  window.UrologyAdaptiveQuestioning = Object.assign({}, window.UrologyAdaptiveQuestioning || {}, { QUESTION_BANK });
}
}());
