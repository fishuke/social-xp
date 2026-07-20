import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // web-push uses Node crypto/https — keep it out of the bundle.
  serverExternalPackages: ["web-push"],
  experimental: {
    serverActions: {
      // Coach recordings arrive as ~2MB WAV blobs (60s, 16kHz mono PCM16).
      bodySizeLimit: "4mb",
      // Vercel preview deployments (and Deployment Protection in front of them)
      // rewrite the forwarded host so it no longer matches the request Origin.
      // Without this, Next aborts every Server Action POST - login, onboarding,
      // etc - leaving buttons stuck. Trust our own Vercel domains so previews
      // behave like production. Production already matches by same-origin.
      allowedOrigins: ["*.vercel.app"],
    },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        // The service worker must never be cached, or push updates go stale.
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" },
        ],
      },
    ];
  },
};

export default nextConfig;
