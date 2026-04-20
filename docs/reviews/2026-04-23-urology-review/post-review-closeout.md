# 2026-04-23 Post-Review Closeout

Use this immediately after the urology previsit MVP review, before creating any next artifact.

## Purpose

Convert the meeting into one durable decision and one smallest next artifact.

This closeout does not add clinical scope. It only checks that reviewer evidence was captured well enough to choose the next bounded artifact.

## Command

After filling `decision-capture.md`, run:

```bash
npm run review:closeout
```

The command should fail before the meeting because `decision-capture.md` is still `pending review`.

## Required Capture State

- `Status: complete`
- all boundary checklist items checked
- reviewer role filled
- all four case rows filled
- all decision-signal rows marked `supporting`, `uncertain`, or `blocking`
- one final decision: `continue`, `revise`, `narrow`, or `pause`
- one smallest next artifact
- selected artifact matches the decision
- copied reviewer workbench record is pasted

## If Evidence Is Incomplete

Set `Status: pending follow-up` in `decision-capture.md`.

Do not create a next artifact yet. First fill the missing evidence or schedule one follow-up question.

## Artifact Gate

Only after `npm run review:closeout` passes:

1. Open `../../post-review-action-playbook.md`.
2. Open `artifact-starters/README.md`.
3. Create exactly one selected artifact from the matching starter.
4. Link the artifact back to `decision-capture.md`.
5. Keep synthetic-data, no-diagnosis, no-triage, and no-treatment boundaries unchanged.

## Hard Stops

Do not proceed if the next artifact would require:

- real patient data
- diagnosis or urgency assignment
- treatment advice
- EHR, HIS, EMR, scheduling, messaging, or production integration
- a new clinical module not supported by reviewer evidence
