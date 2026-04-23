# V1 Phase 0 Decision Memo Template

Status: not started
Date:
Prepared by:
Reviewers:

## Decision

Choose one:

- continue
- revise
- narrow
- pause
- governance review before next step

Decision statement:

```text

```

## Why This Decision

| Evidence | Supports | Notes |
| --- | --- | --- |
|  |  |  |

## What Changed

| Area | Before review | After review |
| --- | --- | --- |
| First three complaint flows | unknown |  |
| Physician summary order | unvalidated |  |
| Nurse repair burden | unvalidated |  |
| Exam-prep wording | source-derived draft |  |
| Export/mock API | mock discussion artifact |  |
| Current-system benchmark | unvalidated |  |
| Cloud vs local/on-prem expectation | unvalidated |  |
| Governance gates | open |  |

## Accepted Changes

These are allowed because the review evidence supports them.

- TBD from reviewer evidence.

## Rejected Or Deferred Changes

These are not allowed yet.

- TBD from reviewer evidence.

## Safety Boundary

Still true after the review:

- synthetic data only until a separate governance decision
- not for clinical use
- physician review required
- regulatory status not determined
- no diagnosis, triage, treatment advice, risk/probability output, or autonomous exam ordering
- no live HIS, EMR, EHR, registration, queue, messaging, cloud, or hospital integration
- no copying current Argon app internals without permission
- no local/on-prem deployment claim unless security, maintenance, and hospital owners approve

## Governance Owners To Identify

| Gate | Owner | Next question |
| --- | --- | --- |
| Funding |  |  |
| IP / patent |  |  |
| Vendor relationship |  |  |
| Privacy/security |  |  |
| HIS / information office |  |  |
| Regulatory |  |  |
| IRB / research ethics |  |  |
| Nurse/staff operations |  |  |
| Current-system benchmark / Argon app permission |  |  |
| Cloud vs local/on-prem architecture |  |  |

## Next Artifact

| Field | Notes |
| --- | --- |
| Artifact |  |
| Purpose |  |
| Owner |  |
| Reviewer |  |
| Due date |  |
| Done definition |  |

## Stop Conditions

Stop again if:

- real patient data is requested before governance approval
- HIS or registration integration becomes the next artifact
- wording drifts into diagnosis, treatment, triage, or ordering
- IP/vendor boundaries remain unclear
- no nurse/staff workflow reviewer can validate burden
- the next build requires copying current Argon app behavior before permission is clear
- local/on-prem or hardware/RAG acceleration becomes a deliverable before security and maintenance owners are named
