const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function loadClient(fetchImpl) {
  const source = fs.readFileSync(path.join(__dirname, "../../app/shared/local-asr-client.js"), "utf8");
  const root = {
    navigator: { mediaDevices: { getUserMedia() {} } },
    MediaRecorder: function MediaRecorder() {},
    fetch: fetchImpl,
    console
  };
  vm.runInNewContext(source, root);
  return root.UrologyLocalAsr;
}

test("local ASR client encodes non-ASCII options before putting them in headers", async () => {
  let capturedHeaders = null;
  const client = loadClient(async (url, request) => {
    capturedHeaders = request.headers;
    return {
      ok: true,
      status: 200,
      async json() {
        return { ok: true, device: "cuda", computeType: "int8", noCpuFallback: true, text: "" };
      }
    };
  });

  await client.transcribeBlob(
    { size: 1024, type: "audio/webm" },
    {
      mode: "adaptive-intake-vad",
      field: "primaryConcern",
      question: "compact_primary_concern",
      options: [["頻尿、夜尿或急尿", "頻尿、夜尿或急尿"]]
    }
  );

  assert.match(capturedHeaders["X-Urology-Asr-Options"], /^[\x00-\x7f]+$/);
  assert.deepEqual(JSON.parse(decodeURIComponent(capturedHeaders["X-Urology-Asr-Options"])), [
    ["頻尿、夜尿或急尿", "頻尿、夜尿或急尿"]
  ]);
});
