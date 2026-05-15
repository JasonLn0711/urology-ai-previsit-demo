const { QUESTION_BANK, rankQuestions, FIELD_LABELS } = window.UrologyAdaptiveQuestioning;
const VERSION = window.UroPrevisitVersion || { versionLabel: "v2.1.0" };
const MAX_PREVISIT_QUESTIONS = window.UrologyAdaptiveQuestioning.MAX_PREVISIT_QUESTIONS || 12;

const STORAGE_KEY = "urologyAdaptiveDemoState";
const LANGUAGE_KEY = "urologyAdaptiveDemoLanguage";
const DEFAULT_LANGUAGE = "zh";

const UI_COPY = {
  en: {
    brandTitle: "UroPrevisit Navigator V2",
    brandSubtitle: "Compact guided previsit intake",
    sampleNocturia: "Night urination",
    samplePain: "Burning pain",
    sampleBlood: "Blood in urine",
    sampleVaguePain: "Unclear pain",
    sampleVagueUrinary: "Unclear urinary issue",
    reset: "Reset",
    shortMode: "Short form",
    heroEyebrow: "Version 2 demo",
    heroTitle: "Ask the next useful question, not every question.",
    heroLead: "The demo turns a patient statement into a state, then selects one governed follow-up question. ASR is optional. The ranking engine does not diagnose or recommend treatment.",
    proofV1: "v1 fixed form",
    proofV1Detail: "Patient follows the form",
    proofV2Detail: "System follows the patient state",
    proofNext: "Next question",
    proofBudget: "12-question cap",
    inputEyebrow: "Input",
    inputTitle: "Patient statement",
    inputCopy: "Type or paste what the patient said. ASR is optional.",
    transcriptLabel: "Current statement",
    transcriptPlaceholder: "Example: I wake up several times at night to pee.",
    startAsr: "Start ASR",
    stopAsr: "Stop ASR",
    computeNext: "Find next question",
    asrIdle: "ASR is off. Typed input is the fallback.",
    asrUnsupported: "This browser does not support Web Speech. Use typed input.",
    asrListening: "ASR is listening. Typed input still works.",
    asrStopped: "ASR stopped. You can find the next question.",
    asrError: "ASR had an error. Use typed input.",
    answeredEyebrow: "Answered",
    answeredEmpty: "No answers yet.",
    nextEyebrow: "Next question",
    waitingTitle: "Waiting",
    notRanked: "Not ranked",
    emptyTitle: "Enter a statement, then find the next question.",
    emptyBody: "The system will rank governed questions and show the selected follow-up.",
    selectedQuestion: "Selected question",
    whyQuestion: "Why this question",
    multiHint: "Select all that apply, then press Next.",
    singleHint: "Choose one answer to continue.",
    nextButton: "Next",
    typeAnswer: "Type answer",
    saveAnswer: "Save answer",
    answerSaved: "Answer saved. Recomputing the next question.",
    chooseAtLeastOne: "Choose at least one answer before continuing.",
    rankingEyebrow: "Ranking",
    rankingTitle: "Why this question?",
    rankingCopy: "The system ranks governed questions by fit, missing information, workflow value, ambiguity, and safety.",
    stateEyebrow: "State",
    noCandidates: "No candidates yet.",
    completeTitle: "Previsit intake summary is ready.",
    completeBody: "The compact question bank has collected the minimum useful history for clinician follow-up. The system stops here instead of adding diagnostic questions.",
    completeCount: "Questions answered",
    noState: "Not inferred yet",
    answeredFields: "Answered fields",
    missingFields: "Still missing",
    none: "None",
    notChecked: "Not checked yet.",
    clearEnough: "Clear enough",
    clearEnoughBody: "The statement can proceed to ordinary question ranking.",
    matched: "matched",
    selected: "selected",
    downranked: "downranked / skipped",
    turn: "Turn",
    components: {
      semantic: "Fit",
      missingInfo: "Gap",
      workflow: "Workflow",
      ambiguityReduction: "Clarity",
      safety: "Safety"
    }
  },
  zh: {
    brandTitle: "泌尿預診導航 V2",
    brandSubtitle: "12 題內門診前問診",
    sampleNocturia: "夜尿案例",
    samplePain: "尿痛案例",
    sampleBlood: "血尿案例",
    sampleVaguePain: "疼痛不清楚",
    sampleVagueUrinary: "尿尿怪怪",
    reset: "重新開始",
    shortMode: "短版問答",
    heroEyebrow: "V2 示範",
    heroTitle: "問下一個最有用的問題，而不是每題都問。",
    heroLead: "系統把病人說法轉成狀態，再從新版 12 題內題庫選出一題補問。ASR 可選；排序引擎不診斷、不建議治療。",
    proofV1: "V1 固定問卷",
    proofV1Detail: "病人跟著表單走",
    proofV2Detail: "系統跟著病人狀態走",
    proofNext: "下一題",
    proofBudget: "最多 12 題",
    inputEyebrow: "輸入",
    inputTitle: "病人說法",
    inputCopy: "可貼上病人說的話；ASR 只是可選輸入。",
    transcriptLabel: "目前說法",
    transcriptPlaceholder: "例如：我最近晚上一直起來尿，有時候突然很急。",
    startAsr: "開始 ASR",
    stopAsr: "停止 ASR",
    computeNext: "找下一題",
    asrIdle: "ASR 未啟動；可用文字輸入。",
    asrUnsupported: "此瀏覽器不支援 Web Speech；請使用文字輸入。",
    asrListening: "ASR 聆聽中；文字輸入仍可使用。",
    asrStopped: "ASR 已停止；可找下一題。",
    asrError: "ASR 發生錯誤；請改用文字輸入。",
    answeredEyebrow: "已回答",
    answeredEmpty: "尚未回答任何欄位。",
    nextEyebrow: "下一題",
    waitingTitle: "等待",
    notRanked: "尚未排序",
    emptyTitle: "輸入說法後，找下一題。",
    emptyBody: "系統會排序受治理題庫，並顯示選出的補問。",
    selectedQuestion: "系統選題",
    whyQuestion: "為什麼問這題",
    multiHint: "可複選；勾選完畢後請按下一步。",
    singleHint: "選一個答案後會繼續。",
    nextButton: "下一步",
    typeAnswer: "自由輸入",
    saveAnswer: "儲存回答",
    answerSaved: "答案已記錄，正在重新計算下一題。",
    chooseAtLeastOne: "請至少選一個答案後再繼續。",
    rankingEyebrow: "排序",
    rankingTitle: "為什麼選這題？",
    rankingCopy: "系統依照語意、缺口、流程價值、模糊度與安全邊界排序。",
    stateEyebrow: "狀態",
    noCandidates: "尚未產生候選題。",
    completeTitle: "門診前問診整理已完成。",
    completeBody: "新版題庫已收集醫師接手問診前需要的最小病史資訊；系統到此停止，不再加入診斷題。",
    completeCount: "已回答題數",
    noState: "尚未推定",
    answeredFields: "已回答欄位",
    missingFields: "仍缺資訊",
    none: "暫無",
    notChecked: "尚未檢查。",
    clearEnough: "描述已足夠",
    clearEnoughBody: "目前描述可進入一般題庫排序。",
    matched: "符合",
    selected: "已選",
    downranked: "降權或略過",
    turn: "第",
    components: {
      semantic: "語意",
      missingInfo: "缺口",
      workflow: "流程",
      ambiguityReduction: "縮小模糊",
      safety: "安全"
    }
  }
};

const SAMPLE_TRANSCRIPTS = {
  en: {
    nocturia: "I wake up several times at night to pee.",
    pain: "It burns when I pee.",
    blood: "I saw red urine today and maybe a small blood clot. I am not sure what it means.",
    vaguePain: "I feel pain down there, but I am not sure exactly where.",
    vagueUrinary: "Urination feels weird and uncomfortable, but I am not sure how to explain it."
  },
  zh: {
    nocturia: "我最近晚上會起來尿，有時候白天也常跑廁所，而且突然很急。",
    pain: "尿尿會刺痛，有灼熱感。",
    blood: "我今天看到尿液有點紅紅的，好像也有一點血塊，不確定是不是血尿，所以想先問清楚。",
    vaguePain: "我下面會痛，但我說不太清楚是哪裡痛。",
    vagueUrinary: "我尿尿怪怪的，怪怪不舒服，但不知道怎麼講。"
  }
};

const QUESTION_COPY = {
  clarify_pain_location: {
    text: "Where is the pain or discomfort closest to?",
    value: "Clarifies location before the system follows an ordinary symptom path.",
    options: ["Burning in the urethra while urinating", "Lower belly discomfort", "Genital or scrotal pain", "Perineal pain", "Not sure"]
  },
  clarify_urinary_symptom_type: {
    text: "When you say urination feels unusual, which is closest?",
    value: "Turns vague wording into a clearer symptom direction.",
    options: ["More frequent or nighttime urination", "Pain or burning while urinating", "Hard to urinate or weaker stream", "Red or tea-colored urine", "Urine leakage", "Not sure"]
  },
  duration: {
    text: "About how long has this been going on?",
    value: "Adds timing so the visit summary is easier to read.",
    options: ["Today", "1 to 7 days", "1 to 4 weeks", "More than 1 month", "Not sure"]
  },
  bother_score: {
    text: "On a 0 to 10 scale, how bothersome is it right now?",
    value: "Captures how much this is affecting the patient.",
    options: ["0-2", "3-5", "6-8", "9-10", "Not sure"]
  },
  nocturia_count: {
    text: "After falling asleep, how many times do you usually wake up to urinate?",
    value: "Quantifies nighttime urination.",
    options: ["0 times", "1 time", "2 times", "3 or more times", "Not sure"]
  },
  urgency: {
    text: "Do you suddenly need to urinate and have trouble holding it?",
    value: "Checks for urinary urgency.",
    options: ["No", "Yes", "Not sure"]
  },
  daytime_frequency: {
    text: "About how many times do you urinate during the day?",
    value: "Adds a daytime frequency range.",
    options: ["1 to 4 times", "5 to 8 times", "9 to 12 times", "More than 12 times", "Not sure"]
  },
  leakage: {
    text: "In the past 4 weeks, has urine leaked by accident?",
    value: "Checks whether leakage happened before asking details.",
    options: ["No", "Yes", "Not sure"]
  },
  leakage_trigger: {
    text: "When does leakage most often happen?",
    value: "Adds the leakage situation.",
    options: ["Cannot reach the bathroom in time", "Coughing, laughing, or exercise", "During sleep", "No clear reason", "Not sure"]
  },
  unable_to_urinate: {
    text: "Do you feel the urge to urinate but have trouble starting, or cannot urinate at all?",
    value: "Checks for difficulty urinating.",
    options: ["No", "Yes", "Not sure"]
  },
  current_retention: {
    text: "Are you still unable to urinate right now?",
    value: "Flags current inability to urinate for clinician review.",
    options: ["No", "Yes", "Not sure"]
  },
  pain_burning: {
    text: "Does it hurt, sting, or burn when you urinate?",
    value: "Turns burning pain into a structured history field.",
    options: ["No", "Yes", "Not sure"]
  },
  systemic_symptoms: {
    text: "Recently, have you had any fever, chills, or pain on both sides of your lower back?",
    value: "Checks symptoms that should be visible to clinical staff.",
    options: ["Fever", "Chills", "Pain on both sides of the lower back", "None of these", "Not sure"]
  },
  visible_blood: {
    text: "Have you seen red or tea-colored urine, or blood clots?",
    value: "Records visible blood-related observations.",
    options: ["No", "Yes", "Not sure"]
  },
  hematuria_pattern: {
    text: "If you saw blood, was it one time, repeated, or almost every time recently?",
    value: "Adds the pattern of visible blood.",
    options: ["One time", "More than once", "Almost every time recently", "Not sure"]
  },
  chief_complaint_open: {
    text: "What urinary issue do you most want the clinician to know about today?",
    value: "Captures the main concern in the patient's own words.",
    options: ["Type response"]
  },
  most_bothersome_symptom: {
    text: "Which symptom bothers you the most right now?",
    value: "Identifies the patient's main priority.",
    options: ["Nighttime or frequent urination", "Urgency or hard to hold", "Pain or burning", "Blood in urine", "Difficulty urinating", "Other"]
  },
  symptom_start_pattern: {
    text: "Did the symptom start suddenly, gradually, or come and go?",
    value: "Adds how the symptom started.",
    options: ["Started suddenly", "Gradually became noticeable", "Comes and goes", "Not sure"]
  },
  nocturia_sleep_impact: {
    text: "Does waking up to urinate clearly affect your sleep?",
    value: "Captures sleep impact.",
    options: ["Not much", "A little", "Clearly affects sleep", "Not sure"]
  },
  fluid_context_evening: {
    text: "Before bed, do you often drink a lot of water, tea, coffee, or alcohol?",
    value: "Adds evening fluid context.",
    options: ["Rarely", "Sometimes", "Often", "Not sure"]
  },
  urgency_hold_time: {
    text: "After you feel the urge, how long can you usually hold it?",
    value: "Quantifies urgency impact.",
    options: ["More than 10 minutes", "About 5 to 10 minutes", "Less than 5 minutes", "Almost no time", "Not sure"]
  },
  daytime_urgency_impact: {
    text: "Does urgency or frequent urination affect work, school, going out, or sleep?",
    value: "Captures daily-life impact.",
    options: ["No impact", "A little impact", "Clear impact", "Not sure"]
  },
  incomplete_emptying: {
    text: "After urinating, do you feel your bladder is not fully empty?",
    value: "Adds an emptying symptom.",
    options: ["No", "Yes", "Not sure"]
  },
  weak_stream: {
    text: "Is your urine stream thinner, weaker, or stop-and-go?",
    value: "Adds urine stream pattern.",
    options: ["No", "Yes", "Not sure"]
  },
  straining_to_void: {
    text: "Do you need to push or wait a long time before urine starts?",
    value: "Adds straining or hesitancy.",
    options: ["No", "Yes", "Not sure"]
  },
  pain_timing: {
    text: "Is the pain usually before urination, during urination, after urination, or unrelated?",
    value: "Clarifies timing of pain.",
    options: ["Before urination", "During urination", "After urination", "Unrelated to urination", "Not sure"]
  },
  pain_location_detail: {
    text: "Where is the pain most noticeable?",
    value: "Adds a structured pain location.",
    options: ["Urethra", "Lower belly", "Genital or scrotal area", "Perineum", "Side or back", "Not sure"]
  },
  lower_abdominal_pain: {
    text: "Do you have pain, pressure, or fullness near the lower belly or bladder?",
    value: "Separates lower-belly discomfort from other pain.",
    options: ["No", "Yes", "Not sure"]
  },
  flank_pain: {
    text: "Do you have pain on either side of your lower back?",
    value: "Records side or back pain for clinician review.",
    options: ["No", "Yes", "Not sure"]
  },
  fever_chills: {
    text: "During this episode, have you had fever or chills?",
    value: "Checks fever or chills without diagnosing.",
    options: ["No", "Fever", "Chills", "Both", "Not sure"]
  },
  visible_blood_color: {
    text: "If urine looked abnormal, what did you see?",
    value: "Records the observed color or clot description.",
    options: ["Pink", "Bright red", "Tea-colored or dark", "Blood clot", "Not sure"]
  },
  similar_symptoms_before: {
    text: "Have you had similar urinary symptoms before?",
    value: "Adds past history context.",
    options: ["No", "Yes", "Not sure"]
  },
  uti_history: {
    text: "Have you ever been told by a clinician that you had a urinary tract infection?",
    value: "Records past clinician-told history only.",
    options: ["No", "Yes", "Not sure"]
  },
  stone_history: {
    text: "Have you ever had urinary stones or kidney stones?",
    value: "Adds stone history context.",
    options: ["No", "Yes", "Not sure"]
  },
  urologic_surgery_history: {
    text: "Have you had any urology-related surgery or procedure before?",
    value: "Adds prior urology procedure context.",
    options: ["No", "Yes", "Not sure"]
  },
  diabetes_kidney_history: {
    text: "Do you have diabetes, kidney disease, or another chronic condition clinicians should know about?",
    value: "Adds background conditions for clinician review.",
    options: ["No", "Diabetes", "Kidney disease", "Other chronic condition", "Not sure"]
  },
  new_medication_context: {
    text: "Recently, did you start, stop, or change any medication?",
    value: "Adds recent medication-change context.",
    options: ["No", "Started a new medication", "Stopped or changed medication", "Not sure"]
  },
  clinician_priority: {
    text: "If you could tell the clinician one thing first, what should it be?",
    value: "Preserves the patient's priority.",
    options: ["Type response"]
  },
  closing_review: {
    text: "Is there anything else you want to add that we did not ask?",
    value: "Gives the patient a closing chance to add context.",
    options: ["Type response"]
  },
  clarify_pain_burning_conflict: {
    text: "To confirm: do you currently have pain, stinging, or burning when you urinate?",
    value: "Clarifies a possible conflict in the answers.",
    options: ["No, not currently", "Yes, currently", "Not sure"]
  },
  medication_list: {
    text: "Can you provide current medication information today, such as a medication bag, list, or photo?",
    value: "Collects medication background without asking the patient to remember names.",
    options: ["Can provide it", "Remember only part of it", "No regular medication", "Not sure"]
  }
};

const FIELD_LABELS_EN = {
  compactPrimaryConcern: "Main urinary concern",
  durationBother: "Duration and bother",
  compactStorageSymptoms: "Frequency, nocturia, or urgency",
  compactLeakagePattern: "Leakage pattern",
  compactVoidingSymptoms: "Voiding difficulty",
  compactPainSystemic: "Pain, burning, fever, or chills",
  compactVisibleBlood: "Visible blood or clot",
  compactBackgroundMedication: "Background and medication information",
  compactClosingNote: "Final note",
  chiefComplaint: "Main concern",
  duration: "Duration",
  botherScore: "Bother score",
  nocturiaCount: "Night urination count",
  urgency: "Urgency",
  daytimeFrequencyCount: "Daytime frequency",
  leakage: "Leakage",
  leakageTriggers: "Leakage situation",
  unableToUrinate: "Difficulty urinating",
  currentlyUnableToUrinate: "Currently unable to urinate",
  painBurning: "Pain or burning",
  systemicSymptoms: "Fever, chills, or side/back pain",
  visibleBlood: "Visible blood or clot",
  hematuriaPattern: "Blood pattern",
  mostBothersomeSymptom: "Most bothersome symptom",
  symptomStartPattern: "Start pattern",
  nocturiaSleepImpact: "Sleep impact",
  fluidContext: "Evening fluids",
  urgencyHoldTime: "Urgency hold time",
  daytimeUrgencyImpact: "Daily impact",
  incompleteEmptying: "Incomplete emptying",
  weakStream: "Weak stream",
  straining: "Straining",
  painTiming: "Pain timing",
  painLocationDetail: "Pain location",
  lowerAbdominalPain: "Lower-belly pain or pressure",
  flankPain: "Side or back pain",
  feverChills: "Fever or chills",
  visibleBloodColor: "Urine color or clot",
  similarSymptomsBefore: "Similar symptoms before",
  utiHistory: "UTI history",
  stoneHistory: "Stone history",
  urologicSurgeryHistory: "Urology surgery/procedure history",
  diabetesKidneyHistory: "Diabetes, kidney, or chronic condition",
  medicationListStatus: "Medication information",
  newMedicationContext: "Recent medication change",
  clinicianPriority: "Clinician priority",
  closingReview: "Closing addition",
  painBurningConflict: "Pain/burning confirmation",
  painLocationClarification: "Pain location clarification",
  urinarySymptomClarification: "Urinary symptom clarification"
};

const SYMPTOM_LABELS_EN = {
  frequency: "frequency",
  nocturia: "night urination",
  urgency: "urgency",
  leakage: "leakage",
  voiding: "voiding difficulty",
  retention: "retention concern",
  pain: "pain",
  infection: "infection-context symptoms",
  hematuria: "blood in urine",
  flank_pain: "side/back pain",
  lower_abdominal_pain: "lower-belly pain",
  red_flag: "clinician-review item",
  context: "background context",
  general: "general"
};

const transcriptInput = document.querySelector("#transcriptInput");
const computeButton = document.querySelector("#computeButton");
const asrButton = document.querySelector("#asrButton");
const asrStatus = document.querySelector("#asrStatus");
const resetDemo = document.querySelector("#resetDemo");
const versionBadge = document.querySelector("#versionBadge");
const loadNocturia = document.querySelector("#loadNocturia");
const loadPain = document.querySelector("#loadPain");
const loadBlood = document.querySelector("#loadBlood");
const loadVaguePain = document.querySelector("#loadVaguePain");
const loadVagueUrinary = document.querySelector("#loadVagueUrinary");
const answeredFacts = document.querySelector("#answeredFacts");
const questionTitle = document.querySelector("#question-title");
const questionMount = document.querySelector("#questionMount");
const turnLabel = document.querySelector("#turnLabel");
const scoreLabel = document.querySelector("#scoreLabel");
const stateSummary = document.querySelector("#stateSummary");
const ambiguityMount = document.querySelector("#ambiguityMount");
const rankingMount = document.querySelector("#rankingMount");
const toast = document.querySelector("#toast");
const languageButtons = Array.from(document.querySelectorAll("[data-lang-option]"));

let state = restoreState();
let language = restoreLanguage();
let recognition = null;
let listening = false;

function emptyState() {
  return {
    transcript: "",
    answers: {},
    askedQuestionIds: [],
    current: null,
    ranking: null,
    turn: 0,
    completed: false
  };
}

function restoreState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? Object.assign(emptyState(), JSON.parse(raw)) : emptyState();
  } catch (error) {
    return emptyState();
  }
}

function restoreLanguage() {
  return DEFAULT_LANGUAGE;
}

function persistState() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    // The demo still works in memory when localStorage is unavailable.
  }
}

function persistLanguage() {
  try {
    window.localStorage.setItem(LANGUAGE_KEY, language);
  } catch (error) {
    // Language switching still works for the current page session.
  }
}

function t(key) {
  return UI_COPY[language][key] || UI_COPY.en[key] || key;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.hidden = true;
  }, 1800);
}

function questionText(question) {
  return language === "en" ? (QUESTION_COPY[question.id]?.text || question.text) : question.text;
}

function questionValue(question) {
  return language === "en" ? (QUESTION_COPY[question.id]?.value || question.value) : question.value;
}

function optionText(question, option, index) {
  return language === "en" ? (QUESTION_COPY[question.id]?.options?.[index] || option) : option;
}

function fieldLabel(field) {
  return language === "en" ? (FIELD_LABELS_EN[field] || field) : (FIELD_LABELS[field] || field);
}

function displayValue(field, value) {
  const question = QUESTION_BANK.find((item) => (item.asksFor || []).includes(field));
  if (!question) return Array.isArray(value) ? value.join(", ") : value;
  const values = Array.isArray(value) ? value : [value];
  const rendered = values.map((item) => {
    const index = question.options.indexOf(item);
    return index >= 0 ? optionText(question, item, index) : item;
  });
  return rendered.join(language === "en" ? ", " : "、");
}

function displaySymptom(value) {
  return language === "en" ? (SYMPTOM_LABELS_EN[value] || value) : value;
}

function reasonText(reason, question) {
  if (language === "zh") return reason;
  if (reason.includes("先釐清")) return "Clarifies ambiguous wording before ranking ordinary follow-up questions.";
  if (reason.includes("語意狀態符合") || reason.includes("語意接近")) return "Matches the current patient statement.";
  if (reason.includes("補足缺口")) return `Fills missing information: ${(question.asksFor || []).map(fieldLabel).join(", ")}.`;
  if (reason.includes("高流程價值")) return "High value for the previsit summary.";
  if (reason.includes("優先告知")) return "Should be visible for clinician review.";
  if (reason.includes("已問過")) return "Downranked because it was already asked.";
  if (reason.includes("已有答案")) return "Downranked because this field already has an answer.";
  if (reason.includes("前置資訊")) return "Downranked until prerequisite information is known.";
  if (reason.includes("active ambiguity")) return "Downranked because no active ambiguity matches this clarification.";
  if (reason.includes("模糊")) return "Downranked while ambiguous wording is being clarified.";
  if (reason.includes("超出")) return "Excluded because it is outside this demo boundary.";
  return "General background follow-up candidate.";
}

function setLanguage(nextLanguage) {
  language = "zh";
  persistLanguage();
  if (recognition) recognition.lang = "zh-TW";
  render();
}

function updateStaticCopy() {
  document.documentElement.lang = language === "zh" ? "zh-Hant" : "en";
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  transcriptInput.placeholder = t("transcriptPlaceholder");
  asrStatus.textContent = listening ? t("asrListening") : t("asrIdle");
  asrButton.textContent = listening ? t("stopAsr") : t("startAsr");
  languageButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.langOption === language));
  });
}

function computeNext() {
  state.transcript = transcriptInput.value.trim();
  if (flowComplete()) {
    state.current = null;
    state.ranking = null;
    state.completed = true;
    persistState();
    render();
    return;
  }
  state.ranking = rankQuestions({
    transcript: state.transcript,
    answers: state.answers,
    askedQuestionIds: state.askedQuestionIds,
    questionBank: QUESTION_BANK
  });
  const selectedId = state.ranking.selected?.question?.id;
  state.completed = !selectedId || state.askedQuestionIds.includes(selectedId);
  state.current = state.completed ? null : state.ranking.selected;
  persistState();
  render();
}

function answerCurrent(value) {
  if (!state.current) return;
  const question = state.current.question;
  const field = question.asksFor[0];
  state.answers[field] = value;
  if (!state.askedQuestionIds.includes(question.id)) {
    state.askedQuestionIds.push(question.id);
  }
  state.turn += 1;
  state.completed = false;
  showToast(t("answerSaved"));
  computeNext();
}

function flowComplete() {
  const asked = new Set(state.askedQuestionIds || []);
  return state.turn >= MAX_PREVISIT_QUESTIONS ||
    QUESTION_BANK.every((question) => asked.has(question.id));
}

function reset() {
  state = emptyState();
  transcriptInput.value = "";
  persistState();
  render();
}

function loadSample(name) {
  state = emptyState();
  state.transcript = SAMPLE_TRANSCRIPTS[language][name] || "";
  transcriptInput.value = state.transcript;
  computeNext();
}

function render() {
  updateStaticCopy();
  if (versionBadge) {
    versionBadge.textContent = VERSION.versionLabel;
    versionBadge.title = `${VERSION.product || "UroPrevisit Navigator"} ${VERSION.stage || "demo"}`;
  }
  transcriptInput.value = state.transcript || transcriptInput.value;
  renderFacts();
  renderQuestion();
  renderRanking();
  renderStateSummary();
  renderAmbiguity();
}

function renderFacts() {
  const entries = Object.entries(state.answers);
  if (!entries.length) {
    answeredFacts.innerHTML = `<p class="muted-copy">${escapeHtml(t("answeredEmpty"))}</p>`;
    return;
  }
  answeredFacts.innerHTML = entries.map(([field, value]) => `
    <div class="fact-item adaptive-fact-item">
      <strong title="${escapeHtml(fieldLabel(field))}">${escapeHtml(fieldLabel(field))}</strong>
      <span title="${escapeHtml(displayValue(field, value))}">${escapeHtml(displayValue(field, value))}</span>
    </div>
  `).join("");
}

function isMultiChoice(question) {
  return question.answerType === "multi_choice";
}

function isOpenText(question) {
  return question.answerType === "open_text";
}

function isExclusiveOption(option) {
  return ["沒有", "以上都沒有", "不確定"].includes(option);
}

function renderQuestion() {
  turnLabel.textContent = language === "en"
    ? `${t("turn")} ${Math.min(state.turn + 1, MAX_PREVISIT_QUESTIONS)} / ${MAX_PREVISIT_QUESTIONS}`
    : `${t("turn")} ${Math.min(state.turn + 1, MAX_PREVISIT_QUESTIONS)} / ${MAX_PREVISIT_QUESTIONS} 題`;
  if (state.completed) {
    questionTitle.textContent = t("completeTitle");
    scoreLabel.textContent = `${t("completeCount")} ${state.turn}/${MAX_PREVISIT_QUESTIONS}`;
    questionMount.innerHTML = `
      <div class="adaptive-empty complete">
        <h3>${escapeHtml(t("completeTitle"))}</h3>
        <p>${escapeHtml(t("completeBody"))}</p>
      </div>
    `;
    return;
  }
  if (!state.current) {
    questionTitle.textContent = t("waitingTitle");
    scoreLabel.textContent = t("notRanked");
    questionMount.innerHTML = `
      <div class="adaptive-empty">
        <h3>${escapeHtml(t("emptyTitle"))}</h3>
        <p>${escapeHtml(t("emptyBody"))}</p>
      </div>
    `;
    return;
  }

  const question = state.current.question;
  questionTitle.textContent = questionText(question);
  scoreLabel.textContent = language === "en"
    ? `score ${state.current.score.toFixed(2)}`
    : `分數 ${state.current.score.toFixed(2)}`;
  questionMount.innerHTML = `
    <div class="selected-question-card">
      <p class="eyebrow">${escapeHtml(t("selectedQuestion"))}</p>
      <h3>${escapeHtml(questionText(question))}</h3>
      <p>${escapeHtml(questionValue(question))}</p>
      <div class="component-grid" aria-label="${escapeHtml(language === "en" ? "Score components" : "分數組成")}">
        ${component(t("components").semantic, state.current.components.semantic)}
        ${component(t("components").missingInfo, state.current.components.missingInfo)}
        ${component(t("components").workflow, state.current.components.workflow)}
        ${component(t("components").ambiguityReduction, state.current.components.ambiguityReduction)}
        ${component(t("components").safety, state.current.components.safety)}
      </div>
      ${renderAnswerControl(question)}
      <div class="reason-box">
        <strong>${escapeHtml(t("whyQuestion"))}</strong>
        <ul>
          ${state.current.reasons.map((reason) => `<li>${escapeHtml(reasonText(reason, question))}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;
}

function renderAnswerControl(question) {
  if (isOpenText(question)) {
    return `
      <div class="open-answer-control">
        <label class="adaptive-label" for="openAnswerInput">${escapeHtml(t("typeAnswer"))}</label>
        <textarea id="openAnswerInput" class="adaptive-transcript compact" rows="3"></textarea>
        <button class="primary-button answer-next-button" type="button" data-submit-open>${escapeHtml(t("saveAnswer"))}</button>
      </div>
    `;
  }

  if (isMultiChoice(question)) {
    return `
      <p class="answer-instruction">${escapeHtml(t("multiHint"))}</p>
      <div class="answer-grid multi-answer-grid" role="group" aria-label="${escapeHtml(language === "en" ? "Answer options" : "回答選項")}">
        ${question.options.map((option, index) => `
          <button class="option-button adaptive-answer-button multi-option-button" type="button" data-multi-option="${escapeHtml(option)}" aria-pressed="false">
            <strong>${escapeHtml(optionText(question, option, index))}</strong>
          </button>
        `).join("")}
      </div>
      <button class="primary-button answer-next-button" type="button" data-submit-multi disabled>${escapeHtml(t("nextButton"))}</button>
    `;
  }

  return `
    <p class="answer-instruction">${escapeHtml(t("singleHint"))}</p>
    <div class="answer-grid" role="group" aria-label="${escapeHtml(language === "en" ? "Answer options" : "回答選項")}">
      ${question.options.map((option, index) => `
        <button class="option-button adaptive-answer-button" type="button" data-answer-value="${escapeHtml(option)}">
          <strong>${escapeHtml(optionText(question, option, index))}</strong>
        </button>
      `).join("")}
    </div>
  `;
}

function component(label, value) {
  const percent = Math.max(0, Math.min(100, Math.round(value * 100)));
  return `
    <div class="score-component" style="--score-width: ${percent}%">
      <span>${escapeHtml(label)}</span>
      <strong>${percent}</strong>
      <i aria-hidden="true"></i>
    </div>
  `;
}

function renderRanking() {
  const items = state.ranking?.ranked?.slice(0, 3) || [];
  if (!items.length) {
    rankingMount.innerHTML = `<p class="muted-copy">${escapeHtml(t("noCandidates"))}</p>`;
    return;
  }
  rankingMount.innerHTML = items.map((item, index) => `
    <article class="ranking-item ${index === 0 ? "selected" : ""}">
      <div>
        <span>#${index + 1}</span>
        <strong>${escapeHtml(questionText(item.question))}</strong>
      </div>
      <small>${escapeHtml(language === "en" ? "score" : "分數")} ${item.score.toFixed(2)} | ${escapeHtml(language === "en" ? "fit" : "語意")} ${item.components.semantic} | ${escapeHtml(language === "en" ? "gap" : "缺口")} ${item.components.missingInfo}</small>
      <em>${index === 0 ? t("selected") : t("downranked")}</em>
      <ul>
        ${item.reasons.slice(0, 2).map((reason) => `<li>${escapeHtml(reasonText(reason, item.question))}</li>`).join("")}
      </ul>
    </article>
  `).join("");
}

function renderStateSummary() {
  const symptoms = state.ranking?.state?.symptoms || [];
  const fields = state.ranking?.state?.answeredFields || [];
  const missing = state.ranking?.state?.missingFields || [];
  stateSummary.innerHTML = `
    <div class="state-pill-group">
      ${(symptoms.length ? symptoms : [t("noState")]).map((item) => `<span>${escapeHtml(displaySymptom(item))}</span>`).join("")}
    </div>
    <p class="muted-copy">${escapeHtml(t("answeredFields"))}: ${fields.length ? fields.map(fieldLabel).join(language === "en" ? ", " : "、") : t("none")}</p>
    <p class="muted-copy">${escapeHtml(t("missingFields"))}: ${missing.length ? missing.slice(0, 6).map(fieldLabel).join(language === "en" ? ", " : "、") : t("none")}</p>
  `;
}

function renderAmbiguity() {
  const status = state.ranking?.state?.ambiguityStatus || "not_checked";
  const items = state.ranking?.state?.ambiguity || [];
  if (status === "not_checked") {
    ambiguityMount.innerHTML = `<p class="muted-copy">${escapeHtml(t("notChecked"))}</p>`;
    return;
  }
  if (status === "clear_enough") {
    ambiguityMount.innerHTML = `
      <div class="ambiguity-card clear">
        <strong>${escapeHtml(t("clearEnough"))}</strong>
        <span>${escapeHtml(t("clearEnoughBody"))}</span>
      </div>
    `;
    return;
  }
  ambiguityMount.innerHTML = items.filter((item) => item.active).map((item) => `
    <div class="ambiguity-card active">
      <strong>${escapeHtml(language === "en" ? "Clarification needed" : item.label)}</strong>
      <span>${escapeHtml(language === "en" ? "The statement is unclear, so the system asks a clarification question first." : item.reason)}</span>
      <small>${escapeHtml(t("matched"))}: ${escapeHtml(item.patternHits.join(language === "en" ? ", " : "、"))}</small>
    </div>
  `).join("");
}

function selectedMultiValues() {
  return Array.from(questionMount.querySelectorAll("[data-multi-option][aria-pressed='true']"))
    .map((button) => button.dataset.multiOption);
}

function updateMultiNextState() {
  const nextButton = questionMount.querySelector("[data-submit-multi]");
  if (nextButton) nextButton.disabled = selectedMultiValues().length === 0;
}

function toggleMultiOption(button) {
  const option = button.dataset.multiOption;
  const selected = button.getAttribute("aria-pressed") === "true";
  const allButtons = Array.from(questionMount.querySelectorAll("[data-multi-option]"));

  if (!selected && isExclusiveOption(option)) {
    allButtons.forEach((item) => item.setAttribute("aria-pressed", "false"));
  } else if (!selected) {
    allButtons
      .filter((item) => isExclusiveOption(item.dataset.multiOption))
      .forEach((item) => item.setAttribute("aria-pressed", "false"));
  }

  button.setAttribute("aria-pressed", String(!selected));
  updateMultiNextState();
}

function setupAsr() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    asrButton.disabled = true;
    asrStatus.textContent = t("asrUnsupported");
    return;
  }
  recognition = new SpeechRecognition();
  recognition.lang = language === "zh" ? "zh-TW" : "en-US";
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.onstart = () => {
    listening = true;
    asrButton.textContent = t("stopAsr");
    asrStatus.textContent = t("asrListening");
  };
  recognition.onend = () => {
    listening = false;
    asrButton.textContent = t("startAsr");
    asrStatus.textContent = t("asrStopped");
  };
  recognition.onerror = () => {
    asrStatus.textContent = t("asrError");
  };
  recognition.onresult = (event) => {
    const text = Array.from(event.results)
      .map((result) => result[0]?.transcript || "")
      .join("");
    transcriptInput.value = text;
    state.transcript = text;
    persistState();
  };
}

computeButton.addEventListener("click", computeNext);
resetDemo.addEventListener("click", reset);
loadNocturia.addEventListener("click", () => loadSample("nocturia"));
loadPain.addEventListener("click", () => loadSample("pain"));
loadBlood.addEventListener("click", () => loadSample("blood"));
loadVaguePain.addEventListener("click", () => loadSample("vaguePain"));
loadVagueUrinary.addEventListener("click", () => loadSample("vagueUrinary"));
transcriptInput.addEventListener("input", () => {
  state.transcript = transcriptInput.value;
  persistState();
});
languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.langOption));
});
questionMount.addEventListener("click", (event) => {
  const optionButton = event.target.closest("[data-answer-value]");
  if (optionButton) {
    answerCurrent(optionButton.dataset.answerValue);
    return;
  }

  const multiButton = event.target.closest("[data-multi-option]");
  if (multiButton) {
    toggleMultiOption(multiButton);
    return;
  }

  if (event.target.closest("[data-submit-multi]")) {
    const values = selectedMultiValues();
    if (!values.length) {
      showToast(t("chooseAtLeastOne"));
      return;
    }
    answerCurrent(values);
    return;
  }

  if (event.target.closest("[data-submit-open]")) {
    const value = questionMount.querySelector("#openAnswerInput")?.value.trim();
    if (value) answerCurrent(value);
  }
});
asrButton.addEventListener("click", () => {
  if (!recognition) return;
  if (listening) {
    recognition.stop();
  } else {
    recognition.start();
  }
});

setupAsr();
render();
