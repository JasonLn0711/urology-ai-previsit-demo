const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const sampleDir = path.join(__dirname, "..", "docs", "samples");

test("sample artifacts are present for meeting demos", () => {
  const files = fs.readdirSync(sampleDir).sort();

  assert.ok(files.includes("README.md"));
  assert.ok(files.some((file) => file.startsWith("clinician-summary-")));
  assert.ok(files.some((file) => file.startsWith("reviewer-record-")));
  assert.ok(files.includes("reviewer-record-continue.md"));
  assert.ok(files.includes("reviewer-record-pause.md"));
  assert.ok(fs.existsSync(path.join(__dirname, "..", "docs", "mvp-review-packet.md")));
  assert.ok(fs.existsSync(path.join(__dirname, "..", "docs", "meeting-capture-template.md")));
  assert.ok(fs.existsSync(path.join(__dirname, "..", "docs", "post-review-action-playbook.md")));
  assert.ok(fs.existsSync(path.join(__dirname, "..", "docs", "reviews", "2026-04-23-urology-review", "pre-meeting-readiness.md")));
  assert.ok(fs.existsSync(path.join(__dirname, "..", "docs", "reviews", "2026-04-23-urology-review", "reviewer-one-page-handout.md")));
  assert.ok(fs.existsSync(path.join(__dirname, "..", "docs", "reviews", "2026-04-23-urology-review", "post-review-closeout.md")));
  assert.ok(fs.existsSync(path.join(__dirname, "..", "docs", "reviews", "2026-04-23-urology-review", "artifact-starters", "README.md")));
  assert.ok(fs.existsSync(path.join(__dirname, "..", "docs", "reviews", "2026-04-23-urology-review", "decision-capture.md")));
  assert.ok(fs.existsSync(path.join(__dirname, "..", "scripts", "check-review-closeout.js")));
  assert.ok(fs.existsSync(path.join(__dirname, "..", "scripts", "check-selected-artifact.js")));
  assert.ok(fs.existsSync(path.join(__dirname, "..", "docs", "workflow-rehearsal.md")));
});

test("sample artifacts keep safety boundaries explicit", () => {
  const files = fs.readdirSync(sampleDir).filter((file) => file.endsWith(".md"));
  const combined = files
    .map((file) => fs.readFileSync(path.join(sampleDir, file), "utf8"))
    .join("\n")
    .toLowerCase();

  assert.match(combined, /synthetic/);
  assert.match(combined, /does not diagnose/);
  assert.match(combined, /no treatment advice|does not diagnose, triage, or recommend treatment/);
  assert.doesNotMatch(combined, /likely infection/);
  assert.doesNotMatch(combined, /probable cancer/);
  assert.doesNotMatch(combined, /take medication/);
});

test("workflow rehearsal covers all synthetic cases without clinical advice", () => {
  const rehearsal = fs.readFileSync(path.join(__dirname, "..", "docs", "workflow-rehearsal.md"), "utf8");

  assert.match(rehearsal, /synthetic-frequency-older-adult/);
  assert.match(rehearsal, /synthetic-emptying-difficulty/);
  assert.match(rehearsal, /synthetic-incomplete-leakage/);
  assert.match(rehearsal, /synthetic-recurrent-infection-context/);
  assert.match(rehearsal, /synthetic-hematuria-occult-blood/);
  assert.match(rehearsal, /visible-blood or occult-blood context stays descriptive/);
  assert.match(rehearsal, /Patient Flow Check/);
  assert.match(rehearsal, /Nurse Workflow Cues/);
  assert.match(rehearsal, /Reviewer Questions/);
  assert.match(rehearsal, /does not diagnose, triage, or recommend treatment/);
  assert.doesNotMatch(rehearsal.toLowerCase(), /likely infection/);
  assert.doesNotMatch(rehearsal.toLowerCase(), /probable cancer/);
  assert.doesNotMatch(rehearsal.toLowerCase(), /take medication/);
});

test("review packet provides decision criteria without clinical advice", () => {
  const packet = fs.readFileSync(path.join(__dirname, "..", "docs", "mvp-review-packet.md"), "utf8");
  const lower = packet.toLowerCase();

  assert.match(packet, /Non-Negotiable Boundary/);
  assert.match(packet, /Artifact Map/);
  assert.match(packet, /meeting-capture-template\.md/);
  assert.match(packet, /post-review-action-playbook\.md/);
  assert.match(packet, /2026-04-23-urology-review\/pre-meeting-readiness\.md/);
  assert.match(packet, /2026-04-23-urology-review\/reviewer-one-page-handout\.md/);
  assert.match(packet, /2026-04-23-urology-review\/post-review-closeout\.md/);
  assert.match(packet, /2026-04-23-urology-review\/artifact-starters\//);
  assert.match(packet, /2026-04-23-urology-review\/decision-capture\.md/);
  assert.match(packet, /npm run review:closeout/);
  assert.match(packet, /Decision Scorecard/);
  assert.match(packet, /Run The Four Cases/);
  assert.match(packet, /Recurrent infection context/);
  assert.match(packet, /Continue/);
  assert.match(packet, /Revise/);
  assert.match(packet, /Narrow/);
  assert.match(packet, /Pause/);
  assert.match(packet, /Hard Stop Conditions/);
  assert.match(packet, /workflow-rehearsal\.md/);
  assert.match(packet, /Reviewer workbench/);
  assert.doesNotMatch(lower, /likely infection/);
  assert.doesNotMatch(lower, /probable cancer/);
  assert.doesNotMatch(lower, /take medication/);
});

test("browser review packet routes reviewers to the demo artifacts", () => {
  const packetPage = fs.readFileSync(
    path.join(__dirname, "..", "app", "review-packet", "index.html"),
    "utf8"
  );
  const lower = packetPage.toLowerCase();

  assert.match(packetPage, /MVP review packet/);
  assert.match(packetPage, /href="\.\.\/patient-demo\/"/);
  assert.match(packetPage, /href="\.\.\/nurse-workbench\/"/);
  assert.match(packetPage, /href="\.\.\/clinician-summary\/"/);
  assert.match(packetPage, /href="\.\.\/visit-packet\/"/);
  assert.match(packetPage, /href="\.\.\/reviewer-workbench\/"/);
  assert.match(packetPage, /docs\/workflow-rehearsal\.md/);
  assert.match(packetPage, /docs\/meeting-capture-template\.md/);
  assert.match(packetPage, /docs\/post-review-action-playbook\.md/);
  assert.match(packetPage, /docs\/reviews\/2026-04-23-urology-review\/pre-meeting-readiness\.md/);
  assert.match(packetPage, /docs\/reviews\/2026-04-23-urology-review\/reviewer-one-page-handout\.md/);
  assert.match(packetPage, /docs\/reviews\/2026-04-23-urology-review\/post-review-closeout\.md/);
  assert.match(packetPage, /docs\/reviews\/2026-04-23-urology-review\/artifact-starters\//);
  assert.match(packetPage, /docs\/reviews\/2026-04-23-urology-review\/decision-capture\.md/);
  assert.match(packetPage, /docs\/mvp-review-packet\.md/);
  assert.match(packetPage, /Four-case walkthrough/);
  assert.match(packetPage, /No diagnosis, triage, or treatment advice\./);
  assert.match(packetPage, /Clinician review remains required\./);
  assert.match(packetPage, /Continue/);
  assert.match(packetPage, /Revise/);
  assert.match(packetPage, /Narrow/);
  assert.match(packetPage, /Pause/);
  assert.doesNotMatch(lower, /likely infection/);
  assert.doesNotMatch(lower, /probable cancer/);
  assert.doesNotMatch(lower, /take medication/);
});

test("pre-meeting readiness checklist routes the live review stack", () => {
  const readiness = fs.readFileSync(
    path.join(__dirname, "..", "docs", "reviews", "2026-04-23-urology-review", "pre-meeting-readiness.md"),
    "utf8"
  );
  const packageJson = fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8");
  const lower = readiness.toLowerCase();

  assert.match(readiness, /npm run meeting:check/);
  assert.match(readiness, /http:\/\/localhost:4173\/app\/review-packet\//);
  assert.match(readiness, /decision-capture\.md/);
  assert.match(readiness, /pending review/);
  assert.match(packageJson, /"meeting:check": "node scripts\/check-meeting-readiness\.js"/);
  assert.doesNotMatch(lower, /likely infection/);
  assert.doesNotMatch(lower, /probable cancer/);
  assert.doesNotMatch(lower, /take medication/);
});

test("reviewer handout keeps the meeting decision bounded", () => {
  const handout = fs.readFileSync(
    path.join(__dirname, "..", "docs", "reviews", "2026-04-23-urology-review", "reviewer-one-page-handout.md"),
    "utf8"
  );
  const lower = handout.toLowerCase();

  assert.match(handout, /Review Goal/);
  assert.match(handout, /Non-Negotiable Boundary/);
  assert.match(handout, /Four Cases To Scan/);
  assert.match(handout, /Decision Choices/);
  assert.match(handout, /Evidence To Capture/);
  assert.match(handout, /Frequent urination at night/);
  assert.match(handout, /Recurrent infection context/);
  assert.match(handout, /Clinician review remains required/);
  assert.doesNotMatch(lower, /likely infection/);
  assert.doesNotMatch(lower, /probable cancer/);
  assert.doesNotMatch(lower, /take medication/);
});

test("post-review closeout defines the after-meeting artifact gate", () => {
  const closeout = fs.readFileSync(
    path.join(__dirname, "..", "docs", "reviews", "2026-04-23-urology-review", "post-review-closeout.md"),
    "utf8"
  );
  const packageJson = fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8");
  const lower = closeout.toLowerCase();

  assert.match(closeout, /npm run review:closeout/);
  assert.match(closeout, /npm run artifact:check/);
  assert.match(closeout, /Status: complete/);
  assert.match(closeout, /pending follow-up/);
  assert.match(closeout, /one smallest next artifact/);
  assert.match(closeout, /post-review-action-playbook\.md/);
  assert.match(packageJson, /"review:closeout": "node scripts\/check-review-closeout\.js"/);
  assert.match(packageJson, /"artifact:check": "node scripts\/check-selected-artifact\.js"/);
  assert.doesNotMatch(lower, /likely infection/);
  assert.doesNotMatch(lower, /probable cancer/);
  assert.doesNotMatch(lower, /take medication/);
});

test("artifact starters are evidence-gated and match closeout decisions", () => {
  const starterDir = path.join(__dirname, "..", "docs", "reviews", "2026-04-23-urology-review", "artifact-starters");
  const files = [
    "README.md",
    "revised-question-tree.md",
    "one-page-summary-mockup.md",
    "assisted-workflow-test.md",
    "pause-note-with-rejected-assumptions.md"
  ];
  const combined = files.map((file) => fs.readFileSync(path.join(starterDir, file), "utf8")).join("\n");
  const lower = combined.toLowerCase();

  for (const file of files) {
    assert.ok(fs.existsSync(path.join(starterDir, file)));
  }
  assert.match(combined, /npm run review:closeout/);
  assert.match(combined, /npm run artifact:check/);
  assert.match(combined, /TBD from reviewer evidence/);
  assert.match(combined, /Synthetic data only/);
  assert.match(combined, /No diagnosis/);
  assert.match(combined, /No triage/);
  assert.match(combined, /No treatment advice/);
  assert.match(combined, /revised question tree/);
  assert.match(combined, /one-page summary mockup/);
  assert.match(combined, /assisted workflow test/);
  assert.match(combined, /pause note with rejected assumptions/);
  assert.doesNotMatch(lower, /likely infection/);
  assert.doesNotMatch(lower, /probable cancer/);
  assert.doesNotMatch(lower, /take medication/);
});

test("meeting capture template preserves bounded review outputs", () => {
  const capture = fs.readFileSync(path.join(__dirname, "..", "docs", "meeting-capture-template.md"), "utf8");
  const lower = capture.toLowerCase();

  assert.match(capture, /Four-Case Evidence/);
  assert.match(capture, /Decision Signals/);
  assert.match(capture, /Hard Stop Notes/);
  assert.match(capture, /post-review-action-playbook\.md/);
  assert.match(capture, /Recurrent infection context/);
  assert.doesNotMatch(lower, /likely infection/);
  assert.doesNotMatch(lower, /probable cancer/);
  assert.doesNotMatch(lower, /take medication/);
});

test("post-review action playbook maps decisions to bounded artifacts", () => {
  const playbook = fs.readFileSync(path.join(__dirname, "..", "docs", "post-review-action-playbook.md"), "utf8");
  const lower = playbook.toLowerCase();

  assert.match(playbook, /Decision-To-Artifact Map/);
  assert.match(playbook, /2026-04-23-urology-review\/decision-capture\.md/);
  assert.match(playbook, /Continue/);
  assert.match(playbook, /Revise/);
  assert.match(playbook, /Narrow/);
  assert.match(playbook, /Pause/);
  assert.match(playbook, /one next artifact/);
  assert.match(playbook, /npm run review:closeout/);
  assert.match(playbook, /npm run artifact:check/);
  assert.match(playbook, /Hard Stop/);
  assert.doesNotMatch(lower, /likely infection/);
  assert.doesNotMatch(lower, /probable cancer/);
  assert.doesNotMatch(lower, /take medication/);
});

test("dated review workspace stays pending until reviewer evidence exists", () => {
  const capture = fs.readFileSync(
    path.join(__dirname, "..", "docs", "reviews", "2026-04-23-urology-review", "decision-capture.md"),
    "utf8"
  );
  const readme = fs.readFileSync(
    path.join(__dirname, "..", "docs", "reviews", "2026-04-23-urology-review", "README.md"),
    "utf8"
  );
  const combined = `${capture}\n${readme}`;
  const lower = combined.toLowerCase();

  assert.match(capture, /Status: pending (review|follow-up)/);
  assert.match(capture, /Frequent urination at night/);
  assert.match(capture, /Recurrent infection context/);
  assert.match(capture, /Selected artifact: (pending review|not selected - pending follow-up)/);
  assert.match(readme, /Do not pre-fill reviewer conclusions/);
  assert.doesNotMatch(lower, /decision: continue/);
  assert.doesNotMatch(lower, /decision: revise/);
  assert.doesNotMatch(lower, /decision: narrow/);
  assert.doesNotMatch(lower, /decision: pause/);
  assert.doesNotMatch(lower, /likely infection/);
  assert.doesNotMatch(lower, /probable cancer/);
  assert.doesNotMatch(lower, /take medication/);
});
