const { QUESTION_BANK, rankQuestions, FIELD_LABELS } = window.UrologyAdaptiveQuestioning;
const VERSION = window.UroPrevisitVersion || { versionLabel: "v2.0.0" };

const STORAGE_KEY = "urologyAdaptiveDemoState";

const SAMPLE_TRANSCRIPTS = {
  nocturia: "我最近晚上一直起來尿，通常一個晚上會醒來好幾次。有時候白天也一直跑廁所，而且突然很急，怕來不及到廁所。",
  pain: "這幾天尿尿會刺痛，有灼熱感，昨天晚上好像有點發燒，也覺得腰兩側不太舒服。",
  blood: "我今天看到尿液有點紅紅的，好像也有一點血塊，不確定是不是血尿，所以想先問清楚。",
  vaguePain: "我下面會痛，但我說不太清楚是哪裡痛。",
  vagueUrinary: "我尿尿怪怪的，怪怪不舒服，但不知道怎麼講。"
};

const transcriptInput = document.querySelector("#transcriptInput");
const computeButton = document.querySelector("#computeButton");
const asrButton = document.querySelector("#asrButton");
const asrStatus = document.querySelector("#asrStatus");
const resetDemo = document.querySelector("#resetDemo");
const versionBadge = document.querySelector("#versionBadge");
const loadNocturia = document.querySelector("#loadNocturia");
const loadPain = document.querySelector("#loadPain");
const loadBlood = document.querySelector("#loadBlood");
const loadVaguePain = document.querySelector("#loadVaguePain");
const loadVagueUrinary = document.querySelector("#loadVagueUrinary");
const answeredFacts = document.querySelector("#answeredFacts");
const questionTitle = document.querySelector("#question-title");
const questionMount = document.querySelector("#questionMount");
const turnLabel = document.querySelector("#turnLabel");
const scoreLabel = document.querySelector("#scoreLabel");
const stateSummary = document.querySelector("#stateSummary");
const ambiguityMount = document.querySelector("#ambiguityMount");
const rankingMount = document.querySelector("#rankingMount");
const toast = document.querySelector("#toast");

let state = restoreState();
let recognition = null;
let listening = false;

function emptyState() {
  return {
    transcript: "",
    answers: {},
    askedQuestionIds: [],
    current: null,
    ranking: null,
    turn: 0
  };
}

function restoreState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? Object.assign(emptyState(), JSON.parse(raw)) : emptyState();
  } catch (error) {
    return emptyState();
  }
}

function persistState() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    // The demo still works in memory when localStorage is unavailable.
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

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.hidden = true;
  }, 1800);
}

function computeNext() {
  state.transcript = transcriptInput.value.trim();
  state.ranking = rankQuestions({
    transcript: state.transcript,
    answers: state.answers,
    askedQuestionIds: state.askedQuestionIds,
    questionBank: QUESTION_BANK
  });
  state.current = state.ranking.selected;
  persistState();
  render();
}

function answerCurrent(value) {
  if (!state.current) return;
  const question = state.current.question;
  const field = question.asksFor[0];
  state.answers[field] = value;
  if (!state.askedQuestionIds.includes(question.id)) {
    state.askedQuestionIds.push(question.id);
  }
  state.turn += 1;
  showToast("答案已記錄，正在重新計算下一題。");
  computeNext();
}

function reset() {
  state = emptyState();
  transcriptInput.value = "";
  persistState();
  render();
}

function loadSample(name) {
  state = emptyState();
  state.transcript = SAMPLE_TRANSCRIPTS[name] || "";
  transcriptInput.value = state.transcript;
  computeNext();
}

function render() {
  if (versionBadge) {
    versionBadge.textContent = VERSION.versionLabel;
    versionBadge.title = `${VERSION.product || "UroPrevisit Navigator"} ${VERSION.stage || "demo"}`;
  }
  transcriptInput.value = state.transcript || transcriptInput.value;
  renderFacts();
  renderQuestion();
  renderRanking();
  renderStateSummary();
  renderAmbiguity();
}

function renderFacts() {
  const entries = Object.entries(state.answers);
  if (!entries.length) {
    answeredFacts.innerHTML = `<p class="muted-copy">尚未回答任何欄位。</p>`;
    return;
  }
  answeredFacts.innerHTML = entries.map(([field, value]) => `
    <div class="fact-item">
      <strong>${escapeHtml(FIELD_LABELS[field] || field)}</strong>
      <span>${escapeHtml(value)}</span>
    </div>
  `).join("");
}

function renderQuestion() {
  turnLabel.textContent = `第 ${state.turn + 1} 輪`;
  if (!state.current) {
    questionTitle.textContent = "等待計算";
    scoreLabel.textContent = "尚未排序";
    questionMount.innerHTML = `
      <div class="adaptive-empty">
        <h3>輸入使用者說法後，按「計算下一題」</h3>
        <p>系統會從題庫中排序候選問題，並顯示為什麼選出下一題。</p>
      </div>
    `;
    return;
  }

  const question = state.current.question;
  questionTitle.textContent = question.text;
  scoreLabel.textContent = `score ${state.current.score.toFixed(2)}`;
  questionMount.innerHTML = `
    <div class="selected-question-card">
      <p class="eyebrow">selected question</p>
      <h3>${escapeHtml(question.text)}</h3>
      <p>${escapeHtml(question.value)}</p>
      <div class="component-grid" aria-label="分數組成">
        ${component("語意", state.current.components.semantic)}
        ${component("缺口", state.current.components.missingInfo)}
        ${component("流程", state.current.components.workflow)}
        ${component("縮小模糊", state.current.components.ambiguityReduction)}
        ${component("安全", state.current.components.safety)}
      </div>
      <div class="answer-grid" role="group" aria-label="回答選項">
        ${question.options.map((option) => `
          <button class="option-button adaptive-answer-button" type="button" data-answer-value="${escapeHtml(option)}">
            <strong>${escapeHtml(option)}</strong>
          </button>
        `).join("")}
      </div>
      <div class="reason-box">
        <strong>為什麼問這題</strong>
        <ul>
          ${state.current.reasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;
}

function component(label, value) {
  const percent = Math.max(0, Math.min(100, Math.round(value * 100)));
  return `
    <div class="score-component" style="--score-width: ${percent}%">
      <span>${escapeHtml(label)}</span>
      <strong>${percent}</strong>
      <i aria-hidden="true"></i>
    </div>
  `;
}

function renderRanking() {
  const items = state.ranking?.ranked?.slice(0, 3) || [];
  if (!items.length) {
    rankingMount.innerHTML = `<p class="muted-copy">尚未產生候選題排序。</p>`;
    return;
  }
  rankingMount.innerHTML = items.map((item, index) => `
    <article class="ranking-item ${index === 0 ? "selected" : ""}">
      <div>
        <span>#${index + 1}</span>
        <strong>${escapeHtml(item.question.text)}</strong>
      </div>
      <small>score ${item.score.toFixed(2)} | semantic ${item.components.semantic} | missing ${item.components.missingInfo}</small>
      <em>${index === 0 ? "selected" : "downranked / skipped reason"}</em>
      <ul>
        ${item.reasons.slice(0, 3).map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")}
      </ul>
    </article>
  `).join("");
}

function renderStateSummary() {
  const symptoms = state.ranking?.state?.symptoms || [];
  const fields = state.ranking?.state?.answeredFields || [];
  const missing = state.ranking?.state?.missingFields || [];
  stateSummary.innerHTML = `
    <div class="state-pill-group">
      ${(symptoms.length ? symptoms : ["尚未推定"]).map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
    </div>
    <p class="muted-copy">已回答欄位：${fields.length ? fields.map((field) => FIELD_LABELS[field] || field).join("、") : "尚未回答"}</p>
    <p class="muted-copy">仍缺資訊：${missing.length ? missing.slice(0, 8).map((field) => FIELD_LABELS[field] || field).join("、") : "暫無"}</p>
  `;
}

function renderAmbiguity() {
  const status = state.ranking?.state?.ambiguityStatus || "not_checked";
  const items = state.ranking?.state?.ambiguity || [];
  if (status === "not_checked") {
    ambiguityMount.innerHTML = `<p class="muted-copy">尚未檢查模糊描述。</p>`;
    return;
  }
  if (status === "clear_enough") {
    ambiguityMount.innerHTML = `
      <div class="ambiguity-card clear">
        <strong>Clear enough</strong>
        <span>目前描述可進入一般題庫 ranking。</span>
      </div>
    `;
    return;
  }
  ambiguityMount.innerHTML = items.filter((item) => item.active).map((item) => `
    <div class="ambiguity-card active">
      <strong>${escapeHtml(item.label)}</strong>
      <span>${escapeHtml(item.reason)}</span>
      <small>matched: ${escapeHtml(item.patternHits.join("、"))}</small>
    </div>
  `).join("");
}

function setupAsr() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    asrButton.disabled = true;
    asrStatus.textContent = "此瀏覽器不支援 Web Speech；請使用 typed input fallback。";
    return;
  }
  recognition = new SpeechRecognition();
  recognition.lang = "zh-TW";
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.onstart = () => {
    listening = true;
    asrButton.textContent = "停止 ASR";
    asrStatus.textContent = "ASR 聆聽中；會議 demo 仍保留 typed fallback。";
  };
  recognition.onend = () => {
    listening = false;
    asrButton.textContent = "開始 ASR";
    asrStatus.textContent = "ASR 已停止；可按計算下一題。";
  };
  recognition.onerror = () => {
    asrStatus.textContent = "ASR 發生錯誤；請改用 typed input fallback。";
  };
  recognition.onresult = (event) => {
    const text = Array.from(event.results)
      .map((result) => result[0]?.transcript || "")
      .join("");
    transcriptInput.value = text;
    state.transcript = text;
    persistState();
  };
}

computeButton.addEventListener("click", computeNext);
resetDemo.addEventListener("click", reset);
loadNocturia.addEventListener("click", () => loadSample("nocturia"));
loadPain.addEventListener("click", () => loadSample("pain"));
loadBlood.addEventListener("click", () => loadSample("blood"));
loadVaguePain.addEventListener("click", () => loadSample("vaguePain"));
loadVagueUrinary.addEventListener("click", () => loadSample("vagueUrinary"));
transcriptInput.addEventListener("input", () => {
  state.transcript = transcriptInput.value;
  persistState();
});
questionMount.addEventListener("click", (event) => {
  const button = event.target.closest("[data-answer-value]");
  if (!button) return;
  answerCurrent(button.dataset.answerValue);
});
asrButton.addEventListener("click", () => {
  if (!recognition) return;
  if (listening) {
    recognition.stop();
  } else {
    recognition.start();
  }
});

setupAsr();
render();
