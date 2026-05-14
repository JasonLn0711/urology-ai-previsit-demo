const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { findCase } = require("../../data/synthetic_cases");
const {
  buildCanonicalRecord,
  buildNurseChecklist,
  buildVisitPacket,
  transformForRole
} = require("../../core/role_transform");
const { validateIntakeRecord } = require("../../data/schema/intake-record");

const root = path.resolve(__dirname, "..", "..");

test("all roles read the same canonical data structure", () => {
  const answers = findCase("synthetic-incomplete-leakage").answers;
  const record = buildCanonicalRecord(answers);
  const validation = validateIntakeRecord(record);

  assert.equal(validation.valid, true, validation.errors.join("; "));
  for (const role of ["patient", "nurse", "clinician", "reviewer"]) {
    const transformed = transformForRole(record, role);
    assert.equal(transformed.role, role);
    assert.ok(transformed.view);
  }
});

test("nurse and clinician outputs differ without mutating core logic", () => {
  const answers = findCase("synthetic-incomplete-leakage").answers;
  const nurse = buildNurseChecklist(answers);
  const packet = buildVisitPacket(answers);

  assert.ok(nurse.supplementalQuestions.length > 0);
  assert.ok(packet.clinicianPage.priorityReviewFlags.length > 0);
  assert.equal(packet.patientPage.audience, "patient-family");
  assert.equal(packet.nursePage.audience, "nurse");
  assert.equal(packet.clinicianPage.audience, "clinician");
});

test("patient page does not expose staff-only navigation", () => {
  const html = fs.readFileSync(path.join(root, "app", "patient", "index.html"), "utf8");
  assert.doesNotMatch(html, /app\/nurse|app\/clinician|app\/reviewer|Nurse Workbench|Reviewer Workbench/);
});
