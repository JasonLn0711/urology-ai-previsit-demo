# Safety And Privacy Boundaries

## Hard Rules

- Use synthetic data only.
- Do not collect names, phone numbers, addresses, IDs, exact birth dates, account credentials, or real medical record numbers.
- Do not collect real queue numbers, appointment numbers, NHI-card details, or hospital identifiers in v1.
- Do not enter real patient data into the demo.
- Do not send answers to a server or external system.
- Demo answers and display preferences may be kept only in browser-local storage for the local walkthrough; they must be reset before any real review with non-synthetic data.
- Do not diagnose, triage, or recommend treatment.
- Do not connect to EHR, HIS, EMR, appointment systems, or messaging systems in MVP.
- Do not imply the summary is clinically complete.
- Do not show nurse, clinician, or reviewer screens inside the patient/family UI.
- Do not present doctor-provided exam-prep tables as automatic orders or mandatory protocols.

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
- Show doctor/hospital workflow rules as source-derived constraints for review.
- Show exam-prep matrix items only as physician/nurse confirmation reminders.

## Required Safety Copy

Use these statements in the UI and documentation:

- This v1 local product preview is not for clinical use and does not diagnose, triage, recommend treatment, or place exam orders.
- A clinician must review all information.
- Use synthetic data only.
- Family can help operate, but patient feelings and family observations are labeled separately.
- Patient/family screens do not show staff workbenches.
- Waiting-room v1 does not ask ID number or birthday.
- Exam-prep reminders must use "confirm whether appropriate" or equivalent wording.

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

## Doctor / Hospital Source Rules

- `陽明小幫手` v1 is an already-registered waiting-room preview, not live registration support.
- Initial-visit waiting-room flow must not ask ID number or birthday.
- Initial-visit intake may include chronic disease history, operation history, medication history, allergy history, and symptom-specific forms.
- Return-visit intake may ask medication effect, side effects, and follow-up tests the patient wants to discuss.
- Patient-facing handoff should route to clinic nurse/physician confirmation and must not imply the system can open exams by itself.
- Satisfaction survey, follow-up messaging, analytics, and disease-based reminders are future pilot items that require privacy, security, consent, retention, and hospital approval.

## Regulation Review Gates

- Taiwan PDPA and hospital data rules apply before any medical or health-check data collection.
- Electronic medical record or cloud use needs hospital-owned security, access-control, audit, incident, contract, and data-location review.
- TFDA/FDA positioning must remain a review gate; do not claim exemption, approval, or settled non-device status.
