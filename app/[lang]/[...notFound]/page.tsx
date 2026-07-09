import { notFound } from "next/navigation";

// Catch-all for any locale-prefixed path that matches no real route. The root
// layout is a dynamic segment ([lang]), so an unmatched URL would otherwise fall
// through to Next's default 404 instead of app/[lang]/not-found.tsx. Explicit
// routes always outrank this catch-all, so it only fires for genuinely unknown
// paths, handing them to the branded not-found boundary.
export default function CatchAllNotFound(): never {
  notFound();
}
