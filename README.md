# 泌尿預診導航 Evidence System

<img src="http://estruyf-github.azurewebsites.net/api/VisitorHit?user=JasonLn0711&repo=urology-ai-previsit-demo&countColor=%237B1E7B" alt="Visitor count"/>

This repository turns a static demo into a verifiable clinical workflow evidence system.

It uses synthetic urology previsit cases and local browser answers to produce role-separated outputs: patient confirmation, nurse missing-field repair, clinician summary, visit packet, and reviewer decision evidence.

Working brand: `泌尿預診導航` (`UroPrevisit Navigator`). This is separate from 許醫師's current `陽明小幫手` prototype name, which should be treated as benchmark/source context only.

Current product version: `v2.4.0`.

## Project Ownership Rule

This project is the urology previsit collaboration with the Taipei City Hospital Beitou Branch urology director. The Huicheng / imedtac AI-triage kiosk work is a separate later project from Prof. Wu's adjacent collaboration thread.

Huicheng may borrow architecture, interaction patterns, and safety lessons from this repository, but Huicheng requirements or implementation should not drive changes here. Future Huicheng work belongs in `../ai-triage-kiosk-demo/` unless a separate urology-side discussion explicitly asks for this repository to change.

## What This Is

- A local, static, synthetic-data workflow prototype.
- A validation harness for summary usefulness, missing-field repair, source attribution, and safety language.
- A role-separated UI with one shared data contract and one pure logic layer.
- An experiment system for logs, scorecards, and decision memos.
- A simplified Taiwan hospital patient intake screen with click or voice answer
  submission, visible answer confirmation, and 30-second final supplement.
- A local ASR backend that uses the existing
  `SoybeanMilk/faster-whisper-Breeze-ASR-25` model on RTX GPU with
  `compute_type=int8`, no CPU fallback, and fixed denoise plus `-20 dBFS`
  normalization before transcription.
- A Version 2 ASR-ready adaptive-question demo that shows how
  embedding-style retrieval over a governed compact previsit question bank can
  choose the next reasonable clarification or follow-up question within 12
  patient-facing questions.

## What This Is Not

- Not clinical software.
- Not a diagnosis, triage, treatment, or exam-ordering system.
- Not connected to HIS, EMR, EHR, messaging, or registration systems.
- Not approved for real patient data.
- Not a replacement for physician review.

## Demo Mainline

Start the local RTX ASR server in one terminal:

```bash
npm run asr:local
```

Start the static demo server in another terminal:

```bash
npm start
```

Open the primary demo route:

- Version 2 adaptive intake: `http://localhost:4173/app/adaptive-intake/`

Fallback routes:

- Short click-or-voice patient intake: `http://localhost:4173/app/patient-short/`
- Reviewer packet: `http://localhost:4173/app/reviewer/packet/`

The first-principles demo claim is narrow:

```text
After each patient answer, the system selects the next most useful governed previsit question from the current patient state, and stops before drifting into diagnostic questioning.
```

## Demo Ready Check

```bash
npm run demo:ready
```

This single command runs version checks, unit tests, smoke checks, the V2 freeze gate, and whitespace checks.

For ASR-specific hardware/model validation:

```bash
npm run asr:check
```

The older experiment commands remain available for deeper review:

```bash
npm run rehearsal
npm run samples
npm run experiment:phase1
npm run experiment:check
```

## Version Management

This repo uses product semantic versioning for demo traceability:

```text
vMAJOR.MINOR.PATCH
```

Before finishing any meaningful change, update the version and changelog:

```bash
npm run version:bump -- patch "Short change summary"
npm run demo:ready
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
- Voice answer matching: `core/speech_answer_matching`
- Local RTX ASR client/server: `app/shared/local-asr-client.js`,
  `scripts/asr/local_faster_whisper_server.py`
  with governed question-bank metadata, an ambiguity gate, and deterministic ranking before ordinary question selection
- Governed V2 question bank export: `data/question_bank/urology_adaptive_bank.js`
  (`QUESTION_BANK` is the compact 12-question runtime bank;
  `LEGACY_QUESTION_BANK` preserves the older 41-question bank)
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

## Active Docs

- Demo runbook: `docs/v2-demo-freeze-runbook.md`
- Local RTX ASR runbook: `docs/local-asr-rtx.md`
- Post-demo decision capture: `docs/v2-post-demo-decision-capture.md`
- Full docs routing: `docs/README.md`

Everything else under `docs/` and `experiments/` is reference evidence unless the runbook routes you there.

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
