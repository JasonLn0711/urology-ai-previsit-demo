# Changelog

This changelog records meaningful product, demo, safety, question-bank, and evidence-system changes.

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
