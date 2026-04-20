(function attachSummary(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.UrologyPrevisit = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function summaryFactory() {
  const REQUIRED_FIELDS = [
    ["entryMode", "who is filling this out"],
    ["symptomCategory", "main concern"],
    ["duration", "duration"],
    ["severity", "severity or bother"],
    ["frequencyDay", "daytime bathroom trips"],
    ["nocturia", "nighttime bathroom trips"],
    ["leak", "leakage"],
    ["painBurning", "pain or burning"],
    ["blood", "blood in urine"],
    ["fever", "fever or chills"],
    ["unableToUrinate", "ability to urinate"],
    ["medications", "current medicines or relevant medicine uncertainty"],
    ["language", "preferred language"],
    ["phoneComfort", "phone or accessibility needs"],
    ["supportNeeds", "support need"]
  ];

  const SAFETY_NOTICE = [
    "This demo does not diagnose or recommend treatment.",
    "A clinician must review all information.",
    "Use synthetic data only."
  ];

  const NEUTRAL_EMPTY_FLAG = "No red-flag statements captured in this synthetic demo.";

  function answer(value) {
    if (typeof value !== "string") return "";
    return value.trim();
  }

  function hasValue(value) {
    return Boolean(answer(value));
  }

  function missingFields(answers) {
    return REQUIRED_FIELDS
      .filter(([field]) => !hasValue(answers[field]))
      .map(([, label]) => label);
  }

  function clinicianFlags(answers) {
    const flags = [];
    if (answer(answers.unableToUrinate).toLowerCase() === "yes") {
      flags.push("Reports being unable to urinate.");
    }
    if (answer(answers.blood).toLowerCase() === "yes") {
      flags.push("Reports blood in urine.");
    }
    if (answer(answers.fever).toLowerCase() === "yes") {
      flags.push("Reports fever or chills.");
    }
    if (answer(answers.painBurning).toLowerCase() === "yes") {
      flags.push("Reports pain or burning with urination.");
    }
    return flags;
  }

  function symptomPattern(answers) {
    const parts = [];
    if (hasValue(answers.frequencyDay)) parts.push(`${answers.frequencyDay} during the day`);
    if (hasValue(answers.nocturia)) parts.push(`${answers.nocturia} at night`);
    if (hasValue(answers.leak)) parts.push(`leakage: ${answers.leak}`);
    return parts.length ? parts.join("; ") : "Not enough information yet.";
  }

  function durationSeverity(answers) {
    return [
      answer(answers.duration) || "Duration not provided",
      answer(answers.severity) || "Bother level not provided"
    ].join(" / ");
  }

  function patientConstraints(answers) {
    return [
      answer(answers.language) || "Language preference not provided",
      answer(answers.phoneComfort) || "Phone/accessibility need not provided",
      answer(answers.supportNeeds) || "Support need not provided"
    ];
  }

  function completionStatus(answers) {
    const missing = missingFields(answers);
    const completed = REQUIRED_FIELDS.length - missing.length;
    return {
      completed,
      total: REQUIRED_FIELDS.length,
      missingCount: missing.length,
      label: missing.length
        ? `${missing.length} MVP fields still missing`
        : "MVP fields complete for clinician review",
      tone: missing.length ? "needs-review" : "ready"
    };
  }

  function buildClinicianSummary(answers) {
    const missing = missingFields(answers);
    const flags = clinicianFlags(answers);
    const status = completionStatus(answers);
    return {
      safetyNotice: SAFETY_NOTICE,
      completionStatus: status,
      intakeMode: answer(answers.entryMode) || "Not provided",
      chiefConcern: answer(answers.symptomCategory) || "Not provided",
      symptomPattern: symptomPattern(answers),
      durationSeverity: durationSeverity(answers),
      clinicianReviewFlags: flags.length ? flags : [NEUTRAL_EMPTY_FLAG],
      missingInformation: missing.length ? missing : ["No required MVP fields missing."],
      patientConstraints: patientConstraints(answers),
      medicines: answer(answers.medications) || "Not provided",
      patientNote: answer(answers.notes) || "No optional note.",
      handoffNote: "Patient-provided or helper-provided answers; clinician review required.",
      rawAnswers: Object.assign({}, answers)
    };
  }

  function summaryToText(summary) {
    return [
      "Urology previsit synthetic summary",
      "",
      "Safety:",
      ...summary.safetyNotice.map((item) => `- ${item}`),
      "",
      `Completeness: ${summary.completionStatus.label}`,
      `Intake mode: ${summary.intakeMode}`,
      `Chief concern: ${summary.chiefConcern}`,
      `Pattern: ${summary.symptomPattern}`,
      `Duration / bother: ${summary.durationSeverity}`,
      "",
      "Clinician review flags:",
      ...summary.clinicianReviewFlags.map((item) => `- ${item}`),
      "",
      "Missing information:",
      ...summary.missingInformation.map((item) => `- ${item}`),
      "",
      "Support needs:",
      ...summary.patientConstraints.map((item) => `- ${item}`),
      "",
      `Medicines: ${summary.medicines}`,
      `Patient note: ${summary.patientNote}`,
      "",
      `Handoff note: ${summary.handoffNote}`
    ].join("\n");
  }

  return {
    REQUIRED_FIELDS,
    SAFETY_NOTICE,
    missingFields,
    clinicianFlags,
    completionStatus,
    buildClinicianSummary,
    summaryToText
  };
});
