# 2026-04-23 Urology Review Decision Capture

Status: pending follow-up

Use this file during or immediately after the `2026-04-23` review. Do not change the status to `complete` until real reviewer evidence has been captured.

## Identity

| Field | Notes |
| --- | --- |
| Date / time | 2026-04-23, recording/session label `260423_0958`; updated transcript timestamps `00:01:30` to `00:48:15` |
| Reviewer role | 許富順醫師 / urology clinical workflow owner |
| Meeting context | Urology smart-previsit MVP sync shifted into 聯醫AI小幫手 landing, funding, vendor, IP, privacy/security, and possible team-owned platform discussion |
| Demo entrypoint | `http://localhost:4173/app/review-packet/` |
| Capture owner | Jason |

## Boundary Confirmation

- [x] Synthetic data only.
- [x] No diagnosis.
- [x] No triage.
- [x] No treatment advice.
- [x] Clinician review remains required.
- [x] No real patient identifiers were entered.

## Four-Case Evidence

The planned four-case walkthrough was not completed in the captured transcript. 許醫師 gave a positive high-level response to Jason's demo and specifically noted that it covered the original concept and added nursing assistance, but case-by-case evidence still needs one follow-up pass.

| Case | Most useful line | Noisiest / riskiest line | Missing information | Workflow fit |
| --- | --- | --- | --- | --- |
| Frequent urination at night | not captured case-by-case | not captured case-by-case | Need 許醫師 feedback on whether nocturia lines help decide previsit exam prep. | plausible but unverified |
| Difficulty emptying | not captured case-by-case | not captured case-by-case | Need 許醫師 feedback on exam-prep and summary wording. | plausible but unverified |
| Incomplete leakage intake | not captured case-by-case | not captured case-by-case | Need 許醫師 feedback on nurse補問 usefulness. | plausible because nursing assistance was explicitly appreciated |
| Recurrent infection context | not captured case-by-case | not captured case-by-case | Need 許醫師 feedback on whether this should be in first urology pilot. | unverified |

## Decision Signals

| Signal | Supporting / uncertain / blocking | Evidence |
| --- | --- | --- |
| Repeated-question pain | supporting | 許醫師's slides and transcript describe repeated history, medication, family-history, and exam-prep questions before formal diagnosis. |
| Summary usefulness | supporting | 許醫師's current platform produces a Google-Sheet-like physician summary and he said Jason's demo covered his concept. |
| Workflow slot | supporting | Two clear slots were described: pre-registration `聯醫AI小幫手` and waiting-room QR `陽明小幫手`. |
| LINE follow-up source materials | supporting | 許醫師 provided the QA/rule file and 2024 TUA guideline after the meeting; these support a source-backed `陽明小幫手` v1 product preview. |
| Staff burden | uncertain | Claimed savings are strong, but the meeting did not validate nurse workload with case-level evidence. |
| Patient or assisted completion | uncertain | Multi-language and elderly usability were discussed, but no patient/family usability evidence was captured. |
| Existing process gap | supporting | Traditional first-visit flow can require physician visit, exams, and return visit; the target is to move history and exam preparation earlier. |
| Safety boundary | uncertain | 許醫師 frames the tool as no diagnosis/treatment and physician-confirmed, but privacy, information security, legal, IP, and TFDA positioning still need formal review. |

## Decision

| Field | Notes |
| --- | --- |
| Decision | pending follow-up |
| Why this decision | Positive collaboration signal and strong throughput hypothesis, plus follow-up source materials; the original four-case review still did not complete, and IP/vendor/privacy/regulatory evidence remains a blocker before broader implementation. |
| Smallest next artifact | safe-local `app/v1/` product console plus handoff packet for the `2026-04-30` deadline |
| Action playbook | `../../post-review-action-playbook.md` |
| Owner | Jason |
| Due date | 2026-04-24 for scoping packet draft |

## Hard Stop Notes

Record any wording or workflow issue that must be fixed before another demo:

- Do not mark this review complete until case-level feedback is captured or the review is explicitly reframed away from the four-case gate.
- Do not use real patient data.
- Do not add live HIS, registration, EMR, queue handling, messaging, or production integration.
- Do not ask real ID number or birthday in the waiting-room initial-visit flow.
- Keep the 12-complaint exam-prep matrix as physician/nurse confirmation-only content.
- Do not claim TFDA non-device status without legal/regulatory review.
- Do not promise a team-owned build until 許醫師's pending patent, any 創智動能 agreement, and school/company/聯醫 rights are clarified.
- Do not implement a real-data learning loop until consent, IRB, de-identification, retention, audit, and model-update governance are defined.

## Copied Reviewer Workbench Record

Transcript-derived meeting evidence, not copied from the reviewer workbench:

```text
Urology previsit MVP reviewer record
Reviewer role: 許富順醫師 / urology
Most useful summary line: Jason's demo covered the original AI-helper concept and added nursing assistance.
Noisiest/risky line: Any path that sounds like diagnosis, treatment, TFDA certainty, production deployment, or vendor/IP commitment before review.
Missing information: four-case feedback; 許醫師 priority choice among the 12 QA complaint flows; approved exam-prep wording; 10/100-seat quote; patent boundary; vendor agreement; privacy/security/legal owner.
Expected workflow slot: pre-registration helper or waiting-room QR helper before physician-confirmed exam preparation.
Staff burden concern: claimed reduction is plausible but not case-validated in this meeting.
Meeting evidence: 許醫師 described current 聯醫AI小幫手 / 陽明小幫手 workflow, 5-seat monthly service cost around NT$40,000+, pending 10/100-seat quote, personal patent filing preparation, and willingness to collaborate with 吳老師/Jason team.
Safety boundary: Synthetic data only. No diagnosis. No triage. No treatment advice. Clinician review remains required.
```

## Selected Next Artifact

After the decision is captured, choose exactly one artifact from `../../post-review-action-playbook.md`:

- revised question tree
- one-page summary mockup
- assisted workflow test
- pause note with rejected assumptions

Selected artifact: not selected - pending follow-up
