const {
  activeModules,
  buildClinicianSummary,
  completionStatus,
  missingFieldEntries,
  summaryToText
} = window.UrologyPrevisit;
const { SYNTHETIC_CASES } = window.UrologyCases;

const ARRAY_FIELDS = new Set([
  "systemicSymptoms",
  "fluidCaffeineContext",
  "leakageTriggers",
  "hematuriaCoSymptoms",
  "relevantComorbidities"
]);

const EXCLUSIVE_CHECKBOX_VALUES = new Set(["None of these", "Not sure"]);

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

const FIELD_TO_STEP = {
  filledBy: 0,
  chiefConcern: 1,
  duration: 2,
  botherScore: 2,
  daytimeFrequencyChange: 2,
  nocturiaCount: 2,
  urgency: 2,
  leakage: 2,
  painBurning: 2,
  visibleBlood: 2,
  unableToUrinate: 2,
  currentlyUnableToUrinate: 2,
  systemicSymptoms: 2,
  medicationListStatus: 2,
  daytimeFrequencyCount: 3,
  urgencyFrequency: 3,
  fluidCaffeineContext: 3,
  bladderDiaryFeasible: 3,
  leakageFrequency: 3,
  leakageAmount: 3,
  leakageTriggers: 3,
  containmentProducts: 3,
  weakStream: 3,
  straining: 3,
  intermittency: 3,
  incompleteEmptying: 3,
  hematuriaPattern: 3,
  bloodClots: 3,
  hematuriaCoSymptoms: 3,
  painFrequency: 3,
  infectionEpisodeHistory: 3,
  flankPainScore: 3,
  medicationAssist: 3,
  relevantComorbidities: 3,
  diureticAnticoagulantAwareness: 3,
  language: 4,
  deviceComfort: 4,
  supportPreference: 4,
  notes: 4
};

const YES_NO_UNSURE = ["", "No", "Yes", "Not sure"];
const BOTHER_OPTIONS = ["", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Not sure"];

const STEPS = [
  {
    id: "source",
    label: "Source",
    title: "Who is filling this out?",
    copy: "This tells the clinic whether the answers came from the patient directly or with help.",
    type: "options",
    field: "filledBy",
    options: [
      ["Patient self-filled", "Patient self-filled", "The patient is answering directly."],
      ["Nurse-assisted", "Nurse-assisted", "Clinic staff helps the patient complete the flow."],
      ["Family or helper-assisted", "Family or helper-assisted", "A trusted helper is present."],
      ["Demo observer", "Demo observer", "Synthetic walkthrough for review only."]
    ]
  },
  {
    id: "concern",
    label: "Concern",
    title: "What is the main urinary concern?",
    copy: "Choose the closest starting point. The clinician can revise it later.",
    type: "options",
    field: "chiefConcern",
    options: [
      ["Frequency / nocturia / urgency", "Frequency / nocturia / urgency", "Going often, waking at night, or sudden hard-to-hold urge."],
      ["Leakage", "Leakage", "Accidental urine leakage."],
      ["Difficulty emptying or weak stream", "Difficulty emptying or weak stream", "Weak stream, trouble starting, or feeling urine remains."],
      ["Pain, burning, or possible infection", "Pain, burning, or possible infection", "Discomfort when urinating or infection-related concern."],
      ["Recurrent infection concern", "Recurrent infection concern", "Repeated urinary symptoms, visits, or antibiotics to discuss with the clinician."],
      ["Visible blood or clots", "Visible blood or clots", "Blood or clots noticed in urine."],
      ["Other urinary concern", "Other urinary concern", "Something else to explain."]
    ]
  },
  {
    id: "core",
    label: "Core",
    title: "Core previsit screen",
    copy: "These questions stay patient-friendly and are used only to organize the clinician handoff.",
    type: "fields",
    fields: [
      {
        field: "duration",
        label: "How long has this been happening?",
        type: "select",
        options: ["", "Today", "1 to 7 days", "1 to 4 weeks", "More than 1 month", "Not sure"]
      },
      {
        field: "botherScore",
        label: "How bothersome is it? 0 means none, 10 means worst.",
        type: "select",
        options: BOTHER_OPTIONS
      },
      {
        field: "daytimeFrequencyChange",
        label: "Are daytime bathroom trips noticeably more than before?",
        type: "select",
        options: YES_NO_UNSURE
      },
      {
        field: "nocturiaCount",
        label: "How many times do you usually get up to urinate at night?",
        type: "select",
        options: ["", "0 times", "1 time", "2 times", "3 or more times", "Not sure"]
      },
      {
        field: "urgency",
        label: "Do you suddenly feel it is hard to hold urine?",
        type: "select",
        options: YES_NO_UNSURE
      },
      {
        field: "leakage",
        label: "Have you leaked urine in the past 4 weeks?",
        type: "select",
        options: YES_NO_UNSURE
      },
      {
        field: "painBurning",
        label: "Do you have pain or burning when urinating?",
        type: "select",
        options: YES_NO_UNSURE
      },
      {
        field: "visibleBlood",
        label: "Have you seen blood or clots in urine?",
        type: "select",
        options: YES_NO_UNSURE
      },
      {
        field: "unableToUrinate",
        label: "Have you had trouble urinating or been unable to urinate?",
        type: "select",
        options: YES_NO_UNSURE
      },
      {
        field: "currentlyUnableToUrinate",
        label: "Is being unable to urinate happening now?",
        type: "select",
        options: ["", "No", "Yes", "Not sure"],
        when: (currentAnswers) => currentAnswers.unableToUrinate === "Yes"
      },
      {
        field: "systemicSymptoms",
        label: "Do any of these apply now?",
        type: "checkboxes",
        options: ["Fever", "Chills", "Side or back pain", "None of these", "Not sure"]
      },
      {
        field: "medicationListStatus",
        label: "Can you provide your medication list today?",
        type: "select",
        options: ["", "Can provide list", "Partial list only", "Not sure", "No regular medicines"]
      }
    ]
  },
  {
    id: "modules",
    label: "Modules",
    title: "Conditional follow-up",
    copy: "Only modules suggested by the core answers are shown. Leave uncertain answers visible instead of guessing.",
    type: "modules"
  },
  {
    id: "support",
    label: "Support",
    title: "Support needs and patient context",
    copy: "These answers help staff decide whether self-filled or assisted intake is realistic.",
    type: "fields",
    fields: [
      {
        field: "language",
        label: "Preferred language",
        type: "select",
        options: ["", "Mandarin", "Taiwanese", "Mandarin with Taiwanese preferred", "English", "Other"]
      },
      {
        field: "deviceComfort",
        label: "Phone or screen comfort",
        type: "select",
        options: ["", "Comfortable", "Can use phone with help", "Needs large buttons", "Prefer staff help"]
      },
      {
        field: "supportPreference",
        label: "Support preference",
        type: "select",
        options: ["", "Self-filled", "Nurse-assisted mode", "Family-assisted mode", "Needs review before clinician enters"]
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

const MODULES = [
  {
    id: "storage",
    title: "Frequency / nocturia / urgency module",
    copy: "Clarifies storage-symptom pattern without asking the patient to interpret a diagnosis.",
    fields: [
      {
        field: "daytimeFrequencyCount",
        label: "About how many times do you urinate during the day?",
        type: "select",
        options: ["", "1 to 4 times", "5 to 8 times", "9 to 12 times", "More than 12 times", "Not sure"]
      },
      {
        field: "urgencyFrequency",
        label: "How often do sudden hard-to-hold urges happen?",
        type: "select",
        options: ["", "Rarely", "Some days", "Most days", "Several times a day", "Not sure"]
      },
      {
        field: "fluidCaffeineContext",
        label: "Which context may matter?",
        type: "checkboxes",
        options: ["Caffeinated drinks most days", "Drinks a lot near bedtime", "Night shift or poor sleep", "None of these", "Not sure"]
      },
      {
        field: "bladderDiaryFeasible",
        label: "Could you complete a simple bladder diary if staff explains it?",
        type: "select",
        options: ["", "Yes", "Yes, with written instructions", "Only with staff or family help", "No", "Not sure"]
      }
    ]
  },
  {
    id: "leakage",
    title: "Leakage module",
    copy: "Captures frequency, amount, triggers, and containment needs in patient language.",
    fields: [
      {
        field: "leakageFrequency",
        label: "How often does leakage happen?",
        type: "select",
        options: ["", "Less than once a week", "Weekly", "Daily", "Several times a day", "Not sure"]
      },
      {
        field: "leakageAmount",
        label: "How much urine usually leaks?",
        type: "select",
        options: ["", "A few drops", "Small amount", "Moderate amount", "Large amount", "Not sure"]
      },
      {
        field: "leakageTriggers",
        label: "When does leakage tend to happen?",
        type: "checkboxes",
        options: ["Before reaching toilet", "Coughing, laughing, or exercise", "During sleep", "Without warning", "Not sure"]
      },
      {
        field: "containmentProducts",
        label: "Do you use pads, diapers, or other products?",
        type: "select",
        options: ["", "No products used", "Pads or liners", "Adult diapers", "Other product", "Prefer not to answer", "Not sure"]
      }
    ]
  },
  {
    id: "voiding",
    title: "Voiding / emptying module",
    copy: "Uses plain symptom words for weak stream, straining, and incomplete emptying.",
    fields: [
      {
        field: "weakStream",
        label: "Is the urine stream weak?",
        type: "select",
        options: YES_NO_UNSURE
      },
      {
        field: "straining",
        label: "Do you need to push or strain to urinate?",
        type: "select",
        options: YES_NO_UNSURE
      },
      {
        field: "intermittency",
        label: "Does the stream stop and start?",
        type: "select",
        options: YES_NO_UNSURE
      },
      {
        field: "incompleteEmptying",
        label: "Do you feel urine remains after finishing?",
        type: "select",
        options: YES_NO_UNSURE
      }
    ]
  },
  {
    id: "hematuria",
    title: "Visible blood / clots module",
    copy: "Records what the patient saw without assigning cause or risk level.",
    fields: [
      {
        field: "hematuriaPattern",
        label: "How often have you seen blood or clots?",
        type: "select",
        options: ["", "One time", "More than once", "Every time recently", "Not sure"]
      },
      {
        field: "bloodClots",
        label: "Did you see clots?",
        type: "select",
        options: YES_NO_UNSURE
      },
      {
        field: "hematuriaCoSymptoms",
        label: "What happened around the same time?",
        type: "checkboxes",
        options: ["Pain or burning", "Fever or chills", "Side or back pain", "None of these", "Not sure"]
      }
    ]
  },
  {
    id: "pain",
    title: "Pain / infection-related module",
    copy: "Supports clinician review of pain and recent episode history while avoiding diagnosis.",
    fields: [
      {
        field: "painFrequency",
        label: "When does pain or burning happen?",
        type: "select",
        options: ["", "Only while urinating", "After urinating", "Most of the day", "Comes and goes", "Not sure"]
      },
      {
        field: "infectionEpisodeHistory",
        label: "In the past 12 months, have you had urinary infection episodes or antibiotics?",
        type: "select",
        options: ["", "No", "Yes, once", "Yes, more than once", "Not sure"]
      },
      {
        field: "flankPainScore",
        label: "If side or back pain is present, how strong is it?",
        type: "select",
        options: ["", "0", "1 to 3", "4 to 6", "7 to 10", "Not sure"],
        when: (currentAnswers) => Array.isArray(currentAnswers.systemicSymptoms) && currentAnswers.systemicSymptoms.includes("Side or back pain")
      }
    ]
  },
  {
    id: "medication",
    title: "Medication / context module",
    copy: "Shows what staff may need to review, without asking the patient to classify medicines medically.",
    fields: [
      {
        field: "medicationAssist",
        label: "Would staff help be useful for medication review?",
        type: "select",
        options: ["", "Yes", "No", "Not sure"]
      },
      {
        field: "relevantComorbidities",
        label: "Have you been told you have any of these?",
        type: "checkboxes",
        options: ["Diabetes", "Kidney disease", "Neurologic disease", "Spinal cord problem", "None of these", "Not sure"]
      },
      {
        field: "diureticAnticoagulantAwareness",
        label: "Do you know if you take a water pill or blood thinner?",
        type: "select",
        options: ["", "Yes", "No", "Not sure"]
      }
    ]
  }
];

const SCENARIOS = SYNTHETIC_CASES;

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
  return Object.fromEntries(ANSWER_FIELDS.map((field) => [field, ARRAY_FIELDS.has(field) ? [] : ""]));
}

function normalizeAnswers(source) {
  const base = emptyAnswers();
  Object.entries(source || {}).forEach(([field, value]) => {
    base[field] = ARRAY_FIELDS.has(field) ? (Array.isArray(value) ? value.slice() : []) : value;
  });
  return base;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function listAnswer(field) {
  return Array.isArray(answers[field]) ? answers[field] : [];
}

function visibleFields(fields) {
  return fields.filter((field) => !field.when || field.when(answers));
}

function missingEntries() {
  return missingFieldEntries(answers);
}

function setAnswer(field, value) {
  answers = Object.assign({}, answers, { [field]: ARRAY_FIELDS.has(field) ? value.slice() : value });
  render();
}

function toggleCheckbox(field, value, checked) {
  let next = listAnswer(field).filter((item) => item !== value);
  if (checked) {
    if (EXCLUSIVE_CHECKBOX_VALUES.has(value)) {
      next = [value];
    } else {
      next = next.filter((item) => !EXCLUSIVE_CHECKBOX_VALUES.has(item));
      next.push(value);
    }
  }
  setAnswer(field, next);
}

function loadScenario(scenarioId) {
  const scenario = SCENARIOS.find((item) => item.id === scenarioId) || SCENARIOS[0];
  activeScenario = scenario.id;
  answers = normalizeAnswers(scenario.answers);
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
      <strong>${escapeHtml(scenario.shortLabel || scenario.label)}</strong>
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

function renderField(field) {
  if (field.type === "textarea") {
    return `
      <div class="field wide-field">
        <label for="${escapeHtml(field.field)}">${escapeHtml(field.label)}</label>
        <textarea id="${escapeHtml(field.field)}" data-field="${escapeHtml(field.field)}" placeholder="${escapeHtml(field.placeholder || "")}">${escapeHtml(answers[field.field])}</textarea>
      </div>
    `;
  }

  if (field.type === "checkboxes") {
    const current = listAnswer(field.field);
    return `
      <fieldset class="field wide-field checkbox-field">
        <legend>${escapeHtml(field.label)}</legend>
        <div class="checkbox-grid">
          ${field.options.map((option) => `
            <label class="checkbox-option">
              <input
                type="checkbox"
                data-checkbox-field="${escapeHtml(field.field)}"
                data-checkbox-value="${escapeHtml(option)}"
                ${current.includes(option) ? "checked" : ""}>
              <span>${escapeHtml(option)}</span>
            </label>
          `).join("")}
        </div>
      </fieldset>
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
}

function renderFields(step) {
  return `
    <div class="field-grid">
      ${visibleFields(step.fields).map(renderField).join("")}
    </div>
  `;
}

function renderModules() {
  const modules = activeModules(answers);
  const activeDefinitions = MODULES.filter((module) => modules[module.id]);

  if (!activeDefinitions.length) {
    return `
      <div class="empty-state">
        <h4>No conditional module is active yet.</h4>
        <p>Complete the core screen, or leave this section empty if the concern does not need module follow-up.</p>
      </div>
    `;
  }

  return `
    <div class="module-stack">
      ${activeDefinitions.map((module) => `
        <section class="module-card" aria-label="${escapeHtml(module.title)}">
          <div class="module-head">
            <h3>${escapeHtml(module.title)}</h3>
            <p>${escapeHtml(module.copy)}</p>
          </div>
          <div class="field-grid">
            ${visibleFields(module.fields).map(renderField).join("")}
          </div>
        </section>
      `).join("")}
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
    ["Completion source", summary.intakeMode],
    ["Chief concern", summary.chiefConcern],
    ["Active modules", summary.activeModules.join(", ")],
    ["Duration / bother", summary.durationBother],
    ["Patient-reported pattern", summary.symptomPattern],
    ["Medication/context", summary.medicines],
    ["Nurse cues", summary.nurseCues.join("; ")],
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
  if (step.type === "modules") body = renderModules(step);
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
          <dt>Completion source</dt>
          <dd>${escapeHtml(summary.intakeMode)}</dd>
        </div>
        <div class="summary-row">
          <dt>Chief concern</dt>
          <dd>${escapeHtml(summary.chiefConcern)}</dd>
        </div>
        <div class="summary-row">
          <dt>Active modules</dt>
          <dd>${escapeHtml(summary.activeModules.join(", "))}</dd>
        </div>
        <div class="summary-row">
          <dt>Duration / bother</dt>
          <dd>${escapeHtml(summary.durationBother)}</dd>
        </div>
        <div class="summary-row">
          <dt>Patient-reported pattern</dt>
          <dd>${escapeHtml(summary.symptomPattern)}</dd>
        </div>
      </dl>
    </section>
    <section class="summary-section">
      <h3>Priority review statements</h3>
      <ul class="flag-list">
        ${summary.clinicianReviewFlags.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </section>
    <section class="summary-section">
      <h3>Nurse workflow cues</h3>
      <ul class="support-list">
        ${summary.nurseCues.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
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
  const percentage = status.total ? Math.round((status.completed / status.total) * 100) : 0;
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
  const checkbox = event.target.closest("[data-checkbox-field]");
  if (checkbox) {
    toggleCheckbox(checkbox.dataset.checkboxField, checkbox.dataset.checkboxValue, checkbox.checked);
    return;
  }

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
