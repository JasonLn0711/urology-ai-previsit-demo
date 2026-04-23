(function attachAttribution(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.UrologyAttribution = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function attributionFactory() {
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
    if (field === "filledBy" && hasValue(answers && answers.filledBy)) return "declared_on_entry";
    return hasValue(answers && answers[field]) ? inferSourceFromMode(answers && answers.filledBy) : "unknown";
  }

  function sourceLabel(source) {
    return SOURCE_LABELS[source] || SOURCE_LABELS.unknown;
  }

  function fieldSourceEntries(answers) {
    return Object.keys(answers || {})
      .filter((field) => field !== "sourceByField" && hasValue(answers[field]))
      .map((field) => {
        const source = sourceForField(answers, field);
        return {
          field,
          source,
          label: sourceLabel(source)
        };
      });
  }

  function sourceAttributionSummary(answers) {
    const counts = fieldSourceEntries(answers).reduce((acc, item) => {
      acc[item.source] = (acc[item.source] || 0) + 1;
      return acc;
    }, {});
    const lines = Object.entries(counts).map(([source, count]) => `${sourceLabel(source)}: ${count}`);
    return lines.length ? lines : ["No answered fields with source attribution."];
  }

  function sourceNotes(answers) {
    const source = answer(answers && answers.filledBy);
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

  function attributionBlock(answers) {
    return {
      field_sources: fieldSourceEntries(answers),
      source_summary: sourceAttributionSummary(answers),
      source_notes: sourceNotes(answers)
    };
  }

  return {
    SOURCE_LABELS,
    answer,
    lower,
    listValue,
    hasValue,
    sourceForField,
    sourceLabel,
    fieldSourceEntries,
    sourceAttributionSummary,
    sourceNotes,
    attributionBlock
  };
});
