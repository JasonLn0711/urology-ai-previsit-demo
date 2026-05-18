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
    assert.match(summary.soapDraft.title, /^Case \d - /);
    assert.equal(summary.soapDraft.format, "case-report");
    assert.match(summary.soapDraft.narrative, /Past history:/);
    assert.match(summary.soapDraft.narrative, /Medication:/);
    assert.match(summary.soapDraft.narrative, /Physical examination:/);
    assert.match(summary.soapDraft.narrative, /Assessment:/);
    assert.match(summary.soapDraft.narrative, /Plan:/);
    assert.equal(summary.soapDraft.caseStudies.length, 5);
    assert.match(summary.soapDraft.caseStudies[0].narrative, /65-year-old male presents with urinary frequency/);
    assert.ok(summary.soapDraft.subjective.length >= 4);
    assert.ok(summary.soapDraft.objective.length >= 4);
    assert.ok(summary.soapDraft.assessment.length >= 2);
    assert.ok(summary.soapDraft.plan.length >= 2);
    assert.match(text, /醫療人員確認|臨床使用前必須由醫療人員確認/);
    assert.match(text, /s - subjective/);
    assert.match(text, /o - objective/);
    assert.match(text, /a - assessment/);
    assert.match(text, /p - plan/);
    assert.doesNotMatch(text, /likely infection|probable cancer|take medication|diagnosed with|you have/);
  }
});

test("hematuria case stays observational and activates hematuria context", () => {
  const summary = buildClinicianSummary(findCase("synthetic-hematuria-occult-blood").answers);
  const text = summaryToText(summary).toLowerCase();

  assert.ok(summary.activeModules.includes("hematuria"));
  assert.ok(summary.activeModules.includes("medication"));
  assert.match(text, /可見血尿|血尿/);
  assert.match(text, /occult blood/);
  assert.doesNotMatch(text, /probable cancer|risk score|order placed/);
});

test("supports multiple selected main urinary concerns", () => {
  const summary = buildClinicianSummary({
    filledBy: "Patient self-filled",
    chiefConcern: ["Leakage", "Visible blood or clots"],
    duration: "1 to 7 days",
    botherScore: "6",
    daytimeFrequencyChange: "No",
    nocturiaCount: "1 time",
    urgency: "No",
    leakage: "Yes",
    painBurning: "No",
    visibleBlood: "Yes",
    unableToUrinate: "No",
    systemicSymptoms: ["None of these"],
    medicationListStatus: "Can provide list",
    leakageFrequency: "Weekly",
    leakageAmount: "Small amount",
    leakageTriggers: ["Before reaching toilet"],
    containmentProducts: "Pads or liners",
    hematuriaPattern: "One time",
    bloodClots: "No"
  });

  assert.equal(summary.chiefConcern, "漏尿、可見血尿或血塊");
  assert.ok(summary.activeModules.includes("leakage"));
  assert.ok(summary.activeModules.includes("hematuria"));
});
