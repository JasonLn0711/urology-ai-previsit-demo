# V1 Clinician/Nurse Review Scorecard

Review date:
Reviewer:
Reviewer role:
Route: `http://localhost:4173/app/v1/`
Synthetic cases reviewed:

## Boundary Confirmation

- [ ] Synthetic data only.
- [ ] Not for clinical use.
- [ ] Physician review required.
- [ ] Regulatory status not determined.
- [ ] No real patient identifiers entered.
- [ ] No live HIS, EMR, EHR, registration, queue, messaging, or hospital integration.
- [ ] No diagnosis, triage, treatment advice, risk/probability output, or autonomous exam ordering.
- [ ] Exam-prep content is confirmation-only.

If any item above is unchecked, stop and record why.

## Quick Scores

Use `1` low / poor and `5` high / excellent, except burden where `5` means too burdensome.

| Item | Score | Notes |
| --- | ---: | --- |
| Boundary clarity |  |  |
| Intake usefulness |  |  |
| Source-label usefulness |  |  |
| Nurse repair usefulness |  |  |
| Physician summary usefulness |  |  |
| Exam-prep wording safety |  |  |
| Export/mock API usefulness for discussion |  |  |
| Current-system benchmark clarity |  |  |
| Staff burden, where 5 is too burdensome |  |  |
| Overall continue value |  |  |

## Summary Read-Time

| Synthetic case | Read time | Would use / edit / ignore / reject | Notes |
| --- | --- | --- | --- |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |

Target for v1 review: physician can understand the summary in under 60 seconds, or can name exactly what must be shortened.

## Useful Lines

Record exact line or section names, not patient data.

| Surface | Useful line / field | Why useful |
| --- | --- | --- |
| Intake |  |  |
| Nurse |  |  |
| Physician |  |  |
| Exam Prep |  |  |
| Export |  |  |

## Noisy / Unsafe / Missing

| Surface | Line / field | Problem type: noisy / unsafe / missing / wrong order | Fix |
| --- | --- | --- | --- |
| Intake |  |  |  |
| Nurse |  |  |  |
| Physician |  |  |  |
| Exam Prep |  |  |  |
| Export |  |  |  |

## Exam-Prep Matrix Review

Choose first three priority complaint categories for the next v1 refinement.

Proposed default for review: `頻尿或夜尿`, `小便困難或尿不出來`, and `血尿或健檢發現潛血`. This is not a clinical priority claim; it is a reviewer-session default pending 許醫師 confirmation.

| Complaint category | Priority: first 3 / later / remove | Wording approved? | Notes |
| --- | --- | --- | --- |
| 血尿或健檢發現潛血 |  |  |  |
| 突發腰痛 |  |  |  |
| 小便困難或尿不出來 |  |  |  |
| 頻尿或夜尿 |  |  |  |
| 尿失禁 |  |  |  |
| 剛診斷為攝護腺癌 |  |  |  |
| 抽血發現 PSA 升高 |  |  |  |
| 陰囊或睪丸腫痛 |  |  |  |
| 生殖器紅腫或搔癢 |  |  |  |
| 性功能問題 |  |  |  |
| 健檢發現腎臟水泡或腫瘤 |  |  |  |
| 小便有泡泡 |  |  |  |

## Priority Flow Worksheet

After choosing the first three, fill:

`docs/research/v1-priority-flow-review-worksheet.md`

## Current-System Benchmark

Use `docs/research/v1-current-system-benchmark-table.md`.

| Question | Reviewer answer |
| --- | --- |
| Which current `聯醫小幫手` / `陽明小幫手` functions must v1 match? |  |
| Which current functions should v1 intentionally omit? |  |
| Which functions belong to Phase 1 or later? |  |
| Which items require governance review before implementation? |  |
| Is `初步建議` / `檢查方向` acceptable wording, or should v1 stay confirmation-only? |  |
| Is any current app behavior vendor/IP/confidential and not safe to copy? |  |

## Governance Gate Notes

| Gate | Reviewer note | Owner to ask |
| --- | --- | --- |
| Funding |  |  |
| IP / patent |  |  |
| Vendor contract / exclusivity |  |  |
| Privacy/security |  |  |
| HIS / information office |  |  |
| TFDA/FDA/regulatory wording |  |  |
| IRB / research protocol |  |  |
| Nurse/staff operations |  |  |
| Current-system benchmark / Argon app permission |  |  |
| Cloud vs local/on-prem deployment |  |  |

## Decision

Choose one:

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
