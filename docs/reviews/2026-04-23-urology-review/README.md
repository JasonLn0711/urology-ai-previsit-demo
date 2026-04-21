# 2026-04-23 Urology Review Workspace

This folder is the dated evidence workspace for the `2026-04-23` urology previsit MVP review.

Do not pre-fill reviewer conclusions before the meeting. The only valid pre-meeting state is `pending review`.

## Use Order

1. Open `http://localhost:4173/app/review-packet/`.
2. Run the four-case walkthrough from `../../meeting-demo-script.md`.
3. Capture reviewer signals in `http://localhost:4173/app/reviewer-workbench/`.
4. Copy the reviewer workbench record.
5. Paste it into `decision-capture.md`.
6. Select exactly one next artifact from `../../post-review-action-playbook.md`.
7. Run `npm run review:closeout` before creating that artifact.
8. Fill exactly one matching starter from `artifact-starters/`.
9. Run `npm run artifact:check` before treating the selected artifact as ready.

## Files

| File | Purpose |
| --- | --- |
| `reviewer-one-page-handout.md` | Reviewer-facing one-page goal, boundary, four-case scan, decision choices, and evidence checklist. |
| `pre-meeting-readiness.md` | Command/checklist for confirming the review stack is live and still pending before the meeting starts. |
| `post-review-closeout.md` | Command/checklist for confirming reviewer evidence is complete before one next artifact is created. |
| `artifact-starters/` | Evidence-gated starters for the one selected artifact after closeout passes. |
| `decision-capture.md` | Holds the filled meeting capture template, copied reviewer record, and the selected next artifact after the review. |

## Boundary

- Synthetic data only.
- No diagnosis.
- No triage.
- No treatment advice.
- No real patient identifiers.
- No EHR, HIS, EMR, scheduling, or messaging integration.
- Clinician review remains required.

## Completion Rule

This folder is complete only when `decision-capture.md` contains:

- reviewer role
- four-case evidence
- decision signals
- one decision: `continue`, `revise`, `narrow`, or `pause`
- one smallest next artifact
- copied reviewer workbench record

If any of those are missing after the meeting, leave the status as `pending follow-up`.

## Source Of Truth

- `decision-capture.md` owns reviewer evidence and the selected next artifact.
- `../../post-review-action-playbook.md` owns the decision-to-artifact rules.
- `artifact-starters/` owns the blank artifact shapes only; starters do not choose work.
- This folder is the dated workspace. Do not create a second 2026-04-23 review folder unless the meeting is split into a separate follow-up review.
