# 2026-04-23 Urology Review Decision Capture

Status: complete

Use this fixture to verify the post-review closeout command's success path. It is synthetic test content only.

## Identity

| Field | Notes |
| --- | --- |
| Date / time | 2026-04-23 10:00-11:00 |
| Reviewer role | Physician |
| Meeting context | Urology smart-previsit MVP review |
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

| Case | Most useful line | Noisiest / riskiest line | Missing information | Workflow fit |
| --- | --- | --- | --- | --- |
| Frequent urination at night | Pattern line saves repeated nocturia questions. | Fluid context needs shorter wording. | Current medication list support. | Works during nurse rooming. |
| Difficulty emptying | Emptying pattern is visible before physician interview. | Priority wording should stay neutral. | Prior evaluation history. | Works if staff can verify answers. |
| Incomplete leakage intake | Missing fields are visible. | Leakage amount wording needs simpler choices. | Containment product detail. | Assisted completion likely needed. |
| Recurrent infection context | Repeated-episode history is useful as context. | Avoid any infection label language. | Prior culture or clinician diagnosis stays physician-led. | Useful previsit if descriptive only. |

## Decision Signals

| Signal | Supporting / uncertain / blocking | Evidence |
| --- | --- | --- |
| Repeated-question pain | supporting | Reviewer identified repeated symptom-history questions. |
| Summary usefulness | supporting | Reviewer would read the summary before entering the room. |
| Workflow slot | supporting | Nurse rooming is the likely slot. |
| Staff burden | uncertain | Medication support may need workflow limit. |
| Patient or assisted completion | uncertain | Some older adults need helper support. |
| Existing process gap | supporting | Existing flow does not summarize patient-reported pattern. |
| Safety boundary | supporting | Reviewer accepted review-only wording. |

## Decision

| Field | Notes |
| --- | --- |
| Decision | continue |
| Why this decision | Reviewer saw enough workflow value to justify one bounded artifact. |
| Smallest next artifact | one-page summary mockup |
| Action playbook | `../../post-review-action-playbook.md` |
| Owner | Jason |
| Due date | 2026-04-24 |

## Hard Stop Notes

Record any wording or workflow issue that must be fixed before another demo:

- Keep repeated infection content descriptive and physician-reviewed.

## Copied Reviewer Workbench Record

Paste the copied reviewer workbench record below.

```text
Urology previsit MVP reviewer record

Reviewer role: Physician
Reviewer decision: continue
Decision guide: continue
Recorded decision: continue
Next artifact: one-page summary mockup

Evidence signals:
- Repeated-question pain: clear (supporting)
- Summary usefulness: would-read (supporting)
- Staff burden: uncertain (uncertain)
- Patient or assisted completion: mixed (supporting)
- Safety boundary: acceptable (supporting)
- Workflow slot: exists (supporting)
- Existing process: not-sufficient (supporting)

Meeting evidence:
- Most useful summary line: Pattern line saves repeated nocturia questions.
- Noisiest or riskiest line: Fluid context needs shorter wording.
- Missing information that matters: Medication list support.
- Unsafe or misleading wording: None recorded.
- Expected workflow slot: Nurse rooming.
- Staff burden concern: Medication review may add work.
- Case-specific evidence: Four synthetic cases reviewed.

Safety boundary:
- No diagnosis.
- No triage.
- No treatment advice.
- No real patient data during discovery.
- Clinician review remains required.
```

## Selected Next Artifact

After the decision is captured, choose exactly one artifact from `../../post-review-action-playbook.md`:

- revised question tree
- one-page summary mockup
- assisted workflow test
- pause note with rejected assumptions

Selected artifact: one-page summary mockup
