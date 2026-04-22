const test = require("node:test");
const assert = require("node:assert/strict");
const { SYNTHETIC_CASES, findCase } = require("../app/shared/cases.js");
const { buildClinicianSummary } = require("../app/shared/summary.js");

test("shared synthetic cases are available to browser and sample generation", () => {
  assert.equal(SYNTHETIC_CASES.length, 4);
  assert.equal(findCase("synthetic-emptying-difficulty").shortLabel, "尿不太出來");
  assert.equal(findCase("synthetic-recurrent-infection-context").shortLabel, "Recurrent infection context");
  assert.equal(findCase("unknown-case").id, SYNTHETIC_CASES[0].id);
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
