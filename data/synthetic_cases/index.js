(function attachCases(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.UrologyCasesData = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function casesFactory() {
  const SYNTHETIC_CASES = [
    {
      id: "synthetic-frequency-older-adult",
      label: "Synthetic case: frequent urination at night",
      shortLabel: "晚上常起床尿尿",
      meta: "會啟動夜尿/急尿補問",
      answers: {
        filledBy: "Patient self-filled",
        chiefConcern: "Frequency / nocturia / urgency",
        duration: "More than 1 month",
        botherScore: "7",
        daytimeFrequencyChange: "Yes",
        nocturiaCount: "3 or more times",
        urgency: "Yes",
        leakage: "No",
        painBurning: "No",
        visibleBlood: "No",
        unableToUrinate: "No",
        systemicSymptoms: ["None of these"],
        medicationListStatus: "Partial list only",
        daytimeFrequencyCount: "9 to 12 times",
        urgencyFrequency: "Most days",
        fluidCaffeineContext: ["Caffeinated drinks most days", "Drinks a lot near bedtime"],
        bladderDiaryFeasible: "Yes, with written instructions",
        medicationAssist: "Yes",
        relevantComorbidities: ["Not sure"],
        diureticAnticoagulantAwareness: "Not sure",
        language: "Mandarin with Taiwanese preferred",
        deviceComfort: "Needs large buttons",
        supportPreference: "Needs staff help",
        notes: "Patient worries about waking up repeatedly at night."
      }
    },
    {
      id: "synthetic-emptying-difficulty",
      label: "Synthetic case: difficulty emptying bladder",
      shortLabel: "尿不太出來",
      meta: "會啟動排尿困難補問",
      answers: {
        filledBy: "Family helped operate; patient answered",
        chiefConcern: "Difficulty emptying or weak stream",
        duration: "1 to 4 weeks",
        botherScore: "8",
        daytimeFrequencyChange: "No",
        nocturiaCount: "1 time",
        urgency: "No",
        leakage: "No",
        painBurning: "No",
        visibleBlood: "No",
        unableToUrinate: "Yes",
        currentlyUnableToUrinate: "No",
        systemicSymptoms: ["None of these"],
        medicationListStatus: "Not sure",
        weakStream: "Yes",
        straining: "Yes",
        intermittency: "Yes",
        incompleteEmptying: "Yes",
        medicationAssist: "Yes",
        relevantComorbidities: ["Not sure"],
        diureticAnticoagulantAwareness: "Not sure",
        language: "Mandarin",
        deviceComfort: "Can use phone with help",
        supportPreference: "Family-assisted mode",
        notes: "Patient says flow is weak and sometimes cannot start."
      }
    },
    {
      id: "synthetic-incomplete-leakage",
      label: "Synthetic case: incomplete leakage intake",
      shortLabel: "漏尿但資料不完整",
      meta: "會示範自動找缺漏",
      answers: {
        filledBy: "Family or helper-assisted",
        chiefConcern: "Leakage",
        duration: "",
        botherScore: "4",
        daytimeFrequencyChange: "",
        nocturiaCount: "Not sure",
        urgency: "Not sure",
        leakage: "Yes",
        painBurning: "",
        visibleBlood: "No",
        unableToUrinate: "No",
        systemicSymptoms: [],
        medicationListStatus: "",
        leakageFrequency: "Weekly",
        leakageAmount: "",
        leakageTriggers: ["Before reaching toilet"],
        containmentProducts: "Pads or liners",
        language: "Taiwanese",
        deviceComfort: "Prefer staff help",
        supportPreference: "Family-assisted mode",
        notes: "Helper says the patient is embarrassed to discuss leakage."
      }
    },
    {
      id: "synthetic-recurrent-infection-context",
      label: "Synthetic case: recurrent infection context",
      shortLabel: "Recurrent infection context",
      meta: "Pain/infection module, medication cue",
      answers: {
        filledBy: "Patient self-filled",
        chiefConcern: "Recurrent infection concern",
        duration: "More than 1 month",
        botherScore: "6",
        daytimeFrequencyChange: "Yes",
        nocturiaCount: "1 time",
        urgency: "Yes",
        leakage: "No",
        painBurning: "Yes",
        visibleBlood: "No",
        unableToUrinate: "No",
        systemicSymptoms: ["None of these"],
        medicationListStatus: "Can provide list",
        daytimeFrequencyCount: "5 to 8 times",
        urgencyFrequency: "Some days",
        fluidCaffeineContext: ["None of these"],
        bladderDiaryFeasible: "Only with staff or family help",
        painFrequency: "Only while urinating",
        infectionEpisodeHistory: "Yes, more than once",
        medicationAssist: "No",
        relevantComorbidities: ["Diabetes"],
        diureticAnticoagulantAwareness: "No",
        language: "Mandarin",
        deviceComfort: "Comfortable",
        supportPreference: "Self-filled",
        notes: "Patient reports repeated similar episodes and wants the physician to know the pattern."
      }
    },
    {
      id: "synthetic-hematuria-occult-blood",
      label: "Synthetic case: visible blood / health-check occult blood",
      shortLabel: "血尿或健檢潛血",
      meta: "會啟動血尿/健檢潛血 review flow",
      answers: {
        filledBy: "Patient self-filled",
        chiefConcern: "Visible blood or health-check occult blood",
        duration: "Within 1 week",
        botherScore: "5",
        daytimeFrequencyChange: "No",
        nocturiaCount: "1 time",
        urgency: "No",
        leakage: "No",
        painBurning: "No",
        visibleBlood: "Yes",
        unableToUrinate: "No",
        systemicSymptoms: ["None of these"],
        medicationListStatus: "Can provide list",
        hematuriaPattern: "One recent episode; health-check urine test also mentioned occult blood",
        bloodClots: "No",
        hematuriaCoSymptoms: ["No pain or burning", "No fever or chills"],
        medicationAssist: "No",
        relevantComorbidities: ["Not sure"],
        diureticAnticoagulantAwareness: "Not sure",
        language: "Mandarin",
        deviceComfort: "Comfortable",
        supportPreference: "Self-filled",
        notes: "Patient wants to ask whether the visible color change and health-check result should be reviewed together.",
        sourceByField: {
          filledBy: "declared_on_entry",
          chiefConcern: "patient_self",
          visibleBlood: "patient_self",
          hematuriaPattern: "patient_self",
          bloodClots: "patient_self",
          medicationListStatus: "patient_self"
        }
      }
    }
  ];

  function findCase(id) {
    return SYNTHETIC_CASES.find((sampleCase) => sampleCase.id === id) || SYNTHETIC_CASES[0];
  }

  return {
    SYNTHETIC_CASES,
    findCase
  };
});
