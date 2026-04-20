# Product Brief

## Product

Urology AI Previsit MVP

## Primary User

Patients preparing for a urology visit, including older adults or people who may need nurse-assisted input.

## Secondary User

Clinicians who need a short, reviewable previsit summary before entering the room.

## MVP Goal

Show a professional synthetic-data workflow that helps collect common urology previsit information, repair missing fields, and turn patient-provided answers into a clinician-readable summary.

## Core Flow

```text
Patient checks in
-> guided previsit questions
-> missing-information prompts
-> patient or nurse reviews answers
-> physician-facing summary
-> physician confirms, edits, or ignores
-> reviewer captures continue / revise / narrow / pause decision
```

## Success Criteria

- A nontechnical user can complete the flow without instructions.
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
- Symptom category selection.
- Fixed yes/no and multiple-choice questions.
- Optional free-text context.
- Missing-information prompts.
- Final patient review.
- Clinician-facing summary.
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
