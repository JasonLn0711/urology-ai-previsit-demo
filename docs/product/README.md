# Product

This repository is a local, synthetic-data clinical workflow evidence system for urology previsit preparation.

It is designed to show whether structured patient or family answers can become a clinician-readable summary, nurse repair checklist, visit packet, and reviewer decision record without crossing into diagnosis, triage, treatment advice, or autonomous ordering.

Working brand: `泌尿預診導航` (`UroPrevisit Navigator`). This is separate from 許醫師's current `陽明小幫手` prototype name, which remains benchmark/source context only.

## Entry Points

- Patient/family intake: `http://localhost:4173/app/patient/`
- Patient/family short intake: `http://localhost:4173/app/patient-short/`
- Nurse checklist: `http://localhost:4173/app/nurse/`
- Clinician summary: `http://localhost:4173/app/clinician/`
- Visit packet: `http://localhost:4173/app/clinician/visit-packet/`
- Reviewer decision: `http://localhost:4173/app/reviewer/`
- Reviewer packet: `http://localhost:4173/app/reviewer/packet/`

## Product Boundary

The system is a workflow evidence prototype. It is not clinical software, not a diagnosis engine, not a treatment recommender, and not connected to HIS/EHR systems.

## Short Demo UX Boundary

`app/patient-short/` is the fast walkthrough surface. It keeps the same safety boundary as the full intake while optimizing for a short visible demo: fewer patient-facing topics, one-click auto-advance where safe, left-side progress on desktop, and explicit multi-judgment progress so users can see when a topic has several sub-questions.

## Future Direction Signal

The 2026-05-03 余總 LINE image/message frames `Urgent care intake kiosk with AI triage` as a possible ultimate target, while saying the practical start can be `協助醫生問診`.

For this repository, that means the current product remains the start point: structured urology intake, nurse repair, clinician summary, visit packet, and reviewer evidence. Urgent-care triage, queue reprioritization, risk scoring, and direct HIS connection are future governance / integration topics, not current implementation scope.

Reference: `docs/research/future-urgent-care-ai-triage-reference-2026-05-03.md`.

## Removed From The Old Demo

- The old all-in-one `app/v1` console was removed because it duplicated role surfaces.
- Legacy meeting packets were merged into `docs/reviews/README.md` and `experiments/phase1`.
- Generated sample outputs moved from `docs/samples` into `experiments/phase1/cases`.
