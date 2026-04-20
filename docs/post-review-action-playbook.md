# Post-Review Action Playbook

Use this after a reviewer record has been copied into `docs/meeting-capture-template.md`.

The rule is simple: one review decision creates one next artifact. Do not open a new feature branch, expand the clinical question set, or add integration scope until this artifact is finished and reviewed.

## Inputs

Before choosing work, confirm these exist:

- completed four-case walkthrough
- copied reviewer workbench record
- filled meeting capture template
- one recorded decision: `continue`, `revise`, `narrow`, or `pause`
- one selected smallest next artifact

## Decision-To-Artifact Map

| Decision | Use When | Next Artifact | Done Condition |
| --- | --- | --- | --- |
| Continue | Repeated-question pain, summary usefulness, workflow slot, staff burden, patient fit, existing-process gap, and safety boundary are all acceptable enough. | Revised question tree or one-page summary mockup. | Reviewer evidence maps to the changed question tree or summary mockup, and safety wording remains unchanged. |
| Revise | Value is plausible but wording, summary format, or workflow placement is not ready. | One-page summary mockup or revised question tree. | The specific noisy/risky line, missing information, or unsafe wording from the review is addressed without adding new clinical claims. |
| Narrow | Value is real only for a smaller population, one symptom module, or assisted completion. | Assisted workflow test. | The next artifact explicitly names the narrower population, staff role, workflow slot, and excluded modules. |
| Pause | Safety, workflow slot, staff burden, summary usefulness, or existing-process value blocks the MVP. | Pause note with rejected assumptions. | The pause note lists the blocker evidence and states what evidence would be needed before restarting. |

## Continue Artifact: Revised Question Tree

Use this if the reviewer supports another prototype cycle and the question flow is the clearest next improvement.

Minimum content:

- preserved safety boundary
- questions to keep
- questions to remove
- questions to rewrite
- conditional triggers to keep or change
- one reason for each change, linked to reviewer evidence
- no diagnosis, triage, treatment, or real patient-data behavior

Done when:

- every change maps to captured review evidence
- no new clinical module appears without reviewer evidence
- `npm run smoke` and `npm test` still pass if the demo is changed

## Continue Or Revise Artifact: One-Page Summary Mockup

Use this if the reviewer mainly commented on summary usefulness, scan speed, noisy lines, or missing information.

Minimum content:

- chief concern
- duration / bother
- patient-reported pattern
- priority review statements
- missing information
- medication/context note
- nurse cues
- safety footer

Done when:

- the most useful line is preserved or elevated
- the noisiest/risky line is removed, rewritten, or demoted
- missing information remains visible
- no line implies diagnosis, triage, or treatment

## Narrow Artifact: Assisted Workflow Test

Use this if self-filled completion is not credible but nurse-assisted, family-assisted, or one-module review still seems useful.

Minimum content:

- target population
- staff or helper role
- workflow slot
- included cases or symptom module
- explicitly excluded cases or modules
- staff-burden risk
- success signal for a second review

Done when:

- the narrower flow can be explained in one minute
- staff burden is explicit
- excluded scope is listed
- no production integration or real patient data is introduced

## Pause Artifact: Pause Note With Rejected Assumptions

Use this if the MVP should not continue after the review.

Minimum content:

- decision: pause
- blocker evidence
- rejected assumptions
- what would have to be true to restart
- what not to build next
- where the capture record lives

Done when:

- the blocker is concrete
- the next non-action is clear
- the note prevents accidental feature creep

## Hard Stop

Stop before doing any artifact work if:

- the reviewer record is missing
- there is no explicit decision
- the selected artifact does not match the decision
- the next artifact would require real patient data
- the next artifact would add diagnosis, triage, treatment advice, EHR/HIS/EMR integration, messaging, or scheduling

## Recommended Next Physical Action

After the `2026-04-23` meeting, create one file under a dated review folder, for example:

`docs/reviews/2026-04-23-urology-review/decision-capture.md`

Paste the filled meeting capture template first. Then add only the one next artifact selected by the decision.

The dated review workspace has already been scaffolded for the 2026-04-23 meeting. Keep its status as `pending review` until real reviewer evidence is captured.
