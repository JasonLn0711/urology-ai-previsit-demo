(function attachReview(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.UrologyPrevisitReview = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function reviewFactory() {
  const DECISIONS = ["continue", "revise", "narrow", "pause"];

  const SIGNAL_LABELS = {
    workflowPain: "Repeated-question pain",
    summaryUsefulness: "Summary usefulness",
    staffBurden: "Staff burden",
    patientFit: "Patient or assisted completion",
    safetyBoundary: "Safety boundary",
    workflowSlot: "Workflow slot",
    existingProcess: "Existing process"
  };

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
    if (blockers.length) return "pause";
    if (text(inputs.workflowPain) !== "clear" || text(inputs.workflowSlot) === "unclear") return "revise";
    if (text(inputs.patientFit) === "assisted-only") return "narrow";
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
    const decision = normalizeDecision(inputs.decision);
    const suggestion = suggestedDecision(inputs);
    const blockers = blockingSignals(inputs);
    return {
      decision: decision || suggestion,
      reviewerDecision: decision,
      suggestedDecision: suggestion,
      blockers,
      evidence: evidenceRows(inputs),
      nextArtifact: text(inputs.nextArtifact) || "Not selected",
      reviewerNotes: text(inputs.reviewerNotes) || "No reviewer notes.",
      productQuestion: "Would a real clinic adopt this because it improves readiness without adding unacceptable burden?",
      safetyBoundary: [
        "No diagnosis.",
        "No triage.",
        "No treatment advice.",
        "No real patient data during discovery.",
        "Clinician review remains required."
      ]
    };
  }

  function reviewRecordToText(record) {
    return [
      "Urology previsit MVP reviewer record",
      "",
      `Reviewer decision: ${record.reviewerDecision || "Not explicitly selected"}`,
      `Decision guide: ${record.suggestedDecision}`,
      `Recorded decision: ${record.decision}`,
      `Next artifact: ${record.nextArtifact}`,
      "",
      "Evidence signals:",
      ...record.evidence.map((item) => `- ${item.label}: ${item.value} (${item.status})`),
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
  }

  return {
    DECISIONS,
    SIGNAL_LABELS,
    blockingSignals,
    suggestedDecision,
    buildReviewRecord,
    reviewRecordToText
  };
});
