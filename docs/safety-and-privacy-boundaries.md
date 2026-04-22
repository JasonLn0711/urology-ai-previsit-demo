# Safety And Privacy Boundaries

## Hard Rules

- Use synthetic data only.
- Do not collect names, phone numbers, addresses, IDs, exact birth dates, account credentials, or real medical record numbers.
- Do not enter real patient data into the demo.
- Do not send answers to a server or external system.
- Demo answers and display preferences may be kept only in browser-local storage for the local walkthrough; they must be reset before any real review with non-synthetic data.
- Do not diagnose, triage, or recommend treatment.
- Do not connect to EHR, HIS, EMR, appointment systems, or messaging systems in MVP.
- Do not imply the summary is clinically complete.
- Do not show nurse, clinician, or reviewer screens inside the patient/family UI.

## Allowed MVP Behavior

- Ask patient-friendly previsit questions.
- Identify missing information.
- Preserve field-level source labels for patient self-report, family operation help, family observation, and nurse supplement.
- Show a nurse-only missing-information repair workbench.
- Show patient-provided priority review statements as clinician-review flags.
- Show nurse workflow cues for completion support, bladder diary instruction, containment support, medication review support, and visibility of priority review statements.
- Generate a concise clinician-facing summary.
- Generate a role-separated visit packet for demo review.
- Export or print synthetic summaries for demo discussion.

## Required Safety Copy

Use these statements in the UI and documentation:

- This demo does not diagnose or recommend treatment.
- A clinician must review all information.
- Use synthetic data only.
- Family can help operate, but patient feelings and family observations are labeled separately.
- Patient/family screens do not show staff workbenches.

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

## Role-Separation Rules

- Patient/family pages may show only patient-friendly questions, reassurance, source selection, confirmation, and display controls.
- Patient/family pages must not link to nurse, clinician, visit-packet, or reviewer screens.
- Nurse pages may show missing fields, source notes, supplemental questions, and neutral review statements.
- Nurse pages must not assign diagnosis, urgency, treatment, or risk level.
- Clinician pages may show concise observations, missing information, source attribution, and neutral review statements.
- Clinician pages must preserve uncertainty and make clear that final judgment remains with the clinician.
