# Social XP

Duolingo-style app for training social skills — 3-minute lessons, one real-world rep a day, collectible quotes, XP, streaks and daily quests.

Built with **Next.js (App Router)**. The API lives in Next.js route handlers (`app/api/*`); persistence is **Prisma + Neon Postgres** (via the Vercel integration).

**Production: https://social-xp.vercel.app** (Vercel project `social-xp`, deploy with `npx vercel deploy --prod`).

The original design handover (all 16 annotated screens) is in [`design/HANDOVER.md`](design/HANDOVER.md).

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
| API | `app/api/*` | onboarding, lesson/complete, rep/complete, chest, course, premium |
| Game logic | `lib/game.ts` | XP, streaks, daily quests, gating — shared by API + server pages |
| Content | `lib/content.ts` | Courses → levels (A1/A2/B1) → chapters → lessons, quizzes, quotes |
| DB | `prisma/schema.prisma` | User, LessonCompletion, CollectedQuote, DailyState |
| Design tokens | `app/globals.css` | Colors, buttons, animations from the handover |

## Database

Neon Postgres, provisioned through the Vercel Marketplace integration. `DATABASE_URL` is the
pooled connection (runtime); `DATABASE_URL_UNPOOLED` is the direct one Prisma uses for
`db push`/migrations. Env vars live in the Vercel project — refresh locally with `npx vercel env pull`.

## Known MVP simplifications

- No real auth — anonymous cookie user (swap in real auth before multi-device).
- Paywall "Start free trial" just flags `isPremium` — wire StoreKit/Stripe later.
- Daily reset uses server-local midnight, not the user's timezone.
- Streak share sends text (no generated image yet); "Save" on a quote shares/copies it.
- No daily lesson cap (product decision) — chapters still unlock sequentially; Premium unlocks all chapters, coach, and streak repair.
- Two courses ship in MVP: **Social Skills** (A1–B1, 6 units incl. backchanneling) and **Courage to Be Disliked** (A1, 2 units, Adlerian psychology). Course switcher lives on the Chapters screen.
- The full 37-unit curriculum roadmap (A1–C2, with can-do statements and shipped/planned status) lives in [`docs/CURRICULUM.md`](docs/CURRICULUM.md).
- `/method` explains the evidence base (BST, CBT homework research, graded exposure, spaced retrieval). The expert-board line there is forward-looking copy — update it once professional review actually happens.
- Quote attributions must be editorially verified before launch (see handover).
