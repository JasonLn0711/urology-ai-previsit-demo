(function attachMissingFields(root, factory) {
  const deps = typeof module === "object" && module.exports
    ? { attribution: require("../attribution") }
    : { attribution: root.UrologyAttribution };
  const api = factory(deps);
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.UrologyMissingFields = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function missingFieldsFactory({ attribution }) {
  const {
    answer,
    lower,
    listValue,
    hasValue
  } = attribution;

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
      why: "病程可協助描述新近、反覆或長期問題。"
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
    fluidCaffeineContext: {
      ask: "是否常喝咖啡、茶、睡前喝較多水，或作息不固定？",
      why: "只記錄可能相關的生活背景，不做病因判斷。"
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
    },
    relevantComorbidities: {
      ask: "是否有想讓醫師知道的糖尿病、腎臟病、神經或脊髓相關病史？",
      why: "只記錄病人回報的背景資訊。"
    },
    diureticAnticoagulantAwareness: {
      ask: "是否知道自己有沒有使用利尿劑或抗凝血相關藥物？",
      why: "不要求病人判斷藥物，僅協助現場確認。"
    }
  };

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

  function hasConcern(answers, fragment) {
    return lower(answers && answers.chiefConcern).includes(fragment);
  }

  function activeModules(answers) {
    const systemic = listValue(answers && answers.systemicSymptoms).join(" ").toLowerCase();
    const medicationStatus = lower(answers && answers.medicationListStatus);
    const storage =
      hasConcern(answers, "frequency") ||
      hasConcern(answers, "nocturia") ||
      hasConcern(answers, "urgency") ||
      isYes(answers && answers.daytimeFrequencyChange) ||
      isYes(answers && answers.urgency) ||
      ["2 times", "3 or more"].some((item) => lower(answers && answers.nocturiaCount).includes(item));
    const leakage = hasConcern(answers, "leakage") || isYes(answers && answers.leakage);
    const voiding =
      hasConcern(answers, "emptying") ||
      hasConcern(answers, "weak stream") ||
      isYes(answers && answers.unableToUrinate);
    const hematuria =
      hasConcern(answers, "visible blood") ||
      hasConcern(answers, "clots") ||
      isYes(answers && answers.visibleBlood);
    const pain =
      hasConcern(answers, "pain") ||
      hasConcern(answers, "burning") ||
      hasConcern(answers, "infection") ||
      isYes(answers && answers.painBurning) ||
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
    const modules = activeModules(answers || {});

    if (isYes(answers && answers.unableToUrinate)) {
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
      if (containsValue(answers && answers.systemicSymptoms, "side or back pain")) {
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
    return requiredFieldsForAnswers(answers || {}).filter(([field]) => !hasValue(answers && answers[field]));
  }

  function missingFields(answers) {
    return missingFieldEntries(answers).map(([, label]) => label);
  }

  function completionStatus(answers) {
    const required = requiredFieldsForAnswers(answers || {});
    const missing = missingFieldEntries(answers || {});
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

  return {
    REQUIRED_FIELDS: CORE_REQUIRED_FIELDS,
    SUPPLEMENTAL_PROMPTS,
    activeModules,
    requiredFieldsForAnswers,
    missingFieldEntries,
    missingFields,
    completionStatus,
    supplementalPrompt,
    isYes,
    isNotSure,
    containsValue
  };
});
