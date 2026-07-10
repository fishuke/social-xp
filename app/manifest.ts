import type { MetadataRoute } from "next";

// Web app manifest (Next auto-injects <link rel="manifest">). Makes Social XP
// installable to the home screen - required for iOS web-push.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Social XP",
    short_name: "Social XP",
    description: "Social skills are just reps. 3 minutes a day.",
    start_url: "/coach",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FFF6EE",
    theme_color: "#FFF6EE",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
