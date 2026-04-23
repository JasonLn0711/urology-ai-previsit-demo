# 2026-04-23 Hsu Training Requirements

## Source

- `assets/2026-04-23-hsu-training-materials/2026-01-05-lianyi-ai-helper-qa-training-rules.docx`
- `assets/2026-04-23-hsu-training-materials/2024-tua-urology-treatment-guideline.pdf`

## What Changed For v1

The LINE follow-up materials make the next version more concrete. v1 should now be framed around `陽明小幫手`: an already-registered, waiting-room QR workflow that collects previsit information before the physician enters.

This is safer and cleaner than a registration-helper MVP because it avoids real appointment actions, avoids ID/birthday collection, and lets the demo focus on physician-reviewed summary and exam-prep readiness.

## Doctor / Hospital Requirements

- Distinguish `初診` and `回診`.
- For `初診`, do not ask ID number or birthday.
- For `初診`, collect chronic disease history, operation history, medication history, allergy history, and a symptom-specific form.
- For `回診`, ask whether prior medication improved symptoms, whether side effects occurred, and what follow-up tests the patient wants to discuss.
- Route the patient to hand the NHI card to the clinic nurse; the physician/nurse team decides whether any exam should happen before the visit.
- Keep "do not knock; wait for nurse" as operational wording for real clinic review, but v1 should show it as a hospital-rule note rather than patient instruction for live use.
- End the flow with a satisfaction survey in future pilot design.
- Ask for exact medication names when the patient gives only a generic category.

## Source-Derived Exam-Prep Matrix

These are possible preparation topics from the QA file. v1 must say `confirm whether appropriate`; it must not say the system ordered them.

| Complaint | Reminders |
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

## Guideline Cross-Check

- TUA male LUTS/BPO material supports history, symptom/QoL questionnaire, voiding diary for storage/nocturia-predominant symptoms, urinalysis, PVR, and selected uroflow/imaging as physician-review concepts.
- TUA urinary incontinence material supports history, type/timing/severity, relevant medical/surgical/pelvic history, current medications, validated questionnaires, voiding diary, urinalysis, PVR, and pad-test concepts.
- TUA OAB/nocturia material supports questionnaire, at least 3-day voiding diary, urinalysis, and PVR as evaluation concepts. v1 must not diagnose OAB.
- The TUA guideline explicitly positions itself as reference material, not a legal standard. v1 should cite it only as clinical-context source material for future physician review.

## v1 Acceptance Updates

- v1 route shows the waiting-room flow boundary.
- v1 route shows "no ID / no birthday" as a hospital-rule guardrail.
- v1 route includes the doctor-provided 12-complaint matrix as physician-confirmed reminders.
- Export/mock JSON includes source-derived reminders and confirms `orderPlaced: false`.
- Handoff packet lists privacy/security/HIS/regulatory gates before real use.
