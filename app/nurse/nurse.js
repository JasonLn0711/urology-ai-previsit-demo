const {
  buildClinicianSummary,
  buildNurseChecklist
} = window.UrologyPrevisit;
const { findCase } = window.UrologyCases;

const STORAGE_KEY = "urologyPrevisitAnswers";

const completionTitle = document.querySelector("#completionTitle");
const completionMeta = document.querySelector("#completionMeta");
const sourceNotesMount = document.querySelector("#sourceNotesMount");
const supplementMount = document.querySelector("#supplementMount");
const reviewMount = document.querySelector("#reviewMount");
const refreshButton = document.querySelector("#refreshButton");
const loadIncomplete = document.querySelector("#loadIncomplete");
const toast = document.querySelector("#toast");

const MODULE_LABELS = {
  storage: "頻尿/夜尿/急尿",
  leakage: "漏尿",
  voiding: "排尿困難",
  hematuria: "可見血尿/血塊",
  pain: "疼痛或發燒相關",
  medication: "用藥補充"
};

const ARRAY_FIELDS = new Set([
  "systemicSymptoms",
  "fluidCaffeineContext",
  "leakageTriggers",
  "hematuriaCoSymptoms",
  "relevantComorbidities"
]);

const EXCLUSIVE_CHECKBOX_VALUES = new Set(["None of these", "Not sure"]);

const FIELD_CONTROLS = {
  filledBy: {
    type: "select",
    options: [
      ["Patient self-filled", "本人回答"],
      ["Family helped operate; patient answered", "家屬協助操作，本人回答"],
      ["Family or helper-assisted", "家屬依觀察協助回答"]
    ]
  },
  chiefConcern: {
    type: "select",
    options: [
      ["Frequency / nocturia / urgency", "頻尿 / 夜尿 / 急尿"],
      ["Leakage", "漏尿"],
      ["Difficulty emptying or weak stream", "排尿困難或尿流弱"],
      ["Pain, burning, or possible infection", "尿痛 / 灼熱 / 感染相關"],
      ["Visible blood or clots", "可見血尿或血塊"],
      ["Other urinary concern", "其他泌尿問題"]
    ]
  },
  duration: {
    type: "select",
    options: [["Today", "今天"], ["1 to 7 days", "1 到 7 天"], ["1 to 4 weeks", "1 到 4 週"], ["More than 1 month", "超過 1 個月"], ["Not sure", "不確定"]]
  },
  botherScore: {
    type: "select",
    options: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["Not sure", "不確定"]]
  },
  daytimeFrequencyChange: yesNoUnsure(),
  urgency: yesNoUnsure(),
  leakage: yesNoUnsure(),
  painBurning: yesNoUnsure(),
  visibleBlood: yesNoUnsure(),
  unableToUrinate: yesNoUnsure(),
  currentlyUnableToUrinate: yesNoUnsure(),
  nocturiaCount: {
    type: "select",
    options: [["0 times", "0 次"], ["1 time", "1 次"], ["2 times", "2 次"], ["3 or more times", "3 次以上"], ["Not sure", "不確定"]]
  },
  systemicSymptoms: {
    type: "checkboxes",
    options: [["Fever", "發燒"], ["Chills", "發冷"], ["Side or back pain", "腰側痛"], ["None of these", "以上都沒有"], ["Not sure", "不確定"]]
  },
  medicationListStatus: {
    type: "select",
    options: [["Can provide list", "可提供藥單"], ["Partial list only", "只記得部分"], ["Not sure", "不清楚"], ["No regular medicines", "無固定用藥"]]
  },
  daytimeFrequencyCount: {
    type: "select",
    options: [["1 to 4 times", "1 到 4 次"], ["5 to 8 times", "5 到 8 次"], ["9 to 12 times", "9 到 12 次"], ["More than 12 times", "超過 12 次"], ["Not sure", "不確定"]]
  },
  urgencyFrequency: {
    type: "select",
    options: [["Rarely", "很少"], ["Some days", "有些天會"], ["Most days", "大多數日子會"], ["Several times a day", "一天好幾次"], ["Not sure", "不確定"]]
  },
  bladderDiaryFeasible: {
    type: "select",
    options: [["Yes", "可以"], ["Yes, with written instructions", "可以，但需要說明"], ["Only with staff or family help", "需要協助"], ["No", "不方便"], ["Not sure", "不確定"]]
  },
  leakageFrequency: {
    type: "select",
    options: [["Less than once a week", "少於每週一次"], ["Weekly", "每週"], ["Daily", "每天"], ["Several times a day", "一天好幾次"], ["Not sure", "不確定"]]
  },
  leakageAmount: {
    type: "select",
    options: [["A few drops", "幾滴"], ["Small amount", "少量"], ["Moderate amount", "會濕內褲或護墊"], ["Large amount", "量較多或需換衣物"], ["Not sure", "不確定"]]
  },
  leakageTriggers: {
    type: "checkboxes",
    options: [["Before reaching toilet", "來不及到廁所"], ["Coughing, laughing, or exercise", "咳嗽、笑、運動或搬重物"], ["During sleep", "睡覺時"], ["Without warning", "無明顯原因"], ["Not sure", "不確定"]]
  },
  containmentProducts: {
    type: "select",
    options: [["No products used", "沒有使用"], ["Pads or liners", "護墊或襯墊"], ["Adult diapers", "成人紙尿褲"], ["Other product", "其他用品"], ["Prefer not to answer", "暫不回答"], ["Not sure", "不確定"]]
  },
  weakStream: yesNoUnsure(),
  straining: yesNoUnsure(),
  intermittency: yesNoUnsure(),
  incompleteEmptying: yesNoUnsure(),
  hematuriaPattern: {
    type: "select",
    options: [["One time", "一次"], ["More than once", "不只一次"], ["Every time recently", "最近幾乎每次"], ["Not sure", "不確定"]]
  },
  bloodClots: yesNoUnsure(),
  painFrequency: {
    type: "select",
    options: [["Only while urinating", "尿尿時"], ["After urinating", "尿完後"], ["Most of the day", "一天中大多時間"], ["Comes and goes", "有時有、有時沒有"], ["Not sure", "不確定"]]
  },
  infectionEpisodeHistory: {
    type: "select",
    options: [["No", "沒有"], ["Yes, once", "有，1 次"], ["Yes, more than once", "有，超過 1 次"], ["Not sure", "不確定"]]
  },
  flankPainScore: {
    type: "select",
    options: [["0", "0"], ["1 to 3", "1 到 3"], ["4 to 6", "4 到 6"], ["7 to 10", "7 到 10"], ["Not sure", "不確定"]]
  },
  medicationAssist: yesNoUnsure()
};

function yesNoUnsure() {
  return {
    type: "select",
    options: [["No", "沒有"], ["Yes", "有"], ["Not sure", "不確定"]]
  };
}

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
    return stored ? JSON.parse(stored) : findCase("synthetic-incomplete-leakage").answers;
  } catch (error) {
    return findCase("synthetic-incomplete-leakage").answers;
  }
}

function saveAnswers(answers) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  } catch (error) {
    // Browser storage may be unavailable; keep the visible demo state usable.
  }
}

function ensureAnswerShape(answers) {
  return Object.assign({ sourceByField: {} }, answers || {}, {
    sourceByField: Object.assign({}, answers && answers.sourceByField)
  });
}

function updateAnswer(field, value) {
  const answers = ensureAnswerShape(readAnswers());
  const sourceByField = Object.assign({}, answers.sourceByField, {
    [field]: "nurse_supplement"
  });
  answers[field] = value;
  answers.sourceByField = sourceByField;
  saveAnswers(answers);
  render();
  showToast("已補上並標記為現場補問。");
}

function toggleAnswer(field, value, checked) {
  const answers = ensureAnswerShape(readAnswers());
  let next = Array.isArray(answers[field]) ? answers[field].filter((item) => item !== value) : [];
  if (checked) {
    if (EXCLUSIVE_CHECKBOX_VALUES.has(value)) {
      next = [value];
    } else {
      next = next.filter((item) => !EXCLUSIVE_CHECKBOX_VALUES.has(item));
      next.push(value);
    }
  }
  updateAnswer(field, next);
}

function renderControl(field) {
  const control = FIELD_CONTROLS[field] || { type: "text" };
  const answers = readAnswers();
  if (control.type === "checkboxes") {
    const current = Array.isArray(answers[field]) ? answers[field] : [];
    return `
      <div class="repair-control checkbox-grid">
        ${control.options.map(([value, label]) => `
          <label class="checkbox-option">
            <input
              type="checkbox"
              data-repair-checkbox="${escapeHtml(field)}"
              data-repair-value="${escapeHtml(value)}"
              ${current.includes(value) ? "checked" : ""}>
            <span>${escapeHtml(label)}</span>
          </label>
        `).join("")}
      </div>
    `;
  }
  if (control.type === "select") {
    return `
      <label class="repair-control">
        <span>補問答案</span>
        <select data-repair-field="${escapeHtml(field)}">
          <option value="">請選擇</option>
          ${control.options.map(([value, label]) => `
            <option value="${escapeHtml(value)}" ${answers[field] === value ? "selected" : ""}>${escapeHtml(label)}</option>
          `).join("")}
        </select>
      </label>
    `;
  }
  return `
    <label class="repair-control">
      <span>補問答案</span>
      <input data-repair-field="${escapeHtml(field)}" type="text" value="${escapeHtml(answers[field] || "")}">
    </label>
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

function render() {
  const answers = readAnswers();
  const checklist = buildNurseChecklist(answers);
  const summary = buildClinicianSummary(answers);
  const status = checklist.completionStatus;

  completionTitle.textContent = status.missingCount
    ? `${status.missingCount} 項待補`
    : "重點欄位已完成";
  completionMeta.textContent = `${status.completed}/${status.total} required fields captured.`;

  sourceNotesMount.innerHTML = checklist.sourceNotes.map((note) => `
    <div class="source-card">
      <span>${escapeHtml(note)}</span>
    </div>
  `).join("");

  if (!checklist.supplementalQuestions.length) {
    supplementMount.innerHTML = `
      <div class="empty-state">
        <h4>目前沒有必補問題</h4>
        <p>可前往醫師摘要頁查看整理後的看診前重點。</p>
      </div>
    `;
  } else {
    supplementMount.innerHTML = checklist.supplementalQuestions.map((item, index) => `
      <section class="task-card">
        <span class="task-index">${index + 1}</span>
        <div>
          <h3>${escapeHtml(item.ask)}</h3>
          <p>${escapeHtml(item.why)}</p>
          <small>欄位：${escapeHtml(item.field)}</small>
          ${renderControl(item.field)}
        </div>
      </section>
    `).join("");
  }

  reviewMount.innerHTML = `
    <section class="summary-section">
      <h3>已啟動模組</h3>
      <ul class="support-list">
        ${(checklist.activeModules.length ? checklist.activeModules : ["core only"]).map((module) => `
          <li>${escapeHtml(MODULE_LABELS[module] || module)}</li>
        `).join("")}
      </ul>
    </section>

    <section class="summary-section">
      <h3>需現場確認的病人回報</h3>
      <ul class="flag-list">
        ${checklist.priorityReviewFlags.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </section>

    <section class="summary-section">
      <h3>工作提醒</h3>
      <ul class="support-list">
        ${checklist.workflowCues.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </section>

    <section class="summary-section">
      <h3>主訴</h3>
      <p>${escapeHtml(summary.chiefConcern)}</p>
    </section>
  `;
}

refreshButton.addEventListener("click", () => {
  render();
  showToast("已重新讀取最新填答。");
});

loadIncomplete.addEventListener("click", () => {
  saveAnswers(findCase("synthetic-incomplete-leakage").answers);
  render();
  showToast("已載入缺漏示範。");
});

supplementMount.addEventListener("change", (event) => {
  const checkbox = event.target.closest("[data-repair-checkbox]");
  if (checkbox) {
    toggleAnswer(checkbox.dataset.repairCheckbox, checkbox.dataset.repairValue, checkbox.checked);
    return;
  }
  const field = event.target.closest("[data-repair-field]");
  if (!field) return;
  updateAnswer(field.dataset.repairField, ARRAY_FIELDS.has(field.dataset.repairField) ? [] : field.value);
});

render();
