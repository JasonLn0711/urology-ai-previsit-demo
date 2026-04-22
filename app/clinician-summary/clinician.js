const {
  buildClinicianSummary,
  buildNurseChecklist,
  missingFieldEntries,
  summaryToText
} = window.UrologyPrevisit;
const { SYNTHETIC_CASES, findCase } = window.UrologyCases;

const STORAGE_KEY = "urologyPrevisitAnswers";

const summaryMount = document.querySelector("#summaryMount");
const sourceMount = document.querySelector("#sourceMount");
const statusTitle = document.querySelector("#statusTitle");
const statusMeta = document.querySelector("#statusMeta");
const copySummary = document.querySelector("#copySummary");
const printSummary = document.querySelector("#printSummary");
const loadSample = document.querySelector("#loadSample");
const toast = document.querySelector("#toast");

const LABELS = {
  "Patient self-filled": "本人回答",
  "Family helped operate; patient answered": "家屬協助操作，本人回答",
  "Family or helper-assisted": "家屬依觀察協助回答",
  "Frequency / nocturia / urgency": "頻尿 / 夜尿 / 急尿",
  Leakage: "漏尿",
  "Difficulty emptying or weak stream": "排尿困難或尿流弱",
  "Pain, burning, or possible infection": "尿痛 / 灼熱 / 感染相關疑慮",
  "Visible blood or clots": "可見血尿或血塊",
  "Other urinary concern": "其他泌尿問題",
  "More than 1 month": "超過 1 個月",
  "1 to 4 weeks": "1 到 4 週",
  "1 to 7 days": "1 到 7 天",
  Today: "今天",
  Yes: "有",
  No: "沒有",
  "Not sure": "不確定",
  "3 or more times": "3 次以上",
  "2 times": "2 次",
  "1 time": "1 次",
  "0 times": "0 次",
  Fever: "發燒",
  Chills: "發冷",
  "Side or back pain": "腰側痛",
  "None of these": "以上都沒有",
  "Can provide list": "可提供藥單",
  "Partial list only": "只記得部分",
  "No regular medicines": "無固定用藥"
};

const MODULE_LABELS = {
  storage: "頻尿/夜尿/急尿",
  leakage: "漏尿",
  voiding: "排尿困難",
  hematuria: "可見血尿/血塊",
  pain: "疼痛或發燒相關",
  medication: "用藥補充"
};

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function readAnswers() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : findCase("synthetic-emptying-difficulty").answers;
  } catch (error) {
    return findCase("synthetic-emptying-difficulty").answers;
  }
}

function saveAnswers(answers) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  } catch (error) {
    // Static demo can still render from memory when storage is unavailable.
  }
}

function display(value) {
  if (Array.isArray(value)) {
    return value.length ? value.map(display).join("、") : "未填";
  }
  if (!value) return "未填";
  return LABELS[value] || value;
}

function sourceLookup(fieldSources) {
  return fieldSources.reduce((acc, item) => {
    acc[item.field] = item.label;
    return acc;
  }, {});
}

function listItem(label, value, field, sources) {
  if (!value || (Array.isArray(value) && value.length === 0)) return "";
  const source = sources[field] || "Source not marked";
  return `
    <li>
      <strong>${escapeHtml(label)}</strong>
      <span>${escapeHtml(display(value))}<small>${escapeHtml(source)}</small></span>
    </li>
  `;
}

function buildPatternSections(answers, sources) {
  const sections = [
    {
      title: "儲尿相關",
      items: [
        listItem("白天次數變多", answers.daytimeFrequencyChange, "daytimeFrequencyChange", sources),
        listItem("白天大約次數", answers.daytimeFrequencyCount, "daytimeFrequencyCount", sources),
        listItem("夜間起床尿尿", answers.nocturiaCount, "nocturiaCount", sources),
        listItem("突然急尿", answers.urgency, "urgency", sources),
        listItem("急尿頻率", answers.urgencyFrequency, "urgencyFrequency", sources)
      ]
    },
    {
      title: "排尿困難",
      items: [
        listItem("尿不出來/排尿困難", answers.unableToUrinate, "unableToUrinate", sources),
        listItem("目前仍發生", answers.currentlyUnableToUrinate, "currentlyUnableToUrinate", sources),
        listItem("尿流弱", answers.weakStream, "weakStream", sources),
        listItem("需用力", answers.straining, "straining", sources),
        listItem("斷斷續續", answers.intermittency, "intermittency", sources),
        listItem("尿不乾淨感", answers.incompleteEmptying, "incompleteEmptying", sources)
      ]
    },
    {
      title: "漏尿",
      items: [
        listItem("最近 4 週漏尿", answers.leakage, "leakage", sources),
        listItem("頻率", answers.leakageFrequency, "leakageFrequency", sources),
        listItem("量", answers.leakageAmount, "leakageAmount", sources),
        listItem("情境", answers.leakageTriggers, "leakageTriggers", sources),
        listItem("用品", answers.containmentProducts, "containmentProducts", sources)
      ]
    },
    {
      title: "血尿與疼痛相關",
      items: [
        listItem("可見血尿/血塊", answers.visibleBlood, "visibleBlood", sources),
        listItem("血尿模式", answers.hematuriaPattern, "hematuriaPattern", sources),
        listItem("血塊", answers.bloodClots, "bloodClots", sources),
        listItem("尿痛/灼熱", answers.painBurning, "painBurning", sources),
        listItem("發燒/發冷/腰側痛", answers.systemicSymptoms, "systemicSymptoms", sources),
        listItem("過去類似就醫或抗生素", answers.infectionEpisodeHistory, "infectionEpisodeHistory", sources)
      ]
    }
  ];

  return sections
    .map((section) => {
      const items = section.items.filter(Boolean).join("");
      if (!items) return "";
      return `
        <section class="clinical-block">
          <h3>${escapeHtml(section.title)}</h3>
          <ul class="clinical-list">${items}</ul>
        </section>
      `;
    })
    .filter(Boolean)
    .join("");
}

function render() {
  const answers = readAnswers();
  const summary = buildClinicianSummary(answers);
  const checklist = buildNurseChecklist(answers);
  const missing = missingFieldEntries(answers);
  const status = summary.completionStatus;
  const sources = sourceLookup(summary.fieldSources);

  statusTitle.textContent = status.missingCount
    ? `${status.missingCount} 項仍可補齊`
    : "重點欄位已完成";
  statusMeta.textContent = `${status.completed}/${status.total} required fields captured.`;

  sourceMount.innerHTML = `
    <div class="source-card">
      <strong>${escapeHtml(display(summary.intakeMode))}</strong>
      <span>${escapeHtml(summary.handoffNote)}</span>
    </div>
    <div class="source-card">
      <strong>欄位來源分布</strong>
      ${summary.sourceAttributionSummary.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
    </div>
    ${checklist.sourceNotes.map((note) => `
      <div class="source-card subtle">
        <span>${escapeHtml(note)}</span>
      </div>
    `).join("")}
  `;

  summaryMount.innerHTML = `
    <section class="doctor-brief-grid">
      <div class="doctor-brief-item">
        <span>主訴</span>
        <strong>${escapeHtml(display(summary.chiefConcern))}</strong>
      </div>
      <div class="doctor-brief-item">
        <span>病程 / 困擾</span>
        <strong>${escapeHtml(display(answers.duration))} / ${escapeHtml(display(answers.botherScore))}</strong>
      </div>
      <div class="doctor-brief-item">
        <span>啟動模組</span>
        <strong>${escapeHtml(summary.activeModules.map((module) => MODULE_LABELS[module] || module).join("、"))}</strong>
      </div>
      <div class="doctor-brief-item">
        <span>用藥資料</span>
        <strong>${escapeHtml(display(answers.medicationListStatus))}</strong>
      </div>
    </section>

    <section class="clinical-block alert-block">
      <h3>需現場確認的病人回報</h3>
      <ul class="flag-list">
        ${summary.clinicianReviewFlags.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </section>

    ${buildPatternSections(answers, sources) || `
      <section class="clinical-block">
        <h3>症狀整理</h3>
        <p>目前尚未有足夠症狀回答。</p>
      </section>
    `}

    <section class="clinical-block">
      <h3>缺漏資訊</h3>
      ${missing.length ? `
        <ul class="missing-list">
          ${checklist.supplementalQuestions.map((item) => `<li>${escapeHtml(item.ask)}</li>`).join("")}
        </ul>
      ` : "<p>目前沒有必補欄位。</p>"}
    </section>

    <section class="clinical-block">
      <h3>病人補充</h3>
      <p>${escapeHtml(summary.patientNote)}</p>
    </section>
  `;
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => {
    toast.hidden = true;
  }, 1800);
}

loadSample.addEventListener("click", () => {
  saveAnswers(SYNTHETIC_CASES[0].answers);
  render();
  showToast("已載入示範摘要。");
});

printSummary.addEventListener("click", () => {
  window.print();
});

copySummary.addEventListener("click", async () => {
  const summary = buildClinicianSummary(readAnswers());
  const text = summaryToText(summary);
  try {
    await navigator.clipboard.writeText(text);
    showToast("已複製文字摘要。");
  } catch (error) {
    showToast("無法複製，請改用列印。");
  }
});

render();
