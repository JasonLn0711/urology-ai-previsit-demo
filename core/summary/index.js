(function attachSummaryCore(root, factory) {
  const deps = typeof module === "object" && module.exports
    ? {
        attribution: require("../attribution"),
        missingFields: require("../missing_fields"),
        safety: require("../safety")
      }
    : {
        attribution: root.UrologyAttribution,
        missingFields: root.UrologyMissingFields,
        safety: root.UrologySafety
      };
  const api = factory(deps);
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.UrologySummaryCore = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function summaryCoreFactory({ attribution, missingFields, safety }) {
  const {
    answer,
    listValue,
    hasValue,
    fieldSourceEntries,
    sourceAttributionSummary,
    sourceNotes,
    attributionBlock
  } = attribution;

  const {
    activeModules,
    missingFields: missingFieldLabels,
    completionStatus,
    isYes,
    isNotSure,
    containsValue
  } = missingFields;

  const {
    SAFETY_NOTICE,
    assertSafeLanguage,
    withSafetyEnvelope
  } = safety;

  const NEUTRAL_EMPTY_FLAG = "No priority review statement captured in this synthetic case.";

  function formatList(value, fallback) {
    const items = listValue(value);
    return items.length ? items.join(", ") : fallback;
  }

  function clinicianFlags(answers) {
    const flags = [];
    if (isYes(answers && answers.currentlyUnableToUrinate)) {
      flags.push("Reports currently being unable to urinate.");
    } else if (isYes(answers && answers.unableToUrinate)) {
      flags.push("Reports trouble or inability to urinate.");
    }
    if (isYes(answers && answers.visibleBlood)) {
      flags.push("Reports visible blood or clots in urine.");
    }
    if (isYes(answers && answers.bloodClots)) {
      flags.push("Reports blood clots.");
    }
    if (containsValue(answers && answers.systemicSymptoms, "fever")) {
      flags.push("Reports fever.");
    }
    if (containsValue(answers && answers.systemicSymptoms, "chills")) {
      flags.push("Reports chills.");
    }
    if (containsValue(answers && answers.systemicSymptoms, "side or back pain")) {
      flags.push("Reports side or back pain.");
    }
    if (isYes(answers && answers.painBurning)) {
      flags.push("Reports pain or burning with urination.");
    }
    return flags;
  }

  function symptomPattern(answers) {
    const modules = activeModules(answers || {});
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
      answer(answers && answers.duration) || "Duration not provided",
      answer(answers && answers.botherScore) ? `bother score ${answer(answers.botherScore)}/10` : "Bother score not provided"
    ].join(" / ");
  }

  function medicineContext(answers) {
    const parts = [
      answer(answers && answers.medicationListStatus) && `list readiness: ${answer(answers.medicationListStatus)}`,
      answer(answers && answers.medicationAssist) && `review support: ${answer(answers.medicationAssist)}`,
      hasValue(answers && answers.relevantComorbidities) && `patient-reported context: ${formatList(answers.relevantComorbidities, "")}`,
      answer(answers && answers.diureticAnticoagulantAwareness) && `diuretic/anticoagulant awareness: ${answer(answers.diureticAnticoagulantAwareness)}`
    ].filter(Boolean);
    return parts.length ? parts.join("; ") : "Not provided";
  }

  function patientConstraints(answers) {
    return [
      answer(answers && answers.filledBy) || "Completion source not provided",
      answer(answers && answers.language) || "Language preference not provided",
      answer(answers && answers.deviceComfort) || "Device/accessibility need not provided",
      answer(answers && answers.supportPreference) || "Support preference not provided"
    ];
  }

  function nurseCues(answers) {
    const cues = [];
    const modules = activeModules(answers || {});
    const flags = clinicianFlags(answers || {});
    const uncertainCore = [
      "daytimeFrequencyChange",
      "nocturiaCount",
      "urgency",
      "leakage",
      "painBurning",
      "visibleBlood",
      "unableToUrinate"
    ].filter((field) => isNotSure(answers && answers[field]));
    if (containsValue(answers && answers.systemicSymptoms, "not sure")) {
      uncertainCore.push("systemicSymptoms");
    }

    if (/nurse|family|helper/i.test(answer(answers && answers.filledBy)) || /staff|family|help/i.test(answer(answers && answers.supportPreference))) {
      cues.push("Completion support may be needed before clinician review.");
    }
    if (uncertainCore.length) {
      cues.push("Some core answers are marked not sure; staff may need to clarify them before clinician review.");
    }
    if (modules.storage) {
      cues.push("Bladder diary instruction may be relevant if clinic workflow supports it.");
    }
    if (modules.leakage || hasValue(answers && answers.containmentProducts)) {
      cues.push("Containment product or leakage-support needs should remain visible to staff.");
    }
    if (modules.medication || /partial|not sure|cannot|do not know/i.test(answer(answers && answers.medicationListStatus))) {
      cues.push("Medication list may need nurse review or supplemental confirmation.");
    }
    if (flags.length) {
      cues.push("Priority review statements should be visible before the clinician encounter.");
    }
    return cues.length ? cues : ["No nurse-specific cue captured beyond routine review."];
  }

  function buildClinicianSummary(answers) {
    const safeAnswers = answers || {};
    const missing = missingFieldLabels(safeAnswers);
    const flags = clinicianFlags(safeAnswers);
    const status = completionStatus(safeAnswers);
    const modules = activeModules(safeAnswers);
    const moduleNames = Object.entries(modules)
      .filter(([, active]) => active)
      .map(([name]) => name);

    const summary = withSafetyEnvelope({
      completionStatus: status,
      activeModules: moduleNames.length ? moduleNames : ["core only"],
      intakeMode: answer(safeAnswers.filledBy) || "Not provided",
      chiefConcern: formatList(safeAnswers.chiefConcern, "Not provided"),
      symptomPattern: symptomPattern(safeAnswers),
      durationBother: durationBother(safeAnswers),
      clinicianReviewFlags: flags.length ? flags : [NEUTRAL_EMPTY_FLAG],
      missingInformation: missing.length ? missing : ["No required MVP fields missing."],
      nurseCues: nurseCues(safeAnswers),
      patientConstraints: patientConstraints(safeAnswers),
      medicines: medicineContext(safeAnswers),
      patientNote: answer(safeAnswers.notes) || "No optional note.",
      sourceNotes: sourceNotes(safeAnswers),
      fieldSources: fieldSourceEntries(safeAnswers),
      sourceAttributionSummary: sourceAttributionSummary(safeAnswers),
      attribution: attributionBlock(safeAnswers),
      handoffNote: "Patient-provided or helper-provided answers; clinician review required.",
      rawAnswers: Object.assign({}, safeAnswers)
    });

    assertSafeLanguage(summary, "clinician summary");
    return summary;
  }

  function summaryToText(summary) {
    const text = [
      "Urology previsit synthetic summary",
      "",
      "Safety:",
      ...summary.safetyNotice.map((item) => `- ${item}`),
      `- ${summary.reviewRequiredLabel}`,
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
      "Answer source notes:",
      ...summary.sourceNotes.map((item) => `- ${item}`),
      ...summary.sourceAttributionSummary.map((item) => `- ${item}`),
      "",
      `Medication/context: ${summary.medicines}`,
      `Patient note: ${summary.patientNote}`,
      "",
      `Handoff note: ${summary.handoffNote}`
    ].join("\n");
    assertSafeLanguage(text, "summary text");
    return text;
  }

  return {
    SAFETY_NOTICE,
    NEUTRAL_EMPTY_FLAG,
    clinicianFlags,
    symptomPattern,
    durationBother,
    medicineContext,
    patientConstraints,
    nurseCues,
    buildClinicianSummary,
    summaryToText
  };
});
