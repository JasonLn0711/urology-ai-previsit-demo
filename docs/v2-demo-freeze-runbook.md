# V2 Demo Freeze Runbook

This runbook turns the V2 SDD/spec into the next execution step: a repeatable live demo and backup-recording flow for the `2026-05-19` hospital/product-agent meeting.

## First Principle

The scarce resource is credible demo evidence before the `2026-05-15 17:00` internal freeze.

Do not add new clinical scope during rehearsal. The goal is to prove the current V2 claim:

```text
After each patient answer, the system selects the next most useful governed question from the current patient state.
```

## Demo Positioning

Use this language:

```text
AI-guided previsit question navigation system
AI 輔助門診前病史蒐集系統
```

Avoid this language:

```text
AI doctor
medical chatbot
diagnosis assistant
autonomous triage
treatment recommendation
```

## Required Local Route

Start the static server from the repo root:

```bash
npm start
```

Open:

```text
http://localhost:4173/app/adaptive-intake/
```

Current product version:

```text
v2.0.0
```

Keep these fallback routes ready:

```text
http://localhost:4173/app/patient-short/
http://localhost:4173/app/reviewer/packet/
```

## Preflight Checklist

Run these commands before recording or live rehearsal:

```bash
npm run version:check
npm test
npm run smoke
npm run demo:v2-freeze
git diff --check
```

Expected current baseline:

```text
npm run version:check: 10/10
npm test: 35/35
npm run smoke: 150/150
npm run demo:v2-freeze: 734/734
adaptive route: HTTP 200
question bank: 41 governed questions
```

If a test count changes because the repo gained tests, treat a clean pass as acceptable and update this runbook.

## Three-Case Rehearsal

### Case A: Nocturia / Frequency

Use typed input if ASR is unstable:

```text
I wake up several times at night to pee.
```

Expected current engine output:

```text
selected: nocturia_count
question: 晚上睡著後通常會起來尿尿幾次？
ambiguity: clear_enough
top 3: nocturia_count, nocturia_sleep_impact, daytime_frequency
```

Talk track:

```text
The patient used ordinary language. The system detected nocturia and selected a quantification question because nocturia count is the most useful missing field.
```

### Case B: Dysuria

Use typed input:

```text
It burns when I pee.
```

Expected current engine output:

```text
selected: pain_burning
question: 尿尿時會痛、刺痛或灼熱嗎？
ambiguity: clear_enough
top 3: pain_burning, pain_timing, systemic_symptoms
```

Talk track:

```text
The system does not diagnose infection. It asks a governed follow-up that turns the patient's wording into a structured previsit field.
```

### Case C: Ambiguous Pain

Use typed input:

```text
I feel pain down there.
```

Expected current engine output:

```text
selected: clarify_pain_location
question: 你說的疼痛或不舒服，位置比較接近哪裡？
ambiguity: clarification_needed
top 3: clarify_pain_location, pain_burning, pain_timing
```

Talk track:

```text
This is the strongest V2 behavior. When patient wording is unclear, the system does not over-interpret. It asks a clarification question before ordinary symptom retrieval.
```

## Five-Minute Recording Flow

1. Open with the v1 -> v2 contrast.
2. State the visible product version: `UroPrevisit Navigator v2.0.0`.
3. State the safety boundary: synthetic demo, no diagnosis, no treatment, no free-form medical question generation, no LLM runtime.
4. Run Case A and point to detected state, missing fields, selected question, and top 3 candidates.
5. Run Case B and point to governed follow-up plus safety-boundary wording.
6. Run Case C and emphasize the ambiguity gate.
7. Close with: V2's AI value is dynamic next-question selection, not chatting.

## Backup Plan

If ASR fails:

```text
ASR is only the input layer. Typed input is the intended fallback and demonstrates the same transcript-to-state-to-next-question pipeline.
```

If the browser route fails:

1. Restart with `npm start`.
2. Confirm `http://localhost:4173/app/adaptive-intake/` returns.
3. If port `4173` is occupied, use another local port and keep the same `/app/adaptive-intake/` path.
4. If live UI cannot be recovered, show `docs/demo-script-5min.md` plus terminal outputs from the three-case rehearsal.

If a ranking output changes:

1. Confirm the selected question is still from the governed bank.
2. Confirm vague pain still selects a clarification question.
3. Confirm no diagnosis or treatment wording appears.
4. If those three conditions hold, update the expected-output block before freeze.

## Freeze Criteria

Freeze V2 only when all are true:

```text
- app/adaptive-intake/ opens locally
- typed input works
- ASR button remains optional and does not block the demo
- Case A selects nocturia_count or another defensible nocturia follow-up
- Case B selects pain_burning, pain_timing, duration, or safety-boundary follow-up
- Case C selects a clarification question
- top 3 candidates are visible
- explanation reasons are visible
- no LLM runtime is required
- no diagnosis or treatment advice appears
- npm test passes
- npm run smoke passes
- npm run demo:v2-freeze passes
- git diff --check passes
- backup recording exists or is explicitly scheduled
```

## Post-Rehearsal Evidence

After each rehearsal or recording, record:

```text
- date and time
- route used
- commands run
- pass/fail results
- three-case outputs
- UI or ASR issue found
- whether backup video was recorded
- next smallest fix, if any
```

Keep implementation evidence in this repo. Planning should only mirror locator, status, boundary, and next gate.
