# V1 Phase 0 Analysis Template

Use after the live review capture and scorecard are filled.

Status: not started
Review date:
Reviewers:
Decision:

Source files:

- Live capture: `v1-phase0-review-capture.md`
- Scorecard: `v1-review-scorecard.md`
- Flow worksheet: `v1-priority-flow-review-worksheet.md`
- Gate register: `v1-governance-gate-register.md`

## Evidence Standard

Count only evidence from the review session.

Do not count:

- enthusiasm without a specific line or workflow comment
- assumptions from the builder
- real patient stories
- unreviewed regulatory or deployment claims

## Quantitative Summary

| Metric | Result | Notes |
| --- | ---: | --- |
| Synthetic cases reviewed |  |  |
| Physician summary median read time |  |  |
| Boundary clarity score |  |  |
| Physician summary usefulness score |  |  |
| Nurse/staff burden score, 5 = too burdensome |  |  |
| Unsafe wording count |  |  |
| Exam-ordering wording count |  |  |
| Useful-line count |  |  |
| Noisy-line count |  |  |
| Missing-field count |  |  |
| Priority complaint flows selected |  |  |

## Qualitative Findings

### What Worked

| Finding | Evidence | Implication |
| --- | --- | --- |
|  |  |  |

### What Was Noisy

| Finding | Evidence | Fix |
| --- | --- | --- |
|  |  |  |

### What Was Unsafe Or Too Close To Clinical Action

| Finding | Evidence | Required response |
| --- | --- | --- |
|  |  |  |

### What Was Missing

| Missing item | Reviewer role | Next action |
| --- | --- | --- |
|  |  |  |

## First Three Complaint Flows

Proposed default before reviewer confirmation:

- 頻尿或夜尿
- 小便困難或尿不出來
- 血尿或健檢發現潛血

If the reviewer changes these, record the change and why.

| Flow | Selected? | Reviewer reason | v1 change needed |
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

## Decision Rule

Choose one.

### Continue

Use only if:

- physician would read the summary
- nurse/staff burden is acceptable
- at least three flows have confirmation-only wording direction
- no safety boundary broke

### Revise

Use if:

- summary or nurse workflow is useful but wording/order/fields need repair

### Narrow

Use if:

- only a smaller symptom cluster or handoff moment is justified

### Pause

Use if:

- summary would not be read
- burden is too high
- safety wording cannot be fixed
- no workflow slot exists

### Governance Review Before Next Step

Use if the next step requires:

- real patient data
- HIS/registration/messaging/cloud
- IP/vendor review
- regulatory classification review
- IRB or hospital research approval

## Recommended Next Artifact

| Field | Notes |
| --- | --- |
| Artifact |  |
| Owner |  |
| Reviewer |  |
| Due date |  |
| Done definition |  |
| Explicit non-goals |  |

## Do Not Build Yet

List every tempting expansion that the review did not justify.

- TBD from reviewer evidence.
