(function attachRoleTransform(root, factory) {
  const deps = typeof module === "object" && module.exports
    ? {
        attribution: require("../attribution"),
        missingFields: require("../missing_fields"),
        summary: require("../summary"),
        safety: require("../safety")
      }
    : {
        attribution: root.UrologyAttribution,
        missingFields: root.UrologyMissingFields,
        summary: root.UrologySummaryCore,
        safety: root.UrologySafety
      };
  const api = factory(deps);
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.UrologyRoleTransform = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function roleTransformFactory({ attribution, missingFields, summary, safety }) {
  const {
    fieldSourceEntries,
    sourceAttributionSummary,
    sourceNotes,
    attributionBlock,
    answer
  } = attribution;

  const {
    activeModules,
    missingFieldEntries,
    completionStatus,
    supplementalPrompt
  } = missingFields;

  const {
    buildClinicianSummary,
    clinicianFlags,
    medicineContext
  } = summary;

  const {
    SAFETY_NOTICE,
    assertSafeLanguage,
    withSafetyEnvelope
  } = safety;

  const DECISIONS = ["continue", "revise", "stop"];

  const SIGNAL_LABELS = {
    workflowPain: "重複詢問痛點",
    summaryUsefulness: "摘要可用性",
    staffBurden: "人員負擔",
    patientFit: "病人或協助填答可行性",
    safetyBoundary: "安全邊界",
    workflowSlot: "流程位置",
    existingProcess: "既有流程"
  };

  const REVIEW_VALUE_LABELS = {
    continue: "繼續",
    revise: "修正",
    stop: "停止",
    unknown: "未填",
    supporting: "支持",
    blocking: "阻擋",
    uncertain: "不明確",
    clear: "明確",
    mixed: "混合或不明確",
    no: "沒有",
    "would-read": "看診時會讀",
    "needs-rewrite": "方向有用，但格式需重寫",
    "needs-wording": "需要改文字",
    exists: "有實際流程位置",
    none: "沒有流程位置",
    acceptable: "可接受",
    unacceptable: "不可接受",
    "self-filled": "自行填答可行",
    "assisted-only": "僅適合協助填答",
    unrealistic: "填答不實際",
    "not-sufficient": "既有流程仍有缺口",
    sufficient: "既有流程可能已足夠",
    Physician: "醫師",
    Nurse: "護理人員",
    "Patient advocate": "病人代表",
    "Product / workflow reviewer": "產品/流程審閱者",
    "Governance reviewer": "治理審閱者",
    Other: "其他",
    "Question tree revision": "題目流程修正版",
    "One-page summary revision": "單頁摘要修正版",
    "Workflow evidence memo": "流程證據備忘錄",
    "Stop memo with removed assumptions": "停止備忘錄與假設移除紀錄"
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

  function displayReviewValue(value) {
    return REVIEW_VALUE_LABELS[value] || value;
  }

  function buildNurseChecklist(answers) {
    const safeAnswers = answers || {};
    const missing = missingFieldEntries(safeAnswers).map(([field, label]) => supplementalPrompt(field, label));
    const flags = clinicianFlags(safeAnswers);
    const checklist = withSafetyEnvelope({
      completionStatus: completionStatus(safeAnswers),
      activeModules: Object.entries(activeModules(safeAnswers))
        .filter(([, active]) => active)
        .map(([name]) => name),
      supplementalQuestions: missing,
      sourceNotes: sourceNotes(safeAnswers),
      workflowCues: summary.nurseCues(safeAnswers),
      priorityReviewFlags: flags.length ? flags : [summary.NEUTRAL_EMPTY_FLAG],
      fieldSources: fieldSourceEntries(safeAnswers),
      sourceAttributionSummary: sourceAttributionSummary(safeAnswers),
      attribution: attributionBlock(safeAnswers),
      rawAnswers: Object.assign({}, safeAnswers)
    });
    assertSafeLanguage(checklist, "nurse checklist");
    return checklist;
  }

  function buildVisitPacket(answers) {
    const safeAnswers = answers || {};
    const clinicianSummary = buildClinicianSummary(safeAnswers);
    const nurseChecklist = buildNurseChecklist(safeAnswers);
    const packet = withSafetyEnvelope({
      title: "泌尿科看診前分角色資料包",
      patientPage: {
        title: "病人與家屬確認頁",
        audience: "patient-family",
        rows: [
          ["填答來源", clinicianSummary.intakeMode],
          ["主訴", clinicianSummary.chiefConcern],
          ["病程 / 困擾", clinicianSummary.durationBother],
          ["用藥資料準備", medicineContext(safeAnswers)],
          ["補充說明", clinicianSummary.patientNote]
        ],
        missingInformation: clinicianSummary.missingInformation,
        sourceNotes: clinicianSummary.sourceNotes
      },
      nursePage: {
        title: "護理缺漏補問頁",
        audience: "nurse",
        completionStatus: nurseChecklist.completionStatus,
        supplementalQuestions: nurseChecklist.supplementalQuestions,
        workflowCues: nurseChecklist.workflowCues,
        sourceNotes: nurseChecklist.sourceNotes,
        priorityReviewFlags: nurseChecklist.priorityReviewFlags
      },
      clinicianPage: {
        title: "醫師看診前掃描頁",
        audience: "clinician",
        rows: [
          ["填答來源", clinicianSummary.intakeMode],
          ["主訴", clinicianSummary.chiefConcern],
          ["啟動模組", clinicianSummary.activeModules.map((module) => MODULE_LABELS[module] || module).join("、")],
          ["病程 / 困擾", clinicianSummary.durationBother],
          ["病人回報型態", clinicianSummary.symptomPattern],
          ["用藥 / 背景", clinicianSummary.medicines],
          ["病人補充", clinicianSummary.patientNote]
        ],
        priorityReviewFlags: clinicianSummary.clinicianReviewFlags,
        missingInformation: clinicianSummary.missingInformation,
        sourceAttributionSummary: clinicianSummary.sourceAttributionSummary,
        fieldSources: clinicianSummary.fieldSources
      },
      attribution: attributionBlock(safeAnswers),
      rawAnswers: Object.assign({}, safeAnswers)
    });
    assertSafeLanguage(packet, "visit packet");
    return packet;
  }

  function visitPacketToText(packet) {
    const text = [
      packet.title,
      "",
      "安全邊界：",
      ...packet.safetyNotice.map((item) => `- ${item}`),
      `- ${packet.reviewRequiredLabel}`,
      "",
      `[${packet.patientPage.title}]`,
      ...packet.patientPage.rows.map(([label, value]) => `${label}：${value}`),
      "缺漏或不確定資訊：",
      ...packet.patientPage.missingInformation.map((item) => `- ${item}`),
      "",
      `[${packet.nursePage.title}]`,
      `完成度：${packet.nursePage.completionStatus.label}`,
      "補問題：",
      ...packet.nursePage.supplementalQuestions.map((item) => `- ${item.ask}`),
      "工作提醒：",
      ...packet.nursePage.workflowCues.map((item) => `- ${item}`),
      "",
      `[${packet.clinicianPage.title}]`,
      ...packet.clinicianPage.rows.map(([label, value]) => `${label}：${value}`),
      "需現場確認的病人回報：",
      ...packet.clinicianPage.priorityReviewFlags.map((item) => `- ${item}`),
      "答案來源分布：",
      ...packet.clinicianPage.sourceAttributionSummary.map((item) => `- ${item}`)
    ].join("\n");
    assertSafeLanguage(text, "visit packet text");
    return text;
  }

  function buildCanonicalRecord(answers) {
    const safeAnswers = answers || {};
    const derivedSummary = buildClinicianSummary(safeAnswers);
    return {
      patient_input: Object.assign({}, safeAnswers),
      derived_summary: derivedSummary,
      missing_fields: missingFieldEntries(safeAnswers).map(([field, label]) => ({ field, label })),
      attribution: attributionBlock(safeAnswers),
      audit_trace: [
        {
          event: "patient_input_received",
          source: "synthetic_or_local_storage",
          fields_present: Object.keys(safeAnswers).filter((field) => field !== "sourceByField")
        },
        {
          event: "summary_generated",
          source: "core/summary",
          requires_physician_review: true
        },
        {
          event: "missing_fields_detected",
          source: "core/missing_fields",
          missing_count: missingFieldEntries(safeAnswers).length
        },
        {
          event: "source_attribution_applied",
          source: "core/attribution",
          attributed_field_count: fieldSourceEntries(safeAnswers).length
        },
        {
          event: "safety_checked",
          source: "core/safety",
          no_diagnosis_or_treatment_claims: true
        }
      ]
    };
  }

  function transformForRole(recordOrAnswers, role) {
    const answers = recordOrAnswers && recordOrAnswers.patient_input
      ? recordOrAnswers.patient_input
      : recordOrAnswers;
    if (role === "patient") {
      const clinicianSummary = buildClinicianSummary(answers);
      return {
        role: "patient",
        source: "patient_input",
        view: {
          intakeMode: clinicianSummary.intakeMode,
          chiefConcern: clinicianSummary.chiefConcern,
          durationBother: clinicianSummary.durationBother,
          missingInformation: clinicianSummary.missingInformation,
          sourceNotes: clinicianSummary.sourceNotes
        }
      };
    }
    if (role === "nurse") {
      return {
        role: "nurse",
        source: "patient_input",
        view: buildNurseChecklist(answers)
      };
    }
    if (role === "clinician") {
      return {
        role: "clinician",
        source: "patient_input",
        view: buildClinicianSummary(answers)
      };
    }
    if (role === "reviewer") {
      return {
        role: "reviewer",
        source: "canonical_record",
        view: {
          decision_question: "請依證據判斷此流程要繼續、修正或停止。",
          canonical_record: buildCanonicalRecord(answers)
        }
      };
    }
    throw new Error(`Unknown role: ${role}`);
  }

  function text(value) {
    if (typeof value !== "string") return "";
    return value.trim();
  }

  function normalizeDecision(value) {
    const decision = text(value).toLowerCase();
    return DECISIONS.includes(decision) ? decision : "";
  }

  function signalStatus(field, value) {
    const normalized = text(value);
    if (!normalized) return "unknown";
    const positive = new Set([
      "clear",
      "would-read",
      "acceptable",
      "self-filled",
      "mixed",
      "assisted-only",
      "exists",
      "not-sufficient"
    ]);
    const negative = new Set(["no", "unacceptable", "unrealistic", "none", "sufficient"]);
    if (positive.has(normalized)) return "supporting";
    if (negative.has(normalized)) return "blocking";
    return "uncertain";
  }

  function blockingSignals(inputs) {
    const blockers = [];
    if (text(inputs.safetyBoundary) === "unacceptable") blockers.push("安全邊界不可接受。");
    if (text(inputs.workflowSlot) === "none") blockers.push("目前沒有可落地的流程位置。");
    if (text(inputs.summaryUsefulness) === "no") blockers.push("醫師不會閱讀這份摘要。");
    if (text(inputs.staffBurden) === "unacceptable") blockers.push("人員負擔不可接受。");
    if (text(inputs.patientFit) === "unrealistic") blockers.push("病人或協助填答不實際。");
    if (text(inputs.existingProcess) === "sufficient") blockers.push("既有流程可能已經足夠。");
    return blockers;
  }

  function suggestedDecision(inputs) {
    const blockers = blockingSignals(inputs);
    if (blockers.length) return "stop";
    if (text(inputs.workflowPain) !== "clear" || text(inputs.workflowSlot) === "unclear") return "revise";
    if (text(inputs.patientFit) === "assisted-only") return "revise";
    if (text(inputs.summaryUsefulness) === "needs-rewrite" || text(inputs.safetyBoundary) === "needs-wording") {
      return "revise";
    }
    if (text(inputs.workflowPain) === "clear" && text(inputs.summaryUsefulness) === "would-read") {
      return "continue";
    }
    return "revise";
  }

  function evidenceRows(inputs) {
    return Object.keys(SIGNAL_LABELS).map((field) => ({
      field,
      label: SIGNAL_LABELS[field],
      value: text(inputs[field]) || "unknown",
      status: signalStatus(field, inputs[field])
    }));
  }

  function buildReviewRecord(inputs) {
    const safeInputs = inputs || {};
    const decision = normalizeDecision(safeInputs.decision);
    const suggestion = suggestedDecision(safeInputs);
    const blockers = blockingSignals(safeInputs);
    const record = withSafetyEnvelope({
      decision: decision || suggestion,
      reviewerDecision: decision,
      suggestedDecision: suggestion,
      reviewerRole: displayReviewValue(text(safeInputs.reviewerRole)) || "未記錄",
      blockers,
      evidence: evidenceRows(safeInputs),
      meetingEvidence: [
        ["最有用的摘要句", text(safeInputs.mostUsefulLine) || "未記錄"],
        ["最吵或風險最高的句子", text(safeInputs.noisiestLine) || "未記錄"],
        ["重要但缺少的資訊", text(safeInputs.missingInformation) || "未記錄"],
        ["不安全或易誤導文字", text(safeInputs.unsafeWording) || "未記錄"],
        ["預期流程位置", text(safeInputs.expectedWorkflowSlot) || "未記錄"],
        ["人員負擔疑慮", text(safeInputs.staffBurdenConcern) || "未記錄"],
        ["案例層級證據", text(safeInputs.caseEvidence) || "未記錄"]
      ],
      nextArtifact: displayReviewValue(text(safeInputs.nextArtifact)) || "未選擇",
      reviewerNotes: text(safeInputs.reviewerNotes) || "沒有審閱備註。",
      productQuestion: "真實診間是否會採用此流程，因為它改善看診準備且沒有增加不可接受的負擔？",
      safetyBoundary: [
        "不做診斷。",
        "不做分流。",
        "不提供治療建議。",
        "探索階段不使用真實病人資料。",
        "仍需醫療人員確認。"
      ]
    });
    assertSafeLanguage(record, "review record");
    return record;
  }

  function reviewRecordToText(record) {
    const output = [
      "泌尿科看診前示範審閱紀錄",
      "",
      `審閱角色：${record.reviewerRole}`,
      `審閱者選擇：${record.reviewerDecision ? displayReviewValue(record.reviewerDecision) : "未明確選擇"}`,
      `決策建議：${displayReviewValue(record.suggestedDecision)}`,
      `紀錄決策：${displayReviewValue(record.decision)}`,
      `下一個產物：${record.nextArtifact}`,
      "",
      "證據訊號：",
      ...record.evidence.map((item) => `- ${item.label}：${displayReviewValue(item.value)}（${displayReviewValue(item.status)}）`),
      "",
      "會議證據：",
      ...record.meetingEvidence.map(([label, value]) => `- ${label}：${value}`),
      "",
      "阻擋因素：",
      ...(record.blockers.length ? record.blockers.map((item) => `- ${item}`) : ["- 目前沒有硬性阻擋因素。"]),
      "",
      "安全邊界：",
      ...record.safetyBoundary.map((item) => `- ${item}`),
      "",
      "審閱備註：",
      record.reviewerNotes
    ].join("\n");
    assertSafeLanguage(output, "review text");
    return output;
  }

  return {
    SAFETY_NOTICE,
    DECISIONS,
    SIGNAL_LABELS,
    buildNurseChecklist,
    buildVisitPacket,
    visitPacketToText,
    buildCanonicalRecord,
    transformForRole,
    blockingSignals,
    suggestedDecision,
    buildReviewRecord,
    reviewRecordToText
  };
});
