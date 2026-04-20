# Urology AI Previsit MVP

A static browser MVP for a professional, patient-friendly urology previsit interview workflow.

The first goal is discovery: show a low-friction guided-question flow, repair missing information, generate a physician-facing summary, and learn whether the workflow is useful before building anything clinical or integrated.

## What This Is

- Professional static MVP using synthetic data only.
- UI-guided questionnaire first; voice input is out of scope.
- Scenario rail, governed core questions, conditional modules, missing-information repair, review handoff, nurse cues, and clinician summary.
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
cd /home/jnclaw/every_on_git_jnclaw/urology-ai-previsit-demo
python3 -m http.server 4173
```

Open:

- Patient demo: `http://localhost:4173/app/patient-demo/`
- Clinician summary sample: `http://localhost:4173/app/clinician-summary/`
- Reviewer workbench: `http://localhost:4173/app/reviewer-workbench/`

You can also open `app/patient-demo/index.html` directly in a browser.

## Test

```bash
npm run smoke
npm test
```

The smoke check verifies demo entrypoints, browser script order, shared synthetic cases, generated sample boundaries, and stale-reference cleanup.

The tests check summary generation, conditional module activation, missing-information prompts, completion status, safety wording, and reviewer decision-record logic.

## Sample Outputs

The repository includes synthetic sample artifacts for meeting demos:

- Sample index: `docs/samples/README.md`
- Clinician summary samples: `docs/samples/clinician-summary-*.md`
- Reviewer decision-record samples: `docs/samples/reviewer-record-*.md`

Synthetic scenarios are defined once in `app/shared/cases.js`, then reused by the browser demo and sample generator.

Regenerate them with:

```bash
npm run samples
```

## Repository Boundary

This repository owns the implementation: app code, UI, synthetic cases, tests, and demo documentation.

The sibling thinking repository, `../urology-ai-previsit-thinking-spec`, owns system logic, clinical question governance, evidence mapping, and reviewer decision records.

Current architecture decision: keep this demo repo separate from the thinking/governance repo unless governance and implementation need to be version-locked in a future deployment package.

The planning repository keeps planning notes, meeting notes, decisions, and knowledge-locator files only.
