const test = require("node:test");
const assert = require("node:assert/strict");
const { SYNTHETIC_CASES, findCase } = require("../app/shared/cases.js");
const { buildClinicianSummary } = require("../app/shared/summary.js");

test("shared synthetic cases are available to browser and sample generation", () => {
  assert.equal(SYNTHETIC_CASES.length, 5);
  assert.equal(findCase("synthetic-emptying-difficulty").shortLabel, "尿不太出來");
  assert.equal(findCase("synthetic-recurrent-infection-context").shortLabel, "Recurrent infection context");
  assert.equal(findCase("synthetic-hematuria-occult-blood").shortLabel, "血尿或健檢潛血");
  assert.equal(findCase("unknown-case").id, SYNTHETIC_CASES[0].id);
});

test("hematuria synthetic case covers the third Phase 0 priority flow", () => {
  const summary = buildClinicianSummary(findCase("synthetic-hematuria-occult-blood").answers);
  const text = [
    summary.chiefConcern,
    summary.symptomPattern,
    summary.clinicianReviewFlags.join(" "),
    summary.safetyNotice.join(" ")
  ].join(" ").toLowerCase();

  assert.ok(summary.activeModules.includes("hematuria"));
  assert.ok(summary.activeModules.includes("medication"));
  assert.match(text, /visible blood/);
  assert.match(text, /occult blood/);
  assert.match(text, /clots/);
  assert.doesNotMatch(text, /cancer/);
  assert.doesNotMatch(text, /risk score/);
  assert.doesNotMatch(text, /automatic exam ordering|autonomous exam ordering|order placed/);
});

test("each shared synthetic case can build a bounded clinician summary", () => {
  for (const sampleCase of SYNTHETIC_CASES) {
    const summary = buildClinicianSummary(sampleCase.answers);
    const text = [
      summary.chiefConcern,
      summary.symptomPattern,
      summary.handoffNote,
      summary.safetyNotice.join(" ")
    ].join(" ").toLowerCase();

    assert.equal(typeof summary.completionStatus.missingCount, "number");
    assert.match(text, /clinician review required|clinician must review/);
    assert.doesNotMatch(text, /likely/);
    assert.doesNotMatch(text, /probable/);
    assert.doesNotMatch(text, /take medication/);
  }
});
