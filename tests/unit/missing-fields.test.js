const test = require("node:test");
const assert = require("node:assert/strict");
const {
  activeModules,
  completionStatus,
  missingFields,
  requiredFieldsForAnswers
} = require("../../core/missing_fields");

test("missing field detection includes core and conditional leakage fields", () => {
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

  assert.ok(missing.includes("症狀持續時間"));
  assert.ok(missing.includes("白天尿尿次數變化"));
  assert.ok(missing.includes("尿尿疼痛或灼熱"));
  assert.ok(missing.includes("發燒、發冷或腰側痛"));
  assert.ok(missing.includes("用藥資料準備狀態"));
  assert.ok(missing.includes("漏尿量"));
});

test("not-sure answers alone do not open full symptom modules", () => {
  const modules = activeModules({
    chiefConcern: "Other urinary concern",
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

  assert.deepEqual(modules, {
    storage: false,
    leakage: false,
    voiding: false,
    hematuria: false,
    pain: false,
    medication: false
  });
});

test("completion status reports dynamic required fields", () => {
  const answers = {
    filledBy: "Patient self-filled",
    chiefConcern: "Visible blood or clots",
    visibleBlood: "Yes"
  };
  const required = requiredFieldsForAnswers(answers).map(([field]) => field);
  const status = completionStatus(answers);

  assert.ok(required.includes("hematuriaPattern"));
  assert.ok(required.includes("bloodClots"));
  assert.equal(status.tone, "needs-review");
  assert.ok(status.missingCount > 0);
});
