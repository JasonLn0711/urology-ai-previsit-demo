# Urology AI Previsit MVP

A static browser MVP for a professional, patient-friendly urology previsit interview workflow.

The first goal is discovery: show a low-friction guided-question flow, repair missing information, generate a physician-facing summary, and learn whether the workflow is useful before building anything clinical or integrated.

## What This Is

- Professional static MVP using synthetic data only.
- UI-guided questionnaire first; voice input is out of scope.
- Scenario rail, stepper, missing-information repair, review handoff, and clinician summary.
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

You can also open `app/patient-demo/index.html` directly in a browser.

## Test

```bash
npm test
```

The tests check summary generation, missing-information prompts, completion status, and safety wording.

## Repository Boundary

This repository owns the implementation: app code, UI, synthetic cases, tests, and demo documentation.

The planning repository keeps source links, meeting notes, decisions, and knowledge-locator files only.
