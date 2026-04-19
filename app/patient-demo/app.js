const { buildClinicianSummary } = window.UrologyPrevisit;

const STEPS = [
  {
    id: "mode",
    title: "Who is filling this out?",
    copy: "Choose the support mode for this synthetic previsit check-in.",
    type: "options",
    field: "entryMode",
    options: [
      ["patient", "Patient", "I am answering myself."],
      ["nurse", "Nurse-assisted", "A staff member is helping."],
      ["family", "Family-assisted", "A trusted helper is present."],
      ["demo", "Demo observer", "Synthetic walkthrough only."]
    ]
  },
  {
    id: "concern",
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
    title: "Describe the pattern",
    copy: "These are quick patient-reported details, not a diagnosis.",
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
    id: "reviewFlags",
    title: "Anything the clinician should review quickly?",
    copy: "These statements are shown as clinician-review flags only.",
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
    title: "Support needs",
    copy: "This helps the clinic choose a self-filled or nurse-assisted path.",
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
        placeholder: "Synthetic example: blood pressure medicine, exact name unknown"
      },
      {
        field: "notes",
        label: "Optional context",
        type: "textarea",
        placeholder: "Synthetic patient note"
      }
    ]
  },
  {
    id: "review",
    title: "Review before clinician summary",
    copy: "The patient or nurse can catch missing details before the physician sees the summary.",
    type: "review"
  }
];

const SAMPLE_CASES = [
  {
    id: "synthetic-frequency-older-adult",
    label: "Synthetic case: frequent urination at night",
    answers: {
      entryMode: "patient",
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
      supportNeeds: "May need nurse help reviewing answers",
      notes: "Patient worries about waking up repeatedly at night."
    }
  }
];

let currentStep = 0;
let answers = {
  entryMode: "",
  symptomCategory: "",
  duration: "",
  severity: "",
  frequencyDay: "",
  nocturia: "",
  leak: "",
  painBurning: "",
  blood: "",
  fever: "",
  unableToUrinate: "",
  medications: "",
  language: "",
  phoneComfort: "",
  supportNeeds: "",
  notes: ""
};

const mount = document.querySelector("#stepMount");
const summaryMount = document.querySelector("#summaryMount");
const progressBar = document.querySelector("#progressBar");
const progressText = document.querySelector("#progressText");
const backButton = document.querySelector("#backButton");
const nextButton = document.querySelector("#nextButton");
const loadSample = document.querySelector("#loadSample");
const resetDemo = document.querySelector("#resetDemo");
const printSummary = document.querySelector("#printSummary");

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function setAnswer(field, value) {
  answers = Object.assign({}, answers, { [field]: value });
  render();
}

function renderOptions(step) {
  return `
    <div class="option-grid" role="group" aria-label="${escapeHtml(step.title)}">
      ${step.options
        .map(([value, label, detail]) => `
          <button
            class="option-button"
            type="button"
            data-option-field="${escapeHtml(step.field)}"
            data-option-value="${escapeHtml(value)}"
            aria-pressed="${answers[step.field] === value ? "true" : "false"}">
            <strong>${escapeHtml(label)}</strong>
            <span>${escapeHtml(detail)}</span>
          </button>
        `)
        .join("")}
    </div>
  `;
}

function renderFields(step) {
  return `
    <div class="field-grid">
      ${step.fields
        .map((field) => {
          if (field.type === "textarea") {
            return `
              <div class="field">
                <label for="${escapeHtml(field.field)}">${escapeHtml(field.label)}</label>
                <textarea id="${escapeHtml(field.field)}" data-field="${escapeHtml(field.field)}" placeholder="${escapeHtml(field.placeholder || "")}">${escapeHtml(answers[field.field])}</textarea>
              </div>
            `;
          }
          return `
            <div class="field">
              <label for="${escapeHtml(field.field)}">${escapeHtml(field.label)}</label>
              <select id="${escapeHtml(field.field)}" data-field="${escapeHtml(field.field)}">
                ${field.options
                  .map((option) => `
                    <option value="${escapeHtml(option)}" ${answers[field.field] === option ? "selected" : ""}>
                      ${option ? escapeHtml(option) : "Choose one"}
                    </option>
                  `)
                  .join("")}
              </select>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderReview() {
  const summary = buildClinicianSummary(answers);
  const rows = [
    ["Main concern", summary.chiefConcern],
    ["Pattern", summary.symptomPattern],
    ["Duration / severity", summary.durationSeverity],
    ["Medicine context", summary.medicines],
    ["Patient constraints", summary.patientConstraints.join("; ")],
    ["Optional note", summary.patientNote]
  ];
  return `
    <dl class="review-grid">
      ${rows
        .map(([label, value]) => `
          <div class="review-row">
            <dt>${escapeHtml(label)}</dt>
            <dd>${escapeHtml(value)}</dd>
          </div>
        `)
        .join("")}
    </dl>
  `;
}

function renderStep() {
  const step = STEPS[currentStep];
  let body = "";
  if (step.type === "options") body = renderOptions(step);
  if (step.type === "fields") body = renderFields(step);
  if (step.type === "review") body = renderReview();

  mount.innerHTML = `
    <section class="step-panel" aria-labelledby="step-title">
      <h3 id="step-title">${escapeHtml(step.title)}</h3>
      <p class="step-copy">${escapeHtml(step.copy)}</p>
      ${body}
    </section>
  `;
}

function renderSummary() {
  const summary = buildClinicianSummary(answers);
  summaryMount.innerHTML = `
    <section class="summary-section">
      <h3>Safety</h3>
      <ul class="notice-list">
        ${summary.safetyNotice.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </section>
    <section class="summary-section">
      <h3>Patient-provided summary</h3>
      <dl class="summary-list">
        <div class="summary-row">
          <dt>Chief concern</dt>
          <dd>${escapeHtml(summary.chiefConcern)}</dd>
        </div>
        <div class="summary-row">
          <dt>Symptom pattern</dt>
          <dd>${escapeHtml(summary.symptomPattern)}</dd>
        </div>
        <div class="summary-row">
          <dt>Duration / severity</dt>
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
  `;
}

function renderProgress() {
  const width = ((currentStep + 1) / STEPS.length) * 100;
  progressBar.style.width = `${width}%`;
  progressText.textContent = `Step ${currentStep + 1} of ${STEPS.length}`;
  backButton.disabled = currentStep === 0;
  nextButton.textContent = currentStep === STEPS.length - 1 ? "Review Again" : "Next";
}

function render() {
  renderStep();
  renderSummary();
  renderProgress();
}

mount.addEventListener("click", (event) => {
  const button = event.target.closest("[data-option-field]");
  if (!button) return;
  setAnswer(button.dataset.optionField, button.dataset.optionValue);
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
});

backButton.addEventListener("click", () => {
  currentStep = Math.max(0, currentStep - 1);
  render();
});

nextButton.addEventListener("click", () => {
  if (currentStep === STEPS.length - 1) {
    currentStep = 0;
  } else {
    currentStep += 1;
  }
  render();
});

loadSample.addEventListener("click", () => {
  answers = Object.assign({}, answers, SAMPLE_CASES[0].answers);
  currentStep = STEPS.length - 1;
  render();
});

resetDemo.addEventListener("click", () => {
  answers = Object.fromEntries(Object.keys(answers).map((key) => [key, ""]));
  currentStep = 0;
  render();
});

printSummary.addEventListener("click", () => {
  window.print();
});

render();

