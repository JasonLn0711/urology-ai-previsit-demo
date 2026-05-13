# Five-Minute Demo Script

For the full freeze checklist, expected three-case engine outputs, and backup
recording plan, use `docs/v2-demo-freeze-runbook.md`.

## 0:00-0:30 Opening

Version 1 was a fixed questionnaire flow. It proved that we could build a safe previsit intake interface.

Version 2 upgrades the demo into adaptive questioning. The patient can answer naturally by speech transcript or typed input. After each answer, the system recalculates the current patient state and selects the next most useful question from a governed urology question bank.

Key sentence:

> The AI value is not chatting. The AI value is selecting the next most useful question after each answer.

## 0:30-1:15 Safety Boundary

This demo does not use real patient data. It does not diagnose. It does not recommend treatment. It does not generate free-form clinical questions.

All questions come from a governed question bank. The ranking engine only selects and explains.

LLM is not in the runtime for this version. LLM can be evaluated later for summarization and clinician-facing report writing, but next-question selection is kept deterministic and explainable.

## 1:15-2:10 Case A: Nocturia / Frequency

Click `夜尿案例`.

Say:

The patient reports waking at night to urinate and sometimes feeling urgency. The system detects nocturia, frequency, and urgency. It also sees that severity and exact frequency are missing.

Point to:

- transcript
- current patient state
- missing information
- selected next question
- top 3 candidates

Explain:

The selected question asks how many times the patient wakes up at night. This is selected because it quantifies nocturia and fills a missing field useful for clinician review.

## 2:10-3:10 Case B: Dysuria / Infection-Like Concern

Click `尿痛案例`.

Say:

Here the patient says urination burns and also mentions fever or flank discomfort. The system does not diagnose infection. It selects follow-up questions that clarify symptoms and safety-boundary information.

Point to safety reasons:

- pain / burning during urination
- fever, chills, or flank pain
- no diagnosis wording
- clinician review remains required

## 3:10-4:20 Case C: Vague Pain

Click `下面痛`.

Say:

This is the most important V2 behavior. Patients often say vague things like `下面痛` or `private area pain`. The system should not pretend it knows whether this means urethral pain, genital pain, lower abdominal pain, or perineal pain.

Point to ambiguity gate:

The ambiguity gate is active. The system downranks ordinary retrieval questions and selects a clarification question first.

Selected question:

```text
你說的疼痛或不舒服，位置比較接近哪裡？
```

Explain:

This is not diagnosis. It is ambiguity reduction. The system helps the patient make vague language usable for clinician review.

## 4:20-5:00 Close

The product positioning is:

```text
AI-guided previsit question navigation system
```

Chinese wording:

```text
AI 輔助門診前病史蒐集系統
```

Close with:

> V1 is a fixed questionnaire. V2 is adaptive question navigation. Each time the patient answers, the system recalculates what is known, what is missing, and what is ambiguous, then selects the next most useful governed question.

## Backup Line If ASR Fails

ASR is the input layer, not the medical reasoning layer. For the live demo, typed input shows the same transcript-to-next-question pipeline and is the intended fallback.
