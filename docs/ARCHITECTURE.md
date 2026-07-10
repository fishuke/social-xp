# Architecture

The system map. Read this to know where a change belongs before writing code.
For the game mechanics themselves see [CORE-LOOP.md](CORE-LOOP.md); for hard
constraints see [GOLDEN-RULES.md](GOLDEN-RULES.md).

## Stack

Next.js 16 App Router (breaking changes vs training data: read
`node_modules/next/dist/docs/` before unfamiliar APIs) · React 19 ·
Tailwind 4 · Prisma 6 + Neon Postgres · next-auth v5 (JWT) · Vercel ·
web-push · Gemini via `@google/genai` · Resend mail · zod everywhere.

## Layers and dependency direction

Dependencies flow one way. A change in a lower layer must not require knowledge
of an upper one:

```
app/** (pages, server components)     components/** (client components)
        |                                    |
        v                                    v
lib/actions.ts, lib/admin-actions.ts   (server actions: the ONLY mutation path)
        |
        v
domain: lib/game.ts, lib/coach.ts, lib/account.ts, lib/payments/*, lib/push.ts, lib/mail.ts
        |
        v
data: lib/catalog.ts (validated content reads), lib/db.ts (Prisma client)
        |
        v
prisma/schema.prisma  ->  Neon Postgres
```

Rules the layering implies:

- Pages read via `lib/` helpers and mutate only by calling server actions.
  No hand-rolled fetch to internal API routes.
- API routes exist only where a server action can't work: webhooks
  (`app/api/webhooks/[provider]`), cron (`app/api/cron/reminders`), next-auth,
  and email verification links (`app/api/verify`).
- Client components never import server-only modules. Deliberately isomorphic
  modules: `lib/levels.ts`, `lib/i18n/config.ts`, `lib/content.ts` schemas.
- All external input (forms, DB JSON content, webhooks) is zod-validated at
  the boundary.

## Routing and i18n

Every page URL carries a locale prefix: `app/[lang]/...` with `LOCALES =
["en", "tr"]`. `proxy.ts` (Next 16's renamed middleware) redirects unprefixed
requests using cookie > Accept-Language > default, and sets the
`NEXT_LOCALE` cookie.

Route groups:

- `(site)`: marketing pages (landing, `/method`, `/privacy`, `/terms`).
- `(app)`: the product. `(tabs)` holds the five tabs (learn, chapters, coach,
  quotes, you); plus lesson player, onboarding, streak, paywall, auth pages,
  settings.
- `admin`: dashboard, content editor, users (gated by `User.role`).

i18n rules: user-facing strings come from `lib/i18n/dictionaries` (EN and TR,
always both) and render off the **URL locale**, never a stored default.
DB content is translated via the `*Translation` tables.

## Data model (prisma/schema.prisma)

| Model | Role |
|---|---|
| `User` | identity + game counters (totalXP, streakCount, lastGoalMetDate, streakShields, pace, timezone, isPremium) |
| `DailyState` | per-(user, local-date) daily loop state |
| `LessonCompletion`, `CollectedQuote` | progress + collection |
| `Course`, `Unit`, `Lesson`, `Quote` | DB-managed content (lesson steps as validated JSON) |
| `*Translation` (Course/Unit/Lesson/Quote) | TR content |
| `CoachSession` | speaking reps + Gemini scores |
| `PushSubscription` | per-device web push endpoints |
| `Subscription`, `PaymentEvent` | billing state + webhook archive |
| `AuthToken`, `AuthThrottle` | verify/reset tokens, login rate limiting |

## Auth

Anonymous-first: first visit creates a user row behind the `sx_uid` cookie.
Registering upgrades that same row (progress kept) to email+password via
next-auth v5 JWT sessions. Email verification, password reset, and DB-backed
login throttling are in place (`lib/auth.ts`, `lib/account.ts`).

## Integrations

- **Payments:** provider-agnostic `PaymentProvider` interface in
  `lib/payments`; Lemon Squeezy adapter today. Webhooks verify HMAC, archive
  to `PaymentEvent`, upsert `Subscription`, which drives `isPremium`.
  Unconfigured environments fall back to a dev mock (never in production).
- **Push:** `lib/push.ts` + hourly cron sending at each user's local reminder
  hour; dead endpoints pruned.
- **Coach:** `lib/coach.ts` sends audio to Gemini 2.5 Flash for scoring.
- **Mail:** `lib/mail.ts` via Resend; logs to console without `RESEND_API_KEY`.

## Environments

- Production: https://social-xp.vercel.app (Vercel project `social-xp`).
- **Dev and prod share one Neon database.** This is the sharpest edge in the
  repo: schema changes and seeds are production operations. See
  [GOLDEN-RULES.md](GOLDEN-RULES.md) rule 1.
- Env vars live in Vercel; pull with `./node_modules/.bin/vercel env pull`.
- `npx` is broken in this environment: use `npm run <script>` or
  `./node_modules/.bin/<tool>`.

## Verification harness

The feedback loop agents must close before any commit:

```
npm run build   # prisma generate + next build: what Vercel runs; green = deployable
npm run lint    # eslint
```

For pure refactors, `./node_modules/.bin/tsc --noEmit` + lint is an acceptable
fast gate, but anything touching a route, server action, or client/server
boundary needs the full build.
