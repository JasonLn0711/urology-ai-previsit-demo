(function attachSummary(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.UrologyPrevisit = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function summaryFactory() {
  const REQUIRED_FIELDS = [
    ["symptomCategory", "main concern"],
    ["duration", "duration"],
    ["severity", "severity or bother"],
    ["frequencyDay", "daytime bathroom trips"],
    ["nocturia", "nighttime bathroom trips"],
    ["painBurning", "pain or burning"],
    ["blood", "blood in urine"],
    ["fever", "fever or chills"],
    ["unableToUrinate", "ability to urinate"],
    ["medications", "current medicines or relevant medicine uncertainty"],
    ["language", "preferred language"],
    ["phoneComfort", "phone or accessibility needs"]
  ];

  const SAFETY_NOTICE = [
    "This demo does not diagnose or recommend treatment.",
    "A clinician must review all information.",
    "Use synthetic data only."
  ];

  function answer(value) {
    if (typeof value !== "string") return "";
    return value.trim();
  }

  function missingFields(answers) {
    return REQUIRED_FIELDS
      .filter(([field]) => !answer(answers[field]))
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
    if (answer(answers.frequencyDay)) parts.push(`${answers.frequencyDay} during the day`);
    if (answer(answers.nocturia)) parts.push(`${answers.nocturia} at night`);
    if (answer(answers.leak)) parts.push(`leakage: ${answers.leak}`);
    return parts.length ? parts.join("; ") : "Not enough information yet.";
  }

  function buildClinicianSummary(answers) {
    const missing = missingFields(answers);
    const flags = clinicianFlags(answers);
    return {
      safetyNotice: SAFETY_NOTICE,
      chiefConcern: answer(answers.symptomCategory) || "Not provided",
      symptomPattern: symptomPattern(answers),
      durationSeverity: [
        answer(answers.duration) || "Duration not provided",
        answer(answers.severity) || "Severity not provided"
      ].join(" / "),
      clinicianReviewFlags: flags.length ? flags : ["No red-flag statements captured in this synthetic demo."],
      missingInformation: missing.length ? missing : ["No required MVP fields missing."],
      patientConstraints: [
        answer(answers.language) || "Language preference not provided",
        answer(answers.phoneComfort) || "Phone/accessibility need not provided",
        answer(answers.supportNeeds) || "Support need not provided"
      ],
      medicines: answer(answers.medications) || "Not provided",
      patientNote: answer(answers.notes) || "No optional note.",
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
      `Chief concern: ${summary.chiefConcern}`,
      `Pattern: ${summary.symptomPattern}`,
      `Duration / severity: ${summary.durationSeverity}`,
      "",
      "Clinician review flags:",
      ...summary.clinicianReviewFlags.map((item) => `- ${item}`),
      "",
      "Missing information:",
      ...summary.missingInformation.map((item) => `- ${item}`),
      "",
      "Patient constraints:",
      ...summary.patientConstraints.map((item) => `- ${item}`),
      "",
      `Medicines: ${summary.medicines}`,
      `Patient note: ${summary.patientNote}`
    ].join("\n");
  }

  return {
    REQUIRED_FIELDS,
    SAFETY_NOTICE,
    missingFields,
    clinicianFlags,
    buildClinicianSummary,
    summaryToText
  };
});

