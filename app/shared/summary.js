(function attachPrevisitShared(root, factory) {
  const api = factory(root);
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.UrologyPrevisit = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function previsitSharedFactory(root) {
  if (typeof module === "object" && module.exports) {
    return Object.assign(
      {},
      require("../../core/safety"),
      require("../../core/attribution"),
      require("../../core/missing_fields"),
      require("../../core/summary"),
      require("../../core/role_transform")
    );
  }

  return Object.assign(
    {},
    root.UrologySafety,
    root.UrologyAttribution,
    root.UrologyMissingFields,
    root.UrologySummaryCore,
    root.UrologyRoleTransform
  );
});
