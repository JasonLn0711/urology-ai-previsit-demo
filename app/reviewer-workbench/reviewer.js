const { buildReviewRecord, reviewRecordToText } = window.UrologyPrevisitReview;

let reviewInputs = {
  workflowPain: "",
  summaryUsefulness: "",
  staffBurden: "",
  patientFit: "",
  safetyBoundary: "",
  workflowSlot: "",
  existingProcess: "",
  decision: "",
  nextArtifact: "",
  reviewerNotes: ""
};

const form = document.querySelector("#reviewerForm");
const decisionMount = document.querySelector("#decisionMount");
const copyRecord = document.querySelector("#copyRecord");
const printRecord = document.querySelector("#printRecord");
const toast = document.querySelector("#toast");

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function titleCase(value) {
  return String(value || "unknown")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
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
      <dd>${escapeHtml(titleCase(item.value))}</dd>
    </div>
  `).join("");
}

function render() {
  const record = currentRecord();
  decisionMount.innerHTML = `
    <section class="decision-banner ${escapeHtml(record.decision)}">
      <span>Recorded decision</span>
      <strong>${escapeHtml(titleCase(record.decision))}</strong>
      <small>Guide: ${escapeHtml(titleCase(record.suggestedDecision))}</small>
    </section>
    <section class="summary-section">
      <h3>Evidence signals</h3>
      <dl class="decision-list">${renderEvidence(record)}</dl>
    </section>
    <section class="summary-section">
      <h3>Blockers</h3>
      <ul class="missing-list">
        ${
          record.blockers.length
            ? record.blockers.map((item) => `<li>${escapeHtml(item)}</li>`).join("")
            : "<li>No hard blockers recorded.</li>"
        }
      </ul>
    </section>
    <section class="summary-section">
      <h3>Next artifact</h3>
      <p>${escapeHtml(record.nextArtifact)}</p>
    </section>
    <section class="summary-section">
      <h3>Safety boundary</h3>
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
    showToast("Reviewer record copied.");
  } catch (error) {
    showToast("Copy failed. Use print instead.");
  }
});

printRecord.addEventListener("click", () => {
  window.print();
});

render();
