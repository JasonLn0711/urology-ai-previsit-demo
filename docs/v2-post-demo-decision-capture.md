# V2 Post-Demo Decision Capture

Use this immediately after a rehearsal, backup recording, or stakeholder demo.

## Session

- Date:
- Audience:
- Location / route:
- Demo operator:
- Route used:
- Product version:
- Changelog entry:
- Backup recording created? `yes / no`

## Commands Run

```text
npm run version:check:
npm test:
npm run smoke:
npm run demo:v2-freeze:
git diff --check:
route check:
```

## Three-Case Results

| Case | Input | Expected selected question | Actual selected question | Pass? | Notes |
| --- | --- | --- | --- | --- | --- |
| A nocturia | `I wake up several times at night to pee.` | `nocturia_count` |  |  |  |
| B dysuria | `It burns when I pee.` | `pain_burning` |  |  |  |
| C vague pain | `I feel pain down there.` | `clarify_pain_location` |  |  |  |

## Stakeholder Questions

| Question asked | Answer given | Follow-up needed? | Owner |
| --- | --- | --- | --- |
|  |  |  |  |

## Boundary Check

Mark any boundary that was challenged or unclear:

```text
[ ] diagnosis
[ ] treatment / medication
[ ] exam ordering
[ ] triage / queue priority
[ ] real patient data
[ ] HIS / EHR / EMR integration
[ ] LLM runtime
[ ] production deployment
[ ] IP / vendor / hospital ownership
```

## Decision

Choose exactly one:

```text
[ ] continue: current demo is credible enough for the next stakeholder walkthrough
[ ] revise: fix wording, UI, ranking, or runbook before showing again
[ ] narrow: reduce the demo to one strongest case
[ ] pause: wait for stakeholder, clinical, governance, or deployment clarification
[ ] split: move the request to another repo/project because it is not urology previsit
```

## Evidence

- Screenshot / recording path:
- Version shown in recording? `yes / no`
- Notes path:
- Related planning locator:

## Next Smallest Action

Write one action only:

```text

```
