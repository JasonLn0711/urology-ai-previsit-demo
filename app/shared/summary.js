(function attachSummary(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.UrologyPrevisit = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function summaryFactory() {
  const CORE_REQUIRED_FIELDS = [
    ["filledBy", "who is filling this out"],
    ["chiefConcern", "main urinary concern"],
    ["duration", "symptom duration"],
    ["botherScore", "bother score"],
    ["daytimeFrequencyChange", "daytime urination change"],
    ["nocturiaCount", "nighttime urination count"],
    ["urgency", "sudden hard-to-hold urgency"],
    ["leakage", "urine leakage in the past 4 weeks"],
    ["painBurning", "pain or burning with urination"],
    ["visibleBlood", "visible blood or clots"],
    ["unableToUrinate", "trouble or inability to urinate"],
    ["systemicSymptoms", "fever, chills, or side/back pain"],
    ["medicationListStatus", "medication list readiness"]
  ];

  const SAFETY_NOTICE = [
    "This demo does not diagnose or recommend treatment.",
    "A clinician must review all information.",
    "Use synthetic data only."
  ];

  const NEUTRAL_EMPTY_FLAG = "No priority review statement captured in this synthetic demo.";

  const SOURCE_LABELS = {
    declared_on_entry: "填答開始時標記",
    patient_self: "本人回答",
    patient_with_family_operator: "本人回答，家屬協助操作",
    family_observation: "家屬/協助者觀察",
    nurse_supplement: "現場補問",
    unknown: "未標記來源"
  };

  const SUBJECTIVE_FIELDS = new Set([
    "botherScore",
    "urgency",
    "leakage",
    "painBurning",
    "unableToUrinate",
    "currentlyUnableToUrinate",
    "weakStream",
    "straining",
    "intermittency",
    "incompleteEmptying",
    "flankPainScore",
    "notes"
  ]);

  const SUPPLEMENTAL_PROMPTS = {
    filledBy: {
      ask: "請確認這份資料主要是誰回答：本人、家人協助操作，或家人依觀察代答？",
      why: "資料來源會影響主觀症狀的可信度與是否需要本人再確認。"
    },
    chiefConcern: {
      ask: "今天最想先處理的泌尿問題是哪一個？可以請病人用自己的話說。",
      why: "主訴會決定後續追問模組與醫師摘要排序。"
    },
    duration: {
      ask: "這個問題大約從什麼時候開始？不知道精確日期也可以選大概時間。",
      why: "病程可協助區分新近、反覆或長期問題。"
    },
    botherScore: {
      ask: "如果 0 是不困擾、10 是非常困擾，現在大約幾分？",
      why: "困擾程度能幫助看診前排序病人最在意的問題。"
    },
    daytimeFrequencyChange: {
      ask: "白天清醒時，上廁所尿尿的次數有沒有比以前明顯變多？",
      why: "這是頻尿相關追問是否需要開啟的核心線索。"
    },
    nocturiaCount: {
      ask: "晚上睡著後，通常會起床尿尿幾次？",
      why: "夜尿次數是醫師常需要快速知道的症狀重點。"
    },
    urgency: {
      ask: "會不會突然很想尿，而且覺得很難忍住？",
      why: "可協助整理急尿相關症狀，但不做診斷。"
    },
    leakage: {
      ask: "最近 4 週，有沒有尿不小心漏出來？",
      why: "若有漏尿，系統才需要補問頻率、量與發生情境。"
    },
    painBurning: {
      ask: "尿尿時會不會痛、刺痛或有灼熱感？",
      why: "這是疼痛或感染相關症狀的病人回報，不代表診斷。"
    },
    visibleBlood: {
      ask: "有沒有看過尿液變紅、茶色，或看到血塊？",
      why: "可見血尿或血塊需要在看診前讓臨床端知道。"
    },
    unableToUrinate: {
      ask: "有沒有很想尿，卻尿不太出來或完全尿不出來？",
      why: "排尿困難或尿不出來需要現場確認。"
    },
    currentlyUnableToUrinate: {
      ask: "現在是否還有尿不出來的情況？",
      why: "目前正在發生的症狀需要在現場被看見。"
    },
    systemicSymptoms: {
      ask: "最近有沒有發燒、發冷，或腰部兩側疼痛？",
      why: "這些是需要現場確認的病人回報。"
    },
    medicationListStatus: {
      ask: "今天能不能提供目前吃的藥、藥袋、藥單或照片？",
      why: "用藥資訊常需要護理端協助補齊，避免病人猜藥名。"
    },
    daytimeFrequencyCount: {
      ask: "白天清醒時，大約尿尿幾次？可以用區間回答。",
      why: "用區間可降低記憶負擔，仍能幫助整理頻尿狀況。"
    },
    urgencyFrequency: {
      ask: "突然很急、很難忍住的情況大約多久發生一次？",
      why: "可補足急尿症狀頻率。"
    },
    bladderDiaryFeasible: {
      ask: "如果現場人員說明，是否方便記錄幾天尿尿時間、尿量或喝水？",
      why: "判斷排尿日誌是否可行；不是要求病人現在一定要做。"
    },
    leakageFrequency: {
      ask: "最近 4 週，漏尿大約多常發生？",
      why: "可協助整理漏尿負擔。"
    },
    leakageAmount: {
      ask: "通常漏出來的量大約是多少：幾滴、少量、會濕，或很多？",
      why: "可協助了解照護與用品需求。"
    },
    leakageTriggers: {
      ask: "什麼情況比較容易漏尿？例如來不及到廁所、咳嗽、睡覺時。",
      why: "只記錄發生情境，不自動判斷漏尿類型。"
    },
    containmentProducts: {
      ask: "目前有沒有使用護墊、尿布或其他用品？不想回答可以說稍後再談。",
      why: "可讓護理端知道是否需要生活照護支持。"
    },
    weakStream: {
      ask: "尿流有沒有變細或變弱？",
      why: "可補足排尿困難相關描述。"
    },
    straining: {
      ask: "尿尿時是否常需要用力才尿得出來？",
      why: "可補足排尿困難相關描述。"
    },
    intermittency: {
      ask: "尿尿時會不會斷斷續續？",
      why: "可補足排尿型態描述。"
    },
    incompleteEmptying: {
      ask: "尿完後，會不會常覺得還沒尿乾淨？",
      why: "可補足排空感描述，但不代表殘尿量判斷。"
    },
    hematuriaPattern: {
      ask: "看到紅色或茶色尿是一次、反覆，還是最近幾乎每次都有？",
      why: "可補足可見血尿發生模式。"
    },
    bloodClots: {
      ask: "有沒有看到像血塊的東西？不確定也可以說不確定。",
      why: "血塊是醫師看摘要時需要知道的病人觀察。"
    },
    painFrequency: {
      ask: "疼痛或灼熱感通常是在尿尿時、尿完後，還是其他時間？",
      why: "可補足疼痛發生時機。"
    },
    infectionEpisodeHistory: {
      ask: "過去 12 個月是否曾因類似尿痛、頻尿、急尿就醫或吃抗生素？",
      why: "只記錄過去經驗，不代表系統診斷感染。"
    },
    flankPainScore: {
      ask: "腰部兩側疼痛大約幾分？0 是不痛，10 是非常痛。",
      why: "可讓現場人員知道疼痛強度。"
    },
    medicationAssist: {
      ask: "是否需要現場人員協助確認藥袋、藥單或藥物照片？",
      why: "避免病人或家屬猜測藥物分類。"
    }
  };

  function answer(value) {
    if (Array.isArray(value)) {
      return value
        .map((item) => (typeof item === "string" ? item.trim() : ""))
        .filter(Boolean)
        .join(", ");
    }
    if (typeof value !== "string") return "";
    return value.trim();
  }

  function lower(value) {
    return answer(value).toLowerCase();
  }

  function listValue(value) {
    if (Array.isArray(value)) {
      return value.map((item) => (typeof item === "string" ? item.trim() : "")).filter(Boolean);
    }
    const single = answer(value);
    return single ? [single] : [];
  }

  function hasValue(value) {
    if (Array.isArray(value)) return listValue(value).length > 0;
    return Boolean(answer(value));
  }

  function sourceByField(answers) {
    return answers && typeof answers.sourceByField === "object" && !Array.isArray(answers.sourceByField)
      ? answers.sourceByField
      : {};
  }

  function inferSourceFromMode(mode) {
    const normalized = lower(mode);
    if (normalized.includes("family helped operate")) return "patient_with_family_operator";
    if (normalized.includes("family") || normalized.includes("helper")) return "family_observation";
    if (normalized.includes("nurse")) return "nurse_supplement";
    if (normalized.includes("patient self")) return "patient_self";
    return "unknown";
  }

  function sourceForField(answers, field) {
    const explicit = answer(sourceByField(answers)[field]);
    if (explicit) return explicit;
    if (field === "filledBy" && hasValue(answers.filledBy)) return "declared_on_entry";
    return hasValue(answers[field]) ? inferSourceFromMode(answers.filledBy) : "unknown";
  }

  function sourceLabel(source) {
    return SOURCE_LABELS[source] || SOURCE_LABELS.unknown;
  }

  function fieldSourceEntries(answers) {
    return Object.keys(answers || {})
      .filter((field) => field !== "sourceByField" && hasValue(answers[field]))
      .map((field) => ({
        field,
        source: sourceForField(answers, field),
        label: sourceLabel(sourceForField(answers, field))
      }));
  }

  function sourceAttributionSummary(answers) {
    const counts = fieldSourceEntries(answers).reduce((acc, item) => {
      acc[item.source] = (acc[item.source] || 0) + 1;
      return acc;
    }, {});
    const lines = Object.entries(counts).map(([source, count]) => `${sourceLabel(source)}: ${count}`);
    return lines.length ? lines : ["No answered fields with source attribution."];
  }

  function isYes(value) {
    return /^yes\b/i.test(answer(value));
  }

  function isNotSure(value) {
    return /not sure|unsure|do not know/i.test(answer(value));
  }

  function containsValue(value, fragment) {
    const needle = fragment.toLowerCase();
    return listValue(value).some((item) => item.toLowerCase().includes(needle));
  }

  function formatList(value, fallback) {
    const items = listValue(value);
    return items.length ? items.join(", ") : fallback;
  }

  function hasConcern(answers, fragment) {
    return lower(answers.chiefConcern).includes(fragment);
  }

  function activeModules(answers) {
    const systemic = listValue(answers.systemicSymptoms).join(" ").toLowerCase();
    const medicationStatus = lower(answers.medicationListStatus);
    const storage =
      hasConcern(answers, "frequency") ||
      hasConcern(answers, "nocturia") ||
      hasConcern(answers, "urgency") ||
      isYes(answers.daytimeFrequencyChange) ||
      isYes(answers.urgency) ||
      ["2 times", "3 or more"].some((item) => lower(answers.nocturiaCount).includes(item));
    const leakage =
      hasConcern(answers, "leakage") ||
      isYes(answers.leakage);
    const voiding =
      hasConcern(answers, "emptying") ||
      hasConcern(answers, "weak stream") ||
      isYes(answers.unableToUrinate);
    const hematuria =
      hasConcern(answers, "visible blood") ||
      hasConcern(answers, "clots") ||
      isYes(answers.visibleBlood);
    const pain =
      hasConcern(answers, "pain") ||
      hasConcern(answers, "burning") ||
      hasConcern(answers, "infection") ||
      isYes(answers.painBurning) ||
      systemic.includes("fever") ||
      systemic.includes("chills") ||
      systemic.includes("side or back pain");
    const medication =
      medicationStatus.includes("partial") ||
      medicationStatus.includes("not sure") ||
      medicationStatus.includes("cannot") ||
      medicationStatus.includes("do not know") ||
      storage ||
      voiding ||
      hematuria ||
      hasConcern(answers, "infection");

    return {
      storage,
      leakage,
      voiding,
      hematuria,
      pain,
      medication
    };
  }

  function requiredFieldsForAnswers(answers) {
    const fields = CORE_REQUIRED_FIELDS.slice();
    const modules = activeModules(answers);

    if (isYes(answers.unableToUrinate)) {
      fields.push(["currentlyUnableToUrinate", "whether trouble urinating is happening now"]);
    }

    if (modules.storage) {
      fields.push(["daytimeFrequencyCount", "daytime urination count range"]);
      fields.push(["urgencyFrequency", "urgency frequency"]);
      fields.push(["fluidCaffeineContext", "fluid or caffeine context"]);
      fields.push(["bladderDiaryFeasible", "bladder diary feasibility"]);
    }

    if (modules.leakage) {
      fields.push(["leakageFrequency", "leakage frequency"]);
      fields.push(["leakageAmount", "leakage amount"]);
      fields.push(["leakageTriggers", "leakage triggers"]);
      fields.push(["containmentProducts", "pads, diapers, or containment needs"]);
    }

    if (modules.voiding) {
      fields.push(["weakStream", "weak stream"]);
      fields.push(["straining", "straining to urinate"]);
      fields.push(["incompleteEmptying", "feeling of incomplete emptying"]);
    }

    if (modules.hematuria) {
      fields.push(["hematuriaPattern", "visible blood pattern"]);
      fields.push(["bloodClots", "blood clots"]);
    }

    if (modules.pain) {
      fields.push(["painFrequency", "pain or burning pattern"]);
      fields.push(["infectionEpisodeHistory", "recent infection or antibiotic history"]);
      if (containsValue(answers.systemicSymptoms, "side or back pain")) {
        fields.push(["flankPainScore", "side or back pain score"]);
      }
    }

    if (modules.medication) {
      fields.push(["medicationAssist", "medication review support need"]);
      fields.push(["relevantComorbidities", "patient-reported medical context"]);
      fields.push(["diureticAnticoagulantAwareness", "water pill or blood thinner awareness"]);
    }

    const seen = new Set();
    return fields.filter(([field]) => {
      if (seen.has(field)) return false;
      seen.add(field);
      return true;
    });
  }

  function missingFieldEntries(answers) {
    return requiredFieldsForAnswers(answers).filter(([field]) => !hasValue(answers[field]));
  }

  function missingFields(answers) {
    return missingFieldEntries(answers).map(([, label]) => label);
  }

  function clinicianFlags(answers) {
    const flags = [];
    if (isYes(answers.currentlyUnableToUrinate)) {
      flags.push("Reports currently being unable to urinate.");
    } else if (isYes(answers.unableToUrinate)) {
      flags.push("Reports trouble or inability to urinate.");
    }
    if (isYes(answers.visibleBlood)) {
      flags.push("Reports visible blood or clots in urine.");
    }
    if (isYes(answers.bloodClots)) {
      flags.push("Reports blood clots.");
    }
    if (containsValue(answers.systemicSymptoms, "fever")) {
      flags.push("Reports fever.");
    }
    if (containsValue(answers.systemicSymptoms, "chills")) {
      flags.push("Reports chills.");
    }
    if (containsValue(answers.systemicSymptoms, "side or back pain")) {
      flags.push("Reports side or back pain.");
    }
    if (isYes(answers.painBurning)) {
      flags.push("Reports pain or burning with urination.");
    }
    return flags;
  }

  function symptomPattern(answers) {
    const modules = activeModules(answers);
    const sections = [];

    if (modules.storage) {
      sections.push([
        "Storage",
        [
          answer(answers.daytimeFrequencyChange) && `daytime change: ${answer(answers.daytimeFrequencyChange)}`,
          answer(answers.daytimeFrequencyCount) && `daytime count: ${answer(answers.daytimeFrequencyCount)}`,
          answer(answers.nocturiaCount) && `night count: ${answer(answers.nocturiaCount)}`,
          answer(answers.urgency) && `urgency: ${answer(answers.urgency)}`,
          answer(answers.urgencyFrequency) && `urgency frequency: ${answer(answers.urgencyFrequency)}`,
          hasValue(answers.fluidCaffeineContext) && `fluid/caffeine context: ${formatList(answers.fluidCaffeineContext, "")}`,
          answer(answers.bladderDiaryFeasible) && `diary feasibility: ${answer(answers.bladderDiaryFeasible)}`
        ].filter(Boolean).join("; ")
      ]);
    }

    if (modules.voiding) {
      sections.push([
        "Voiding/emptying",
        [
          answer(answers.unableToUrinate) && `trouble/inability: ${answer(answers.unableToUrinate)}`,
          answer(answers.currentlyUnableToUrinate) && `happening now: ${answer(answers.currentlyUnableToUrinate)}`,
          answer(answers.weakStream) && `weak stream: ${answer(answers.weakStream)}`,
          answer(answers.straining) && `straining: ${answer(answers.straining)}`,
          answer(answers.intermittency) && `stopping/starting: ${answer(answers.intermittency)}`,
          answer(answers.incompleteEmptying) && `incomplete emptying: ${answer(answers.incompleteEmptying)}`
        ].filter(Boolean).join("; ")
      ]);
    }

    if (modules.leakage) {
      sections.push([
        "Leakage",
        [
          answer(answers.leakage) && `past 4 weeks: ${answer(answers.leakage)}`,
          answer(answers.leakageFrequency) && `frequency: ${answer(answers.leakageFrequency)}`,
          answer(answers.leakageAmount) && `amount: ${answer(answers.leakageAmount)}`,
          hasValue(answers.leakageTriggers) && `triggers: ${formatList(answers.leakageTriggers, "")}`,
          answer(answers.containmentProducts) && `containment: ${answer(answers.containmentProducts)}`
        ].filter(Boolean).join("; ")
      ]);
    }

    if (modules.hematuria) {
      sections.push([
        "Visible blood/clots",
        [
          answer(answers.visibleBlood) && `seen by patient: ${answer(answers.visibleBlood)}`,
          answer(answers.hematuriaPattern) && `pattern: ${answer(answers.hematuriaPattern)}`,
          answer(answers.bloodClots) && `clots: ${answer(answers.bloodClots)}`,
          hasValue(answers.hematuriaCoSymptoms) && `with: ${formatList(answers.hematuriaCoSymptoms, "")}`
        ].filter(Boolean).join("; ")
      ]);
    }

    if (modules.pain) {
      sections.push([
        "Pain/infection-related",
        [
          answer(answers.painBurning) && `pain/burning: ${answer(answers.painBurning)}`,
          answer(answers.painFrequency) && `pattern: ${answer(answers.painFrequency)}`,
          hasValue(answers.systemicSymptoms) && `systemic symptoms: ${formatList(answers.systemicSymptoms, "")}`,
          answer(answers.infectionEpisodeHistory) && `recent episodes/antibiotics: ${answer(answers.infectionEpisodeHistory)}`,
          answer(answers.flankPainScore) && `side/back pain score: ${answer(answers.flankPainScore)}`
        ].filter(Boolean).join("; ")
      ]);
    }

    return sections.length
      ? sections.map(([label, detail]) => `${label}: ${detail || "details not provided"}`).join(" | ")
      : "Not enough information yet.";
  }

  function durationBother(answers) {
    return [
      answer(answers.duration) || "Duration not provided",
      answer(answers.botherScore) ? `bother score ${answer(answers.botherScore)}/10` : "Bother score not provided"
    ].join(" / ");
  }

  function medicineContext(answers) {
    const parts = [
      answer(answers.medicationListStatus) && `list readiness: ${answer(answers.medicationListStatus)}`,
      answer(answers.medicationAssist) && `review support: ${answer(answers.medicationAssist)}`,
      hasValue(answers.relevantComorbidities) && `patient-reported context: ${formatList(answers.relevantComorbidities, "")}`,
      answer(answers.diureticAnticoagulantAwareness) && `diuretic/anticoagulant awareness: ${answer(answers.diureticAnticoagulantAwareness)}`
    ].filter(Boolean);
    return parts.length ? parts.join("; ") : "Not provided";
  }

  function patientConstraints(answers) {
    return [
      answer(answers.filledBy) || "Completion source not provided",
      answer(answers.language) || "Language preference not provided",
      answer(answers.deviceComfort) || "Device/accessibility need not provided",
      answer(answers.supportPreference) || "Support preference not provided"
    ];
  }

  function nurseCues(answers) {
    const cues = [];
    const modules = activeModules(answers);
    const flags = clinicianFlags(answers);
    const uncertainCore = [
      "daytimeFrequencyChange",
      "nocturiaCount",
      "urgency",
      "leakage",
      "painBurning",
      "visibleBlood",
      "unableToUrinate"
    ].filter((field) => isNotSure(answers[field]));
    if (containsValue(answers.systemicSymptoms, "not sure")) {
      uncertainCore.push("systemicSymptoms");
    }

    if (/nurse|family|helper/i.test(answer(answers.filledBy)) || /staff|family|help/i.test(answer(answers.supportPreference))) {
      cues.push("Completion support may be needed before clinician review.");
    }
    if (uncertainCore.length) {
      cues.push("Some core answers are marked not sure; staff may need to clarify them before clinician review.");
    }
    if (modules.storage) {
      cues.push("Bladder diary instruction may be relevant if clinic workflow supports it.");
    }
    if (modules.leakage || hasValue(answers.containmentProducts)) {
      cues.push("Containment product or leakage-support needs should remain visible to staff.");
    }
    if (activeModules(answers).medication || /partial|not sure|cannot|do not know/i.test(answer(answers.medicationListStatus))) {
      cues.push("Medication list may need nurse review or supplemental confirmation.");
    }
    if (flags.length) {
      cues.push("Priority review statements should be visible before the clinician encounter.");
    }
    return cues.length ? cues : ["No nurse-specific cue captured beyond routine review."];
  }

  function supplementalPrompt(field, label) {
    const prompt = SUPPLEMENTAL_PROMPTS[field] || {
      ask: `請補問：${label}`,
      why: "這是目前摘要仍缺少的必要資訊。"
    };
    return {
      field,
      label,
      ask: prompt.ask,
      why: prompt.why
    };
  }

  function sourceNotes(answers) {
    const source = answer(answers.filledBy);
    const notes = [];
    const familySubjectiveFields = fieldSourceEntries(answers)
      .filter((item) => item.source === "family_observation" && SUBJECTIVE_FIELDS.has(item.field))
      .map((item) => item.field);

    if (!source) {
      notes.push("尚未確認資料來源；請先確認是本人回答、家人協助操作，或家人依觀察代答。");
    }
    if (/family|helper/i.test(source)) {
      notes.push("本份資料含家屬/協助者參與；疼痛、急尿、困擾程度等主觀感受建議由本人確認。");
    }
    if (/patient self/i.test(source)) {
      notes.push("資料來源標示為本人回答；若仍有不確定答案，可由現場人員補問。");
    }
    if (/nurse/i.test(source)) {
      notes.push("資料來源標示為現場協助；請保留補問者與補問時間的紀錄。");
    }
    if (familySubjectiveFields.length) {
      notes.push("有主觀感受欄位標示為家屬觀察；建議現場由本人確認疼痛、急尿、困擾程度或尿不出來感受。");
    }
    return notes.length ? notes : ["資料來源已標示，但仍需依現場情境確認。"];
  }

  function buildNurseChecklist(answers) {
    const missing = missingFieldEntries(answers).map(([field, label]) => supplementalPrompt(field, label));
    const flags = clinicianFlags(answers);
    return {
      completionStatus: completionStatus(answers),
      activeModules: Object.entries(activeModules(answers))
        .filter(([, active]) => active)
        .map(([name]) => name),
      supplementalQuestions: missing,
      sourceNotes: sourceNotes(answers),
      workflowCues: nurseCues(answers),
      priorityReviewFlags: flags.length ? flags : [NEUTRAL_EMPTY_FLAG],
      fieldSources: fieldSourceEntries(answers),
      sourceAttributionSummary: sourceAttributionSummary(answers),
      rawAnswers: Object.assign({}, answers)
    };
  }

  function completionStatus(answers) {
    const required = requiredFieldsForAnswers(answers);
    const missing = missingFieldEntries(answers);
    const completed = required.length - missing.length;
    return {
      completed,
      total: required.length,
      missingCount: missing.length,
      label: missing.length
        ? `${missing.length} MVP fields still missing`
        : "MVP fields complete for clinician review",
      tone: missing.length ? "needs-review" : "ready"
    };
  }

  function buildClinicianSummary(answers) {
    const missing = missingFields(answers);
    const flags = clinicianFlags(answers);
    const status = completionStatus(answers);
    const modules = activeModules(answers);
    const moduleNames = Object.entries(modules)
      .filter(([, active]) => active)
      .map(([name]) => name);

    return {
      safetyNotice: SAFETY_NOTICE,
      completionStatus: status,
      activeModules: moduleNames.length ? moduleNames : ["core only"],
      intakeMode: answer(answers.filledBy) || "Not provided",
      chiefConcern: answer(answers.chiefConcern) || "Not provided",
      symptomPattern: symptomPattern(answers),
      durationBother: durationBother(answers),
      clinicianReviewFlags: flags.length ? flags : [NEUTRAL_EMPTY_FLAG],
      missingInformation: missing.length ? missing : ["No required MVP fields missing."],
      nurseCues: nurseCues(answers),
      patientConstraints: patientConstraints(answers),
      medicines: medicineContext(answers),
      patientNote: answer(answers.notes) || "No optional note.",
      sourceNotes: sourceNotes(answers),
      fieldSources: fieldSourceEntries(answers),
      sourceAttributionSummary: sourceAttributionSummary(answers),
      handoffNote: "Patient-provided or helper-provided answers; clinician review required.",
      rawAnswers: Object.assign({}, answers)
    };
  }

  function buildVisitPacket(answers) {
    const summary = buildClinicianSummary(answers);
    const nurseChecklist = buildNurseChecklist(answers);
    return {
      title: "Urology previsit role-separated packet",
      safetyNotice: SAFETY_NOTICE,
      patientPage: {
        title: "Patient and family confirmation",
        audience: "patient-family",
        rows: [
          ["Completion source", summary.intakeMode],
          ["Main concern", summary.chiefConcern],
          ["Duration / bother", summary.durationBother],
          ["Medication readiness", medicineContext(answers)],
          ["Optional note", summary.patientNote]
        ],
        missingInformation: summary.missingInformation,
        sourceNotes: summary.sourceNotes
      },
      nursePage: {
        title: "Nurse missing-information repair",
        audience: "nurse",
        completionStatus: nurseChecklist.completionStatus,
        supplementalQuestions: nurseChecklist.supplementalQuestions,
        workflowCues: nurseChecklist.workflowCues,
        sourceNotes: nurseChecklist.sourceNotes,
        priorityReviewFlags: nurseChecklist.priorityReviewFlags
      },
      clinicianPage: {
        title: "Clinician previsit scan",
        audience: "clinician",
        rows: [
          ["Completion source", summary.intakeMode],
          ["Main concern", summary.chiefConcern],
          ["Active modules", summary.activeModules.join(", ")],
          ["Duration / bother", summary.durationBother],
          ["Patient-reported pattern", summary.symptomPattern],
          ["Medication/context", summary.medicines],
          ["Patient note", summary.patientNote]
        ],
        priorityReviewFlags: summary.clinicianReviewFlags,
        missingInformation: summary.missingInformation,
        sourceAttributionSummary: summary.sourceAttributionSummary,
        fieldSources: summary.fieldSources
      },
      rawAnswers: Object.assign({}, answers)
    };
  }

  function visitPacketToText(packet) {
    return [
      packet.title,
      "",
      "Safety:",
      ...packet.safetyNotice.map((item) => `- ${item}`),
      "",
      `[${packet.patientPage.title}]`,
      ...packet.patientPage.rows.map(([label, value]) => `${label}: ${value}`),
      "Missing or uncertain:",
      ...packet.patientPage.missingInformation.map((item) => `- ${item}`),
      "",
      `[${packet.nursePage.title}]`,
      `Completion: ${packet.nursePage.completionStatus.label}`,
      "Supplemental questions:",
      ...packet.nursePage.supplementalQuestions.map((item) => `- ${item.ask}`),
      "Workflow cues:",
      ...packet.nursePage.workflowCues.map((item) => `- ${item}`),
      "",
      `[${packet.clinicianPage.title}]`,
      ...packet.clinicianPage.rows.map(([label, value]) => `${label}: ${value}`),
      "Priority review statements:",
      ...packet.clinicianPage.priorityReviewFlags.map((item) => `- ${item}`),
      "Answer source attribution:",
      ...packet.clinicianPage.sourceAttributionSummary.map((item) => `- ${item}`)
    ].join("\n");
  }

  function summaryToText(summary) {
    return [
      "Urology previsit synthetic summary",
      "",
      "Safety:",
      ...summary.safetyNotice.map((item) => `- ${item}`),
      "",
      `Completeness: ${summary.completionStatus.label}`,
      `Active modules: ${summary.activeModules.join(", ")}`,
      `Intake mode: ${summary.intakeMode}`,
      `Chief concern: ${summary.chiefConcern}`,
      `Duration / bother: ${summary.durationBother}`,
      `Patient-reported pattern: ${summary.symptomPattern}`,
      "",
      "Priority review statements:",
      ...summary.clinicianReviewFlags.map((item) => `- ${item}`),
      "",
      "Nurse workflow cues:",
      ...summary.nurseCues.map((item) => `- ${item}`),
      "",
      "Missing information:",
      ...summary.missingInformation.map((item) => `- ${item}`),
      "",
      "Support needs:",
      ...summary.patientConstraints.map((item) => `- ${item}`),
      "",
      "Answer source notes:",
      ...summary.sourceNotes.map((item) => `- ${item}`),
      ...summary.sourceAttributionSummary.map((item) => `- ${item}`),
      "",
      `Medication/context: ${summary.medicines}`,
      `Patient note: ${summary.patientNote}`,
      "",
      `Handoff note: ${summary.handoffNote}`
    ].join("\n");
  }

  return {
    REQUIRED_FIELDS: CORE_REQUIRED_FIELDS,
    SAFETY_NOTICE,
    activeModules,
    requiredFieldsForAnswers,
    missingFieldEntries,
    missingFields,
    clinicianFlags,
    completionStatus,
    buildClinicianSummary,
    buildNurseChecklist,
    buildVisitPacket,
    visitPacketToText,
    sourceForField,
    sourceAttributionSummary,
    summaryToText
  };
});
