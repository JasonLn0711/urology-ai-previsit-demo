const {
  buildVisitPacket,
  visitPacketToText
} = window.UrologyPrevisit;
const { findCase } = window.UrologyCases;

const STORAGE_KEY = "urologyPrevisitAnswers";

const packetMount = document.querySelector("#packetMount");
const packetStatus = document.querySelector("#packetStatus");
const packetMeta = document.querySelector("#packetMeta");
const loadSample = document.querySelector("#loadSample");
const copyPacket = document.querySelector("#copyPacket");
const printPacket = document.querySelector("#printPacket");
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
  "No required MVP fields missing.": "目前沒有必補欄位。",
  "No priority review statement captured in this synthetic case.": "目前沒有需特別標示的回報。"
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
    return stored ? JSON.parse(stored) : findCase("synthetic-incomplete-leakage").answers;
  } catch (error) {
    return findCase("synthetic-incomplete-leakage").answers;
  }
}

function saveAnswers(answers) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  } catch (error) {
    // Static demo keeps rendering with fallback data when storage is blocked.
  }
}

function display(value) {
  if (Array.isArray(value)) {
    return value.length ? value.map(display).join("、") : "未填";
  }
  if (!value) return "未填";
  return LABELS[value] || value;
}

function rows(rows) {
  return `
    <dl class="packet-export-rows">
      ${rows.map(([label, value]) => `
        <div>
          <dt>${escapeHtml(display(label))}</dt>
          <dd>${escapeHtml(display(value))}</dd>
        </div>
      `).join("")}
    </dl>
  `;
}

function list(items, emptyLabel = "目前沒有項目。") {
  const visibleItems = (items || []).filter(Boolean);
  if (!visibleItems.length) {
    return `<p>${escapeHtml(emptyLabel)}</p>`;
  }
  return `
    <ul class="packet-export-list">
      ${visibleItems.map((item) => `<li>${escapeHtml(display(item))}</li>`).join("")}
    </ul>
  `;
}

function questionList(items) {
  if (!items.length) {
    return "<p>目前沒有必補問題。</p>";
  }
  return `
    <ol class="packet-question-list">
      ${items.map((item) => `
        <li>
          <strong>${escapeHtml(item.ask)}</strong>
          <span>${escapeHtml(item.why)}</span>
        </li>
      `).join("")}
    </ol>
  `;
}

function renderPatientPage(packet) {
  return `
    <article class="packet-page patient-page">
      <header>
        <p class="eyebrow">給病人與家屬確認</p>
        <h2>${escapeHtml(packet.patientPage.title)}</h2>
      </header>
      <p class="packet-purpose">這頁用白話確認「剛剛整理了什麼」。不包含護理工作項或醫師判讀。</p>
      ${rows(packet.patientPage.rows)}
      <section>
        <h3>還可以補充或到現場再說</h3>
        ${list(packet.patientPage.missingInformation)}
      </section>
      <section>
        <h3>資料來源提醒</h3>
        ${list(packet.patientPage.sourceNotes)}
      </section>
    </article>
  `;
}

function renderNursePage(packet) {
  return `
    <article class="packet-page nurse-page">
      <header>
        <p class="eyebrow">給護理/個管補問</p>
        <h2>${escapeHtml(packet.nursePage.title)}</h2>
      </header>
      <p class="packet-purpose">這頁把缺漏轉成可直接問的句子；補上後應標記為現場補問。</p>
      <section>
        <h3>完成度</h3>
        <p>${escapeHtml(packet.nursePage.completionStatus.label)}</p>
      </section>
      <section>
        <h3>自動補問清單</h3>
        ${questionList(packet.nursePage.supplementalQuestions)}
      </section>
      <section>
        <h3>工作提醒</h3>
        ${list(packet.nursePage.workflowCues)}
      </section>
      <section>
        <h3>需現場確認的回報</h3>
        ${list(packet.nursePage.priorityReviewFlags)}
      </section>
    </article>
  `;
}

function renderClinicianPage(packet) {
  return `
    <article class="packet-page clinician-page">
      <header>
        <p class="eyebrow">給醫師看診前掃描</p>
        <h2>${escapeHtml(packet.clinicianPage.title)}</h2>
      </header>
      <p class="packet-purpose">這頁只呈現病人/家屬/現場補問資料，不做診斷、分流或治療建議。</p>
      ${rows(packet.clinicianPage.rows)}
      <section>
        <h3>需現場確認的病人回報</h3>
        ${list(packet.clinicianPage.priorityReviewFlags)}
      </section>
      <section>
        <h3>缺漏資訊</h3>
        ${list(packet.clinicianPage.missingInformation)}
      </section>
      <section>
        <h3>答案來源分布</h3>
        ${list(packet.clinicianPage.sourceAttributionSummary)}
      </section>
    </article>
  `;
}

function render() {
  const answers = readAnswers();
  const packet = buildVisitPacket(answers);
  const missingCount = packet.nursePage.completionStatus.missingCount;
  packetStatus.textContent = missingCount ? `${missingCount} 項待補` : "資料包可列印";
  packetMeta.textContent = `${packet.nursePage.completionStatus.completed}/${packet.nursePage.completionStatus.total} required fields captured.`;
  packetMount.innerHTML = [
    renderPatientPage(packet),
    renderNursePage(packet),
    renderClinicianPage(packet)
  ].join("");
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
  saveAnswers(findCase("synthetic-incomplete-leakage").answers);
  render();
  showToast("已載入資料包示範。");
});

copyPacket.addEventListener("click", async () => {
  const packet = buildVisitPacket(readAnswers());
  try {
    await navigator.clipboard.writeText(visitPacketToText(packet));
    showToast("已複製資料包文字。");
  } catch (error) {
    showToast("無法複製，請改用列印。");
  }
});

printPacket.addEventListener("click", () => {
  window.print();
});

render();
