const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("v1 product console is the safe local MVP entrypoint", () => {
  const html = read("app/v1/index.html");
  const script = read("app/v1/v1.js");
  const packet = read("docs/v1-mvp-handoff-packet.md");
  const combined = `${html}\n${script}\n${packet}`.toLowerCase();

  assert.match(html, /Urology AI Previsit v1 MVP/);
  assert.match(html, /safe local MVP product preview/);
  assert.match(html, /\.\.\/shared\/summary\.js/);
  assert.match(html, /\.\.\/shared\/cases\.js/);
  assert.match(html, /\.\/v1\.js/);
  assert.ok(html.indexOf("../shared/summary.js") < html.indexOf("../shared/cases.js"));
  assert.ok(html.indexOf("../shared/cases.js") < html.indexOf("./v1.js"));
  assert.match(combined, /synthetic data only/);
  assert.match(combined, /not for clinical use/);
  assert.match(combined, /physician review required/);
  assert.match(combined, /regulatory status not determined/);
});

test("v1 includes physician summary, exam-prep mockup, and mock API export", () => {
  const script = read("app/v1/v1.js");

  assert.match(script, /function buildExamPrepReminders/);
  assert.match(script, /EXAM_PREP_RULES/);
  assert.match(script, /matchingExamPrepRules/);
  assert.match(script, /function buildMockPayload/);
  assert.match(script, /summaryToText/);
  assert.match(script, /integrationMode: "mock_export_only"/);
  assert.match(script, /liveHisWriteback: false/);
  assert.match(script, /initialVisitNoIdOrBirthday: true/);
  assert.match(script, /sourceDerivedExamPrepRows/);
  assert.match(script, /orderPlaced: false/);
  assert.match(script, /physicianConfirmedOnly: true/);
});

test("v1 carries Hsu QA requirements without collecting real identifiers", () => {
  const script = read("app/v1/v1.js");
  const packet = read("docs/v1-mvp-handoff-packet.md");
  const combined = `${script}\n${packet}`;

  assert.match(combined, /陽明小幫手/);
  assert.match(combined, /ID number or birthday/);
  assert.match(combined, /12-complaint/);
  assert.match(combined, /血尿或健檢發現潛血/);
  assert.match(combined, /小便困難或尿不出來/);
  assert.match(combined, /physician\/nurse confirmation/);
  assert.match(combined, /realIdentifiersCollected: false/);
  assert.match(combined, /realQueueHandling: false/);
});

test("v1 handoff packet keeps strategy as gates instead of clinical claims", () => {
  const packet = read("docs/v1-mvp-handoff-packet.md");
  const lower = packet.toLowerCase();

  assert.match(packet, /Decision Gates/);
  assert.match(packet, /Funding/);
  assert.match(packet, /IP/);
  assert.match(packet, /HIS/);
  assert.match(packet, /Privacy\/security/);
  assert.match(packet, /Regulatory/);
  assert.match(packet, /Research/);
  assert.match(packet, /TFDA AI\/ML SaMD guidance/);
  assert.match(packet, /FDA CDS FAQ/);
  assert.doesNotMatch(lower, /not a medical device/);
  assert.doesNotMatch(lower, /tfda approved/);
  assert.doesNotMatch(lower, /fda approved/);
  assert.doesNotMatch(lower, /likely infection/);
  assert.doesNotMatch(lower, /probable cancer/);
  assert.doesNotMatch(lower, /take medication/);
});
