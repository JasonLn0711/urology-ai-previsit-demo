const test = require("node:test");
const assert = require("node:assert/strict");
const {
  attributionBlock,
  fieldSourceEntries,
  sourceAttributionSummary,
  sourceForField
} = require("../../core/attribution");

test("source attribution tags explicit and inferred field sources", () => {
  const answers = {
    filledBy: "Family or helper-assisted",
    chiefConcern: "Leakage",
    leakage: "Yes",
    botherScore: "7",
    medicationListStatus: "Partial list only",
    sourceByField: {
      filledBy: "declared_on_entry",
      leakage: "family_observation",
      botherScore: "patient_with_family_operator",
      medicationListStatus: "nurse_supplement"
    }
  };

  assert.equal(sourceForField(answers, "filledBy"), "declared_on_entry");
  assert.equal(sourceForField(answers, "leakage"), "family_observation");
  assert.equal(sourceForField(answers, "botherScore"), "patient_with_family_operator");
  assert.equal(sourceForField(answers, "chiefConcern"), "family_observation");
  assert.ok(fieldSourceEntries(answers).every((entry) => entry.source && entry.label));
  assert.ok(sourceAttributionSummary(answers).some((line) => line.includes("現場補問")));
  assert.ok(attributionBlock(answers).field_sources.length >= 4);
});
