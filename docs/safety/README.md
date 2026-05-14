# Safety

Safety is enforced in code before it is described in documents.

## Code Owners

- `core/safety`: unsafe wording checks, safety notice, physician-review flag.
- `core/attribution`: field-level source tags.
- `core/missing_fields`: required-field and module-specific missing-field detection.
- `core/summary`: observational clinician summary.
- `core/role_transform`: role views, visit packet, reviewer record, canonical record.
- `core/adaptive_questioning`: governed question-bank ranking for the V2
  adaptive-question demo; no LLM runtime or free-form generated questions.
  Ambiguous patient wording must trigger clarification before ordinary
  retrieval when the location or symptom type is unclear.

## Hard Boundaries

- No diagnosis.
- No triage.
- No treatment advice.
- No autonomous exam ordering.
- Synthetic data only.
- Physician review remains required.
- Regulatory status is not determined.
- The V2 adaptive demo may rank and select the next question, but it must not
  generate new clinical questions outside the governed bank.
- Clarification questions are not diagnosis questions. They only reduce
  uncertainty, such as distinguishing尿道痛, 下腹痛, 生殖器痛, 會陰痛, or
  `尿尿怪怪的` symptom type.

## Required Output Properties

Every system output must preserve:

- `requiresPhysicianReview: true`
- source attribution for answered fields
- visible missing fields
- audit trace entries for summary, missing-field detection, attribution, and safety checks
