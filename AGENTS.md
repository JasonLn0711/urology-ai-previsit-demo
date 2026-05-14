# Repository Rules

## Project Identity

This repository belongs to the urology previsit collaboration with the Taipei
City Hospital Beitou Branch urology director. Its primary purpose is to preserve
and improve the synthetic-data `UroPrevisit Navigator` workflow for urology
previsit preparation.

## Huicheng Boundary

The Huicheng / imedtac AI-triage kiosk work is a separate project. It appeared
in this repository only because the Huicheng discussion reused similar workflow
ideas: structured intake, dynamic follow-up questions, ASR as an optional input,
and clinician-facing summaries.

Future Huicheng work must not modify this repository by default. Use the
separate execution repo instead:

```text
../ai-triage-kiosk-demo/
```

This urology repo may be used as a reference for architecture, interaction
patterns, safety wording, and lessons learned, but Huicheng implementation,
requirements, kiosk integration, vital-sign logic, and English triage demo work
belong in `../ai-triage-kiosk-demo/`.

Only continue changing this repository when the change is explicitly about the
urology previsit project itself, or when a new urology-side discussion/request
requires an update.

## Safety Boundary

Keep this repository scoped to synthetic-data workflow evidence. Do not add real
patient data, diagnosis, triage, treatment recommendations, exam ordering, HIS /
EMR / EHR / registration integration, or production clinical-use claims.
