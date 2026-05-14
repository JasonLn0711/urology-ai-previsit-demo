(function attachSafety(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.UrologySafety = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function safetyFactory() {
  const SAFETY_NOTICE = [
    "This v1 local product preview is not for clinical use.",
    "It does not diagnose, triage, recommend treatment, or place exam orders.",
    "A clinician must review all information.",
    "Use synthetic data only.",
    "Regulatory status is not determined."
  ];

  const PHYSICIAN_REVIEW_LABEL = "Requires physician review before clinical use.";

  const UNSAFE_LANGUAGE_PATTERNS = [
    /\byou have\b/i,
    /\bdiagnosed with\b/i,
    /\blikely\b/i,
    /\bprobable\b/i,
    /\brisk score\b/i,
    /\btake medication\b/i,
    /\btreat with\b/i,
    /\bstart antibiotic\b/i,
    /\bstart blocker\b/i,
    /\border placed\b/i,
    /\bautomatic exam ordering\b/i,
    /\bautonomous exam ordering\b/i,
    /\bprobable cancer\b/i,
    /\blikely infection\b/i
  ];

  function textValues(value, output) {
    if (typeof value === "string") {
      output.push(value);
      return output;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => textValues(item, output));
      return output;
    }
    if (value && typeof value === "object") {
      Object.values(value).forEach((item) => textValues(item, output));
    }
    return output;
  }

  function unsafeLanguageFindings(value) {
    const text = textValues(value, []).join("\n");
    return UNSAFE_LANGUAGE_PATTERNS
      .filter((pattern) => pattern.test(text))
      .map((pattern) => pattern.source);
  }

  function assertSafeLanguage(value, context) {
    const findings = unsafeLanguageFindings(value);
    if (findings.length) {
      throw new Error(`Unsafe clinical wording in ${context || "output"}: ${findings.join(", ")}`);
    }
    return true;
  }

  function withSafetyEnvelope(output) {
    return Object.assign({}, output, {
      safetyNotice: SAFETY_NOTICE,
      requiresPhysicianReview: true,
      reviewRequiredLabel: PHYSICIAN_REVIEW_LABEL
    });
  }

  return {
    SAFETY_NOTICE,
    PHYSICIAN_REVIEW_LABEL,
    UNSAFE_LANGUAGE_PATTERNS,
    unsafeLanguageFindings,
    assertSafeLanguage,
    withSafetyEnvelope
  };
});
