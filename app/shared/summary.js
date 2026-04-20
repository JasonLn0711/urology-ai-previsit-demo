(function attachSummary(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.UrologyPrevisit = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function summaryFactory() {
  const CORE_REQUIRED_FIELDS = [
    ["filledBy", "who is filling this out"],
    ["chiefConcern", "main urinary concern"],
    ["duration", "symptom duration"],
    ["botherScore", "bother score"],
    ["daytimeFrequencyChange", "daytime urination change"],
    ["nocturiaCount", "nighttime urination count"],
    ["urgency", "sudden hard-to-hold urgency"],
    ["leakage", "urine leakage in the past 4 weeks"],
    ["painBurning", "pain or burning with urination"],
    ["visibleBlood", "visible blood or clots"],
    ["unableToUrinate", "trouble or inability to urinate"],
    ["systemicSymptoms", "fever, chills, or side/back pain"],
    ["medicationListStatus", "medication list readiness"]
  ];

  const SAFETY_NOTICE = [
    "This demo does not diagnose or recommend treatment.",
    "A clinician must review all information.",
    "Use synthetic data only."
  ];

  const NEUTRAL_EMPTY_FLAG = "No priority review statement captured in this synthetic demo.";

  function answer(value) {
    if (typeof value !== "string") return "";
    return value.trim();
  }

  function lower(value) {
    return answer(value).toLowerCase();
  }

  function listValue(value) {
    if (Array.isArray(value)) {
      return value.map((item) => answer(item)).filter(Boolean);
    }
    const single = answer(value);
    return single ? [single] : [];
  }

  function hasValue(value) {
    if (Array.isArray(value)) return listValue(value).length > 0;
    return Boolean(answer(value));
  }

  function isYes(value) {
    return /^yes\b/i.test(answer(value));
  }

  function isNotSure(value) {
    return /not sure|unsure|do not know/i.test(answer(value));
  }

  function containsValue(value, fragment) {
    const needle = fragment.toLowerCase();
    return listValue(value).some((item) => item.toLowerCase().includes(needle));
  }

  function formatList(value, fallback) {
    const items = listValue(value);
    return items.length ? items.join(", ") : fallback;
  }

  function hasConcern(answers, fragment) {
    return lower(answers.chiefConcern).includes(fragment);
  }

  function activeModules(answers) {
    const systemic = listValue(answers.systemicSymptoms).join(" ").toLowerCase();
    const medicationStatus = lower(answers.medicationListStatus);
    return {
      storage:
        hasConcern(answers, "frequency") ||
        hasConcern(answers, "nocturia") ||
        hasConcern(answers, "urgency") ||
        isYes(answers.daytimeFrequencyChange) ||
        isYes(answers.urgency) ||
        ["2 times", "3 or more"].some((item) => lower(answers.nocturiaCount).includes(item)),
      leakage:
        hasConcern(answers, "leakage") ||
        isYes(answers.leakage),
      voiding:
        hasConcern(answers, "emptying") ||
        hasConcern(answers, "weak stream") ||
        isYes(answers.unableToUrinate),
      hematuria:
        hasConcern(answers, "visible blood") ||
        hasConcern(answers, "clots") ||
        isYes(answers.visibleBlood),
      pain:
        hasConcern(answers, "pain") ||
        hasConcern(answers, "burning") ||
        hasConcern(answers, "infection") ||
        isYes(answers.painBurning) ||
        systemic.includes("fever") ||
        systemic.includes("chills") ||
        systemic.includes("side or back pain"),
      medication:
        medicationStatus.includes("partial") ||
        medicationStatus.includes("not sure") ||
        medicationStatus.includes("cannot") ||
        medicationStatus.includes("do not know")
    };
  }

  function requiredFieldsForAnswers(answers) {
    const fields = CORE_REQUIRED_FIELDS.slice();
    const modules = activeModules(answers);

    if (isYes(answers.unableToUrinate)) {
      fields.push(["currentlyUnableToUrinate", "whether trouble urinating is happening now"]);
    }

    if (modules.storage) {
      fields.push(["daytimeFrequencyCount", "daytime urination count range"]);
      fields.push(["urgencyFrequency", "urgency frequency"]);
      fields.push(["bladderDiaryFeasible", "bladder diary feasibility"]);
    }

    if (modules.leakage) {
      fields.push(["leakageFrequency", "leakage frequency"]);
      fields.push(["leakageAmount", "leakage amount"]);
      fields.push(["leakageTriggers", "leakage triggers"]);
      fields.push(["containmentProducts", "pads, diapers, or containment needs"]);
    }

    if (modules.voiding) {
      fields.push(["weakStream", "weak stream"]);
      fields.push(["straining", "straining to urinate"]);
      fields.push(["incompleteEmptying", "feeling of incomplete emptying"]);
    }

    if (modules.hematuria) {
      fields.push(["hematuriaPattern", "visible blood pattern"]);
      fields.push(["bloodClots", "blood clots"]);
    }

    if (modules.pain) {
      fields.push(["painFrequency", "pain or burning pattern"]);
      fields.push(["infectionEpisodeHistory", "recent infection or antibiotic history"]);
      if (containsValue(answers.systemicSymptoms, "side or back pain")) {
        fields.push(["flankPainScore", "side or back pain score"]);
      }
    }

    if (modules.medication) {
      fields.push(["medicationAssist", "medication review support need"]);
    }

    const seen = new Set();
    return fields.filter(([field]) => {
      if (seen.has(field)) return false;
      seen.add(field);
      return true;
    });
  }

  function missingFieldEntries(answers) {
    return requiredFieldsForAnswers(answers).filter(([field]) => !hasValue(answers[field]));
  }

  function missingFields(answers) {
    return missingFieldEntries(answers).map(([, label]) => label);
  }

  function clinicianFlags(answers) {
    const flags = [];
    if (isYes(answers.currentlyUnableToUrinate)) {
      flags.push("Reports currently being unable to urinate.");
    } else if (isYes(answers.unableToUrinate)) {
      flags.push("Reports trouble or inability to urinate.");
    }
    if (isYes(answers.visibleBlood)) {
      flags.push("Reports visible blood or clots in urine.");
    }
    if (isYes(answers.bloodClots)) {
      flags.push("Reports blood clots.");
    }
    if (containsValue(answers.systemicSymptoms, "fever")) {
      flags.push("Reports fever.");
    }
    if (containsValue(answers.systemicSymptoms, "chills")) {
      flags.push("Reports chills.");
    }
    if (containsValue(answers.systemicSymptoms, "side or back pain")) {
      flags.push("Reports side or back pain.");
    }
    if (isYes(answers.painBurning)) {
      flags.push("Reports pain or burning with urination.");
    }
    return flags;
  }

  function symptomPattern(answers) {
    const modules = activeModules(answers);
    const sections = [];

    if (modules.storage) {
      sections.push([
        "Storage",
        [
          answer(answers.daytimeFrequencyChange) && `daytime change: ${answer(answers.daytimeFrequencyChange)}`,
          answer(answers.daytimeFrequencyCount) && `daytime count: ${answer(answers.daytimeFrequencyCount)}`,
          answer(answers.nocturiaCount) && `night count: ${answer(answers.nocturiaCount)}`,
          answer(answers.urgency) && `urgency: ${answer(answers.urgency)}`,
          answer(answers.urgencyFrequency) && `urgency frequency: ${answer(answers.urgencyFrequency)}`,
          hasValue(answers.fluidCaffeineContext) && `fluid/caffeine context: ${formatList(answers.fluidCaffeineContext, "")}`,
          answer(answers.bladderDiaryFeasible) && `diary feasibility: ${answer(answers.bladderDiaryFeasible)}`
        ].filter(Boolean).join("; ")
      ]);
    }

    if (modules.voiding) {
      sections.push([
        "Voiding/emptying",
        [
          answer(answers.unableToUrinate) && `trouble/inability: ${answer(answers.unableToUrinate)}`,
          answer(answers.currentlyUnableToUrinate) && `happening now: ${answer(answers.currentlyUnableToUrinate)}`,
          answer(answers.weakStream) && `weak stream: ${answer(answers.weakStream)}`,
          answer(answers.straining) && `straining: ${answer(answers.straining)}`,
          answer(answers.intermittency) && `stopping/starting: ${answer(answers.intermittency)}`,
          answer(answers.incompleteEmptying) && `incomplete emptying: ${answer(answers.incompleteEmptying)}`
        ].filter(Boolean).join("; ")
      ]);
    }

    if (modules.leakage) {
      sections.push([
        "Leakage",
        [
          answer(answers.leakage) && `past 4 weeks: ${answer(answers.leakage)}`,
          answer(answers.leakageFrequency) && `frequency: ${answer(answers.leakageFrequency)}`,
          answer(answers.leakageAmount) && `amount: ${answer(answers.leakageAmount)}`,
          hasValue(answers.leakageTriggers) && `triggers: ${formatList(answers.leakageTriggers, "")}`,
          answer(answers.containmentProducts) && `containment: ${answer(answers.containmentProducts)}`
        ].filter(Boolean).join("; ")
      ]);
    }

    if (modules.hematuria) {
      sections.push([
        "Visible blood/clots",
        [
          answer(answers.visibleBlood) && `seen by patient: ${answer(answers.visibleBlood)}`,
          answer(answers.hematuriaPattern) && `pattern: ${answer(answers.hematuriaPattern)}`,
          answer(answers.bloodClots) && `clots: ${answer(answers.bloodClots)}`,
          hasValue(answers.hematuriaCoSymptoms) && `with: ${formatList(answers.hematuriaCoSymptoms, "")}`
        ].filter(Boolean).join("; ")
      ]);
    }

    if (modules.pain) {
      sections.push([
        "Pain/infection-related",
        [
          answer(answers.painBurning) && `pain/burning: ${answer(answers.painBurning)}`,
          answer(answers.painFrequency) && `pattern: ${answer(answers.painFrequency)}`,
          hasValue(answers.systemicSymptoms) && `systemic symptoms: ${formatList(answers.systemicSymptoms, "")}`,
          answer(answers.infectionEpisodeHistory) && `recent episodes/antibiotics: ${answer(answers.infectionEpisodeHistory)}`,
          answer(answers.flankPainScore) && `side/back pain score: ${answer(answers.flankPainScore)}`
        ].filter(Boolean).join("; ")
      ]);
    }

    return sections.length
      ? sections.map(([label, detail]) => `${label}: ${detail || "details not provided"}`).join(" | ")
      : "Not enough information yet.";
  }

  function durationBother(answers) {
    return [
      answer(answers.duration) || "Duration not provided",
      answer(answers.botherScore) ? `bother score ${answer(answers.botherScore)}/10` : "Bother score not provided"
    ].join(" / ");
  }

  function medicineContext(answers) {
    const parts = [
      answer(answers.medicationListStatus) && `list readiness: ${answer(answers.medicationListStatus)}`,
      answer(answers.medicationAssist) && `review support: ${answer(answers.medicationAssist)}`,
      hasValue(answers.relevantComorbidities) && `patient-reported context: ${formatList(answers.relevantComorbidities, "")}`,
      answer(answers.diureticAnticoagulantAwareness) && `diuretic/anticoagulant awareness: ${answer(answers.diureticAnticoagulantAwareness)}`
    ].filter(Boolean);
    return parts.length ? parts.join("; ") : "Not provided";
  }

  function patientConstraints(answers) {
    return [
      answer(answers.filledBy) || "Completion source not provided",
      answer(answers.language) || "Language preference not provided",
      answer(answers.deviceComfort) || "Device/accessibility need not provided",
      answer(answers.supportPreference) || "Support preference not provided"
    ];
  }

  function nurseCues(answers) {
    const cues = [];
    const modules = activeModules(answers);
    const flags = clinicianFlags(answers);
    const uncertainCore = [
      "daytimeFrequencyChange",
      "nocturiaCount",
      "urgency",
      "leakage",
      "painBurning",
      "visibleBlood",
      "unableToUrinate"
    ].filter((field) => isNotSure(answers[field]));
    if (containsValue(answers.systemicSymptoms, "not sure")) {
      uncertainCore.push("systemicSymptoms");
    }

    if (/nurse|family|helper/i.test(answer(answers.filledBy)) || /staff|family|help/i.test(answer(answers.supportPreference))) {
      cues.push("Completion support may be needed before clinician review.");
    }
    if (uncertainCore.length) {
      cues.push("Some core answers are marked not sure; staff may need to clarify them before clinician review.");
    }
    if (modules.storage) {
      cues.push("Bladder diary instruction may be relevant if clinic workflow supports it.");
    }
    if (modules.leakage || hasValue(answers.containmentProducts)) {
      cues.push("Containment product or leakage-support needs should remain visible to staff.");
    }
    if (activeModules(answers).medication || /partial|not sure|cannot|do not know/i.test(answer(answers.medicationListStatus))) {
      cues.push("Medication list may need nurse-assisted review.");
    }
    if (flags.length) {
      cues.push("Priority review statements should be visible before the clinician encounter.");
    }
    return cues.length ? cues : ["No nurse-specific cue captured beyond routine review."];
  }

  function completionStatus(answers) {
    const required = requiredFieldsForAnswers(answers);
    const missing = missingFieldEntries(answers);
    const completed = required.length - missing.length;
    return {
      completed,
      total: required.length,
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
    const modules = activeModules(answers);
    const moduleNames = Object.entries(modules)
      .filter(([, active]) => active)
      .map(([name]) => name);

    return {
      safetyNotice: SAFETY_NOTICE,
      completionStatus: status,
      activeModules: moduleNames.length ? moduleNames : ["core only"],
      intakeMode: answer(answers.filledBy) || "Not provided",
      chiefConcern: answer(answers.chiefConcern) || "Not provided",
      symptomPattern: symptomPattern(answers),
      durationBother: durationBother(answers),
      clinicianReviewFlags: flags.length ? flags : [NEUTRAL_EMPTY_FLAG],
      missingInformation: missing.length ? missing : ["No required MVP fields missing."],
      nurseCues: nurseCues(answers),
      patientConstraints: patientConstraints(answers),
      medicines: medicineContext(answers),
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
      `Active modules: ${summary.activeModules.join(", ")}`,
      `Intake mode: ${summary.intakeMode}`,
      `Chief concern: ${summary.chiefConcern}`,
      `Duration / bother: ${summary.durationBother}`,
      `Patient-reported pattern: ${summary.symptomPattern}`,
      "",
      "Priority review statements:",
      ...summary.clinicianReviewFlags.map((item) => `- ${item}`),
      "",
      "Nurse workflow cues:",
      ...summary.nurseCues.map((item) => `- ${item}`),
      "",
      "Missing information:",
      ...summary.missingInformation.map((item) => `- ${item}`),
      "",
      "Support needs:",
      ...summary.patientConstraints.map((item) => `- ${item}`),
      "",
      `Medication/context: ${summary.medicines}`,
      `Patient note: ${summary.patientNote}`,
      "",
      `Handoff note: ${summary.handoffNote}`
    ].join("\n");
  }

  return {
    REQUIRED_FIELDS: CORE_REQUIRED_FIELDS,
    SAFETY_NOTICE,
    activeModules,
    requiredFieldsForAnswers,
    missingFieldEntries,
    missingFields,
    clinicianFlags,
    completionStatus,
    buildClinicianSummary,
    summaryToText
  };
});
