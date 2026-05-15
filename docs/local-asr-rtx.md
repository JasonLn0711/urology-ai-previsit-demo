# Local RTX ASR

This demo uses the local `SoybeanMilk/faster-whisper-Breeze-ASR-25` snapshot for
ASR. The server does not download the model.

## Runtime Rule

The ASR backend is intentionally strict:

```text
model: SoybeanMilk/faster-whisper-Breeze-ASR-25
device: cuda
compute_type: int8
GPU: RTX required
CPU fallback: disabled
```

If CUDA, RTX detection, CTranslate2 CUDA visibility, the local model path, or
`compute_type=int8` model loading fails, the ASR server exits. The patient can
still type or click answers in the browser, but ASR inference must not silently
fall back to CPU.

## Local Paths

Default Python environment:

```text
/home/jnclaw/every_on_git_jnclaw/project_aura/.record/bin/python
```

Default model snapshot:

```text
/home/jnclaw/.cache/huggingface/hub/models--SoybeanMilk--faster-whisper-Breeze-ASR-25/snapshots/85be11de5f67aaa6a92e931622f1c2b55cc1dd3a
```

Override only when the local machine layout changes:

```bash
export UROLOGY_ASR_PYTHON=/path/to/python
export UROLOGY_ASR_MODEL_PATH=/path/to/local/faster-whisper-Breeze-ASR-25/snapshot
```

## Commands

Check RTX/int8 ASR startup:

```bash
npm run asr:check
```

Start the ASR server:

```bash
npm run asr:local
```

Default endpoint:

```text
http://127.0.0.1:8765
```

Health check:

```bash
curl http://127.0.0.1:8765/health
```

The health payload must include:

```json
{
  "device": "cuda",
  "computeType": "int8",
  "noCpuFallback": true
}
```

## Demo Flow

Run both local services:

```bash
npm run asr:local
npm start
```

Open:

```text
http://localhost:4173/app/adaptive-intake/
http://localhost:4173/app/patient-short/
```

The adaptive intake route uses a browser-side VAD loop for short answer
segments:

1. The patient starts ASR from the question page.
2. The browser records the original microphone audio with `MediaRecorder`.
3. A Web Audio analyser reads RMS / dBFS levels for VAD only.
4. After speech starts, `0.5` seconds of silence ends the segment.
5. The original audio blob is sent to the local ASR server.
6. The local ASR server applies fixed audio preprocessing:
   `noisereduce` light denoise, then `-20 dBFS` volume normalization.
7. The transcript is matched only against the current question's visible
   choices through `core/speech_answer_matching`.
8. A reliable match is selected on screen and then submitted automatically.

This design references Project AURA's live-capture pattern: short speech
segments, silence-boundary flushing, and a target `-20 dBFS` level as an
operational calibration point. It also borrows Project AURA's imported-audio
preprocessing order: denoise first, then normalization, then ASR. This urology
demo deliberately does not expose normalization or denoise controls in the UI;
the local ASR server always runs the fixed policy internally.
