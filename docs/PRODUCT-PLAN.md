# Social XP: Product Plan

One line: **Duolingo for social skills.** Three-minute lessons, one real-world
rep a day, XP, streaks, quests, chests, collectible quotes, and an AI speaking
coach.

## The problem and the bet

Social skills are learnable, but the existing options don't produce practice:
books and YouTube give knowledge without reps, therapy is expensive and aimed at
clinical needs, and "just put yourself out there" fails without graded steps.
The bet is that the habit mechanics that made Duolingo work for languages
(tiny daily sessions, streaks, variable rewards) can carry people through the
part that actually changes behavior: **doing one small real-world rep a day**.

The lesson is the vehicle; the rep is the product. Everything in the
[core loop](CORE-LOOP.md) exists to get the user to attempt today's challenge
in real life.

## Who it's for

Adults who feel behind socially and want a structured, private way to catch up:
the self-improvement audience that already buys habit apps, plus people with
mild social anxiety who are below the threshold of seeking therapy. Not a
clinical product and not positioned as one.

## Why it can win

- **Method, not vibes.** Lessons are built on behavioral skills training,
  CBT-style thought reframes, graded exposure, and spaced retrieval. The
  `/method` page documents the evidence base. (Its "expert board" line is
  forward-looking copy until a real review happens; see [BACKLOG.md](BACKLOG.md).)
- **A real curriculum.** CEFR-style progression from A1 survival skills to C2,
  with a can-do statement per lesson ([CURRICULUM.md](CURRICULUM.md)). Content
  depth is the moat; mechanics are table stakes.
- **The daily rep.** No competitor closes the loop from knowledge to a concrete
  real-world action with accountability mechanics attached.

## Product shape

Web-first PWA (installable, web push) at the center; the same app gets wrapped
for stores later (Android TWA, then iOS Capacitor, native client only if the
wrappers hit limits). Two locales, English and Turkish, from day one. Two
courses at MVP: **Social Skills** (the spine) and **Courage to Be Disliked**
(Adlerian companion course).

## Business model

Freemium subscription:

- **Free:** sequential chapter unlock, full daily loop (lesson, challenge,
  quests, chests, streak), 1 coach rep per day.
- **Premium:** all chapters unlocked, unlimited AI coach, streak repair.
- **Billing:** Lemon Squeezy as merchant of record (monthly and yearly plans,
  7-day trial). Chosen over direct Stripe because LS is the legal seller,
  handles global VAT/sales tax, and requires no company. Implemented behind a
  provider-agnostic adapter (`lib/payments`) so Stripe or StoreKit can slot in
  later. Checkout stays on the web even inside store wrappers (US-legal on both
  stores post-Epic; elsewhere the app shows "manage on the website").

## Launch phases

| Phase | Gate | Contents |
|---|---|---|
| 0. Alpha (now) | - | Friends testing on social-xp.vercel.app; polish quality |
| 1. Real launch | Domain purchased | Custom domain, verified mail (Resend), launch env vars, landing page polish, legal pages finalized |
| 2. Revenue | Phase 1 live | Lemon Squeezy store approved, checkout + webhooks live end to end |
| 3. Stores | Phase 2 stable | Android TWA, then iOS Capacitor shell with native push |
| 4. Data-driven content | Phase 1+ | Admin analytics dashboards; readjust lessons from funnel data; ship A2 units |

Current status and the concrete checklists live in [BACKLOG.md](BACKLOG.md).

## Metrics that matter

- **Retention first:** D1/D7 retention, streak length distribution, reminder
  opt-in rate. The reminder push is the top retention lever.
- **Learning quality:** lesson funnel (started vs claimed), quiz wrong-answer
  rates per step, post-lesson feel log (crushed / got it / shaky).
- **The point of the product:** daily challenge (rep) completion rate.
- **Revenue (phase 2+):** trial starts, trial-to-paid conversion, MRR, churn.

## Risks and watchouts

- Lemon Squeezy is Stripe-owned; their "Stripe Managed Payments" migration may
  shift the API contract. The adapter layer is the hedge.
- Quote attributions must be editorially verified before real launch.
- Dev and prod share one Neon database until a dev branch is split off
  (see [GOLDEN-RULES.md](GOLDEN-RULES.md) rule 1).
- Solo-built, agent-heavy development: quality is guarded by the harness
  (verification gates, golden rules, audits), not by review headcount.
