# Product

This repository is a local, synthetic-data clinical workflow evidence system for urology previsit preparation.

It is designed to show whether structured patient or family answers can become a clinician-readable summary, nurse repair checklist, visit packet, and reviewer decision record without crossing into diagnosis, triage, treatment advice, or autonomous ordering.

## Entry Points

- Patient/family intake: `http://localhost:4173/app/patient/`
- Nurse checklist: `http://localhost:4173/app/nurse/`
- Clinician summary: `http://localhost:4173/app/clinician/`
- Visit packet: `http://localhost:4173/app/clinician/visit-packet/`
- Reviewer decision: `http://localhost:4173/app/reviewer/`
- Reviewer packet: `http://localhost:4173/app/reviewer/packet/`

## Product Boundary

The system is a workflow evidence prototype. It is not clinical software, not a diagnosis engine, not a treatment recommender, and not connected to HIS/EHR systems.

## Future Direction Signal

The 2026-05-03 余總 LINE image/message frames `Urgent care intake kiosk with AI triage` as a possible ultimate target, while saying the practical start can be `協助醫生問診`.

For this repository, that means the current product remains the start point: structured urology intake, nurse repair, clinician summary, visit packet, and reviewer evidence. Urgent-care triage, queue reprioritization, risk scoring, and direct HIS connection are future governance / integration topics, not current implementation scope.

Reference: `docs/research/future-urgent-care-ai-triage-reference-2026-05-03.md`.

## Removed From The Old Demo

- The old all-in-one `app/v1` console was removed because it duplicated role surfaces.
- Legacy meeting packets were merged into `docs/reviews/README.md` and `experiments/phase1`.
- Generated sample outputs moved from `docs/samples` into `experiments/phase1/cases`.
