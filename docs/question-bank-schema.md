# Question Bank Schema

This document defines the governed metadata contract for V2 adaptive questioning.

The canonical V2 spec is `docs/urology-ai-previsit-demo-v2-spec.md`.

## Active Banks

The old 41-question bank is preserved for traceability as
`LEGACY_QUESTION_BANK`. The active runtime bank is
`COMPACT_PREVISIT_QUESTION_BANK`, exported as `QUESTION_BANK`.

First-principles constraint:

```text
The active patient-facing previsit flow must stay within 12 questions.
```

The compact bank keeps only the minimum information a clinician needs to take
over the diagnostic conversation: main concern, duration/bother, storage
symptoms, leakage, voiding difficulty, pain/systemic symptoms, visible blood,
background/medication context, and final patient supplement.

## Required Fields

Each question exported by `core/adaptive_questioning/questionBank.js` should expose:

```js
{
  id,
  text,
  type,
  asksFor,
  symptoms,
  domain,
  clinicalValue,
  ambiguityReduction,
  safetyPriority,
  redFlag,
  nextUsefulWhen,
  avoidWhen,
  answerType,
  options,
  explanationTemplate
}
```

## Field Meaning

| Field | Meaning |
| --- | --- |
| `id` | Stable question identifier used by state, tests, and UI |
| `text` | Patient-facing question text |
| `type` | Question type, such as `clarification`, `quantification`, `yes_no`, or `red_flag_check` |
| `asksFor` | Slot or slots this question fills |
| `symptoms` | Symptom tags used for retrieval and ranking |
| `domain` | Urology workflow domain such as `storage_symptoms`, `voiding_symptoms`, or `hematuria_context` |
| `clinicalValue` | Value for clinician-facing previsit history |
| `ambiguityReduction` | Value for reducing vague or unclear patient wording |
| `safetyPriority` | Priority for safety-boundary or red-flag information |
| `redFlag` | Whether this question relates to priority clinician-review information |
| `nextUsefulWhen` | Human-readable conditions where the question is useful |
| `avoidWhen` | Human-readable conditions where the question should be skipped or downranked |
| `answerType` | Expected answer shape |
| `options` | Answer options for choice questions |
| `explanationTemplate` | Plain explanation for why the question can be selected |

## Question Types

Supported or expected types:

```text
open_text
single_choice
multi_choice
yes_no
duration
severity_scale
clarification
red_flag_check
closing
```

## Safety Rule

Question-bank entries can support clarification and red-flag boundary checks, but they must not make diagnosis, treatment, medication, exam-ordering, or triage claims.
