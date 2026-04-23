#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { SYNTHETIC_CASES } = require("../app/shared/cases.js");
const { buildClinicianSummary, summaryToText } = require("../app/shared/summary.js");
const { buildReviewRecord, reviewRecordToText } = require("../app/shared/review.js");

const root = path.resolve(__dirname, "..");
const checks = [];

function relPath(...parts) {
  return path.join(root, ...parts);
}

function read(relativePath) {
  return fs.readFileSync(relPath(relativePath), "utf8");
}

function record(name, passed, detail = "") {
  checks.push({ name, passed: Boolean(passed), detail });
}

function contains(relativePath, text) {
  return read(relativePath).includes(text);
}

function indexOf(relativePath, text) {
  return read(relativePath).indexOf(text);
}

function assertFile(relativePath) {
  record(`file exists: ${relativePath}`, fs.existsSync(relPath(relativePath)));
}

function assertScriptCompiles(relativePath) {
  const result = spawnSync(process.execPath, ["-c", relPath(relativePath)], {
    encoding: "utf8"
  });
  record(
    `script compiles: ${relativePath}`,
    result.status === 0,
    result.stderr || result.stdout
  );
}

function walkFiles(startRelativePath) {
  const start = relPath(startRelativePath);
  if (!fs.existsSync(start)) return [];
  const stat = fs.statSync(start);
  if (stat.isFile()) return [start];

  const results = [];
  for (const entry of fs.readdirSync(start)) {
    const absolute = path.join(start, entry);
    const entryStat = fs.statSync(absolute);
    if (entryStat.isDirectory()) {
      results.push(...walkFiles(path.relative(root, absolute)));
    } else {
      results.push(absolute);
    }
  }
  return results;
}

function readRepoTextFiles() {
  const roots = ["README.md", "package.json", "app", "docs", "scripts", "tests"];
  return roots.flatMap(walkFiles).filter((file) => {
    return /\.(html|js|json|md|css)$/.test(file);
  });
}

function assertNoRepositoryText(pattern, label) {
  const hits = [];
  for (const file of readRepoTextFiles()) {
    const text = fs.readFileSync(file, "utf8");
    if (pattern.test(text)) {
      hits.push(path.relative(root, file));
    }
  }
  record(`no stale text: ${label}`, hits.length === 0, hits.join(", "));
}

function checkEntrypoints() {
  [
    "app/patient-demo/index.html",
    "app/patient-demo/app.js",
    "app/v1/index.html",
    "app/v1/styles.css",
    "app/v1/v1.js",
    "app/review-packet/index.html",
    "app/clinician-summary/index.html",
    "app/clinician-summary/clinician.js",
    "app/nurse-workbench/index.html",
    "app/nurse-workbench/nurse.js",
    "app/visit-packet/index.html",
    "app/visit-packet/visit-packet.js",
    "app/reviewer-workbench/index.html",
    "app/reviewer-workbench/reviewer.js",
    "app/shared/summary.js",
    "app/shared/cases.js",
    "app/shared/review.js",
    "assets/bladder-flow.svg",
    "docs/v1-mvp-handoff-packet.md",
    "docs/research/README.md",
    "docs/research/v1-phase-0-clinician-review-protocol.md",
    "docs/research/v1-phase0-review-session-script.md",
    "docs/research/v1-phase0-reviewer-ask.md",
    "docs/research/v1-phase0-review-capture.md",
    "docs/research/v1-priority-flow-shortlist.md",
    "docs/research/v1-priority-flow-review-worksheet.md",
    "docs/research/v1-review-scorecard.md",
    "docs/research/v1-phase0-analysis-template.md",
    "docs/research/v1-phase0-decision-memo-template.md",
    "docs/research/v1-governance-gate-register.md",
    "docs/role-separated-workflow.md",
    "docs/mvp-review-packet.md",
    "docs/meeting-capture-template.md",
    "docs/post-review-action-playbook.md",
    "docs/reviews/2026-04-23-urology-review/README.md",
    "docs/reviews/2026-04-23-urology-review/pre-meeting-readiness.md",
    "docs/reviews/2026-04-23-urology-review/reviewer-one-page-handout.md",
    "docs/reviews/2026-04-23-urology-review/post-review-closeout.md",
    "docs/reviews/2026-04-23-urology-review/artifact-starters/README.md",
    "docs/reviews/2026-04-23-urology-review/artifact-starters/revised-question-tree.md",
    "docs/reviews/2026-04-23-urology-review/artifact-starters/one-page-summary-mockup.md",
    "docs/reviews/2026-04-23-urology-review/artifact-starters/assisted-workflow-test.md",
    "docs/reviews/2026-04-23-urology-review/artifact-starters/pause-note-with-rejected-assumptions.md",
    "docs/reviews/2026-04-23-urology-review/decision-capture.md",
    "docs/workflow-rehearsal.md",
    "docs/samples/README.md",
    "scripts/check-phase0-readiness.js"
  ].forEach(assertFile);

  [
    "app/patient-demo/app.js",
    "app/v1/v1.js",
    "app/clinician-summary/clinician.js",
    "app/nurse-workbench/nurse.js",
    "app/visit-packet/visit-packet.js",
    "app/shared/summary.js",
    "app/shared/cases.js",
    "app/shared/review.js",
    "app/reviewer-workbench/reviewer.js",
    "scripts/generate-workflow-rehearsal.js",
    "scripts/generate-samples.js",
    "scripts/check-meeting-readiness.js",
    "scripts/check-phase0-readiness.js",
    "scripts/check-review-closeout.js",
    "scripts/check-selected-artifact.js",
    "scripts/smoke-demo.js"
  ].forEach(assertScriptCompiles);
}

function checkBrowserScriptOrder() {
  const patientSummaryIndex = indexOf("app/patient-demo/index.html", "../shared/summary.js");
  const patientCasesIndex = indexOf("app/patient-demo/index.html", "../shared/cases.js");
  const patientAppIndex = indexOf("app/patient-demo/index.html", "./app.js");
  record(
    "patient demo loads shared scripts before app",
    patientSummaryIndex > -1 &&
      patientCasesIndex > patientSummaryIndex &&
      patientAppIndex > patientCasesIndex
  );

  const clinicianSummaryIndex = indexOf("app/clinician-summary/index.html", "../shared/summary.js");
  const clinicianCasesIndex = indexOf("app/clinician-summary/index.html", "../shared/cases.js");
  const clinicianAppIndex = indexOf("app/clinician-summary/index.html", "./clinician.js");
  record(
    "clinician summary loads shared scripts before page script",
    clinicianSummaryIndex > -1 &&
      clinicianCasesIndex > clinicianSummaryIndex &&
      clinicianAppIndex > clinicianCasesIndex
  );

  const nurseSummaryIndex = indexOf("app/nurse-workbench/index.html", "../shared/summary.js");
  const nurseCasesIndex = indexOf("app/nurse-workbench/index.html", "../shared/cases.js");
  const nurseAppIndex = indexOf("app/nurse-workbench/index.html", "./nurse.js");
  record(
    "nurse workbench loads shared scripts before page script",
    nurseSummaryIndex > -1 &&
      nurseCasesIndex > nurseSummaryIndex &&
      nurseAppIndex > nurseCasesIndex
  );

  const visitSummaryIndex = indexOf("app/visit-packet/index.html", "../shared/summary.js");
  const visitCasesIndex = indexOf("app/visit-packet/index.html", "../shared/cases.js");
  const visitAppIndex = indexOf("app/visit-packet/index.html", "./visit-packet.js");
  record(
    "visit packet loads shared scripts before page script",
    visitSummaryIndex > -1 &&
      visitCasesIndex > visitSummaryIndex &&
      visitAppIndex > visitCasesIndex
  );

  const v1SummaryIndex = indexOf("app/v1/index.html", "../shared/summary.js");
  const v1CasesIndex = indexOf("app/v1/index.html", "../shared/cases.js");
  const v1AppIndex = indexOf("app/v1/index.html", "./v1.js");
  record(
    "v1 product console loads shared scripts before page script",
    v1SummaryIndex > -1 &&
      v1CasesIndex > v1SummaryIndex &&
      v1AppIndex > v1CasesIndex
  );

  record(
    "reviewer workbench loads review library before page script",
    indexOf("app/reviewer-workbench/index.html", "../shared/review.js") <
      indexOf("app/reviewer-workbench/index.html", "./reviewer.js")
  );
}

function checkV1ProductConsole() {
  const html = read("app/v1/index.html");
  const script = read("app/v1/v1.js");
  const css = read("app/v1/styles.css");
  const packet = read("docs/v1-mvp-handoff-packet.md");
  const combined = `${html}\n${script}\n${packet}`;
  const lower = combined.toLowerCase();

  record("v1 console has product title", html.includes("Urology AI Previsit v1 MVP"));
  record("v1 console links handoff packet", html.includes("../../docs/v1-mvp-handoff-packet.md"));
  record("v1 console has six role tabs", ["Intake", "Nurse", "Physician", "Exam Prep", "Export", "Research"].every((label) => html.includes(label)));
  record("v1 console uses shared synthetic cases", script.includes("SYNTHETIC_CASES") && script.includes("findCase"));
  record("v1 console builds exam-prep reminders", script.includes("function buildExamPrepReminders"));
  record("v1 console builds mock payload", script.includes("function buildMockPayload"));
  record("v1 console exposes mock export only", script.includes('integrationMode: "mock_export_only"') && script.includes("liveHisWriteback: false"));
  record("v1 console keeps no-order boundary", script.includes("orderPlaced: false") && lower.includes("no exam order is placed"));
  record("v1 console keeps safety boundary", lower.includes("synthetic data only") && lower.includes("not for clinical use") && lower.includes("physician review required") && lower.includes("regulatory status not determined"));
  record("v1 console does not claim TFDA/FDA status", !/not a medical device|tfda approved|fda approved|non-device status is settled/i.test(combined));
  record("v1 console avoids clinical advice wording", !/likely infection|probable cancer|take medication/.test(lower));
  record("v1 css keeps stable layout primitives", css.includes("grid-template-columns") && css.includes("minmax") && css.includes("aspect-ratio"));
}

function checkResearchPacket() {
  const packageJson = JSON.parse(read("package.json"));
  const readme = read("docs/research/README.md");
  const protocol = read("docs/research/v1-phase-0-clinician-review-protocol.md");
  const sessionScript = read("docs/research/v1-phase0-review-session-script.md");
  const reviewerAsk = read("docs/research/v1-phase0-reviewer-ask.md");
  const capture = read("docs/research/v1-phase0-review-capture.md");
  const shortlist = read("docs/research/v1-priority-flow-shortlist.md");
  const worksheet = read("docs/research/v1-priority-flow-review-worksheet.md");
  const scorecard = read("docs/research/v1-review-scorecard.md");
  const analysis = read("docs/research/v1-phase0-analysis-template.md");
  const memo = read("docs/research/v1-phase0-decision-memo-template.md");
  const gates = read("docs/research/v1-governance-gate-register.md");
  const handoff = read("docs/v1-mvp-handoff-packet.md");
  const combined = `${readme}\n${protocol}\n${sessionScript}\n${reviewerAsk}\n${capture}\n${shortlist}\n${worksheet}\n${scorecard}\n${analysis}\n${memo}\n${gates}\n${handoff}`;
  const lower = combined.toLowerCase();
  const proposedFlows = ["頻尿或夜尿", "小便困難或尿不出來", "血尿或健檢發現潛血"];

  record("research packet declares Phase 0", protocol.includes("V1 Phase 0 Clinician Review Protocol") && readme.includes("Research Packet"));
  record("research packet has readiness command", packageJson.scripts["phase0:check"] === "node scripts/check-phase0-readiness.js" && readme.includes("npm run phase0:check"));
  record("research packet links v1 route", protocol.includes("http://localhost:4173/app/v1/"));
  record("research packet has reviewer ask", reviewerAsk.includes("Short LINE Draft") && reviewerAsk.includes("30-45"));
  record("research packet has session script", sessionScript.includes("Opening Script") && sessionScript.includes("Run Sheet"));
  record("research packet has live capture sheet", capture.includes("Five-Case Summary Review") && capture.includes("Governance Gate Triggers") && proposedFlows.every((flow) => capture.includes(flow)));
  record("research packet has priority flow shortlist", proposedFlows.every((flow) => shortlist.includes(flow)) && shortlist.includes("planning default"));
  record("research packet has priority flow worksheet", ["Flow A", "Flow B", "Flow C"].every((flow) => worksheet.includes(flow)) && proposedFlows.every((flow) => worksheet.includes(flow)));
  record("research packet routes flow materials", readme.includes("v1-priority-flow-shortlist.md") && readme.includes("v1-priority-flow-review-worksheet.md") && sessionScript.includes("v1-priority-flow-shortlist.md"));
  record("research packet routes live capture", readme.includes("v1-phase0-review-capture.md") && sessionScript.includes("v1-phase0-review-capture.md") && analysis.includes("v1-phase0-review-capture.md"));
  record("research packet has scorecard decision choices", ["Continue", "Revise", "Narrow", "Pause", "Governance review before next step"].every((item) => scorecard.includes(item)));
  record("research packet scorecard links flow worksheet", scorecard.includes("v1-priority-flow-review-worksheet.md") && proposedFlows.every((flow) => scorecard.includes(flow)));
  record("research packet has analysis template", analysis.includes("Quantitative Summary") && analysis.includes("Recommended Next Artifact"));
  record("research packet has decision memo template", memo.includes("Decision statement") && memo.includes("Rejected Or Deferred Changes"));
  record("research packet requires boundary confirmation", scorecard.includes("Boundary Confirmation") && scorecard.includes("Synthetic data only."));
  record("research packet includes governance gates", ["Funding", "IP / patent", "Privacy/security", "HIS / information office", "Regulatory"].every((item) => gates.includes(item)));
  record("research packet keeps mock/export boundary", gates.includes("v1 remains export/mock API only") || gates.includes("export/mock API only"));
  record("handoff packet points to Phase 0 research", handoff.includes("Next Research Step: Phase 0 Review") && handoff.includes("docs/research/v1-review-scorecard.md"));
  record("handoff packet points to priority flow materials", handoff.includes("docs/research/v1-priority-flow-shortlist.md") && handoff.includes("docs/research/v1-priority-flow-review-worksheet.md"));
  record("research packet keeps safety boundary", lower.includes("synthetic data only") && lower.includes("not for clinical use") && lower.includes("physician review required") && lower.includes("regulatory status not determined"));
  record("research packet forbids real identifiers", lower.includes("no real patient identifiers") && lower.includes("id numbers") && lower.includes("birthdays"));
  record("research packet avoids classification claims", !/tfda approved|fda approved|non-device status is settled|not a medical device/.test(lower));
  record("research packet avoids clinical advice wording", !/likely infection|probable cancer|take medication/.test(lower));
}

function checkSyntheticCases() {
  record("five synthetic cases available", SYNTHETIC_CASES.length === 5);
  record("hematuria priority synthetic case available", Boolean(SYNTHETIC_CASES.find((sampleCase) => sampleCase.id === "synthetic-hematuria-occult-blood")));

  for (const sampleCase of SYNTHETIC_CASES) {
    record(`${sampleCase.id}: labeled synthetic`, /^Synthetic case:/.test(sampleCase.label));
    record(`${sampleCase.id}: has short label`, Boolean(sampleCase.shortLabel));
    record(`${sampleCase.id}: has demo meta`, Boolean(sampleCase.meta));
    record(`${sampleCase.id}: has answers`, Boolean(sampleCase.answers && sampleCase.answers.chiefConcern));

    const summary = buildClinicianSummary(sampleCase.answers);
    const text = summaryToText(summary).toLowerCase();
    record(`${sampleCase.id}: summary has safety notice`, text.includes("use synthetic data only"));
    record(`${sampleCase.id}: summary has clinician review boundary`, text.includes("clinician review required"));
    record(`${sampleCase.id}: summary avoids likely/probable claims`, !/likely|probable|diagnosed with|take medication/.test(text));
  }
}

function checkGeneratedSamples() {
  const sampleFiles = SYNTHETIC_CASES.map((sampleCase) => `docs/samples/clinician-summary-${sampleCase.id}.md`);
  for (const file of sampleFiles) {
    assertFile(file);
    record(`${file}: source points to shared cases`, contains(file, 'source: "app/shared/cases.js"'));
    record(`${file}: synthetic warning present`, contains(file, "Synthetic sample only"));
    record(`${file}: no treatment advice`, contains(file, "does not diagnose, triage, or recommend treatment"));
  }

  const sampleIndex = read("docs/samples/README.md");
  for (const file of sampleFiles) {
    record(`sample index links ${path.basename(file)}`, sampleIndex.includes(path.basename(file)));
  }
}

function checkWorkflowRehearsal() {
  const text = read("docs/workflow-rehearsal.md");
  record("workflow rehearsal declares generated sources", text.includes("Generated from `app/shared/cases.js`"));
  record("workflow rehearsal has patient flow check", text.includes("### Patient Flow Check"));
  record("workflow rehearsal has nurse workflow cues", text.includes("### Nurse Workflow Cues"));
  record("workflow rehearsal has reviewer questions", text.includes("### Reviewer Questions"));
  record("workflow rehearsal has stop rules", text.includes("## Stop Rules"));
  record("workflow rehearsal keeps safety boundary", text.includes("does not diagnose, triage, or recommend treatment"));
  record("workflow rehearsal avoids clinical advice wording", !/likely infection|probable cancer|take medication/.test(text.toLowerCase()));

  for (const sampleCase of SYNTHETIC_CASES) {
    record(`workflow rehearsal includes ${sampleCase.id}`, text.includes(`Case id: \`${sampleCase.id}\``));
  }
}

function checkReviewPacket() {
  const text = read("docs/mvp-review-packet.md");
  record("review packet has non-negotiable boundary", text.includes("## Non-Negotiable Boundary"));
  record("review packet routes demo surfaces", text.includes("http://localhost:4173/app/patient-demo/"));
  record("review packet routes nurse workbench", text.includes("http://localhost:4173/app/nurse-workbench/"));
  record("review packet routes visit packet", text.includes("http://localhost:4173/app/visit-packet/"));
  record("review packet includes role-separated workflow", text.includes("docs/role-separated-workflow.md"));
  record("review packet includes artifact map", text.includes("## Artifact Map"));
  record("review packet includes reviewer roles", text.includes("## Reviewer Roles"));
  record("review packet includes decision scorecard", text.includes("## Decision Scorecard"));
  record("review packet includes decision rules", text.includes("## Decision Rules"));
  record("review packet includes hard stop conditions", text.includes("## Hard Stop Conditions"));
  record("review packet routes reviewer workbench", text.includes("Reviewer workbench"));
  record("review packet references workflow rehearsal", text.includes("docs/workflow-rehearsal.md"));
  record("review packet covers four cases", text.includes("Run The Four Cases"));
  record("review packet includes recurrent infection case", text.includes("Recurrent infection context"));
  record("review packet references action playbook", text.includes("docs/post-review-action-playbook.md"));
  record("review packet references pre-meeting readiness", text.includes("docs/reviews/2026-04-23-urology-review/pre-meeting-readiness.md"));
  record("review packet references reviewer handout", text.includes("docs/reviews/2026-04-23-urology-review/reviewer-one-page-handout.md"));
  record("review packet references post-review closeout", text.includes("docs/reviews/2026-04-23-urology-review/post-review-closeout.md"));
  record("review packet references artifact starters", text.includes("docs/reviews/2026-04-23-urology-review/artifact-starters/"));
  record("review packet references dated decision capture", text.includes("docs/reviews/2026-04-23-urology-review/decision-capture.md"));
  record("review packet keeps safety boundary", text.includes("No diagnosis.") && text.includes("No treatment advice."));
  record("review packet avoids clinical advice wording", !/likely infection|probable cancer|take medication/.test(text.toLowerCase()));
  record("review packet has no stale three-case wording", !/three synthetic scenario|Run The Three Cases|Three-case walkthrough/i.test(text));
}

function checkBrowserReviewPacket() {
  const text = read("app/review-packet/index.html");
  const lower = text.toLowerCase();

  record("browser review packet has title", text.includes("MVP review packet"));
  record("browser review packet links patient demo", text.includes('href="../patient-demo/"'));
  record("browser review packet links nurse workbench", text.includes('href="../nurse-workbench/"'));
  record("browser review packet links clinician summary", text.includes('href="../clinician-summary/"'));
  record("browser review packet links visit packet", text.includes('href="../visit-packet/"'));
  record("browser review packet links reviewer workbench", text.includes('href="../reviewer-workbench/"'));
  record("browser review packet links workflow rehearsal", text.includes("../../docs/workflow-rehearsal.md"));
  record("browser review packet links role-separated workflow", text.includes("../../docs/role-separated-workflow.md"));
  record("browser review packet links markdown packet", text.includes("../../docs/mvp-review-packet.md"));
  record("browser review packet links action playbook", text.includes("../../docs/post-review-action-playbook.md"));
  record("browser review packet links pre-meeting readiness", text.includes("../../docs/reviews/2026-04-23-urology-review/pre-meeting-readiness.md"));
  record("browser review packet links reviewer handout", text.includes("../../docs/reviews/2026-04-23-urology-review/reviewer-one-page-handout.md"));
  record("browser review packet links post-review closeout", text.includes("../../docs/reviews/2026-04-23-urology-review/post-review-closeout.md"));
  record("browser review packet links artifact starters", text.includes("../../docs/reviews/2026-04-23-urology-review/artifact-starters/"));
  record("browser review packet links dated decision capture", text.includes("../../docs/reviews/2026-04-23-urology-review/decision-capture.md"));
  record("browser review packet covers four cases", text.includes("Four-case walkthrough"));
  record(
    "browser review packet has decision outcomes",
    ["Continue", "Revise", "Narrow", "Pause"].every((outcome) => text.includes(`<h3>${outcome}</h3>`))
  );
  record(
    "browser review packet keeps safety boundary",
    text.includes("No diagnosis, triage, or treatment advice.") &&
      text.includes("Clinician review remains required.")
  );
  record("browser review packet avoids clinical advice wording", !/likely infection|probable cancer|take medication/.test(lower));
  record("browser review packet has no stale three-case wording", !/three-case walkthrough/i.test(lower));
}

function checkVisitPacket() {
  const text = read("app/visit-packet/index.html");
  const script = read("app/visit-packet/visit-packet.js");
  const lower = `${text}\n${script}`.toLowerCase();

  record("visit packet has title", text.includes("看診前資料包"));
  record("visit packet separates patient page", script.includes("renderPatientPage"));
  record("visit packet separates nurse page", script.includes("renderNursePage"));
  record("visit packet separates clinician page", script.includes("renderClinicianPage"));
  record("visit packet uses shared packet builder", script.includes("buildVisitPacket"));
  record("visit packet supports print", script.includes("window.print()"));
  record("visit packet avoids clinical advice wording", !/likely infection|probable cancer|take medication/.test(lower));
}

function checkReviewerBoundary() {
  const recordText = reviewRecordToText(buildReviewRecord({
    workflowPain: "clear",
    summaryUsefulness: "would-read",
    staffBurden: "acceptable",
    patientFit: "mixed",
    safetyBoundary: "acceptable",
    workflowSlot: "exists",
    existingProcess: "not-sufficient"
  })).toLowerCase();

  record("review record includes no diagnosis boundary", recordText.includes("no diagnosis"));
  record("review record includes no treatment boundary", recordText.includes("no treatment advice"));
  record("review record includes meeting evidence", recordText.includes("meeting evidence"));
  record("review record avoids clinical advice wording", !/likely infection|probable cancer|take medication/.test(recordText));
}

function checkMeetingCaptureTemplate() {
  const text = read("docs/meeting-capture-template.md");
  const lower = text.toLowerCase();

  record("meeting capture has four-case evidence", text.includes("## Four-Case Evidence"));
  record("meeting capture includes recurrent infection case", text.includes("Recurrent infection context"));
  record("meeting capture has decision signals", text.includes("## Decision Signals"));
  record("meeting capture has hard stop notes", text.includes("## Hard Stop Notes"));
  record("meeting capture references action playbook", text.includes("docs/post-review-action-playbook.md"));
  record("meeting capture avoids clinical advice wording", !/likely infection|probable cancer|take medication/.test(lower));
}

function checkPostReviewActionPlaybook() {
  const text = read("docs/post-review-action-playbook.md");
  const lower = text.toLowerCase();

  record("action playbook maps decisions", text.includes("## Decision-To-Artifact Map"));
  record("action playbook has continue artifact", text.includes("## Continue Artifact: Revised Question Tree"));
  record("action playbook has summary mockup artifact", text.includes("## Continue Or Revise Artifact: One-Page Summary Mockup"));
  record("action playbook has narrow artifact", text.includes("## Narrow Artifact: Assisted Workflow Test"));
  record("action playbook has pause artifact", text.includes("## Pause Artifact: Pause Note With Rejected Assumptions"));
  record("action playbook has hard stop", text.includes("## Hard Stop"));
  record("action playbook references dated decision capture", text.includes("docs/reviews/2026-04-23-urology-review/decision-capture.md"));
  record("action playbook references artifact check", text.includes("npm run artifact:check"));
  record("action playbook avoids clinical advice wording", !/likely infection|probable cancer|take medication/.test(lower));
}

function checkDatedReviewWorkspace() {
  const capture = read("docs/reviews/2026-04-23-urology-review/decision-capture.md");
  const readme = read("docs/reviews/2026-04-23-urology-review/README.md");
  const readiness = read("docs/reviews/2026-04-23-urology-review/pre-meeting-readiness.md");
  const handout = read("docs/reviews/2026-04-23-urology-review/reviewer-one-page-handout.md");
  const closeout = read("docs/reviews/2026-04-23-urology-review/post-review-closeout.md");
  const starterReadme = read("docs/reviews/2026-04-23-urology-review/artifact-starters/README.md");
  const starterTexts = [
    "docs/reviews/2026-04-23-urology-review/artifact-starters/revised-question-tree.md",
    "docs/reviews/2026-04-23-urology-review/artifact-starters/one-page-summary-mockup.md",
    "docs/reviews/2026-04-23-urology-review/artifact-starters/assisted-workflow-test.md",
    "docs/reviews/2026-04-23-urology-review/artifact-starters/pause-note-with-rejected-assumptions.md"
  ].map(read).join("\n");
  const lower = `${capture}\n${readme}`.toLowerCase();

  record("dated review workspace is pending follow-up", /Status: pending (review|follow-up)/.test(capture));
  record("dated review workspace includes four cases", ["Frequent urination at night", "Difficulty emptying", "Incomplete leakage intake", "Recurrent infection context"].every((item) => capture.includes(item)));
  record("dated review workspace has no prefilled decision", !/decision: continue|decision: revise|decision: narrow|decision: pause/.test(lower));
  record("dated review workspace has no clinical advice wording", !/likely infection|probable cancer|take medication/.test(lower));
  record("dated review workspace warns against prefill", readme.includes("Do not pre-fill reviewer conclusions"));
  record("dated review workspace has readiness checklist", readiness.includes("npm run meeting:check"));
  record("dated review workspace has reviewer handout", handout.includes("## Decision Choices"));
  record("dated review workspace has post-review closeout", closeout.includes("npm run review:closeout"));
  record("dated review workspace has artifact starters", starterReadme.includes("## Starter Map"));
  record("dated review workspace has artifact check", closeout.includes("npm run artifact:check") && starterReadme.includes("npm run artifact:check"));
  record("dated readiness checklist avoids clinical advice wording", !/likely infection|probable cancer|take medication/.test(readiness.toLowerCase()));
  record("dated reviewer handout avoids clinical advice wording", !/likely infection|probable cancer|take medication/.test(handout.toLowerCase()));
  record("dated post-review closeout avoids clinical advice wording", !/likely infection|probable cancer|take medication/.test(closeout.toLowerCase()));
  record("dated artifact starters avoid clinical advice wording", !/likely infection|probable cancer|take medication/.test(starterTexts.toLowerCase()));
}

function checkNoStaleReferences() {
  record(
    "patient app uses shared synthetic cases",
    contains("app/patient-demo/app.js", "const SCENARIOS = SYNTHETIC_CASES;")
  );
  record(
    "patient app no longer embeds scenario array",
    !contains("app/patient-demo/app.js", "const SCENARIOS = [")
  );
  record(
    "patient and family UI does not link staff-only surfaces",
    !contains("app/patient-demo/index.html", "../nurse-workbench/") &&
      !contains("app/patient-demo/index.html", "../clinician-summary/") &&
      !contains("app/patient-demo/index.html", "../reviewer-workbench/")
  );
  record(
    "patient and family UI hides staff workflow wording",
    !/Nurse Workflow|Clinician review|Summary View|Reviewer Workbench|醫師摘要|護理補問|醫師使用|護理師使用/i.test(
      read("app/patient-demo/index.html") + read("app/patient-demo/app.js")
    )
  );
  record(
    "patient app exposes elder-friendly display controls",
    contains("app/patient-demo/index.html", "largeTextToggle") &&
      contains("app/patient-demo/index.html", "contrastToggle") &&
      contains("app/patient-demo/index.html", "readStepButton")
  );
  record(
    "patient app persists display preferences and supports read-aloud",
    contains("app/patient-demo/app.js", "urologyPrevisitUiPrefs") &&
      contains("app/patient-demo/app.js", "speechSynthesis")
  );

  assertNoRepositoryText(/data\/synthetic-cases\/cases\.json/, "old synthetic cases json path");
  assertNoRepositoryText(/\bentryMode\b|\bsymptomCategory\b|\bfrequencyDay\b|\bphoneComfort\b|\bsupportNeeds\b/, "old answer field names");
}

function main() {
  checkEntrypoints();
  checkBrowserScriptOrder();
  checkV1ProductConsole();
  checkResearchPacket();
  checkSyntheticCases();
  checkGeneratedSamples();
  checkWorkflowRehearsal();
  checkReviewPacket();
  checkBrowserReviewPacket();
  checkMeetingCaptureTemplate();
  checkPostReviewActionPlaybook();
  checkDatedReviewWorkspace();
  checkVisitPacket();
  checkReviewerBoundary();
  checkNoStaleReferences();

  const failed = checks.filter((check) => !check.passed);
  for (const check of checks) {
    const mark = check.passed ? "ok" : "FAIL";
    const detail = check.detail ? ` -- ${check.detail}` : "";
    console.log(`${mark} ${check.name}${detail}`);
  }

  if (failed.length) {
    console.error(`\nSmoke check failed: ${failed.length}/${checks.length} checks failed.`);
    process.exit(1);
  }

  console.log(`\nSmoke check passed: ${checks.length}/${checks.length} checks passed.`);
}

main();
