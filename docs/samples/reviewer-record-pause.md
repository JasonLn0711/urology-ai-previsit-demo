---
type: "synthetic-reviewer-record"
decision: "pause"
status: "sample"
---

# Pause Decision Example

> Synthetic sample only. Do not use with real patient data.
> This artifact does not diagnose, triage, or recommend treatment.

```text
Urology previsit MVP reviewer record

Reviewer decision: pause
Decision guide: pause
Recorded decision: pause
Next artifact: Pause note with rejected assumptions

Evidence signals:
- Repeated-question pain: mixed (supporting)
- Summary usefulness: no (blocking)
- Staff burden: unacceptable (blocking)
- Patient or assisted completion: unrealistic (blocking)
- Safety boundary: acceptable (supporting)
- Workflow slot: none (blocking)
- Existing process: sufficient (blocking)

Blockers:
- No workflow slot exists.
- Clinician would not read the summary.
- Staff burden is unacceptable.
- Patient or assisted completion is unrealistic.
- Existing process may already be sufficient.

Safety boundary:
- No diagnosis.
- No triage.
- No treatment advice.
- No real patient data during discovery.
- Clinician review remains required.

Reviewer notes:
The current clinic flow may not have a practical slot for this MVP.
```
