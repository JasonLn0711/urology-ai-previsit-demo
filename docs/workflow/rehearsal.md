# Workflow Rehearsal

> Generated from `data/synthetic_cases` and `core/summary`.
> Synthetic data only. This rehearsal does not diagnose, triage, or recommend treatment.

Use this as a quick before-demo check that the role surfaces read the same canonical record while showing different role views.

## synthetic-frequency-older-adult

Label: Synthetic case: frequent urination at night

### Expected Output

- Completion: MVP fields complete for clinician review
- Active modules: storage, medication
- Pattern: Storage: daytime change: Yes; daytime count: 9 to 12 times; night count: 3 or more times; urgency: Yes; urgency frequency: Most days; fluid/caffeine context: Caffeinated drinks most days, Drinks a lot near bedtime; diary feasibility: Yes, with written instructions

### Nurse Check

- Completion support may be needed before clinician review.
- Bladder diary instruction may be relevant if clinic workflow supports it.
- Medication list may need nurse review or supplemental confirmation.

### Clinician Review Flags

- No priority review statement captured in this synthetic case.

### Missing Fields

- No required MVP fields missing.

## synthetic-emptying-difficulty

Label: Synthetic case: difficulty emptying bladder

### Expected Output

- Completion: MVP fields complete for clinician review
- Active modules: voiding, medication
- Pattern: Voiding/emptying: trouble/inability: Yes; happening now: No; weak stream: Yes; straining: Yes; stopping/starting: Yes; incomplete emptying: Yes

### Nurse Check

- Completion support may be needed before clinician review.
- Medication list may need nurse review or supplemental confirmation.
- Priority review statements should be visible before the clinician encounter.

### Clinician Review Flags

- Reports trouble or inability to urinate.

### Missing Fields

- No required MVP fields missing.

## synthetic-incomplete-leakage

Label: Synthetic case: incomplete leakage intake

### Expected Output

- Completion: 6 MVP fields still missing
- Active modules: leakage
- Pattern: Leakage: past 4 weeks: Yes; frequency: Weekly; triggers: Before reaching toilet; containment: Pads or liners

### Nurse Check

- Completion support may be needed before clinician review.
- Some core answers are marked not sure; staff may need to clarify them before clinician review.
- Containment product or leakage-support needs should remain visible to staff.

### Clinician Review Flags

- No priority review statement captured in this synthetic case.

### Missing Fields

- symptom duration
- daytime urination change
- pain or burning with urination
- fever, chills, or side/back pain
- medication list readiness
- leakage amount

## synthetic-recurrent-infection-context

Label: Synthetic case: recurrent infection context

### Expected Output

- Completion: MVP fields complete for clinician review
- Active modules: storage, pain, medication
- Pattern: Storage: daytime change: Yes; daytime count: 5 to 8 times; night count: 1 time; urgency: Yes; urgency frequency: Some days; fluid/caffeine context: None of these; diary feasibility: Only with staff or family help | Pain/infection-related: pain/burning: Yes; pattern: Only while urinating; systemic symptoms: None of these; recent episodes/antibiotics: Yes, more than once

### Nurse Check

- Bladder diary instruction may be relevant if clinic workflow supports it.
- Medication list may need nurse review or supplemental confirmation.
- Priority review statements should be visible before the clinician encounter.

### Clinician Review Flags

- Reports pain or burning with urination.

### Missing Fields

- No required MVP fields missing.

## synthetic-hematuria-occult-blood

Label: Synthetic case: visible blood / health-check occult blood

### Expected Output

- Completion: MVP fields complete for clinician review
- Active modules: hematuria, medication
- Pattern: Visible blood/clots: seen by patient: Yes; pattern: One recent episode; health-check urine test also mentioned occult blood; clots: No; with: No pain or burning, No fever or chills

### Nurse Check

- Medication list may need nurse review or supplemental confirmation.
- Priority review statements should be visible before the clinician encounter.

### Clinician Review Flags

- Reports visible blood or clots in urine.

### Missing Fields

- No required MVP fields missing.

## Stop Rules

- Stop and revise if any page suggests diagnosis, triage, or treatment.
- Stop and revise if missing fields disappear from view.
- Stop and revise if patient/family, nurse, clinician, and reviewer views disagree about the same canonical record.
- Stop and revise if field-level attribution is absent from clinician-facing output.
