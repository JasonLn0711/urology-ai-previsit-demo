# Meeting Demo Script

## Purpose

Use this script for the live urology previsit MVP review. The goal is not to sell a finished product. The goal is to help the reviewer decide whether a bounded, synthetic-data, UI-guided previsit workflow is worth another prototype cycle.

## Preflight

Run these before the meeting:

```bash
npm run rehearsal
npm run samples
npm run smoke
npm test
python3 -m http.server 4173
```

Start from:

`http://localhost:4173/app/review-packet/`

Keep these tabs ready:

1. `app/review-packet/`
2. `app/patient-demo/`
3. `app/clinician-summary/`
4. `app/reviewer-workbench/`
5. `docs/workflow-rehearsal.md`

## 60-Second Framing

This is a synthetic-data professional MVP for urology previsit discovery. It does not diagnose, triage, or recommend treatment. It only organizes patient-provided or helper-provided information for clinician review.

The review question is:

Would this workflow reduce repeated questioning and improve previsit readiness enough to justify one more prototype cycle?

The decision options are:

- Continue: value and workflow fit are clear.
- Revise: value is plausible, but wording, summary format, or workflow placement needs another pass.
- Narrow: value exists only for a smaller assisted workflow or symptom module.
- Pause: safety, workflow, staff burden, summary usefulness, or existing process blocks the MVP.

## Default 30-Minute Agenda

| Time | Action | Output |
| --- | --- | --- |
| 0-3 min | Open the review packet and state the non-negotiable boundary. | Reviewer understands this is review-only and synthetic-data-only. |
| 3-6 min | Show artifact map and decision scorecard. | Reviewer knows what to judge. |
| 6-18 min | Run the four synthetic cases quickly. | Reviewer sees storage, voiding, leakage, and recurrent-infection paths. |
| 18-23 min | Inspect clinician summary and nurse cues. | Identify useful lines, noisy lines, and missing information. |
| 23-28 min | Open reviewer workbench and capture signals. | Draft continue / revise / narrow / pause decision. |
| 28-30 min | Confirm smallest next artifact. | No scope expansion without reviewer evidence. |

## Four-Case Walkthrough

| Case | Why It Exists | Show | Ask |
| --- | --- | --- | --- |
| Frequent urination at night | Tests storage symptoms, nocturia, diary feasibility, and medication/context cues. | Storage module, fluid/caffeine context, bladder diary cue, summary pattern. | Would these lines reduce repeated frequency/nocturia questions? |
| Difficulty emptying | Tests weak stream, straining, incomplete emptying, and neutral priority-review wording. | Voiding module, current inability follow-up, review statements. | Does this wording stay useful without becoming triage? |
| Incomplete leakage intake | Tests missing-information repair, assisted completion, and containment support. | Missing fields, helper-assisted mode, leakage amount gap, nurse cues. | Would staff know what to clarify before the physician enters? |
| Recurrent infection context | Tests repeated-symptom history without diagnosing UTI. | Recurrent infection concern route, pain/infection module, medication/context module. | Is this history useful, or should it be physician-led? |

## Exact Demo Path

1. Open the review packet.
2. Point to the safety strip:
   - synthetic data only
   - no diagnosis, triage, or treatment advice
   - clinician review remains required
3. Show the artifact map.
4. Open the patient MVP.
5. Load `Frequent urination at night`.
6. Show that the storage module appears because the concern and core answers justify it.
7. Show the clinician summary and nurse cues.
8. Repeat with `Difficulty emptying`, focusing on neutral review statements.
9. Repeat with `Incomplete leakage intake`, focusing on visible missing information.
10. Repeat with `Recurrent infection context`, focusing on repeated episode history without diagnosis language.
11. Open the reviewer workbench.
12. Capture reviewer signals.
13. Ask for one decision: continue, revise, narrow, or pause.
14. Ask for one smallest next artifact.

## Physician Prompts

- Which summary line would you read first?
- Which line would save repeated questioning?
- Which line is noise?
- Which information must remain physician-led?
- Is recurrent infection history useful at previsit, or should it stay in the physician interview?
- Are the priority review statements neutral enough?
- Would you prefer one summary section, a table, or a one-page PDF-style format?

## Nurse / Workflow Prompts

- When could this be completed: before visit, check-in, nurse rooming, or not at all?
- Should the first usable version be patient self-filled, nurse-assisted, or family-assisted?
- Which patients would need staff help?
- Can staff realistically clarify missing fields?
- Can staff review medication lists or should that remain outside MVP?
- Does the bladder diary cue fit the clinic workflow?
- Do containment-support cues help or create extra work?

## Product / Governance Prompts

- What is the strongest repeated-question pain point?
- What should be removed before adding any new field?
- Which existing form or process might already cover this?
- What safety wording feels too strong or too weak?
- What is the smallest next artifact: revised question tree, one-page summary mockup, nurse-assisted flow, or pause note?

## Acceptance Criteria For This Meeting

The meeting succeeds if it produces all of these:

- one clear workflow slot or a clear reason no slot exists
- one most useful summary line
- one noisiest or riskiest line
- one decision: continue, revise, narrow, or pause
- one smallest next artifact

The meeting does not need to produce:

- a final product roadmap
- EHR/HIS/EMR integration plan
- diagnosis or triage rules
- real patient-data plan
- voice-first AI scope

## Fallback Paths

### If Time Is Short

Run only two cases:

1. Frequent urination at night
2. Recurrent infection context

Then ask whether leakage and emptying should remain in the generic MVP or become later modules.

### If The Browser Fails

Use committed artifacts:

- `docs/workflow-rehearsal.md`
- `docs/samples/README.md`
- `docs/samples/clinician-summary-synthetic-frequency-older-adult.md`
- `docs/samples/clinician-summary-synthetic-emptying-difficulty.md`
- `docs/samples/clinician-summary-synthetic-incomplete-leakage.md`
- `docs/samples/clinician-summary-synthetic-recurrent-infection-context.md`

### If The Review Turns Clinical

Return to this sentence:

The MVP can capture patient-reported observations, but diagnosis, triage, examination, testing, and treatment decisions remain clinician-owned.

### If The Reviewer Wants More Features

Ask which current line was useful enough to justify more scope. If no line is useful, choose revise, narrow, or pause before adding fields.

## Stop Boundary

Do not promise EHR integration, diagnosis, voice-first AI, autonomous triage, real patient-data use, production deployment, or treatment recommendations in this meeting.
