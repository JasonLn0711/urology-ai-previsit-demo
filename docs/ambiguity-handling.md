# Ambiguity Handling

## Core Rule

When patient language is unclear, the system should clarify before retrieval.

It should not force a diagnosis-like interpretation from vague wording.

## State Labels

V2 uses four conceptual states for patient information:

| State | Meaning | System behavior |
| --- | --- | --- |
| clear | The symptom or slot is specific enough | Continue normal question-bank retrieval |
| ambiguous | Multiple interpretations are possible | Ask a clarification question first |
| conflicting | Current answer contradicts previous answer | Ask a confirmation / correction question |
| insufficient | The answer is too weak or uncertain | Ask an easier range or category question |

The current demo implements the `clear` and `ambiguous` paths and keeps the design open for `conflicting` and `insufficient`.

## Why This Matters

Patients do not speak in clinical fields.

They may say:

```text
下面痛
尿尿怪怪的
那邊不舒服
私密處痛
I feel pain down there
My private area hurts
```

These phrases can point to different clinical-history slots:

- pain during urination
- lower abdominal pain
- genital surface pain
- perineal pain
- flank or back pain
- vague discomfort without a clear location

The safe behavior is not to guess. The safe behavior is to ask the next clarification question.

## Vague Pain Example

Patient:

```text
I feel pain down there.
```

System state:

```json
{
  "symptom": "genitourinary_pain_unspecified",
  "status": "ambiguous",
  "possible_interpretations": [
    "urethral_pain",
    "genital_pain",
    "lower_abdominal_pain",
    "perineal_pain"
  ]
}
```

Selected next question:

```text
Where do you feel the pain most clearly?
```

Example options:

```text
Pain or burning during urination
Lower abdominal pain
Pain around the genitals
Back or flank pain
Not sure
```

## Vague Urinary Symptom Example

Patient:

```text
尿尿怪怪的，但不知道怎麼講。
```

Selected next question:

```text
你說的「尿尿怪怪的」比較接近哪一種？
```

This reduces the symptom type before ordinary retrieval begins.

## Generalization Example

The same design applies beyond urology.

For example, when a patient says `頭痛`, the system should avoid assuming whether the pain is deep headache or scalp surface pain. A clarification question can ask whether it feels like pain inside the head or pain on the scalp surface.

This example is useful for slides, but the live demo should stay focused on the urology use case.

## Safety Boundary

Clarification questions are not diagnostic questions.

They only transform vague patient language into structured information that a clinician can review.

