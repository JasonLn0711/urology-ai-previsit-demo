(function attachCases(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.UrologyCases = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function casesFactory() {
  const SYNTHETIC_CASES = [
    {
      id: "synthetic-frequency-older-adult",
      label: "Synthetic case: frequent urination at night",
      shortLabel: "Frequent urination at night",
      meta: "Storage module, diary cue",
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
        supportPreference: "Needs review before clinician enters",
        notes: "Patient worries about waking up repeatedly at night."
      }
    },
    {
      id: "synthetic-emptying-difficulty",
      label: "Synthetic case: difficulty emptying bladder",
      shortLabel: "Difficulty emptying",
      meta: "Voiding module, review flag",
      answers: {
        filledBy: "Nurse-assisted",
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
        supportPreference: "Nurse-assisted mode",
        notes: "Patient says flow is weak and sometimes cannot start."
      }
    },
    {
      id: "synthetic-incomplete-leakage",
      label: "Synthetic case: incomplete leakage intake",
      shortLabel: "Incomplete leakage intake",
      meta: "Shows missing-info repair",
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
