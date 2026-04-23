const {
  activeModules,
  completionStatus,
  missingFieldEntries
} = window.UrologyPrevisit;
const { SYNTHETIC_CASES } = window.UrologyCases;

const STORAGE_KEY = "urologyPrevisitAnswers";
const UI_PREFS_KEY = "urologyPrevisitUiPrefs";

const ARRAY_FIELDS = new Set([
  "chiefConcern",
  "systemicSymptoms",
  "fluidCaffeineContext",
  "leakageTriggers",
  "hematuriaCoSymptoms",
  "relevantComorbidities"
]);

const EXCLUSIVE_CHECKBOX_VALUES = new Set(["None of these", "Not sure"]);

const ANSWER_FIELDS = [
  "filledBy",
  "chiefConcern",
  "duration",
  "botherScore",
  "daytimeFrequencyChange",
  "nocturiaCount",
  "urgency",
  "leakage",
  "painBurning",
  "visibleBlood",
  "unableToUrinate",
  "currentlyUnableToUrinate",
  "systemicSymptoms",
  "medicationListStatus",
  "daytimeFrequencyCount",
  "urgencyFrequency",
  "fluidCaffeineContext",
  "bladderDiaryFeasible",
  "leakageFrequency",
  "leakageAmount",
  "leakageTriggers",
  "containmentProducts",
  "weakStream",
  "straining",
  "intermittency",
  "incompleteEmptying",
  "hematuriaPattern",
  "bloodClots",
  "hematuriaCoSymptoms",
  "painFrequency",
  "infectionEpisodeHistory",
  "flankPainScore",
  "medicationAssist",
  "relevantComorbidities",
  "diureticAnticoagulantAwareness",
  "language",
  "deviceComfort",
  "supportPreference",
  "notes"
];

const FIELD_TO_STEP = {
  filledBy: 0,
  chiefConcern: 1,
  duration: 2,
  botherScore: 2,
  daytimeFrequencyChange: 2,
  nocturiaCount: 2,
  urgency: 2,
  leakage: 2,
  painBurning: 2,
  visibleBlood: 2,
  unableToUrinate: 2,
  currentlyUnableToUrinate: 2,
  systemicSymptoms: 2,
  medicationListStatus: 2,
  daytimeFrequencyCount: 3,
  urgencyFrequency: 3,
  fluidCaffeineContext: 3,
  bladderDiaryFeasible: 3,
  leakageFrequency: 3,
  leakageAmount: 3,
  leakageTriggers: 3,
  containmentProducts: 3,
  weakStream: 3,
  straining: 3,
  intermittency: 3,
  incompleteEmptying: 3,
  hematuriaPattern: 3,
  bloodClots: 3,
  hematuriaCoSymptoms: 3,
  painFrequency: 3,
  infectionEpisodeHistory: 3,
  flankPainScore: 3,
  medicationAssist: 3,
  relevantComorbidities: 3,
  diureticAnticoagulantAwareness: 3,
  language: 4,
  deviceComfort: 4,
  supportPreference: 4,
  notes: 4
};

const YES_NO_UNSURE = [
  ["No", "沒有"],
  ["Yes", "有"],
  ["Not sure", "不確定"]
];

const BOTHER_OPTIONS = [
  ["1", "1"],
  ["2", "2"],
  ["3", "3"],
  ["4", "4"],
  ["5", "5"],
  ["6", "6"],
  ["7", "7"],
  ["8", "8"],
  ["9", "9"],
  ["10", "10"],
  ["Not sure", "不確定"]
];

const MODULE_LABELS = {
  storage: "頻尿、夜尿、急尿",
  leakage: "漏尿",
  voiding: "排尿困難",
  hematuria: "看得到的血尿或血塊",
  pain: "疼痛或發燒相關",
  medication: "用藥需要補充"
};

const SOURCE_LABELS = {
  declared_on_entry: "填答開始時標記",
  patient_self: "本人回答",
  patient_with_family_operator: "本人回答，家人協助操作",
  family_observation: "家屬觀察",
  nurse_supplement: "現場補問",
  unknown: "未標記"
};

const VALUE_LABELS = {
  "Patient self-filled": "我自己回答",
  "Family helped operate; patient answered": "家人幫忙操作，我自己回答",
  "Family or helper-assisted": "家人依平常觀察協助回答",
  "Frequency / nocturia / urgency": "尿很頻繁、晚上常起床尿尿、突然很急",
  Leakage: "尿不小心漏出來",
  "Difficulty emptying or weak stream": "尿不太出來、尿流變弱、尿不乾淨",
  "Pain, burning, or possible infection": "尿尿會痛、刺痛或灼熱",
  "Visible blood or clots": "看到紅色或茶色尿、或看到血塊",
  "Other urinary concern": "其他泌尿問題",
  Today: "今天",
  "1 to 7 days": "1 到 7 天內",
  "1 to 4 weeks": "1 到 4 週",
  "More than 1 month": "超過 1 個月",
  No: "沒有",
  Yes: "有",
  "Not sure": "不確定",
  "0 times": "0 次",
  "1 time": "1 次",
  "2 times": "2 次",
  "3 or more times": "3 次以上",
  Fever: "發燒",
  Chills: "發冷",
  "Side or back pain": "腰部兩側痛",
  "None of these": "以上都沒有",
  "Can provide list": "可以提供藥單或藥袋",
  "Partial list only": "只記得一部分",
  "No regular medicines": "沒有固定用藥",
  "1 to 4 times": "1 到 4 次",
  "5 to 8 times": "5 到 8 次",
  "9 to 12 times": "9 到 12 次",
  "More than 12 times": "超過 12 次",
  Rarely: "很少",
  "Some days": "有些天會",
  "Most days": "大多數日子會",
  "Several times a day": "一天好幾次",
  "Caffeinated drinks most days": "常喝咖啡、茶或含咖啡因飲料",
  "Drinks a lot near bedtime": "睡前常喝比較多水",
  "Night shift or poor sleep": "作息不固定或睡不好",
  "Yes, with written instructions": "可以，但需要清楚說明",
  "Only with staff or family help": "需要家人或現場人員協助",
  "Less than once a week": "少於每週一次",
  Weekly: "每週會發生",
  Daily: "每天會發生",
  "A few drops": "幾滴",
  "Small amount": "少量",
  "Moderate amount": "會濕內褲或護墊",
  "Large amount": "量較多或需要換衣物",
  "Before reaching toilet": "來不及到廁所",
  "Coughing, laughing, or exercise": "咳嗽、笑、運動或搬重物時",
  "During sleep": "睡覺時",
  "Without warning": "沒有明顯原因",
  "No products used": "沒有使用",
  "Pads or liners": "護墊或襯墊",
  "Adult diapers": "成人紙尿褲",
  "Other product": "其他用品",
  "Prefer not to answer": "暫時不想回答",
  "One time": "一次",
  "More than once": "不只一次",
  "Every time recently": "最近幾乎每次都有",
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
  "Mandarin with Taiwanese preferred": "國語，可以搭配台語",
  English: "英文",
  Other: "其他",
  Comfortable: "可以自己操作",
  "Can use phone with help": "有人協助就可以",
  "Needs large buttons": "需要大按鈕、大字",
  "Prefer staff help": "希望到現場請人協助",
  "Self-filled": "自己填",
  "Family-assisted mode": "家人協助",
  "Needs staff help": "到現場請人員協助",
  "Prefer to talk in person": "想直接到現場用說的"
};

const PATIENT_MISSING_PROMPTS = {
  filledBy: ["先確認誰在回答", "這樣可以分清楚本人感受和家人觀察。"],
  chiefConcern: ["選一個今天最想先說的問題", "先抓主要困擾，後面才不會問太多不相關的問題。"],
  duration: ["補一下大約開始時間", "不知道精確日期也沒關係，選大概區間即可。"],
  botherScore: ["選一個困擾程度", "1 是很輕微，10 是非常困擾。"],
  daytimeFrequencyChange: ["白天尿尿次數有沒有變多？", "若不確定，可以選不確定。"],
  nocturiaCount: ["晚上睡著後通常起床尿尿幾次？", "只算睡著後又起床的次數。"],
  urgency: ["會不會突然很想尿、很難忍？", "用自己的感覺回答即可。"],
  leakage: ["最近 4 週有沒有尿不小心漏出來？", "這題可以先略過，現場再說也可以。"],
  painBurning: ["尿尿時會不會痛、刺痛或灼熱？", "這只是整理症狀，不是在判斷疾病。"],
  visibleBlood: ["有沒有看過紅色或茶色尿、或血塊？", "不確定也可以選不確定。"],
  unableToUrinate: ["有沒有想尿卻尿不出來？", "若正在發生，請到現場讓人員知道。"],
  currentlyUnableToUrinate: ["現在還有尿不出來嗎？", "這能幫助現場更快了解狀況。"],
  systemicSymptoms: ["最近有沒有發燒、發冷或腰側痛？", "以上都沒有也可以直接選。"],
  medicationListStatus: ["今天能不能提供藥袋或藥單？", "不用猜藥名，可以帶藥袋、藥單或照片。"],
  daytimeFrequencyCount: ["白天大約尿尿幾次？", "用區間回答即可，不用算得很精準。"],
  urgencyFrequency: ["突然急尿大約多常發生？", "選最接近的頻率即可。"],
  bladderDiaryFeasible: ["如果需要，能不能記幾天排尿狀況？", "這不是現在一定要做，只是先確認是否方便。"],
  leakageFrequency: ["漏尿大約多常發生？", "選最接近的頻率即可。"],
  leakageAmount: ["漏尿量大約多少？", "用幾滴、少量、會濕等方式回答即可。"],
  leakageTriggers: ["什麼情況比較容易漏尿？", "可以複選，也可以選不確定。"],
  containmentProducts: ["目前有沒有使用護墊、尿布或其他用品？", "不想回答可以選暫時不想回答。"],
  weakStream: ["尿流有沒有變細、變弱？", "用自己的觀察回答即可。"],
  straining: ["尿尿時是否常需要用力？", "若不確定，可以選不確定。"],
  intermittency: ["尿尿時會不會斷斷續續？", "用最近的經驗回答。"],
  incompleteEmptying: ["尿完後會不會覺得還沒尿乾淨？", "這只是感覺描述，不是檢查結果。"],
  hematuriaPattern: ["看到紅色或茶色尿是一次還是反覆？", "記不清楚可以選不確定。"],
  bloodClots: ["有沒有看到像血塊的東西？", "不確定也可以選不確定。"],
  painFrequency: ["疼痛或灼熱通常什麼時候發生？", "選最接近的情況即可。"],
  infectionEpisodeHistory: ["過去一年有沒有因類似症狀就醫或吃抗生素？", "不記得可以選不確定。"],
  flankPainScore: ["腰部兩側痛大約幾分？", "0 是不痛，10 是非常痛。"],
  medicationAssist: ["是否需要現場協助看藥袋或藥單？", "避免自己猜藥物類別。"]
};

const STEPS = [
  {
    id: "source",
    label: "誰回答",
    title: "先確認誰在回答",
    copy: "如果家人幫忙操作，請盡量讓長輩本人回答感受；家人可以補充平常看到的事。",
    type: "options",
    field: "filledBy",
    options: [
      ["Patient self-filled", "我自己回答", "我自己看題目、自己選答案。"],
      ["Family helped operate; patient answered", "家人幫忙操作，我自己回答", "家人幫忙按按鈕，但答案是我說的。"],
      ["Family or helper-assisted", "家人依觀察協助回答", "長輩不方便時，由家人先依平常觀察補充。"]
    ]
  },
  {
    id: "concern",
    label: "主要問題",
    title: "今天最想先說哪一些問題？",
    copy: "可以選一個，也可以選多個。選好後再按下一步，避免太早跳走。",
    type: "options",
    multiple: true,
    field: "chiefConcern",
    options: [
      ["Frequency / nocturia / urgency", "尿很頻繁、晚上常起床、突然很急", "例如白天一直跑廁所、晚上起床尿尿、很難忍。"],
      ["Leakage", "尿不小心漏出來", "例如來不及到廁所、咳嗽時漏尿、睡覺時漏尿。"],
      ["Difficulty emptying or weak stream", "尿不太出來、尿流變弱", "例如尿流變細、需要用力、尿完覺得不乾淨。"],
      ["Pain, burning, or possible infection", "尿尿會痛、刺痛或灼熱", "例如尿尿時不舒服，或伴隨發燒、發冷。"],
      ["Recurrent infection concern", "反覆出現類似感染症狀", "例如反覆因類似症狀就醫、吃抗生素，想讓醫師知道過去狀況。"],
      ["Visible blood or clots", "看到紅色或茶色尿、或血塊", "只問你看到的現象，不代表系統判斷原因。"],
      ["Other urinary concern", "其他泌尿問題", "可以在最後用自己的話補充。"]
    ]
  },
  {
    id: "core",
    label: "基本狀況",
    title: "先整理幾個基本狀況",
    copy: "這些問題會幫你把狀況說得更有條理。不確定時請直接選不確定。",
    type: "fields",
    fields: [
      {
        field: "duration",
        label: "這個問題大約從什麼時候開始？",
        type: "select",
        options: [
          ["Today", "今天"],
          ["1 to 7 days", "1 到 7 天內"],
          ["1 to 4 weeks", "1 到 4 週"],
          ["More than 1 month", "超過 1 個月"],
          ["Not sure", "很久但不確定"]
        ]
      },
      {
        field: "botherScore",
        label: "目前對生活造成多大困擾？",
        type: "scale",
        options: BOTHER_OPTIONS
      },
      {
        field: "daytimeFrequencyChange",
        label: "白天清醒時，尿尿次數有沒有明顯比以前多？",
        type: "select",
        options: YES_NO_UNSURE
      },
      {
        field: "nocturiaCount",
        label: "晚上睡著後，通常會起床尿尿幾次？",
        type: "select",
        options: [
          ["0 times", "0 次"],
          ["1 time", "1 次"],
          ["2 times", "2 次"],
          ["3 or more times", "3 次以上"],
          ["Not sure", "不確定"]
        ]
      },
      {
        field: "urgency",
        label: "會不會突然很想尿，而且很難忍住？",
        type: "select",
        options: YES_NO_UNSURE
      },
      {
        field: "leakage",
        label: "最近 4 週，有沒有尿不小心漏出來？",
        type: "select",
        options: YES_NO_UNSURE
      },
      {
        field: "painBurning",
        label: "尿尿時會不會痛、刺痛或灼熱？",
        type: "select",
        options: YES_NO_UNSURE
      },
      {
        field: "visibleBlood",
        label: "有沒有看過尿液變紅、茶色，或看到血塊？",
        type: "select",
        options: YES_NO_UNSURE
      },
      {
        field: "unableToUrinate",
        label: "有沒有很想尿，卻尿不太出來或完全尿不出來？",
        type: "select",
        options: YES_NO_UNSURE
      },
      {
        field: "currentlyUnableToUrinate",
        label: "現在是否還有尿不出來的情況？",
        type: "select",
        options: YES_NO_UNSURE,
        when: (currentAnswers) => currentAnswers.unableToUrinate === "Yes"
      },
      {
        field: "systemicSymptoms",
        label: "最近有沒有以下情況？",
        type: "checkboxes",
        options: [
          ["Fever", "發燒"],
          ["Chills", "發冷"],
          ["Side or back pain", "腰部兩側疼痛"],
          ["None of these", "以上都沒有"],
          ["Not sure", "不確定"]
        ]
      },
      {
        field: "medicationListStatus",
        label: "今天能不能提供目前正在吃的藥或藥單？",
        type: "select",
        options: [
          ["Can provide list", "可以提供藥單、藥袋或照片"],
          ["Partial list only", "只記得一部分"],
          ["Not sure", "不清楚"],
          ["No regular medicines", "沒有固定用藥"]
        ]
      }
    ]
  },
  {
    id: "modules",
    label: "補問",
    title: "根據前面答案，再補幾題",
    copy: "系統只顯示和你目前狀況有關的問題，避免一次問太多。",
    type: "modules"
  },
  {
    id: "support",
    label: "協助",
    title: "需要什麼協助？",
    copy: "這些答案只用來安排溝通方式與補充資料，不會拿來評價你會不會用手機或電腦。",
    type: "fields",
    fields: [
      {
        field: "language",
        label: "你比較習慣用哪種語言說明？",
        type: "select",
        options: [
          ["Mandarin", "國語"],
          ["Taiwanese", "台語"],
          ["Mandarin with Taiwanese preferred", "國語，可以搭配台語"],
          ["English", "英文"],
          ["Other", "其他"]
        ]
      },
      {
        field: "deviceComfort",
        label: "看螢幕或操作按鈕的狀況？",
        type: "select",
        options: [
          ["Comfortable", "可以自己操作"],
          ["Can use phone with help", "有人協助就可以"],
          ["Needs large buttons", "需要大字或大按鈕"],
          ["Prefer staff help", "希望到現場請人協助"]
        ]
      },
      {
        field: "supportPreference",
        label: "如果還有不清楚的地方，你希望怎麼補充？",
        type: "select",
        options: [
          ["Self-filled", "我可以自己補"],
          ["Family-assisted mode", "請家人協助補"],
          ["Needs staff help", "到現場請人員協助"],
          ["Prefer to talk in person", "我想直接到現場用說的"]
        ]
      },
      {
        field: "notes",
        label: "還有什麼想先補充？可以留空。",
        type: "textarea",
        placeholder: "例如：我最擔心晚上一直醒來，或不好意思在現場說漏尿的事。"
      }
    ]
  },
  {
    id: "repair",
    label: "補一下",
    title: "還有幾個地方可以補一下",
    copy: "系統會自動找出目前還缺的重點。能補就補，不確定也可以選不確定。",
    type: "repair"
  },
  {
    id: "review",
    label: "確認",
    title: "確認要交給門診團隊的內容",
    copy: "請確認這些內容是否符合你的意思；如果有選錯，可以回上一題修改。",
    type: "review"
  }
];

const MODULES = [
  {
    id: "storage",
    title: "尿很頻繁、夜尿或急尿",
    copy: "只補充大概頻率與是否方便記錄，不要求精準計算。",
    fields: [
      {
        field: "daytimeFrequencyCount",
        label: "白天清醒時，大約尿尿幾次？",
        type: "select",
        options: [
          ["1 to 4 times", "1 到 4 次"],
          ["5 to 8 times", "5 到 8 次"],
          ["9 to 12 times", "9 到 12 次"],
          ["More than 12 times", "超過 12 次"],
          ["Not sure", "不確定"]
        ]
      },
      {
        field: "urgencyFrequency",
        label: "突然很急、很難忍住的情況大約多常發生？",
        type: "select",
        options: [
          ["Rarely", "很少"],
          ["Some days", "有些天會"],
          ["Most days", "大多數日子會"],
          ["Several times a day", "一天好幾次"],
          ["Not sure", "不確定"]
        ]
      },
      {
        field: "fluidCaffeineContext",
        label: "下面哪些情況可能有關？",
        type: "checkboxes",
        options: [
          ["Caffeinated drinks most days", "常喝咖啡、茶或含咖啡因飲料"],
          ["Drinks a lot near bedtime", "睡前常喝比較多水"],
          ["Night shift or poor sleep", "作息不固定或睡不好"],
          ["None of these", "以上都沒有"],
          ["Not sure", "不確定"]
        ]
      },
      {
        field: "bladderDiaryFeasible",
        label: "如果需要，你是否方便記錄幾天尿尿時間、尿量或喝水？",
        type: "select",
        options: [
          ["Yes", "可以"],
          ["Yes, with written instructions", "可以，但需要清楚說明"],
          ["Only with staff or family help", "需要家人或現場人員協助"],
          ["No", "不方便"],
          ["Not sure", "不確定"]
        ]
      }
    ]
  },
  {
    id: "leakage",
    title: "尿不小心漏出來",
    copy: "用比較不尷尬的方式描述頻率、量和發生情境。",
    fields: [
      {
        field: "leakageFrequency",
        label: "最近 4 週，漏尿大約多常發生？",
        type: "select",
        options: [
          ["Less than once a week", "少於每週一次"],
          ["Weekly", "每週會發生"],
          ["Daily", "每天會發生"],
          ["Several times a day", "一天好幾次"],
          ["Not sure", "不確定"]
        ]
      },
      {
        field: "leakageAmount",
        label: "通常漏出來的量大約是多少？",
        type: "select",
        options: [
          ["A few drops", "幾滴"],
          ["Small amount", "少量"],
          ["Moderate amount", "會濕內褲或護墊"],
          ["Large amount", "量較多或需要更換衣物"],
          ["Not sure", "不確定"]
        ]
      },
      {
        field: "leakageTriggers",
        label: "什麼情況比較容易漏尿？",
        type: "checkboxes",
        options: [
          ["Before reaching toilet", "來不及到廁所"],
          ["Coughing, laughing, or exercise", "咳嗽、笑、運動或搬重物時"],
          ["During sleep", "睡覺時"],
          ["Without warning", "沒有明顯原因"],
          ["Not sure", "不確定"]
        ]
      },
      {
        field: "containmentProducts",
        label: "目前有沒有使用護墊、尿布或其他用品？",
        type: "select",
        options: [
          ["No products used", "沒有使用"],
          ["Pads or liners", "護墊或襯墊"],
          ["Adult diapers", "成人紙尿褲"],
          ["Other product", "其他用品"],
          ["Prefer not to answer", "暫時不想回答"],
          ["Not sure", "不確定"]
        ]
      }
    ]
  },
  {
    id: "voiding",
    title: "尿不太出來、尿流變弱",
    copy: "只問你感覺到的狀況，不要求你判斷原因。",
    fields: [
      {
        field: "weakStream",
        label: "尿流有沒有變細或變弱？",
        type: "select",
        options: YES_NO_UNSURE
      },
      {
        field: "straining",
        label: "尿尿時是否常需要用力才尿得出來？",
        type: "select",
        options: YES_NO_UNSURE
      },
      {
        field: "intermittency",
        label: "尿尿時會不會斷斷續續？",
        type: "select",
        options: YES_NO_UNSURE
      },
      {
        field: "incompleteEmptying",
        label: "尿完後，會不會常覺得還沒尿乾淨？",
        type: "select",
        options: YES_NO_UNSURE
      }
    ]
  },
  {
    id: "hematuria",
    title: "看到紅色或茶色尿、或血塊",
    copy: "只記錄你看到的現象，不判斷原因。",
    fields: [
      {
        field: "hematuriaPattern",
        label: "看到紅色或茶色尿是一次、反覆，還是最近幾乎每次都有？",
        type: "select",
        options: [
          ["One time", "一次"],
          ["More than once", "不只一次"],
          ["Every time recently", "最近幾乎每次都有"],
          ["Not sure", "不確定"]
        ]
      },
      {
        field: "bloodClots",
        label: "有沒有看到像血塊的東西？",
        type: "select",
        options: YES_NO_UNSURE
      },
      {
        field: "hematuriaCoSymptoms",
        label: "同時有沒有下面情況？",
        type: "checkboxes",
        options: [
          ["Pain or burning", "疼痛或灼熱"],
          ["Fever or chills", "發燒或發冷"],
          ["Side or back pain", "腰部兩側痛"],
          ["None of these", "以上都沒有"],
          ["Not sure", "不確定"]
        ]
      }
    ]
  },
  {
    id: "pain",
    title: "疼痛、灼熱或發燒相關",
    copy: "整理不舒服的時間與過去類似情況，不做疾病判斷。",
    fields: [
      {
        field: "painFrequency",
        label: "疼痛或灼熱通常什麼時候發生？",
        type: "select",
        options: [
          ["Only while urinating", "尿尿時"],
          ["After urinating", "尿完後"],
          ["Most of the day", "一天中大多時間"],
          ["Comes and goes", "有時有、有時沒有"],
          ["Not sure", "不確定"]
        ]
      },
      {
        field: "infectionEpisodeHistory",
        label: "過去 12 個月，有沒有因類似尿痛、頻尿或急尿就醫或吃抗生素？",
        type: "select",
        options: [
          ["No", "沒有"],
          ["Yes, once", "有，1 次"],
          ["Yes, more than once", "有，超過 1 次"],
          ["Not sure", "不確定"]
        ]
      },
      {
        field: "flankPainScore",
        label: "如果有腰部兩側疼痛，大約幾分？",
        type: "select",
        options: [
          ["0", "0 不痛"],
          ["1 to 3", "1 到 3 分"],
          ["4 to 6", "4 到 6 分"],
          ["7 to 10", "7 到 10 分"],
          ["Not sure", "不確定"]
        ],
        when: (currentAnswers) => Array.isArray(currentAnswers.systemicSymptoms) && currentAnswers.systemicSymptoms.includes("Side or back pain")
      }
    ]
  },
  {
    id: "medication",
    title: "用藥與身體背景",
    copy: "不需要背藥名；能提供藥袋、藥單或照片就很好。",
    fields: [
      {
        field: "medicationAssist",
        label: "是否需要現場人員協助確認藥袋、藥單或藥物照片？",
        type: "select",
        options: YES_NO_UNSURE
      },
      {
        field: "relevantComorbidities",
        label: "是否曾被告知有下面狀況？",
        type: "checkboxes",
        options: [
          ["Diabetes", "糖尿病"],
          ["Kidney disease", "腎臟病"],
          ["Neurologic disease", "神經系統疾病"],
          ["Spinal cord problem", "脊髓相關問題"],
          ["None of these", "以上都沒有"],
          ["Not sure", "不確定"]
        ]
      },
      {
        field: "diureticAnticoagulantAwareness",
        label: "你是否知道自己有沒有吃利尿藥或抗凝血藥？",
        type: "select",
        options: YES_NO_UNSURE
      }
    ]
  }
];

const SCENARIOS = SYNTHETIC_CASES;

let currentStep = 0;
let activeScenario = "";
let answers = restoreAnswers() || emptyAnswers();
let questionCursors = {};

const mount = document.querySelector("#stepMount");
const progressBar = document.querySelector("#progressBar");
const progressText = document.querySelector("#progressText");
const stepNav = document.querySelector("#stepNav");
const scenarioMount = document.querySelector("#scenarioMount");
const readinessLabel = document.querySelector("#readinessLabel");
const missingCount = document.querySelector("#missingCount");
const backButton = document.querySelector("#backButton");
const nextButton = document.querySelector("#nextButton");
const loadSample = document.querySelector("#loadSample");
const resetDemo = document.querySelector("#resetDemo");
const largeTextToggle = document.querySelector("#largeTextToggle");
const contrastToggle = document.querySelector("#contrastToggle");
const readStepButton = document.querySelector("#readStepButton");
const toast = document.querySelector("#toast");

let uiPrefs = restoreUiPrefs();

function emptyAnswers() {
  return Object.assign(
    Object.fromEntries(ANSWER_FIELDS.map((field) => [field, ARRAY_FIELDS.has(field) ? [] : ""])),
    { sourceByField: {} }
  );
}

function normalizeAnswers(source) {
  const base = emptyAnswers();
  Object.entries(source || {}).forEach(([field, value]) => {
    if (field === "sourceByField" && value && typeof value === "object" && !Array.isArray(value)) {
      base.sourceByField = Object.assign({}, value);
      return;
    }
    if (ANSWER_FIELDS.includes(field)) {
      base[field] = ARRAY_FIELDS.has(field) ? (Array.isArray(value) ? value.slice() : (value ? [value] : [])) : value;
    }
  });
  return base;
}

function restoreAnswers() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? normalizeAnswers(JSON.parse(stored)) : null;
  } catch (error) {
    return null;
  }
}

function restoreUiPrefs() {
  try {
    const stored = window.localStorage.getItem(UI_PREFS_KEY);
    return Object.assign({ largeText: false, highContrast: false }, stored ? JSON.parse(stored) : {});
  } catch (error) {
    return { largeText: false, highContrast: false };
  }
}

function persistUiPrefs() {
  try {
    window.localStorage.setItem(UI_PREFS_KEY, JSON.stringify(uiPrefs));
  } catch (error) {
    // Display preferences are optional; controls still work in the current page session.
  }
}

function applyUiPrefs() {
  document.documentElement.classList.toggle("large-text", Boolean(uiPrefs.largeText));
  document.documentElement.classList.toggle("high-contrast", Boolean(uiPrefs.highContrast));
  if (largeTextToggle) largeTextToggle.setAttribute("aria-pressed", uiPrefs.largeText ? "true" : "false");
  if (contrastToggle) contrastToggle.setAttribute("aria-pressed", uiPrefs.highContrast ? "true" : "false");
}

function persistAnswers() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  } catch (error) {
    // Local storage may be unavailable in a locked-down browser; the demo still works in memory.
  }
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function optionSpec(option) {
  if (Array.isArray(option)) {
    return { value: option[0], label: option[1] || option[0], detail: option[2] || "" };
  }
  if (option && typeof option === "object") {
    return { value: option.value, label: option.label || option.value, detail: option.detail || "" };
  }
  return { value: option, label: VALUE_LABELS[option] || option, detail: "" };
}

function displayAnswer(value) {
  if (Array.isArray(value)) {
    const display = value.map((item) => displayAnswer(item)).filter((item) => item !== "尚未填寫");
    return display.length ? display.join("、") : "尚未填寫";
  }
  if (!value) return "尚未填寫";
  return VALUE_LABELS[value] || value;
}

function listAnswer(field) {
  return Array.isArray(answers[field]) ? answers[field] : [];
}

function hasFieldValue(field) {
  const value = answers[field];
  if (Array.isArray(value)) return value.length > 0;
  return Boolean(value);
}

function sourceFromMode(mode) {
  if (mode === "Patient self-filled") return "patient_self";
  if (mode === "Family helped operate; patient answered") return "patient_with_family_operator";
  if (mode === "Family or helper-assisted") return "family_observation";
  return "unknown";
}

function sourceForField(field) {
  if (answers.sourceByField && answers.sourceByField[field]) return answers.sourceByField[field];
  if (field === "filledBy" && answers.filledBy) return "declared_on_entry";
  return hasFieldValue(field) ? sourceFromMode(answers.filledBy) : "unknown";
}

function sourceLabel(field) {
  return SOURCE_LABELS[sourceForField(field)] || SOURCE_LABELS.unknown;
}

function visibleFields(fields) {
  return fields.filter((field) => !field.when || field.when(answers));
}

function stepSupportsQuestionFlow(step) {
  return step && (step.type === "fields" || step.type === "modules");
}

function questionFlowItems(step) {
  if (!stepSupportsQuestionFlow(step)) return [];
  if (step.type === "fields") {
    return visibleFields(step.fields).map((field) => ({ field }));
  }
  const modules = activeModules(answers);
  return MODULES
    .filter((module) => modules[module.id])
    .flatMap((module) => visibleFields(module.fields).map((field) => ({ field, module })));
}

function currentQuestionIndex(step, items = questionFlowItems(step)) {
  const rawIndex = Number(questionCursors[step.id] || 0);
  const maxIndex = Math.max(items.length - 1, 0);
  const index = Math.min(Math.max(rawIndex, 0), maxIndex);
  questionCursors[step.id] = index;
  return index;
}

function focusQuestionPanel() {
  window.requestAnimationFrame(() => {
    document.querySelector(".patient-intake")?.scrollIntoView({ block: "start" });
  });
}

function setStepIndex(stepIndex, options = {}) {
  currentStep = Math.min(Math.max(stepIndex, 0), STEPS.length - 1);
  const step = STEPS[currentStep];
  if (stepSupportsQuestionFlow(step)) {
    const items = questionFlowItems(step);
    if (options.position === "last") {
      questionCursors[step.id] = Math.max(items.length - 1, 0);
    } else if (options.position === "firstMissing") {
      const missingIndex = items.findIndex((item) => !hasFieldValue(item.field.field));
      questionCursors[step.id] = missingIndex >= 0 ? missingIndex : 0;
    } else if (typeof questionCursors[step.id] !== "number") {
      questionCursors[step.id] = 0;
    }
  }
}

function advanceQuestionOrStep() {
  const step = STEPS[currentStep];
  if (stepSupportsQuestionFlow(step)) {
    const items = questionFlowItems(step);
    const index = currentQuestionIndex(step, items);
    if (index < items.length - 1) {
      questionCursors[step.id] = index + 1;
      render();
      focusQuestionPanel();
      return;
    }
  }
  setStepIndex(currentStep === STEPS.length - 1 ? 0 : currentStep + 1, { position: "firstMissing" });
  render();
  focusQuestionPanel();
}

function goBackQuestionOrStep() {
  const step = STEPS[currentStep];
  if (stepSupportsQuestionFlow(step)) {
    const index = currentQuestionIndex(step);
    if (index > 0) {
      questionCursors[step.id] = index - 1;
      render();
      focusQuestionPanel();
      return;
    }
  }
  if (currentStep > 0) {
    setStepIndex(currentStep - 1, { position: "last" });
    render();
    focusQuestionPanel();
  }
}

function isAutoAdvanceQuestion() {
  const step = STEPS[currentStep];
  if (step.type === "options") return !step.multiple;
  if (stepSupportsQuestionFlow(step)) {
    const items = questionFlowItems(step);
    const item = items[currentQuestionIndex(step, items)];
    return item && (item.field.type === "select" || item.field.type === "scale");
  }
  return false;
}

function missingEntries() {
  return missingFieldEntries(answers);
}

function setAnswer(field, value, options = {}) {
  const sourceByField = Object.assign({}, answers.sourceByField);
  const nextValue = ARRAY_FIELDS.has(field) ? (Array.isArray(value) ? value.slice() : (value ? [value] : [])) : value;
  if (field === "filledBy") {
    sourceByField.filledBy = "declared_on_entry";
    ANSWER_FIELDS.forEach((answerField) => {
      if (answerField !== "filledBy" && hasFieldValue(answerField)) {
        sourceByField[answerField] = sourceFromMode(nextValue);
      }
    });
  } else if (Array.isArray(nextValue) ? nextValue.length : nextValue) {
    sourceByField[field] = sourceFromMode(answers.filledBy);
  } else {
    delete sourceByField[field];
  }
  answers = Object.assign({}, answers, {
    [field]: nextValue,
    sourceByField
  });
  persistAnswers();
  if (options.render !== false) render();
}

function toggleCheckbox(field, value, checked) {
  let next = listAnswer(field).filter((item) => item !== value);
  if (checked) {
    if (EXCLUSIVE_CHECKBOX_VALUES.has(value)) {
      next = [value];
    } else {
      next = next.filter((item) => !EXCLUSIVE_CHECKBOX_VALUES.has(item));
      next.push(value);
    }
  }
  setAnswer(field, next);
}

function loadScenario(scenarioId) {
  const scenario = SCENARIOS.find((item) => item.id === scenarioId) || SCENARIOS[0];
  activeScenario = scenario.id;
  answers = normalizeAnswers(scenario.answers);
  questionCursors = {};
  persistAnswers();
  currentStep = STEPS.length - 1;
  render();
  showToast(`已載入示範：${scenario.shortLabel || scenario.label}`);
}

function renderScenarios() {
  scenarioMount.innerHTML = SCENARIOS.map((scenario) => `
    <button
      class="scenario-button"
      type="button"
      data-scenario="${escapeHtml(scenario.id)}"
      aria-pressed="${activeScenario === scenario.id ? "true" : "false"}">
      <strong>${escapeHtml(scenario.shortLabel || scenario.label)}</strong>
      <span>${escapeHtml(scenario.meta)}</span>
    </button>
  `).join("");
}

function renderStepNav() {
  stepNav.innerHTML = STEPS.map((step, index) => {
    const isActive = index === currentStep;
    const state = index < currentStep ? "complete" : isActive ? "active" : "upcoming";
    return `
      <button class="step-chip ${state}" type="button" data-step-index="${index}" aria-current="${isActive ? "step" : "false"}">
        <span>${index + 1}</span>
        ${escapeHtml(step.label)}
      </button>
    `;
  }).join("");
}

function renderSourceNotice() {
  if (!/family|helper/i.test(answers.filledBy)) return "";
  return `
    <div class="source-notice" role="note">
      <strong>家人協助模式已標記</strong>
      <span>疼痛、急尿、困擾程度這類「本人感受」，建議盡量由長輩本人說；家人可以補充平常觀察到的事。</span>
    </div>
  `;
}

function renderOptions(step) {
  if (step.multiple) {
    const current = listAnswer(step.field);
    return `
      <fieldset class="elder-question-card checkbox-field">
        <legend>${escapeHtml(step.title)}</legend>
        <p class="question-guidance">可以複選。選好後，再按下方的「下一步」。</p>
        <div class="checkbox-grid elder-choice-grid">
          ${step.options.map((option) => {
            const item = optionSpec(option);
            return `
              <label class="checkbox-option elder-checkbox-option">
                <input
                  type="checkbox"
                  data-checkbox-field="${escapeHtml(step.field)}"
                  data-checkbox-value="${escapeHtml(item.value)}"
                  ${current.includes(item.value) ? "checked" : ""}>
                <span>
                  <strong>${escapeHtml(item.label)}</strong>
                  ${item.detail ? `<small>${escapeHtml(item.detail)}</small>` : ""}
                </span>
              </label>
            `;
          }).join("")}
        </div>
      </fieldset>
    `;
  }

  return `
    <div class="option-grid elder-choice-grid" role="group" aria-label="${escapeHtml(step.title)}">
      ${step.options.map((option) => {
        const item = optionSpec(option);
        return `
          <button
            class="option-button elder-choice-button"
            type="button"
            data-option-field="${escapeHtml(step.field)}"
            data-option-value="${escapeHtml(item.value)}"
            data-auto-advance="true"
            aria-pressed="${answers[step.field] === item.value ? "true" : "false"}">
            <strong>${escapeHtml(item.label)}</strong>
            <span>${escapeHtml(item.detail)}</span>
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function renderField(field, options = {}) {
  const autoAdvance = options.autoAdvance !== false;

  if (field.type === "textarea") {
    return `
      <div class="field wide-field elder-text-field">
        <label for="${escapeHtml(field.field)}">${escapeHtml(field.label)}</label>
        <textarea id="${escapeHtml(field.field)}" data-field="${escapeHtml(field.field)}" placeholder="${escapeHtml(field.placeholder || "")}">${escapeHtml(answers[field.field])}</textarea>
      </div>
    `;
  }

  if (field.type === "checkboxes") {
    const current = listAnswer(field.field);
    return `
      <fieldset class="field wide-field checkbox-field">
        <legend>${escapeHtml(field.label)}</legend>
        <p class="question-guidance">可以複選。選好後，再按下方的「下一題」。</p>
        <div class="checkbox-grid elder-choice-grid">
          ${field.options.map((option) => {
            const item = optionSpec(option);
            return `
              <label class="checkbox-option elder-checkbox-option">
                <input
                  type="checkbox"
                  data-checkbox-field="${escapeHtml(field.field)}"
                  data-checkbox-value="${escapeHtml(item.value)}"
                  ${current.includes(item.value) ? "checked" : ""}>
                <span><strong>${escapeHtml(item.label)}</strong></span>
              </label>
            `;
          }).join("")}
        </div>
      </fieldset>
    `;
  }

  if (field.type === "scale") {
    const numericOptions = field.options
      .map(optionSpec)
      .filter((item) => /^\d+$/.test(String(item.value)));
    const unsureOption = field.options.map(optionSpec).find((item) => item.value === "Not sure");
    return `
      <div class="scale-answer" role="group" aria-label="${escapeHtml(field.label)}">
        <div class="scale-endpoints" aria-hidden="true">
          <span>1 很輕微</span>
          <span>5 中等</span>
          <span>10 非常困擾</span>
        </div>
        <div class="scale-grid">
          ${numericOptions.map((item) => {
            const level = Number(item.value);
            const hue = Math.round(178 - ((level - 1) * 12));
            const ring = `hsl(${hue} 60% 42%)`;
            const soft = `hsl(${hue} 74% 92%)`;
            const ink = level >= 8 ? "#6d1738" : level >= 6 ? "#604010" : "#0d4f49";
            return `
              <button
                class="scale-button"
                style="--scale-ring: ${ring}; --scale-soft: ${soft}; --scale-ink: ${ink};"
                type="button"
                data-option-field="${escapeHtml(field.field)}"
                data-option-value="${escapeHtml(item.value)}"
                data-auto-advance="${autoAdvance ? "true" : "false"}"
                aria-pressed="${answers[field.field] === item.value ? "true" : "false"}">
                <strong class="scale-number">${escapeHtml(item.label)}</strong>
              </button>
            `;
          }).join("")}
        </div>
        ${unsureOption ? `
          <button
            class="scale-unsure-button"
            type="button"
            data-option-field="${escapeHtml(field.field)}"
            data-option-value="${escapeHtml(unsureOption.value)}"
            data-auto-advance="${autoAdvance ? "true" : "false"}"
            aria-pressed="${answers[field.field] === unsureOption.value ? "true" : "false"}">
            ${escapeHtml(unsureOption.label)}
          </button>
        ` : ""}
      </div>
    `;
  }

  return `
    <div class="option-grid elder-choice-grid" role="group" aria-label="${escapeHtml(field.label)}">
        ${field.options.map((option) => {
          const item = optionSpec(option);
          return `
            <button
              class="option-button elder-choice-button"
              type="button"
              data-option-field="${escapeHtml(field.field)}"
              data-option-value="${escapeHtml(item.value)}"
              data-auto-advance="${autoAdvance ? "true" : "false"}"
              aria-pressed="${answers[field.field] === item.value ? "true" : "false"}">
              <strong>${escapeHtml(item.label)}</strong>
            </button>
          `;
        }).join("")}
    </div>
  `;
}

function renderFields(step) {
  const items = questionFlowItems(step);
  if (!items.length) {
    return `
      <div class="empty-state">
        <h4>目前沒有需要填的題目</h4>
        <p>可以按下一步繼續。</p>
      </div>
    `;
  }
  const index = currentQuestionIndex(step, items);
  return renderQuestionFlowCard(step, items[index], index, items.length);
}

function renderQuestionFlowCard(step, item, index, total) {
  const field = item.field;
  const prompt = PATIENT_MISSING_PROMPTS[field.field] || [field.label, ""];
  return `
    <section class="elder-question-card" aria-labelledby="elder-question-title">
      <div class="question-progress">題組內第 ${index + 1} 題，共 ${total} 題</div>
      ${item.module ? `<p class="question-module-label">${escapeHtml(item.module.title)}</p>` : ""}
      <h3 id="elder-question-title">${escapeHtml(field.label)}</h3>
      <p class="question-guidance">${escapeHtml(prompt[1] || "請選最接近的答案。")}</p>
      ${renderField(field)}
    </section>
  `;
}

function renderModules() {
  const step = STEPS[currentStep];
  const items = questionFlowItems(step);

  if (!items.length) {
    return `
      <div class="empty-state">
        <h4>目前沒有需要追加的問題</h4>
        <p>先完成前面的基本狀況即可；如果還有想說的事，最後可以用自己的話補充。</p>
      </div>
    `;
  }

  const index = currentQuestionIndex(step, items);
  return renderQuestionFlowCard(step, items[index], index, items.length);
}

function renderRepair() {
  const missing = missingEntries();
  if (!missing.length) {
    return `
      <div class="empty-state">
        <h4>目前沒有必補項目</h4>
        <p>可以到最後一步確認內容；若想補充其他事，也可以回到「協助」那一步填寫。</p>
      </div>
    `;
  }

  return `
    <div class="repair-list patient-repair-list">
      ${missing.map(([field, label]) => {
        const prompt = PATIENT_MISSING_PROMPTS[field] || [label, "這是目前還缺的重點資訊。"];
        return `
          <button class="repair-item" type="button" data-go-step="${FIELD_TO_STEP[field] || 0}">
            <span>可以補一下</span>
            <strong>${escapeHtml(prompt[0])}</strong>
            <small>${escapeHtml(prompt[1])}</small>
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function symptomHighlights() {
  const rows = [
    ["daytimeFrequencyChange", "白天尿尿次數", answers.daytimeFrequencyChange],
    ["nocturiaCount", "夜間起床尿尿", answers.nocturiaCount],
    ["urgency", "突然急尿", answers.urgency],
    ["leakage", "漏尿", answers.leakage],
    ["painBurning", "尿痛或灼熱", answers.painBurning],
    ["visibleBlood", "紅色/茶色尿或血塊", answers.visibleBlood],
    ["unableToUrinate", "尿不太出來", answers.unableToUrinate],
    ["systemicSymptoms", "發燒、發冷或腰側痛", answers.systemicSymptoms]
  ];
  return rows
    .filter(([, , value]) => Array.isArray(value) ? value.length : value)
    .map(([field, label, value]) => [field, label, displayAnswer(value)]);
}

function activeModuleLabels() {
  const modules = activeModules(answers);
  return Object.entries(modules)
    .filter(([, active]) => active)
    .map(([module]) => MODULE_LABELS[module] || module);
}

function renderReview() {
  const missing = missingEntries();
  const modules = activeModuleLabels();
  const highlights = symptomHighlights();
  return `
    <div class="patient-confirmation">
      <section class="confirmation-block">
        <h3>你剛剛整理的重點</h3>
        <dl class="review-grid">
          <div class="review-row">
            <dt>資料來源</dt>
            <dd>${escapeHtml(displayAnswer(answers.filledBy))}</dd>
          </div>
          <div class="review-row">
            <dt>今天最想先說</dt>
            <dd>${escapeHtml(displayAnswer(answers.chiefConcern))}</dd>
          </div>
          <div class="review-row">
            <dt>大約多久 / 困擾程度</dt>
            <dd>${escapeHtml(displayAnswer(answers.duration))} / ${escapeHtml(displayAnswer(answers.botherScore))}</dd>
          </div>
          <div class="review-row">
            <dt>系統有追加整理的部分</dt>
            <dd>${escapeHtml(modules.length ? modules.join("、") : "目前沒有追加題")}</dd>
          </div>
          <div class="review-row">
            <dt>用藥資料</dt>
            <dd>${escapeHtml(displayAnswer(answers.medicationListStatus))}</dd>
          </div>
        </dl>
      </section>

      <section class="confirmation-block">
        <h3>症狀回答確認</h3>
        <div class="answer-pills">
          ${highlights.map(([field, label, value]) => `
            <span>
              <strong>${escapeHtml(label)}</strong>
              ${escapeHtml(value)}
              <small>${escapeHtml(sourceLabel(field))}</small>
            </span>
          `).join("") || "<p>尚未填寫症狀回答。</p>"}
        </div>
      </section>

      <section class="confirmation-block">
        <h3>還可以補充的地方</h3>
        ${missing.length ? `
          <ul class="missing-list">
            ${missing.map(([field, label]) => {
              const prompt = PATIENT_MISSING_PROMPTS[field] || [label, "這是目前還缺的重點資訊。"];
              return `<li>${escapeHtml(prompt[0])}</li>`;
            }).join("")}
          </ul>
        ` : "<p>目前沒有必補項目。你仍可回前面修改或補充。</p>"}
      </section>

      <section class="confirmation-block reassurance">
        <h3>送出前提醒</h3>
        <p>這份整理只幫你把話說清楚，不會替你判斷疾病，也不會給治療建議。若有不好意思或不確定的地方，可以到現場再說。</p>
      </section>
    </div>
  `;
}

function renderStep() {
  const step = STEPS[currentStep];
  let body = "";
  if (step.type === "options") body = renderOptions(step);
  if (step.type === "fields") body = renderFields(step);
  if (step.type === "modules") body = renderModules();
  if (step.type === "repair") body = renderRepair();
  if (step.type === "review") body = renderReview();

  mount.innerHTML = `
    <section class="step-panel" aria-labelledby="step-title">
      <div class="step-kicker">第 ${currentStep + 1} 步，共 ${STEPS.length} 步</div>
      <h2 id="step-title">${escapeHtml(step.title)}</h2>
      <p class="step-copy">${escapeHtml(step.copy)}</p>
      ${renderSourceNotice()}
      ${body}
    </section>
  `;
}

function currentStepText() {
  const step = STEPS[currentStep];
  const parts = [`第 ${currentStep + 1} 步，共 ${STEPS.length} 步。`, step.title, step.copy];
  if (step.type === "options") {
    parts.push((step.multiple ? "可以複選：" : "點選後會自動進到下一題：") + step.options.map((option) => optionSpec(option).label).join("、"));
  }
  if (step.type === "fields") {
    const items = questionFlowItems(step);
    const item = items[currentQuestionIndex(step, items)];
    if (item) {
      parts.push(`目前題目：${item.field.label}`);
    }
  }
  if (step.type === "modules") {
    const items = questionFlowItems(step);
    const item = items[currentQuestionIndex(step, items)];
    parts.push(item
      ? `目前補問題目：${item.module ? item.module.title + "，" : ""}${item.field.label}`
      : "目前沒有需要追加的問題。");
  }
  if (step.type === "repair") {
    const missing = missingEntries();
    parts.push(missing.length
      ? "目前還可以補充：" + missing.map(([field, label]) => (PATIENT_MISSING_PROMPTS[field] || [label])[0]).join("、")
      : "目前沒有必補項目。");
  }
  if (step.type === "review") {
    parts.push("這一頁是送出前確認，可以回上一題修改。");
  }
  return parts.filter(Boolean).join(" ");
}

function readCurrentStep() {
  if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
    showToast("這個瀏覽器不支援朗讀。");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(currentStepText());
  utterance.lang = "zh-TW";
  utterance.rate = 0.88;
  window.speechSynthesis.speak(utterance);
  showToast("正在朗讀目前題目。");
}

function renderReadiness() {
  const status = completionStatus(answers);
  readinessLabel.textContent = status.missingCount
    ? "還有重點可補充"
    : "可以進行最後確認";
  missingCount.textContent = String(status.missingCount);
}

function renderProgress() {
  const width = ((currentStep + 1) / STEPS.length) * 100;
  const step = STEPS[currentStep];
  const flowItems = questionFlowItems(step);
  const flowIndex = currentQuestionIndex(step, flowItems);
  const hideNext = isAutoAdvanceQuestion();
  progressBar.style.width = `${width}%`;
  progressText.textContent = `第 ${currentStep + 1} 步，共 ${STEPS.length} 步`;
  backButton.disabled = currentStep === 0 && (!stepSupportsQuestionFlow(step) || flowIndex === 0);
  nextButton.hidden = hideNext;
  if (currentStep === STEPS.length - 1) {
    nextButton.textContent = "回到第一步";
  } else if (stepSupportsQuestionFlow(step) && flowItems.length && flowIndex < flowItems.length - 1) {
    nextButton.textContent = "下一題";
  } else {
    nextButton.textContent = "下一步";
  }
}

function render() {
  renderScenarios();
  renderStepNav();
  renderStep();
  renderReadiness();
  renderProgress();
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => {
    toast.hidden = true;
  }, 1800);
}

mount.addEventListener("click", (event) => {
  const option = event.target.closest("[data-option-field]");
  if (option) {
    setAnswer(option.dataset.optionField, option.dataset.optionValue, { render: false });
    if (option.dataset.autoAdvance === "true") {
      advanceQuestionOrStep();
    } else {
      render();
    }
    return;
  }

  const repair = event.target.closest("[data-go-step]");
  if (repair) {
    setStepIndex(Number(repair.dataset.goStep), { position: "firstMissing" });
    render();
    focusQuestionPanel();
  }
});

mount.addEventListener("change", (event) => {
  const checkbox = event.target.closest("[data-checkbox-field]");
  if (checkbox) {
    toggleCheckbox(checkbox.dataset.checkboxField, checkbox.dataset.checkboxValue, checkbox.checked);
    return;
  }

  const field = event.target.closest("[data-field]");
  if (!field) return;
  setAnswer(field.dataset.field, field.value);
});

mount.addEventListener("input", (event) => {
  const field = event.target.closest("textarea[data-field]");
  if (!field) return;
  const sourceByField = Object.assign({}, answers.sourceByField);
  if (field.value) {
    sourceByField[field.dataset.field] = sourceFromMode(answers.filledBy);
  } else {
    delete sourceByField[field.dataset.field];
  }
  answers = Object.assign({}, answers, {
    [field.dataset.field]: field.value,
    sourceByField
  });
  persistAnswers();
});

stepNav.addEventListener("click", (event) => {
  const stepButton = event.target.closest("[data-step-index]");
  if (!stepButton) return;
  setStepIndex(Number(stepButton.dataset.stepIndex), { position: "firstMissing" });
  render();
  focusQuestionPanel();
});

scenarioMount.addEventListener("click", (event) => {
  const button = event.target.closest("[data-scenario]");
  if (!button) return;
  loadScenario(button.dataset.scenario);
});

backButton.addEventListener("click", () => {
  goBackQuestionOrStep();
});

nextButton.addEventListener("click", () => {
  advanceQuestionOrStep();
});

loadSample.addEventListener("click", () => {
  loadScenario(SCENARIOS[0].id);
});

resetDemo.addEventListener("click", () => {
  activeScenario = "";
  answers = emptyAnswers();
  questionCursors = {};
  persistAnswers();
  currentStep = 0;
  render();
  showToast("已重新開始。");
});

largeTextToggle.addEventListener("click", () => {
  uiPrefs = Object.assign({}, uiPrefs, { largeText: !uiPrefs.largeText });
  persistUiPrefs();
  applyUiPrefs();
  showToast(uiPrefs.largeText ? "已切換為大字。" : "已回到一般字級。");
});

contrastToggle.addEventListener("click", () => {
  uiPrefs = Object.assign({}, uiPrefs, { highContrast: !uiPrefs.highContrast });
  persistUiPrefs();
  applyUiPrefs();
  showToast(uiPrefs.highContrast ? "已切換為高對比。" : "已回到一般對比。");
});

readStepButton.addEventListener("click", () => {
  readCurrentStep();
});

applyUiPrefs();
persistAnswers();
render();
