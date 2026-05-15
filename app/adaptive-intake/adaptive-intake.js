const { QUESTION_BANK, rankQuestions, FIELD_LABELS } = window.UrologyAdaptiveQuestioning;
const VERSION = window.UroPrevisitVersion || { versionLabel: "v2.2.0" };
const LOCAL_ASR = window.UrologyLocalAsr;
const SPEECH_MATCHER = window.UrologySpeechAnswerMatching;
const MAX_PREVISIT_QUESTIONS = window.UrologyAdaptiveQuestioning.MAX_PREVISIT_QUESTIONS || 12;

const STORAGE_KEY = "urologyAdaptiveDemoState";
const LANGUAGE_KEY = "urologyAdaptiveDemoLanguage";
const DEFAULT_LANGUAGE = "zh";
// Audio preprocessing policy:
// Project AURA uses target-dBFS normalization and optional denoise for a desktop
// transcription app. This hospital demo deliberately does not mutate audio
// samples or expose normalization/denoise controls. It only reads browser RMS
// levels for VAD so the original microphone blob is sent to the RTX ASR server.
const ASR_VAD_TARGET_DBFS = -20;
const ASR_VAD_SPEECH_THRESHOLD_DBFS = -36;
const ASR_VAD_SILENCE_MS = 500;
const ASR_VAD_MIN_SPEECH_MS = 160;
const ASR_VAD_MAX_UTTERANCE_MS = 8000;
const ASR_RESTART_DELAY_MS = 450;

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
    inputCopy: "Click Start ASR once. The browser detects one spoken answer, sends it after 0.5 seconds of silence, matches visible choices, and advances.",
    transcriptLabel: "Current statement",
    transcriptPlaceholder: "Example: I wake up several times at night to pee.",
    startAsr: "Start continuous ASR",
    stopAsr: "Stop ASR",
    computeNext: "Find next question",
    asrIdle: "Local Breeze ASR requires npm run asr:local and RTX GPU/int8.",
    asrUnsupported: "This browser cannot record audio for local ASR. Use typed input.",
    asrListening: "Listening. The answer is sent after 0.5 seconds of silence.",
    asrStopped: "Speech segment ended. Transcribing with local RTX/int8 ASR.",
    asrProcessing: "Transcribing and matching this question's visible options.",
    asrReady: "Local ASR ready",
    asrChecking: "Checking local ASR endpoint.",
    asrMatched: "Matched answer",
    asrNoMatch: "Heard speech, but it did not match this question's visible options.",
    asrError: "Local ASR failed. Confirm npm run asr:local is running with RTX/int8.",
    asrCaptureError: "Browser microphone or recorder failed.",
    asrBackendError: "Local ASR failed. Confirm npm run asr:local is running with RTX/int8.",
    answeredEyebrow: "Answered",
    answeredEmpty: "No answers yet.",
    nextEyebrow: "Next question",
    waitingTitle: "Waiting",
    notRanked: "Not ranked",
    emptyTitle: "The first question is ready.",
    emptyBody: "Click an answer or start ASR. The system will continue from the selected answer.",
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
    inputCopy: "可直接點選；也可以按一次開始 ASR。系統會聽本題回答，安靜 0.5 秒後自動送出、比對選項並前進。",
    transcriptLabel: "目前說法",
    transcriptPlaceholder: "例如：我最近晚上一直起來尿，有時候突然很急。",
    startAsr: "開始連續 ASR",
    stopAsr: "停止 ASR",
    computeNext: "找下一題",
    asrIdle: "本機 Breeze ASR 需要先啟動 npm run asr:local，並使用 RTX GPU/int8。",
    asrUnsupported: "此瀏覽器無法錄音給本機 ASR；請使用文字輸入。",
    asrListening: "正在聽本題回答；偵測到 0.5 秒安靜就會自動送出。",
    asrStopped: "已切出本題語音，正在用本機 RTX/int8 ASR 轉文字。",
    asrProcessing: "正在轉文字並比對本題畫面上的選項。",
    asrReady: "本機 ASR 就緒",
    asrChecking: "正在確認本機 ASR 服務。",
    asrMatched: "已比對到答案",
    asrNoMatch: "有聽到語音，但沒有可靠對上本題畫面上的選項。",
    asrError: "本機 ASR 未成功；請確認 npm run asr:local 已啟動且使用 RTX/int8。",
    asrCaptureError: "瀏覽器麥克風或錄音器啟動失敗。",
    asrBackendError: "本機 ASR 未成功；請確認 npm run asr:local 已啟動且使用 RTX/int8。",
    answeredEyebrow: "已回答",
    answeredEmpty: "尚未回答任何欄位。",
    nextEyebrow: "下一題",
    waitingTitle: "等待",
    notRanked: "尚未排序",
    emptyTitle: "第一題已準備好。",
    emptyBody: "請直接點選答案，或開始 ASR。系統會依答案自動往下一題。",
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
let asrRecorder = null;
let asrStream = null;
let asrAudioContext = null;
let asrAudioSource = null;
let asrAnalyser = null;
let asrVadFrame = null;
let asrChunks = [];
let asrSessionActive = false;
let listening = false;
let asrTranscribing = false;
let asrSpeechStarted = false;
let asrSpeechStartedAt = 0;
let asrLastSpeechAt = 0;
let asrPeakDbfs = -90;
let asrStatusLastAt = 0;
let asrQuestionAtCapture = null;

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
  render();
}

function updateStaticCopy() {
  document.documentElement.lang = language === "zh" ? "zh-Hant" : "en";
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  transcriptInput.placeholder = t("transcriptPlaceholder");
  if (!listening && !asrTranscribing && !asrSessionActive) {
    asrStatus.textContent = t("asrIdle");
  }
  asrButton.textContent = asrSessionActive ? t("stopAsr") : t("startAsr");
  languageButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.langOption === language));
  });
}

function rankCurrentQuestion() {
  state.ranking = rankQuestions({
    transcript: state.transcript || "",
    answers: state.answers,
    askedQuestionIds: state.askedQuestionIds,
    questionBank: QUESTION_BANK
  });
  const selectedId = state.ranking.selected?.question?.id;
  state.completed = !selectedId || state.askedQuestionIds.includes(selectedId);
  state.current = state.completed ? null : state.ranking.selected;
}

function ensureInitialQuestion() {
  if (state.completed || state.current) return;
  if (flowComplete()) {
    state.completed = true;
    return;
  }
  rankCurrentQuestion();
  persistState();
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
  rankCurrentQuestion();
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
  ensureInitialQuestion();
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
  return /^(沒有|目前沒有|沒有看過|以上都沒有|不確定)$/.test(String(option || ""));
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

function visibleOptionPairs(question) {
  return (question?.options || []).map((option, index) => [option, optionText(question, option, index)]);
}

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function selectedDisplayFor(question, values) {
  return values.map((value) => {
    const index = question.options.indexOf(value);
    return index >= 0 ? optionText(question, value, index) : value;
  }).join(language === "en" ? ", " : "、");
}

function markVoiceSelectedValues(question, values) {
  if (isMultiChoice(question)) {
    const buttons = Array.from(questionMount.querySelectorAll("[data-multi-option]"));
    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", String(values.includes(button.dataset.multiOption)));
      button.classList.toggle("voice-selected", values.includes(button.dataset.multiOption));
    });
    updateMultiNextState();
    return;
  }

  Array.from(questionMount.querySelectorAll("[data-answer-value]")).forEach((button) => {
    const selected = values.includes(button.dataset.answerValue);
    button.classList.toggle("voice-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
}

function acousticScoresFrom(result) {
  return result?.acousticScores || result?.optionScores || result?.scores || null;
}

async function applyAsrTranscriptToQuestion(text, result, question) {
  if (!text || !question) return false;

  if (isOpenText(question)) {
    const openAnswer = questionMount.querySelector("#openAnswerInput");
    if (openAnswer) openAnswer.value = text;
    asrStatus.textContent = `${t("asrMatched")}：${text}`;
    await delay(320);
    answerCurrent(text);
    return true;
  }

  if (!SPEECH_MATCHER || !SPEECH_MATCHER.matchSpeechAnswer) {
    asrStatus.textContent = t("asrNoMatch");
    return false;
  }

  const match = SPEECH_MATCHER.matchSpeechAnswer({
    transcript: text,
    options: visibleOptionPairs(question),
    mode: isMultiChoice(question) ? "multi" : "single",
    acousticScores: acousticScoresFrom(result)
  });

  if (!match.accepted) {
    const heard = language === "en" ? `Heard: ${text}` : `我聽到：${text}`;
    asrStatus.textContent = `${t("asrNoMatch")} ${heard}`;
    showToast(t("asrNoMatch"));
    return false;
  }

  const values = isMultiChoice(question) ? match.values : [match.value];
  markVoiceSelectedValues(question, values);
  asrStatus.textContent = `${t("asrMatched")}：${selectedDisplayFor(question, values)}`;
  await delay(420);
  answerCurrent(isMultiChoice(question) ? values : values[0]);
  return true;
}

function stopVadLoop() {
  if (asrVadFrame) {
    window.cancelAnimationFrame(asrVadFrame);
  }
  asrVadFrame = null;
}

function stopAsrAudioAnalysis() {
  stopVadLoop();
  if (asrAudioSource) {
    try {
      asrAudioSource.disconnect();
    } catch (error) {
      // Ignore browser-specific disconnect races during capture shutdown.
    }
  }
  asrAudioSource = null;
  asrAnalyser = null;
  if (asrAudioContext) {
    asrAudioContext.close().catch(() => {});
  }
  asrAudioContext = null;
}

function stopAsrTracks() {
  stopAsrAudioAnalysis();
  if (asrStream) {
    asrStream.getTracks().forEach((track) => track.stop());
  }
  asrStream = null;
}

function audioDbfsFromAnalyser() {
  if (!asrAnalyser) return -100;
  const samples = new Float32Array(asrAnalyser.fftSize);
  asrAnalyser.getFloatTimeDomainData(samples);
  let sumSquares = 0;
  for (const sample of samples) {
    sumSquares += sample * sample;
  }
  const rms = Math.sqrt(sumSquares / samples.length);
  if (!Number.isFinite(rms) || rms <= 0.000001) return -100;
  return 20 * Math.log10(rms);
}

function vadComparableDbfs(rawDbfs) {
  if (rawDbfs > asrPeakDbfs) {
    asrPeakDbfs = rawDbfs;
  }
  if (asrPeakDbfs <= -80) return rawDbfs;
  return rawDbfs + (ASR_VAD_TARGET_DBFS - asrPeakDbfs);
}

function updateVadStatus(levelDbfs) {
  const now = performance.now();
  if (now - asrStatusLastAt < 300) return;
  asrStatusLastAt = now;
  const rounded = Math.round(levelDbfs);
  asrStatus.textContent = language === "en"
    ? `${t("asrListening")} VAD ${rounded} dBFS`
    : `${t("asrListening")} VAD ${rounded} dBFS`;
}

function stopAsrCapture({ submitAudio = true } = {}) {
  stopVadLoop();
  if (asrRecorder && asrRecorder.state !== "inactive") {
    asrRecorder._submitAudio = submitAudio;
    asrRecorder.stop();
    return;
  }
  listening = false;
  stopAsrTracks();
}

function runVadLoop() {
  if (!listening || !asrRecorder || asrRecorder.state === "inactive") return;
  const now = performance.now();
  const levelDbfs = vadComparableDbfs(audioDbfsFromAnalyser());
  const speechDetected = levelDbfs >= ASR_VAD_SPEECH_THRESHOLD_DBFS;
  updateVadStatus(levelDbfs);

  if (speechDetected) {
    if (!asrSpeechStarted) {
      asrSpeechStarted = true;
      asrSpeechStartedAt = now;
    }
    asrLastSpeechAt = now;
  }

  const speechLongEnough = asrSpeechStarted && (now - asrSpeechStartedAt >= ASR_VAD_MIN_SPEECH_MS);
  const silenceLongEnough = speechLongEnough && (now - asrLastSpeechAt >= ASR_VAD_SILENCE_MS);
  const utteranceTooLong = asrSpeechStarted && (now - asrSpeechStartedAt >= ASR_VAD_MAX_UTTERANCE_MS);
  if (silenceLongEnough || utteranceTooLong) {
    stopAsrCapture({ submitAudio: true });
    return;
  }

  asrVadFrame = window.requestAnimationFrame(runVadLoop);
}

function scheduleNextAsrCapture() {
  if (!asrSessionActive || listening || asrTranscribing || state.completed) return;
  window.setTimeout(() => {
    if (asrSessionActive && !listening && !asrTranscribing && !state.completed) {
      startAsrCapture();
    }
  }, ASR_RESTART_DELAY_MS);
}

function asrFailureText(error, fallbackKey = "asrError") {
  if (fallbackKey === "asrError" || fallbackKey === "asrBackendError") return t(fallbackKey);
  const message = String(error?.message || "").trim();
  if (!message) return t(fallbackKey);
  return `${t(fallbackKey)} ${language === "en" ? "Detail" : "細節"}：${message}`;
}

function stopAsrSessionAfterFailure(error, fallbackKey = "asrError") {
  asrSessionActive = false;
  listening = false;
  asrButton.disabled = false;
  asrButton.textContent = t("startAsr");
  asrStatus.textContent = asrFailureText(error, fallbackKey);
  if (error) console.error("[urology-asr]", error);
  stopAsrTracks();
}

async function transcribeAdaptiveAudio(blob, question) {
  try {
    asrTranscribing = true;
    asrStatus.textContent = t("asrStopped");
    const result = await LOCAL_ASR.transcribeBlob(blob, {
      mode: "adaptive-intake-vad",
      field: question?.asksFor?.[0] || "",
      question: question?.id || "",
      options: question ? visibleOptionPairs(question) : undefined
    });
    asrStatus.textContent = t("asrProcessing");
    const text = String(result.text || "").trim();
    transcriptInput.value = text;
    state.transcript = text;
    persistState();
    if (text) {
      await applyAsrTranscriptToQuestion(text, result, question);
    } else {
      asrStatus.textContent = "本機 ASR 沒有聽到可用文字；請再試一次或使用文字輸入。";
    }
  } catch (error) {
    stopAsrSessionAfterFailure(error, "asrBackendError");
  } finally {
    asrTranscribing = false;
    listening = false;
    asrButton.textContent = asrSessionActive ? t("stopAsr") : t("startAsr");
    stopAsrTracks();
    scheduleNextAsrCapture();
  }
}

async function startAsrCapture() {
  if (!LOCAL_ASR || !LOCAL_ASR.supported()) {
    asrSessionActive = false;
    asrButton.disabled = true;
    asrButton.textContent = t("startAsr");
    asrStatus.textContent = t("asrUnsupported");
    return;
  }

  try {
    asrStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    asrChunks = [];
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) throw new Error("browser cannot run VAD audio analysis");
    asrAudioContext = new AudioContextClass();
    asrAudioSource = asrAudioContext.createMediaStreamSource(asrStream);
    asrAnalyser = asrAudioContext.createAnalyser();
    asrAnalyser.fftSize = 2048;
    asrAudioSource.connect(asrAnalyser);
    const supportedTypes = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus"];
    const preferredMimeType = supportedTypes.find((type) => MediaRecorder.isTypeSupported(type)) || "";
    asrRecorder = preferredMimeType ? new MediaRecorder(asrStream, { mimeType: preferredMimeType }) : new MediaRecorder(asrStream);
    const recorderMimeType = asrRecorder.mimeType || "audio/webm";
    asrQuestionAtCapture = state.current?.question || null;
    asrSpeechStartedAt = 0;
    asrLastSpeechAt = 0;
    asrPeakDbfs = -90;
    asrStatusLastAt = 0;
    asrSpeechStarted = false;
    asrRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) asrChunks.push(event.data);
    };
    asrRecorder.onstop = () => {
      const blob = new Blob(asrChunks, { type: recorderMimeType });
      const submitAudio = asrRecorder?._submitAudio !== false;
      const question = asrQuestionAtCapture;
      asrRecorder = null;
      listening = false;
      stopAsrTracks();
      if (submitAudio && blob.size > 0 && asrSpeechStarted) {
        transcribeAdaptiveAudio(blob, question);
      } else {
        asrButton.textContent = asrSessionActive ? t("stopAsr") : t("startAsr");
        asrStatus.textContent = asrSessionActive ? t("asrListening") : t("asrIdle");
        scheduleNextAsrCapture();
      }
    };
    asrRecorder.start(250);
    listening = true;
    asrButton.textContent = t("stopAsr");
    asrStatus.textContent = t("asrListening");
    runVadLoop();
  } catch (error) {
    stopAsrSessionAfterFailure(error, "asrCaptureError");
  }
}

async function startAsrSession() {
  if (!LOCAL_ASR || !LOCAL_ASR.supported()) {
    asrButton.disabled = true;
    asrButton.textContent = t("startAsr");
    asrStatus.textContent = t("asrUnsupported");
    return;
  }

  asrButton.disabled = true;
  asrStatus.textContent = t("asrChecking");
  try {
    const health = await LOCAL_ASR.health();
    asrStatus.textContent = `${t("asrReady")}：${health.gpuNames.join("、")} / ${health.computeType}`;
  } catch (error) {
    stopAsrSessionAfterFailure(error, "asrBackendError");
    return;
  } finally {
    asrButton.disabled = false;
  }

  asrSessionActive = true;
  asrButton.textContent = t("stopAsr");
  if (!listening && !asrTranscribing) startAsrCapture();
}

function stopAsrSession() {
  asrSessionActive = false;
  asrButton.textContent = t("startAsr");
  if (listening) {
    stopAsrCapture({ submitAudio: asrSpeechStarted });
  } else {
    stopAsrTracks();
    if (!asrTranscribing) asrStatus.textContent = t("asrIdle");
  }
}

function setupAsr() {
  if (!LOCAL_ASR || !LOCAL_ASR.supported()) {
    asrButton.disabled = true;
    asrStatus.textContent = t("asrUnsupported");
    return;
  }
  LOCAL_ASR.health()
    .then((health) => {
      if (!asrSessionActive && !listening && !asrTranscribing) {
        asrStatus.textContent = `${t("asrReady")}：${health.gpuNames.join("、")} / ${health.computeType}`;
      }
    })
    .catch(() => {
      asrStatus.textContent = t("asrIdle");
    });
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
  if (asrSessionActive) {
    stopAsrSession();
  } else {
    startAsrSession();
  }
});

setupAsr();
ensureInitialQuestion();
render();
