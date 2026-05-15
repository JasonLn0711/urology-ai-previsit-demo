#!/usr/bin/env node

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { QUESTION_BANK, rankQuestions } = require("../../core/adaptive_questioning");

const root = path.resolve(__dirname, "..", "..");
const baseUrl = process.env.UROLOGY_V2_BASE_URL || "http://localhost:4173/app/adaptive-intake/";
const checks = [];

function relPath(relativePath) {
  return path.join(root, relativePath);
}

function read(relativePath) {
  return fs.readFileSync(relPath(relativePath), "utf8");
}

function record(name, passed, detail = "") {
  checks.push({ name, passed: Boolean(passed), detail });
}

function request(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        resolve({ ok: true, statusCode: res.statusCode, body });
      });
    });
    req.on("error", (error) => {
      resolve({ ok: false, statusCode: 0, body: "", error: error.message });
    });
    req.setTimeout(2000, () => {
      req.destroy(new Error("timeout"));
    });
  });
}

function checkFiles() {
  [
    "app/adaptive-intake/index.html",
    "app/adaptive-intake/adaptive-intake.js",
    "app/adaptive-intake/adaptive-intake.css",
    "core/adaptive_questioning/questionBank.js",
    "data/question_bank/urology_adaptive_bank.js",
    "VERSION.json",
    "core/version/index.js",
    "docs/CHANGELOG.md",
    "docs/versioning-policy.md",
    "docs/urology-ai-previsit-demo-v2-spec.md",
    "docs/v2-demo-freeze-runbook.md",
    "docs/demo-script-5min.md",
    "docs/safety-boundary.md"
  ].forEach((file) => record(`file exists: ${file}`, fs.existsSync(relPath(file))));
}

function checkQuestionBank() {
  record("question bank has at least 40 governed questions", QUESTION_BANK.length >= 40, `count=${QUESTION_BANK.length}`);
  const ids = new Set();
  for (const question of QUESTION_BANK) {
    record(`question id unique: ${question.id}`, !ids.has(question.id));
    ids.add(question.id);
    for (const key of [
      "id",
      "text",
      "type",
      "asksFor",
      "symptoms",
      "domain",
      "clinicalValue",
      "ambiguityReduction",
      "safetyPriority",
      "redFlag",
      "nextUsefulWhen",
      "avoidWhen",
      "answerType",
      "options",
      "explanationTemplate"
    ]) {
      record(`question metadata: ${question.id}.${key}`, question[key] !== undefined);
    }
  }
}

function checkCases() {
  const cases = [
    {
      name: "Case A nocturia",
      transcript: "I wake up several times at night to pee.",
      allowed: ["nocturia_count"],
      requiredType: null
    },
    {
      name: "Case B dysuria",
      transcript: "It burns when I pee.",
      allowed: ["pain_burning"],
      requiredType: null
    },
    {
      name: "Case C vague pain",
      transcript: "I feel pain down there.",
      allowed: ["clarify_pain_location"],
      requiredType: "clarification"
    }
  ];

  for (const sample of cases) {
    const result = rankQuestions({
      transcript: sample.transcript,
      answers: {},
      askedQuestionIds: [],
      questionBank: QUESTION_BANK
    });
    const selectedId = result.selected?.question?.id;
    record(`${sample.name}: selected expected governed question`, sample.allowed.includes(selectedId), selectedId);
    if (sample.requiredType) {
      record(`${sample.name}: selected expected type`, result.selected.question.type === sample.requiredType, result.selected.question.type);
    }
    record(`${sample.name}: top 3 visible candidates available`, result.ranked.slice(0, 3).length === 3);
    record(`${sample.name}: selected reason available`, result.selected.reasons.length > 0);
  }
}

function checkSafetyText() {
  const forbidden = /you may have|you have|diagnos(?:e|is|tic)|treat(?:ment)? recommendation|take medication|antibiotic|cancer|infection likely|可能得了|診斷為|建議吃藥|需要做檢查/i;
  for (const question of QUESTION_BANK) {
    const text = [
      question.text,
      question.value,
      question.explanation,
      question.explanationTemplate,
      ...(question.options || [])
    ].join(" ");
    record(`question safety wording: ${question.id}`, !forbidden.test(text), text.match(forbidden)?.[0] || "");
  }

  const html = read("app/adaptive-intake/index.html");
  const app = read("app/adaptive-intake/adaptive-intake.js");
  record("UI includes version badge", /versionBadge/.test(html));
  record("UI keeps safety boundary out of the visible reminder strip", !/Synthetic demo only|No diagnosis, treatment, or triage/.test(html));
  record("UI defaults to Taiwan Traditional Chinese document language", /<html lang="zh-Hant">/.test(html));
  record("UI does not expose an English language switch", !/data-lang-option="en"|>English</.test(html));
  record("UI exposes Taiwan Traditional Chinese adaptive copy", /泌尿預診導航 V2|找下一題|模糊說法閘門/.test(html));
  record("UI tells multi-select users to press Next", /Select all that apply, then press Next|勾選完畢後請按下一步/.test(app));
  record("UI has multi-select submit control", /data-submit-multi/.test(app));
}

function checkRunbook() {
  const runbook = read("docs/v2-demo-freeze-runbook.md");
  record("runbook has first-principle section", /## First Principle/.test(runbook));
  record("runbook has backup plan", /## Backup Plan/.test(runbook));
  record("runbook has freeze criteria", /## Freeze Criteria/.test(runbook));
  record("runbook records Case A", /Case A: Nocturia/.test(runbook));
  record("runbook records Case B", /Case B: Dysuria/.test(runbook));
  record("runbook records Case C", /Case C: Ambiguous Pain/.test(runbook));
}

async function checkRoute() {
  const response = await request(baseUrl);
  record(`adaptive route returns HTTP 200: ${baseUrl}`, response.ok && response.statusCode === 200, response.error || `status=${response.statusCode}`);
  if (response.ok) {
    record("adaptive route has V2 Traditional Chinese title", /泌尿預診導航 V2/.test(response.body));
    record("adaptive route has typed fallback input", /transcriptInput/.test(response.body));
    record("adaptive route loads adaptive page script", /adaptive-intake\.js/.test(response.body));
  }
}

function printResults() {
  for (const item of checks) {
    const prefix = item.passed ? "ok" : "FAIL";
    const detail = item.detail ? ` - ${item.detail}` : "";
    console.log(`${prefix} ${item.name}${detail}`);
  }
  const failed = checks.filter((item) => !item.passed);
  if (failed.length) {
    console.error(`\nV2 freeze check failed: ${failed.length}/${checks.length} checks failed.`);
    process.exit(1);
  }
  console.log(`\nV2 freeze check passed: ${checks.length}/${checks.length} checks passed.`);
}

async function main() {
  checkFiles();
  checkQuestionBank();
  checkCases();
  checkSafetyText();
  checkRunbook();
  await checkRoute();
  printResults();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
