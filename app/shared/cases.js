(function attachCasesShared(root, factory) {
  const api = factory(root);
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.UrologyCases = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function casesSharedFactory(root) {
  if (typeof module === "object" && module.exports) {
    return require("../../data/synthetic_cases");
  }
  return root.UrologyCasesData;
});
