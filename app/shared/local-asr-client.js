(function attachLocalAsrClient(root) {
  const DEFAULT_ENDPOINT = "http://127.0.0.1:8765";

  function baseUrl() {
    return String(root.UROLOGY_LOCAL_ASR_ENDPOINT || DEFAULT_ENDPOINT).replace(/\/$/, "");
  }

  function supported() {
    return Boolean(
      root.navigator &&
      root.navigator.mediaDevices &&
      root.navigator.mediaDevices.getUserMedia &&
      root.MediaRecorder &&
      root.fetch
    );
  }

  function encodedJsonHeader(value) {
    return encodeURIComponent(JSON.stringify(value));
  }

  async function readJsonResponse(response) {
    try {
      return await response.json();
    } catch (error) {
      throw new Error(`local ASR returned non-JSON response (${response.status})`);
    }
  }

  async function health() {
    const response = await root.fetch(`${baseUrl()}/health`, { method: "GET" });
    const payload = await readJsonResponse(response);
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || "local ASR health check failed");
    }
    if (payload.device !== "cuda" || payload.computeType !== "int8" || payload.noCpuFallback !== true) {
      throw new Error("local ASR server is not running in required cuda/int8/no-CPU mode");
    }
    return payload;
  }

  async function transcribeBlob(blob, metadata = {}) {
    if (!blob || !blob.size) throw new Error("empty audio");
    const headers = {
      "Content-Type": blob.type || "audio/webm",
      "X-Urology-Asr-Mode": metadata.mode || "",
      "X-Urology-Asr-Field": metadata.field || "",
      "X-Urology-Asr-Question": metadata.question || ""
    };
    if (metadata.options) {
      headers["X-Urology-Asr-Options"] = encodedJsonHeader(metadata.options);
    }

    const response = await root.fetch(`${baseUrl()}/transcribe`, {
      method: "POST",
      headers,
      body: blob
    });
    const payload = await readJsonResponse(response);
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || "local ASR transcription failed");
    }
    if (payload.device !== "cuda" || payload.computeType !== "int8" || payload.noCpuFallback !== true) {
      throw new Error("local ASR response did not prove cuda/int8/no-CPU mode");
    }
    return payload;
  }

  root.UrologyLocalAsr = {
    endpoint: baseUrl,
    supported,
    health,
    transcribeBlob
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
