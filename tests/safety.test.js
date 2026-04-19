const test = require("node:test");
const assert = require("node:assert/strict");
const { buildClinicianSummary, summaryToText } = require("../app/shared/summary.js");

test("summary does not contain diagnosis or treatment claims", () => {
  const summary = buildClinicianSummary({
    symptomCategory: "Visible blood",
    duration: "Today",
    severity: "Severe",
    frequencyDay: "More than 12 times",
    nocturia: "3 or more times",
    leak: "Yes",
    painBurning: "Yes",
    blood: "Yes",
    fever: "Yes",
    unableToUrinate: "Yes",
    medications: "Synthetic medication list unknown",
    language: "Mandarin",
    phoneComfort: "Prefer staff help",
    supportNeeds: "Nurse-assisted mode",
    notes: "Synthetic severe concern."
  });
  const text = summaryToText(summary).toLowerCase();

  assert.doesNotMatch(text, /you have/);
  assert.doesNotMatch(text, /diagnosed with/);
  assert.doesNotMatch(text, /probable/);
  assert.doesNotMatch(text, /likely/);
  assert.doesNotMatch(text, /take medication/);
  assert.match(text, /does not diagnose or recommend treatment/);
  assert.match(text, /clinician must review/);
});

test("safety notice is always present", () => {
  const summary = buildClinicianSummary({});
  assert.deepEqual(summary.safetyNotice, [
    "This demo does not diagnose or recommend treatment.",
    "A clinician must review all information.",
    "Use synthetic data only."
  ]);
});

