# V2 First-Principles Readiness Audit

This audit lists the non-obvious work that matters after the SDD/spec is written. It is intentionally stricter than a feature checklist.

## First Principle

The scarce resource is not another feature. The scarce resource is credible, repeatable, low-risk evidence in front of hospital stakeholders.

For the `2026-05-19` meeting, credibility depends on five things:

```text
1. The demo opens immediately.
2. The demo claim is narrow and defensible.
3. The system visibly explains dynamic next-question selection.
4. Failure modes have calm fallbacks.
5. The meeting produces a decision or a concrete next gate.
```

## Must-Do Items

| Priority | Item | Why it matters | Current action |
| --- | --- | --- | --- |
| P0 | Add an executable V2 freeze gate | Human checklists drift under pressure | Added `npm run demo:v2-freeze` |
| P0 | Verify three demo cases from code, not memory | The live ranking can drift as the bank grows | `demo:v2-freeze` checks nocturia, dysuria, and vague pain outputs |
| P0 | Render the route in a real browser | Unit tests do not prove text is readable or controls respond | Use Browser plugin when available; otherwise use local browser/Playwright fallback |
| P0 | Keep typed input as the official fallback | ASR failure should not become demo failure | Runbook positions ASR as input layer only |
| P0 | Control claim language | Hospital stakeholders will hear risk before novelty | Use `AI-guided previsit question navigation`, not chatbot/doctor/triage |
| P0 | Make the demo version visible and testable | Stakeholders need to know which exact evidence state was shown | Added `VERSION.json`, visible `v2.0.0` badge, changelog, and `npm run version:check` |
| P0 | Prepare a backup recording | Live demo risk is never zero | Record the three-case flow before freeze |
| P1 | Prepare a one-page meeting brief | The audience needs the product boundary in one glance | Use `docs/demo-script-5min.md` and this audit as source |
| P1 | Prepare a post-demo decision capture | Otherwise feedback becomes vague and non-actionable | Added `docs/v2-post-demo-decision-capture.md` |
| P1 | Decide what not to answer live | Over-answering creates unsafe clinical or integration claims | Defer real patient data, HIS/EHR, diagnosis, treatment, triage, and deployment |
| P1 | Keep local server / route recovery simple | A route failure should be recoverable in under one minute | Runbook says restart `npm start`, keep same route path |
| P2 | Avoid committing to LLM runtime | The current defensible value is governed question selection | LLM remains future summarization/rewrite/report layer only |
| P2 | Record career evidence after artifact is real | Resume value comes from delivered evidence, not planned intent | Planning owns later career bridge only |

## Things We Had Not Discussed Enough

### 0. Rendered QA Can Find Bugs That Tests Cannot

This happened in the first rendered pass: the mobile V2 hero title collapsed into near-vertical text because the adaptive route kept a two-column hero layout under the mobile breakpoint. Unit tests, smoke tests, and route checks all passed.

Fix applied:

```text
app/adaptive-intake/adaptive-intake.css now forces the adaptive hero to one column on mobile and reduces the mobile H1 size.
```

Current rendered QA evidence:

```text
desktop screenshot: /tmp/urology-v2-playwright-desktop-fixed.png
mobile screenshot: /tmp/urology-v2-playwright-mobile-fixed.png
interaction screenshots: /tmp/urology-v2-desktop-case-c.png and /tmp/urology-v2-mobile-case-a.png
```

Lesson:

```text
Before freeze, always inspect desktop and mobile screenshots, even for a static demo.
```

### 1. Demo Failure Is A Product Requirement

The demo should survive:

```text
- ASR not working
- no network
- route/server restart
- ranking output changing slightly
- stakeholder asking whether this diagnoses
- stakeholder asking whether this connects to HIS
```

Decision:

```text
Typed input is not a weaker backup. It is the canonical proof of the transcript-to-state-to-question pipeline.
```

### 1a. Version Drift Is Evidence Drift

If the demo changes but the version does not, then the backup video, stakeholder comments, and post-demo decision capture lose traceability.

Decision:

```text
Every meaningful runtime, question-bank, safety, UI, test, or hospital-facing docs change must update VERSION.json, core/version/index.js, package.json, and docs/CHANGELOG.md.
```

Use:

```bash
npm run version:bump -- patch "Short change summary"
npm run version:check
```

Use `minor` for new capability and `major` for a product-claim, safety-boundary, or workflow-contract change.

### 2. The Most Dangerous Moment Is The Q&A

The risky answers are not in the UI. They are verbal overclaims.

Use these responses:

```text
Q: Can it diagnose?
A: No. This version only collects previsit information and selects governed next questions.

Q: Can it recommend medicine or tests?
A: No. Red-flag items are only marked for clinician review.

Q: Is this an LLM chatbot?
A: No. V2 intentionally keeps next-question selection deterministic and governed.

Q: Can it connect to HIS/EHR?
A: Not in this demo. Any real integration needs hospital IT, privacy, security, and legal review.

Q: Can we use real patient data?
A: Not in this prototype. Real data would require the proper clinical, consent, retention, and governance process.
```

### 3. The Decision After The Demo Must Be Predefined

The meeting should not end with "looks good."

Acceptable next gates:

```text
- continue: record a short backup video and schedule a reviewer walkthrough
- revise: adjust the demo script, wording, or three-case flow
- narrow: focus only on ambiguity handling or only on nocturia/frequency
- pause: wait for stakeholder, governance, or data/API clarification
- split: keep urology previsit separate from urgent-care triage kiosk work
```

### 4. Do Not Let Huicheng / AI-Triage Scope Leak Into Urology

This repo proves a urology previsit navigation pattern. It should not become a broad urgent-care triage system.

If asked about all-specialty triage:

```text
This urology demo shows the pattern: governed question bank, ambiguity handling, and explainable next-question selection. The all-specialty triage version would need its own source governance, safety boundary, vital-sign criteria, and reviewer validation.
```

### 5. The Backup Video Is More Important Than One More Feature

The last unit of effort before freeze should go to:

```text
- screen recording
- route preflight
- concise talk track
- stakeholder Q&A boundary answers
```

not to:

```text
- adding more questions
- changing the UI visual system
- adding LLM calls
- adding HIS/API mocks
- expanding to more specialties
```

## Concrete Next Execution Order

1. Run:

```bash
npm test
npm run smoke
npm run version:check
npm run demo:v2-freeze
git diff --check
```

2. Open:

```text
http://localhost:4173/app/adaptive-intake/
```

3. Rehearse and record:

```text
Case A: I wake up several times at night to pee.
Case B: It burns when I pee.
Case C: I feel pain down there.
```

4. Fill:

```text
docs/v2-post-demo-decision-capture.md
```

5. Only after the recording works, decide whether to commit or polish.

## Go / No-Go Rule

Go only if:

```text
- all gates pass
- the route renders
- typed input works
- three cases produce defensible selected questions
- vague pain triggers clarification
- no diagnosis/treatment wording appears
- a backup recording exists or is scheduled before the freeze
```

No-go if:

```text
- route is unreliable
- vague pain skips clarification
- the talk track drifts into diagnosis, triage, or treatment
- there is no backup path for ASR failure
- stakeholders are expected to infer safety boundaries from code instead of visible wording
```
