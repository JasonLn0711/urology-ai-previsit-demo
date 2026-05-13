# 泌尿預診導航 Evidence System

This repository turns a static demo into a verifiable clinical workflow evidence system.

It uses synthetic urology previsit cases and local browser answers to produce role-separated outputs: patient confirmation, nurse missing-field repair, clinician summary, visit packet, and reviewer decision evidence.

Working brand: `泌尿預診導航` (`UroPrevisit Navigator`). This is separate from 許醫師's current `陽明小幫手` prototype name, which should be treated as benchmark/source context only.

Current product version: `v2.0.0`.

## Project Ownership Rule

This project is the urology previsit collaboration with the Taipei City Hospital Beitou Branch urology director. The Huicheng / imedtac AI-triage kiosk work is a separate later project from Prof. Wu's adjacent collaboration thread.

Huicheng may borrow architecture, interaction patterns, and safety lessons from this repository, but Huicheng requirements or implementation should not drive changes here. Future Huicheng work belongs in `../ai-triage-kiosk-demo/` unless a separate urology-side discussion explicitly asks for this repository to change.

## What This Is

- A local, static, synthetic-data workflow prototype.
- A validation harness for summary usefulness, missing-field repair, source attribution, and safety language.
- A role-separated UI with one shared data contract and one pure logic layer.
- An experiment system for logs, scorecards, and decision memos.
- A Version 2 ASR-ready adaptive-question demo that shows how
  embedding-style retrieval over a governed question bank can choose the next
  reasonable clarification or follow-up question.

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
- Patient/family short intake: `http://localhost:4173/app/patient-short/`
- Version 2 adaptive intake: `http://localhost:4173/app/adaptive-intake/`
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
npm run version:check
npm run demo:v2-freeze
npm run smoke
npm test
```

The experiment command writes case logs to `experiments/phase1/logs/`. Fill the human feedback fields, update `experiments/phase1/scorecard.md`, then complete `experiments/phase1/decision-memo.md`.

## Version Management

This repo uses product semantic versioning for demo traceability:

```text
vMAJOR.MINOR.PATCH
```

Before finishing any meaningful change, update the version and changelog:

```bash
npm run version:bump -- patch "Short change summary"
npm run version:check
```

Use `minor` for new demo capability and `major` for product-claim, safety-boundary, or workflow-contract changes. See `docs/versioning-policy.md`.

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
- Adaptive questioning: `core/adaptive_questioning`
  with governed question-bank metadata, an ambiguity gate, and deterministic ranking before ordinary question selection
- Governed V2 question bank export: `data/question_bank/urology_adaptive_bank.js`
- Role UI: `app/patient`, `app/patient-short`, `app/adaptive-intake`, `app/nurse`, `app/clinician`, `app/reviewer`
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
- Versioning policy: `docs/versioning-policy.md`
- Changelog: `docs/CHANGELOG.md`
- V2 canonical spec: `docs/urology-ai-previsit-demo-v2-spec.md`
- V1 to V2 change log: `docs/v1-to-v2-change-log.md`
- Adaptive questioning design: `docs/adaptive-questioning-design.md`
- Ambiguity handling: `docs/ambiguity-handling.md`
- Question-bank schema: `docs/question-bank-schema.md`
- V2 safety boundary: `docs/safety-boundary.md`
- Five-minute demo script: `docs/demo-script-5min.md`
- V2 freeze runbook: `docs/v2-demo-freeze-runbook.md`
- V2 first-principles readiness audit: `docs/v2-first-principles-readiness-audit.md`
- V2 post-demo decision capture: `docs/v2-post-demo-decision-capture.md`
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
