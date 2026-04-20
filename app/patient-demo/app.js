const {
  REQUIRED_FIELDS,
  buildClinicianSummary,
  completionStatus,
  summaryToText
} = window.UrologyPrevisit;

const ANSWER_FIELDS = [
  "entryMode",
  "symptomCategory",
  "duration",
  "severity",
  "frequencyDay",
  "nocturia",
  "leak",
  "painBurning",
  "blood",
  "fever",
  "unableToUrinate",
  "medications",
  "language",
  "phoneComfort",
  "supportNeeds",
  "notes"
];

const FIELD_TO_STEP = {
  entryMode: 0,
  symptomCategory: 1,
  duration: 2,
  severity: 2,
  frequencyDay: 2,
  nocturia: 2,
  unableToUrinate: 3,
  blood: 3,
  fever: 3,
  painBurning: 3,
  leak: 3,
  language: 4,
  phoneComfort: 4,
  supportNeeds: 4,
  medications: 4,
  notes: 4
};

const STEPS = [
  {
    id: "mode",
    label: "Mode",
    title: "Who is filling this out?",
    copy: "Choose the support mode for this synthetic previsit intake.",
    type: "options",
    field: "entryMode",
    options: [
      ["Patient self-filled", "Patient self-filled", "The patient is answering directly."],
      ["Nurse-assisted", "Nurse-assisted", "Clinic staff helps the patient complete the flow."],
      ["Family-assisted", "Family-assisted", "A trusted helper is present."],
      ["Demo observer", "Demo observer", "Synthetic walkthrough for review only."]
    ]
  },
  {
    id: "concern",
    label: "Concern",
    title: "What is the main urinary concern?",
    copy: "Pick the closest starting point. The clinician can revise it later.",
    type: "options",
    field: "symptomCategory",
    options: [
      ["Frequency or urgency", "Frequency or urgency", "Going often or feeling sudden urgency."],
      ["Leakage", "Leakage", "Accidental urine leakage."],
      ["Difficulty emptying", "Difficulty emptying", "Weak stream, trouble starting, or incomplete emptying."],
      ["Pain or burning", "Pain or burning", "Discomfort when urinating."],
      ["Visible blood", "Visible blood", "Blood noticed in urine."],
      ["Other concern", "Other concern", "Something else to explain."]
    ]
  },
  {
    id: "pattern",
    label: "Pattern",
    title: "Describe the pattern",
    copy: "These are patient-reported details for clinician review.",
    type: "fields",
    fields: [
      {
        field: "duration",
        label: "How long has this been happening?",
        type: "select",
        options: ["", "Today", "1 to 7 days", "1 to 4 weeks", "More than 1 month", "Not sure"]
      },
      {
        field: "severity",
        label: "How bothersome is it?",
        type: "select",
        options: ["", "Mild", "Moderate", "Severe", "Not sure"]
      },
      {
        field: "frequencyDay",
        label: "Bathroom trips during the day",
        type: "select",
        options: ["", "1 to 4 times", "5 to 8 times", "9 to 12 times", "More than 12 times", "Not sure"]
      },
      {
        field: "nocturia",
        label: "Bathroom trips at night",
        type: "select",
        options: ["", "0 times", "1 to 2 times", "3 or more times", "Not sure"]
      }
    ]
  },
  {
    id: "review-flags",
    label: "Flags",
    title: "Anything the clinician should review quickly?",
    copy: "These statements are displayed neutrally. The system does not assign meaning or urgency.",
    type: "fields",
    fields: [
      {
        field: "unableToUrinate",
        label: "Unable to urinate at any point?",
        type: "select",
        options: ["", "No", "Yes", "Not sure"]
      },
      {
        field: "blood",
        label: "Blood in urine?",
        type: "select",
        options: ["", "No", "Yes", "Not sure"]
      },
      {
        field: "fever",
        label: "Fever or chills?",
        type: "select",
        options: ["", "No", "Yes", "Not sure"]
      },
      {
        field: "painBurning",
        label: "Pain or burning when urinating?",
        type: "select",
        options: ["", "No", "Yes", "Not sure"]
      },
      {
        field: "leak",
        label: "Any leakage?",
        type: "select",
        options: ["", "No", "Yes", "Not sure"]
      }
    ]
  },
  {
    id: "support",
    label: "Support",
    title: "Support needs and context",
    copy: "These answers help the clinic decide whether self-filled or assisted intake is realistic.",
    type: "fields",
    fields: [
      {
        field: "language",
        label: "Preferred language",
        type: "select",
        options: ["", "Mandarin", "Taiwanese", "Mandarin with Taiwanese preferred", "English", "Other"]
      },
      {
        field: "phoneComfort",
        label: "Phone comfort",
        type: "select",
        options: ["", "Comfortable", "Can use phone with help", "Needs large buttons", "Prefer staff help"]
      },
      {
        field: "supportNeeds",
        label: "Support need",
        type: "select",
        options: ["", "Self-filled", "Nurse-assisted mode", "Family-assisted mode", "Needs review before clinician enters"]
      },
      {
        field: "medications",
        label: "Medicines or relevant uncertainty",
        type: "textarea",
        placeholder: "Synthetic example: blood pressure medicine; exact name unknown"
      },
      {
        field: "notes",
        label: "Optional patient context",
        type: "textarea",
        placeholder: "Synthetic note for clinician review"
      }
    ]
  },
  {
    id: "repair",
    label: "Repair",
    title: "Repair missing information",
    copy: "Missing fields stay visible. Answer what is available, or leave the gap for clinician review.",
    type: "repair"
  },
  {
    id: "review",
    label: "Review",
    title: "Review before handoff",
    copy: "Patient, helper, or staff can catch unclear answers before the clinician summary is used.",
    type: "review"
  }
];

const SCENARIOS = [
  {
    id: "frequency-night",
    label: "Frequent urination at night",
    meta: "Older adult, language support",
    answers: {
      entryMode: "Patient self-filled",
      symptomCategory: "Frequency or urgency",
      duration: "More than 1 month",
      severity: "Moderate",
      frequencyDay: "9 to 12 times",
      nocturia: "3 or more times",
      leak: "No",
      painBurning: "No",
      blood: "No",
      fever: "No",
      unableToUrinate: "No",
      medications: "Blood pressure medicine; exact name unknown",
      language: "Mandarin with Taiwanese preferred",
      phoneComfort: "Needs large buttons",
      supportNeeds: "Needs review before clinician enters",
      notes: "Patient worries about waking up repeatedly at night."
    }
  },
  {
    id: "emptying-difficulty",
    label: "Difficulty emptying",
    meta: "Nurse-assisted review",
    answers: {
      entryMode: "Nurse-assisted",
      symptomCategory: "Difficulty emptying",
      duration: "1 to 4 weeks",
      severity: "Severe",
      frequencyDay: "5 to 8 times",
      nocturia: "1 to 2 times",
      leak: "No",
      painBurning: "No",
      blood: "No",
      fever: "No",
      unableToUrinate: "Yes",
      medications: "Synthetic medication list not provided",
      language: "Mandarin",
      phoneComfort: "Can use phone with help",
      supportNeeds: "Nurse-assisted mode",
      notes: "Patient says flow is weak and sometimes cannot start."
    }
  },
  {
    id: "incomplete-leakage",
    label: "Incomplete leakage intake",
    meta: "Shows missing-info repair",
    answers: {
      entryMode: "Family-assisted",
      symptomCategory: "Leakage",
      duration: "",
      severity: "Mild",
      frequencyDay: "",
      nocturia: "Not sure",
      leak: "Yes",
      painBurning: "",
      blood: "No",
      fever: "",
      unableToUrinate: "No",
      medications: "",
      language: "Taiwanese",
      phoneComfort: "Prefer staff help",
      supportNeeds: "Family-assisted mode",
      notes: "Helper says the patient is embarrassed to discuss leakage."
    }
  }
];

let currentStep = 0;
let activeScenario = "";
let answers = emptyAnswers();

const mount = document.querySelector("#stepMount");
const summaryMount = document.querySelector("#summaryMount");
const progressBar = document.querySelector("#progressBar");
const progressText = document.querySelector("#progressText");
const stepNav = document.querySelector("#stepNav");
const scenarioMount = document.querySelector("#scenarioMount");
const readinessLabel = document.querySelector("#readinessLabel");
const readinessMeter = document.querySelector("#readinessMeter");
const missingCount = document.querySelector("#missingCount");
const backButton = document.querySelector("#backButton");
const nextButton = document.querySelector("#nextButton");
const loadSample = document.querySelector("#loadSample");
const resetDemo = document.querySelector("#resetDemo");
const printSummary = document.querySelector("#printSummary");
const copySummary = document.querySelector("#copySummary");
const toast = document.querySelector("#toast");

function emptyAnswers() {
  return Object.fromEntries(ANSWER_FIELDS.map((field) => [field, ""]));
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isCompleteField(field) {
  return Boolean(String(answers[field] || "").trim());
}

function missingEntries() {
  return REQUIRED_FIELDS.filter(([field]) => !isCompleteField(field));
}

function setAnswer(field, value) {
  answers = Object.assign({}, answers, { [field]: value });
  render();
}

function loadScenario(scenarioId) {
  const scenario = SCENARIOS.find((item) => item.id === scenarioId) || SCENARIOS[0];
  activeScenario = scenario.id;
  answers = Object.assign(emptyAnswers(), scenario.answers);
  currentStep = STEPS.length - 1;
  render();
  showToast(`Loaded synthetic case: ${scenario.label}`);
}

function renderScenarios() {
  scenarioMount.innerHTML = SCENARIOS.map((scenario) => `
    <button
      class="scenario-button"
      type="button"
      data-scenario="${escapeHtml(scenario.id)}"
      aria-pressed="${activeScenario === scenario.id ? "true" : "false"}">
      <strong>${escapeHtml(scenario.label)}</strong>
      <span>${escapeHtml(scenario.meta)}</span>
    </button>
  `).join("");
}

function renderStepNav() {
  stepNav.innerHTML = STEPS.map((step, index) => {
    const isActive = index === currentStep;
    const state = index < currentStep ? "complete" : isActive ? "active" : "upcoming";
    return `
      <button class="step-chip ${state}" type="button" data-step-index="${index}" aria-current="${isActive ? "step" : "false"}">
        <span>${index + 1}</span>
        ${escapeHtml(step.label)}
      </button>
    `;
  }).join("");
}

function renderOptions(step) {
  return `
    <div class="option-grid" role="group" aria-label="${escapeHtml(step.title)}">
      ${step.options.map(([value, label, detail]) => `
        <button
          class="option-button"
          type="button"
          data-option-field="${escapeHtml(step.field)}"
          data-option-value="${escapeHtml(value)}"
          aria-pressed="${answers[step.field] === value ? "true" : "false"}">
          <strong>${escapeHtml(label)}</strong>
          <span>${escapeHtml(detail)}</span>
        </button>
      `).join("")}
    </div>
  `;
}

function renderFields(step) {
  return `
    <div class="field-grid">
      ${step.fields.map((field) => {
        if (field.type === "textarea") {
          return `
            <div class="field wide-field">
              <label for="${escapeHtml(field.field)}">${escapeHtml(field.label)}</label>
              <textarea id="${escapeHtml(field.field)}" data-field="${escapeHtml(field.field)}" placeholder="${escapeHtml(field.placeholder || "")}">${escapeHtml(answers[field.field])}</textarea>
            </div>
          `;
        }
        return `
          <div class="field">
            <label for="${escapeHtml(field.field)}">${escapeHtml(field.label)}</label>
            <select id="${escapeHtml(field.field)}" data-field="${escapeHtml(field.field)}">
              ${field.options.map((option) => `
                <option value="${escapeHtml(option)}" ${answers[field.field] === option ? "selected" : ""}>
                  ${option ? escapeHtml(option) : "Choose one"}
                </option>
              `).join("")}
            </select>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderRepair() {
  const missing = missingEntries();
  if (!missing.length) {
    return `
      <div class="empty-state">
        <h4>No missing MVP fields.</h4>
        <p>The summary is ready for clinician review, with the safety boundary still visible.</p>
      </div>
    `;
  }

  return `
    <div class="repair-list">
      ${missing.map(([field, label]) => `
        <button class="repair-item" type="button" data-go-step="${FIELD_TO_STEP[field] || 0}">
          <span>Missing</span>
          <strong>${escapeHtml(label)}</strong>
          <small>Go to ${escapeHtml(STEPS[FIELD_TO_STEP[field] || 0].label)}</small>
        </button>
      `).join("")}
    </div>
  `;
}

function renderReview() {
  const summary = buildClinicianSummary(answers);
  const rows = [
    ["Intake mode", summary.intakeMode],
    ["Chief concern", summary.chiefConcern],
    ["Pattern", summary.symptomPattern],
    ["Duration / bother", summary.durationSeverity],
    ["Medicines", summary.medicines],
    ["Support needs", summary.patientConstraints.join("; ")],
    ["Patient note", summary.patientNote]
  ];
  return `
    <div class="handoff-note">
      <strong>${escapeHtml(summary.completionStatus.label)}</strong>
      <span>${escapeHtml(summary.handoffNote)}</span>
    </div>
    <dl class="review-grid">
      ${rows.map(([label, value]) => `
        <div class="review-row">
          <dt>${escapeHtml(label)}</dt>
          <dd>${escapeHtml(value)}</dd>
        </div>
      `).join("")}
    </dl>
  `;
}

function renderStep() {
  const step = STEPS[currentStep];
  let body = "";
  if (step.type === "options") body = renderOptions(step);
  if (step.type === "fields") body = renderFields(step);
  if (step.type === "repair") body = renderRepair(step);
  if (step.type === "review") body = renderReview();

  mount.innerHTML = `
    <section class="step-panel" aria-labelledby="step-title">
      <div class="step-kicker">Step ${currentStep + 1} of ${STEPS.length}</div>
      <h2 id="step-title">${escapeHtml(step.title)}</h2>
      <p class="step-copy">${escapeHtml(step.copy)}</p>
      ${body}
    </section>
  `;
}

function renderSummary() {
  const summary = buildClinicianSummary(answers);
  summaryMount.innerHTML = `
    <section class="summary-section">
      <h3>Safety boundary</h3>
      <ul class="notice-list">
        ${summary.safetyNotice.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </section>
    <section class="summary-section">
      <h3>Patient-provided context</h3>
      <dl class="summary-list">
        <div class="summary-row">
          <dt>Intake mode</dt>
          <dd>${escapeHtml(summary.intakeMode)}</dd>
        </div>
        <div class="summary-row">
          <dt>Chief concern</dt>
          <dd>${escapeHtml(summary.chiefConcern)}</dd>
        </div>
        <div class="summary-row">
          <dt>Pattern</dt>
          <dd>${escapeHtml(summary.symptomPattern)}</dd>
        </div>
        <div class="summary-row">
          <dt>Duration / bother</dt>
          <dd>${escapeHtml(summary.durationSeverity)}</dd>
        </div>
      </dl>
    </section>
    <section class="summary-section">
      <h3>Clinician review flags</h3>
      <ul class="flag-list">
        ${summary.clinicianReviewFlags.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </section>
    <section class="summary-section">
      <h3>Missing information</h3>
      <ul class="missing-list">
        ${summary.missingInformation.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </section>
    <section class="summary-section">
      <h3>Support needs</h3>
      <ul class="support-list">
        ${summary.patientConstraints.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </section>
  `;
}

function renderReadiness() {
  const status = completionStatus(answers);
  const percentage = Math.round((status.completed / status.total) * 100);
  readinessLabel.textContent = status.label;
  readinessMeter.style.width = `${percentage}%`;
  readinessMeter.dataset.tone = status.tone;
  missingCount.textContent = String(status.missingCount);
}

function renderProgress() {
  const width = ((currentStep + 1) / STEPS.length) * 100;
  progressBar.style.width = `${width}%`;
  progressText.textContent = `Step ${currentStep + 1} of ${STEPS.length}`;
  backButton.disabled = currentStep === 0;
  nextButton.textContent = currentStep === STEPS.length - 1 ? "Back to first step" : "Next";
}

function render() {
  renderScenarios();
  renderStepNav();
  renderStep();
  renderSummary();
  renderReadiness();
  renderProgress();
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

mount.addEventListener("click", (event) => {
  const option = event.target.closest("[data-option-field]");
  if (option) {
    setAnswer(option.dataset.optionField, option.dataset.optionValue);
    return;
  }

  const repair = event.target.closest("[data-go-step]");
  if (repair) {
    currentStep = Number(repair.dataset.goStep);
    render();
  }
});

mount.addEventListener("change", (event) => {
  const field = event.target.closest("[data-field]");
  if (!field) return;
  setAnswer(field.dataset.field, field.value);
});

mount.addEventListener("input", (event) => {
  const field = event.target.closest("textarea[data-field]");
  if (!field) return;
  answers = Object.assign({}, answers, { [field.dataset.field]: field.value });
  renderSummary();
  renderReadiness();
});

stepNav.addEventListener("click", (event) => {
  const stepButton = event.target.closest("[data-step-index]");
  if (!stepButton) return;
  currentStep = Number(stepButton.dataset.stepIndex);
  render();
});

scenarioMount.addEventListener("click", (event) => {
  const button = event.target.closest("[data-scenario]");
  if (!button) return;
  loadScenario(button.dataset.scenario);
});

backButton.addEventListener("click", () => {
  currentStep = Math.max(0, currentStep - 1);
  render();
});

nextButton.addEventListener("click", () => {
  currentStep = currentStep === STEPS.length - 1 ? 0 : currentStep + 1;
  render();
});

loadSample.addEventListener("click", () => {
  loadScenario(SCENARIOS[0].id);
});

resetDemo.addEventListener("click", () => {
  activeScenario = "";
  answers = emptyAnswers();
  currentStep = 0;
  render();
  showToast("Reset synthetic intake.");
});

printSummary.addEventListener("click", () => {
  window.print();
});

copySummary.addEventListener("click", async () => {
  const text = summaryToText(buildClinicianSummary(answers));
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
    showToast("Synthetic summary copied.");
  } catch (error) {
    showToast("Copy failed. Use print instead.");
  }
});

render();
