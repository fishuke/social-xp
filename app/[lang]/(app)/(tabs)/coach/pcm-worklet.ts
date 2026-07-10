// Client audio helpers for the live scene: an AudioWorklet that captures mic
// audio at the device rate and downsamples it to 16kHz PCM16 chunks (the
// format Gemini Live ingests), plus base64 <-> PCM16 codecs for the wire.
// The worklet ships as an inline Blob URL so no public/ asset is needed.

const CHUNK_SAMPLES = 2048; // ~128ms at 16kHz per posted chunk

// Runs in AudioWorkletGlobalScope: `sampleRate` there is the context (device)
// rate. Linear interpolation down to 16kHz; the fractional read cursor
// carries across 128-frame blocks so the resample stays continuous.
const WORKLET_SOURCE = `
class PcmCaptureProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = new Int16Array(${CHUNK_SAMPLES});
    this.filled = 0;
    this.readPos = 0;
  }
  process(inputs) {
    const channel = inputs[0] && inputs[0][0];
    if (!channel) return true;
    const ratio = sampleRate / 16000;
    let pos = this.readPos;
    while (pos < channel.length - 1) {
      const i = Math.floor(pos);
      const frac = pos - i;
      const sample = channel[i] * (1 - frac) + channel[i + 1] * frac;
      const clamped = Math.max(-1, Math.min(1, sample));
      this.buffer[this.filled++] = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
      if (this.filled === this.buffer.length) {
        this.port.postMessage(this.buffer.buffer.slice(0));
        this.filled = 0;
      }
      pos += ratio;
    }
    this.readPos = pos - channel.length;
    return true;
  }
}
registerProcessor("pcm-capture", PcmCaptureProcessor);
`;

export const PCM_WORKLET_NAME = "pcm-capture";

export function createPcmWorkletUrl(): string {
  return URL.createObjectURL(new Blob([WORKLET_SOURCE], { type: "application/javascript" }));
}

export function pcm16ToBase64(pcm: Int16Array): string {
  const bytes = new Uint8Array(pcm.buffer, pcm.byteOffset, pcm.byteLength);
  let binary = "";
  const step = 0x8000; // keeps String.fromCharCode off the arg-count limit
  for (let i = 0; i < bytes.length; i += step) {
    binary += String.fromCharCode(...bytes.subarray(i, i + step));
  }
  return btoa(binary);
}

export function base64ToPcm16(b64: string): Int16Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Int16Array(bytes.buffer);
}
