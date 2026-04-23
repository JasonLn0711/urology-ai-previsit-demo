(function attachIntakeRecordSchema(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.UrologyIntakeRecordSchema = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function intakeRecordSchemaFactory() {
  const REQUIRED_TOP_LEVEL_FIELDS = [
    "patient_input",
    "derived_summary",
    "missing_fields",
    "attribution",
    "audit_trace"
  ];

  function isPlainObject(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
  }

  function validateIntakeRecord(record) {
    const errors = [];
    if (!isPlainObject(record)) {
      return {
        valid: false,
        errors: ["record must be an object"]
      };
    }

    for (const field of REQUIRED_TOP_LEVEL_FIELDS) {
      if (!(field in record)) errors.push(`missing top-level field: ${field}`);
    }

    if ("patient_input" in record && !isPlainObject(record.patient_input)) {
      errors.push("patient_input must be an object");
    }
    if ("derived_summary" in record && !isPlainObject(record.derived_summary)) {
      errors.push("derived_summary must be an object");
    }
    if ("missing_fields" in record && !Array.isArray(record.missing_fields)) {
      errors.push("missing_fields must be an array");
    }
    if ("attribution" in record && !isPlainObject(record.attribution)) {
      errors.push("attribution must be an object");
    }
    if ("audit_trace" in record && !Array.isArray(record.audit_trace)) {
      errors.push("audit_trace must be an array");
    }

    if (record.derived_summary && record.derived_summary.requiresPhysicianReview !== true) {
      errors.push("derived_summary.requiresPhysicianReview must be true");
    }

    if (record.attribution && !Array.isArray(record.attribution.field_sources)) {
      errors.push("attribution.field_sources must be an array");
    }

    if (Array.isArray(record.audit_trace)) {
      record.audit_trace.forEach((entry, index) => {
        if (!isPlainObject(entry)) {
          errors.push(`audit_trace[${index}] must be an object`);
        } else {
          if (!entry.event) errors.push(`audit_trace[${index}].event is required`);
          if (!entry.source) errors.push(`audit_trace[${index}].source is required`);
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  return {
    REQUIRED_TOP_LEVEL_FIELDS,
    validateIntakeRecord
  };
});
