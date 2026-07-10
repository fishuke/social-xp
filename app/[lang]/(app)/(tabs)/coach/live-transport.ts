// Transport boundary for the live scene. The session hook consumes this
// interface only; Gemini Live over an ephemeral token is the shipping
// implementation (EN + TR). A self-hosted full-duplex engine (NVIDIA
// PersonaPlex, EN only) is the planned second implementation and must slot in
// here without touching the hook or the screens.

import { base64ToPcm16 } from "./pcm-worklet";

export type LiveTransportCallbacks = {
  onOpen: () => void;
  /** Character audio ready to play (mono PCM16 at the given rate). */
  onAudioChunk: (pcm: Int16Array, sampleRate: number) => void;
  /** Fragment of what the user is saying (live caption). */
  onInputTranscription: (text: string) => void;
  /** Fragment of what the character is saying. */
  onOutputTranscription: (text: string) => void;
  /** The character finished a turn. */
  onTurnComplete: () => void;
  /** The user barged in; stop and flush playback. */
  onInterrupted: () => void;
  /** Server is about to drop the connection; end gracefully. */
  onGoAway: () => void;
  onError: (message: string) => void;
  onClose: () => void;
};

export type LiveTransport = {
  /** Sends one 16kHz mono PCM16 chunk, base64-encoded. */
  sendAudioChunk: (base64Pcm16: string) => void;
  /** Marks the mic stream as paused (mute). */
  sendAudioStreamEnd: () => void;
  /** Sends a stage direction to the character (never shown as dialog). */
  sendControl: (text: string) => void;
  close: () => void;
};

export type LiveGrant = { token: string; model: string };

const OUTPUT_SAMPLE_RATE = 24_000; // Gemini Live native-audio output rate

export async function connectGeminiLive(
  grant: LiveGrant,
  callbacks: LiveTransportCallbacks
): Promise<LiveTransport> {
  // Dynamic import: the SDK only loads for users who actually start a scene.
  const { GoogleGenAI, Modality } = await import("@google/genai");

  // Ephemeral tokens are v1alpha only, matching the server-side mint.
  const ai = new GoogleGenAI({ apiKey: grant.token, httpOptions: { apiVersion: "v1alpha" } });

  const session = await ai.live.connect({
    model: grant.model,
    // Everything real (persona, voice, transcription) is locked inside the
    // token's constraints; this minimal config just satisfies the API.
    config: { responseModalities: [Modality.AUDIO] },
    callbacks: {
      onopen: () => callbacks.onOpen(),
      onmessage: (message) => {
        if (message.goAway) callbacks.onGoAway();
        const content = message.serverContent;
        if (!content) return;
        if (content.interrupted) callbacks.onInterrupted();
        if (content.inputTranscription?.text) {
          callbacks.onInputTranscription(content.inputTranscription.text);
        }
        if (content.outputTranscription?.text) {
          callbacks.onOutputTranscription(content.outputTranscription.text);
        }
        for (const part of content.modelTurn?.parts ?? []) {
          if (part.inlineData?.data) {
            callbacks.onAudioChunk(base64ToPcm16(part.inlineData.data), OUTPUT_SAMPLE_RATE);
          }
        }
        if (content.turnComplete) callbacks.onTurnComplete();
      },
      onerror: (event) => callbacks.onError(event?.message ?? "live transport error"),
      onclose: () => callbacks.onClose(),
    },
  });

  return {
    sendAudioChunk: (data) =>
      session.sendRealtimeInput({ audio: { data, mimeType: "audio/pcm;rate=16000" } }),
    sendAudioStreamEnd: () => session.sendRealtimeInput({ audioStreamEnd: true }),
    sendControl: (text) =>
      session.sendClientContent({
        turns: [{ role: "user", parts: [{ text: `[control]${text}[/control]` }] }],
        turnComplete: true,
      }),
    close: () => session.close(),
  };
}
