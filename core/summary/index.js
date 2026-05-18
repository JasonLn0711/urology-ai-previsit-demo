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

  const SOAP_CASE_STUDIES = [
    {
      id: "case-bph",
      title: "Case 1 - 良性攝護腺肥大（BPH）",
      subtitle: "Benign Prostatic Hyperplasia",
      brief: {
        chiefConcern: "頻尿、夜尿、尿流變細與排尿遲疑",
        durationBother: "6 個月；近 2 個月逐漸加重",
        activeModules: "儲尿相關、排尿困難、用藥與病史",
        medication: "Amlodipine；無已知藥物過敏",
        reviewFlags: [
          "夜尿 4-5 次/晚，影響睡眠。",
          "合併尿流弱、排尿遲疑、尿不乾淨感。",
          "DRE、PSA、尿液與膀胱超音波資料需由醫師確認。"
        ],
        symptomSections: [
          ["儲尿相關", "頻尿 6 個月；夜尿 4-5 次/晚；症狀近 2 個月加重。"],
          ["排尿困難", "尿流變細、排尿遲疑、尿不乾淨感。"],
          ["否認症狀", "否認發燒、肉眼血尿、腰側痛、體重減輕。"]
        ]
      },
      narrative: [
        "65-year-old male presents with urinary frequency and nocturia for 6 months.",
        "Patient reports waking up 4-5 times nightly to urinate. He also noticed weak urine stream, hesitancy, and incomplete emptying sensation. Symptoms gradually worsened over the past 2 months.",
        "",
        "Denies fever, gross hematuria, flank pain, or weight loss.",
        "",
        "Past history:",
        "- Hypertension",
        "- Hyperlipidemia",
        "",
        "Medication:",
        "- Amlodipine",
        "",
        "Allergy:",
        "- No known drug allergy",
        "",
        "Family history:",
        "- Father had BPH",
        "",
        "Social history:",
        "- Non-smoker",
        "- Occasional alcohol use",
        "",
        "Physical examination:",
        "BP 138/82 mmHg",
        "HR 76 bpm",
        "Temp 36.7 C",
        "",
        "Digital rectal examination:",
        "- enlarged smooth prostate",
        "- non-tender",
        "",
        "Urinalysis:",
        "- no pyuria",
        "- no hematuria",
        "",
        "PSA:",
        "2.4 ng/mL",
        "",
        "Bladder ultrasound:",
        "- enlarged prostate",
        "- post-void residual urine: 90 mL",
        "",
        "Assessment:",
        "Physician-review draft: benign prostatic hyperplasia with lower urinary tract symptoms (LUTS).",
        "",
        "Plan:",
        "- Physician review field: tamsulosin 0.4 mg QD",
        "- Lifestyle modification",
        "- Reduce nighttime fluid intake",
        "- Follow-up in 4 weeks",
        "- Consider uroflowmetry if symptoms persist"
      ].join("\n")
    },
    {
      id: "case-uti",
      title: "Case 2 - 泌尿道感染（UTI）",
      subtitle: "Urinary Tract Infection",
      brief: {
        chiefConcern: "尿痛、頻尿與急尿",
        durationBother: "3 天；今日出現輕微下腹不適",
        activeModules: "疼痛/感染相關、儲尿相關、過敏史",
        medication: "目前無固定用藥；Penicillin allergy",
        reviewFlags: [
          "尿痛與灼熱感 3 天，合併頻尿與急尿。",
          "過去一年有兩次 UTI 病史。",
          "尿液檢查與 urine culture pending 需由醫師確認。"
        ],
        symptomSections: [
          ["感染相關", "Dysuria、frequency、urgency；今日 mild suprapubic discomfort。"],
          ["否認症狀", "否認 flank pain、fever、nausea、gross hematuria。"],
          ["客觀資料", "Urinalysis: leukocyte esterase positive, nitrite positive, elevated WBC；culture pending。"]
        ]
      },
      narrative: [
        "28-year-old female presents with dysuria and urinary frequency for 3 days.",
        "Patient reports burning sensation during urination and urgency. Mild suprapubic discomfort developed today.",
        "",
        "Denies flank pain, fever, nausea, or gross hematuria.",
        "",
        "Past history:",
        "- Recurrent UTI twice last year",
        "",
        "Medication:",
        "- None",
        "",
        "Allergy:",
        "- Penicillin allergy",
        "",
        "Social history:",
        "- Sexually active",
        "",
        "Physical examination:",
        "BP 112/70 mmHg",
        "HR 88 bpm",
        "Temp 37.4 C",
        "",
        "Abdominal examination:",
        "- mild suprapubic tenderness",
        "",
        "Urinalysis:",
        "- leukocyte esterase positive",
        "- nitrite positive",
        "- elevated WBC",
        "",
        "Urine culture:",
        "pending",
        "",
        "Assessment:",
        "Physician-review draft: acute uncomplicated urinary tract infection.",
        "",
        "Plan:",
        "- Physician review field: oral antibiotics",
        "- Increase hydration",
        "- Urine culture follow-up",
        "- Return immediately if fever or flank pain develops"
      ].join("\n")
    },
    {
      id: "case-stone",
      title: "Case 3 - 腎結石",
      subtitle: "Kidney Stone",
      brief: {
        chiefConcern: "突發右側腰痛並放射至鼠蹊部",
        durationBother: "6 小時；疼痛嚴重且合併噁心冒汗",
        activeModules: "疼痛/發燒相關、血尿相關、影像資料",
        medication: "目前無固定用藥",
        reviewFlags: [
          "突然 severe right flank pain，放射至 groin。",
          "合併 nausea 與 diaphoresis。",
          "CT 顯示 5 mm right distal ureter stone 與 mild hydronephrosis，需由醫師確認。"
        ],
        symptomSections: [
          ["疼痛型態", "右側腰痛 6 小時，疼痛放射至鼠蹊部。"],
          ["合併症狀", "噁心、冒汗；否認 fever 或 dysuria。"],
          ["客觀資料", "Right CVA tenderness；urinalysis microscopic hematuria；CT stone/hydronephrosis。"]
        ]
      },
      narrative: [
        "42-year-old male presents with sudden onset severe right flank pain for 6 hours.",
        "Pain radiates to the groin area and is associated with nausea and diaphoresis.",
        "",
        "Denies fever or dysuria.",
        "",
        "Past history:",
        "- Kidney stone 5 years ago",
        "",
        "Medication:",
        "- None",
        "",
        "Social history:",
        "- Poor water intake",
        "- High-salt diet",
        "",
        "Physical examination:",
        "BP 150/92 mmHg",
        "HR 102 bpm",
        "Temp 36.8 C",
        "",
        "Positive right costovertebral angle tenderness.",
        "",
        "Urinalysis:",
        "- microscopic hematuria",
        "",
        "CT scan:",
        "- 5 mm right distal ureter stone",
        "- mild hydronephrosis",
        "",
        "Assessment:",
        "Physician-review draft: right ureteral stone causing renal colic.",
        "",
        "Plan:",
        "- NSAIDs for pain control",
        "- Hydration",
        "- Medical expulsive therapy",
        "- Follow-up imaging in 2 weeks",
        "- Return if fever develops"
      ].join("\n")
    },
    {
      id: "case-hematuria",
      title: "Case 4 - 無痛性血尿",
      subtitle: "Hematuria",
      brief: {
        chiefConcern: "無痛性肉眼血尿",
        durationBother: "昨天開始；尿液呈暗紅色、無血塊",
        activeModules: "血尿相關、用藥/抽菸史、家族史",
        medication: "Aspirin",
        reviewFlags: [
          "Painless gross hematuria since yesterday。",
          "30 pack-years smoking history；father had bladder cancer。",
          "CT urography pending，需由醫師確認後續評估。"
        ],
        symptomSections: [
          ["血尿型態", "尿液 dark red，無 blood clots。"],
          ["否認症狀", "否認 dysuria、fever、flank pain、trauma。"],
          ["背景與客觀資料", "Aspirin；smoking 30 pack-years；UA gross hematuria；CBC Hb within normal range。"]
        ]
      },
      narrative: [
        "58-year-old male presents with painless gross hematuria since yesterday.",
        "Urine appears dark red without blood clots.",
        "",
        "Denies dysuria, fever, flank pain, or trauma.",
        "",
        "Past history:",
        "- Smoking history: 30 pack-years",
        "",
        "Medication:",
        "- Aspirin",
        "",
        "Family history:",
        "- Father had bladder cancer",
        "",
        "Physical examination:",
        "Vital signs stable.",
        "",
        "No abdominal tenderness.",
        "No flank knocking pain.",
        "",
        "Urinalysis:",
        "- gross hematuria",
        "",
        "CBC:",
        "- hemoglobin within normal range",
        "",
        "CT urography:",
        "pending",
        "",
        "Assessment:",
        "Physician-review draft: painless gross hematuria requiring urinary tract malignancy review.",
        "",
        "Plan:",
        "- Arrange cystoscopy",
        "- CT urography",
        "- Urine cytology",
        "- Smoking cessation counseling"
      ].join("\n")
    },
    {
      id: "case-retention",
      title: "Case 5 - 急性尿滯留",
      subtitle: "Urinary Retention",
      brief: {
        chiefConcern: "8 小時無法排尿與下腹脹痛",
        durationBother: "急性 8 小時；數月來已有尿流弱、遲疑、夜尿",
        activeModules: "排尿困難、急性尿滯留、腎功能與膀胱掃描資料",
        medication: "Antihypertensive medications",
        reviewFlags: [
          "目前 8 小時無法排尿，合併 severe lower abdominal fullness。",
          "Bladder scan retained urine approximately 900 mL。",
          "Mildly elevated creatinine；需由醫師確認急性處置與後續評估。"
        ],
        symptomSections: [
          ["急性狀態", "Inability to urinate for 8 hours；lower abdominal fullness and discomfort。"],
          ["既往排尿症狀", "數月來有 weak stream、hesitancy、nocturia。"],
          ["客觀資料", "Lower abdomen distended with suprapubic tenderness；bladder scan about 900 mL；mildly elevated creatinine。"]
        ]
      },
      narrative: [
        "72-year-old male presents with inability to urinate for 8 hours.",
        "Patient complains of severe lower abdominal fullness and discomfort.",
        "",
        "Over the past several months, patient had:",
        "- weak stream",
        "- hesitancy",
        "- nocturia",
        "",
        "Past history:",
        "- Diabetes mellitus",
        "- Benign prostatic hyperplasia",
        "",
        "Medication:",
        "- Antihypertensive medications",
        "",
        "Physical examination:",
        "BP 162/94 mmHg",
        "HR 96 bpm",
        "Temp 36.9 C",
        "",
        "Lower abdomen distended with suprapubic tenderness.",
        "",
        "Bladder scan:",
        "- retained urine volume approximately 900 mL",
        "",
        "Laboratory:",
        "- mildly elevated creatinine",
        "",
        "Assessment:",
        "Physician-review draft: acute urinary retention secondary to BPH pattern.",
        "",
        "Plan:",
        "- Foley catheter insertion",
        "- Monitor urine output",
        "- Physician review field: alpha blocker",
        "- Urology follow-up",
        "- Evaluate surgical treatment if recurrent"
      ].join("\n")
    }
  ];

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

  function soapLine(label, value, fallback) {
    return `${label}：${value || fallback}`;
  }

  function titleCaseFromModules(moduleNames) {
    const modules = new Set(moduleNames);
    if (modules.has("hematuria")) {
      return ["Case - 無痛性血尿審閱模式", "Hematuria Review Pattern"];
    }
    if (modules.has("pain")) {
      return ["Case - 泌尿道感染或腎結石相關症狀審閱模式", "UTI / Kidney Stone Review Pattern"];
    }
    if (modules.has("voiding")) {
      return ["Case - 排尿困難與急性尿滯留審閱模式", "Voiding Difficulty / Urinary Retention Review Pattern"];
    }
    if (modules.has("storage")) {
      return ["Case - 良性攝護腺肥大與下泌尿道症狀審閱模式", "BPH / LUTS Review Pattern"];
    }
    if (modules.has("leakage")) {
      return ["Case - 漏尿症狀審閱模式", "Urinary Leakage Review Pattern"];
    }
    return ["Case - 泌尿科門診前資料整理", "Urology Previsit Review Pattern"];
  }

  function caseStudyFromModules(moduleNames, safeAnswers) {
    const modules = new Set(moduleNames);
    if (modules.has("hematuria")) return SOAP_CASE_STUDIES[3];
    if (modules.has("pain") && containsValue(safeAnswers && safeAnswers.systemicSymptoms, "side or back pain")) {
      return SOAP_CASE_STUDIES[2];
    }
    if (modules.has("pain")) return SOAP_CASE_STUDIES[1];
    if (modules.has("voiding")) return SOAP_CASE_STUDIES[4];
    if (modules.has("storage")) return SOAP_CASE_STUDIES[0];
    return SOAP_CASE_STUDIES[0];
  }

  function reportSection(label, lines) {
    const content = lines.filter(Boolean);
    return [
      `${label}:`,
      ...(content.length ? content.map((item) => `- ${item}`) : ["- Not provided"])
    ].join("\n");
  }

  function buildSoapDraftFromPieces(safeAnswers, pieces) {
    const modules = pieces.moduleNames.length ? pieces.moduleNames : ["core only"];
    const moduleLabels = modules.map((module) => MODULE_LABELS[module] || module).join("、");
    const flags = pieces.flags.length ? pieces.flags : [NEUTRAL_EMPTY_FLAG];
    const missing = pieces.missing.length ? pieces.missing : ["目前沒有必補核心欄位。"];
    const selectedCaseStudy = caseStudyFromModules(modules, safeAnswers);
    const [caseTitle, caseSubtitle] = titleCaseFromModules(modules);
    const subjective = [
      soapLine("主訴", formatList(safeAnswers.chiefConcern, "未提供"), "未提供"),
      soapLine("病程與困擾", durationBother(safeAnswers), "未提供"),
      soapLine("病人回報症狀型態", symptomPattern(safeAnswers), "目前資訊不足"),
      soapLine("病史與用藥背景", medicineContext(safeAnswers), "未提供"),
      soapLine("病人補充", answer(safeAnswers.notes), "沒有補充說明")
    ];
    const objective = [
      soapLine("填答來源", displayValue(safeAnswers.filledBy), "未提供"),
      soapLine("啟動整理模組", moduleLabels, "核心欄位"),
      soapLine("來源分布", sourceAttributionSummary(safeAnswers).join("；"), "未標記"),
      soapLine("缺漏或不確定資訊", missing.join("；"), "目前沒有必補核心欄位"),
      "目前未接入院內檢查、生命徵象或影像資料；若有客觀紀錄，需由醫療人員於現場核對後補入。"
    ];
    const assessment = [
      "醫師待評估：本草稿僅把病人回報與結構化欄位整理成看診前問題清單。",
      soapLine("需現場確認的病人回報", flags.join("；"), NEUTRAL_EMPTY_FLAG),
      "若病人描述與現場評估不一致，以醫療人員確認內容為準。"
    ];
    const plan = [
      "醫師可依現場流程決定是否補問、補登客觀資料或調整病歷內容。",
      `可優先補齊：${missing.join("；")}`,
      "本草稿不可直接作為診斷、分流、治療建議或檢查開立依據。"
    ];
    const structuredNarrative = [
      `${formatList(safeAnswers.chiefConcern, "Urology previsit concern")} for ${displayValue(safeAnswers.duration) || "an unspecified duration"}.`,
      `Patient-reported pattern: ${symptomPattern(safeAnswers)}`,
      flags.filter((item) => item !== NEUTRAL_EMPTY_FLAG).length
        ? `Clinician-review flags: ${flags.join(" ")}`
        : "No special clinician-review flag is currently highlighted in this synthetic case.",
      "",
      "Denies or not yet confirms:",
      "- Items not captured by the structured intake remain for physician confirmation.",
      "",
      reportSection("Past history", [
        hasValue(safeAnswers.relevantComorbidities)
          ? formatList(safeAnswers.relevantComorbidities, "")
          : "Not provided in the structured intake"
      ]),
      "",
      reportSection("Medication", [
        medicineContext(safeAnswers)
      ]),
      "",
      reportSection("Allergy", [
        "Not captured by the current structured intake"
      ]),
      "",
      reportSection("Family history", [
        "Not captured by the current structured intake"
      ]),
      "",
      reportSection("Social history", [
        hasValue(safeAnswers.fluidCaffeineContext)
          ? formatList(safeAnswers.fluidCaffeineContext, "")
          : "Not captured by the current structured intake"
      ]),
      "",
      reportSection("Physical examination", [
        "Not connected to clinic examination records in this synthetic demo"
      ]),
      "",
      reportSection("Objective records", [
        `Intake source: ${displayValue(safeAnswers.filledBy) || "Not provided"}`,
        `Active structured modules: ${moduleLabels}`,
        `Source distribution: ${sourceAttributionSummary(safeAnswers).join("; ") || "Not marked"}`,
        "Vital signs, laboratory data, imaging, and procedure results must be entered or confirmed by clinical staff when available"
      ]),
      "",
      "Assessment:",
      "Physician-review draft: structured previsit information is organized for clinician confirmation before final documentation.",
      `Review focus: ${flags.join(" ")}`,
      "",
      "Plan:",
      "- Physician may confirm the history, examination, objective records, and missing fields during the visit.",
      `- Fields to consider completing: ${missing.join("；")}`,
      "- This demo must not be used as diagnosis, triage, treatment advice, or exam ordering."
    ].join("\n");

    const draft = {
      title: selectedCaseStudy.title || caseTitle,
      subtitle: selectedCaseStudy.subtitle || caseSubtitle,
      boundary: "由合成問答資料自動整理，僅作為醫師看診前參考。",
      format: "case-report",
      narrative: selectedCaseStudy.narrative || structuredNarrative,
      selectedCaseStudyId: selectedCaseStudy.id,
      caseStudies: SOAP_CASE_STUDIES.map((item) => Object.assign({}, item)),
      subjective,
      objective,
      assessment,
      plan
    };
    assertSafeLanguage(draft, "SOAP draft");
    return draft;
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
      soapDraft: buildSoapDraftFromPieces(safeAnswers, { missing, flags, moduleNames }),
      rawAnswers: Object.assign({}, safeAnswers)
    });

    assertSafeLanguage(summary, "clinician summary");
    return summary;
  }

  function soapDraftToText(soapDraft) {
    if (!soapDraft) return "";
    const text = [
      soapDraft.title,
      soapDraft.subtitle,
      soapDraft.boundary,
      "",
      soapDraft.narrative,
      "",
      "S - Subjective",
      ...soapDraft.subjective.map((item) => `- ${item}`),
      "",
      "O - Objective",
      ...soapDraft.objective.map((item) => `- ${item}`),
      "",
      "A - Assessment",
      ...soapDraft.assessment.map((item) => `- ${item}`),
      "",
      "P - Plan",
      ...soapDraft.plan.map((item) => `- ${item}`)
    ].join("\n");
    assertSafeLanguage(text, "SOAP draft text");
    return text;
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
      soapDraftToText(summary.soapDraft),
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
    soapDraftToText,
    buildClinicianSummary,
    summaryToText
  };
});
