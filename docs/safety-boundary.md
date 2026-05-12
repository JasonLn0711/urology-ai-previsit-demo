# V2 Safety Boundary

The canonical V2 spec is `docs/urology-ai-previsit-demo-v2-spec.md`.

## Runtime Boundary

V2 does not include:

```text
- LLM runtime
- free-form clinical question generation
- diagnosis
- treatment recommendation
- medication recommendation
- exam ordering
- HIS / EMR / EHR integration
- real patient data
- production clinical deployment
- final medical decision support
```

## Required Rules

```text
1. All questions must come from the governed question bank.
2. The system must not freely generate new medical questions.
3. The system must not say "you may have disease X".
4. The system must not recommend medication, tests, or treatment.
5. The system only supports previsit information collection.
6. Red-flag items can only be marked for clinician review.
7. Ambiguous answers must trigger clarification before forced classification.
```

## UI Safety Copy

English:

```text
This demo supports previsit information collection only. It does not diagnose, recommend treatment, or replace clinician judgment.
```

Chinese:

```text
本系統僅用於門診前資訊蒐集展示，不提供診斷、治療建議，也不取代醫療人員判斷。
```

## Positioning

Do not call V2:

```text
AI doctor
medical chatbot
diagnosis assistant
triage engine
```

Use:

```text
AI-guided previsit question navigation system
AI 輔助門診前問答導航系統
AI 輔助門診前病史蒐集系統
```

