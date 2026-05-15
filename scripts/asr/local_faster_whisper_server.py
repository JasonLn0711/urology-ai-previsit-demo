#!/usr/bin/env python3
"""Local RTX-only faster-whisper ASR server for the urology demo.

This server intentionally has no CPU fallback. If CUDA, an RTX GPU, the local
model snapshot, or int8 faster-whisper loading fails, startup fails.
"""

from __future__ import annotations

import argparse
import glob
import json
import os
import shutil
import site
import subprocess
import sys
import tempfile
import time
from ctypes import CDLL, RTLD_GLOBAL
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import urlparse


MODEL_REPO = "SoybeanMilk/faster-whisper-Breeze-ASR-25"
MODEL_CACHE_DIR = Path.home() / ".cache/huggingface/hub/models--SoybeanMilk--faster-whisper-Breeze-ASR-25"
DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 8765
DEVICE = "cuda"
COMPUTE_TYPE = "int8"
MAX_AUDIO_BYTES = 50 * 1024 * 1024

CUDA_RUNTIME_GLOBS = (
    "nvidia/cuda_runtime/lib/libcudart.so*",
    "nvidia/cublas/lib/libcublas.so*",
    "nvidia/cublas/lib/libcublasLt.so*",
    "nvidia/cudnn/lib/libcudnn*.so*",
)
CUDA_REQUIRED_LIBS = ("libcublas.so.12", "libcublasLt.so.12")

INITIAL_PROMPT = (
    "病人正在以台灣使用的繁體中文回答泌尿科門診前問題。"
    "請轉錄病人實際說出的答案，不要補診斷，不要補治療建議。"
)


def json_response(handler: BaseHTTPRequestHandler, status: int, payload: dict[str, Any]) -> None:
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(body)))
    handler.send_header("Access-Control-Allow-Origin", "*")
    handler.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    handler.send_header(
        "Access-Control-Allow-Headers",
        "Content-Type, X-Urology-Asr-Mode, X-Urology-Asr-Field, X-Urology-Asr-Question, X-Urology-Asr-Options",
    )
    handler.end_headers()
    handler.wfile.write(body)


def candidate_site_packages() -> list[str]:
    py_ver = f"python{sys.version_info.major}.{sys.version_info.minor}"
    candidates: list[str] = []
    try:
        candidates.extend(site.getsitepackages())
    except Exception:
        pass
    try:
        user_site = site.getusersitepackages()
        if user_site:
            candidates.append(user_site)
    except Exception:
        pass

    candidates.extend(
        [
            os.path.join(sys.prefix, "lib", py_ver, "site-packages"),
            os.path.join(os.path.dirname(sys.executable), "..", "lib", py_ver, "site-packages"),
        ]
    )

    extra = os.environ.get("UROLOGY_ASR_EXTRA_SITE_PACKAGES", "")
    candidates.extend([item for item in extra.split(os.pathsep) if item])

    normalized: list[str] = []
    seen: set[str] = set()
    for path in candidates:
        real_path = os.path.realpath(path)
        if real_path not in seen and os.path.isdir(real_path):
            seen.add(real_path)
            normalized.append(real_path)
    return normalized


def preload_cuda_runtime_libraries() -> str:
    try:
        for lib_name in CUDA_REQUIRED_LIBS:
            CDLL(lib_name, mode=RTLD_GLOBAL)
        return "system"
    except OSError:
        pass

    seen: set[str] = set()
    for base in candidate_site_packages():
        for pattern in CUDA_RUNTIME_GLOBS:
            for path in sorted(glob.glob(os.path.join(base, pattern))):
                real_path = os.path.realpath(path)
                if real_path in seen:
                    continue
                seen.add(real_path)
                try:
                    CDLL(real_path, mode=RTLD_GLOBAL)
                except OSError:
                    continue

    for lib_name in CUDA_REQUIRED_LIBS:
        CDLL(lib_name, mode=RTLD_GLOBAL)
    return "bundled"


def gpu_names_from_nvidia_smi() -> list[str]:
    if not shutil.which("nvidia-smi"):
        raise RuntimeError("nvidia-smi not found; RTX GPU inference cannot be verified")
    result = subprocess.run(
        ["nvidia-smi", "--query-gpu=name", "--format=csv,noheader"],
        check=True,
        text=True,
        capture_output=True,
        timeout=8,
    )
    names = [line.strip() for line in result.stdout.splitlines() if line.strip()]
    if not names:
        raise RuntimeError("nvidia-smi returned no GPU names")
    if not any("RTX" in name.upper() for name in names):
        raise RuntimeError(f"RTX GPU is required; detected GPU(s): {', '.join(names)}")
    return names


def resolve_model_path() -> Path:
    override = os.environ.get("UROLOGY_ASR_MODEL_PATH")
    if override:
        path = Path(override).expanduser().resolve()
        if not path.exists():
            raise RuntimeError(f"UROLOGY_ASR_MODEL_PATH does not exist: {path}")
        return validate_model_path(path)

    ref_path = MODEL_CACHE_DIR / "refs/main"
    if ref_path.exists():
        commit = ref_path.read_text(encoding="utf-8").strip()
        if commit:
            candidate = MODEL_CACHE_DIR / "snapshots" / commit
            if candidate.exists():
                return validate_model_path(candidate.resolve())

    snapshots = sorted((MODEL_CACHE_DIR / "snapshots").glob("*"), key=lambda item: item.stat().st_mtime, reverse=True)
    for candidate in snapshots:
        if candidate.is_dir():
            try:
                return validate_model_path(candidate.resolve())
            except RuntimeError:
                continue
    raise RuntimeError(f"Local model snapshot not found for {MODEL_REPO}; no download will be attempted")


def validate_model_path(path: Path) -> Path:
    required = ("config.json", "model.bin", "tokenizer.json", "vocabulary.json")
    missing = [name for name in required if not (path / name).exists()]
    if missing:
        raise RuntimeError(f"Model path is missing required file(s): {', '.join(missing)} at {path}")
    return path


def load_model(model_path: Path):
    cuda_runtime_source = preload_cuda_runtime_libraries()
    import ctranslate2
    from faster_whisper import WhisperModel

    cuda_devices = ctranslate2.get_cuda_device_count()
    if cuda_devices < 1:
        raise RuntimeError("ctranslate2 cannot see a CUDA device; refusing CPU inference")

    model = WhisperModel(str(model_path), device=DEVICE, compute_type=COMPUTE_TYPE)
    return model, cuda_runtime_source, ctranslate2.__version__, cuda_devices


def suffix_for_content_type(content_type: str) -> str:
    lowered = content_type.lower()
    if "wav" in lowered:
        return ".wav"
    if "mpeg" in lowered or "mp3" in lowered:
        return ".mp3"
    if "ogg" in lowered:
        return ".ogg"
    if "mp4" in lowered or "m4a" in lowered:
        return ".m4a"
    return ".webm"


class LocalAsrServer(ThreadingHTTPServer):
    def __init__(self, address: tuple[str, int], handler_class: type[BaseHTTPRequestHandler], args: argparse.Namespace):
        self.model_path = resolve_model_path()
        self.gpu_names = gpu_names_from_nvidia_smi()
        self.model, self.cuda_runtime_source, self.ctranslate2_version, self.cuda_devices = load_model(self.model_path)
        self.language = args.language
        self.beam_size = args.beam_size
        super().__init__(address, handler_class)

    def health_payload(self) -> dict[str, Any]:
        return {
            "ok": True,
            "modelRepo": MODEL_REPO,
            "modelPath": str(self.model_path),
            "device": DEVICE,
            "computeType": COMPUTE_TYPE,
            "gpuNames": self.gpu_names,
            "cudaDevices": self.cuda_devices,
            "cudaRuntimeSource": self.cuda_runtime_source,
            "ctranslate2": self.ctranslate2_version,
            "noCpuFallback": True,
        }


class LocalAsrHandler(BaseHTTPRequestHandler):
    server: LocalAsrServer

    def log_message(self, fmt: str, *args: Any) -> None:
        sys.stderr.write(f"[local-asr] {self.address_string()} - {fmt % args}\n")

    def do_OPTIONS(self) -> None:
        json_response(self, 200, {"ok": True})

    def do_GET(self) -> None:
        path = urlparse(self.path).path
        if path == "/health":
            json_response(self, 200, self.server.health_payload())
            return
        json_response(self, 404, {"ok": False, "error": "not-found"})

    def do_POST(self) -> None:
        path = urlparse(self.path).path
        if path != "/transcribe":
            json_response(self, 404, {"ok": False, "error": "not-found"})
            return

        try:
            content_length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            json_response(self, 400, {"ok": False, "error": "invalid-content-length"})
            return

        if content_length <= 0:
            json_response(self, 400, {"ok": False, "error": "empty-audio"})
            return
        if content_length > MAX_AUDIO_BYTES:
            json_response(self, 413, {"ok": False, "error": "audio-too-large"})
            return

        audio_bytes = self.rfile.read(content_length)
        content_type = self.headers.get("Content-Type", "audio/webm")
        suffix = suffix_for_content_type(content_type)

        started = time.perf_counter()
        with tempfile.NamedTemporaryFile(prefix="urology-asr-", suffix=suffix, delete=False) as audio_file:
            audio_file.write(audio_bytes)
            audio_path = Path(audio_file.name)

        try:
            segments, info = self.server.model.transcribe(
                str(audio_path),
                language=self.server.language,
                task="transcribe",
                beam_size=self.server.beam_size,
                vad_filter=True,
                condition_on_previous_text=False,
                initial_prompt=INITIAL_PROMPT,
            )
            segment_payload = [
                {
                    "start": segment.start,
                    "end": segment.end,
                    "text": segment.text,
                    "avgLogprob": getattr(segment, "avg_logprob", None),
                    "noSpeechProb": getattr(segment, "no_speech_prob", None),
                }
                for segment in segments
            ]
            text = "".join(segment["text"] for segment in segment_payload).strip()
            elapsed_ms = round((time.perf_counter() - started) * 1000)
            json_response(
                self,
                200,
                {
                    "ok": True,
                    "text": text,
                    "segments": segment_payload,
                    "language": getattr(info, "language", self.server.language),
                    "languageProbability": getattr(info, "language_probability", None),
                    "duration": getattr(info, "duration", None),
                    "elapsedMs": elapsed_ms,
                    **self.server.health_payload(),
                },
            )
        except Exception as exc:
            json_response(
                self,
                500,
                {
                    "ok": False,
                    "error": str(exc),
                    "device": DEVICE,
                    "computeType": COMPUTE_TYPE,
                    "noCpuFallback": True,
                },
            )
        finally:
            try:
                audio_path.unlink()
            except OSError:
                pass


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run the local RTX-only faster-whisper ASR server.")
    parser.add_argument("--host", default=os.environ.get("UROLOGY_ASR_HOST", DEFAULT_HOST))
    parser.add_argument("--port", type=int, default=int(os.environ.get("UROLOGY_ASR_PORT", DEFAULT_PORT)))
    parser.add_argument("--language", default=os.environ.get("UROLOGY_ASR_LANGUAGE", "zh"))
    parser.add_argument("--beam-size", type=int, default=int(os.environ.get("UROLOGY_ASR_BEAM_SIZE", "5")))
    parser.add_argument("--check", action="store_true", help="Load the GPU model, print health JSON, and exit.")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or sys.argv[1:])
    server = LocalAsrServer((args.host, args.port), LocalAsrHandler, args)
    if args.check:
        print(json.dumps(server.health_payload(), ensure_ascii=False, indent=2))
        server.server_close()
        return 0

    print(json.dumps(server.health_payload(), ensure_ascii=False), flush=True)
    print(f"Local ASR server listening on http://{args.host}:{args.port}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
