# Changelog

This changelog records meaningful product, demo, safety, question-bank, and evidence-system changes.

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
