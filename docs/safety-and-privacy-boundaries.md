# Safety And Privacy Boundaries

## Hard Rules

- Use synthetic data only.
- Do not collect names, phone numbers, addresses, IDs, exact birth dates, account credentials, or real medical record numbers.
- Do not store answers after the page is refreshed.
- Do not diagnose, triage, or recommend treatment.
- Do not connect to EHR, HIS, EMR, appointment systems, or messaging systems in MVP.
- Do not imply the summary is clinically complete.

## Allowed MVP Behavior

- Ask patient-friendly previsit questions.
- Identify missing information.
- Show patient-provided priority review statements as clinician-review flags.
- Show nurse workflow cues for completion support, bladder diary instruction, containment support, medication review support, and visibility of priority review statements.
- Generate a concise clinician-facing summary.
- Export or print synthetic summaries for demo discussion.

## Required Safety Copy

Use these statements in the UI and documentation:

- This demo does not diagnose or recommend treatment.
- A clinician must review all information.
- Use synthetic data only.

## Priority Review Wording

Use neutral observation language:

- "Reports visible blood or clots in urine."
- "Reports fever."
- "Reports chills."
- "Reports currently being unable to urinate."

Do not use diagnostic language:

- "Likely UTI."
- "Probable cancer."
- "Needs catheter."
- "Treat with medication."
