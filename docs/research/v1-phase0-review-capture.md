# V1 Phase 0 Review Capture

Status: blank current-session capture template
Use with: `http://localhost:4173/app/v1/`

## Purpose

Use this file during the Phase 0 clinician/nurse review.

It is the live evidence capture sheet between the session script and the analysis memo. Keep it synthetic-only and decision-focused.

## Boundary

- Synthetic data only.
- Not for clinical use.
- Physician review required.
- Regulatory status not determined.
- No real patient identifiers.
- No live HIS, EMR, EHR, registration, queue, messaging, cloud, or hospital integration.
- No diagnosis, triage, treatment advice, risk/probability output, or autonomous exam ordering.
- Exam-prep content is confirmation-only.

If a reviewer starts describing a real patient, stop and ask for a generic pattern instead.

## Session Identity

| Field | Value |
| --- | --- |
| Date/time |  |
| Reviewer 1 / role |  |
| Reviewer 2 / role |  |
| Session mode | local / screen-share / other |
| Local route used |  |
| Operator | Jason |
| Real patient data used? | no |

## Boundary Check

| Boundary item | Clear? yes/no | Reviewer note |
| --- | --- | --- |
| Synthetic-only role |  |  |
| Not for clinical use |  |  |
| Physician review required |  |  |
| No real identifiers |  |  |
| No HIS/writeback/live queue |  |  |
| No diagnosis/triage/treatment/risk score |  |  |
| No autonomous exam ordering |  |  |
| Regulatory status not determined |  |  |

Stop condition triggered?

```text

```

## Five-Case Summary Review

Time the physician's first scan of each summary. Record exact section or line names only; do not record real patient details.

| Synthetic case | Priority-flow fit | Read time | Use/edit/ignore/reject | Useful line or section | Noisy/unsafe/missing line | Required fix |
| --- | --- | --- | --- | --- | --- | --- |
| `synthetic-frequency-older-adult` | `頻尿或夜尿` |  |  |  |  |  |
| `synthetic-emptying-difficulty` | `小便困難或尿不出來` |  |  |  |  |  |
| `synthetic-hematuria-occult-blood` | `血尿或健檢發現潛血` |  |  |  |  |  |
| `synthetic-incomplete-leakage` | backup / nurse burden |  |  |  |  |  |
| `synthetic-recurrent-infection-context` | backup / pain-infection wording |  |  |  |  |  |

## Priority Flow Decision

Proposed first three:

1. `頻尿或夜尿`
2. `小便困難或尿不出來`
3. `血尿或健檢發現潛血`

| Flow | Accept / replace / reorder / narrow / pause | Reviewer reason | Replacement, if any |
| --- | --- | --- | --- |
| `頻尿或夜尿` |  |  |  |
| `小便困難或尿不出來` |  |  |  |
| `血尿或健檢發現潛血` |  |  |  |

Decision on first-three default:

```text

```

## Current-System Benchmark Evidence

Use only synthetic inputs, screenshots, or screen-share. Do not enter or record real patient data.

| Benchmark item | Reviewer note |
| --- | --- |
| `聯醫小幫手` functions that v1 should match |  |
| `聯醫小幫手` functions that v1 should intentionally omit |  |
| `陽明小幫手` functions that v1 should match |  |
| `陽明小幫手` functions that v1 should intentionally omit |  |
| Is `初步建議` / `檢查方向` acceptable wording? |  |
| Should v1 include registration help? |  |
| Should v1 include return-visit questioning beyond the rule card? |  |
| Should v1 include waiting-flow explanation? |  |
| Vendor/IP/patent behavior not safe to copy |  |

Benchmark decision:

```text

```

## Nurse / Staff Workflow Evidence

| Question | Evidence |
| --- | --- |
| Which repair prompts would staff actually ask? |  |
| Which prompts add burden? |  |
| Is exact medication-name repair workable? |  |
| Is no-ID/no-birthday visible enough for waiting-room flow? |  |
| Is NHI-card / nurse handoff wording right? |  |
| What would make staff reject this workflow? |  |

Burden rating, where `1` is low burden and `5` is too burdensome:

```text

```

## Exam-Prep Wording Evidence

Use `confirm`, `consider`, or `discuss under clinic SOP`. Do not use order/diagnose/treat language.

| Flow | Reminder topic | Accept / revise / hide | Unsafe words to avoid |
| --- | --- | --- | --- |
| `頻尿或夜尿` | Urinalysis / culture / ultrasound / uroflow / IPSS |  |  |
| `小便困難或尿不出來` | Blood draw / ultrasound / uroflow / IPSS |  |  |
| `血尿或健檢發現潛血` | Blood draw / urinalysis / culture / ultrasound / X-ray |  |  |
| Backup flow |  |  |  |

## Export / Mock API Evidence

| Question | Reviewer note |
| --- | --- |
| Is copyable text useful for physician review? |  |
| Is mock JSON useful for future HIS discussion? |  |
| Which fields should not be exported? |  |
| Does anything imply live HIS writeback? |  |
| Who must approve any future export/API discussion? |  |

## Governance Gate Triggers

Mark any gate that blocks the next step.

| Gate | Triggered? yes/no | Owner or next question |
| --- | --- | --- |
| Funding |  |  |
| IP / patent |  |  |
| Vendor contract / exclusivity |  |  |
| Privacy/security |  |  |
| HIS / information office |  |  |
| Cloud vs local/on-prem deployment |  |  |
| Hardware/RAG acceleration |  |  |
| TFDA/FDA/regulatory wording |  |  |
| IRB / research protocol |  |  |
| Nurse/staff operations |  |  |
| Data-learning loop |  |  |

## Decision

Choose exactly one:

- [ ] Continue
- [ ] Revise
- [ ] Narrow
- [ ] Pause
- [ ] Governance review before next step

Decision statement:

```text

```

Smallest next artifact:

```text

```

What must not be built yet:

```text

```

## Immediate Closeout Checklist

- [ ] Fill `v1-review-scorecard.md`.
- [ ] Fill `v1-priority-flow-review-worksheet.md`.
- [ ] Summarize findings in `v1-phase0-analysis-template.md`.
- [ ] Write the decision in `v1-phase0-decision-memo-template.md`.
- [ ] Update `v1-governance-gate-register.md`.
- [ ] Do not implement new product work until the decision memo names the next artifact.
