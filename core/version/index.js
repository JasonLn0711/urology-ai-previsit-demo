(function initUroPrevisitVersion(globalScope) {
  const VERSION = {
    version: "2.0.0",
    versionLabel: "v2.0.0",
    product: "UroPrevisit Navigator",
    track: "urology-ai-previsit-demo",
    stage: "demo-freeze-candidate",
    releasedAt: "2026-05-12",
    updatedAt: "2026-05-12",
    summary: "V2 adaptive-questioning demo with governed question-bank retrieval, deterministic ranking, ambiguity handling, and executable freeze checks.",
    safetyBoundary: [
      "synthetic data only",
      "no diagnosis",
      "no treatment recommendation",
      "no triage claim",
      "no LLM runtime",
      "no HIS/EMR/EHR integration"
    ],
    verificationCommands: [
      "npm run version:check",
      "npm run demo:v2-freeze",
      "npm run smoke",
      "npm test"
    ]
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = VERSION;
  }

  if (globalScope) {
    globalScope.UroPrevisitVersion = VERSION;
  }
})(typeof window !== "undefined" ? window : globalThis);
