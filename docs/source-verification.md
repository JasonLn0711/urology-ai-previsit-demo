# Demo Source Trace

This file is a lightweight source trace for the static demo.

It is not the canonical clinical evidence map. Detailed clinical question governance lives in the sibling thinking repository:

`../urology-ai-previsit-thinking-spec/clinical-question-governance/source_evidence_map.md`

## Clinical Question Governance Source Of Truth

Use the thinking repository for decisions about which patient questions belong in core MVP, conditional modules, family/source-labeled support, nurse repair, or clinician-only workflows.

The implemented demo question flow follows the sibling file:

`../urology-ai-previsit-thinking-spec/clinical-question-governance/mvp_question_set_recommendation.md`

The demo's synthetic scenario source of truth is:

`app/shared/cases.js`

Patient demo scenarios, clinician summary samples, and generated sample artifacts should read from this shared source so meeting artifacts do not drift from the browser demo.

The implemented demo now has four role-separated browser surfaces:

- Patient/family intake: `app/patient-demo/`
- Nurse missing-information workbench: `app/nurse-workbench/`
- Clinician previsit summary: `app/clinician-summary/`
- Role-separated visit packet: `app/visit-packet/`

Patient/family screens must not expose staff-only routes or staff-only wording. The nurse and clinician surfaces may read the same synthetic answer object, but they must render different tasks and preserve field-level answer source.

The lightweight MVP readiness check is:

`npm run smoke`

It verifies entrypoints, browser script order, shared synthetic cases, generated sample front matter, stale references, patient/family isolation from staff-only surfaces, display controls, read-aloud wiring, and safety-boundary wording. It does not replace browser visual review.

The scenario workflow rehearsal is:

`npm run rehearsal`

It generates `docs/workflow-rehearsal.md` from shared cases and summary logic so patient/family flow, nurse cues, missing fields, clinician summary content, source labeling, and reviewer questions can be checked before a meeting.

The meeting review entrypoint is:

`docs/mvp-review-packet.md`

It consolidates artifact routing, reviewer roles, decision scorecard, continue/revise/narrow/pause rules, and hard stop conditions.

The durable meeting capture template is:

`docs/meeting-capture-template.md`

It captures four-case evidence, decision signals, final decision, smallest next artifact, and hard stop notes.

The post-review action playbook is:

`docs/post-review-action-playbook.md`

It maps `continue`, `revise`, `narrow`, and `pause` to exactly one next artifact, with done conditions and hard stops.

The dated review workspace for the 2026-04-23 meeting is:

`docs/reviews/2026-04-23-urology-review/decision-capture.md`

It must remain `pending review` until real reviewer evidence is captured.

The pre-meeting readiness check is:

`npm run meeting:check`

It verifies required files, pending capture state, smoke checks, tests, and live local routes while the static server is running.

The reviewer one-page handout is:

`docs/reviews/2026-04-23-urology-review/reviewer-one-page-handout.md`

It gives the reviewer a compact meeting goal, boundary, four-case scan, decision choices, and evidence checklist without changing the clinical scope.

The post-review closeout check is:

`npm run review:closeout`

It should run only after the reviewer record has been pasted into `docs/reviews/2026-04-23-urology-review/decision-capture.md`. It verifies that the capture is complete enough to justify one selected artifact from `docs/post-review-action-playbook.md`.

The post-review artifact starters are:

`docs/reviews/2026-04-23-urology-review/artifact-starters/`

They are blank, evidence-gated starters for the one selected artifact after `npm run review:closeout` passes. They do not choose an artifact or add clinical scope before reviewer evidence exists.

The selected-artifact readiness check is:

`npm run artifact:check`

It should run only after one starter has been filled with reviewer evidence. It fails while placeholders remain or the review-only safety boundary is missing.

The role-separated architecture note is:

`docs/role-separated-workflow.md`

The governance pack maps conclusions to sources such as:

- AUA/SUFU overactive bladder guidance
- AUA/SUFU microhematuria guidance
- AUA/CUA/SUFU recurrent urinary tract infection guidance
- AUA LUTS/BPH guidance
- NICE LUTS and urinary incontinence guidance
- ICS bladder diary / frequency-volume chart terminology
- ICIQ urinary incontinence and bladder diary modules

## Demo-Level Usability And Safety Sources

These sources support demo communication, usability, accessibility, privacy, and safety boundaries:

- CDC health-literacy communication strategies: clear communication, plain language, and support for patients with different literacy needs.
  - https://www.cdc.gov/health-literacy/php/research-summaries/communication-strategies.html
- AHRQ Health Literacy Universal Precautions Toolkit: simplify communication, confirm understanding, and support patient navigation.
  - https://www.ahrq.gov/health-literacy/improve/precautions/index.html
- HHS Health Literacy Online user-friendly forms: short steps, minimal information, and easy scanning.
  - https://odphp.health.gov/healthliteracyonline/create-actionable-content/ensure-forms-are-user-friendly
- FDA human factors and medical devices: user interfaces should reduce use-related hazards and use errors.
  - https://www.fda.gov/medical-devices/device-advice-comprehensive-regulatory-assistance/human-factors-and-medical-devices
- WCAG 2.2: web content should support users with visual, physical, cognitive, language, and age-related needs.
  - https://www.w3.org/TR/WCAG22/

## Privacy And AI Boundary Sources

- HHS HIPAA mobile-health privacy guidance: mobile health privacy obligations depend on whether a covered entity or business associate is involved.
  - https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/cell-phone-hipaa/index.html
- FTC mobile health app interactive tool: health app developers must understand data flows, PHI/PHR obligations, and breach notification triggers.
  - https://www.ftc.gov/business-guidance/resources/mobile-health-apps-interactive-tool
- FDA AI/ML SaMD overview: AI/ML medical device functions need appropriate risk-based consideration.
  - https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-software-medical-device

## Demo Boundary

The demo may show synthetic patient-reported observations, missing-information prompts, and clinician-facing summaries.

The demo must not claim to be clinically validated, diagnose, triage, recommend treatment, or replace the clinical question governance documents in the thinking repository.
