const {
  buildClinicianSummary,
  buildNurseChecklist,
  missingFieldEntries,
  summaryToText
} = window.UrologyPrevisit;
const { SYNTHETIC_CASES, findCase } = window.UrologyCases;

const SOURCE_LABELS = {
  declared_on_entry: "填答開始時標記",
  patient_self: "本人回答",
  patient_with_family_operator: "本人回答，家屬協助操作",
  family_observation: "家屬/協助者觀察",
  nurse_supplement: "現場補問",
  unknown: "未標記來源"
};

const FIELD_LABELS = {
  filledBy: "Completion source",
  chiefConcern: "Chief concern",
  duration: "Duration",
  botherScore: "Bother score",
  daytimeFrequencyChange: "Daytime frequency change",
  nocturiaCount: "Nocturia count",
  urgency: "Urgency",
  leakage: "Leakage",
  painBurning: "Pain or burning",
  visibleBlood: "Visible blood",
  unableToUrinate: "Trouble urinating",
  systemicSymptoms: "Fever / chills / side-back pain",
  medicationListStatus: "Medication list readiness",
  daytimeFrequencyCount: "Daytime count",
  urgencyFrequency: "Urgency frequency",
  fluidCaffeineContext: "Fluid / caffeine context",
  bladderDiaryFeasible: "Bladder diary feasibility",
  leakageFrequency: "Leakage frequency",
  leakageAmount: "Leakage amount",
  leakageTriggers: "Leakage trigger",
  containmentProducts: "Containment product",
  weakStream: "Weak stream",
  straining: "Straining",
  intermittency: "Intermittency",
  incompleteEmptying: "Incomplete emptying",
  hematuriaPattern: "Visible blood pattern",
  bloodClots: "Blood clots",
  painFrequency: "Pain pattern",
  infectionEpisodeHistory: "Recent similar episode",
  flankPainScore: "Side/back pain score",
  medicationAssist: "Medication support",
  relevantComorbidities: "Patient-reported context",
  diureticAnticoagulantAwareness: "Water pill / blood thinner awareness",
  language: "Language preference",
  deviceComfort: "Device comfort",
  supportPreference: "Support preference",
  notes: "Patient note"
};

const CLINIC_FLOW_REQUIREMENTS = [
  "陽明小幫手 v1 is framed as an already-registered waiting-room QR workflow.",
  "Initial-visit waiting-room flow does not ask ID number or birthday.",
  "Queue/name fields are synthetic placeholders only; no real queue handling in v1.",
  "Patient handoff goes to clinic nurse / NHI-card workflow for physician confirmation.",
  "Medication answers that name only a category should trigger exact-name repair."
];

const VISIT_BRANCH_RULES = [
  {
    title: "初診 intake",
    text: "Collect chronic disease history, operation history, medication history, allergies, and symptom-specific forms."
  },
  {
    title: "回診 intake",
    text: "Ask whether prior medication helped, whether side effects occurred, and what follow-up tests the patient wants to discuss."
  },
  {
    title: "Future pilot only",
    text: "Satisfaction survey, follow-up messages, analytics, and disease-based reminders require privacy/security and hospital approval."
  }
];

const EXAM_PREP_RULES = [
  {
    complaint: "血尿或健檢發現潛血",
    reminders: ["blood draw", "urinalysis", "urine culture", "kidney ultrasound", "bladder ultrasound", "X-ray"]
  },
  {
    complaint: "突發腰痛",
    reminders: ["urinalysis", "urine culture", "kidney ultrasound", "X-ray"]
  },
  {
    complaint: "小便困難或尿不出來",
    reminders: ["blood draw", "bladder ultrasound", "prostate ultrasound for men", "uroflow", "IPSS for men"]
  },
  {
    complaint: "頻尿或夜尿",
    reminders: ["urinalysis", "urine culture", "bladder ultrasound", "prostate ultrasound for men", "uroflow", "IPSS for men"]
  },
  {
    complaint: "尿失禁",
    reminders: ["urinalysis", "urine culture", "pad-test preparation discussion"]
  },
  {
    complaint: "剛診斷為攝護腺癌",
    reminders: ["blood draw", "bladder ultrasound", "prostate ultrasound", "uroflow", "IPSS", "bring pathology/report/CT/MRI disks if applicable"]
  },
  {
    complaint: "抽血發現 PSA 升高",
    reminders: ["blood draw", "bladder/prostate ultrasound", "uroflow", "IPSS", "bring prior PSA data"]
  },
  {
    complaint: "陰囊或睪丸腫痛",
    reminders: ["blood draw", "urinalysis", "urine culture", "fever question", "scrotal ultrasound discussion"]
  },
  {
    complaint: "生殖器紅腫或搔癢",
    reminders: ["blood draw", "urinalysis", "urine culture", "fever question"]
  },
  {
    complaint: "性功能問題",
    reminders: ["blood draw", "IIEF", "fasting instruction only if confirmed by clinic"]
  },
  {
    complaint: "健檢發現腎臟水泡或腫瘤",
    reminders: ["blood draw", "urinalysis", "kidney ultrasound", "bladder ultrasound"]
  },
  {
    complaint: "小便有泡泡",
    reminders: ["urinalysis", "urine culture", "kidney ultrasound"]
  }
];

const state = {
  caseId: SYNTHETIC_CASES[0].id,
  activeTab: "intake"
};

const caseSelect = document.querySelector("#caseSelect");
const caseMeta = document.querySelector("#caseMeta");
const completionLabel = document.querySelector("#completionLabel");
const completionMeta = document.querySelector("#completionMeta");
const copyCurrent = document.querySelector("#copyCurrent");
const printPage = document.querySelector("#printPage");
const toast = document.querySelector("#toast");
const tabButtons = Array.from(document.querySelectorAll("[data-tab]"));
const panels = {
  intake: document.querySelector("#panel-intake"),
  nurse: document.querySelector("#panel-nurse"),
  physician: document.querySelector("#panel-physician"),
  exam: document.querySelector("#panel-exam"),
  export: document.querySelector("#panel-export"),
  research: document.querySelector("#panel-research")
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
  if (Array.isArray(value)) return value.length ? value.join(", ") : "Not provided";
  if (value === undefined || value === null || value === "") return "Not provided";
  return String(value);
}

function sourceLabel(source) {
  return SOURCE_LABELS[source] || SOURCE_LABELS.unknown;
}

function currentCase() {
  return findCase(state.caseId);
}

function currentBundle() {
  const sampleCase = currentCase();
  const answers = sampleCase.answers;
  return {
    sampleCase,
    answers,
    summary: buildClinicianSummary(answers),
    nurse: buildNurseChecklist(answers),
    missing: missingFieldEntries(answers)
  };
}

function sourceLookup(summary) {
  return summary.fieldSources.reduce((acc, item) => {
    acc[item.field] = sourceLabel(item.source);
    return acc;
  }, {});
}

function rowsToHtml(rows) {
  return rows.map(([label, value]) => `
    <div class="metric">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(display(value))}</strong>
    </div>
  `).join("");
}

function listToHtml(items, className = "plain-list", empty = "No items.") {
  const visibleItems = (items || []).filter(Boolean);
  if (!visibleItems.length) return `<p>${escapeHtml(empty)}</p>`;
  return `
    <ul class="${className}">
      ${visibleItems.map((item) => `<li>${escapeHtml(display(item))}</li>`).join("")}
    </ul>
  `;
}

function ruleItemsToText(rule) {
  return `${rule.complaint}: confirm whether ${rule.reminders.join(", ")} are appropriate.`;
}

function branchRulesToHtml() {
  return `
    <ol class="gate-list">
      ${VISIT_BRANCH_RULES.map((item) => `
        <li>
          <strong>${escapeHtml(item.title)}</strong>
          <span>${escapeHtml(item.text)}</span>
        </li>
      `).join("")}
    </ol>
  `;
}

function examPrepRuleMatrixToHtml(rules) {
  return `
    <div class="rule-table" role="table" aria-label="Source-derived exam-prep matrix">
      ${rules.map((rule) => `
        <div class="rule-row" role="row">
          <strong role="cell">${escapeHtml(rule.complaint)}</strong>
          <span role="cell">${escapeHtml(rule.reminders.join(", "))}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function fieldRows(answers, summary) {
  const sources = sourceLookup(summary);
  return Object.entries(answers)
    .filter(([field]) => field !== "sourceByField")
    .filter(([, value]) => display(value) !== "Not provided")
    .map(([field, value]) => `
      <div class="field-row">
        <span>${escapeHtml(FIELD_LABELS[field] || field)}</span>
        <strong>${escapeHtml(display(value))}</strong>
        <em class="source-chip">${escapeHtml(sources[field] || "未標記來源")}</em>
      </div>
    `)
    .join("");
}

function promptList(prompts) {
  if (!prompts.length) return "<p>No required repair prompt for this synthetic case.</p>";
  return `
    <ol class="prompt-list">
      ${prompts.map((item) => `
        <li>
          <strong>${escapeHtml(item.ask)}</strong>
          <span>${escapeHtml(item.why)}</span>
        </li>
      `).join("")}
    </ol>
  `;
}

function buildExamPrepReminders(summary) {
  const modules = new Set(summary.activeModules);
  const reminders = [];

  if (modules.has("storage")) {
    reminders.push({
      title: "Storage symptoms",
      text: "Confirm whether a symptom score form, bladder diary instruction, or fluid/caffeine discussion is appropriate for this visit."
    });
  }
  if (modules.has("voiding")) {
    reminders.push({
      title: "Voiding / emptying symptoms",
      text: "Confirm whether uroflow or post-void residual discussion is appropriate after physician assessment."
    });
  }
  if (modules.has("leakage")) {
    reminders.push({
      title: "Leakage context",
      text: "Confirm whether leakage amount, trigger context, and containment needs are complete before physician review."
    });
  }
  if (modules.has("hematuria")) {
    reminders.push({
      title: "Visible blood / clots",
      text: "Confirm whether urine testing or the local visible-blood pathway should be discussed under clinic SOP."
    });
  }
  if (modules.has("pain")) {
    reminders.push({
      title: "Pain or repeated infection context",
      text: "Confirm whether urine analysis, culture discussion, or recent-antibiotic history is appropriate under clinic SOP."
    });
  }
  if (modules.has("medication")) {
    reminders.push({
      title: "Medication readiness",
      text: "Confirm medication list, water-pill awareness, blood-thinner awareness, and whether staff support is needed."
    });
  }

  if (!reminders.length) {
    reminders.push({
      title: "Core review",
      text: "Confirm chief concern, duration, bother score, medication readiness, and whether any missing field should be repaired before the visit."
    });
  }

  return reminders;
}

function matchingExamPrepRules(summary) {
  const modules = new Set(summary.activeModules);
  const rules = [];
  const add = (complaint) => {
    const rule = EXAM_PREP_RULES.find((item) => item.complaint === complaint);
    if (rule && !rules.includes(rule)) rules.push(rule);
  };

  if (modules.has("hematuria")) add("血尿或健檢發現潛血");
  if (modules.has("pain")) add("突發腰痛");
  if (modules.has("voiding")) add("小便困難或尿不出來");
  if (modules.has("storage")) add("頻尿或夜尿");
  if (modules.has("leakage")) add("尿失禁");

  if (!rules.length) add("頻尿或夜尿");
  return rules;
}

function examRemindersToHtml(reminders) {
  return `
    <ol class="reminder-list">
      ${reminders.map((item) => `
        <li>
          <strong>${escapeHtml(item.title)}</strong>
          <span>${escapeHtml(item.text)}</span>
        </li>
      `).join("")}
    </ol>
  `;
}

function buildMockPayload(bundle) {
  const reminders = buildExamPrepReminders(bundle.summary);
  const matchedRules = matchingExamPrepRules(bundle.summary);
  return {
    schema: "urology_previsit_v1_mock_export",
    generatedAt: new Date().toISOString(),
    syntheticDataOnly: true,
    clinicalUse: false,
    physicianReviewRequired: true,
    regulatoryStatus: "not_determined",
    integrationMode: "mock_export_only",
    liveHisWriteback: false,
    clinicMode: {
      source: "2026-01-05 lianyi ai helper qa training rules",
      preferredV1Flow: "Yangming waiting-room QR, already registered",
      realIdentifiersCollected: false,
      initialVisitNoIdOrBirthday: true,
      realQueueHandling: false
    },
    caseId: bundle.sampleCase.id,
    caseLabel: bundle.sampleCase.label,
    completion: bundle.summary.completionStatus,
    physicianSummary: {
      chiefConcern: bundle.summary.chiefConcern,
      durationBother: bundle.summary.durationBother,
      activeModules: bundle.summary.activeModules,
      patientReportedPattern: bundle.summary.symptomPattern,
      missingInformation: bundle.summary.missingInformation,
      priorityReviewStatements: bundle.summary.clinicianReviewFlags,
      medicationContext: bundle.summary.medicines,
      sourceAttributionSummary: bundle.summary.sourceAttributionSummary
    },
    examPrepReminders: reminders.map((item) => ({
      title: item.title,
      reminder: item.text,
      physicianConfirmedOnly: true,
      orderPlaced: false
    })),
    sourceDerivedExamPrepRows: matchedRules.map((rule) => ({
      complaint: rule.complaint,
      confirmationTopics: rule.reminders,
      physicianOrNurseConfirmationRequired: true,
      orderPlaced: false
    })),
    nextGates: ["funding", "ip", "his", "privacy_security", "regulatory", "research_protocol"]
  };
}

function exportText(bundle) {
  const reminders = buildExamPrepReminders(bundle.summary);
  const matchedRules = matchingExamPrepRules(bundle.summary);
  return [
    "Urology AI Previsit v1 MVP product preview",
    "",
    "Boundary:",
    "- Synthetic data only.",
    "- Not for clinical use.",
    "- Physician review required.",
    "- Regulatory status not determined.",
    "- No live HIS writeback.",
    "- Yangming waiting-room mode is synthetic only; no real ID, birthday, queue, registration, or messaging.",
    "",
    summaryToText(bundle.summary),
    "",
    "Doctor/hospital workflow guardrails:",
    ...CLINIC_FLOW_REQUIREMENTS.map((item) => `- ${item}`),
    "",
    "Physician-confirmed exam-prep reminders:",
    ...reminders.map((item) => `- ${item.title}: ${item.text}`),
    "",
    "Source-derived QA matrix rows for this case:",
    ...matchedRules.map((rule) => `- ${ruleItemsToText(rule)}`),
    "",
    "Reminder boundary: no exam order is placed by this MVP."
  ].join("\n");
}

function renderIntake(bundle) {
  panels.intake.innerHTML = `
    <div class="panel-grid">
      <section class="section-card">
        <h3>Patient / family intake</h3>
        <div class="metric-grid">
          ${rowsToHtml([
            ["Case", bundle.sampleCase.shortLabel],
            ["Completion source", bundle.summary.intakeMode],
            ["Chief concern", bundle.summary.chiefConcern],
            ["Duration / bother", bundle.summary.durationBother]
          ])}
        </div>
      </section>
      <section class="section-card">
        <h3>Source attribution</h3>
        ${listToHtml(bundle.summary.sourceAttributionSummary, "compact-list")}
      </section>
      <section class="section-card full">
        <h3>陽明小幫手 waiting-room rules</h3>
        ${listToHtml(CLINIC_FLOW_REQUIREMENTS, "plain-list")}
      </section>
      <section class="section-card full">
        <h3>Initial / return visit branch</h3>
        ${branchRulesToHtml()}
      </section>
      <section class="section-card full">
        <h3>Captured synthetic answers</h3>
        <div class="field-grid">
          ${fieldRows(bundle.answers, bundle.summary)}
        </div>
      </section>
      <section class="section-card full">
        <h3>Missing or uncertain fields</h3>
        ${listToHtml(bundle.summary.missingInformation, "missing-list")}
      </section>
    </div>
  `;
}

function renderNurse(bundle) {
  panels.nurse.innerHTML = `
    <div class="panel-grid">
      <section class="section-card">
        <h3>Nurse readiness</h3>
        <div class="metric-grid">
          ${rowsToHtml([
            ["Completion", bundle.nurse.completionStatus.label],
            ["Missing count", bundle.nurse.completionStatus.missingCount],
            ["Active modules", bundle.nurse.activeModules.join(", ") || "core only"],
            ["Tone", bundle.nurse.completionStatus.tone]
          ])}
        </div>
      </section>
      <section class="section-card">
        <h3>Source notes</h3>
        ${listToHtml(bundle.nurse.sourceNotes, "compact-list")}
      </section>
      <section class="section-card full">
        <h3>Repair prompts</h3>
        ${promptList(bundle.nurse.supplementalQuestions)}
      </section>
      <section class="section-card full">
        <h3>Workflow cues</h3>
        ${listToHtml(bundle.nurse.workflowCues, "plain-list")}
      </section>
    </div>
  `;
}

function renderPhysician(bundle) {
  panels.physician.innerHTML = `
    <div class="panel-grid">
      <section class="section-card">
        <h3>30-60 second physician scan</h3>
        <div class="metric-grid">
          ${rowsToHtml([
            ["Chief concern", bundle.summary.chiefConcern],
            ["Duration / bother", bundle.summary.durationBother],
            ["Active domains", bundle.summary.activeModules.join(", ")],
            ["Medication/context", bundle.summary.medicines]
          ])}
        </div>
      </section>
      <section class="section-card">
        <h3>Priority review statements</h3>
        ${listToHtml(bundle.summary.clinicianReviewFlags, "flag-list")}
      </section>
      <section class="section-card full">
        <h3>Patient-reported pattern</h3>
        <p>${escapeHtml(bundle.summary.symptomPattern)}</p>
      </section>
      <section class="section-card full">
        <h3>Missing information and source sensitivity</h3>
        ${listToHtml(bundle.summary.missingInformation, "missing-list")}
        ${listToHtml(bundle.summary.sourceNotes, "compact-list")}
      </section>
    </div>
  `;
}

function renderExam(bundle) {
  const reminders = buildExamPrepReminders(bundle.summary);
  const matchedRules = matchingExamPrepRules(bundle.summary);
  panels.exam.innerHTML = `
    <div class="panel-grid">
      <section class="section-card full">
        <h3>Physician-confirmed exam-prep reminders</h3>
        <p>
          These reminders prepare the conversation. They do not diagnose, triage, recommend treatment, place an order, or bypass local SOP.
        </p>
        ${examRemindersToHtml(reminders)}
      </section>
      <section class="section-card full">
        <h3>Source-derived QA rows for this case</h3>
        <p>
          These rows come from 許醫師's QA file. Use them as topics to confirm, not as a protocol or autonomous action.
        </p>
        ${examPrepRuleMatrixToHtml(matchedRules)}
      </section>
      <section class="section-card full">
        <h3>12-complaint reference matrix</h3>
        <p>
          Product research reference for 吳老師 / 許醫師 review. Every item still requires local SOP and physician/nurse confirmation.
        </p>
        ${examPrepRuleMatrixToHtml(EXAM_PREP_RULES)}
      </section>
      <section class="section-card">
        <h3>Allowed wording</h3>
        ${listToHtml([
          "Confirm whether the item is appropriate.",
          "Consider discussion under local SOP.",
          "Physician review remains required."
        ], "plain-list")}
      </section>
      <section class="section-card">
        <h3>Not allowed in v1</h3>
        ${listToHtml([
          "Autonomous exam ordering.",
          "Diagnosis or risk level.",
          "Treatment advice.",
          "Live HIS writeback."
        ], "plain-list")}
      </section>
    </div>
  `;
}

function renderExport(bundle) {
  const text = exportText(bundle);
  const payload = JSON.stringify(buildMockPayload(bundle), null, 2);
  panels.export.innerHTML = `
    <div class="export-grid">
      <section class="export-box">
        <h3>Copyable physician summary</h3>
        <textarea id="summaryExport" readonly>${escapeHtml(text)}</textarea>
      </section>
      <section class="export-box">
        <h3>Mock API payload</h3>
        <textarea id="jsonExport" readonly>${escapeHtml(payload)}</textarea>
      </section>
    </div>
  `;
}

function renderResearch() {
  panels.research.innerHTML = `
    <div class="panel-grid">
      <section class="section-card">
        <h3>Clinic value metrics</h3>
        ${listToHtml([
          "Minutes saved per first-visit patient.",
          "Physician summary usefulness rating.",
          "Missing fields before and after nurse repair.",
          "Repeated questions avoided.",
          "Staff burden rating.",
          "Workflow slot: home, registration, waiting room, or nurse station."
        ], "plain-list")}
      </section>
      <section class="section-card">
        <h3>Hospital workflow checks</h3>
        ${listToHtml([
          "Confirm waiting-room QR owner and clinic-specific routing.",
          "Confirm no ID number or birthday in the waiting-room initial-visit flow.",
          "Confirm NHI-card handoff wording with nurse lead.",
          "Confirm whether satisfaction survey can be measured in a synthetic or approved pilot path."
        ], "plain-list")}
      </section>
      <section class="section-card">
        <h3>Decision gates</h3>
        <ol class="gate-list">
          <li><strong>Funding</strong><span>Move cloud/API cost from personal subsidy to hospital innovation budget or a company plan.</span></li>
          <li><strong>IP</strong><span>Map 許醫師 patent status, team/company ownership, vendor terms, and 聯醫 rights.</span></li>
          <li><strong>HIS</strong><span>Use export/mock API first; real writeback waits for information-office and legal review.</span></li>
          <li><strong>Privacy</strong><span>Define consent, IRB, de-identification, retention, audit, and model-update policy.</span></li>
          <li><strong>Regulatory</strong><span>Review TFDA/FDA positioning before any external non-device or clinical-use claim.</span></li>
        </ol>
      </section>
      <section class="section-card full">
        <h3>Follow-up evidence to request</h3>
        ${listToHtml([
          "Top three priority flows from the 12 QA complaint categories.",
          "Persona decision: 小許醫師 / Annie專科護理師 or neutral physician/nurse labels.",
          "Wording approval for source-derived exam-prep reminders.",
          "10-seat and 100-seat vendor quotes.",
          "Patent status and implementation-space constraints."
        ], "plain-list")}
      </section>
    </div>
  `;
}

function render() {
  const bundle = currentBundle();
  caseMeta.textContent = bundle.sampleCase.meta;
  completionLabel.textContent = bundle.summary.completionStatus.label;
  completionMeta.textContent = `${bundle.summary.completionStatus.completed}/${bundle.summary.completionStatus.total} required fields captured.`;

  renderIntake(bundle);
  renderNurse(bundle);
  renderPhysician(bundle);
  renderExam(bundle);
  renderExport(bundle);
  renderResearch(bundle);
}

function setTab(tab) {
  state.activeTab = tab;
  for (const button of tabButtons) {
    const active = button.dataset.tab === tab;
    button.setAttribute("aria-selected", String(active));
  }
  for (const [panelName, panel] of Object.entries(panels)) {
    panel.hidden = panelName !== tab;
  }
}

function currentCopyText() {
  const bundle = currentBundle();
  if (state.activeTab === "export") return exportText(bundle);
  if (state.activeTab === "exam") {
    const reminders = buildExamPrepReminders(bundle.summary)
      .map((item) => `${item.title}: ${item.text}`)
      .join("\n");
    const rows = matchingExamPrepRules(bundle.summary)
      .map((rule) => ruleItemsToText(rule))
      .join("\n");
    return `${reminders}\n\nSource-derived QA rows:\n${rows}`;
  }
  if (state.activeTab === "research") {
    return "Urology AI Previsit v1 research gate: funding, IP, HIS, privacy/security, regulatory, and research protocol review before clinical use.";
  }
  return summaryToText(bundle.summary);
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

caseSelect.innerHTML = SYNTHETIC_CASES.map((sampleCase) => `
  <option value="${escapeHtml(sampleCase.id)}">${escapeHtml(sampleCase.shortLabel)}</option>
`).join("");

caseSelect.addEventListener("change", () => {
  state.caseId = caseSelect.value;
  render();
});

for (const button of tabButtons) {
  button.addEventListener("click", () => setTab(button.dataset.tab));
}

copyCurrent.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(currentCopyText());
    showToast("Copied v1 content.");
  } catch (error) {
    showToast("Copy failed; select text manually.");
  }
});

printPage.addEventListener("click", () => {
  window.print();
});

render();
setTab(state.activeTab);
