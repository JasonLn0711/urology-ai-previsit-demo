const test = require("node:test");
const assert = require("node:assert/strict");
const { buildClinicianSummary, summaryToText } = require("../app/shared/summary.js");

test("summary does not contain diagnosis or treatment claims", () => {
  const summary = buildClinicianSummary({
    filledBy: "Nurse-assisted",
    chiefConcern: "Visible blood or clots",
    duration: "Today",
    botherScore: "9",
    daytimeFrequencyChange: "Yes",
    nocturiaCount: "3 or more times",
    urgency: "Yes",
    leakage: "Yes",
    painBurning: "Yes",
    visibleBlood: "Yes",
    bloodClots: "Yes",
    systemicSymptoms: ["Fever", "Chills", "Side or back pain"],
    unableToUrinate: "Yes",
    currentlyUnableToUrinate: "No",
    medicationListStatus: "Not sure",
    daytimeFrequencyCount: "More than 12 times",
    urgencyFrequency: "Several times a day",
    bladderDiaryFeasible: "Not sure",
    leakageFrequency: "Daily",
    leakageAmount: "Moderate amount",
    leakageTriggers: ["Before reaching toilet"],
    containmentProducts: "Pads or liners",
    hematuriaPattern: "More than once",
    painFrequency: "Only while urinating",
    infectionEpisodeHistory: "Not sure",
    flankPainScore: "7 to 10",
    medicationAssist: "Yes",
    language: "Mandarin",
    deviceComfort: "Prefer staff help",
    supportPreference: "Nurse-assisted mode",
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
