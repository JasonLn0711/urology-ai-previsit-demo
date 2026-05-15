const test = require("node:test");
const assert = require("node:assert/strict");
const { assertSafeLanguage } = require("../../core/safety");
const { buildClinicianSummary, summaryToText } = require("../../core/summary");

test("safety enforcement rejects diagnostic or treatment-claim wording", () => {
  assert.throws(
    () => assertSafeLanguage("This is likely infection; take medication.", "test"),
    /Unsafe clinical wording/
  );
});

test("summary output includes safety envelope and physician review flag", () => {
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

  assert.equal(summary.requiresPhysicianReview, true);
  assert.match(text, /不可作為臨床使用/);
  assert.match(text, /不做診斷、分流、治療建議或檢查開立/);
  assert.match(text, /臨床使用前必須由醫療人員確認/);
  assert.doesNotMatch(text, /you have|diagnosed with|likely|probable|take medication/);
});
