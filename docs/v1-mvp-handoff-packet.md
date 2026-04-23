# Urology AI Previsit v1 MVP Handoff Packet

Date: 2026-04-23
Deadline: 2026-04-30
Product route: `http://localhost:4173/app/v1/`

Current verified local fallback on 2026-04-23: `http://127.0.0.1:4176/app/v1/`

## Product Position

`v1` is a safe local MVP product preview for physician-reviewed urology previsit summary and exam-preparation support.

It is meant to show the workflow and decision gates before clinical deployment:

- patient / family source-labeled intake
- nurse missing-information repair
- physician previsit summary
- physician-confirmed exam-prep reminders
- copyable text summary
- mock JSON export for future HIS discussion
- research and commercialization decision gates
- `陽明小幫手` waiting-room flow rules from 許醫師's QA file

## Current System Benchmark Links

Doctor/hospital-provided Argon links:

| Current app | Link | Public metadata observed |
| --- | --- | --- |
| `聯醫小幫手` | `https://chat.argon.chat/visitor?guid=rmw6oqqxgy` | Helps users understand urinary abnormalities, stones, or health-check abnormalities, and mentions preliminary suggestions / exam direction. |
| `陽明小幫手` | `https://chat.argon.chat/visitor?guid=avp6dg160g` | Outpatient physician assistant for registration, return-visit questioning, and waiting-flow explanation. |

Use these as benchmark references only. Do not copy runtime behavior, enter real patient data, or treat public metadata as regulatory clearance.

Immediate implication: v1 should remain stricter than the current public wording. `初步建議` and `檢查方向` should be reviewed as physician/nurse-confirmed wording before any product surface uses them.

## Boundary

- Synthetic data only.
- Not for clinical use.
- Physician review required.
- Regulatory status not determined.
- No real patient data.
- No diagnosis, triage, treatment advice, autonomous exam ordering, or live HIS / EMR / EHR / registration integration.
- HIS appears only as copyable export text and a mock API payload.
- No real ID number, birthday, phone, medical-record number, appointment action, messaging, or live queue handling.
- Any queue/name fields in v1 are synthetic placeholders only.

## Why v1 Exists

The 2026-04-23 meeting with 許富順醫師 reframed the project from a simple review demo into a possible clinic-throughput infrastructure project.

The strongest value hypothesis is:

> Move structured chief complaint, history, missing-field repair, and exam-prep context before the physician enters, so physician time is spent confirming and deciding rather than repeatedly collecting the same information.

`v1` tests that hypothesis without pretending the product is ready for real patients or hospital integration.

## Source Update From 許醫師

The LINE follow-up materials add concrete doctor/hospital rules:

- v1 should lead with `陽明小幫手`: already-registered patients in the waiting room, using clinic-specific QR in a future real system.
- `初診` should not ask ID number or birthday.
- `初診` should collect chronic disease history, operation history, medication history, allergies, and symptom-specific forms.
- `回診` should ask prior medication effect, side effects, and follow-up tests the patient wants to discuss.
- Patient-facing flow routes to clinic nurse/NHI-card handoff; physician/nurse team decides whether any exam is appropriate.
- Satisfaction survey and follow-up messaging are future pilot features, not v1 real-data collection.

## What To Show

1. Open `http://localhost:4173/app/v1/`, or `http://127.0.0.1:4176/app/v1/` if the default port is occupied.
2. Select each synthetic case.
3. Inspect `Intake`, `Nurse`, `Physician`, `Exam Prep`, `Export`, and `Research`.
4. Copy the physician summary and mock JSON payload.
5. Confirm every screen keeps the safe-local boundary visible.

## Current Build Status

As of `2026-04-23`, the v1 pull-forward build is implemented from the meeting transcript, 許醫師 QA/rules, and 2024 TUA guideline source materials, with five synthetic cases and a Phase 0 live review capture sheet.

Same-day implementation/research work log:

- `docs/reviews/2026-04-23-urology-review/day-note-2026-04-23.md`

Passed checks:

- `npm test`: `40/40`
- `npm run smoke`: `269/269`
- `UROLOGY_PREVISIT_BASE_URL=http://127.0.0.1:4176 npm run phase0:check`: `81/81`, covering the v1 route, five synthetic cases, live capture sheet, current-system benchmark table, scorecard, priority-flow worksheet, safety boundaries, smoke checks, and tests
- Planning knowledge validation: `28` metadata notes / `28` catalog entries
- Planning W18 agenda views for the week and days `2026-04-27` through `2026-04-30`
- `git diff --check` in both planning and demo repos

Calendar caveat: Google Calendar write/search was blocked by connector/tool availability, so the planning repo agenda and `.ics` fallback remain the durable schedule record until calendar access is restored.

## Acceptance Checklist

- [ ] `app/v1/` loads from the static server.
- [ ] All five synthetic cases are selectable, including the Phase 0 hematuria / occult-blood review case.
- [ ] Waiting-room rules show no ID/birthday and no real queue/registration behavior.
- [ ] Physician summary shows chief concern, duration / bother, symptom domains, missing information, medication context, and source attribution.
- [ ] Exam-prep mockup uses `confirm` / `consider` language and clearly states no order is placed.
- [ ] Exam-prep mockup includes the source-derived 12-complaint matrix as physician/nurse confirmation reminders.
- [ ] Export text and mock JSON say synthetic data only, not for clinical use, physician review required, regulatory status not determined, and mock export only.
- [ ] No screen implies live HIS writeback, real patient data, diagnosis, triage, treatment advice, or autonomous exam ordering.

## Source-Derived Exam-Prep Matrix

These reminders come from 許醫師's QA file and are for physician/nurse confirmation only.

| Complaint | Confirmation reminder topics |
| --- | --- |
| 血尿或健檢發現潛血 | Blood draw, urinalysis, urine culture, kidney ultrasound, bladder ultrasound, X-ray. |
| 突發腰痛 | Urinalysis, urine culture, kidney ultrasound, X-ray. |
| 小便困難或尿不出來 | Blood draw, bladder ultrasound, prostate ultrasound for men, uroflow, IPSS for men. |
| 頻尿或夜尿 | Urinalysis, urine culture, bladder ultrasound, prostate ultrasound for men, uroflow, IPSS for men. |
| 尿失禁 | Urinalysis, urine culture; pad-test preparation may be discussed by the clinic team. |
| 剛診斷為攝護腺癌 | Blood draw, bladder ultrasound, prostate ultrasound, uroflow, IPSS; bring pathology/report/CT/MRI disks if applicable. |
| 抽血發現 PSA 升高 | Blood draw, bladder/prostate ultrasound, uroflow, IPSS; bring prior PSA data. |
| 陰囊或睪丸腫痛 | Blood draw, urinalysis, urine culture; fever question and scrotal ultrasound discussion. |
| 生殖器紅腫或搔癢 | Blood draw, urinalysis, urine culture; fever question. |
| 性功能問題 | Blood draw, IIEF; fasting instruction only if confirmed by clinic. |
| 健檢發現腎臟水泡或腫瘤 | Blood draw, urinalysis, kidney ultrasound, bladder ultrasound. |
| 小便有泡泡 | Urinalysis, urine culture, kidney ultrasound. |

## TUA Guideline Use

The 2024 TUA guideline supports previsit history, structured questionnaires, voiding diary concepts, urinalysis/PVR/uroflow/imaging discussion, and medication/context review as physician-review concepts. The guideline also states it is reference material, not a legal medical custom, medical standard, or malpractice standard. v1 must not turn guideline content into an autonomous rule engine.

## Decision Gates For 吳老師 / 許醫師

| Gate | Decision Needed | Evidence To Collect |
| --- | --- | --- |
| Funding | Who pays cloud/API/service cost after personal subsidy stops? | Hospital innovation/deep-cultivation budget, company budget, or hybrid plan. |
| IP | Who owns the implementation and licensing path? | 許醫師 patent status, team/company rights, 聯醫 rights, vendor/exclusivity limits. |
| HIS | What is the first acceptable integration depth? | Export text, PDF, mock API, or real writeback after information-office approval. |
| Privacy/security | What data can be collected and stored? | Consent, IRB, de-identification, retention, audit, access control, model-update policy. |
| Regulatory | What claims are allowed externally? | TFDA/FDA/legal review before any non-device or clinical-use statement. |
| Research | What metric proves value? | Minutes saved, summary usefulness, missing-field reduction, repeated-question count, staff burden, workflow slot. |
| Hospital workflow | Who approves waiting-room QR, NHI-card handoff wording, and nurse workflow? | Clinic nurse lead, outpatient operations owner, information office, and 許醫師 sign-off. |
| Current-system benchmark | Which functions must match or differ from `聯醫小幫手` / `陽明小幫手`? | Synthetic screen-share, screenshots, or walkthrough with no real patient data. |
| Local/on-prem deployment | Is local deployment a Phase 1 requirement or a later option? | Cloud-vs-local security review, hardware support owner, encryption/logging model, maintenance owner. |

## Next Research Step: Phase 0 Review

The next major work is a synthetic-only clinician/nurse review, not more feature building.

Before asking for reviewer time, start the local server and run:

```bash
UROLOGY_PREVISIT_BASE_URL=http://127.0.0.1:4176 npm run phase0:check
```

Use:

- `docs/research/v1-phase-0-clinician-review-protocol.md`
- `docs/research/v1-phase0-review-session-script.md`
- `docs/research/v1-phase0-reviewer-ask.md`
- `docs/research/v1-phase0-review-capture.md`
- `docs/research/v1-current-system-benchmark-table.md`
- `docs/research/v1-priority-flow-shortlist.md`
- `docs/research/v1-priority-flow-review-worksheet.md`
- `docs/research/v1-review-scorecard.md`
- `docs/research/v1-phase0-analysis-template.md`
- `docs/research/v1-phase0-decision-memo-template.md`
- `docs/research/v1-governance-gate-register.md`

Phase 0 should produce:

- first three complaint flows for the next v1 refinement
- benchmark comparison against current `聯醫小幫手` / `陽明小幫手`
- line-level useful / noisy / unsafe summary notes
- nurse/staff burden notes
- approved or revised exam-prep wording
- one decision: continue, revise, narrow, pause, or governance review before next step

No real patient data, clinical-use workflow, or HIS connection is allowed in Phase 0.

The proposed first three flows for review are `頻尿或夜尿`, `小便困難或尿不出來`, and `血尿或健檢發現潛血`. They are planning defaults only; 許醫師 can replace them before or during the review.

## Follow-Up Evidence To Request

- screenshot or screen-share walkthrough of both current Argon app flows with synthetic inputs only
- top three priority flows from the 12 QA complaint categories
- persona preference: `小許醫師 / Annie專科護理師` or neutral physician/nurse labels
- wording approval for the 12 source-derived exam-prep reminders
- whether `初步建議` / `檢查方向` is intentional wording or should be replaced with confirmation-only wording
- whether registration help, return-visit questioning, and waiting-flow explanation are required for v1 or later phases
- cloud vs local/on-prem deployment expectation
- 10-seat and 100-seat vendor quotes
- patent status and implementation-space constraints
- whether any vendor agreement creates conflict-of-interest or exclusivity limits

## Regulatory References For Review

- TFDA AI/ML SaMD guidance: https://www.fda.gov.tw/tc/newsContent.aspx?cid=3&id=26382
- FDA CDS FAQ: https://www.fda.gov/medical-devices/software-medical-device-samd/clinical-decision-support-software-frequently-asked-questions-faqs
- Taiwan Personal Data Protection Act: https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=I0050021
- Taiwan electronic medical record rules: https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=L0020121

These links support review planning only. They do not settle the product classification.
