# Social XP

Duolingo-style app for training social skills — 3-minute lessons, one real-world rep a day, collectible quotes, XP, streaks and daily quests.

Built with **Next.js (App Router)**. The API lives in Next.js route handlers (`app/api/*`); persistence is **Prisma + Neon Postgres** (via the Vercel integration).

**Production: https://social-xp.vercel.app** (Vercel project `social-xp`, deploy with `npx vercel deploy --prod`).

The original design handover (all 16 annotated screens) is in [`design/Social XP - All Screens v2.dc.html`](design/Social%20XP%20-%20All%20Screens%20v2.dc.html).

## Getting started

```bash
npm install
# .env needs DATABASE_URL + DATABASE_URL_UNPOOLED (Neon) — pull with: npx vercel env pull
npx prisma db push   # sync schema to the database
npm run dev          # http://localhost:3000
```

First visit runs the onboarding flow and creates an anonymous user (cookie session). Delete the `sx_uid` cookie to start fresh. Local dev and production currently share the same Neon database — create a separate Neon branch for dev if that becomes a problem.

## Architecture

| Layer | Where | Notes |
|---|---|---|
| Screens | `app/**` | Server components for tabs; client components for lesson flow, onboarding, paywall |
| Mutations | `lib/actions.ts` | Typed Server Actions (zod-validated) — no hand-rolled fetch/API routes |
| Game logic | `lib/game.ts` | XP, streaks, quests, chests — explicit result types |
| Content access | `lib/catalog.ts` | DB reads with zod validation of lesson JSON |
| Auth | `lib/auth.ts` | next-auth v5, JWT sessions, credentials; anonymous users upgrade on register |
| Content | `lib/content.ts` | Courses → levels (A1/A2/B1) → chapters → lessons, quizzes, quotes |
| DB | `prisma/schema.prisma` | User, LessonCompletion, CollectedQuote, DailyState |
| Design tokens | `app/globals.css` | Colors, buttons, animations from the handover |

## Database

Neon Postgres, provisioned through the Vercel Marketplace integration. `DATABASE_URL` is the
pooled connection (runtime); `DATABASE_URL_UNPOOLED` is the direct one Prisma uses for
`db push`/migrations. Env vars live in the Vercel project — refresh locally with `npx vercel env pull`.

## Known MVP simplifications

- Auth: optional email+password accounts (next-auth JWT). Everyone starts anonymous; registering upgrades the same user row so progress is kept. Email verification, password reset, and login rate-limiting are in.
- Payments: Lemon Squeezy (merchant of record) behind a provider-agnostic adapter (`lib/payments`); checkout/webhooks are code-complete but not live yet (see the backlog).
- Streak share sends text (no generated image yet); "Save" on a quote shares/copies it.
- No daily lesson cap (product decision) — chapters still unlock sequentially; Premium unlocks all chapters, coach, and streak repair.
- Two courses ship in MVP: **Social Skills** (A1–B1, 6 units incl. backchanneling) and **Courage to Be Disliked** (A1, 2 units, Adlerian psychology). Course switcher lives on the Chapters screen.
- The full 37-unit curriculum roadmap (A1–C2, with can-do statements and shipped/planned status) lives in [`docs/CURRICULUM.md`](docs/CURRICULUM.md).
- Product plan, core-loop mechanics, architecture map, and the prioritized backlog live in [`docs/`](docs/README.md) — the system of record for how this repo is run.
- `/method` explains the evidence base (BST, CBT homework research, graded exposure, spaced retrieval). The expert-board line there is forward-looking copy — update it once professional review actually happens.
- Quote attributions must be editorially verified before launch (see handover).
