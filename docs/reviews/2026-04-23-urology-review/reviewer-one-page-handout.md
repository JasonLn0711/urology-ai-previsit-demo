# Reviewer One-Page Handout

Use this handout at the start of the `2026-04-23 10:00-11:00` urology previsit MVP review.

## Review Goal

Decide whether this synthetic previsit workflow improves readiness enough to justify one more prototype artifact.

The meeting should produce exactly one decision and one smallest next artifact.

## Non-Negotiable Boundary

- Synthetic data only.
- No diagnosis.
- No triage.
- No treatment advice.
- No real patient identifiers.
- No EHR, HIS, EMR, scheduling, or messaging integration in MVP.
- Clinician review remains required.

Stop the review if any screen or sample crosses this boundary.

## What To Judge

| Lens | Judge This |
| --- | --- |
| Patient / helper | Can the questions be answered without pressure to guess? |
| Nurse / staff | Can staff see missing information and completion-support needs quickly? |
| Clinician | Is the summary useful in under one minute before or during the visit? |
| Workflow | Is there a realistic slot: before visit, check-in, nurse rooming, or none? |
| Governance | Does the MVP stay review-only and safer than free-form scope expansion? |

## Four Cases To Scan

| Case | Why It Exists | Main Question |
| --- | --- | --- |
| Frequent urination at night | Storage symptoms, nocturia, diary feasibility, and medication/context cues. | Would this reduce repeated frequency/nocturia questioning? |
| Difficulty emptying | Weak stream, straining, incomplete emptying, and neutral priority-review wording. | Does the wording stay useful without becoming triage? |
| Incomplete leakage intake | Missing information, assisted completion, leakage gap, and containment cue. | Would staff know what to clarify before the physician enters? |
| Recurrent infection context | Repeated symptom history without diagnosing infection. | Is this history useful previsit, or should it remain physician-led? |

## Decision Choices

| Decision | Use When | Next Artifact |
| --- | --- | --- |
| Continue | Workflow pain, summary value, workflow slot, staff burden, and safety boundary are acceptable. | Revised question tree or one-page summary mockup. |
| Revise | Value is plausible, but wording, summary format, or workflow placement needs repair. | One-page summary mockup or revised question tree. |
| Narrow | Value exists only for assisted completion, selected patients, or one symptom module. | Assisted workflow test. |
| Pause | Safety, workflow slot, staff burden, summary usefulness, or existing process blocks the MVP. | Pause note with rejected assumptions. |

## Evidence To Capture

- one most useful summary line
- one noisy, risky, or unnecessary line
- one missing-information point that matters
- expected workflow slot
- staff burden concern
- one final decision: `continue`, `revise`, `narrow`, or `pause`
- one smallest next artifact

## Meeting Links

- Review packet: `http://localhost:4173/app/review-packet/`
- Patient MVP: `http://localhost:4173/app/patient-demo/`
- Clinician summary: `http://localhost:4173/app/clinician-summary/`
- Reviewer workbench: `http://localhost:4173/app/reviewer-workbench/`
- Decision capture: `http://localhost:4173/docs/reviews/2026-04-23-urology-review/decision-capture.md`
