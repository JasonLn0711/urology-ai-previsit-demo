# Next Artifact Starters

Use these starters only after `decision-capture.md` is filled and `npm run review:closeout` passes.

Do not edit more than one starter. The selected starter must match the decision and selected artifact recorded in `decision-capture.md`.

## Starter Map

| Decision | Selected Artifact | Starter |
| --- | --- | --- |
| `continue` | `revised question tree` | `revised-question-tree.md` |
| `continue` | `one-page summary mockup` | `one-page-summary-mockup.md` |
| `revise` | `one-page summary mockup` | `one-page-summary-mockup.md` |
| `revise` | `revised question tree` | `revised-question-tree.md` |
| `narrow` | `assisted workflow test` | `assisted-workflow-test.md` |
| `pause` | `pause note with rejected assumptions` | `pause-note-with-rejected-assumptions.md` |

## Use Rule

1. Run `npm run review:closeout`.
2. Copy exactly one starter into the dated review folder or edit exactly one starter in place.
3. Replace all `TBD from reviewer evidence` placeholders using `decision-capture.md`.
4. Run `npm run artifact:check`.
5. Keep the synthetic-data, no-diagnosis, no-triage, and no-treatment boundaries unchanged.

## Stop Conditions

Do not create a next artifact if:

- `decision-capture.md` is still `pending review`
- `npm run review:closeout` fails
- the chosen starter does not match the recorded decision
- the artifact would require real patient data, production integration, diagnosis, triage, or treatment advice
