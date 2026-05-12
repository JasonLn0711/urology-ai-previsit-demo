# 2026-05-12 Huicheng Kiosk AI Triage Sync

## Source

- Date: `2026-05-12`
- Context: 慧誠智醫 business / PM sync about future AI-triage collaboration.
- Planning source bundle: `/home/jnclaw/every_on_git_jnclaw/phd-life-system/planning-everything-track/data/knowledge/personal/sources/2026-05-12-huicheng-company-ai-triage-sync/`

## Why This Belongs Here

Jason used the current urology previsit demo as a reference during the company sync. The demo showed structured intake, dynamic question flow, patient/family assistance, nurse/clinician review, and optional ASR supplement fields.

This does not change this repository's implementation scope. It only records that the current urology workflow can serve as a technical and workflow reference for a separate future kiosk / urgent-care triage discussion.

The two projects are separate:

- This repository is for the urology previsit collaboration with the Taipei City Hospital Beitou Branch urology director.
- Huicheng / imedtac AI-triage kiosk work belongs in `../ai-triage-kiosk-demo/`.
- Future Huicheng work may borrow patterns and lessons from this repository, but should not modify this repository unless there is a separate urology-side reason to do so.

## Company-Side Product Facts

- 慧誠 has a self-service vital-sign kiosk.
- Default data include blood pressure, SpO2, temperature, and for the all-in-one SKU height/weight.
- The kiosk runs on Windows-based fanless all-in-one hardware with no onboard GPU.
- The platform context includes middleware, RESTful API, FHIR, HIS, and EMR integration.
- The company wants vital signs to matter in the AI-triage story because otherwise the triage layer is not clearly tied to its device.
- Overseas opportunity context includes US, Middle East, Singapore, Thailand, and Malaysia; June US-customer discussion creates pressure for an English reference demo.

## Boundary For This Repo

This repository still does not implement:

- autonomous triage,
- urgent-care risk scoring,
- queue reprioritization,
- diagnosis,
- treatment recommendation,
- exam ordering,
- real patient-data handling,
- HIS / EMR / EHR / registration integration,
- kiosk API integration.

## Product-Ladder Interpretation

The current repo remains the first step:

`urology previsit intake -> nurse / clinician review -> structured evidence handoff`

The separate 慧誠 lane may later explore:

`English symptom intake -> ASR or touch input -> vital-sign API bridge -> clinician-visible triage support -> governed kiosk / HIS integration`

That future ladder needs separate clinical criteria, data/API details, safety wording, and company signoff before implementation.

## Confidentiality Note

Do not expose patent-sensitive or core ASR + LLM workflow details from this repository. External-facing demos should describe only the safe workflow surface, implementation options, and boundaries unless disclosure is approved.
