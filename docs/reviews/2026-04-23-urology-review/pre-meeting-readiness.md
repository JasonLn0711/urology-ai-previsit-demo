# 2026-04-23 Pre-Meeting Readiness

Use this on `2026-04-22` shutdown or right before the `2026-04-23 10:00-11:00` review.

## Command

Start the static server in one terminal:

```bash
npm start
```

Run the readiness check in another terminal:

```bash
npm run meeting:check
```

## What The Check Verifies

- required review artifacts exist
- dated decision capture is still `pending review`
- no `continue / revise / narrow / pause` decision has been prefilled
- review packet routes to the dated capture file and action playbook
- generated smoke checks pass
- Node tests pass
- live local URLs return success responses

## Live URLs

- Review packet: `http://localhost:4173/app/review-packet/`
- Reviewer one-page handout: `http://localhost:4173/docs/reviews/2026-04-23-urology-review/reviewer-one-page-handout.md`
- Patient MVP: `http://localhost:4173/app/patient-demo/`
- Clinician summary: `http://localhost:4173/app/clinician-summary/`
- Reviewer workbench: `http://localhost:4173/app/reviewer-workbench/`
- Dated decision capture: `http://localhost:4173/docs/reviews/2026-04-23-urology-review/decision-capture.md`
- Post-review closeout: `http://localhost:4173/docs/reviews/2026-04-23-urology-review/post-review-closeout.md`
- Action playbook: `http://localhost:4173/docs/post-review-action-playbook.md`

## Manual Backup Checklist

- [ ] Review packet opens.
- [ ] Reviewer one-page handout opens.
- [ ] Patient MVP opens.
- [ ] Reviewer workbench opens.
- [ ] `decision-capture.md` is still `pending review`.
- [ ] The four cases are visible in the capture file.
- [ ] No reviewer decision is prefilled.
- [ ] Post-review closeout opens.
- [ ] The action playbook opens.
- [ ] Boundary wording is visible: synthetic data only, no diagnosis, no triage, no treatment advice.

## Meeting-Start Rule

If `npm run meeting:check` fails, fix routing or missing artifacts before starting the review. Do not compensate by making live clinical claims or skipping the capture file.
