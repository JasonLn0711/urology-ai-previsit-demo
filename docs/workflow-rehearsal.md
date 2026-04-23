# MVP Workflow Rehearsal

> Generated from `app/shared/cases.js` and `app/shared/summary.js`.
> Synthetic data only. This rehearsal does not diagnose, triage, or recommend treatment.

## Purpose

Use this document before a meeting or browser walkthrough to check whether the MVP behaves like a bounded previsit workflow instead of a clinical decision system.

The rehearsal asks four first-principles questions for each case:

- Can the patient or helper understand what to answer?
- Does the patient/family UI avoid staff-only screens and language?
- Can nursing staff see what may need support or clarification?
- Can the clinician scan the summary without being misled?
- Does the demo keep missing information visible instead of hiding uncertainty?

## How To Use

1. Run `npm run rehearsal` after editing shared cases or summary logic.
2. Open `http://localhost:4173/app/patient-demo/`.
3. Load each synthetic case in the same order as below.
4. Confirm patient/family isolation, then inspect `app/nurse-workbench/`, `app/clinician-summary/`, and `app/visit-packet/`.
5. Compare the browser state with this rehearsal document.
6. Record reviewer feedback in the reviewer workbench.

## Synthetic case: frequent urination at night

Case id: `synthetic-frequency-older-adult`

Purpose: Checks whether frequency/nocturia details stay short while still surfacing bladder diary and medication-review cues.

### Patient Flow Check

1. Load this case from the synthetic scenario rail.
2. Confirm source and main concern: Patient self-filled; Frequency / nocturia / urgency.
3. Confirm the patient/family page has no nurse, clinician, visit-packet, or reviewer links.
4. Confirm active conditional modules: storage, medication.
5. Open the nurse workbench and confirm status: MVP fields complete for clinician review.
6. Compare the clinician summary against the patient-reported pattern and source notes.

### Expected Summary State

- Completeness: MVP fields complete for clinician review
- Active modules: storage, medication
- Duration / bother: More than 1 month / bother score 7/10
- Patient-reported pattern: Storage: daytime change: Yes; daytime count: 9 to 12 times; night count: 3 or more times; urgency: Yes; urgency frequency: Most days; fluid/caffeine context: Caffeinated drinks most days, Drinks a lot near bedtime; diary feasibility: Yes, with written instructions

### Priority Review Statements

- No priority review statement captured in this synthetic case.

### Nurse Workflow Cues

- Completion support may be needed before clinician review.
- Bladder diary instruction may be relevant if clinic workflow supports it.
- Medication list may need nurse review or supplemental confirmation.

### Missing Information

- No required MVP fields missing.

### Clinician Summary Check

- Medication/context: list readiness: Partial list only; review support: Yes; patient-reported context: Not sure; diuretic/anticoagulant awareness: Not sure
- Patient note: Patient worries about waking up repeatedly at night.
- Handoff: Patient-provided or helper-provided answers; clinician review required.

### Reviewer Questions

- Would a clinician read this summary before entering the room?
- Which line is clinically useful and which line is noise?
- Does any wording imply diagnosis, triage, or treatment?
- Would nursing staff know what, if anything, to clarify before the clinician enters?
- Is the bladder diary cue useful in this clinic workflow?

## Synthetic case: difficulty emptying bladder

Case id: `synthetic-emptying-difficulty`

Purpose: Checks whether voiding and emptying symptoms are visible without the system assigning urgency, diagnosis, or treatment.

### Patient Flow Check

1. Load this case from the synthetic scenario rail.
2. Confirm source and main concern: Family helped operate; patient answered; Difficulty emptying or weak stream.
3. Confirm the patient/family page has no nurse, clinician, visit-packet, or reviewer links.
4. Confirm active conditional modules: voiding, medication.
5. Open the nurse workbench and confirm status: MVP fields complete for clinician review.
6. Compare the clinician summary against the patient-reported pattern and source notes.

### Expected Summary State

- Completeness: MVP fields complete for clinician review
- Active modules: voiding, medication
- Duration / bother: 1 to 4 weeks / bother score 8/10
- Patient-reported pattern: Voiding/emptying: trouble/inability: Yes; happening now: No; weak stream: Yes; straining: Yes; stopping/starting: Yes; incomplete emptying: Yes

### Priority Review Statements

- Reports trouble or inability to urinate.

### Nurse Workflow Cues

- Completion support may be needed before clinician review.
- Medication list may need nurse review or supplemental confirmation.
- Priority review statements should be visible before the clinician encounter.

### Missing Information

- No required MVP fields missing.

### Clinician Summary Check

- Medication/context: list readiness: Not sure; review support: Yes; patient-reported context: Not sure; diuretic/anticoagulant awareness: Not sure
- Patient note: Patient says flow is weak and sometimes cannot start.
- Handoff: Patient-provided or helper-provided answers; clinician review required.

### Reviewer Questions

- Would a clinician read this summary before entering the room?
- Which line is clinically useful and which line is noise?
- Does any wording imply diagnosis, triage, or treatment?
- Would nursing staff know what, if anything, to clarify before the clinician enters?
- Does the voiding/emptying wording stay neutral enough for previsit collection?

## Synthetic case: incomplete leakage intake

Case id: `synthetic-incomplete-leakage`

Purpose: Checks whether incomplete leakage intake keeps missing information visible and preserves staff-support needs.

### Patient Flow Check

1. Load this case from the synthetic scenario rail.
2. Confirm source and main concern: Family or helper-assisted; Leakage.
3. Confirm the patient/family page has no nurse, clinician, visit-packet, or reviewer links.
4. Confirm active conditional modules: leakage.
5. Open the nurse workbench and confirm status: 6 MVP fields still missing.
6. Compare the clinician summary against the patient-reported pattern and source notes.

### Expected Summary State

- Completeness: 6 MVP fields still missing
- Active modules: leakage
- Duration / bother: Duration not provided / bother score 4/10
- Patient-reported pattern: Leakage: past 4 weeks: Yes; frequency: Weekly; triggers: Before reaching toilet; containment: Pads or liners

### Priority Review Statements

- No priority review statement captured in this synthetic case.

### Nurse Workflow Cues

- Completion support may be needed before clinician review.
- Some core answers are marked not sure; staff may need to clarify them before clinician review.
- Containment product or leakage-support needs should remain visible to staff.

### Missing Information

- symptom duration
- daytime urination change
- pain or burning with urination
- fever, chills, or side/back pain
- medication list readiness
- leakage amount

### Clinician Summary Check

- Medication/context: Not provided
- Patient note: Helper says the patient is embarrassed to discuss leakage.
- Handoff: Patient-provided or helper-provided answers; clinician review required.

### Reviewer Questions

- Would a clinician read this summary before entering the room?
- Which line is clinically useful and which line is noise?
- Does any wording imply diagnosis, triage, or treatment?
- Would nursing staff know what, if anything, to clarify before the clinician enters?
- Are the missing fields worth repairing, or should they remain for clinician review?
- Does the containment-support cue help staff, or does it add unnecessary burden?

## Synthetic case: recurrent infection context

Case id: `synthetic-recurrent-infection-context`

Purpose: Checks whether frequency/nocturia details stay short while still surfacing bladder diary and medication-review cues.

### Patient Flow Check

1. Load this case from the synthetic scenario rail.
2. Confirm source and main concern: Patient self-filled; Recurrent infection concern.
3. Confirm the patient/family page has no nurse, clinician, visit-packet, or reviewer links.
4. Confirm active conditional modules: storage, pain, medication.
5. Open the nurse workbench and confirm status: MVP fields complete for clinician review.
6. Compare the clinician summary against the patient-reported pattern and source notes.

### Expected Summary State

- Completeness: MVP fields complete for clinician review
- Active modules: storage, pain, medication
- Duration / bother: More than 1 month / bother score 6/10
- Patient-reported pattern: Storage: daytime change: Yes; daytime count: 5 to 8 times; night count: 1 time; urgency: Yes; urgency frequency: Some days; fluid/caffeine context: None of these; diary feasibility: Only with staff or family help | Pain/infection-related: pain/burning: Yes; pattern: Only while urinating; systemic symptoms: None of these; recent episodes/antibiotics: Yes, more than once

### Priority Review Statements

- Reports pain or burning with urination.

### Nurse Workflow Cues

- Bladder diary instruction may be relevant if clinic workflow supports it.
- Medication list may need nurse review or supplemental confirmation.
- Priority review statements should be visible before the clinician encounter.

### Missing Information

- No required MVP fields missing.

### Clinician Summary Check

- Medication/context: list readiness: Can provide list; review support: No; patient-reported context: Diabetes; diuretic/anticoagulant awareness: No
- Patient note: Patient reports repeated similar episodes and wants the physician to know the pattern.
- Handoff: Patient-provided or helper-provided answers; clinician review required.

### Reviewer Questions

- Would a clinician read this summary before entering the room?
- Which line is clinically useful and which line is noise?
- Does any wording imply diagnosis, triage, or treatment?
- Would nursing staff know what, if anything, to clarify before the clinician enters?
- Is the bladder diary cue useful in this clinic workflow?

## Stop Rules

- Stop and revise if any page suggests diagnosis, triage, or treatment.
- Stop and revise if missing fields disappear from view.
- Stop and revise if the patient/family page exposes nurse, clinician, visit-packet, or reviewer surfaces.
- Stop and revise if family observations and patient self-reports are indistinguishable.
- Stop and revise if a `Not sure` answer opens large follow-up modules without a clear main concern.
- Stop and revise if nurse cues require action the clinic cannot realistically perform.
