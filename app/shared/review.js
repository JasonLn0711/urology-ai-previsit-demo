(function attachReviewShared(root, factory) {
  const api = factory(root);
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.UrologyPrevisitReview = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function reviewSharedFactory(root) {
  const roleTransform = typeof module === "object" && module.exports
    ? require("../../core/role_transform")
    : root.UrologyRoleTransform;

  return {
    DECISIONS: roleTransform.DECISIONS,
    SIGNAL_LABELS: roleTransform.SIGNAL_LABELS,
    blockingSignals: roleTransform.blockingSignals,
    suggestedDecision: roleTransform.suggestedDecision,
    buildReviewRecord: roleTransform.buildReviewRecord,
    reviewRecordToText: roleTransform.reviewRecordToText
  };
});
