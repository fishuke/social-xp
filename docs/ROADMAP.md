# Social XP — Roadmap / Next Steps

Ordered by value. Status: ⬜ todo · 🔨 in progress · ✅ done.

## 1. ✅ Reminder notifications (top retention lever)
Shipped: PWA (manifest, icons, sw.js), per-device web-push subscriptions,
You-page toggle with test send, post-streak opt-in nudge, hourly Vercel cron
(`/api/cron/reminders`, CRON_SECRET) with streak-aware copy and dead-endpoint
pruning. E2E-verified against a sandbox stack.
- To go live: set `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`,
  `VAPID_SUBJECT`, `CRON_SECRET` in Vercel env, then deploy
- Native later: expo/React Native wrapper or App Store build
- Copy upgrade later: deadline-aware ("Your 3-day streak has 6 hours left")

## 2. ✅ More content: level A1 complete
All 5 A1 units shipped (30 lessons). Quizzes upgraded across the board:
3-4 options, varied correct-answer position, plausible distractors, no
em-dashes. Next content tier: A2 units 6-10 (see [CURRICULUM.md](CURRICULUM.md)).
Author in `prisma/seed.ts` (zod-validated), tweak live in `/admin/content`.

## 3. ✅ Auth hardening (before real launch)
Shipped: password reset via email (single-use 1h tokens, `/forgot-password`),
email verification on register (banner + resend, `/api/verify`), change-password
page (`/account/password`), login rate-limiting (5 fails / 15 min, DB-backed so
it survives serverless). Mail goes through Resend; without `RESEND_API_KEY`
mails log to the console (dev fallback). E2E-verified (14 checks).
- To go live: set `RESEND_API_KEY` + `MAIL_FROM` (verified domain) in Vercel

## 4. ✅ Timezone-correct daily reset
Shipped: `User.timezone` captured at onboarding and self-heals on every lesson
claim. Streaks, quests, chests, coach gating, and the reminder cron all key on
the user's local day/hour (`localParts` in `lib/game.ts`); users without a
stored zone fall back to server time. E2E-verified: an Auckland user's claim
lands on their calendar day, and the cron fires per-user local hour.

## 5. ⬜ Domain + production launch (prereq for payments)
Buy a real domain and point the Vercel deploy at it. Blocks everything below:
Lemon Squeezy store approval wants a live site with real product pages, Resend
needs a verified sending domain (`MAIL_FROM`), and the PWA/store wrappers need
a stable HTTPS origin.
- Buy domain, add to Vercel, set `NEXT_PUBLIC_APP_URL`
- Verify the domain at Resend, set `MAIL_FROM` (goodbye onboarding@resend.dev)
- Set the launch env vars: VAPID keys + `CRON_SECRET`, `RESEND_API_KEY`,
  `GEMINI_API_KEY`
- Landing page polish + privacy policy & terms pages (Lemon Squeezy checks
  these during store review)

## 6. 🔨 Payments: Lemon Squeezy (merchant of record)
Chosen over Stripe because LS is the merchant of record: they are the legal
seller, handle global VAT/sales tax, and individuals can sell without forming
a company. Pricing 5% + $0.50 per transaction, no monthly fee. (LS is
Stripe-owned now; watch their "Stripe Managed Payments" migration, the API
contract may shift.)

Code shipped behind a provider-agnostic adapter layer (`lib/payments`:
`PaymentProvider` interface + Lemon Squeezy adapter; Stripe/StoreKit slot in
later). Paywall opens the hosted checkout with `user_id` as custom data;
`/api/webhooks/[provider]` verifies the HMAC signature, archives every event
in `PaymentEvent` (feeds the #8 revenue dashboards), and upserts the
`Subscription` row that drives `isPremium`; the You page shows plan status
with a fresh customer-portal link per click. Unconfigured environments fall
back to the old dev mock (never in production).

To go live (after the domain, #5):
- Create the LS store + subscription product with monthly/yearly variants
  (7-day trial on both, to match the paywall copy)
- Run `prisma db push` for the `Subscription`/`PaymentEvent` tables
- Set env vars: `LEMONSQUEEZY_API_KEY`, `LEMONSQUEEZY_STORE_ID`,
  `LEMONSQUEEZY_WEBHOOK_SECRET`, `LEMONSQUEEZY_VARIANT_MONTHLY`,
  `LEMONSQUEEZY_VARIANT_YEARLY`, `NEXT_PUBLIC_APP_URL`
- Add the webhook in the LS dashboard: `<domain>/api/webhooks/lemonsqueezy`,
  subscribed to all `subscription_*` events
- Test end-to-end in LS test mode before flipping the store live
- Keep the paywall legal disclaimer; refunds live in the LS dashboard
- Mobile note: keep checkout on the web. In the US both stores now allow
  external purchase links for digital goods (post-Epic rulings); elsewhere the
  app can simply show premium as "manage on the website"

## 7. ⬜ Mobile release: iOS + Android
Ship the existing app to the stores without a rewrite, in phases:
- **Phase 1, Android**: TWA wrapper (PWABuilder/Bubblewrap) around the PWA.
  Play developer account is $25 one-time, individuals fine. Manifest, icons,
  and sw.js already shipped with the reminders work.
- **Phase 2, iOS**: Capacitor shell (WKWebView + native push via APNs) since
  Apple rejects bare website wrappers; native haptics/notifications plus the
  existing UI clears the minimum-functionality bar. Apple developer account
  $99/year, individuals fine.
- **Phase 3, later**: real React Native/Expo client against the same server
  actions turned API routes, only if the wrappers hit limits.
- Store-payment policy: digital-goods purchases via external web checkout are
  US-legal on both stores now (Google requires enrollment, fee 9-20%; Apple US
  allows external links). Simplest compliant v1: sell on the web, the app just
  unlocks premium.

## 8. ⬜ Admin dashboards + analytics
The admin panel exists (dashboard, content editor, users). Extend it into real
dashboards that feed the "ship, then readjust lessons from data" loop:
- Lesson funnel (started, step reached, claimed) to find abandoned steps
- Quiz wrong-answer rates per step (bad question or bad teaching?)
- Feel log (crushed/got-it/shaky) per lesson; shaky spikes = lesson needs work
- Revenue & subscriptions (from LS webhooks): MRR, trials, churn
- Retention: DAU, streak distribution, reminder opt-in rate, coach usage
- Implementation: simple events table + admin charts first; PostHog/Plausible
  only if the homegrown version starts hurting

## 9. ⬜ Evidence-based rep-flow upgrades (from the research)
- **Behavioral experiments**: before the challenge, ask "what do you predict
  happens?"; after marking done, "what actually happened?" The predict/compare
  gap is the strongest confidence-builder in the exposure literature.
- **If-then plans** (implementation intentions, d = 0.65): one-tap when/where
  picker on "I'm in, let's go" ("when I order coffee tomorrow...")
- **Spaced review**: practice mode that re-quizzes old lessons; checkpoints
  pull questions from the whole unit

## 10. ✅ Coach v2 (AI speaking practice)
Shipped: record ≤60s against a daily prompt → Gemini 2.5 Flash (audio-native)
scores confidence/clarity/energy/pace, counts fillers, gives "one thing to try"
(encouraging first, actionable always). Free: 1 rep/day; premium unlimited;
+15 XP for the first 3 reps/day. Needs `GEMINI_API_KEY` (~$0.002/session).
Later ideas: session history page, streak integration, roleplay mode (à la
Speeko Convos / Yoodli).

## 11. ⬜ Later / ideas
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
