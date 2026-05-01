const test = require("node:test");
const assert = require("node:assert/strict");
const { SYNTHETIC_CASES, findCase } = require("../../data/synthetic_cases");
const {
  buildClinicianSummary,
  summaryToText
} = require("../../core/summary");

test("synthetic cases build bounded clinician summaries", () => {
  assert.equal(SYNTHETIC_CASES.length, 5);

  for (const sampleCase of SYNTHETIC_CASES) {
    const summary = buildClinicianSummary(sampleCase.answers);
    const text = summaryToText(summary).toLowerCase();

    assert.equal(summary.requiresPhysicianReview, true);
    assert.ok(summary.fieldSources.length > 0);
    assert.match(text, /clinician review required|clinician must review|requires physician review/);
    assert.doesNotMatch(text, /likely infection|probable cancer|take medication|diagnosed with|you have/);
  }
});

test("hematuria case stays observational and activates hematuria context", () => {
  const summary = buildClinicianSummary(findCase("synthetic-hematuria-occult-blood").answers);
  const text = summaryToText(summary).toLowerCase();

  assert.ok(summary.activeModules.includes("hematuria"));
  assert.ok(summary.activeModules.includes("medication"));
  assert.match(text, /visible blood/);
  assert.match(text, /occult blood/);
  assert.doesNotMatch(text, /cancer|risk score|order placed/);
});

test("supports multiple selected main urinary concerns", () => {
  const summary = buildClinicianSummary({
    filledBy: "Patient self-filled",
    chiefConcern: ["Leakage", "Visible blood or clots"],
    duration: "1 to 7 days",
    botherScore: "6",
    daytimeFrequencyChange: "No",
    nocturiaCount: "1 time",
    urgency: "No",
    leakage: "Yes",
    painBurning: "No",
    visibleBlood: "Yes",
    unableToUrinate: "No",
    systemicSymptoms: ["None of these"],
    medicationListStatus: "Can provide list",
    leakageFrequency: "Weekly",
    leakageAmount: "Small amount",
    leakageTriggers: ["Before reaching toilet"],
    containmentProducts: "Pads or liners",
    hematuriaPattern: "One time",
    bloodClots: "No"
  });

  assert.equal(summary.chiefConcern, "Leakage, Visible blood or clots");
  assert.ok(summary.activeModules.includes("leakage"));
  assert.ok(summary.activeModules.includes("hematuria"));
});
