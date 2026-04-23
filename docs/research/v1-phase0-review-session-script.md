# V1 Phase 0 Review Session Script

Duration: 30 to 45 minutes
Format: screen-share or local laptop walkthrough
Artifacts: `app/v1/`, scorecard, gate register

## Goal

Run a structured synthetic-only review with 許醫師 and, if possible, one nurse or clinic-staff reviewer.

The session should produce evidence, not approval to deploy.

## Before The Session

- Start local server: `npm start`.
- Open: `http://localhost:4173/app/v1/`.
- Open: `docs/research/v1-priority-flow-shortlist.md`.
- Open: `docs/research/v1-priority-flow-review-worksheet.md`.
- Open: `docs/research/v1-phase0-review-capture.md`.
- Open: `docs/research/v1-review-scorecard.md`.
- Open: `docs/research/v1-governance-gate-register.md`.
- Prepare benchmark links or screenshots for `聯醫小幫手` and `陽明小幫手` using synthetic inputs only.
- Prepare a timer for physician summary read time.
- Confirm no real patient data will be entered or discussed.

## Opening Script

Use this short frame:

```text
今天只看 v1 合成資料版本，不碰真實病人資料、不接 HIS/掛號系統、不做診斷或治療建議，也不自動開檢查。

我想請您幫忙判斷三件事：
1. 醫師摘要是否真的看得下去、用得上
2. 護理補問和候診區流程會不會增加負擔
3. 12 類主訴裡，是否同意先看「頻尿/夜尿、小便困難/尿不出來、血尿/潛血」這 3 類；若不同意，請您直接換掉

最後只做一個決定：continue、revise、narrow、pause，或先進 governance review。
```

## Run Sheet

### 0:00-0:05 Boundary Check

Show the top boundary text.

Ask:

- Does this clearly say synthetic-only and not for clinical use?
- Is any wording too close to diagnosis, treatment, triage, or ordering?
- Is the role of physician review clear enough?

Record:

- boundary clarity rating
- unsafe wording
- missing boundary language

### 0:05-0:10 Intake / Waiting-Room Flow

Open `Intake`.

Ask:

- Does `陽明小幫手` as already-registered waiting-room flow match the near-term story?
- Is no-ID/no-birthday visible enough?
- Are initial/return-visit rules right?
- Which intake fields are useful before physician entry?
- Which fields should be removed, hidden, or moved to nurse/physician review?

### 0:10-0:15 Current-System Benchmark

Open the benchmark links or screenshots only if no real patient data is shown:

- `聯醫小幫手`: `https://chat.argon.chat/visitor?guid=rmw6oqqxgy`
- `陽明小幫手`: `https://chat.argon.chat/visitor?guid=avp6dg160g`

Ask:

- Which current-system functions must v1 match?
- Which current-system functions should v1 intentionally omit?
- Is `初步建議` / `檢查方向` acceptable, or should v1 keep `醫師/護理師確認用提醒` wording?
- Does `陽明小幫手` require registration help, return-visit questioning, or waiting-flow explanation in v1?
- Are any current-system flows vendor/IP/patent protected and not safe to copy?

### 0:15-0:22 Nurse Review

Open `Nurse`.

Ask the nurse/staff reviewer, or ask 許醫師 to answer from clinic workflow if no nurse is present:

- Which repair prompts would staff actually ask?
- Which prompts add burden?
- Is exact medication-name repair workable?
- Is the NHI-card/nurse handoff wording right?
- What would make staff reject this workflow?

### 0:22-0:32 Physician Summary

Open `Physician`.

For each selected synthetic case:

1. Start timer.
2. Let physician scan the summary.
3. Stop timer when the physician says they have the gist.
4. Ask for useful / noisy / unsafe / missing lines.

Ask:

- Would you use, edit, ignore, or reject this?
- What should be first?
- What can be deleted?
- What is missing before you enter the room?

### 0:32-0:38 Priority Flows And Exam Prep

Open `Exam Prep`.

Ask:

- Should the proposed first three be `頻尿或夜尿`, `小便困難或尿不出來`, and `血尿或健檢發現潛血`?
- Which category should be replaced if this is wrong?
- Which reminder wording is acceptable before physician confirmation?
- Which reminders should be hidden until nurse/physician review?
- Does anything sound like the system ordered a test?

### 0:38-0:42 Export / Mock API

Open `Export`.

Ask:

- Does the export look useful for future HIS discussion?
- What should not be exported?
- Does the JSON wrongly imply live writeback?
- Who must approve any future export/API discussion?

### 0:42-0:45 Decision

Choose one:

- continue
- revise
- narrow
- pause
- governance review before next step

Ask:

- What is the smallest next artifact?
- Who should review it?
- What must not be built yet?
- Should the next artifact be a benchmark-difference table, revised v1 flow, return-visit synthetic case, or governance note?

## Stop Rules

Stop and move to governance review if the discussion turns to:

- real patient data
- real identifiers
- live HIS, EMR/EHR, registration, queue, messaging, or cloud storage
- diagnosis, treatment, triage, risk scoring, probability output, or autonomous exam ordering
- TFDA/FDA or non-device classification claim
- unresolved patent/vendor conflict

## Immediate Closeout

After the session, update:

- `docs/research/v1-phase0-review-capture.md`
- `docs/research/v1-review-scorecard.md`
- `docs/research/v1-phase0-analysis-template.md`
- `docs/research/v1-phase0-decision-memo-template.md`

Do not start implementation changes until the decision memo names the smallest next artifact.
