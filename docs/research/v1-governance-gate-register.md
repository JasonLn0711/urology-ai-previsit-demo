# V1 Governance Gate Register

Date: 2026-04-23
Scope: gates before moving beyond the safe-local synthetic v1 preview

## Current State

`v1` is a local product preview using synthetic data only. It is not a hospital system and not for clinical use.

The next major research step is Phase 0 clinician/nurse review. Any step beyond Phase 0 needs the relevant gate owner before work begins.

## Gate Summary

| Gate | Current status | Required before next level |
| --- | --- | --- |
| Funding | Open | Decide whether hospital innovation/deep-cultivation budget, company budget, or hybrid funding replaces personal subsidy. |
| IP / patent | Open | Clarify 許醫師 patent status, team rights, school/company rights, and allowed implementation space. |
| Vendor relationship | Open | Clarify 創智動能 agreement, exclusivity, data ownership, derivative work, and confidentiality limits. |
| Privacy/security | Open | Identify hospital owner and lawful path before real medical/health data collection. |
| HIS / information office | Open | Identify first acceptable integration depth; v1 remains export/mock API only. |
| Regulatory | Open | Review intended use and claims before any TFDA/FDA/non-device/clinical-use statement. |
| IRB / research ethics | Open | Determine whether human-subjects/IRB review is needed before patient, staff, or workflow data collection beyond expert synthetic review. |
| Nurse/staff operations | Open | Validate nurse repair prompts, NHI-card handoff, and waiting-room burden with clinic staff. |
| Data retention / learning loop | Closed for v1 | No physician-edited real notes, no fine-tuning, no real-data feedback loop in v1. |

## Phase Levels

| Phase | Allowed | Not allowed |
| --- | --- | --- |
| Phase 0: synthetic clinician/nurse review | Synthetic cases, expert review, scorecard, line-level wording notes. | Real patient data, real identifiers, live HIS, production workflow. |
| Phase 1: pilot-readiness review | Governance packet, draft consent/IRB/privacy questions, approved first three flows, system architecture options. | Real collection until governance owners approve. |
| Phase 2: supervised pilot, if approved | Only what hospital/IRB/privacy/security/HIS owners approve. | Scope creep beyond approved protocol. |

## Regulatory Review Notes

Use these references for gate-setting only:

- TFDA AI/ML SaMD guidance: https://www.fda.gov.tw/tc/newsContent.aspx?cid=3&id=26382
- FDA Clinical Decision Support Software FAQ: https://www.fda.gov/medical-devices/software-medical-device-samd/clinical-decision-support-software-frequently-asked-questions-faqs
- Taiwan Personal Data Protection Act: https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=I0050021
- Taiwan electronic medical record rules: https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=L0020121
- MOHW electronic medical record amendment summary: https://www.mohw.gov.tw/cp-5270-70574-1.html

Do not use these references to claim v1 status. They only define questions that must be reviewed.

## Immediate Gate Questions

1. Who signs off on the first three complaint flows?
2. Who signs off on exam-prep wording before physician confirmation?
3. Who reviews 許醫師 patent/vendor boundary?
4. Who owns 聯醫 privacy/security review?
5. Who owns HIS/export/API conversation?
6. What funding path replaces the current personal subsidy?
7. What evidence threshold allows moving from synthetic expert review to pilot-readiness review?
