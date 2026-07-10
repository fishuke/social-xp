# Exec plan: coach-first repositioning

The AI coach becomes the product; lessons become the supporting skill tree.
Driven by alpha feedback (2026-07-10): testers find the Duolingo quiz layer
skippable and culturally awkward, but the coach is the part everyone likes.
The coach is also the only piece a book or YouTube cannot replace, and the
only piece that is culture-proof (it responds to what you actually said, in
your language).

## Goal

A new user onboards by picking the situation they dread (interview, date,
speaking up, saying no, small talk), lands on the coach as the home tab, and
does a speaking rep against a scenario where a character talks to them and
they answer out loud. Everyone in the world gets the same daily scenario
(Wordle-style), premium picks freely from scenario packs, and a live
multi-turn roleplay mode is the premium wow. Lessons, XP, streaks, quests,
and chests all stay, re-pointed to feed the rep habit. Done when the full
chain (onboard by dread, land on coach, daily scenario rep, scored debrief,
share) works in both locales.

## Model decision (researched 2026-07-10)

- **GPT-Live** (OpenAI, launched 2026-07-08) is full-duplex and impressive but
  is a ChatGPT app feature only; API access is "planned", no timeline, no
  pricing. Not buildable today.
- **gpt-realtime-2.1 / -mini** (OpenAI API, 2026-07-06): available, but mini
  is ~$10/1M audio input and $20/1M output, needs a new SDK dependency and a
  second vendor relationship.
- **Gemini Live API**: `gemini-3.1-flash-live-preview` is Google's newest
  native-audio dialogue model; 2.5 Flash native audio is GA at ~$3/1M audio
  input and $12/1M output. The app already ships `@google/genai`, already has
  `GEMINI_API_KEY`, and already scores reps with `gemini-2.5-flash`.

**Decision: stay on Gemini.** Live roleplay uses `gemini-3.1-flash-live-preview`
(fallback 2.5 native audio); batch scoring stays on `gemini-2.5-flash`.
Cheaper, no new dependency (golden rule 7), one vendor. Revisit if/when
GPT-Live gets a real API with competitive pricing.

## Context

- Backlog item: [BACKLOG.md](../BACKLOG.md#-coach-first-repositioning)
  (absorbs the old "coach roleplay mode" idea from Later).
- Relevant docs: [CORE-LOOP.md](../CORE-LOOP.md) (daily loop, streak rule,
  quests), [PRODUCT-PLAN.md](../PRODUCT-PLAN.md) (positioning; gets rewritten
  in the final step), [ARCHITECTURE.md](../ARCHITECTURE.md).
- Golden rules at risk:
  - **Rule 1 (shared prod DB):** no schema change is needed until live
    roleplay persistence, and even that fits in `CoachSession.feedback` Json.
    Any `db push` needs explicit sign-off first.
  - **i18n:** every new string lands in `en.ts` + `tr.ts`; scenarios are
    authored natively per locale, not translated word-for-word.
  - **Mutations via server actions**, XP only through `lib/game.ts` helpers,
    no new dependencies, no em-dashes.

## Out of scope

- Deleting or gutting lessons, XP, streaks, quests, chests. They stay and
  feed the habit; only their rank in the hierarchy changes.
- Native apps, leaderboards, friends (unchanged from backlog).
- OpenAI integration of any kind (see model decision).
- Renaming/domain work (separate backlog item).

## Steps

1. ✅ **Coach is home.** Tab order Coach, Learn, Quotes, You; logged-in
   landing redirect and onboarding finish route to `/coach`; Learn keeps
   lighting up for `/chapters`. Files: `components/tab-bar.tsx`,
   `app/[lang]/(site)/page.tsx`, `app/[lang]/(app)/onboarding/page.tsx`.
   Verify: signed-in visit to `/` lands on coach; all tabs still route.
2. ✅ **Onboard by dread.** Goal step becomes "which moment makes you
   freeze": interviews, dating, speaking-up, boundaries, small-talk. Stored
   in the existing `User.goal` string column (no schema change; old enum
   values in the DB stay harmless since `goal` is only interpolated into the
   coach scoring prompt). Files: `lib/actions.ts` (zod enum),
   dictionaries. Verify: onboarding writes the new values; build green.
3. ✅ **Scenario engine, batch mode.** `lib/coach-scenarios.ts`: scenario
   packs keyed by dread, 3 per dread per locale, each with scene setup, a
   character line to answer, and an instruction. `getDailyPrompt` becomes
   the daily scenario (deterministic from the local date, same scenario idea
   worldwide). Scoring prompt becomes scenario-aware (judges fit for the
   moment, not just delivery); `scenarioId` recorded inside
   `CoachSession.feedback` Json. Coach UI shows the scene. Verify: rep
   against the daily scenario end to end, both locales.
4. ⬜ **Scenario picker.** Free users get the daily scenario; premium picks
   any scenario from the packs (dread-matched pack surfaces first). Paywall
   copy updated. Verify: free/premium gating.
5. ⬜ **Streak includes reps.** `goalMet` becomes "one lesson OR one scored
   coach rep" so coach-first users keep streaks without opening lessons.
   Keeps the 3-minute protection guarantee (guardrail 1). Files:
   `lib/game.ts`, CORE-LOOP.md updated in the same commit.
6. ⬜ **Daily scenario share card.** Canvas-rendered result card (score,
   scenario title, streak) behind the existing share button. This is the
   influencer/growth artifact. Verify: share on mobile Safari + Chrome.
7. ⬜ **Live roleplay v1 (premium).** Multi-turn voice conversation with the
   scenario character over the Gemini Live API
   (`gemini-3.1-flash-live-preview`), client connecting directly with
   ephemeral tokens (Vercel functions cannot hold WebSockets). Transcript
   captured; debrief scored by `gemini-2.5-flash` and persisted as a
   `CoachSession` with `mode: "live"` in the feedback Json. Free tier keeps
   batch mode; live is premium plus maybe first-session trial. Verify:
   desktop Chrome + iOS Safari.
8. ⬜ **Docs + copy pass.** Landing hero and `/method` repositioned around
   the coach (only after scenarios/roleplay are real, so copy never
   oversells), PRODUCT-PLAN.md one-liner rewritten ("rehearse the
   conversation before it happens"), CORE-LOOP.md diagram re-centered,
   BACKLOG.md statuses.

## Status log

2026-07-10 | plan | plan written after model research + codebase mapping | -
2026-07-10 | 1-3 | coach home tab + redirects, dread onboarding, scenario engine (15 scenarios en+tr, daily pick, fit-aware scoring); verified via full browser flow both locales | -
