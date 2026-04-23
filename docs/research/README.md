# Research Packet

This folder holds the v1 research-review packet for the safe local product preview.

Use it after opening `app/v1/`. It is designed for reviewer evidence, not production approval.

## Files

- `v1-phase-0-clinician-review-protocol.md`: task-by-task synthetic clinician/nurse review protocol.
- `v1-phase0-review-session-script.md`: timed run sheet for a 30-45 minute reviewer session.
- `v1-phase0-reviewer-ask.md`: LINE/email draft and checklist for asking 許醫師 / 吳老師 to review.
- `v1-phase0-review-capture.md`: live evidence capture sheet for the review session.
- `v1-priority-flow-shortlist.md`: proposed first three complaint flows for Phase 0, pending 許醫師 confirmation.
- `v1-priority-flow-review-worksheet.md`: per-flow worksheet for the first three complaint categories.
- `v1-review-scorecard.md`: fillable scorecard for physician, nurse, staff, and supervisor review.
- `v1-governance-gate-register.md`: privacy, HIS, IP, funding, regulatory, and pilot gates before real-world use.
- `v1-phase0-analysis-template.md`: post-review analysis table for turning scorecard evidence into findings.
- `v1-phase0-decision-memo-template.md`: decision memo template for continue / revise / narrow / pause / governance review.

## Boundary

- Synthetic data only.
- Not for clinical use.
- Physician review required.
- Regulatory status not determined.
- No real patient identifiers.
- No live HIS, EMR, EHR, registration, queue, messaging, cloud, or hospital integration.
- No diagnosis, triage, treatment advice, risk/probability output, or autonomous exam ordering.

The canonical reasoning protocol lives in the thinking repo:

`/home/jnln3799/every_on_git_ubuntu/urology-ai-previsit-thinking-spec/discovery/V1_PHASE0_CLINICIAN_REVIEW_PROTOCOL.md`

## Pre-Session Check

Before a Phase 0 review, start the local static server and run:

```bash
npm run phase0:check
```

If the server is already running on a non-default port, point the check at it:

```bash
UROLOGY_PREVISIT_BASE_URL=http://127.0.0.1:4176 npm run phase0:check
```

This verifies the v1 route, five synthetic cases, live capture sheet, scorecard, priority-flow worksheet, safety boundaries, smoke checks, and tests before reviewer time is used.

## Use Order

1. Run `npm run phase0:check`.
2. Send `v1-phase0-reviewer-ask.md`.
3. Run `v1-phase0-review-session-script.md`.
4. Capture live notes in `v1-phase0-review-capture.md`.
5. Confirm or revise `v1-priority-flow-shortlist.md`.
6. Fill `v1-review-scorecard.md` and `v1-priority-flow-review-worksheet.md`.
7. Summarize with `v1-phase0-analysis-template.md`.
8. Decide with `v1-phase0-decision-memo-template.md`.
9. Update `v1-governance-gate-register.md`.
