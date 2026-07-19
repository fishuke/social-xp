<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Convozy: agent map

Duolingo-style app for training social skills: 3-minute lessons, one
real-world rep a day, XP, streaks, quests, chests, collectible quotes, an AI
speaking coach. Next.js 16 App Router + Prisma/Neon on Vercel.

This file is a map, not an encyclopedia. The system of record is
[`docs/`](docs/README.md); read the doc that matches your task before coding,
and update it in the same commit if your change makes it stale.

## Where to look

| Task | Read first |
|---|---|
| Deciding what to build | [docs/BACKLOG.md](docs/BACKLOG.md), [docs/PRODUCT-PLAN.md](docs/PRODUCT-PLAN.md) |
| Touching XP, streaks, quests, chests, reminders | [docs/CORE-LOOP.md](docs/CORE-LOOP.md) |
| Finding where code belongs | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| Any change at all (hard constraints) | [docs/GOLDEN-RULES.md](docs/GOLDEN-RULES.md) |
| Writing lesson content | [docs/CURRICULUM.md](docs/CURRICULUM.md) + `prisma/seed.ts` |
| Multi-session work | [docs/exec-plans/](docs/exec-plans/TEMPLATE.md) |
| Original visual design | `design/Social XP - All Screens v2.dc.html` (16 annotated screens) |

## Golden rules (summary; full list with reasoning in docs/GOLDEN-RULES.md)

- **Dev and prod share ONE Neon database.** Schema changes, `db push`, and
  seeds are production operations. Never run them casually.
- **No em-dashes.** Anywhere: code, comments, copy.
- **i18n always:** user-facing strings via `lib/i18n` dictionaries, EN + TR
  both, rendered off the URL locale.
- **Mutations only via server actions** (`lib/actions.ts`), zod-validated.
- **Daily logic uses the user's timezone** (`dayString`/`localParts` in
  `lib/game.ts`), never raw date math.
- **XP flows through `lib/game.ts` award helpers;** quizzes have 3-4 options
  with varied correct positions.
- **No new dependencies** unless essential and tiny. No secrets in git.
- **Commits:** one line, lowercase, never authored/co-authored as AI.

## Commands

```bash
npm run dev      # http://localhost:3000
npm run build    # prisma generate + next build; what Vercel runs
npm run lint
```

- Gate before every commit: `npm run build && npm run lint` green.
- `npx` is broken here: use `npm run <script>` or `./node_modules/.bin/<tool>`
  (prisma, vercel, tsx, tsc).
- Env: `./node_modules/.bin/vercel env pull` (needs `DATABASE_URL` +
  `DATABASE_URL_UNPOOLED`).

## Layout in one glance

```
app/[lang]/(site)   marketing: landing, /method, /privacy, /terms
app/[lang]/(app)    product: (tabs) learn|chapters|coach|quotes|you,
                    lesson player, onboarding, streak, paywall, auth, settings
app/[lang]/admin    dashboard, content editor, users (role-gated)
app/api             webhooks, cron, next-auth, verify (nothing else)
lib/                actions (mutations) -> game/coach/account/payments ->
                    catalog/db; content.ts = schemas + XP economy
components/         client components
prisma/             schema + seed (content authoring)
proxy.ts            locale routing (Next 16's middleware)
```
