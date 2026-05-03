# Phase 1 Experiment Plan

## Objective

Evaluate whether the role-separated urology previsit workflow turns synthetic patient answers into a safer and more useful visit-preparation packet than a static demo alone.

## Hypothesis

If the system uses one canonical intake record, centralized summary logic, field-level attribution, and explicit safety enforcement, then reviewers will find that it reduces repeated questioning, keeps missing information visible, and preserves trust because every output requires physician review.

## Inputs

- Synthetic cases from `data/synthetic_cases`.
- Patient answers stored in browser `localStorage` during local demo use.

## Metrics

| metric | definition | capture method |
| --- | --- | --- |
| time_saved | Reviewer-estimated minutes saved before or during the visit. | `human_feedback.time_saved_minutes` in each log. |
| missing_field_reduction | Count or percent of clinically useful missing fields repaired by the nurse view. | Compare `system_output.missing_fields` before and after nurse repair. |
| clinician_trust | 1-5 reviewer score for summary usefulness, source visibility, and safety boundary. | `human_feedback.clinician_trust_score` in each log. |

## Procedure

1. Run `npm run experiment:phase1`.
2. Open `http://localhost:4173/app/patient/`, `app/nurse/`, `app/clinician/`, and `app/clinician/visit-packet/`.
3. Review each case log in `experiments/phase1/logs/`.
4. Fill human feedback in the log JSON files.
5. Update `scorecard.md`.
6. Write `decision-memo.md`.

## Stop Rules

- Stop if any output implies diagnosis, triage, treatment advice, or exam ordering.
- Stop if source attribution is missing from clinician-facing output.
- Stop if missing fields are hidden or silently converted into conclusions.
- Stop if the reviewer cannot tell that physician review is required.

## 2026-05-03 Future-Triage Reference

余總's `Urgent care intake kiosk with AI triage` reference is a future-direction signal, not a Phase 1 feature request.

Phase 1 may ask one reviewer-facing question:

> If this workflow later becomes a Taiwan-local urgent-care or clinic-intake system, which parts should stay as physician history-taking support, and which parts would require separate triage, HIS, privacy/security, or regulatory governance?

Do not add risk scores, urgency labels, queue ordering, or HIS fields to Phase 1 logs before a separate decision memo explicitly approves that scope.
