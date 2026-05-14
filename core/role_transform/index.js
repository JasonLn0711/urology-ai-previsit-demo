(function attachRoleTransform(root, factory) {
  const deps = typeof module === "object" && module.exports
    ? {
        attribution: require("../attribution"),
        missingFields: require("../missing_fields"),
        summary: require("../summary"),
        safety: require("../safety")
      }
    : {
        attribution: root.UrologyAttribution,
        missingFields: root.UrologyMissingFields,
        summary: root.UrologySummaryCore,
        safety: root.UrologySafety
      };
  const api = factory(deps);
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.UrologyRoleTransform = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function roleTransformFactory({ attribution, missingFields, summary, safety }) {
  const {
    fieldSourceEntries,
    sourceAttributionSummary,
    sourceNotes,
    attributionBlock,
    answer
  } = attribution;

  const {
    activeModules,
    missingFieldEntries,
    completionStatus,
    supplementalPrompt
  } = missingFields;

  const {
    buildClinicianSummary,
    clinicianFlags,
    medicineContext
  } = summary;

  const {
    SAFETY_NOTICE,
    assertSafeLanguage,
    withSafetyEnvelope
  } = safety;

  const DECISIONS = ["continue", "revise", "stop"];

  const SIGNAL_LABELS = {
    workflowPain: "Repeated-question pain",
    summaryUsefulness: "Summary usefulness",
    staffBurden: "Staff burden",
    patientFit: "Patient or assisted completion",
    safetyBoundary: "Safety boundary",
    workflowSlot: "Workflow slot",
    existingProcess: "Existing process"
  };

  function buildNurseChecklist(answers) {
    const safeAnswers = answers || {};
    const missing = missingFieldEntries(safeAnswers).map(([field, label]) => supplementalPrompt(field, label));
    const flags = clinicianFlags(safeAnswers);
    const checklist = withSafetyEnvelope({
      completionStatus: completionStatus(safeAnswers),
      activeModules: Object.entries(activeModules(safeAnswers))
        .filter(([, active]) => active)
        .map(([name]) => name),
      supplementalQuestions: missing,
      sourceNotes: sourceNotes(safeAnswers),
      workflowCues: summary.nurseCues(safeAnswers),
      priorityReviewFlags: flags.length ? flags : [summary.NEUTRAL_EMPTY_FLAG],
      fieldSources: fieldSourceEntries(safeAnswers),
      sourceAttributionSummary: sourceAttributionSummary(safeAnswers),
      attribution: attributionBlock(safeAnswers),
      rawAnswers: Object.assign({}, safeAnswers)
    });
    assertSafeLanguage(checklist, "nurse checklist");
    return checklist;
  }

  function buildVisitPacket(answers) {
    const safeAnswers = answers || {};
    const clinicianSummary = buildClinicianSummary(safeAnswers);
    const nurseChecklist = buildNurseChecklist(safeAnswers);
    const packet = withSafetyEnvelope({
      title: "Urology previsit role-separated packet",
      patientPage: {
        title: "Patient and family confirmation",
        audience: "patient-family",
        rows: [
          ["Completion source", clinicianSummary.intakeMode],
          ["Main concern", clinicianSummary.chiefConcern],
          ["Duration / bother", clinicianSummary.durationBother],
          ["Medication readiness", medicineContext(safeAnswers)],
          ["Optional note", clinicianSummary.patientNote]
        ],
        missingInformation: clinicianSummary.missingInformation,
        sourceNotes: clinicianSummary.sourceNotes
      },
      nursePage: {
        title: "Nurse missing-information repair",
        audience: "nurse",
        completionStatus: nurseChecklist.completionStatus,
        supplementalQuestions: nurseChecklist.supplementalQuestions,
        workflowCues: nurseChecklist.workflowCues,
        sourceNotes: nurseChecklist.sourceNotes,
        priorityReviewFlags: nurseChecklist.priorityReviewFlags
      },
      clinicianPage: {
        title: "Clinician previsit scan",
        audience: "clinician",
        rows: [
          ["Completion source", clinicianSummary.intakeMode],
          ["Main concern", clinicianSummary.chiefConcern],
          ["Active modules", clinicianSummary.activeModules.join(", ")],
          ["Duration / bother", clinicianSummary.durationBother],
          ["Patient-reported pattern", clinicianSummary.symptomPattern],
          ["Medication/context", clinicianSummary.medicines],
          ["Patient note", clinicianSummary.patientNote]
        ],
        priorityReviewFlags: clinicianSummary.clinicianReviewFlags,
        missingInformation: clinicianSummary.missingInformation,
        sourceAttributionSummary: clinicianSummary.sourceAttributionSummary,
        fieldSources: clinicianSummary.fieldSources
      },
      attribution: attributionBlock(safeAnswers),
      rawAnswers: Object.assign({}, safeAnswers)
    });
    assertSafeLanguage(packet, "visit packet");
    return packet;
  }

  function visitPacketToText(packet) {
    const text = [
      packet.title,
      "",
      "Safety:",
      ...packet.safetyNotice.map((item) => `- ${item}`),
      `- ${packet.reviewRequiredLabel}`,
      "",
      `[${packet.patientPage.title}]`,
      ...packet.patientPage.rows.map(([label, value]) => `${label}: ${value}`),
      "Missing or uncertain:",
      ...packet.patientPage.missingInformation.map((item) => `- ${item}`),
      "",
      `[${packet.nursePage.title}]`,
      `Completion: ${packet.nursePage.completionStatus.label}`,
      "Supplemental questions:",
      ...packet.nursePage.supplementalQuestions.map((item) => `- ${item.ask}`),
      "Workflow cues:",
      ...packet.nursePage.workflowCues.map((item) => `- ${item}`),
      "",
      `[${packet.clinicianPage.title}]`,
      ...packet.clinicianPage.rows.map(([label, value]) => `${label}: ${value}`),
      "Priority review statements:",
      ...packet.clinicianPage.priorityReviewFlags.map((item) => `- ${item}`),
      "Answer source attribution:",
      ...packet.clinicianPage.sourceAttributionSummary.map((item) => `- ${item}`)
    ].join("\n");
    assertSafeLanguage(text, "visit packet text");
    return text;
  }

  function buildCanonicalRecord(answers) {
    const safeAnswers = answers || {};
    const derivedSummary = buildClinicianSummary(safeAnswers);
    return {
      patient_input: Object.assign({}, safeAnswers),
      derived_summary: derivedSummary,
      missing_fields: missingFieldEntries(safeAnswers).map(([field, label]) => ({ field, label })),
      attribution: attributionBlock(safeAnswers),
      audit_trace: [
        {
          event: "patient_input_received",
          source: "synthetic_or_local_storage",
          fields_present: Object.keys(safeAnswers).filter((field) => field !== "sourceByField")
        },
        {
          event: "summary_generated",
          source: "core/summary",
          requires_physician_review: true
        },
        {
          event: "missing_fields_detected",
          source: "core/missing_fields",
          missing_count: missingFieldEntries(safeAnswers).length
        },
        {
          event: "source_attribution_applied",
          source: "core/attribution",
          attributed_field_count: fieldSourceEntries(safeAnswers).length
        },
        {
          event: "safety_checked",
          source: "core/safety",
          no_diagnosis_or_treatment_claims: true
        }
      ]
    };
  }

  function transformForRole(recordOrAnswers, role) {
    const answers = recordOrAnswers && recordOrAnswers.patient_input
      ? recordOrAnswers.patient_input
      : recordOrAnswers;
    if (role === "patient") {
      const clinicianSummary = buildClinicianSummary(answers);
      return {
        role: "patient",
        source: "patient_input",
        view: {
          intakeMode: clinicianSummary.intakeMode,
          chiefConcern: clinicianSummary.chiefConcern,
          durationBother: clinicianSummary.durationBother,
          missingInformation: clinicianSummary.missingInformation,
          sourceNotes: clinicianSummary.sourceNotes
        }
      };
    }
    if (role === "nurse") {
      return {
        role: "nurse",
        source: "patient_input",
        view: buildNurseChecklist(answers)
      };
    }
    if (role === "clinician") {
      return {
        role: "clinician",
        source: "patient_input",
        view: buildClinicianSummary(answers)
      };
    }
    if (role === "reviewer") {
      return {
        role: "reviewer",
        source: "canonical_record",
        view: {
          decision_question: "Continue, revise, or stop this workflow based on evidence.",
          canonical_record: buildCanonicalRecord(answers)
        }
      };
    }
    throw new Error(`Unknown role: ${role}`);
  }

  function text(value) {
    if (typeof value !== "string") return "";
    return value.trim();
  }

  function normalizeDecision(value) {
    const decision = text(value).toLowerCase();
    return DECISIONS.includes(decision) ? decision : "";
  }

  function signalStatus(field, value) {
    const normalized = text(value);
    if (!normalized) return "unknown";
    const positive = new Set([
      "clear",
      "would-read",
      "acceptable",
      "self-filled",
      "mixed",
      "assisted-only",
      "exists",
      "not-sufficient"
    ]);
    const negative = new Set(["no", "unacceptable", "unrealistic", "none", "sufficient"]);
    if (positive.has(normalized)) return "supporting";
    if (negative.has(normalized)) return "blocking";
    return "uncertain";
  }

  function blockingSignals(inputs) {
    const blockers = [];
    if (text(inputs.safetyBoundary) === "unacceptable") blockers.push("Safety boundary is unacceptable.");
    if (text(inputs.workflowSlot) === "none") blockers.push("No workflow slot exists.");
    if (text(inputs.summaryUsefulness) === "no") blockers.push("Clinician would not read the summary.");
    if (text(inputs.staffBurden) === "unacceptable") blockers.push("Staff burden is unacceptable.");
    if (text(inputs.patientFit) === "unrealistic") blockers.push("Patient or assisted completion is unrealistic.");
    if (text(inputs.existingProcess) === "sufficient") blockers.push("Existing process may already be sufficient.");
    return blockers;
  }

  function suggestedDecision(inputs) {
    const blockers = blockingSignals(inputs);
    if (blockers.length) return "stop";
    if (text(inputs.workflowPain) !== "clear" || text(inputs.workflowSlot) === "unclear") return "revise";
    if (text(inputs.patientFit) === "assisted-only") return "revise";
    if (text(inputs.summaryUsefulness) === "needs-rewrite" || text(inputs.safetyBoundary) === "needs-wording") {
      return "revise";
    }
    if (text(inputs.workflowPain) === "clear" && text(inputs.summaryUsefulness) === "would-read") {
      return "continue";
    }
    return "revise";
  }

  function evidenceRows(inputs) {
    return Object.keys(SIGNAL_LABELS).map((field) => ({
      field,
      label: SIGNAL_LABELS[field],
      value: text(inputs[field]) || "unknown",
      status: signalStatus(field, inputs[field])
    }));
  }

  function buildReviewRecord(inputs) {
    const safeInputs = inputs || {};
    const decision = normalizeDecision(safeInputs.decision);
    const suggestion = suggestedDecision(safeInputs);
    const blockers = blockingSignals(safeInputs);
    const record = withSafetyEnvelope({
      decision: decision || suggestion,
      reviewerDecision: decision,
      suggestedDecision: suggestion,
      reviewerRole: text(safeInputs.reviewerRole) || "Not recorded",
      blockers,
      evidence: evidenceRows(safeInputs),
      meetingEvidence: [
        ["Most useful summary line", text(safeInputs.mostUsefulLine) || "Not recorded"],
        ["Noisiest or riskiest line", text(safeInputs.noisiestLine) || "Not recorded"],
        ["Missing information that matters", text(safeInputs.missingInformation) || "Not recorded"],
        ["Unsafe or misleading wording", text(safeInputs.unsafeWording) || "None recorded"],
        ["Expected workflow slot", text(safeInputs.expectedWorkflowSlot) || "Not recorded"],
        ["Staff burden concern", text(safeInputs.staffBurdenConcern) || "Not recorded"],
        ["Case-specific evidence", text(safeInputs.caseEvidence) || "Not recorded"]
      ],
      nextArtifact: text(safeInputs.nextArtifact) || "Not selected",
      reviewerNotes: text(safeInputs.reviewerNotes) || "No reviewer notes.",
      productQuestion: "Would a real clinic adopt this because it improves readiness without adding unacceptable burden?",
      safetyBoundary: [
        "No diagnosis.",
        "No triage.",
        "No treatment advice.",
        "No real patient data during discovery.",
        "Clinician review remains required."
      ]
    });
    assertSafeLanguage(record, "review record");
    return record;
  }

  function reviewRecordToText(record) {
    const output = [
      "Urology previsit MVP reviewer record",
      "",
      `Reviewer role: ${record.reviewerRole}`,
      `Reviewer decision: ${record.reviewerDecision || "Not explicitly selected"}`,
      `Decision guide: ${record.suggestedDecision}`,
      `Recorded decision: ${record.decision}`,
      `Next artifact: ${record.nextArtifact}`,
      "",
      "Evidence signals:",
      ...record.evidence.map((item) => `- ${item.label}: ${item.value} (${item.status})`),
      "",
      "Meeting evidence:",
      ...record.meetingEvidence.map(([label, value]) => `- ${label}: ${value}`),
      "",
      "Blockers:",
      ...(record.blockers.length ? record.blockers.map((item) => `- ${item}`) : ["- No hard blockers recorded."]),
      "",
      "Safety boundary:",
      ...record.safetyBoundary.map((item) => `- ${item}`),
      "",
      "Reviewer notes:",
      record.reviewerNotes
    ].join("\n");
    assertSafeLanguage(output, "review text");
    return output;
  }

  return {
    SAFETY_NOTICE,
    DECISIONS,
    SIGNAL_LABELS,
    buildNurseChecklist,
    buildVisitPacket,
    visitPacketToText,
    buildCanonicalRecord,
    transformForRole,
    blockingSignals,
    suggestedDecision,
    buildReviewRecord,
    reviewRecordToText
  };
});
