# Social XP — Roadmap / Next Steps

Ordered by value. Status: ⬜ todo · 🔨 in progress · ✅ done.

## 1. ⬜ Reminder notifications (top retention lever)
`User.reminderTime` is already collected and self-adjusts to when the user last
trained (Duolingo heuristic) — but nothing fires yet.
- Web: PWA + web-push (service worker, `Notification` permission prompt after first streak)
- Native later: expo/React Native wrapper or App Store build
- Copy: gentle, streak-aware ("Your 3-day streak has 6 hours left")

## 2. ⬜ More content — finish level A1
2 of 37 units shipped (see [CURRICULUM.md](CURRICULUM.md)). Next up, in order:
- Unit 3 · Conversation Mechanics 101 (v1 draft in git history — needs 3-min/reframe format)
- Unit 4 · Politeness Protocol
- Unit 5 · Emotion Recognition I
Author in `prisma/seed.ts` (zod-validated), tweak live in `/admin/content`.

## 3. ⬜ Auth hardening (before real launch)
- Password reset via email (needs a provider — Resend is the easy pick)
- Email verification on register
- Change-password UI (admin + demo passwords are currently fixed)
- Rate-limit login attempts

## 4. ⬜ Timezone-correct daily reset
Streaks/quests reset at **server** midnight. Store the user's IANA timezone at
onboarding (from `Intl.DateTimeFormat().resolvedOptions().timeZone`) and compute
`dayString` per user. `lib/game.ts` already isolates all date logic.

## 5. ⬜ Evidence-based rep-flow upgrades (from the research)
- **Behavioral experiments**: before the challenge, ask "what do you predict happens?";
  after marking done, "what actually happened?" — the predict→compare gap is the
  strongest confidence-builder in the exposure literature
- **If-then plans** (implementation intentions, d = 0.65): one-tap when/where picker
  on "I'm in — let's go" ("when I order coffee tomorrow…")
- **Spaced review**: practice mode that re-quizzes old lessons; checkpoints pull
  questions from the whole unit

## 6. ⬜ Payments
Paywall "Start 7-day free trial" just flips `isPremium`. Wire Stripe (web) or
StoreKit/RevenueCat (native). Keep the legal disclaimer on the paywall.

## 7. ⬜ Analytics
Feeds the "ship → readjust lessons from data" plan:
- Lesson funnel (started → step reached → claimed) to find abandoned steps
- Quiz wrong-answer rates per step (bad question or bad teaching?)
- `feelLog` (crushed/got-it/shaky) per lesson — shaky spikes = lesson needs work
- Plausible/PostHog or a simple events table + admin chart

## 8. ✅ Coach v2 (AI speaking practice)
Shipped: record ≤60s against a daily prompt → Gemini 2.5 Flash (audio-native)
scores confidence/clarity/energy/pace, counts fillers, gives "one thing to try"
(encouraging first, actionable always). Free: 1 rep/day; premium unlimited;
+15 XP for the first 3 reps/day. Needs `GEMINI_API_KEY` (~$0.002/session).
Later ideas: session history page, streak integration, roleplay mode (à la
Speeko Convos / Yoodli).

## 9. ⬜ Later / ideas
- Courage to Be Disliked course (v1 content in git history) — v3+
- Placement quiz at onboarding (skip confident users past A1)
- Elective tracks (Dating, Networking, Interviews) assembled from core units
- Quote-card share images (canvas render, 4:5)
- "Perfect day" streak flame variant when the challenge is also done
- Leaderboards / friends (explicitly out of MVP scope in the handover)
- Separate Neon branch for local dev (currently shares prod DB)
- Expert board review of lessons → update `/method` copy from "building" to "reviewed by"
- Editorial verification of all quote attributions (pre-launch requirement)

## Recently shipped ✅
DB-managed lessons + admin panel · next-auth JWT accounts (anonymous upgrade path) ·
server actions + zod end-to-end · chest system with variable rewards & streak shields ·
3-min lessons with CBT thought-reframes · Units 1–2 · Vercel + Neon deploy
