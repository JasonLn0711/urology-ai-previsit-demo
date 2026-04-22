const test = require("node:test");
const assert = require("node:assert/strict");
const {
  activeModules,
  buildClinicianSummary,
  buildNurseChecklist,
  buildVisitPacket,
  clinicianFlags,
  completionStatus,
  missingFields,
  requiredFieldsForAnswers,
  sourceAttributionSummary,
  summaryToText,
  visitPacketToText
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
    relevantComorbidities: ["Not sure"],
    diureticAnticoagulantAwareness: "Not sure",
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

test("keeps governed conditional context fields visible for storage and medication cues", () => {
  const required = requiredFieldsForAnswers({
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
    medicationListStatus: "Can provide list"
  }).map(([field]) => field);

  assert.ok(required.includes("fluidCaffeineContext"));
  assert.ok(required.includes("medicationAssist"));
  assert.ok(required.includes("relevantComorbidities"));
  assert.ok(required.includes("diureticAnticoagulantAwareness"));
});

test("routes recurrent infection concern to pain and medication context modules", () => {
  const modules = activeModules({
    chiefConcern: "Recurrent infection concern",
    daytimeFrequencyChange: "No",
    nocturiaCount: "1 time",
    urgency: "No",
    leakage: "No",
    painBurning: "No",
    visibleBlood: "No",
    unableToUrinate: "No",
    systemicSymptoms: ["None of these"],
    medicationListStatus: "Can provide list"
  });

  assert.equal(modules.pain, true);
  assert.equal(modules.medication, true);
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

test("builds nurse supplemental questions from missing fields without diagnosis", () => {
  const checklist = buildNurseChecklist({
    filledBy: "Family or helper-assisted",
    chiefConcern: "Leakage",
    leakage: "Yes",
    leakageFrequency: "Weekly",
    visibleBlood: "No",
    unableToUrinate: "No",
    systemicSymptoms: [],
    medicationListStatus: ""
  });

  assert.ok(checklist.supplementalQuestions.length > 0);
  assert.ok(checklist.supplementalQuestions.some((item) => item.field === "leakageAmount"));
  assert.ok(checklist.sourceNotes.some((note) => note.includes("家屬")));
  assert.doesNotMatch(
    checklist.supplementalQuestions.map((item) => `${item.ask} ${item.why}`).join("\n"),
    /診斷為|治療建議|分流|建議用藥|需要手術/
  );
});

test("keeps field-level source attribution visible for family-assisted answers", () => {
  const answers = {
    filledBy: "Family or helper-assisted",
    chiefConcern: "Leakage",
    leakage: "Yes",
    botherScore: "7",
    visibleBlood: "No",
    unableToUrinate: "No",
    systemicSymptoms: ["None of these"],
    medicationListStatus: "Partial list only",
    sourceByField: {
      filledBy: "declared_on_entry",
      leakage: "family_observation",
      botherScore: "patient_with_family_operator",
      medicationListStatus: "nurse_supplement"
    }
  };
  const summary = buildClinicianSummary(answers);
  const leakageSource = summary.fieldSources.find((item) => item.field === "leakage");
  const medicationSource = summary.fieldSources.find((item) => item.field === "medicationListStatus");

  assert.equal(leakageSource.source, "family_observation");
  assert.equal(medicationSource.source, "nurse_supplement");
  assert.ok(summary.sourceNotes.some((note) => note.includes("家屬")));
  assert.ok(sourceAttributionSummary(answers).some((line) => line.includes("家屬")));
});

test("builds a role-separated visit packet without clinical advice", () => {
  const packet = buildVisitPacket({
    filledBy: "Family or helper-assisted",
    chiefConcern: "Leakage",
    duration: "1 to 4 weeks",
    botherScore: "6",
    daytimeFrequencyChange: "Not sure",
    nocturiaCount: "2 times",
    urgency: "Not sure",
    leakage: "Yes",
    painBurning: "No",
    visibleBlood: "No",
    unableToUrinate: "No",
    systemicSymptoms: ["None of these"],
    medicationListStatus: "Partial list only",
    leakageFrequency: "Weekly",
    leakageAmount: "Small amount",
    leakageTriggers: ["Before reaching toilet"],
    containmentProducts: "Pads or liners",
    sourceByField: {
      filledBy: "declared_on_entry",
      leakage: "family_observation",
      leakageAmount: "nurse_supplement"
    }
  });
  const text = visitPacketToText(packet).toLowerCase();

  assert.equal(packet.patientPage.audience, "patient-family");
  assert.equal(packet.nursePage.audience, "nurse");
  assert.equal(packet.clinicianPage.audience, "clinician");
  assert.ok(packet.nursePage.supplementalQuestions.length >= 0);
  assert.match(text, /patient and family confirmation/i);
  assert.match(text, /nurse missing-information repair/i);
  assert.match(text, /clinician previsit scan/i);
  assert.doesNotMatch(text, /likely infection|probable cancer|take medication/);
});
