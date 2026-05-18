# Changelog

This changelog records meaningful product, demo, safety, question-bank, and evidence-system changes.

## v2.4.9 - 2026-05-18

Stage: `demo-freeze-candidate`

### Changed

- Fill SOAP clinician page with case study examples

### Versioning

- Bump type: `patch`
- Verification command to run before freeze or commit: `npm run version:check`

## v2.4.8 - 2026-05-18

Stage: `demo-freeze-candidate`

### Changed

- Render SOAP draft as case report

### Versioning

- Bump type: `patch`
- Verification command to run before freeze or commit: `npm run version:check`

## v2.4.7 - 2026-05-18

Stage: `demo-freeze-candidate`

### Changed

- Add SOAP draft clinician summary examples

### Versioning

- Bump type: `patch`
- Verification command to run before freeze or commit: `npm run version:check`

## v2.4.6 - 2026-05-18

Stage: `demo-freeze-candidate`

### Changed

- Exclude closing supplement prompt until final turn

### Versioning

- Bump type: `patch`
- Verification command to run before freeze or commit: `npm run version:check`

## v2.4.5 - 2026-05-18

Stage: `demo-freeze-candidate`

### Changed

- Lock closing supplement question to twelfth turn

### Versioning

- Bump type: `patch`
- Verification command to run before freeze or commit: `npm run version:check`

## v2.4.4 - 2026-05-18

Stage: `demo-freeze-candidate`

### Changed

- Fix patient-short ASR no-match feedback

### Versioning

- Bump type: `patch`
- Verification command to run before freeze or commit: `npm run version:check`

## v2.4.3 - 2026-05-18

Stage: `demo-freeze-candidate`

### Changed

- Document AI similarity workflow diagram

### Versioning

- Bump type: `patch`
- Verification command to run before freeze or commit: `npm run version:check`

## v2.4.2 - 2026-05-18

Stage: `demo-freeze-candidate`

### Changed

- Simplify short-answer question groups

### Versioning

- Bump type: `patch`
- Verification command to run before freeze or commit: `npm run version:check`

## v2.4.1 - 2026-05-18

Stage: `demo-freeze-candidate`

### Changed

- Clarify patient distress score guidance

### Versioning

- Bump type: `patch`
- Verification command to run before freeze or commit: `npm run version:check`

## v2.4.0 - 2026-05-15

Stage: `demo-freeze-candidate`

### Changed

- Add built-in ASR audio preprocessing

### Versioning

- Bump type: `minor`
- Verification command to run before freeze or commit: `npm run version:check`

## v2.3.0 - 2026-05-15

Stage: `demo-freeze-candidate`

### Changed

- Add VAD auto-answer ASR flow

### Versioning

- Bump type: `minor`
- Verification command to run before freeze or commit: `npm run version:check`

## v2.2.0 - 2026-05-15

Stage: `demo-freeze-candidate`

### Changed

- Add RTX-only local Breeze ASR
- Add a local ASR server for the existing
  `SoybeanMilk/faster-whisper-Breeze-ASR-25` snapshot.
- Require `device=cuda`, `compute_type=int8`, RTX GPU detection, and
  `noCpuFallback: true` for ASR startup and browser responses.
- Route adaptive intake and short patient voice input through the local ASR
  endpoint instead of browser Web Speech.

### Versioning

- Bump type: `minor`
- Verification command to run before freeze or commit: `npm run version:check`

## v2.1.0 - 2026-05-15

Stage: `demo-freeze-candidate`

### Changed

- Add compact 12-question previsit bank
- Preserve the old 41-question bank as `LEGACY_QUESTION_BANK`.
- Make the active runtime `QUESTION_BANK` use `COMPACT_PREVISIT_QUESTION_BANK`
  and cap the patient-facing flow at 12 questions.
- Update adaptive intake copy, freeze checks, and unit coverage for the compact
  previsit handoff design.

### Versioning

- Bump type: `minor`
- Verification command to run before freeze or commit: `npm run version:check`

## v2.0.7 - 2026-05-15

Stage: `demo-freeze-candidate`

### Changed

- Add voice answer matching and simplified patient intake
- Add deterministic visible-option speech matching with optional backend acoustic scores.
- Simplify the short patient route for Taiwan hospital use: click or voice answer, visible confirmation, automatic advance, and 30-second final supplement.

### Versioning

- Bump type: `patch`
- Verification command to run before freeze or commit: `npm run version:check`

## v2.0.6 - 2026-05-15

Stage: `demo-freeze-candidate`

### Changed

- Localize Taiwan hospital interfaces

### Versioning

- Bump type: `patch`
- Verification command to run before freeze or commit: `npm run demo:ready`

## v2.0.5 - 2026-05-15

Stage: `demo-freeze-candidate`

### Changed

- Simplify demo readiness flow

### Versioning

- Bump type: `patch`
- Verification command to run before freeze or commit: `npm run demo:ready`

## v2.0.4 - 2026-05-15

Stage: `demo-freeze-candidate`

### Changed

- Align sample buttons with V2 demo script

### Versioning

- Bump type: `patch`
- Verification command to run before freeze or commit: `npm run version:check`

## v2.0.3 - 2026-05-13

Stage: `demo-freeze-candidate`

### Changed

- Compact answered facts row layout

### Versioning

- Bump type: `patch`
- Verification command to run before freeze or commit: `npm run version:check`

## v2.0.2 - 2026-05-13

Stage: `demo-freeze-candidate`

### Changed

- Simplify adaptive intake page chrome

### Versioning

- Bump type: `patch`
- Verification command to run before freeze or commit: `npm run version:check`

## v2.0.1 - 2026-05-13

Stage: `demo-freeze-candidate`

### Changed

- American English default bilingual adaptive intake UI

### Versioning

- Bump type: `patch`
- Verification command to run before freeze or commit: `npm run version:check`

## v2.0.0 - 2026-05-12

Stage: `demo-freeze-candidate`

### Added

- V2 adaptive-questioning route at `app/adaptive-intake/`.
- Governed urology question bank with `41` questions and metadata-driven ranking.
- Deterministic embedding-style retrieval, gap scoring, safety priority, ambiguity handling, and explanation output.
- V2 freeze gate with `npm run demo:v2-freeze`.
- Version governance with `VERSION.json`, `core/version/index.js`, `docs/versioning-policy.md`, `docs/CHANGELOG.md`, `npm run version:bump`, and `npm run version:check`.
- First-principles readiness audit and post-demo decision capture docs.

### Changed

- The demo positioning moves from fixed-path questionnaire evidence toward ASR-ready adaptive previsit question navigation.
- The V2 mobile layout was corrected after rendered QA found vertical hero text on narrow viewports.

### Safety Boundary

- No LLM runtime.
- No diagnosis, treatment, triage, medication, exam-ordering, or HIS/EMR/EHR integration claim.
- All next questions must come from the governed question bank.
