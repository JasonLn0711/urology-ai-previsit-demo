# Workflow

All roles read the same canonical record:

```js
{
  patient_input: {},
  derived_summary: {},
  missing_fields: [],
  attribution: {},
  audit_trace: []
}
```

## Roles

| role | app path | purpose | must not do |
| --- | --- | --- | --- |
| patient / family | `app/patient/` | collect answers and preserve uncertainty | show staff-only reviewer tools |
| nurse | `app/nurse/` | repair missing fields and mark nurse-supplemented sources | diagnose, triage, or advise |
| clinician | `app/clinician/` | scan observational summary and source attribution | hide missing fields |
| reviewer | `app/reviewer/` | decide continue / revise / stop from evidence | use real patient data |

## Outputs

- Clinician summary: `core/summary.buildClinicianSummary`
- Nurse checklist: `core/role_transform.buildNurseChecklist`
- Visit packet: `core/role_transform.buildVisitPacket`
- Reviewer decision: `core/role_transform.buildReviewRecord`

Regenerate the walkthrough with:

```bash
npm run rehearsal
```
