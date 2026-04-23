# V1 Phase 0 Clinician Review Protocol

Date: 2026-04-23
Artifact under review: `app/v1/`
Review type: synthetic-only expert review

## Purpose

This protocol turns the v1 local product preview into a research-ready clinician/nurse review.

It asks:

> Is the role-separated v1 workflow useful, readable, and safe enough to justify a narrower pilot-readiness discussion?

It does not ask whether the product is ready for real patients, HIS integration, clinical use, or regulatory claims.

## Non-Negotiable Boundary

- Use synthetic cases only.
- Do not enter real patient data.
- Do not enter real names, ID numbers, birthdays, phone numbers, medical-record numbers, queue numbers, appointment numbers, NHI-card details, or hospital identifiers.
- Do not connect to HIS, EMR, EHR, registration, queue, messaging, cloud, or hospital systems.
- Do not ask reviewers to approve diagnosis, treatment, triage, risk scoring, probability output, or autonomous exam ordering.
- Keep exam-prep content as physician/nurse confirmation reminders only.

## Review Roles

| Role | Needed? | Task |
| --- | --- | --- |
| Urology physician | Required | Judges summary usefulness, exam-prep wording, first priority flows, and clinical noise. |
| Nurse or clinic staff | Strongly preferred | Judges missing-field repair, NHI-card handoff wording, waiting-room feasibility, and burden. |
| Product/research note taker | Required | Captures line-level evidence and keeps the boundary. |
| 吳老師 / supervisor | Helpful | Judges research direction, funding/IP/HIS gates, and next artifact. |
| Hospital information office / privacy-security observer | Future | Needed before real systems or data, not required for synthetic Phase 0. |

## Materials

Open:

- v1 route: `http://localhost:4173/app/v1/`
- handoff packet: `docs/v1-mvp-handoff-packet.md`
- scorecard: `docs/research/v1-review-scorecard.md`
- gate register: `docs/research/v1-governance-gate-register.md`

## Task Sequence

### 1. Boundary Check

Ask the reviewer to state what v1 is and is not.

Record:

- safety wording that works
- safety wording that is unclear
- any phrase that sounds like clinical use, diagnosis, triage, treatment, or ordering

Pass condition:

- reviewer understands v1 as synthetic, review-only, and non-production.

### 2. Intake / Waiting-Room Flow

Open the `Intake` tab and select each synthetic case.

Record:

- whether `陽明小幫手` waiting-room framing is correct
- whether `初診 / 回診` branching is enough
- whether no-ID/no-birthday is visible enough
- whether chronic disease, surgery, medication, allergy, and symptom-form collection fit the clinic
- whether answer-source labels are understandable

### 3. Nurse Review

Open the `Nurse` tab.

Record:

- prompts the nurse/staff would ask
- prompts to remove
- prompts that are unclear
- prompts that add burden
- whether exact Chinese/English medication-name repair is actionable
- whether NHI-card handoff wording is acceptable

### 4. Physician Summary

Open the `Physician` tab for each synthetic case.

Use a timer.

Record:

- read time
- three useful lines
- three noisy or unsafe lines
- missing fields
- fields to reorder
- whether the reviewer would use, edit, ignore, or reject the summary

### 5. Exam-Prep Mockup

Open the `Exam Prep` tab.

Record:

- first three priority complaint categories
- acceptable wording
- wording to hide until nurse/physician confirmation
- reminders to remove or rewrite
- any phrase that sounds like the system ordered a test

### 6. Export / Mock API

Open the `Export` tab.

Record:

- fields that belong in future export discussion
- fields to remove
- whether the mock JSON wrongly implies live HIS writeback
- who must approve any real export/API discussion

### 7. Research Gate

Open the `Research` tab and fill the scorecard decision.

Choose one:

- continue
- revise
- narrow
- pause
- governance review before next step

## Metrics

Minimum metrics:

- physician summary read time per case
- physician usefulness rating, 1 to 5
- nurse/staff burden rating, 1 to 5
- safety clarity rating, 1 to 5
- unsafe phrase count
- exam-ordering phrase count
- useful-line count
- noisy-line count
- missing-field count
- selected first three complaint flows
- decision category

## Stop Conditions

Stop and move to governance review if the next proposed step includes:

- real patient data
- real identifiers
- live HIS/EMR/EHR/registration/queue/messaging/cloud use
- autonomous diagnosis, treatment, triage, ordering, risk scores, or probability outputs
- regulatory classification or non-device claim
- unresolved patent/vendor conflict

## Done Definition

Phase 0 is done when:

- `v1-review-scorecard.md` is filled
- unsafe/noisy/useful wording has line-level notes
- first three complaint flows are selected or the scope is narrowed differently
- gate register is updated
- next decision is explicit
- no real patient data was used
