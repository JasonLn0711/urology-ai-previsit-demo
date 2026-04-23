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
