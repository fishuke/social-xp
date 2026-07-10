# Backlog

The committed source of "what next", ordered by value within each horizon.
Strategy and phases live in [PRODUCT-PLAN.md](PRODUCT-PLAN.md); content roadmap
in [CURRICULUM.md](CURRICULUM.md).

Definition of done for any item: build + lint green, [golden
rules](GOLDEN-RULES.md) respected, and docs updated if behavior they describe
changed. Big items get an [exec plan](exec-plans/) before work starts.

Status: ⬜ todo · 🔨 in progress · ✅ shipped

---

## Now: launch

### 🔨 Coach-first repositioning
Exec plan: [exec-plans/coach-first.md](exec-plans/coach-first.md). Alpha
feedback says the coach is the product: scenario reps (pick your dread, a
character talks, you answer out loud), a Wordle-style daily scenario for
everyone, live multi-turn roleplay as the premium wow. Coach becomes the home
tab; lessons stay as the supporting skill tree. Model decision (2026-07-10):
stay on Gemini (GPT-Live has no API yet; Gemini Live is cheaper and already
integrated).

### ⬜ Domain + production launch (blocks payments)
Prereq: pick the new name first ([NAMING.md](NAMING.md); front-runner Enheart,
enheart.app). Buy the domain and point the Vercel deploy at it. Blocks
everything below:
Lemon Squeezy store approval wants a live site with real product pages, Resend
needs a verified sending domain (`MAIL_FROM`), and the PWA/store wrappers need
a stable HTTPS origin.
- Buy domain, add to Vercel, set `NEXT_PUBLIC_APP_URL`
- Verify the domain at Resend, set `MAIL_FROM` (goodbye onboarding@resend.dev)
- Set the launch env vars: VAPID keys + `CRON_SECRET` (reminders),
  `RESEND_API_KEY` (mail), `GEMINI_API_KEY` (coach)
- Landing page polish. Privacy (`/privacy`) & terms (`/terms`) pages are
  shipped (Lemon Squeezy checks these during store review); update the
  `SUPPORT_EMAIL` placeholder in both once the domain exists
- Editorial verification of all quote attributions (pre-launch requirement)

### 🔨 Payments go-live: Lemon Squeezy (merchant of record)
Chosen over Stripe because LS is the merchant of record: they are the legal
seller, handle global VAT/sales tax, and individuals can sell without forming
a company. Pricing 5% + $0.50 per transaction, no monthly fee. (LS is
Stripe-owned now; watch their "Stripe Managed Payments" migration, the API
contract may shift.)

Code is shipped behind a provider-agnostic adapter layer (`lib/payments`:
`PaymentProvider` interface + Lemon Squeezy adapter; Stripe/StoreKit slot in
later). Paywall opens the hosted checkout with `user_id` as custom data;
`/api/webhooks/[provider]` verifies the HMAC signature, archives every event
in `PaymentEvent` (feeds the analytics dashboards item), and upserts the
`Subscription` row that drives `isPremium`; the You page shows plan status
with a fresh customer-portal link per click. Unconfigured environments fall
back to the old dev mock (never in production).

To go live (after the domain):
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

## Next

### ⬜ Mobile release: iOS + Android
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

### ⬜ Admin dashboards + analytics
Exec plan: [exec-plans/admin-analytics.md](exec-plans/admin-analytics.md).
The admin panel exists (dashboard, content editor, users). Extend it into real
dashboards that feed the "ship, then readjust lessons from data" loop:
- Lesson funnel (started, step reached, claimed) to find abandoned steps
- Quiz wrong-answer rates per step (bad question or bad teaching?)
- Feel log (crushed/got-it/shaky) per lesson; shaky spikes = lesson needs work
- Revenue & subscriptions (from LS webhooks): MRR, trials, churn
- Retention: DAU, streak distribution, reminder opt-in rate, coach usage
- Implementation: simple events table + admin charts first; PostHog/Plausible
  only if the homegrown version starts hurting

### ⬜ Evidence-based rep-flow upgrades (from the research)
- **Behavioral experiments**: before the challenge, ask "what do you predict
  happens?"; after marking done, "what actually happened?" The predict/compare
  gap is the strongest confidence-builder in the exposure literature.
- **If-then plans** (implementation intentions, d = 0.65): one-tap when/where
  picker on "I'm in, let's go" ("when I order coffee tomorrow...")
- **Spaced review**: practice mode that re-quizzes old lessons; checkpoints
  pull questions from the whole unit

### ⬜ More content: A2 units 6-10
A1 is complete (5 units, 30 lessons). Next tier per
[CURRICULUM.md](CURRICULUM.md): Small Talk Engine, Sounds of Listening,
Compliments, Digital Basics, Graceful Exits. Author in `prisma/seed.ts`
(zod-validated), tweak live in `/admin/content`.

## Later / ideas

- Courage to Be Disliked course expansion (v1 content in git history)
- Placement quiz at onboarding (skip confident users past A1)
- Elective tracks (Dating, Networking, Interviews) assembled from core units
- Quote-card share images (canvas render, 4:5)
- "Perfect day" streak flame variant when the challenge is also done
- Leaderboards / friends (explicitly out of MVP scope in the handover)
- Separate Neon branch for local dev (currently shares prod DB; golden rule 1)
- Expert board review of lessons, then update `/method` copy from "building"
  to "reviewed by"
- Reminder copy upgrade: deadline-aware ("Your 3-day streak has 6 hours left")
- Coach: full session history page (roleplay + streak integration moved to
  the coach-first exec plan)

## Shipped

- ✅ **Reminder notifications** (top retention lever): PWA + per-device web
  push, You-page toggle with test send, hourly streak-aware cron
  (`/api/cron/reminders`). Go-live env vars are in the domain-launch item.
- ✅ **A1 content complete**: all 5 units / 30 lessons, quiz quality pass.
- ✅ **Auth hardening**: password reset, email verification, change-password,
  DB-backed login rate-limiting; mail via Resend with console dev fallback.
- ✅ **Timezone-correct daily reset**: `User.timezone` captured and
  self-healing; all daily logic keys on the user's local day.
- ✅ **Coach v2 (AI speaking practice)**: record up to 60s, Gemini 2.5 Flash
  scores confidence/clarity/energy/pace + fillers, "one thing to try".
  Free 1 rep/day, premium unlimited, +15 XP for first 3/day (~$0.002/session).
- ✅ **Payments code** behind the adapter (see the go-live item above).
- ✅ Earlier: DB-managed lessons + admin panel · next-auth JWT accounts
  (anonymous upgrade path) · server actions + zod end-to-end · chest system
  with variable rewards & streak shields · 3-min lessons with CBT
  thought-reframes · Vercel + Neon deploy · Turkish i18n · harness docs
  (this structure).
