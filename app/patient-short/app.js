const { completionStatus } = window.UrologyPrevisit;
const { SYNTHETIC_CASES } = window.UrologyCases;

const STORAGE_KEY = "urologyPrevisitAnswers";
const QUESTION_TOTAL = 9;

const ARRAY_FIELDS = new Set([
  "chiefConcern",
  "systemicSymptoms",
  "fluidCaffeineContext",
  "leakageTriggers",
  "hematuriaCoSymptoms",
  "relevantComorbidities"
]);

const SOURCE_LABELS = {
  declared_on_entry: "填答開始時標記",
  patient_self: "本人回答",
  patient_with_family_operator: "本人回答，家人協助操作",
  family_observation: "家屬觀察",
  unknown: "未標記"
};

const VALUE_LABELS = {
  "Patient self-filled": "我自己回答",
  "Family helped operate; patient answered": "家人協助操作，本人回答",
  "Family or helper-assisted": "家人依觀察協助回答",
  "Frequency / nocturia / urgency": "頻尿、夜尿或急尿",
  Leakage: "漏尿",
  "Difficulty emptying or weak stream": "排尿困難或尿流變弱",
  "Pain, burning, or possible infection": "尿痛、灼熱或疑似感染",
  "Recurrent infection concern": "反覆感染相關困擾",
  "Visible blood or clots": "看得到血尿或血塊",
  "Other urinary concern": "其他泌尿問題",
  Today: "今天",
  "1 to 7 days": "1 到 7 天內",
  "1 to 4 weeks": "1 到 4 週",
  "More than 1 month": "超過 1 個月",
  No: "沒有",
  Yes: "有",
  "Not sure": "不確定",
  "0 times": "0 次",
  "1 time": "1 次",
  "2 times": "2 次",
  "3 or more times": "3 次以上",
  "1 to 4 times": "1 到 4 次",
  "5 to 8 times": "5 到 8 次",
  "9 to 12 times": "9 到 12 次",
  "More than 12 times": "超過 12 次",
  Rarely: "很少",
  "Some days": "有些天",
  "Most days": "大多數日子",
  "Several times a day": "一天好幾次",
  Fever: "發燒",
  Chills: "發冷",
  "Side or back pain": "腰部兩側痛",
  "None of these": "以上都沒有",
  "Can provide list": "可以提供藥單、藥袋或照片",
  "Partial list only": "只記得一部分",
  "No regular medicines": "沒有固定用藥",
  "Less than once a week": "少於每週一次",
  Weekly: "每週",
  Daily: "每天",
  "A few drops": "幾滴",
  "Small amount": "少量",
  "Moderate amount": "會濕內褲或護墊",
  "Large amount": "量較多或需要更換衣物",
  "Before reaching toilet": "來不及到廁所",
  "Coughing, laughing, or exercise": "咳嗽、笑、運動或搬重物時",
  "During sleep": "睡覺時",
  "Without warning": "沒有明顯原因",
  "No products used": "沒有使用",
  "Pads or liners": "護墊或襯墊",
  "Adult diapers": "成人紙尿褲",
  "One time": "一次",
  "More than once": "不只一次",
  "Every time recently": "最近幾乎每次都有",
  "Only while urinating": "尿尿時",
  "After urinating": "尿完後",
  "Most of the day": "一天中大多時間",
  "Comes and goes": "有時有、有時沒有",
  "Yes, once": "有，1 次",
  "Yes, more than once": "有，超過 1 次",
  Diabetes: "糖尿病",
  "Kidney disease": "腎臟病",
  "Neurologic disease": "神經系統疾病",
  "Spinal cord problem": "脊髓相關問題"
};

const YES_NO_UNSURE = [
  ["No", "沒有"],
  ["Yes", "有"],
  ["Not sure", "不確定"]
];

const CARE_NOTICE = {
  unableToUrinate: "如果現在仍尿不出來，請在報到或進診間前先告訴現場人員。",
  visibleBlood: "如果有看到紅色、茶色尿或血塊，請把發生時間與次數保留給醫療人員確認。",
  systemicSymptoms: "如果有發燒、發冷或腰部兩側痛，請在現場優先告知。"
};

const ANSWER_FIELDS = [
  "filledBy",
  "chiefConcern",
  "duration",
  "botherScore",
  "daytimeFrequencyChange",
  "nocturiaCount",
  "urgency",
  "leakage",
  "painBurning",
  "visibleBlood",
  "unableToUrinate",
  "currentlyUnableToUrinate",
  "systemicSymptoms",
  "medicationListStatus",
  "daytimeFrequencyCount",
  "urgencyFrequency",
  "fluidCaffeineContext",
  "bladderDiaryFeasible",
  "leakageFrequency",
  "leakageAmount",
  "leakageTriggers",
  "containmentProducts",
  "weakStream",
  "straining",
  "intermittency",
  "incompleteEmptying",
  "hematuriaPattern",
  "bloodClots",
  "hematuriaCoSymptoms",
  "painFrequency",
  "infectionEpisodeHistory",
  "flankPainScore",
  "medicationAssist",
  "relevantComorbidities",
  "diureticAnticoagulantAwareness",
  "language",
  "deviceComfort",
  "supportPreference",
  "notes"
];

const QUESTIONS = [
  {
    id: "source",
    label: "來源",
    title: "1. 這份資料主要是誰回答？",
    copy: "醫療上需要區分本人主觀感受與家屬觀察。",
    fields: [
      {
        field: "filledBy",
        type: "select",
        options: [
          ["Patient self-filled", "我自己回答"],
          ["Family helped operate; patient answered", "家人協助操作，本人回答"],
          ["Family or helper-assisted", "家人依觀察協助回答"]
        ]
      }
    ]
  },
  {
    id: "concern",
    label: "主訴",
    title: "2. 今天最想先說哪一類問題？",
    copy: "可複選；這會決定醫師摘要最前面看到的主訴。",
    fields: [
      {
        field: "chiefConcern",
        type: "checkboxes",
        options: [
          ["Frequency / nocturia / urgency", "一直跑廁所、晚上起來尿、很急忍不住"],
          ["Leakage", "尿會不小心漏出來"],
          ["Difficulty emptying or weak stream", "尿不太出來、尿流變弱"],
          ["Pain, burning, or possible infection", "尿尿會痛、刺痛或灼熱"],
          ["Recurrent infection concern", "反覆出現像感染的症狀"],
          ["Visible blood or clots", "看到紅色或茶色尿、或血塊"],
          ["Other urinary concern", "其他想先說的泌尿問題"]
        ]
      }
    ]
  },
  {
    id: "course",
    label: "病程",
    title: "3. 這個問題多久了？目前困擾幾分？",
    copy: "病程與困擾程度能幫門診團隊快速抓到病人最在意的問題。",
    fields: [
      {
        field: "duration",
        label: "大約開始時間",
        type: "select",
        options: [
          ["Today", "今天"],
          ["1 to 7 days", "1 到 7 天內"],
          ["1 to 4 weeks", "1 到 4 週"],
          ["More than 1 month", "超過 1 個月"],
          ["Not sure", "不確定"]
        ]
      },
      {
        field: "botherScore",
        label: "困擾程度",
        type: "scale",
        options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Not sure"]
      }
    ]
  },
  {
    id: "storage",
    label: "頻尿夜尿",
    title: "4. 頻尿、夜尿或急尿的狀況如何？",
    copy: "用區間回答即可，不要求精準計算。",
    fields: [
      {
        field: "daytimeFrequencyChange",
        label: "白天尿尿次數有明顯變多嗎？",
        type: "select",
        options: YES_NO_UNSURE
      },
      {
        field: "daytimeFrequencyCount",
        label: "白天大約尿尿幾次？",
        type: "select",
        when: (currentAnswers) => storageContext(currentAnswers),
        options: [
          ["1 to 4 times", "1 到 4 次"],
          ["5 to 8 times", "5 到 8 次"],
          ["9 to 12 times", "9 到 12 次"],
          ["More than 12 times", "超過 12 次"],
          ["Not sure", "不確定"]
        ]
      },
      {
        field: "nocturiaCount",
        label: "晚上睡著後通常起床尿尿幾次？",
        type: "select",
        options: [
          ["0 times", "0 次"],
          ["1 time", "1 次"],
          ["2 times", "2 次"],
          ["3 or more times", "3 次以上"],
          ["Not sure", "不確定"]
        ]
      },
      {
        field: "urgency",
        label: "會突然很想尿，而且很難忍住嗎？",
        type: "select",
        options: YES_NO_UNSURE
      },
      {
        field: "urgencyFrequency",
        label: "急尿大約多常發生？",
        type: "select",
        when: (currentAnswers) => currentAnswers.urgency === "Yes" || hasConcern(currentAnswers, "Frequency / nocturia / urgency"),
        options: [
          ["Rarely", "很少"],
          ["Some days", "有些天"],
          ["Most days", "大多數日子"],
          ["Several times a day", "一天好幾次"],
          ["Not sure", "不確定"]
        ]
      }
    ]
  },
  {
    id: "leakage",
    label: "漏尿",
    title: "5. 最近 4 週有沒有漏尿？",
    copy: "這題用來整理頻率、量與情境，不自動判斷漏尿類型。",
    fields: [
      {
        field: "leakage",
        label: "最近 4 週有尿不小心漏出來嗎？",
        type: "select",
        options: YES_NO_UNSURE
      },
      {
        field: "leakageFrequency",
        label: "若有，大約多常發生？",
        type: "select",
        when: (currentAnswers) => currentAnswers.leakage === "Yes",
        options: [
          ["Less than once a week", "少於每週一次"],
          ["Weekly", "每週"],
          ["Daily", "每天"],
          ["Several times a day", "一天好幾次"],
          ["Not sure", "不確定"]
        ]
      },
      {
        field: "leakageAmount",
        label: "通常量大約多少？",
        type: "select",
        when: (currentAnswers) => currentAnswers.leakage === "Yes",
        options: [
          ["A few drops", "幾滴"],
          ["Small amount", "少量"],
          ["Moderate amount", "會濕內褲或護墊"],
          ["Large amount", "量較多或需要更換衣物"],
          ["Not sure", "不確定"]
        ]
      },
      {
        field: "leakageTriggers",
        label: "最常在什麼情況發生？",
        type: "checkboxes",
        when: (currentAnswers) => currentAnswers.leakage === "Yes",
        options: [
          ["Before reaching toilet", "來不及到廁所"],
          ["Coughing, laughing, or exercise", "咳嗽、笑、運動或搬重物時"],
          ["During sleep", "睡覺時"],
          ["Without warning", "沒有明顯原因"],
          ["Not sure", "不確定"]
        ]
      }
    ]
  },
  {
    id: "voiding",
    label: "排尿困難",
    title: "6. 有沒有尿不出來或尿流變弱？",
    copy: "只記錄病人感覺到的現象，不判斷原因。",
    fields: [
      {
        field: "unableToUrinate",
        label: "有很想尿卻尿不太出來或完全尿不出來嗎？",
        type: "select",
        options: YES_NO_UNSURE
      },
      {
        field: "currentlyUnableToUrinate",
        label: "現在是否還尿不出來？",
        type: "select",
        when: (currentAnswers) => currentAnswers.unableToUrinate === "Yes",
        options: YES_NO_UNSURE
      },
      {
        field: "weakStream",
        label: "尿流有變細或變弱嗎？",
        type: "select",
        when: (currentAnswers) => voidingContext(currentAnswers),
        options: YES_NO_UNSURE
      },
      {
        field: "straining",
        label: "尿尿時常需要用力嗎？",
        type: "select",
        when: (currentAnswers) => voidingContext(currentAnswers),
        options: YES_NO_UNSURE
      },
      {
        field: "incompleteEmptying",
        label: "尿完常覺得還沒尿乾淨嗎？",
        type: "select",
        when: (currentAnswers) => voidingContext(currentAnswers),
        options: YES_NO_UNSURE
      }
    ]
  },
  {
    id: "infection",
    label: "疼痛發燒",
    title: "7. 有尿痛、發燒、發冷或腰側痛嗎？",
    copy: "這些是看診前需要標出的病人回報，但仍需現場醫療人員確認。",
    fields: [
      {
        field: "painBurning",
        label: "尿尿時會痛、刺痛或灼熱嗎？",
        type: "select",
        options: YES_NO_UNSURE
      },
      {
        field: "systemicSymptoms",
        label: "最近有以下狀況嗎？",
        type: "checkboxes",
        options: [
          ["Fever", "發燒"],
          ["Chills", "發冷"],
          ["Side or back pain", "腰部兩側痛"],
          ["None of these", "以上都沒有"],
          ["Not sure", "不確定"]
        ]
      },
      {
        field: "painFrequency",
        label: "疼痛或灼熱通常什麼時候發生？",
        type: "select",
        when: (currentAnswers) => painContext(currentAnswers),
        options: [
          ["Only while urinating", "尿尿時"],
          ["After urinating", "尿完後"],
          ["Most of the day", "一天中大多時間"],
          ["Comes and goes", "有時有、有時沒有"],
          ["Not sure", "不確定"]
        ]
      },
      {
        field: "infectionEpisodeHistory",
        label: "過去 12 個月有因類似症狀就醫或吃抗生素嗎？",
        type: "select",
        when: (currentAnswers) => painContext(currentAnswers) || hasConcern(currentAnswers, "Recurrent infection concern"),
        options: [
          ["No", "沒有"],
          ["Yes, once", "有，1 次"],
          ["Yes, more than once", "有，超過 1 次"],
          ["Not sure", "不確定"]
        ]
      }
    ]
  },
  {
    id: "hematuria",
    label: "血尿",
    title: "8. 有沒有看到紅色、茶色尿或血塊？",
    copy: "只記錄看到的現象；這不是診斷。",
    fields: [
      {
        field: "visibleBlood",
        label: "有看過尿液變紅、茶色，或看到血塊嗎？",
        type: "select",
        options: YES_NO_UNSURE
      },
      {
        field: "hematuriaPattern",
        label: "若有，是一次、反覆，還是最近幾乎每次都有？",
        type: "select",
        when: (currentAnswers) => currentAnswers.visibleBlood === "Yes",
        options: [
          ["One time", "一次"],
          ["More than once", "不只一次"],
          ["Every time recently", "最近幾乎每次都有"],
          ["Not sure", "不確定"]
        ]
      },
      {
        field: "bloodClots",
        label: "有沒有看到像血塊的東西？",
        type: "select",
        when: (currentAnswers) => currentAnswers.visibleBlood === "Yes",
        options: YES_NO_UNSURE
      }
    ]
  },
  {
    id: "context",
    label: "用藥背景",
    title: "9. 用藥、病史與補充事項",
    copy: "不用背藥名；能帶藥袋、藥單或照片即可。",
    fields: [
      {
        field: "medicationListStatus",
        label: "今天能不能提供目前藥物資料？",
        type: "select",
        options: [
          ["Can provide list", "可以提供藥單、藥袋或照片"],
          ["Partial list only", "只記得一部分"],
          ["Not sure", "不清楚"],
          ["No regular medicines", "沒有固定用藥"]
        ]
      },
      {
        field: "medicationAssist",
        label: "是否需要現場協助確認藥袋或藥單？",
        type: "select",
        options: YES_NO_UNSURE
      },
      {
        field: "relevantComorbidities",
        label: "有哪些背景要先讓團隊知道？",
        type: "checkboxes",
        options: [
          ["Diabetes", "糖尿病"],
          ["Kidney disease", "腎臟病"],
          ["Neurologic disease", "神經系統疾病"],
          ["Spinal cord problem", "脊髓相關問題"],
          ["None of these", "以上都沒有"],
          ["Not sure", "不確定"]
        ]
      },
      {
        field: "notes",
        label: "還有什麼想先補充？可以留空。",
        type: "textarea",
        placeholder: "例如：最擔心晚上一直醒來、漏尿不好意思說、或家人觀察到最近走路變慢。"
      }
    ]
  }
];

let currentIndex = 0;
let answers = restoreAnswers() || emptyAnswers();
let autoAdvanceTimer = null;
let fieldCursors = {};

const mount = document.querySelector("#questionMount");
const progressBar = document.querySelector("#progressBar");
const progressText = document.querySelector("#progressText");
const stepNav = document.querySelector("#stepNav");
const readinessLabel = document.querySelector("#readinessLabel");
const answeredCount = document.querySelector("#answeredCount");
const backButton = document.querySelector("#backButton");
const nextButton = document.querySelector("#nextButton");
const flowActions = document.querySelector(".flow-actions");
const loadSample = document.querySelector("#loadSample");
const resetDemo = document.querySelector("#resetDemo");
const toast = document.querySelector("#toast");

function emptyAnswers() {
  return Object.assign(
    Object.fromEntries(ANSWER_FIELDS.map((field) => [field, ARRAY_FIELDS.has(field) ? [] : ""])),
    { sourceByField: {} }
  );
}

function normalizeAnswers(source) {
  const base = emptyAnswers();
  Object.entries(source || {}).forEach(([field, value]) => {
    if (field === "sourceByField" && value && typeof value === "object" && !Array.isArray(value)) {
      base.sourceByField = Object.assign({}, value);
      return;
    }
    if (ANSWER_FIELDS.includes(field)) {
      base[field] = ARRAY_FIELDS.has(field)
        ? (Array.isArray(value) ? value.slice() : (value ? [value] : []))
        : value;
    }
  });
  return base;
}

function restoreAnswers() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? normalizeAnswers(JSON.parse(stored)) : null;
  } catch (error) {
    return null;
  }
}

function persistAnswers() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  } catch (error) {
    // The page still works in memory when storage is unavailable.
  }
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function displayAnswer(value) {
  if (Array.isArray(value)) {
    const labels = value.map((item) => displayAnswer(item)).filter((item) => item !== "尚未填寫");
    return labels.length ? labels.join("、") : "尚未填寫";
  }
  if (!value) return "尚未填寫";
  return VALUE_LABELS[value] || value;
}

function sourceFromMode(mode) {
  if (mode === "Patient self-filled") return "patient_self";
  if (mode === "Family helped operate; patient answered") return "patient_with_family_operator";
  if (mode === "Family or helper-assisted") return "family_observation";
  return "unknown";
}

function hasValue(field) {
  const value = answers[field];
  return Array.isArray(value) ? value.length > 0 : Boolean(value);
}

function listValue(field) {
  return Array.isArray(answers[field]) ? answers[field] : [];
}

function hasConcern(sourceAnswers, value) {
  return Array.isArray(sourceAnswers.chiefConcern) && sourceAnswers.chiefConcern.includes(value);
}

function hasAnySystemicSignal(sourceAnswers) {
  const values = Array.isArray(sourceAnswers.systemicSymptoms) ? sourceAnswers.systemicSymptoms : [];
  return values.some((value) => !["None of these", "Not sure"].includes(value));
}

function storageContext(sourceAnswers) {
  return hasConcern(sourceAnswers, "Frequency / nocturia / urgency") ||
    sourceAnswers.daytimeFrequencyChange === "Yes" ||
    sourceAnswers.urgency === "Yes" ||
    ["2 times", "3 or more times"].includes(sourceAnswers.nocturiaCount);
}

function voidingContext(sourceAnswers) {
  return hasConcern(sourceAnswers, "Difficulty emptying or weak stream") ||
    sourceAnswers.unableToUrinate === "Yes";
}

function painContext(sourceAnswers) {
  return hasConcern(sourceAnswers, "Pain, burning, or possible infection") ||
    sourceAnswers.painBurning === "Yes" ||
    hasAnySystemicSignal(sourceAnswers);
}

function fieldVisible(field) {
  return !field.when || field.when(answers);
}

function visibleFields(question) {
  return question.fields.filter(fieldVisible);
}

function setAnswer(field, value, options = {}) {
  const nextValue = ARRAY_FIELDS.has(field)
    ? (Array.isArray(value) ? value.slice() : (value ? [value] : []))
    : value;
  const sourceByField = Object.assign({}, answers.sourceByField);

  if (field === "filledBy") {
    sourceByField.filledBy = "declared_on_entry";
    ANSWER_FIELDS.forEach((answerField) => {
      if (answerField !== "filledBy" && hasValue(answerField)) {
        sourceByField[answerField] = sourceFromMode(nextValue);
      }
    });
  } else if (Array.isArray(nextValue) ? nextValue.length : nextValue) {
    sourceByField[field] = sourceFromMode(answers.filledBy);
  } else {
    delete sourceByField[field];
  }

  answers = Object.assign({}, answers, { [field]: nextValue, sourceByField });
  fillShortDefaults();
  if (!isReviewMode()) {
    const question = currentQuestion();
    const answeredIndex = visibleFields(question).findIndex((item) => item.field === field);
    if (answeredIndex >= 0) fieldCursors[question.id] = answeredIndex;
  }
  persistAnswers();
  if (options.render !== false) render();
}

function toggleCheckbox(field, value, checked) {
  const exclusive = new Set(["None of these", "Not sure"]);
  let next = Array.isArray(answers[field]) ? answers[field].filter((item) => item !== value) : [];
  if (checked) {
    if (exclusive.has(value)) {
      next = [value];
    } else {
      next = next.filter((item) => !exclusive.has(item));
      next.push(value);
    }
  }
  setAnswer(field, next);
}

function fillFieldIfBlank(field, value) {
  const current = answers[field];
  const blank = Array.isArray(current) ? current.length === 0 : !current;
  if (!blank) return;
  answers[field] = ARRAY_FIELDS.has(field) ? (Array.isArray(value) ? value.slice() : [value]) : value;
  answers.sourceByField[field] = sourceFromMode(answers.filledBy);
}

function fillShortDefaults() {
  fillFieldIfBlank("fluidCaffeineContext", "Not sure");
  fillFieldIfBlank("bladderDiaryFeasible", "Not sure");
  fillFieldIfBlank("containmentProducts", "Not sure");
  fillFieldIfBlank("intermittency", "Not sure");
  fillFieldIfBlank("hematuriaCoSymptoms", "Not sure");
  fillFieldIfBlank("flankPainScore", "Not sure");
  fillFieldIfBlank("diureticAnticoagulantAwareness", "Not sure");
  fillFieldIfBlank("language", "Mandarin");
  fillFieldIfBlank("deviceComfort", "Can use phone with help");
  fillFieldIfBlank("supportPreference", "Prefer to talk in person");
}

function optionButton(field, value, label) {
  const selected = answers[field] === value;
  return `
    <button
      class="option-button elder-choice-button"
      type="button"
      data-option-field="${escapeHtml(field)}"
      data-option-value="${escapeHtml(value)}"
      aria-pressed="${selected ? "true" : "false"}">
      <strong>${escapeHtml(label)}</strong>
    </button>
  `;
}

function renderField(field) {
  if (field.type === "textarea") {
    return `
      <div class="field wide-field elder-text-field short-field">
        <label for="${escapeHtml(field.field)}">${escapeHtml(field.label)}</label>
        <textarea id="${escapeHtml(field.field)}" data-field="${escapeHtml(field.field)}" placeholder="${escapeHtml(field.placeholder || "")}">${escapeHtml(answers[field.field])}</textarea>
      </div>
    `;
  }

  if (field.type === "checkboxes") {
    const current = Array.isArray(answers[field.field]) ? answers[field.field] : [];
    return `
      <fieldset class="field wide-field checkbox-field short-field">
        <legend>${escapeHtml(field.label || "")}</legend>
        <div class="checkbox-grid elder-choice-grid">
          ${field.options.map(([value, label]) => `
            <label class="checkbox-option elder-checkbox-option">
              <input
                type="checkbox"
                data-checkbox-field="${escapeHtml(field.field)}"
                data-checkbox-value="${escapeHtml(value)}"
                ${current.includes(value) ? "checked" : ""}>
              <span><strong>${escapeHtml(label)}</strong></span>
            </label>
          `).join("")}
        </div>
      </fieldset>
    `;
  }

  if (field.type === "scale") {
    return `
      <div class="field wide-field short-field">
        <label>${escapeHtml(field.label)}</label>
        <div class="scale-grid">
          ${field.options.filter((value) => /^\d+$/.test(value)).map((value) => `
            <button
              class="scale-button"
              type="button"
              data-option-field="${escapeHtml(field.field)}"
              data-option-value="${escapeHtml(value)}"
              aria-pressed="${answers[field.field] === value ? "true" : "false"}">
              <strong class="scale-number">${escapeHtml(value)}</strong>
            </button>
          `).join("")}
        </div>
        ${optionButton(field.field, "Not sure", "不確定")}
      </div>
    `;
  }

  return `
    <div class="field wide-field short-field">
      ${field.label ? `<label>${escapeHtml(field.label)}</label>` : ""}
      <div class="option-grid elder-choice-grid" role="group" aria-label="${escapeHtml(field.label || "")}">
        ${field.options.map(([value, label]) => optionButton(field.field, value, label)).join("")}
      </div>
    </div>
  `;
}

function questionComplete(question) {
  return visibleFields(question).every((field) => {
    if (field.field === "notes") return true;
    return hasValue(field.field);
  });
}

function answeredQuestions() {
  return QUESTIONS.filter(questionComplete).length;
}

function currentQuestion() {
  return QUESTIONS[currentIndex];
}

function isReviewMode() {
  return currentIndex >= QUESTIONS.length;
}

function currentFieldIndex(question = currentQuestion()) {
  const fields = visibleFields(question);
  const rawIndex = Number(fieldCursors[question.id] || 0);
  const index = Math.min(Math.max(rawIndex, 0), Math.max(fields.length - 1, 0));
  fieldCursors[question.id] = index;
  return index;
}

function currentField(question = currentQuestion()) {
  return visibleFields(question)[currentFieldIndex(question)];
}

function fieldSpec(fieldName) {
  return visibleFields(currentQuestion()).find((field) => field.field === fieldName);
}

function focusQuestionPanel() {
  window.requestAnimationFrame(() => {
    document.querySelector(".patient-intake")?.scrollIntoView({ block: "start" });
  });
}

function cancelAutoAdvance() {
  window.clearTimeout(autoAdvanceTimer);
  autoAdvanceTimer = null;
}

function advanceToNextQuestion(options = {}) {
  if (!options.fromAuto) cancelAutoAdvance();
  if (isReviewMode()) {
    showToast("短版資料已儲存，可切到護理端或醫師摘要。");
    return;
  }
  const question = currentQuestion();
  const fields = visibleFields(question);
  const index = currentFieldIndex(question);

  if (index < fields.length - 1) {
    fieldCursors[question.id] = index + 1;
    render();
    focusQuestionPanel();
    return;
  }

  if (currentIndex < QUESTIONS.length - 1) {
    currentIndex += 1;
  } else {
    currentIndex = QUESTIONS.length;
    fillShortDefaults();
    persistAnswers();
    showToast("已產生短版確認摘要。");
  }
  render();
  focusQuestionPanel();
}

function goBackInFlow() {
  cancelAutoAdvance();
  if (isReviewMode()) {
    currentIndex = QUESTIONS.length - 1;
    fieldCursors[QUESTIONS[currentIndex].id] = Math.max(visibleFields(QUESTIONS[currentIndex]).length - 1, 0);
    render();
    focusQuestionPanel();
    return;
  }

  const question = currentQuestion();
  const index = currentFieldIndex(question);
  if (index > 0) {
    fieldCursors[question.id] = index - 1;
    render();
    focusQuestionPanel();
    return;
  }

  if (currentIndex > 0) {
    currentIndex -= 1;
    const previousQuestion = currentQuestion();
    fieldCursors[previousQuestion.id] = Math.max(visibleFields(previousQuestion).length - 1, 0);
    render();
    focusQuestionPanel();
  }
}

function maybeAutoAdvance(fieldName) {
  const question = currentQuestion();
  const field = fieldSpec(fieldName);
  if (!field || field.type === "checkboxes" || field.type === "textarea") return;
  const scheduledQuestionId = question.id;
  const scheduledFieldName = field.field;

  window.clearTimeout(autoAdvanceTimer);
  autoAdvanceTimer = window.setTimeout(() => {
    if (isReviewMode()) return;
    const activeQuestion = currentQuestion();
    const activeField = currentField(activeQuestion);
    if (activeQuestion.id !== scheduledQuestionId || !activeField || activeField.field !== scheduledFieldName) return;
    advanceToNextQuestion({ fromAuto: true });
  }, 220);
}

function fieldCareNotice(field) {
  if (field.field === "currentlyUnableToUrinate" && answers.currentlyUnableToUrinate === "Yes") {
    return CARE_NOTICE.unableToUrinate;
  }
  if (field.field === "visibleBlood" && answers.visibleBlood === "Yes") {
    return CARE_NOTICE.visibleBlood;
  }
  if (field.field === "systemicSymptoms" && hasAnySystemicSignal(answers)) {
    return CARE_NOTICE.systemicSymptoms;
  }
  return "";
}

function renderCareNotice(message) {
  if (!message) return "";
  return `
    <div class="care-note" role="note">
      <strong>現場優先告知</strong>
      <span>${escapeHtml(message)}</span>
    </div>
  `;
}

function sourceLabel(field) {
  return SOURCE_LABELS[answers.sourceByField[field] || "unknown"] || SOURCE_LABELS.unknown;
}

function symptomHighlights() {
  return [
    ["chiefConcern", "今天最想先說", answers.chiefConcern],
    ["duration", "大約多久", answers.duration],
    ["botherScore", "困擾程度", answers.botherScore],
    ["nocturiaCount", "夜間起床尿尿", answers.nocturiaCount],
    ["urgency", "急尿", answers.urgency],
    ["leakage", "漏尿", answers.leakage],
    ["unableToUrinate", "尿不出來", answers.unableToUrinate],
    ["painBurning", "尿痛或灼熱", answers.painBurning],
    ["visibleBlood", "紅色/茶色尿或血塊", answers.visibleBlood],
    ["systemicSymptoms", "發燒、發冷或腰側痛", answers.systemicSymptoms],
    ["medicationListStatus", "用藥資料", answers.medicationListStatus]
  ].filter(([, , value]) => Array.isArray(value) ? value.length : value);
}

function riskSummary() {
  return [
    answers.currentlyUnableToUrinate === "Yes" ? CARE_NOTICE.unableToUrinate : "",
    answers.visibleBlood === "Yes" ? CARE_NOTICE.visibleBlood : "",
    hasAnySystemicSignal(answers) ? CARE_NOTICE.systemicSymptoms : ""
  ].filter(Boolean);
}

function renderConfirmation() {
  const status = completionStatus(answers);
  const risks = riskSummary();
  return `
    <section class="step-panel short-question-panel short-confirmation" aria-labelledby="question-title">
      <div class="step-kicker">短版確認</div>
      <h2 id="question-title">交給門診團隊前，先確認這 5 個重點</h2>
      <p class="step-copy">這份整理只協助把病人或家屬說的內容變清楚；仍需醫療人員確認。</p>
      <div class="confirmation-strip">
        <span>${status.missingCount ? "可交給護理端補齊" : "核心欄位已整理"}</span>
        <strong>${status.missingCount ? `${status.missingCount} 個欄位待補` : "可看醫師摘要"}</strong>
      </div>
      ${risks.length ? `
        <div class="care-note care-note-stack" role="note">
          <strong>現場優先告知</strong>
          <ul>
            ${risks.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </div>
      ` : ""}
      <dl class="review-grid short-review-grid">
        ${symptomHighlights().map(([field, label, value]) => `
          <div class="review-row">
            <dt>${escapeHtml(label)}</dt>
            <dd>
              ${escapeHtml(displayAnswer(value))}
              <small>${escapeHtml(sourceLabel(field))}</small>
            </dd>
          </div>
        `).join("")}
      </dl>
      <div class="handoff-actions" aria-label="接續 demo">
        <a class="primary-button link-button" href="../nurse/">看護理端補齊</a>
        <a class="secondary-button link-button" href="../clinician/">看醫師摘要</a>
        <a class="secondary-button link-button" href="../clinician/visit-packet/">看 Visit packet</a>
      </div>
    </section>
  `;
}

function renderSubquestionProgress(question, fields, index) {
  if (fields.length <= 1) return "";
  const current = fields[index];
  const width = `${((index + 1) / fields.length) * 100}%`;
  return `
    <div class="subquestion-status" style="--sub-progress: ${width};" aria-label="第 ${currentIndex + 1} 題組，第 ${index + 1} 個判斷點，共 ${fields.length} 個">
      <div class="subquestion-status-head">
        <span>第 ${currentIndex + 1} 題組：${escapeHtml(question.label)}</span>
        <strong>第 ${index + 1} 個判斷點，共 ${fields.length} 個</strong>
      </div>
      <div class="subquestion-detail-title">${current ? escapeHtml(current.label || "") : ""}</div>
      <div class="subquestion-track" aria-hidden="true">
        <span></span>
      </div>
      <div class="subquestion-dots" aria-hidden="true">
        ${fields.map((item, itemIndex) => `
          <span class="${itemIndex < index ? "done" : itemIndex === index ? "current" : "upcoming"}"></span>
        `).join("")}
      </div>
    </div>
  `;
}

function renderQuestion() {
  if (isReviewMode()) {
    mount.innerHTML = renderConfirmation();
    return;
  }
  const question = QUESTIONS[currentIndex];
  const fields = visibleFields(question);
  const index = currentFieldIndex(question);
  const field = fields[index];
  mount.innerHTML = `
    <section class="step-panel short-question-panel ${fields.length > 1 ? "has-subquestions" : ""}" aria-labelledby="question-title">
      <div class="step-kicker">第 ${currentIndex + 1} 題，共 ${QUESTION_TOTAL} 題</div>
      <h2 id="question-title">${escapeHtml(question.title)}</h2>
      <p class="step-copy">${escapeHtml(question.copy)}</p>
      ${/family|helper/i.test(answers.filledBy) ? `
        <div class="source-notice" role="note">
          <strong>已標記家人協助</strong>
          <span>疼痛、急尿、困擾程度等主觀感受，建議盡量由本人回答。</span>
        </div>
      ` : ""}
      <div class="short-question-fields">
        ${renderSubquestionProgress(question, fields, index)}
        ${field ? renderField(field) : "<p>這一題目前沒有需要補充的欄位。</p>"}
        ${field ? renderCareNotice(fieldCareNotice(field)) : ""}
      </div>
    </section>
  `;
}

function renderNav() {
  const items = QUESTIONS.concat([{ id: "confirm", label: "確認", review: true }]);
  stepNav.innerHTML = items.map((question, index) => {
    const isActive = index === currentIndex;
    const state = isActive ? "active" : question.review ? (isReviewMode() ? "active" : "upcoming") : questionComplete(question) ? "complete" : "upcoming";
    const label = question.review ? "確認整理結果" : question.title.replace(/^\d+\.\s*/, "");
    return `
      <button class="step-chip ${state}" type="button" data-question-index="${index}" aria-label="${escapeHtml(question.label)}" aria-current="${isActive ? "step" : "false"}">
        <span>${index + 1}</span>
        <strong>${escapeHtml(question.label)}</strong>
        <small>${escapeHtml(label)}</small>
      </button>
    `;
  }).join("");
}

function renderReadiness() {
  const completed = answeredQuestions();
  const status = completionStatus(answers);
  answeredCount.textContent = String(completed);
  readinessLabel.textContent = isReviewMode()
    ? "短版確認"
    : completed === QUESTION_TOTAL
    ? (status.missingCount ? "可交給護理端補齊" : "可看醫師摘要")
    : "尚未完成";
}

function renderProgress() {
  const width = isReviewMode() ? 100 : ((currentIndex + 1) / QUESTION_TOTAL) * 100;
  const field = isReviewMode() ? null : currentField();
  const fieldIndex = isReviewMode() ? 0 : currentFieldIndex();
  const isAutoField = field && (field.type === "select" || field.type === "scale");
  progressBar.style.width = `${width}%`;
  progressText.textContent = isReviewMode() ? "確認整理結果" : `第 ${currentIndex + 1} 題，共 ${QUESTION_TOTAL} 題`;
  backButton.disabled = currentIndex === 0 && fieldIndex === 0;
  backButton.hidden = backButton.disabled && isAutoField;
  nextButton.hidden = isReviewMode() || isAutoField;
  if (flowActions) flowActions.hidden = Boolean(backButton.hidden && nextButton.hidden);
  nextButton.textContent = currentIndex === QUESTION_TOTAL - 1 && fieldIndex === visibleFields(currentQuestion()).length - 1 ? "看整理結果" : "下一題";
}

function render() {
  renderNav();
  renderQuestion();
  renderReadiness();
  renderProgress();
}

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => {
    toast.hidden = true;
  }, 1800);
}

mount.addEventListener("click", (event) => {
  const option = event.target.closest("[data-option-field]");
  if (!option) return;
  setAnswer(option.dataset.optionField, option.dataset.optionValue);
  maybeAutoAdvance(option.dataset.optionField);
});

mount.addEventListener("change", (event) => {
  const checkbox = event.target.closest("[data-checkbox-field]");
  if (checkbox) {
    toggleCheckbox(checkbox.dataset.checkboxField, checkbox.dataset.checkboxValue, checkbox.checked);
  }
});

mount.addEventListener("input", (event) => {
  const field = event.target.closest("textarea[data-field]");
  if (!field) return;
  const sourceByField = Object.assign({}, answers.sourceByField);
  if (field.value) {
    sourceByField[field.dataset.field] = sourceFromMode(answers.filledBy);
  } else {
    delete sourceByField[field.dataset.field];
  }
  answers = Object.assign({}, answers, { [field.dataset.field]: field.value, sourceByField });
  persistAnswers();
});

stepNav.addEventListener("click", (event) => {
  const button = event.target.closest("[data-question-index]");
  if (!button) return;
  cancelAutoAdvance();
  currentIndex = Number(button.dataset.questionIndex);
  render();
});

backButton.addEventListener("click", () => {
  goBackInFlow();
});

nextButton.addEventListener("click", () => {
  if (currentIndex < QUESTION_TOTAL - 1) return advanceToNextQuestion();
  advanceToNextQuestion();
});

loadSample.addEventListener("click", () => {
  const sample = SYNTHETIC_CASES[0];
  answers = normalizeAnswers(sample.answers);
  fillShortDefaults();
  persistAnswers();
  currentIndex = QUESTIONS.length;
  fieldCursors = {};
  render();
  showToast(`已載入示範：${sample.shortLabel || sample.label}`);
});

resetDemo.addEventListener("click", () => {
  answers = emptyAnswers();
  persistAnswers();
  currentIndex = 0;
  fieldCursors = {};
  render();
  showToast("已重新開始短版問答。");
});

fillShortDefaults();
persistAnswers();
render();
