# Product Brief

## Product

Urology AI Previsit MVP

## Primary User

Patients preparing for a urology visit, especially older adults who need a calmer way to explain symptoms before the physician enters.

Family members or helpers may assist operation, but their observations must stay labeled separately from the patient's own answers.

## Secondary Users

- Nurses or clinic staff who need to see what is missing and ask only the necessary supplemental questions.
- Clinicians who need a short, reviewable previsit summary before entering the room.
- Reviewers who need to judge whether the workflow should continue, revise, narrow, or pause.

## MVP Goal

Show a professional synthetic-data workflow that helps an older patient state the problem with less anxiety, lets family help without confusing the answer source, automatically finds missing fields for nursing repair, and turns the repaired information into a clinician-readable previsit scan.

## Core Flow

```text
Patient checks in
-> patient/family guided previsit questions
-> patient/family confirmation page
-> answer-source labels preserved per field
-> nurse missing-information workbench
-> nurse supplemental questions and source checks
-> physician-facing previsit summary
-> role-separated visit packet
-> physician confirms, edits, or ignores
-> reviewer captures continue / revise / narrow / pause decision
```

## Success Criteria

- A nontechnical user can complete the flow without instructions.
- The patient/family UI does not expose nurse, physician, or reviewer screens or staff-only language.
- Family-assisted answers are source-labeled so subjective patient feelings and helper observations are not blended.
- Nursing staff can see missing fields and ask concrete supplemental questions without diagnosing.
- The summary is readable in under 60 seconds.
- The demo never diagnoses, triages, or recommends treatment.
- The demo works without real patient data.
- Missing information remains visible instead of being hidden.
- Reviewer feedback can be captured as a decision record.
- The meeting audience can judge whether the workflow is worth prototyping.

## MVP Scope

- Large-button question flow.
- Synthetic scenario rail.
- Stepper and completion status.
- Patient/family-only intake and confirmation.
- Field-level source labels for patient self-report, family operation help, family observation, and nurse supplement.
- Governed core question set.
- Conditional modules for storage, leakage, voiding, visible blood/clots, pain/infection-related context, and medication/context.
- Fixed yes/no, not-sure, multiple-choice, and checkbox questions.
- Optional free-text context.
- Missing-information prompts.
- Nurse missing-information workbench with supplemental questions.
- Final patient/family confirmation wording.
- Clinician-facing summary.
- Nurse workflow cues and source checks.
- Role-separated visit packet.
- Copy and print summary actions.
- Reviewer decision workbench.
- Copy and print reviewer record actions.
- Synthetic sample summaries and reviewer records.

## Out of Scope

- Real patient-data storage.
- Voice-first AI interview.
- Diagnosis or treatment recommendations.
- EHR/HIS/EMR integration.
- Autonomous triage.
- Model-driven medical judgment.
- Showing staff-only screens or staff-only instructions inside the patient/family UI.
