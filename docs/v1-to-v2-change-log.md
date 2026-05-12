# V1 to V2 Change Log

## One-Line Definition

V2 upgrades the fixed-path questionnaire demo into an ASR-ready, embedding-retrieval adaptive questioning demo.

## V1

V1 is a fixed-path previsit questionnaire demo.

The system presents a predefined sequence of questions. The patient answers each question in order. The demo proves that a digital previsit intake flow can collect answers and produce role-separated outputs.

In short:

```text
Question 1 -> Question 2 -> Question 3 -> Question 4 -> Summary
```

V1 is stable and easy to understand, but the next question mostly comes from screen flow. It can look like a digital form rather than an AI-guided workflow.

## V2

V2 is an adaptive question navigation demo.

The patient can answer by speech transcript or typed input. After each answer, the system recalculates the current patient state, checks what is known, identifies missing or ambiguous information, retrieves candidate questions from a governed urology question bank, ranks them, and asks the next most useful question.

In short:

```text
Patient speech or typed answer
-> current patient state
-> governed question-bank retrieval
-> deterministic ranking
-> next best question
-> explanation
```

## Core V2 Claim

Each next question is selected because it is the most useful question at the current step.

The AI value is not free-form chatting. The AI value is dynamic next-question selection from a governed question bank.

## Product Difference

| Area | V1 | V2 |
| --- | --- | --- |
| Flow | Fixed sequence | Adaptive question navigation |
| Input | Structured clicks | ASR-ready transcript or typed fallback |
| Question source | Predefined screen order | Governed urology question bank |
| AI role | Minimal | Retrieves and ranks the next useful question |
| Patient value | Can answer forms | Gets fewer irrelevant questions and fewer repeats |
| Clinician value | Receives structured output | Sees how each question fills a clinical history gap |
| Safety | No diagnosis / no treatment | Same boundary, plus no free-form clinical question generation |

## V2 Safety Boundary

V2 does not diagnose.

V2 does not recommend treatment.

V2 does not generate free-form clinical questions.

V2 does not connect to HIS, EMR, EHR, registration, queue, or messaging systems.

All next questions must come from the governed question bank. The ranking engine can select and explain a question, but it cannot invent one.

## LLM Position

LLM is intentionally not part of the V2 runtime.

The V2 runtime focuses on:

```text
ASR-ready input + embedding-style retrieval + deterministic ranking
```

LLM can be evaluated later for summarization, language rewriting, and clinician-facing report generation. It should not control next-question selection in this demo.

