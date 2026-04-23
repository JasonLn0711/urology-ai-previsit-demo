# Urology AI Previsit Evidence System

This repository turns a static demo into a verifiable clinical workflow evidence system.

It uses synthetic urology previsit cases and local browser answers to produce role-separated outputs: patient confirmation, nurse missing-field repair, clinician summary, visit packet, and reviewer decision evidence.

## What This Is

- A local, static, synthetic-data workflow prototype.
- A validation harness for summary usefulness, missing-field repair, source attribution, and safety language.
- A role-separated UI with one shared data contract and one pure logic layer.
- An experiment system for logs, scorecards, and decision memos.

## What This Is Not

- Not clinical software.
- Not a diagnosis, triage, treatment, or exam-ordering system.
- Not connected to HIS, EMR, EHR, messaging, or registration systems.
- Not approved for real patient data.
- Not a replacement for physician review.

## Run In One Command

```bash
npm start
```

Open:

- Patient/family intake: `http://localhost:4173/app/patient/`
- Nurse checklist: `http://localhost:4173/app/nurse/`
- Clinician summary: `http://localhost:4173/app/clinician/`
- Visit packet: `http://localhost:4173/app/clinician/visit-packet/`
- Reviewer decision: `http://localhost:4173/app/reviewer/`
- Reviewer packet: `http://localhost:4173/app/reviewer/packet/`

## Evaluate

```bash
npm run rehearsal
npm run samples
npm run experiment:phase1
npm run experiment:check
npm run smoke
npm test
```

The experiment command writes case logs to `experiments/phase1/logs/`. Fill the human feedback fields, update `experiments/phase1/scorecard.md`, then complete `experiments/phase1/decision-memo.md`.

## Architecture

The system follows one data contract:

```js
{
  patient_input: {},
  derived_summary: {},
  missing_fields: [],
  attribution: {},
  audit_trace: []
}
```

Repository primitives:

- Input: `data/synthetic_cases`, browser `localStorage`
- Transformation: `core/summary`, `core/missing_fields`, `core/attribution`, `core/role_transform`, `core/safety`
- Role UI: `app/patient`, `app/nurse`, `app/clinician`, `app/reviewer`
- Evidence: `experiments/phase1`
- Governance: `core/safety`, `docs/safety`

## Safety Rules

The code enforces:

- no diagnosis or treatment-claim wording
- observational language only
- mandatory source attribution
- visible missing fields
- `requiresPhysicianReview: true` on generated outputs

## Key Docs

- Product boundary: `docs/product/README.md`
- Safety boundary: `docs/safety/README.md`
- Workflow/data contract: `docs/workflow/README.md`
- Research process: `docs/research/README.md`
- Reviewer decision process: `docs/reviews/README.md`
- Phase 1 plan: `experiments/phase1/plan.md`
- Phase 1 scorecard: `experiments/phase1/scorecard.md`
- Phase 1 decision memo: `experiments/phase1/decision-memo.md`

## Cleanup Summary

Merged:

- old product, safety, workflow, research, and review documents into five canonical docs folders
- old generated sample outputs into `experiments/phase1/cases`
- old reviewer packet and reviewer workbench paths under `app/reviewer`

Removed:

- duplicated `app/v1` all-in-one console
- old role folder names such as `patient-demo`, `nurse-workbench`, and `clinician-summary`
- stale Phase 0/review template sprawl that did not directly drive the current experiment

Added:

- pure `core/` logic layer
- canonical `data/schema`
- Phase 1 experiment logs, scorecard, and decision memo framework
- focused tests for summary, missing fields, attribution, role separation, safety, and experiment integrity
