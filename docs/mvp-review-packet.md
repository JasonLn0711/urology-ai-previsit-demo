# MVP Review Packet

## Purpose

Use this packet to review the urology previsit MVP as a bounded workflow product, not as a clinical decision system.

The review should answer one question:

Would this MVP improve previsit readiness enough to justify another prototype cycle, while staying safe, understandable, and realistic for clinic workflow?

## Non-Negotiable Boundary

- Synthetic data only.
- No diagnosis.
- No triage.
- No treatment advice.
- No real patient identifiers.
- No EHR, HIS, EMR, scheduling, or messaging integration in MVP.
- Clinician review remains required.

Stop the review and revise the MVP if any screen, sample, or reviewer record violates these boundaries.

## Before The Review

Run the generated checks and artifacts:

```bash
npm run rehearsal
npm run samples
npm run smoke
npm test
```

Open the demo surfaces:

- Patient MVP: `http://localhost:4173/app/patient-demo/`
- Clinician summary: `http://localhost:4173/app/clinician-summary/`
- Reviewer workbench: `http://localhost:4173/app/reviewer-workbench/`

## Artifact Map

| Artifact | Use |
| --- | --- |
| `docs/product-brief.md` | Confirms MVP intent, scope, and out-of-scope boundaries. |
| `docs/safety-and-privacy-boundaries.md` | Confirms hard safety, privacy, and wording rules. |
| `docs/workflow-rehearsal.md` | Guides the four synthetic scenario walkthroughs. |
| `docs/meeting-capture-template.md` | Captures case-level evidence and the final continue / revise / narrow / pause decision. |
| `docs/post-review-action-playbook.md` | Maps the captured decision to exactly one next artifact and stop boundary. |
| `docs/reviews/2026-04-23-urology-review/pre-meeting-readiness.md` | Pre-meeting command/checklist for confirming the live review stack is ready. |
| `docs/reviews/2026-04-23-urology-review/reviewer-one-page-handout.md` | Reviewer-facing one-page handout for meeting goal, boundary, cases, decision choices, and evidence capture. |
| `docs/reviews/2026-04-23-urology-review/post-review-closeout.md` | Post-review command/checklist for validating the capture before one next artifact is created. |
| `docs/reviews/2026-04-23-urology-review/decision-capture.md` | Dated review workspace for the 2026-04-23 meeting; remains pending until reviewer evidence is captured. |
| `docs/samples/README.md` | Routes committed synthetic summary and reviewer-record outputs. |
| `docs/source-verification.md` | Explains source-of-truth boundaries between demo and governance repos. |
| `../urology-ai-previsit-thinking-spec/clinical-question-governance/mvp_question_set_recommendation.md` | Governs which questions belong in MVP. |

## Reviewer Roles

### Patient / Helper Lens

Check whether the question flow is understandable without explanation.

Look for:

- clear source and main-concern selection
- plain symptom wording
- visible `Not sure` options
- no pressure to guess
- no overly long module when the concern does not justify it

### Nurse Lens

Check whether staff can see what needs support before the clinician encounter.

Look for:

- missing-information visibility
- completion-support cue
- bladder diary instruction cue
- medication-review support cue
- containment-support cue
- priority review statements shown without assigning urgency

### Clinician Lens

Check whether the summary is useful in under one minute.

Look for:

- main concern
- duration and bother
- patient-reported pattern
- active modules
- priority review statements
- medication/context note
- missing information
- no diagnostic or treatment language

### Product / Governance Lens

Check whether the workflow deserves another prototype cycle.

Look for:

- clear repeated-question problem
- realistic workflow slot
- acceptable staff burden
- patient or assisted completion feasibility
- safety boundary acceptance
- superiority over existing process
- smallest useful next artifact

## Review Agenda

### 1. Frame The Boundary

Use this exact framing:

This is a synthetic-data previsit workflow MVP. It organizes patient-reported information for clinician review. It does not diagnose, triage, recommend treatment, or replace clinician judgment.

### 2. Run The Four Cases

Use `docs/workflow-rehearsal.md` as the case checklist.

1. Frequent urination at night
   - Tests storage-symptom detail, bladder diary cue, and medication-review cue.
2. Difficulty emptying bladder
   - Tests voiding/emptying summary and priority review wording.
3. Incomplete leakage intake
   - Tests missing-information repair, assisted completion, and containment-support cue.
4. Recurrent infection context
   - Tests repeated-symptom history, pain/infection context, and medication/context cues without diagnosing UTI.

### 3. Inspect The Summary

For each case, ask:

- What would the clinician read first?
- Which line saves repeated questioning?
- Which line is noise?
- What is missing but still visible?
- Does any wording suggest diagnosis, triage, or treatment?

### 4. Inspect Nursing Fit

For each case, ask:

- Would staff know whether the patient needs help?
- Would staff know whether a medication list needs review?
- Would a bladder diary cue fit the clinic workflow?
- Would containment-support wording help or create extra burden?
- Are priority review statements visible without becoming autonomous triage?

### 5. Capture The Decision

Use the reviewer workbench to record:

- reviewer role
- repeated-question pain
- summary usefulness
- workflow slot
- staff burden
- patient or assisted completion fit
- existing process gap
- safety boundary
- most useful summary line
- noisiest or riskiest summary line
- missing information that matters
- unsafe or misleading wording
- decision
- smallest next artifact

## Decision Scorecard

Use this table during review. The MVP should continue only if the supporting signals are strong enough and no hard blocker is present.

| Signal | Supporting | Uncertain | Blocking |
| --- | --- | --- | --- |
| Repeated-question pain | Reviewer says the current visit repeats information this MVP captures. | Pain exists but the summary may not target it yet. | No meaningful repeated-question pain. |
| Summary usefulness | Clinician would read it before or during the visit. | Useful idea, wrong format. | Clinician would not read it. |
| Workflow slot | Check-in, nurse rooming, or previsit completion has a realistic slot. | Slot exists only with redesign. | No workflow slot. |
| Staff burden | Nursing effort is acceptable or limited to selected cases. | Burden unclear. | Burden is unacceptable. |
| Patient fit | Self-filled or assisted completion seems realistic. | Only some patients can complete it. | Completion seems unrealistic. |
| Existing process gap | Existing forms or interviews leave a real gap. | Gap is unclear. | Existing process may already be sufficient. |
| Safety boundary | Reviewer accepts the wording and review-only behavior. | Wording needs revision. | Boundary is unacceptable. |

## Decision Rules

### Continue

Use when:

- repeated-question pain is clear
- summary would be read
- workflow slot exists
- staff burden is acceptable
- safety boundary is acceptable
- existing process leaves a gap

Next artifact:

- revised question tree or one-page summary mockup

### Revise

Use when:

- workflow value is plausible but format or wording is not ready
- safety wording needs refinement
- workflow slot is unclear
- summary is useful but too noisy

Next artifact:

- one-page summary mockup or revised question tree

### Narrow

Use when:

- value is real only for a smaller population or assisted workflow
- patient self-completion is not broadly realistic
- a nurse-assisted pilot is more credible than a general patient-facing MVP

Next artifact:

- assisted workflow test

### Pause

Use when:

- safety boundary is unacceptable
- no workflow slot exists
- staff burden is unacceptable
- clinician would not read the summary
- existing process appears sufficient

Next artifact:

- pause note with rejected assumptions

## Hard Stop Conditions

Stop and revise before any further demo claim if:

- a screen implies diagnosis, triage, urgency assignment, or treatment
- a summary hides missing information
- `Not sure` opens broad modules without a clear concern
- reviewer cannot tell which answers came from patient/helper/staff
- a sample looks like real patient data
- the demo implies EHR/HIS/EMR integration
- nursing cues require work the clinic cannot realistically perform

## Evidence To Capture

For each reviewer, capture:

- role: physician, nurse, patient advocate, product, governance, other
- most useful summary line
- noisiest summary line
- missing information that matters
- unsafe or misleading wording
- expected workflow slot
- staff burden concern
- decision: continue, revise, narrow, or pause
- smallest next artifact

## Post-Review Output

After the review, there should be one of these outputs:

- Continue: build the next artifact and keep the same safety boundary.
- Revise: update wording, summary format, or question flow before adding scope.
- Narrow: limit the MVP to nurse-assisted or one symptom module.
- Pause: document rejected assumptions and stop implementation work.

Run `npm run review:closeout`, then use `docs/post-review-action-playbook.md` to create exactly one next artifact from the captured decision.

Do not expand the question set until reviewer evidence shows the current flow is useful and bounded.
