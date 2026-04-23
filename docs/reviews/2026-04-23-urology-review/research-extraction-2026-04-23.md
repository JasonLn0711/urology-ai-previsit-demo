# 2026-04-23 Research Extraction

## Source
- `assets/2026-04-23-hsu-sync/2026-01-28-lianyi-ai-helper-initial-visit-slides.pdf`
- `assets/2026-04-23-hsu-sync/2026-04-23-0958-hsu-urology-ai-previsit-system-sync-transcript.txt`
- `assets/2026-04-23-hsu-training-materials/2026-01-05-lianyi-ai-helper-qa-training-rules.docx`
- `assets/2026-04-23-hsu-training-materials/2024-tua-urology-treatment-guideline.pdf`

This note extracts research and demo implications. It does not mark the original four-case review complete and does not select a post-review artifact.

## What The Updated Transcript Clarifies
- There are two product entry modes:
  - `聯醫AI小幫手`: before/around registration, with possible registration support.
  - `陽明小幫手`: after existing registration, waiting-room QR flow for chief complaint and history collection.
- 許醫師's core workflow claim is not "AI diagnosis"; it is moving structured history collection and exam-preparation support before formal physician review.
- Physician-specific AI-agent training is central: symptom category, forms, exam-prep suggestions, physician habits, and specialty guidelines.
- The current vendor path depends on concurrency capacity and monthly service pricing; 5 seats were described as about NT$40,000+ per month, with 10-seat and 100-seat quotes pending.
- 許醫師 is open to 吳老師/Jason team building a similar platform and can provide the QA / keyword / training process.
- The internal strategy after 許醫師 left is more commercial than the original demo plan: possible low-cost/free deployment at 聯醫, commercialization at other hospitals, and a negotiated revenue/IP relationship.

## Demo Implications
The next product preview should test the physician-review output and waiting-room clinic fit, not the whole hospital integration.

Minimum useful v1 revision:
- `陽明小幫手` waiting-room framing for already-registered patients
- no ID number or birthday in the initial-visit flow
- initial/return visit branch
- four synthetic urology cases
- patient/family source-labeled intake
- nurse補問 for missing fields
- physician-facing summary
- doctor-provided 12-complaint exam-prep matrix rendered as physician-confirmed reminders
- explicit no-diagnosis / no-treatment / no-autonomous-order footer

Do not add:
- live registration
- HIS/EMR integration
- real patient data
- autonomous exam ordering
- TFDA classification claims
- multi-department generalized platform
- real queue handling, phone messaging, follow-up reminders, or analytics on identifiable data

## Research Questions
| Question | Why It Matters | Evidence Needed Next |
| --- | --- | --- |
| Which 3 of the 12 QA complaint categories should v1 prioritize first? | Chooses the first product path and avoids spreading the UI too thin. | 許醫師 priority choice among the 12 source-derived categories. |
| What exact fields should be collected before physician review? | Prevents UI sprawl and unsafe clinical inference. | QA fields are now a starting point; ask for corrections after v1 review. |
| Which exam-prep reminders are acceptable before nurse/physician confirmation? | Keeps the system outside autonomous ordering. | 許醫師 wording review on the 12-complaint matrix. |
| Can nurse補問 reduce missing information without adding staff burden? | Tests whether assisted completion is realistic. | One nurse workflow review or simulated assisted flow. |
| Is the business path build, buy, or hybrid? | Avoids vendor lock-in and rights confusion. | 創智動能 10/100-seat quote, any SOW/contract terms, and IP boundary. |
| Who owns deployment review? | Real rollout depends on governance, not only code. | 聯醫 privacy, information-security, legal, and leadership owner names. |

## Recommended Next Artifact
Create the `v1` safe-local product console and handoff packet first.

The product story should lead with `陽明小幫手` waiting-room flow because the QA file explicitly removes ID number and birthday from the initial-visit waiting-room path. Registration support is valuable but riskier and should remain future scope.

## What The QA File Adds
- Doctor-approved workflow split: already-registered waiting-room QR flow vs registration-helper flow.
- Initial visit: no ID number or birthday; ask chronic disease history, operation history, medication history, allergy history, and symptom-specific forms.
- Return visit: ask prior medication effect, side effects, and patient-desired follow-up test discussion.
- Operational handoff: patient gives NHI card to the clinic nurse; physician/nurse team decides whether any exam should happen before the visit.
- Satisfaction survey belongs at the end of both initial and return-visit flows in a future real pilot.
- Medication repair: if the patient gives only a generic medication class, ask for the exact Chinese or English medication name.
- 12 initial-visit complaint categories with possible preparation items, to be treated as confirmation-only reminders.

## What The TUA Guideline Adds
- Supports structured history and questionnaires for male LUTS/BPO and urinary incontinence workflows.
- Supports voiding diary concepts for storage/nocturia-predominant symptoms and incontinence.
- Supports urinalysis/PVR/uroflow/imaging as physician-review concepts in selected contexts.
- The guideline itself states it is reference material, not a legal standard; v1 must not turn it into a binding rule engine.

## Gemini Synthesis Routing
The Gemini meeting synthesis usefully reframes the work as a clinic-throughput system: each first-visit patient may save more than 6 physician minutes, and 10 patients could free about 1 hour of physician/team bandwidth.

Adopt for demo/research:
- treat physician time and clinic throughput as the main value hypothesis
- include funding/ownership in the landing packet
- keep specialty-agent reuse as a future platform hypothesis

Do not adopt as demo commitments yet:
- immediate HIS/API writeback
- settled TFDA non-device status
- immediate multi-specialty AI-agent matrix
- real-data learning loop from physician-edited notes

Instead, represent these as decision gates in the landing packet:
- integration gate: export / copyable summary / mock API before real HIS
- regulatory gate: legal/TFDA review before external claims
- IP gate: 許醫師 patent + team/company/聯醫 rights map
- data gate: consent, IRB, de-identification, retention, audit, model-update policy

## Follow-Up Evidence To Request
- top 3 of the 12 QA complaint categories for first v1 review
- persona decision: `小許醫師 / Annie專科護理師` vs neutral physician/nurse labels
- wording review for the 12 source-derived exam-prep reminders
- 創智動能 10-seat and 100-seat quote when available
- patent status and what implementation space is safe for team development
- whether any vendor agreement creates conflict-of-interest or exclusivity limits

## Research Boundary
This work can support a research/demo proposal, but it should not yet be framed as deployable clinical software.

The safest current research title is:

> Physician-reviewed AI previsit summary and exam-preparation support for urology first visits.

Avoid titles that imply autonomous triage, diagnosis, treatment recommendation, or production hospital integration.
