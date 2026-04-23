# V1 Phase 0 Reviewer Ask

Use this as a LINE or email draft for 許醫師 / 吳老師.

## Short LINE Draft

```text
許主任您好，我已經把 4/30 版本先整理成「陽明小幫手 v1 合成資料預覽版」：不碰真實病人資料、不接 HIS/掛號、不做診斷/治療/分流，也不自動開檢查，只看候診區填答、護理補問、醫師摘要、檢查前置提醒的 mockup。

下一步想請您幫忙做一個 30-45 分鐘 Phase 0 review，不是臨床試用，只是看合成案例：
1. 醫師摘要是否看得下去、用得上
2. 護理補問/候診區流程會不會增加負擔
3. 12 類主訴裡，哪 3 類最值得先做下一版
4. 現在的聯醫小幫手/陽明小幫手哪些功能 v1 要對齊，哪些要刻意先不做
5. 檢查前置提醒哪些 wording 可以保留，哪些要等醫師/護理師確認後才出現
6. 專利/創智動能/聯醫資訊或資安這些界線，哪些需要先避開

如果方便，也想請一位熟悉門診流程的護理師或同仁一起看 10-15 分鐘，主要判斷補問是否真的可行。完成後我會只整理成 review scorecard 和下一步 decision，不會把它寫成已可上線或已通過法規。
```

## Optional Shorter Ask With Proposed First Three

```text
許主任您好，我先用 QA 內容暫定 Phase 0 只看 3 類：頻尿/夜尿、小便困難或尿不出來、血尿/健檢潛血。這只是我為了讓 review 聚焦先選的，如果您覺得前三類應該換成 PSA、尿失禁或其他主訴，我會直接照您的優先順序改。

想請您幫忙約 30-45 分鐘看合成資料版本，重點是醫師摘要是否有用、護理補問是否可行、檢查前置提醒 wording 是否安全。全程不碰真實病人資料、不接 HIS、不做診斷/治療/分流，也不自動開檢查。
```

## Meeting Ask Checklist

- [ ] Ask 許醫師 for a 30-45 minute review slot.
- [ ] Ask whether a nurse or clinic staff member can join for the nurse-repair section.
- [ ] Ask him to confirm or replace the provisional first three complaint flows.
- [ ] Ask whether the current `聯醫小幫手` / `陽明小幫手` flows can be reviewed through screenshots or synthetic/no-real-data screen-share.
- [ ] Ask whether to use named personas or neutral role labels.
- [ ] Ask for patent/vendor boundaries before any post-v1 implementation.
- [ ] Re-state that v1 is synthetic-only and not clinical deployment.

## What To Attach Or Link

If sharing files before the review, send only:

- v1 handoff packet
- current-system benchmark table
- Phase 0 review scorecard
- governance gate register

Do not send:

- raw source materials into a wider group unless permitted
- vendor/internal screenshots unless 許醫師 confirms they are shareable
- any real patient examples

## Success Criteria For The Ask

The ask is successful if 許醫師 replies with at least one of:

- review time
- first three complaint flows
- nurse/staff reviewer possibility
- persona preference
- patent/vendor boundary note

If the reply only says "looks good", follow up with the first-three-flow question before changing the product.
