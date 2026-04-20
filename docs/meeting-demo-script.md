# Meeting Demo Script

## 60-Second Framing

This is a synthetic-data professional MVP for urology previsit discovery. It does not diagnose, triage, or recommend treatment. The purpose is to test whether guided previsit questions can reduce repeated questioning, keep missing information visible, and give the physician a short, reviewable summary.

Use `docs/mvp-review-packet.md` as the reviewer-facing entrypoint for boundaries, artifact routing, decision criteria, and stop conditions.

## Demo Path

1. Open the review packet.
2. Show the review sequence, artifact map, scorecard, and hard stop boundaries.
3. Open the patient demo.
4. Load a synthetic case.
5. Show the scenario rail and safety boundary.
6. Walk through the source, concern, and core previsit screens.
7. Show how conditional modules appear only when the core answers justify them.
8. Show the missing-information repair step.
9. Review the patient answers, nurse cues, and clinician summary.
10. Show copy/print actions.
11. Open the reviewer workbench.
12. Capture workflow, adoption, safety, and next-artifact signals.
13. Ask what would make the summary useful or unsafe in the real workflow.

## Sample Artifact Path

Use the committed synthetic outputs when a reviewer wants to inspect the handoff outside the browser:

- `docs/samples/README.md`
- `docs/samples/clinician-summary-synthetic-frequency-older-adult.md`
- `docs/samples/clinician-summary-synthetic-emptying-difficulty.md`
- `docs/samples/clinician-summary-synthetic-incomplete-leakage.md`
- `docs/samples/reviewer-record-continue.md`
- `docs/samples/reviewer-record-narrow.md`
- `docs/samples/reviewer-record-revise.md`
- `docs/samples/reviewer-record-pause.md`

Regenerate samples with `npm run samples`.

## Questions For The Physician

- Which parts of this summary would save time?
- Which parts are noise?
- What information must remain physician-led?
- Should the first real version be patient self-filled or nurse-assisted?
- What would make this unacceptable from a privacy or clinical-safety perspective?
- What is the smallest useful next artifact: question tree, mock screen, summary format, or feasibility note?
- Should the decision be continue, revise, narrow, or pause?

## Stop Boundary

Do not promise EHR integration, diagnosis, voice-first AI, or production deployment in this meeting.
