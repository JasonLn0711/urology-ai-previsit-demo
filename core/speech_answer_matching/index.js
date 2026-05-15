(function attachSpeechAnswerMatching(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.UrologySpeechAnswerMatching = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function speechAnswerMatchingFactory() {
  const SINGLE_THRESHOLD = 0.72;
  const MULTI_THRESHOLD = 0.7;
  const ACOUSTIC_THRESHOLD = 0.78;
  const SINGLE_MARGIN = 0.06;

  const EXCLUSIVE_VALUES = new Set(["None of these", "Not sure", "Prefer not to answer"]);

  const VALUE_ALIASES = {
    Yes: [
      "有",
      "有啦",
      "有的",
      "有喔",
      "會",
      "會的",
      "對",
      "是",
      "是的",
      "可以",
      "需要",
      "要"
    ],
    No: [
      "沒有",
      "沒有啦",
      "沒",
      "無",
      "不會",
      "不用",
      "不需要",
      "沒有這個",
      "沒這個"
    ],
    "Not sure": [
      "不確定",
      "不知道",
      "不清楚",
      "不曉得",
      "忘記了",
      "記不清楚",
      "不太確定",
      "不太知道",
      "我不知道",
      "我不確定"
    ],
    "None of these": [
      "以上都沒有",
      "都沒有",
      "沒有這些",
      "以上皆無",
      "都沒有啦",
      "沒有以上",
      "都不是"
    ],
    "Patient self-filled": ["本人回答", "自己回答", "我自己回答", "病人自己回答", "本人自己填"],
    "Family helped operate; patient answered": [
      "家人幫忙操作本人回答",
      "家屬幫忙操作本人回答",
      "家人協助操作我回答",
      "家屬協助操作本人回答"
    ],
    "Family or helper-assisted": [
      "家人代答",
      "家屬代答",
      "照顧者代答",
      "家人依觀察回答",
      "家屬依觀察回答"
    ],
    "Frequency / nocturia / urgency": ["頻尿", "夜尿", "急尿", "尿很急", "常跑廁所", "尿尿次數多"],
    Leakage: ["漏尿", "尿漏出來", "會漏尿"],
    "Difficulty emptying or weak stream": ["尿不乾淨", "尿不出來", "尿流弱", "尿很慢", "排尿困難"],
    "Pain, burning, or possible infection": ["尿痛", "疼痛", "灼熱", "刺痛", "感染", "發炎"],
    "Recurrent infection concern": ["反覆感染", "常常感染", "一直感染"],
    "Visible blood or clots": ["血尿", "看到血", "血塊", "尿有血"],
    "Other urinary concern": ["其他", "其他問題", "別的問題"],
    "頻尿、夜尿或急尿": ["頻尿", "夜尿", "急尿", "一直跑廁所", "常跑廁所", "尿很急"],
    "尿會不小心漏出來": ["漏尿", "尿漏", "會漏出來", "尿會漏", "不小心漏尿"],
    "尿不太出來或尿流變弱": ["尿不出來", "尿流弱", "尿流變弱", "排尿困難", "尿很慢"],
    "尿尿疼痛或灼熱": ["尿痛", "尿尿痛", "刺痛", "灼熱", "尿尿會燒", "排尿疼痛"],
    "看到紅色或茶色尿、血塊": ["血尿", "紅色尿", "茶色尿", "尿有血", "看到血塊", "血塊"],
    "其他泌尿問題": ["其他", "別的問題", "其他問題", "其他泌尿"],
    "今天開始": ["今天", "今天開始", "今天才開始"],
    "1 到 7 天": ["一到七天", "1到7天", "一週內", "這幾天", "幾天"],
    "1 到 4 週": ["一到四週", "1到4週", "幾週", "幾個禮拜", "一個月內"],
    "超過 1 個月": ["超過一個月", "一個月以上", "好幾個月", "很久了"],
    "反覆出現": ["反覆", "反覆出現", "一陣一陣", "常常復發"],
    "困擾 0 到 3 分": ["零到三分", "0到3分", "輕微", "不太困擾"],
    "困擾 4 到 6 分": ["四到六分", "4到6分", "中等困擾"],
    "困擾 7 到 10 分": ["七到十分", "7到10分", "很困擾", "非常困擾"],
    "白天尿尿次數明顯變多": ["白天尿很多次", "白天變多", "尿尿次數變多", "一直跑廁所"],
    "晚上睡著後會起床尿尿": ["晚上起來尿", "睡著後起來尿", "夜尿", "半夜起床尿尿"],
    "突然很急、很難忍住": ["突然很急", "尿很急", "很難忍", "急尿"],
    "尿意來時幾乎來不及": ["快來不及", "來不及", "憋不住", "忍不住"],
    "睡眠或外出明顯受影響": ["影響睡眠", "睡不好", "出門受影響", "外出不方便"],
    "尿尿時疼痛、刺痛或灼熱": ["尿痛", "尿尿痛", "刺痛", "灼熱", "尿尿灼熱", "排尿疼痛"],
    "下腹或膀胱附近疼痛/悶脹": ["下腹痛", "膀胱痛", "下腹悶", "膀胱悶脹"],
    "腰部兩側或背側痛": ["腰痛", "腰側痛", "背側痛", "後腰痛", "兩側腰痛"],
    "發燒或發冷": ["發燒", "發冷", "畏寒", "發燒發冷", "燒跟冷"],
    "目前沒有": ["目前沒有", "現在沒有", "沒有"],
    "沒有看過": ["沒看過", "沒有看過", "沒有看到"],
    "粉紅或紅色尿": ["粉紅色", "紅色尿", "尿紅紅的", "紅尿"],
    "茶色或深色尿": ["茶色尿", "深色尿", "尿很深", "像茶"],
    "看到血塊": ["血塊", "看到血塊", "有血塊"],
    "不只一次或最近常出現": ["不只一次", "好幾次", "最近常出現", "常常出現"],
    "可以提供藥袋、藥單或藥物照片": ["有藥袋", "有藥單", "可以提供藥物照片", "可以提供"],
    "最近有開始、停止或調整藥物": ["最近換藥", "開始新藥", "停止藥物", "調整藥物"],
    "糖尿病或腎臟病": ["糖尿病", "腎臟病", "腎病", "洗腎"],
    "神經或脊髓相關病史": ["神經疾病", "脊髓", "脊椎", "神經病史"],
    "曾有結石、泌尿感染、手術或導尿": ["結石", "泌尿感染", "尿道感染", "手術", "導尿"],
    Today: ["今天", "今天開始", "今天才有"],
    "1 to 7 days": ["一到七天", "1到7天", "一週內", "這幾天", "幾天", "一個禮拜內"],
    "1 to 4 weeks": ["一到四週", "1到4週", "一個月內", "幾週", "幾個禮拜"],
    "More than 1 month": ["超過一個月", "一個月以上", "很久了", "好幾個月"],
    "0 times": ["零次", "0次", "沒有起來", "不用起來"],
    "1 time": ["一次", "1次", "起來一次"],
    "2 times": ["兩次", "二次", "2次", "起來兩次"],
    "3 or more times": ["三次以上", "3次以上", "很多次"],
    Rarely: ["很少", "偶爾", "不常"],
    "Some days": ["有些天", "幾天會", "有時候"],
    "Most days": ["大多數日子", "大部分日子", "常常"],
    "Several times a day": ["一天好幾次", "一天很多次"],
    Fever: ["發燒", "燒", "體溫高"],
    Chills: ["發冷", "畏寒", "冷顫", "寒顫"],
    "Side or back pain": ["腰側痛", "腰痛", "背痛", "後腰痛", "兩側腰痛"],
    "Can provide list": ["可提供藥單", "有藥單", "可以提供", "可以給藥單", "有藥袋"],
    "Partial list only": ["只記得部分", "只記得一些", "記得一部分"],
    "No regular medicines": ["無固定用藥", "沒有固定吃藥", "沒有常用藥"],
    "Needs staff help": ["需要人員協助", "到現場協助", "請現場幫忙"],
    "Less than once a week": ["少於每週一次", "不到一週一次", "很少發生"],
    Weekly: ["每週", "一週一次", "每個禮拜"],
    Daily: ["每天", "天天", "每天都有"],
    "A few drops": ["幾滴", "一點點"],
    "Small amount": ["少量", "一小片", "一點"],
    "Moderate amount": ["會濕", "濕內褲", "濕護墊"],
    "Large amount": ["量很多", "很多", "需要換衣服"],
    "Before reaching toilet": ["來不及到廁所", "還沒到廁所", "走到廁所前"],
    "Coughing, laughing, or exercise": ["咳嗽", "笑", "大笑", "運動", "搬重物"],
    "During sleep": ["睡覺時", "睡著時", "晚上睡覺"],
    "Without warning": ["無明顯原因", "沒有預警", "突然漏"],
    "No products used": ["沒有使用", "沒用用品", "沒有墊"],
    "Pads or liners": ["護墊", "襯墊"],
    "Adult diapers": ["尿布", "成人紙尿褲"],
    "Other product": ["其他用品", "別的用品"],
    "Prefer not to answer": ["暫不回答", "不想回答", "稍後再談"],
    "One time": ["一次", "只有一次"],
    "More than once": ["不只一次", "好幾次"],
    "Every time recently": ["最近幾乎每次", "每次都有"],
    "Pain or burning": ["疼痛", "灼熱", "刺痛"],
    "Fever or chills": ["發燒或發冷", "發燒發冷", "發燒跟發冷"],
    "Only while urinating": ["尿尿時", "排尿時"],
    "After urinating": ["尿完後", "排尿後"],
    "Most of the day": ["一天中大多時間", "整天"],
    "Comes and goes": ["有時有有時沒有", "時好時壞"],
    "Yes, once": ["有一次", "一次"],
    "Yes, more than once": ["有超過一次", "好幾次"],
    "1 to 3": ["一到三分", "1到3分", "輕微"],
    "4 to 6": ["四到六分", "4到6分", "中等"],
    "7 to 10": ["七到十分", "7到10分", "很痛"],
    Diabetes: ["糖尿病", "血糖"],
    "Kidney disease": ["腎臟病", "腎病", "洗腎"],
    "Neurologic disease": ["神經系統疾病", "神經疾病"],
    "Spinal cord problem": ["脊髓", "脊椎受傷", "脊髓問題"],
    Mandarin: ["國語", "中文", "華語"],
    Taiwanese: ["台語", "閩南語"],
    "Mandarin with Taiwanese preferred": ["國語搭配台語", "中文跟台語"],
    English: ["英文", "英語"],
    Comfortable: ["可以自己操作", "我會操作"],
    "Can use phone with help": ["有人協助就可以", "有人幫忙可以"],
    "Needs large buttons": ["需要大按鈕", "需要大字"],
    "Prefer staff help": ["希望現場協助", "請人員協助"]
  };

  function normalizeSpeechText(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[０-９]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xfee0))
      .replace(/[，。！？、；：「」『』（）()［\]\[\],.!?;:'"]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function compactText(value) {
    return normalizeSpeechText(value).replace(/\s+/g, "");
  }

  function optionFromPair(option) {
    if (Array.isArray(option)) {
      return { value: String(option[0] || ""), label: String(option[1] || option[0] || "") };
    }
    if (option && typeof option === "object") {
      return {
        value: String(option.value || option.id || option.key || ""),
        label: String(option.label || option.text || option.value || option.id || option.key || "")
      };
    }
    return { value: String(option || ""), label: String(option || "") };
  }

  function unique(items) {
    return Array.from(new Set(items.filter(Boolean)));
  }

  function phrasesForOption(option) {
    return unique([
      option.value,
      option.label,
      ...(VALUE_ALIASES[option.value] || []),
      ...(VALUE_ALIASES[option.label] || [])
    ]);
  }

  function charBigrams(text) {
    const chars = Array.from(compactText(text));
    if (chars.length <= 1) return chars;
    const bigrams = [];
    for (let index = 0; index < chars.length - 1; index += 1) {
      bigrams.push(`${chars[index]}${chars[index + 1]}`);
    }
    return bigrams;
  }

  function diceSimilarity(left, right) {
    const a = charBigrams(left);
    const b = charBigrams(right);
    if (!a.length || !b.length) return 0;
    const counts = new Map();
    a.forEach((item) => counts.set(item, (counts.get(item) || 0) + 1));
    let overlap = 0;
    b.forEach((item) => {
      const count = counts.get(item) || 0;
      if (count > 0) {
        overlap += 1;
        counts.set(item, count - 1);
      }
    });
    return (2 * overlap) / (a.length + b.length);
  }

  function textScoreForPhrase(transcript, phrase) {
    const speech = compactText(transcript);
    const target = compactText(phrase);
    if (!speech || !target) return 0;
    if (speech === target) return 1;
    if (target.length <= 1) return 0;
    if (speech.includes(target)) return target.length >= 2 ? 0.92 : 0;
    if (target.includes(speech) && speech.length >= 2) return 0.84;
    const similarity = diceSimilarity(speech, target);
    if (similarity >= 0.8) return similarity;
    return similarity * 0.8;
  }

  function acousticScoreForOption(option, acousticScores) {
    if (!acousticScores || typeof acousticScores !== "object") return 0;
    const direct = acousticScores[option.value];
    const byLabel = acousticScores[option.label];
    const numeric = [direct, byLabel]
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value));
    return numeric.length ? Math.max(...numeric) : 0;
  }

  function scoreOption(option, transcript, acousticScores) {
    const textCandidates = phrasesForOption(option).map((phrase) => ({
      phrase,
      score: textScoreForPhrase(transcript, phrase)
    }));
    const bestText = textCandidates.reduce((best, item) => (item.score > best.score ? item : best), {
      phrase: "",
      score: 0
    });
    const acousticScore = acousticScoreForOption(option, acousticScores);
    const source = acousticScore >= Math.max(bestText.score, ACOUSTIC_THRESHOLD) ? "acoustic" : "text";
    const score = Math.max(bestText.score, acousticScore);
    return {
      value: option.value,
      label: option.label,
      score,
      source,
      matchedPhrase: source === "acoustic" ? "" : bestText.phrase
    };
  }

  function isExclusiveCandidate(candidate) {
    return EXCLUSIVE_VALUES.has(candidate.value) ||
      /以上都沒有|不確定|暫不回答/.test(candidate.label);
  }

  function confidence(score) {
    if (score >= 0.9) return "high";
    if (score >= 0.78) return "medium";
    return "low";
  }

  function sortCandidates(left, right) {
    if (right.score !== left.score) return right.score - left.score;
    return left.label.localeCompare(right.label, "zh-Hant-TW");
  }

  function acceptedSingle(candidates, threshold) {
    const sorted = candidates.slice().sort(sortCandidates);
    const best = sorted[0];
    const second = sorted[1];
    if (!best || best.score < threshold) return null;
    if (!second || best.source === "acoustic" || best.score >= 0.92 || best.score - second.score >= SINGLE_MARGIN) {
      return best;
    }
    return null;
  }

  function acceptedMulti(candidates, threshold) {
    const accepted = candidates
      .filter((candidate) => candidate.score >= threshold)
      .sort(sortCandidates);
    if (!accepted.length) return [];
    const exclusive = accepted.find((candidate) => isExclusiveCandidate(candidate) && candidate.score >= threshold);
    if (exclusive) return [exclusive];
    return accepted.filter((candidate) => !isExclusiveCandidate(candidate));
  }

  function matchSpeechAnswer({
    transcript,
    options,
    mode = "single",
    acousticScores,
    minScore
  } = {}) {
    const normalizedOptions = (options || []).map(optionFromPair).filter((option) => option.value);
    const threshold = Number.isFinite(minScore)
      ? minScore
      : (mode === "multi" ? MULTI_THRESHOLD : SINGLE_THRESHOLD);
    const candidates = normalizedOptions
      .map((option) => scoreOption(option, transcript, acousticScores))
      .sort(sortCandidates);

    if (mode === "multi") {
      const selected = acceptedMulti(candidates, threshold);
      return {
        accepted: selected.length > 0,
        mode: "multi",
        transcript: String(transcript || ""),
        values: selected.map((candidate) => candidate.value),
        labels: selected.map((candidate) => candidate.label),
        score: selected.length ? Math.max(...selected.map((candidate) => candidate.score)) : 0,
        confidence: selected.length ? confidence(Math.max(...selected.map((candidate) => candidate.score))) : "low",
        reason: selected.length ? "matched-visible-options" : "no-visible-option-match",
        candidates
      };
    }

    const selected = acceptedSingle(candidates, threshold);
    return {
      accepted: Boolean(selected),
      mode: "single",
      transcript: String(transcript || ""),
      value: selected ? selected.value : "",
      values: selected ? [selected.value] : [],
      label: selected ? selected.label : "",
      labels: selected ? [selected.label] : [],
      score: selected ? selected.score : 0,
      confidence: selected ? confidence(selected.score) : "low",
      reason: selected ? "matched-visible-option" : "ambiguous-or-no-visible-option-match",
      candidates
    };
  }

  return {
    matchSpeechAnswer,
    normalizeSpeechText
  };
});
