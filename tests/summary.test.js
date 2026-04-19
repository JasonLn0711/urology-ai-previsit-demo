const test = require("node:test");
const assert = require("node:assert/strict");
const {
  buildClinicianSummary,
  clinicianFlags,
  missingFields,
  summaryToText
} = require("../app/shared/summary.js");

test("builds a clinician-readable synthetic summary", () => {
  const summary = buildClinicianSummary({
    symptomCategory: "Frequency or urgency",
    duration: "More than 1 month",
    severity: "Moderate",
    frequencyDay: "9 to 12 times",
    nocturia: "3 or more times",
    leak: "No",
    painBurning: "No",
    blood: "No",
    fever: "No",
    unableToUrinate: "No",
    medications: "Blood pressure medicine; exact name unknown",
    language: "Mandarin with Taiwanese preferred",
    phoneComfort: "Needs large buttons",
    supportNeeds: "May need nurse help reviewing answers",
    notes: "Patient worries about waking up repeatedly at night."
  });

  assert.equal(summary.chiefConcern, "Frequency or urgency");
  assert.match(summary.symptomPattern, /9 to 12 times/);
  assert.deepEqual(summary.missingInformation, ["No required MVP fields missing."]);
  assert.match(summaryToText(summary), /A clinician must review all information/);
});

test("shows missing information prompts", () => {
  const missing = missingFields({
    symptomCategory: "Leakage",
    duration: "",
    severity: "",
    frequencyDay: "",
    nocturia: "",
    painBurning: "",
    blood: "",
    fever: "",
    unableToUrinate: "",
    medications: "",
    language: "",
    phoneComfort: ""
  });

  assert.ok(missing.includes("duration"));
  assert.ok(missing.includes("current medicines or relevant medicine uncertainty"));
  assert.ok(missing.includes("preferred language"));
});

test("uses neutral clinician-review flags", () => {
  const flags = clinicianFlags({
    unableToUrinate: "Yes",
    blood: "Yes",
    fever: "Yes",
    painBurning: "Yes"
  });

  assert.deepEqual(flags, [
    "Reports being unable to urinate.",
    "Reports blood in urine.",
    "Reports fever or chills.",
    "Reports pain or burning with urination."
  ]);
});

