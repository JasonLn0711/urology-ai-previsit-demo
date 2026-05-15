(function attachSummaryCore(root, factory) {
  const deps = typeof module === "object" && module.exports
    ? {
        attribution: require("../attribution"),
        missingFields: require("../missing_fields"),
        safety: require("../safety")
      }
    : {
        attribution: root.UrologyAttribution,
        missingFields: root.UrologyMissingFields,
        safety: root.UrologySafety
      };
  const api = factory(deps);
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.UrologySummaryCore = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function summaryCoreFactory({ attribution, missingFields, safety }) {
  const {
    answer,
    listValue,
    hasValue,
    fieldSourceEntries,
    sourceAttributionSummary,
    sourceNotes,
    attributionBlock
  } = attribution;

  const {
    activeModules,
    missingFields: missingFieldLabels,
    completionStatus,
    isYes,
    isNotSure,
    containsValue
  } = missingFields;

  const {
    SAFETY_NOTICE,
    assertSafeLanguage,
    withSafetyEnvelope
  } = safety;

  const NEUTRAL_EMPTY_FLAG = "此合成案例目前沒有需特別標示的病人回報。";

  const VALUE_LABELS = {
    "Patient self-filled": "本人回答",
    "Family helped operate; patient answered": "家屬協助操作，本人回答",
    "Family or helper-assisted": "家屬依觀察協助回答",
    "Nurse-assisted": "現場人員協助",
    "Nurse-assisted mode": "現場人員協助模式",
    "Frequency / nocturia / urgency": "頻尿 / 夜尿 / 急尿",
    Leakage: "漏尿",
    "Difficulty emptying or weak stream": "排尿困難或尿流弱",
    "Pain, burning, or possible infection": "尿痛 / 灼熱 / 感染相關疑慮",
    "Recurrent infection concern": "反覆感染相關困擾",
    "Visible blood or clots": "可見血尿或血塊",
    "Other urinary concern": "其他泌尿問題",
    Today: "今天",
    "1 to 7 days": "1 到 7 天",
    "1 to 4 weeks": "1 到 4 週",
    "More than 1 month": "超過 1 個月",
    Yes: "有",
    No: "沒有",
    "Not sure": "不確定",
    "0 times": "0 次",
    "1 time": "1 次",
    "2 times": "2 次",
    "3 or more times": "3 次以上",
    "1 to 4 times": "1 到 4 次",
    "5 to 8 times": "5 到 8 次",
    "9 to 12 times": "9 到 12 次",
    "More than 12 times": "超過 12 次",
    Rarely: "很少",
    "Some days": "有些天",
    "Most days": "大多數日子",
    "Several times a day": "一天好幾次",
    "Caffeinated drinks most days": "常喝咖啡、茶或含咖啡因飲料",
    "Drinks a lot near bedtime": "睡前常喝較多水",
    "Night shift or poor sleep": "作息不固定或睡不好",
    "Yes, with written instructions": "可以，但需要清楚說明",
    "Only with staff or family help": "需要家人或現場人員協助",
    Fever: "發燒",
    Chills: "發冷",
    "Side or back pain": "腰側痛",
    "None of these": "以上都沒有",
    "Can provide list": "可提供藥單",
    "Partial list only": "只記得部分",
    "No regular medicines": "無固定用藥",
    "Less than once a week": "少於每週一次",
    Weekly: "每週",
    Daily: "每天",
    "A few drops": "幾滴",
    "Small amount": "少量",
    "Moderate amount": "會濕內褲或護墊",
    "Large amount": "量較多或需換衣物",
    "Before reaching toilet": "來不及到廁所",
    "Coughing, laughing, or exercise": "咳嗽、笑、運動或搬重物",
    "During sleep": "睡覺時",
    "Without warning": "無明顯原因",
    "No products used": "沒有使用",
    "Pads or liners": "護墊或襯墊",
    "Adult diapers": "成人紙尿褲",
    "Other product": "其他用品",
    "Prefer not to answer": "暫不回答",
    "One time": "一次",
    "More than once": "不只一次",
    "Every time recently": "最近幾乎每次",
    "Pain or burning": "疼痛或灼熱",
    "Fever or chills": "發燒或發冷",
    "Only while urinating": "尿尿時",
    "After urinating": "尿完後",
    "Most of the day": "一天中大多時間",
    "Comes and goes": "有時有、有時沒有",
    "Yes, once": "有，1 次",
    "Yes, more than once": "有，超過 1 次",
    "1 to 3": "1 到 3 分",
    "4 to 6": "4 到 6 分",
    "7 to 10": "7 到 10 分",
    Diabetes: "糖尿病",
    "Kidney disease": "腎臟病",
    "Neurologic disease": "神經系統疾病",
    "Spinal cord problem": "脊髓相關問題",
    Mandarin: "國語",
    Taiwanese: "台語",
    "Mandarin with Taiwanese preferred": "國語，可搭配台語",
    English: "英文",
    Comfortable: "可以自己操作",
    "Can use phone with help": "有人協助就可以",
    "Needs large buttons": "需要大按鈕、大字",
    "Prefer staff help": "希望到現場請人協助",
    "Self-filled": "自己填",
    "Family-assisted mode": "家屬協助",
    "Needs staff help": "到現場請人員協助",
    "Prefer to talk in person": "想直接到現場用說的"
  };

  const MODULE_LABELS = {
    storage: "儲尿相關",
    leakage: "漏尿",
    voiding: "排尿困難",
    hematuria: "可見血尿/血塊",
    pain: "疼痛或發燒相關",
    medication: "用藥補充",
    "core only": "核心欄位"
  };

  function displayValue(value) {
    if (Array.isArray(value)) {
      const items = listValue(value).map(displayValue).filter(Boolean);
      return items.length ? items.join("、") : "";
    }
    const raw = answer(value);
    return raw ? (VALUE_LABELS[raw] || raw) : "";
  }

  function formatList(value, fallback) {
    const items = listValue(value);
    return items.length ? items.map(displayValue).join("、") : fallback;
  }

  function clinicianFlags(answers) {
    const flags = [];
    if (isYes(answers && answers.currentlyUnableToUrinate)) {
      flags.push("病人回報目前仍尿不出來。");
    } else if (isYes(answers && answers.unableToUrinate)) {
      flags.push("病人回報排尿困難或曾尿不出來。");
    }
    if (isYes(answers && answers.visibleBlood)) {
      flags.push("病人回報曾看到血尿或血塊。");
    }
    if (isYes(answers && answers.bloodClots)) {
      flags.push("病人回報曾看到血塊。");
    }
    if (containsValue(answers && answers.systemicSymptoms, "fever")) {
      flags.push("病人回報發燒。");
    }
    if (containsValue(answers && answers.systemicSymptoms, "chills")) {
      flags.push("病人回報發冷。");
    }
    if (containsValue(answers && answers.systemicSymptoms, "side or back pain")) {
      flags.push("病人回報腰側痛。");
    }
    if (isYes(answers && answers.painBurning)) {
      flags.push("病人回報尿尿疼痛或灼熱。");
    }
    return flags;
  }

  function symptomPattern(answers) {
    const modules = activeModules(answers || {});
    const sections = [];

    if (modules.storage) {
      sections.push([
        "儲尿相關",
        [
          answer(answers.daytimeFrequencyChange) && `白天次數變化：${displayValue(answers.daytimeFrequencyChange)}`,
          answer(answers.daytimeFrequencyCount) && `白天次數：${displayValue(answers.daytimeFrequencyCount)}`,
          answer(answers.nocturiaCount) && `夜間起床尿尿：${displayValue(answers.nocturiaCount)}`,
          answer(answers.urgency) && `急尿：${displayValue(answers.urgency)}`,
          answer(answers.urgencyFrequency) && `急尿頻率：${displayValue(answers.urgencyFrequency)}`,
          hasValue(answers.fluidCaffeineContext) && `喝水/咖啡因背景：${formatList(answers.fluidCaffeineContext, "")}`,
          answer(answers.bladderDiaryFeasible) && `排尿日誌可行性：${displayValue(answers.bladderDiaryFeasible)}`
        ].filter(Boolean).join("; ")
      ]);
    }

    if (modules.voiding) {
      sections.push([
        "排尿困難",
        [
          answer(answers.unableToUrinate) && `尿不出來/排尿困難：${displayValue(answers.unableToUrinate)}`,
          answer(answers.currentlyUnableToUrinate) && `目前仍發生：${displayValue(answers.currentlyUnableToUrinate)}`,
          answer(answers.weakStream) && `尿流弱：${displayValue(answers.weakStream)}`,
          answer(answers.straining) && `需用力：${displayValue(answers.straining)}`,
          answer(answers.intermittency) && `斷斷續續：${displayValue(answers.intermittency)}`,
          answer(answers.incompleteEmptying) && `尿不乾淨感：${displayValue(answers.incompleteEmptying)}`
        ].filter(Boolean).join("; ")
      ]);
    }

    if (modules.leakage) {
      sections.push([
        "漏尿",
        [
          answer(answers.leakage) && `最近 4 週：${displayValue(answers.leakage)}`,
          answer(answers.leakageFrequency) && `頻率：${displayValue(answers.leakageFrequency)}`,
          answer(answers.leakageAmount) && `量：${displayValue(answers.leakageAmount)}`,
          hasValue(answers.leakageTriggers) && `情境：${formatList(answers.leakageTriggers, "")}`,
          answer(answers.containmentProducts) && `用品：${displayValue(answers.containmentProducts)}`
        ].filter(Boolean).join("; ")
      ]);
    }

    if (modules.hematuria) {
      sections.push([
        "可見血尿/血塊",
        [
          answer(answers.visibleBlood) && `病人看到：${displayValue(answers.visibleBlood)}`,
          answer(answers.hematuriaPattern) && `發生模式：${displayValue(answers.hematuriaPattern)}`,
          answer(answers.bloodClots) && `血塊：${displayValue(answers.bloodClots)}`,
          hasValue(answers.hematuriaCoSymptoms) && `合併回報：${formatList(answers.hematuriaCoSymptoms, "")}`
        ].filter(Boolean).join("; ")
      ]);
    }

    if (modules.pain) {
      sections.push([
        "疼痛或發燒相關",
        [
          answer(answers.painBurning) && `尿痛/灼熱：${displayValue(answers.painBurning)}`,
          answer(answers.painFrequency) && `疼痛時機：${displayValue(answers.painFrequency)}`,
          hasValue(answers.systemicSymptoms) && `發燒/發冷/腰側痛：${formatList(answers.systemicSymptoms, "")}`,
          answer(answers.infectionEpisodeHistory) && `近期類似就醫或抗生素經驗：${displayValue(answers.infectionEpisodeHistory)}`,
          answer(answers.flankPainScore) && `腰側痛強度：${displayValue(answers.flankPainScore)}`
        ].filter(Boolean).join("; ")
      ]);
    }

    return sections.length
      ? sections.map(([label, detail]) => `${label}：${detail || "未提供細節"}`).join(" | ")
      : "目前資訊不足。";
  }

  function durationBother(answers) {
    return [
      displayValue(answers && answers.duration) || "未提供病程",
      answer(answers && answers.botherScore) ? `困擾程度 ${displayValue(answers.botherScore)}/10` : "未提供困擾程度"
    ].join(" / ");
  }

  function medicineContext(answers) {
    const parts = [
      answer(answers && answers.medicationListStatus) && `用藥資料：${displayValue(answers.medicationListStatus)}`,
      answer(answers && answers.medicationAssist) && `確認協助：${displayValue(answers.medicationAssist)}`,
      hasValue(answers && answers.relevantComorbidities) && `病人回報背景：${formatList(answers.relevantComorbidities, "")}`,
      answer(answers && answers.diureticAnticoagulantAwareness) && `利尿劑/抗凝血藥物認知：${displayValue(answers.diureticAnticoagulantAwareness)}`
    ].filter(Boolean);
    return parts.length ? parts.join("; ") : "未提供";
  }

  function patientConstraints(answers) {
    return [
      displayValue(answers && answers.filledBy) || "未提供填答來源",
      displayValue(answers && answers.language) || "未提供語言偏好",
      displayValue(answers && answers.deviceComfort) || "未提供裝置或輔助需求",
      displayValue(answers && answers.supportPreference) || "未提供協助偏好"
    ];
  }

  function nurseCues(answers) {
    const cues = [];
    const modules = activeModules(answers || {});
    const flags = clinicianFlags(answers || {});
    const uncertainCore = [
      "daytimeFrequencyChange",
      "nocturiaCount",
      "urgency",
      "leakage",
      "painBurning",
      "visibleBlood",
      "unableToUrinate"
    ].filter((field) => isNotSure(answers && answers[field]));
    if (containsValue(answers && answers.systemicSymptoms, "not sure")) {
      uncertainCore.push("systemicSymptoms");
    }

    if (/nurse|family|helper/i.test(answer(answers && answers.filledBy)) || /staff|family|help/i.test(answer(answers && answers.supportPreference))) {
      cues.push("醫療人員檢視前，可能需要先確認填答協助需求。");
    }
    if (uncertainCore.length) {
      cues.push("部分核心答案標為不確定；醫療人員檢視前可先補問。");
    }
    if (modules.storage) {
      cues.push("若院內流程支援，可由現場人員說明排尿日誌。");
    }
    if (modules.leakage || hasValue(answers && answers.containmentProducts)) {
      cues.push("漏尿用品或照護支持需求應保留給現場人員看見。");
    }
    if (modules.medication || /partial|not sure|cannot|do not know/i.test(answer(answers && answers.medicationListStatus))) {
      cues.push("用藥資料可能需要護理端協助確認。");
    }
    if (flags.length) {
      cues.push("需現場確認的病人回報應在看診前可見。");
    }
    return cues.length ? cues : ["目前沒有例行檢視以外的護理提醒。"];
  }

  function buildClinicianSummary(answers) {
    const safeAnswers = answers || {};
    const missing = missingFieldLabels(safeAnswers);
    const flags = clinicianFlags(safeAnswers);
    const status = completionStatus(safeAnswers);
    const modules = activeModules(safeAnswers);
    const moduleNames = Object.entries(modules)
      .filter(([, active]) => active)
      .map(([name]) => name);

    const summary = withSafetyEnvelope({
      completionStatus: status,
      activeModules: moduleNames.length ? moduleNames : ["core only"],
      intakeMode: displayValue(safeAnswers.filledBy) || "未提供",
      chiefConcern: formatList(safeAnswers.chiefConcern, "未提供"),
      symptomPattern: symptomPattern(safeAnswers),
      durationBother: durationBother(safeAnswers),
      clinicianReviewFlags: flags.length ? flags : [NEUTRAL_EMPTY_FLAG],
      missingInformation: missing.length ? missing : ["目前沒有必補核心欄位。"],
      nurseCues: nurseCues(safeAnswers),
      patientConstraints: patientConstraints(safeAnswers),
      medicines: medicineContext(safeAnswers),
      patientNote: answer(safeAnswers.notes) || "沒有補充說明。",
      sourceNotes: sourceNotes(safeAnswers),
      fieldSources: fieldSourceEntries(safeAnswers),
      sourceAttributionSummary: sourceAttributionSummary(safeAnswers),
      attribution: attributionBlock(safeAnswers),
      handoffNote: "本資料來自病人、家屬或現場補問；仍需醫療人員確認。",
      rawAnswers: Object.assign({}, safeAnswers)
    });

    assertSafeLanguage(summary, "clinician summary");
    return summary;
  }

  function summaryToText(summary) {
    const text = [
      "泌尿科看診前合成資料摘要",
      "",
      "安全邊界：",
      ...summary.safetyNotice.map((item) => `- ${item}`),
      `- ${summary.reviewRequiredLabel}`,
      "",
      `完成度：${summary.completionStatus.label}`,
      `啟動模組：${summary.activeModules.map((module) => MODULE_LABELS[module] || module).join("、")}`,
      `填答來源：${summary.intakeMode}`,
      `主訴：${summary.chiefConcern}`,
      `病程 / 困擾：${summary.durationBother}`,
      `病人回報型態：${summary.symptomPattern}`,
      "",
      "需現場確認的病人回報：",
      ...summary.clinicianReviewFlags.map((item) => `- ${item}`),
      "",
      "護理工作提醒：",
      ...summary.nurseCues.map((item) => `- ${item}`),
      "",
      "缺漏資訊：",
      ...summary.missingInformation.map((item) => `- ${item}`),
      "",
      "協助需求：",
      ...summary.patientConstraints.map((item) => `- ${item}`),
      "",
      "答案來源提醒：",
      ...summary.sourceNotes.map((item) => `- ${item}`),
      ...summary.sourceAttributionSummary.map((item) => `- ${item}`),
      "",
      `用藥/背景：${summary.medicines}`,
      `病人補充：${summary.patientNote}`,
      "",
      `交接提醒：${summary.handoffNote}`
    ].join("\n");
    assertSafeLanguage(text, "summary text");
    return text;
  }

  return {
    SAFETY_NOTICE,
    NEUTRAL_EMPTY_FLAG,
    clinicianFlags,
    symptomPattern,
    durationBother,
    medicineContext,
    patientConstraints,
    nurseCues,
    buildClinicianSummary,
    summaryToText
  };
});
