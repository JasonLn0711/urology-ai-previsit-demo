#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DEFAULT_ASR_PYTHON="/home/jnclaw/every_on_git_jnclaw/project_aura/.record/bin/python"
DEFAULT_MODEL_PATH="/home/jnclaw/.cache/huggingface/hub/models--SoybeanMilk--faster-whisper-Breeze-ASR-25/snapshots/85be11de5f67aaa6a92e931622f1c2b55cc1dd3a"

ASR_PYTHON="${UROLOGY_ASR_PYTHON:-$DEFAULT_ASR_PYTHON}"
export UROLOGY_ASR_MODEL_PATH="${UROLOGY_ASR_MODEL_PATH:-$DEFAULT_MODEL_PATH}"
export UROLOGY_ASR_HOST="${UROLOGY_ASR_HOST:-127.0.0.1}"
export UROLOGY_ASR_PORT="${UROLOGY_ASR_PORT:-8765}"

if [[ ! -x "$ASR_PYTHON" ]]; then
  echo "ASR Python is not executable: $ASR_PYTHON" >&2
  echo "Set UROLOGY_ASR_PYTHON to a Python environment with faster-whisper, ctranslate2, pydub, noisereduce, and numpy." >&2
  exit 1
fi

if [[ ! -d "$UROLOGY_ASR_MODEL_PATH" ]]; then
  echo "Local Breeze ASR model path not found: $UROLOGY_ASR_MODEL_PATH" >&2
  echo "This launcher does not download models. Set UROLOGY_ASR_MODEL_PATH to the local snapshot." >&2
  exit 1
fi

exec "$ASR_PYTHON" "$ROOT_DIR/scripts/asr/local_faster_whisper_server.py" "$@"
