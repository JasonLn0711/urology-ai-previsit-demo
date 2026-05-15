const { buildReviewRecord, reviewRecordToText } = window.UrologyPrevisitReview;

let reviewInputs = {
  reviewerRole: "",
  workflowPain: "",
  summaryUsefulness: "",
  staffBurden: "",
  patientFit: "",
  safetyBoundary: "",
  workflowSlot: "",
  existingProcess: "",
  mostUsefulLine: "",
  noisiestLine: "",
  missingInformation: "",
  unsafeWording: "",
  expectedWorkflowSlot: "",
  staffBurdenConcern: "",
  caseEvidence: "",
  decision: "",
  nextArtifact: "",
  reviewerNotes: ""
};

const form = document.querySelector("#reviewerForm");
const decisionMount = document.querySelector("#decisionMount");
const copyRecord = document.querySelector("#copyRecord");
const printRecord = document.querySelector("#printRecord");
const toast = document.querySelector("#toast");

const DISPLAY_LABELS = {
  continue: "繼續",
  revise: "修正",
  stop: "停止",
  unknown: "未填",
  supporting: "支持",
  blocking: "阻擋",
  uncertain: "不明確",
  clear: "明確",
  mixed: "混合或不明確",
  no: "沒有",
  "would-read": "看診時會讀",
  "needs-rewrite": "方向有用，但格式需重寫",
  "needs-wording": "需要改文字",
  exists: "有實際流程位置",
  none: "沒有流程位置",
  acceptable: "可接受",
  unacceptable: "不可接受",
  "self-filled": "自行填答可行",
  "assisted-only": "僅適合協助填答",
  unrealistic: "填答不實際",
  "not-sufficient": "既有流程仍有缺口",
  sufficient: "既有流程可能已足夠",
  Physician: "醫師",
  Nurse: "護理人員",
  "Patient advocate": "病人代表",
  "Product / workflow reviewer": "產品/流程審閱者",
  "Governance reviewer": "治理審閱者",
  Other: "其他"
};

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function display(value) {
  return DISPLAY_LABELS[value] || value || DISPLAY_LABELS.unknown;
}

function currentRecord() {
  return buildReviewRecord(reviewInputs);
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

function renderEvidence(record) {
  return record.evidence.map((item) => `
    <div class="decision-row ${escapeHtml(item.status)}">
      <dt>${escapeHtml(item.label)}</dt>
      <dd>${escapeHtml(display(item.value))}</dd>
    </div>
  `).join("");
}

function render() {
  const record = currentRecord();
  decisionMount.innerHTML = `
    <section class="decision-banner ${escapeHtml(record.decision)}">
      <span>紀錄決策</span>
      <strong>${escapeHtml(display(record.decision))}</strong>
      <small>建議：${escapeHtml(display(record.suggestedDecision))}</small>
    </section>
    <section class="summary-section">
      <h3>證據訊號</h3>
      <dl class="decision-list">${renderEvidence(record)}</dl>
    </section>
    <section class="summary-section">
      <h3>會議證據</h3>
      <ul class="missing-list">
        ${record.meetingEvidence.map(([label, value]) => `<li><strong>${escapeHtml(label)}：</strong> ${escapeHtml(value)}</li>`).join("")}
      </ul>
    </section>
    <section class="summary-section">
      <h3>阻擋因素</h3>
      <ul class="missing-list">
        ${
          record.blockers.length
            ? record.blockers.map((item) => `<li>${escapeHtml(item)}</li>`).join("")
            : "<li>目前沒有硬性阻擋因素。</li>"
        }
      </ul>
    </section>
    <section class="summary-section">
      <h3>下一個產物</h3>
      <p>${escapeHtml(record.nextArtifact)}</p>
    </section>
    <section class="summary-section">
      <h3>安全邊界</h3>
      <ul class="notice-list">
        ${record.safetyBoundary.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </section>
  `;
}

form.addEventListener("input", (event) => {
  const field = event.target.closest("[data-review-field]");
  if (!field) return;
  reviewInputs = Object.assign({}, reviewInputs, { [field.dataset.reviewField]: field.value });
  render();
});

form.addEventListener("change", (event) => {
  const field = event.target.closest("[data-review-field]");
  if (!field) return;
  reviewInputs = Object.assign({}, reviewInputs, { [field.dataset.reviewField]: field.value });
  render();
});

copyRecord.addEventListener("click", async () => {
  const text = reviewRecordToText(currentRecord());
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    showToast("已複製審閱紀錄。");
  } catch (error) {
    showToast("無法複製，請改用列印。");
  }
});

printRecord.addEventListener("click", () => {
  window.print();
});

render();
