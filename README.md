# Urology AI Previsit MVP

A static browser MVP for a professional, patient-friendly urology previsit interview workflow.

The first goal is discovery: show a low-friction patient/family guided-question flow, repair missing information for staff, generate a physician-facing summary, and learn whether the workflow is useful before building anything clinical or integrated.

## What This Is

- Professional static MVP using synthetic data only.
- UI-guided questionnaire first; voice input is out of scope.
- Separate patient/family intake, nurse missing-information workbench, and clinician summary surfaces.
- Governed core questions, conditional modules, source labeling for family-assisted answers, missing-information repair, nurse cues, and clinician summary.
- Patient/family display controls for larger text, high contrast, and read-aloud of the current step.
- Reviewer workbench for meeting feedback and continue / revise / narrow / pause decision capture.
- Clinician-review summary, not diagnosis, triage, or treatment advice.
- Patient-friendly, large-touch-target interface for urology previsit intake.

## What This Is Not

- Not a medical device.
- Not a diagnosis engine.
- Not connected to HIS, EMR, EHR, or hospital systems.
- Not approved for real patient data.
- Not a replacement for a clinician.

## Run

```bash
cd /Users/iKev/Desktop/02_Projects_and_Code/everything_on_git/urology-ai-previsit-demo
python3 -m http.server 4173
```

Open:

- Patient demo: `http://localhost:4173/app/patient-demo/`
- Nurse workbench: `http://localhost:4173/app/nurse-workbench/`
- Visit packet export: `http://localhost:4173/app/visit-packet/`
- Review packet: `http://localhost:4173/app/review-packet/`
- Clinician summary sample: `http://localhost:4173/app/clinician-summary/`
- Reviewer workbench: `http://localhost:4173/app/reviewer-workbench/`

Use `docs/mvp-review-packet.md` as the meeting entrypoint when asking a reviewer to judge the MVP.

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
```

The rehearsal generator creates `docs/workflow-rehearsal.md`, a scenario-by-scenario walkthrough for checking patient flow, nurse cues, clinician summary usefulness, and reviewer questions.

The smoke check verifies demo entrypoints, browser script order, shared synthetic cases, generated sample boundaries, and stale-reference cleanup.

The tests check summary generation, conditional module activation, missing-information prompts, completion status, safety wording, and reviewer decision-record logic.

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
