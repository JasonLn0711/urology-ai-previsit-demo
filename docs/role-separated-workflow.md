# Role-Separated Workflow

## Purpose

This note documents the current product architecture: help an older urology patient say the problem calmly, let family help without confusing answer source, let nursing staff repair missing information, and let the physician scan a useful summary before the visit.

The design deliberately separates user surfaces. The patient/family side should never expose nurse, clinician, or reviewer screens.

## Surfaces

| Surface | Route | Audience | Purpose | Must not show |
| --- | --- | --- | --- | --- |
| Patient/family intake | `app/patient-demo/` | Patient and family/helper | Plain-language guided questions, display controls, read-aloud, confirmation before handoff | Nurse workbench, clinician summary, reviewer tools, staff-only terms |
| Nurse workbench | `app/nurse-workbench/` | Nurse or clinic staff | Missing-field checklist, supplemental questions, source notes, neutral review statements | Diagnosis, risk level, treatment recommendation |
| Clinician summary | `app/clinician-summary/` | Physician or clinical reviewer | One-minute scan of chief concern, pattern, missing information, review statements, source attribution | Patient-facing reassurance, auto-triage, treatment advice |
| Visit packet | `app/visit-packet/` | Demo reviewer / staff discussion | Printable role-separated packet for patient/family, nurse, and clinician pages | Any claim that the packet is a clinical record |
| Reviewer workbench | `app/reviewer-workbench/` | Product or clinical reviewer | Continue / revise / narrow / pause capture | Real patient data |

## Data Flow

```text
Patient/family intake
-> browser-local synthetic answer object
-> field-level sourceByField labels
-> nurse checklist from missingFieldEntries and buildNurseChecklist
-> clinician summary from buildClinicianSummary
-> visit packet from buildVisitPacket
```

## Source-Label Rule

Each answered field should be understood as one of these sources:

- `patient_self`:本人回答。
- `patient_with_family_operator`:本人回答，家屬協助操作。
- `family_observation`:家屬或協助者依觀察代答。
- `nurse_supplement`:現場補問。
- `declared_on_entry`:填答開始時標記。

Subjective fields such as pain, urgency, leakage, bother score, and optional patient note should prefer patient confirmation. Family observation is still useful, but it must be visible as a different source.

## Nurse Repair Rule

The nurse workbench should answer one operational question:

What is the next missing or uncertain item worth asking before the physician enters?

It may show:

- missing required fields
- plain supplemental questions
- why each question matters
- source warnings
- neutral review statements

It must not show:

- diagnosis
- triage level
- treatment advice
- unactionable warnings without a clinic workflow

## Clinician Summary Rule

The clinician summary should be useful in under one minute. It should show:

- completion status
- chief concern
- active symptom modules
- duration and bother
- patient-reported pattern
- medication/context note
- missing information
- neutral priority review statements
- answer-source attribution

It should never hide missing information or convert patient reports into medical conclusions.

## Verification

Current checks:

```bash
npm run smoke
npm test
git diff --check
```

The smoke check includes a patient/family isolation check: the patient page must not link to staff-only surfaces or use staff-only labels.
