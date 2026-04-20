const test = require("node:test");
const assert = require("node:assert/strict");
const {
  activeModules,
  buildClinicianSummary,
  clinicianFlags,
  completionStatus,
  missingFields,
  requiredFieldsForAnswers,
  summaryToText
} = require("../app/shared/summary.js");

test("builds a clinician-readable summary from governed MVP fields", () => {
  const summary = buildClinicianSummary({
    filledBy: "Patient self-filled",
    chiefConcern: "Frequency / nocturia / urgency",
    duration: "More than 1 month",
    botherScore: "7",
    daytimeFrequencyChange: "Yes",
    nocturiaCount: "3 or more times",
    urgency: "Yes",
    leakage: "No",
    painBurning: "No",
    visibleBlood: "No",
    unableToUrinate: "No",
    systemicSymptoms: ["None of these"],
    medicationListStatus: "Partial list only",
    daytimeFrequencyCount: "9 to 12 times",
    urgencyFrequency: "Most days",
    fluidCaffeineContext: ["Caffeinated drinks most days", "Drinks a lot near bedtime"],
    bladderDiaryFeasible: "Yes, with written instructions",
    medicationAssist: "Yes",
    language: "Mandarin with Taiwanese preferred",
    deviceComfort: "Needs large buttons",
    supportPreference: "Needs review before clinician enters",
    notes: "Patient worries about waking up repeatedly at night."
  });

  assert.equal(summary.chiefConcern, "Frequency / nocturia / urgency");
  assert.ok(summary.activeModules.includes("storage"));
  assert.ok(summary.activeModules.includes("medication"));
  assert.match(summary.symptomPattern, /Storage/);
  assert.match(summary.symptomPattern, /9 to 12 times/);
  assert.deepEqual(summary.missingInformation, ["No required MVP fields missing."]);
  assert.equal(summary.completionStatus.tone, "ready");
  assert.match(summaryToText(summary), /A clinician must review all information/);
});

test("shows missing prompts for core and conditional module fields", () => {
  const missing = missingFields({
    filledBy: "Family or helper-assisted",
    chiefConcern: "Leakage",
    duration: "",
    botherScore: "4",
    daytimeFrequencyChange: "",
    nocturiaCount: "Not sure",
    urgency: "Not sure",
    leakage: "Yes",
    painBurning: "",
    visibleBlood: "No",
    unableToUrinate: "No",
    systemicSymptoms: [],
    medicationListStatus: "",
    leakageFrequency: "Weekly",
    leakageTriggers: ["Before reaching toilet"],
    containmentProducts: "Pads or liners"
  });

  assert.ok(missing.includes("symptom duration"));
  assert.ok(missing.includes("daytime urination change"));
  assert.ok(missing.includes("pain or burning with urination"));
  assert.ok(missing.includes("fever, chills, or side/back pain"));
  assert.ok(missing.includes("medication list readiness"));
  assert.ok(missing.includes("leakage amount"));
});

test("activates only relevant conditional modules", () => {
  const modules = activeModules({
    chiefConcern: "Difficulty emptying or weak stream",
    daytimeFrequencyChange: "No",
    nocturiaCount: "0 times",
    urgency: "No",
    leakage: "No",
    visibleBlood: "No",
    painBurning: "No",
    unableToUrinate: "Yes",
    medicationListStatus: "Can provide list"
  });

  assert.equal(modules.voiding, true);
  assert.equal(modules.storage, false);
  assert.equal(modules.leakage, false);
  assert.equal(modules.hematuria, false);
});

test("does not open full symptom modules from not-sure answers alone", () => {
  const summary = buildClinicianSummary({
    filledBy: "Patient self-filled",
    chiefConcern: "Other urinary concern",
    duration: "Not sure",
    botherScore: "Not sure",
    daytimeFrequencyChange: "Not sure",
    nocturiaCount: "Not sure",
    urgency: "Not sure",
    leakage: "Not sure",
    painBurning: "Not sure",
    visibleBlood: "Not sure",
    unableToUrinate: "Not sure",
    systemicSymptoms: ["Not sure"],
    medicationListStatus: "Can provide list"
  });

  assert.deepEqual(summary.activeModules, ["core only"]);
  assert.ok(summary.nurseCues.some((cue) => cue.includes("not sure")));
});

test("uses neutral priority review statements", () => {
  const flags = clinicianFlags({
    unableToUrinate: "Yes",
    currentlyUnableToUrinate: "Yes",
    visibleBlood: "Yes",
    bloodClots: "Yes",
    systemicSymptoms: ["Fever", "Chills", "Side or back pain"],
    painBurning: "Yes"
  });

  assert.deepEqual(flags, [
    "Reports currently being unable to urinate.",
    "Reports visible blood or clots in urine.",
    "Reports blood clots.",
    "Reports fever.",
    "Reports chills.",
    "Reports side or back pain.",
    "Reports pain or burning with urination."
  ]);
});

test("reports dynamic MVP completion status without clinical conclusions", () => {
  const answers = {
    filledBy: "Patient self-filled",
    chiefConcern: "Visible blood or clots",
    visibleBlood: "Yes"
  };
  const status = completionStatus(answers);
  const required = requiredFieldsForAnswers(answers).map(([field]) => field);

  assert.equal(status.tone, "needs-review");
  assert.ok(status.missingCount > 0);
  assert.ok(required.includes("hematuriaPattern"));
  assert.ok(required.includes("bloodClots"));
  assert.match(status.label, /MVP fields still missing/);
});
