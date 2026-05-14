# Reviews

Reviewer work has one job: decide whether the workflow should continue, be revised, or stop based on evidence.

## Decision Inputs

- Role-separated UI review.
- Phase 1 logs.
- Scorecard metrics: `time_saved`, `missing_field_reduction`, `clinician_trust`.
- Safety boundary checks.

## Decision Outputs

- Reviewer workbench record from `app/reviewer/`.
- Experiment decision in `experiments/phase1/decision-memo.md`.

## Decision Scale

- `continue`: evidence supports another prototype cycle.
- `revise`: value exists, but workflow, wording, source attribution, or burden needs repair.
- `stop`: no safe or useful workflow value is demonstrated.
