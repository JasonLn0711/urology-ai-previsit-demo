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

Reviewer role: Governance reviewer
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

Meeting evidence:
- Most useful summary line: No line was useful enough to justify workflow change.
- Noisiest or riskiest line: The summary duplicates existing intake work.
- Missing information that matters: Need proof that existing forms fail before adding a new intake layer.
- Unsafe or misleading wording: None recorded.
- Expected workflow slot: No workflow slot.
- Staff burden concern: New intake layer adds unacceptable work.
- Case-specific evidence: Four-case run did not show enough workflow value.

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
