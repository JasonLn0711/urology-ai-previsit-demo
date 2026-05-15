const test = require("node:test");
const assert = require("node:assert/strict");
const { matchSpeechAnswer, normalizeSpeechText } = require("../../core/speech_answer_matching");

test("normalizes spoken text for matching", () => {
  assert.equal(normalizeSpeechText(" 有啦！ "), "有啦");
  assert.equal(normalizeSpeechText("１到７天"), "1到7天");
});

test("matches single-choice spoken answer with common Traditional Chinese alias", () => {
  const result = matchSpeechAnswer({
    transcript: "有啦",
    options: [
      ["Yes", "有"],
      ["No", "沒有"],
      ["Not sure", "不確定"]
    ]
  });

  assert.equal(result.accepted, true);
  assert.equal(result.value, "Yes");
  assert.equal(result.confidence, "high");
});

test("keeps not-sure answer distinct from no answer", () => {
  const result = matchSpeechAnswer({
    transcript: "我不曉得",
    options: [
      ["Yes", "有"],
      ["No", "沒有"],
      ["Not sure", "不確定"]
    ]
  });

  assert.equal(result.accepted, true);
  assert.equal(result.value, "Not sure");
});

test("accepts backend acoustic similarity score when transcript is imperfect", () => {
  const result = matchSpeechAnswer({
    transcript: "轉文字沒有對上",
    acousticScores: { Yes: 0.93, No: 0.11, "Not sure": 0.08 },
    options: [
      ["Yes", "有"],
      ["No", "沒有"],
      ["Not sure", "不確定"]
    ]
  });

  assert.equal(result.accepted, true);
  assert.equal(result.value, "Yes");
  assert.equal(result.candidates[0].source, "acoustic");
});

test("matches multiple spoken symptoms in a multi-select question", () => {
  const result = matchSpeechAnswer({
    transcript: "有發燒還有發冷",
    mode: "multi",
    options: [
      ["Fever", "發燒"],
      ["Chills", "發冷"],
      ["Side or back pain", "腰側痛"],
      ["None of these", "以上都沒有"],
      ["Not sure", "不確定"]
    ]
  });

  assert.equal(result.accepted, true);
  assert.deepEqual(result.values, ["Chills", "Fever"]);
});

test("multi-select exclusive option suppresses symptom options", () => {
  const result = matchSpeechAnswer({
    transcript: "以上都沒有",
    mode: "multi",
    options: [
      ["Fever", "發燒"],
      ["Chills", "發冷"],
      ["Side or back pain", "腰側痛"],
      ["None of these", "以上都沒有"],
      ["Not sure", "不確定"]
    ]
  });

  assert.equal(result.accepted, true);
  assert.deepEqual(result.values, ["None of these"]);
});

test("multi-select can use acoustic scores for more than one visible answer", () => {
  const result = matchSpeechAnswer({
    transcript: "聲音近似但轉字不完整",
    mode: "multi",
    acousticScores: { Diabetes: 0.88, "Kidney disease": 0.86 },
    options: [
      ["Diabetes", "糖尿病"],
      ["Kidney disease", "腎臟病"],
      ["Neurologic disease", "神經系統疾病"],
      ["Spinal cord problem", "脊髓相關問題"],
      ["None of these", "以上都沒有"]
    ]
  });

  assert.equal(result.accepted, true);
  assert.deepEqual(result.values, ["Diabetes", "Kidney disease"]);
});

test("matches compact first-question spoken answer to visible option", () => {
  const result = matchSpeechAnswer({
    transcript: "我主要是晚上一直起來尿尿，白天也常跑廁所",
    mode: "multi",
    options: [
      ["頻尿、夜尿或急尿", "頻尿、夜尿或急尿"],
      ["尿會不小心漏出來", "尿會不小心漏出來"],
      ["尿不太出來或尿流變弱", "尿不太出來或尿流變弱"],
      ["尿尿疼痛或灼熱", "尿尿疼痛或灼熱"],
      ["看到紅色或茶色尿、血塊", "看到紅色或茶色尿、血塊"],
      ["不確定", "不確定"]
    ]
  });

  assert.equal(result.accepted, true);
  assert.deepEqual(result.values, ["頻尿、夜尿或急尿"]);
});

test("matches compact multi-select symptoms from one spoken answer", () => {
  const result = matchSpeechAnswer({
    transcript: "尿尿會刺痛，還有發燒發冷",
    mode: "multi",
    options: [
      ["尿尿時疼痛、刺痛或灼熱", "尿尿時疼痛、刺痛或灼熱"],
      ["下腹或膀胱附近疼痛/悶脹", "下腹或膀胱附近疼痛/悶脹"],
      ["腰部兩側或背側痛", "腰部兩側或背側痛"],
      ["發燒或發冷", "發燒或發冷"],
      ["以上都沒有", "以上都沒有"],
      ["不確定", "不確定"]
    ]
  });

  assert.equal(result.accepted, true);
  assert.deepEqual(result.values, ["尿尿時疼痛、刺痛或灼熱", "發燒或發冷"]);
});
