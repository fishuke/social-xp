# Golden Rules

Hard constraints. Every change, human- or agent-authored, must respect these.
They are versioned here precisely so no one has to remember them; if a rule
needs to change, change this file in the same commit and say why in the
changelog at the bottom.

1. **One database.** Dev and prod share a single Neon Postgres. Treat
   `prisma/schema.prisma` edits, `prisma db push`, and seed runs as production
   operations: deliberate, human-triggered, never done casually or by
   autonomous loops.

2. **No em-dashes.** Anywhere. Code, comments, copy, docs. Use commas, colons,
   parentheses, or plain hyphens.

3. **i18n or it doesn't ship.** User-facing strings go through the
   `lib/i18n` dictionaries, in **both English and Turkish**, and render off the
   URL locale (`[lang]` param), never off a stored user default.

4. **Mutations only via server actions** (`lib/actions.ts`,
   `lib/admin-actions.ts`), zod-validated. No new REST endpoints except
   webhooks, cron, and auth callbacks.

5. **User-local time for anything daily.** "Today" comes from `dayString()` /
   `localParts()` with `User.timezone`. Never inline date math for streaks,
   quests, chests, coach gating, or reminders.

6. **The XP economy has one write path.** New XP sources flow through the
   award helpers in `lib/game.ts` (never increment `totalXP` directly), and
   respect the [core loop guardrails](CORE-LOOP.md#design-guardrails):
   streak needs only one lesson, challenges never punish, chests are never
   paid.

7. **Quizzes: 3-4 options,** correct answer in varied positions, plausible
   distractors.

8. **Payments only through the adapter.** All billing code goes via the
   `PaymentProvider` interface in `lib/payments`; no provider API calls inline
   in pages or actions.

9. **Content is data.** Lessons are authored in `prisma/seed.ts`
   (zod-validated) and tweaked live in `/admin/content`. Never delete
   user-facing content or user data.

10. **Zero new dependencies** unless essential and tiny. Prefer the platform.

11. **No secrets in git.** `.env*` stays untracked; new env vars get added in
    Vercel and documented in the relevant doc.

12. **Commits:** one line, lowercase, plain description. Never author or
    co-author commits or PRs as Claude/AI.

13. **Green gate before commit:** `npm run build` and `npm run lint` must
    pass. (`./node_modules/.bin/tsc --noEmit` + lint acceptable for pure
    refactors; see [ARCHITECTURE.md](ARCHITECTURE.md#verification-harness).)

14. **This is Next.js 16.** APIs differ from training data; check
    `node_modules/next/dist/docs/` before using an unfamiliar API.

## Changelog

- 2026-07-10: initial version, extracted from the README and prior local agent
  rules as part of adopting the harness-engineering doc structure.
