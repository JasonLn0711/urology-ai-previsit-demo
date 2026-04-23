# V1 Current-System Benchmark Table

Date: 2026-04-23
Scope: Phase 0 comparison against doctor-provided current Argon links

Use this table before any Phase 1 decision. It is not a product backlog and not permission to copy vendor behavior.

## Source Links

| Current app | Link | Public metadata observed | v1 implication |
| --- | --- | --- | --- |
| `聯醫小幫手` | `https://chat.argon.chat/visitor?guid=rmw6oqqxgy` | Broader helper for urinary abnormalities, stones, health-check abnormalities, and preliminary suggestions / exam direction. | Treat `初步建議` and `檢查方向` as review risks. Do not add autonomous advice in v1. |
| `陽明小幫手` | `https://chat.argon.chat/visitor?guid=avp6dg160g` | Outpatient physician assistant for registration, return-visit questioning, and waiting-flow explanation. | Fits the waiting-room story, but registration and real workflow support remain out of v1 unless explicitly approved. |

## Boundary

- Use synthetic inputs, screenshots, or screen-share only.
- Do not enter real patient data.
- Do not copy prompt logic, chat transcripts, vendor internals, or private settings.
- Do not treat public metadata as regulatory, IP, privacy, or hospital approval.
- Record reviewer decisions as `match`, `omit`, `defer`, or `governance review`.

## Benchmark Decisions To Fill During Phase 0

| Function / wording | Current-system signal | Safe-local v1 status | Phase 0 decision | Notes / owner |
| --- | --- | --- | --- | --- |
| Already-registered waiting-room intake | Strongly aligned with `陽明小幫手` meeting story. | Match in v1 as synthetic preview. |  |  |
| Initial / return visit branch | Supported by 許醫師 QA and current `陽明小幫手` metadata. | Match in v1 as synthetic logic. |  |  |
| No ID / birthday in initial-visit waiting-room intake | Supported by 許醫師 QA. | Match in v1. |  |  |
| Registration help | Mentioned in current `陽明小幫手` metadata. | Omit from v1. |  | Requires hospital workflow and privacy review. |
| Waiting-flow explanation | Mentioned in current `陽明小幫手` metadata. | Defer or add only as non-operational wording. |  | Ask whether this belongs in v1 UI or handoff docs. |
| Return-visit questioning | Mentioned in current `陽明小幫手` metadata and QA source. | Partly match as synthetic rule card. |  | Decide whether to add a dedicated return-visit synthetic case. |
| Preliminary suggestions / `初步建議` | Mentioned in current `聯醫小幫手` metadata. | Omit from v1. |  | Review exact wording with 許醫師 and regulatory/privacy owners. |
| Exam direction / `檢查方向` | Mentioned in current `聯醫小幫手` metadata. | Omit autonomous wording; keep confirmation-only reminders. |  | Use `confirm whether appropriate`, not `order`. |
| Physician summary | Core v1 hypothesis. | Match as copyable synthetic summary. |  | Measure read time and usefulness. |
| Nurse missing-field repair | Core v1 hypothesis. | Match as nurse review tab. |  | Nurse/staff reviewer required. |
| Mock export / future HIS artifact | Future discussion need. | Defer real integration; show mock only. |  | Needs information-office approval before Phase 1. |
| Cloud vs local/on-prem deployment | Discussed in same-day 吳老師 follow-up. | Omit from v1 implementation. |  | Governance/architecture gate before Phase 1. |
| Hardware / RAG acceleration / local box | Discussed as possible future experiment. | Omit from v1 implementation. |  | Do not make v1 depend on hardware procurement. |

## Phase 0 Output

After the review, this page should be filled enough to answer:

1. What must v1 match before the April 30 package?
2. What must v1 intentionally omit?
3. What can wait for Phase 1?
4. What requires governance review before any implementation?
5. What current-system behavior cannot be copied because of vendor/IP/confidentiality boundaries?
