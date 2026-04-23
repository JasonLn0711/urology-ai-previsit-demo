# Safety

Safety is enforced in code before it is described in documents.

## Code Owners

- `core/safety`: unsafe wording checks, safety notice, physician-review flag.
- `core/attribution`: field-level source tags.
- `core/missing_fields`: required-field and module-specific missing-field detection.
- `core/summary`: observational clinician summary.
- `core/role_transform`: role views, visit packet, reviewer record, canonical record.

## Hard Boundaries

- No diagnosis.
- No triage.
- No treatment advice.
- No autonomous exam ordering.
- Synthetic data only.
- Physician review remains required.
- Regulatory status is not determined.

## Required Output Properties

Every system output must preserve:

- `requiresPhysicianReview: true`
- source attribution for answered fields
- visible missing fields
- audit trace entries for summary, missing-field detection, attribution, and safety checks
