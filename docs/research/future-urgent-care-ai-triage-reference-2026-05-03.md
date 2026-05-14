# 2026-05-03 Future Reference - Urgent-Care AI Triage

## Source
- Sender: Ken Yu / 余金樹.
- Date: `2026-05-03`.
- Source type: LINE image and message captured in the planning repo.
- Planning capture:
  - `/home/jnclaw/every_on_git_jnclaw/phd-life-system/planning-everything-track/weeks/2026-W18/days/2026-05-03.md`
  - `/home/jnclaw/every_on_git_jnclaw/phd-life-system/planning-everything-track/data/projects/2026-04-urology-ai-previsit-interview/2026-05-03-yu-urgent-care-ai-triage-reference.md`
  - `/home/jnclaw/every_on_git_jnclaw/phd-life-system/planning-everything-track/data/knowledge/healthcare/urology/previsit-interview/assets/2026-05-03-yu-urgent-care-ai-triage/README.md`

## Exact LINE Text

```text
May 3, 2026 Sunday
11:21 Ken Yu 余金樹 Photos
11:25 Ken Yu 余金樹 @吳育德 昨天提到的Urgent care intake kiosk with AI triage, 這應該是終極目標，但可以先從協助醫生問診開始，然後直接連到HIS. 美國資安太嚴格，短期內外國人軟體應該不容易進去，但其他地區應該是趨勢也有機會。請老師參考一下。
```

## Image Reference
The image frames the future target as an `AI-Powered Smart Triage System — AIRA360°` that analyzes symptoms and vitals, predicts risk level, flags high-risk patients, reorders queue based on urgency, and works across OPD, ER, and telehealth.

Treat that image as a future-direction reference only. It is not a requirement for the current demo.

## Product Ladder

| Step | Meaning for this repo | Status |
| --- | --- | --- |
| `協助醫生問診` | Structured urology previsit intake, missing-field repair, source attribution, clinician summary, visit packet, and reviewer evidence | Current system scope |
| `Urgent care intake kiosk with AI triage` | Possible future product direction using intake surfaces as the front door | Research/spec only |
| `直接連到HIS` | Future integration topic after workflow value, governance, privacy/security, hospital approval, and regulatory language are clear | Out of current scope |

## Current Boundary
This repository does not implement:

- autonomous triage
- risk scoring
- queue reprioritization
- emergency-priority labeling
- diagnosis
- treatment recommendation
- exam ordering
- real patient-data handling
- HIS / EMR / EHR / registration integration

The correct near-term use of this reference is to ask whether the current role-separated urology MVP is the right base for a future triage-adjacent product ladder.

## Research Implication
Phase 1 review can add one discussion question:

> If this previsit workflow later became a Taiwan-local urgent-care or clinic-intake system, which parts should stay as physician history-taking support, and which parts would require separate triage / HIS / regulatory governance?

Do not add risk scores, urgency levels, or HIS fields to Phase 1 logs before that question is answered.
