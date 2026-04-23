# Urology AI Previsit v1 MVP

A static browser `v1` MVP product preview for a professional, patient-friendly urology previsit interview workflow.

The current goal is a safe local product package: show a low-friction patient/family guided-question flow, repair missing information for staff, generate a physician-facing summary, show physician-confirmed exam-prep reminders, and provide mock export/API artifacts before building anything clinical or integrated.

Open the v1 product console first:

`http://localhost:4173/app/v1/`

Verified fallback from the 2026-04-23 pull-forward build:

`http://127.0.0.1:4176/app/v1/`

## What This Is

- Professional static v1 MVP product preview using synthetic data only.
- UI-guided questionnaire first; voice input is out of scope.
- Separate patient/family intake, nurse missing-information workbench, and clinician summary surfaces.
- Productized v1 console with case selector, role tabs, physician summary, exam-prep mockup, mock export/API, and research gates.
- `陽明小幫手` waiting-room flow rules from 許醫師's QA file: already-registered flow, no ID/birthday in initial-visit intake, initial/return branch, and confirmation-only exam-prep matrix.
- Current-system benchmark table for doctor-provided `聯醫小幫手` / `陽明小幫手` links; use synthetic inputs or screenshots only.
- Governed core questions, conditional modules, source labeling for family-assisted answers, missing-information repair, nurse cues, and clinician summary.
- Patient/family display controls for larger text, high contrast, and read-aloud of the current step.
- Reviewer workbench for meeting feedback and continue / revise / narrow / pause decision capture.
- Clinician-review summary, not diagnosis, triage, or treatment advice.
- Patient-friendly, large-touch-target interface for urology previsit intake.
- Not for clinical use; physician review remains required.
- Regulatory status is not determined.

## What This Is Not

- No diagnosis engine, triage system, treatment recommender, or autonomous exam-ordering system.
- No live HIS, EMR, EHR, registration, messaging, or hospital-system integration.
- No approval for real patient data or clinical use.
- No claim about TFDA/FDA classification before formal review.
- No copying current Argon/vendor behavior without permission.
- No local/on-prem deployment, hardware/RAG acceleration, or hospital-network installation in v1.
- No replacement for a clinician.

## Run

```bash
cd /home/jnln3799/every_on_git_ubuntu/urology-ai-previsit-demo
python3 -m http.server 4173
```

Open:

- v1 product console: `http://localhost:4173/app/v1/`
- Patient demo: `http://localhost:4173/app/patient-demo/`
- Nurse workbench: `http://localhost:4173/app/nurse-workbench/`
- Visit packet export: `http://localhost:4173/app/visit-packet/`
- Review packet: `http://localhost:4173/app/review-packet/`
- Clinician summary sample: `http://localhost:4173/app/clinician-summary/`
- Reviewer workbench: `http://localhost:4173/app/reviewer-workbench/`

Use `docs/v1-mvp-handoff-packet.md` as the product/research handoff packet, and `docs/mvp-review-packet.md` when asking a reviewer to judge the earlier review workflow.

For the next research step, use the Phase 0 synthetic clinician/nurse review packet:

- Pre-session readiness check: `npm run phase0:check`
- `docs/research/v1-phase0-reviewer-ask.md`
- `docs/research/v1-phase0-review-session-script.md`
- `docs/research/v1-phase0-review-capture.md`
- `docs/research/v1-current-system-benchmark-table.md`
- `docs/research/v1-phase-0-clinician-review-protocol.md`
- `docs/research/v1-priority-flow-shortlist.md`
- `docs/research/v1-priority-flow-review-worksheet.md`
- `docs/research/v1-review-scorecard.md`
- `docs/research/v1-phase0-analysis-template.md`
- `docs/research/v1-phase0-decision-memo-template.md`
- `docs/research/v1-governance-gate-register.md`

You can also open `app/patient-demo/index.html` directly in a browser.

## Doctor Demo Handout

Use `docs/clinician-demo-report-v1.md` when showing the concept to doctors. It includes the clinical framing, safety boundary, suggested live-demo order, and real screenshots captured from the running demo under `docs/screenshots/`.

The original pre-screenshot report is preserved as `docs/clinician-demo-report-v0.md`. The unversioned `docs/clinician-demo-report.md` currently mirrors the latest v1 handout for convenience.

For a live walkthrough, start the local server and open `http://localhost:4173/app/review-packet/` first, then move through patient/family intake, nurse workbench, clinician summary, and visit packet export.

## Test

```bash
npm run rehearsal
npm run smoke
npm test
npm run phase0:check
```

The rehearsal generator creates `docs/workflow-rehearsal.md`, a scenario-by-scenario walkthrough for checking patient flow, nurse cues, clinician summary usefulness, and reviewer questions.

The smoke check verifies demo entrypoints, browser script order, shared synthetic cases, generated sample boundaries, and stale-reference cleanup.

The Phase 0 readiness check runs smoke/tests, verifies the five-case research packet, current-system benchmark table, and live capture sheet, and checks the local `app/v1/` route while the static server is running. If you are using another port, run it as `UROLOGY_PREVISIT_BASE_URL=http://127.0.0.1:4176 npm run phase0:check`.

The tests check summary generation, conditional module activation, missing-information prompts, completion status, safety wording, and reviewer decision-record logic.

Latest 2026-04-23 pull-forward verification:

- `npm test`: `40/40`
- `npm run smoke`: `269/269`
- `UROLOGY_PREVISIT_BASE_URL=http://127.0.0.1:4176 npm run phase0:check`: `81/81`

## Sample Outputs

The repository includes synthetic sample artifacts for meeting demos:

- Sample index: `docs/samples/README.md`
- Clinician summary samples: `docs/samples/clinician-summary-*.md`
- Browser visit packet export: `app/visit-packet/`
- Reviewer decision-record samples: `docs/samples/reviewer-record-*.md`
- MVP review packet: `docs/mvp-review-packet.md`
- Role-separated workflow note: `docs/role-separated-workflow.md`
- Workflow rehearsal: `docs/workflow-rehearsal.md`

Synthetic scenarios are defined once in `app/shared/cases.js`, then reused by the browser demo and sample generator.

Regenerate them with:

```bash
npm run rehearsal
npm run samples
```

## Repository Boundary

This repository owns the implementation: app code, UI, synthetic cases, tests, and demo documentation.

The sibling thinking repository, `../urology-ai-previsit-thinking-spec`, owns system logic, clinical question governance, evidence mapping, and reviewer decision records.

Current architecture decision: keep this demo repo separate from the thinking/governance repo unless governance and implementation need to be version-locked in a future deployment package.

The planning repository keeps planning notes, meeting notes, decisions, and knowledge-locator files only.
