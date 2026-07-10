# Exec plan: admin dashboards + analytics

## Goal

The admin panel answers, from real data: where do learners drop out of
lessons, which quiz steps are broken, is retention improving, and (post
payments go-live) what is revenue doing. This feeds the "ship, then readjust
lessons from data" loop in [PRODUCT-PLAN.md](../PRODUCT-PLAN.md). Homegrown
first: an events table plus admin chart pages; a third-party analytics tool
only if this starts hurting.

## Context

- Backlog item: [BACKLOG.md](../BACKLOG.md#-admin-dashboards--analytics)
- Metrics definitions: [PRODUCT-PLAN.md](../PRODUCT-PLAN.md#metrics-that-matter)
- Golden rules at risk:
  - Rule 1 (shared DB): step 1 adds a model; `prisma db push` is a deliberate
    human-run production operation.
  - Rule 4: event writes ride existing server actions, no new endpoints.
  - Rule 10: no charting library unless truly needed; CSS/SVG bars first.

## Out of scope

- Client-side pageview tracking, cookies, consent banners (server events only)
- PostHog/Plausible integration
- Public/user-facing stats

## Steps

1. ⬜ **Event model + write helper.** Add `AppEvent` (id, userId, type,
   payload Json, createdAt, index on `[type, createdAt]`) to
   `prisma/schema.prisma` and a fire-and-forget `track(userId, type, payload)`
   in a new `lib/track.ts` (never throws; analytics must not break the app).
   Human runs `prisma db push`. Verify: build green, a manual `track()` call
   lands a row.
2. ⬜ **Instrument the lesson funnel.** Events from existing actions/pages:
   `lesson_started`, `lesson_step` (step index on advance), `quiz_answered`
   (correct/wrong, step id), `lesson_claimed`, `feel_logged`
   (crushed/got-it/shaky). Verify: walk one lesson locally, see the ordered
   event trail.
3. ⬜ **Instrument loop + monetization edges.** `challenge_done`,
   `chest_opened` (tier), `coach_submitted`, `paywall_viewed`,
   `checkout_started`, `reminder_optin`. Verify: same manual-walk approach.
4. ⬜ **Funnel + quiz-quality dashboard.** Admin page: per-lesson
   started -> claimed funnel with per-step drop-off, and wrong-answer rate per
   quiz step (flag > 40%). Plain table + CSS bars. Verify: numbers match a
   hand-run SQL count.
5. ⬜ **Retention dashboard.** DAU (distinct users with events per local day),
   streak distribution (from `User`), reminder opt-in rate
   (`PushSubscription`), coach usage. Verify against SQL.
6. ⬜ **Revenue dashboard** (after payments go-live). MRR, active/trialing
   subscriptions, churn from `Subscription` + `PaymentEvent`. Verify against
   the Lemon Squeezy dashboard.

## Status log

(none yet)
