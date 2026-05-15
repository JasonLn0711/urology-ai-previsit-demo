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

The browser records audio with `MediaRecorder`, sends the audio blob to the
local ASR server, and receives a transcript. Choice questions still accept only
visible answers through `core/speech_answer_matching`.
