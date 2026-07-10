# Core Loop

The engagement machine. This is the doc to read before touching XP, streaks,
quests, chests, reminders, or anything in `lib/game.ts`. It describes both the
mechanics as implemented and the design intent behind them, so changes keep the
loop coherent instead of optimizing one dial and breaking another.

The frame is the Hooked model:

```
trigger            action              variable reward        investment
push reminder  ->  3-min lesson    ->  XP + quote + chest ->  streak, level,
(user's local      + 1 real-world      (tiered, random)       quote collection,
 evening)            rep                                      tomorrow's unlock
```

Three loops nest inside each other: a session (minutes), a day, and the
long game (weeks).

## 1. Session loop: one lesson (~3 minutes)

A lesson is a JSON array of steps (`Lesson.steps`, zod-validated in
`lib/content.ts`, read through `lib/catalog.ts`):

- **concept** steps teach one idea (headline, body, key phrase).
- **quiz** steps check it. Two voices: `them` (someone talks, pick the right
  behavior) and `inner` (your own automatic thought, pick the CBT-style
  reframe). First-try correct answers earn XP.
- The **claim screen** ends the session: XP count-up, level progress, and a
  collectible quote drop.

Claiming goes through the `claimLesson` server action into
`completeLesson()` (`lib/game.ts`), which is the single write path for lesson
XP, `DailyState`, and streak evaluation.

## 2. Daily loop

State lives in one `DailyState` row per `(userId, localDate)` plus counters on
`User`. "Today" is always the user's local day: `dayString()` / `localParts()`
with `User.timezone`. Never compute dates any other way (golden rule 5).

**Streak.** The first lesson of the day keeps the streak alive, on any pace
(`goalMet` = at least 1 lesson). This is deliberate, the Duolingo rule: the
streak must stay cheap enough to protect on a bad day. The real-world challenge
must NEVER gate the streak; it powers quests and chests instead. A missed day
can be absorbed by a **streak shield** (chest drop, cap 2, auto-consumed when
the last goal-met date is two days ago). Streak evaluation happens once per day
inside `evaluateStreak()` after any award.

**Pace.** The onboarding pace choice sets the visible daily lesson goal:
chill 1, steady 2, beast 3 (`dailyLessonGoal`). It affects the goal display and
quest pressure, not the streak rule.

**Daily quests** (`questState`): three checkboxes shown on the learn tab:
lesson done, 30+ XP today, rep done. All three unlock the **quest chest**
(one per day, `DailyState.chestOpened`).

**The rep (real-world challenge).** Each lesson carries a challenge to attempt
in real life; marking it done (`markChallengeDone`) pays the biggest XP in the
economy. This is the actual product (see [PRODUCT-PLAN.md](PRODUCT-PLAN.md));
the lesson exists to set it up.

**Coach rep.** Speaking practice against the daily scenario: a character
says a line (`lib/coach-scenarios.ts`, same scenario worldwide per local
day, Wordle-style), the user answers out loud for up to 60s, Gemini scores
delivery plus scenario fit (`lib/coach.ts`). Free tier 1/day, premium
unlimited, XP for the first 3 per day. The coach-first repositioning
(docs/exec-plans/coach-first.md) is making this rep the center of the app.

**Trigger.** An hourly Vercel cron (`/api/cron/reminders`) sends web push at
each user's local reminder hour with streak-aware copy. One nudge per day;
the reminder is a trigger, not a marketing channel.

## 3. Long game (weeks)

- **Path:** units unlock sequentially; finishing a unit opens its **path
  chest**. Free users unlock chapters in order; premium unlocks all.
- **Levels:** derived purely from `totalXP` (`lib/levels.ts`); level L starts
  at `50*(L-1)*L` XP (L2=100, L3=300, L4=600...). No level-up writes, always
  recomputed.
- **Streak milestones:** every 7 streak days, an epic chest.
- **Collection:** each lesson claim drops a quote into the user's collection
  (quotes tab), a browsable artifact of progress.
- **Curriculum:** A1 to C2 ([CURRICULUM.md](CURRICULUM.md)); completing a
  lesson's can-do statement is the level-up condition.

## XP economy

Defined once in `lib/content.ts` (`XP` const). All values in one place so the
economy can be rebalanced without hunting magic numbers:

| Source | XP | Notes |
|---|---|---|
| Quiz step, first try | 10 | per step |
| Lesson claim | 20 | per lesson |
| Real-world challenge | 30 | biggest single award, on purpose |
| Coach rep | 15 | first 3 per day |
| Chests | variable | by tier: common / rare / epic; may drop a streak shield instead |

Rule: any new XP source must flow through the award helpers in `lib/game.ts`
so `DailyState`, quest state, and streak evaluation stay correct. Never
increment `totalXP` directly.

## Chests: the variable-reward slot machine

Three sources, one grant path (`grantChest`):

| Chest | Unlock | Tier |
|---|---|---|
| Quest chest | all 3 daily quests | rolled |
| Path chest | finish a unit | rolled |
| Streak chest | every 7 streak days | epic |

Rewards are randomized XP by tier, with a chance of a streak shield (cap 2).
Opened chests are tracked in `User.openedChests` (path/streak) and
`DailyState.chestOpened` (quest chest, per day).

## Design guardrails

Changes to the loop should preserve these invariants:

1. **Streak = one lesson.** Never raise the bar; anxiety-prone users must be
   able to protect the streak in 3 minutes.
2. **Challenge is carrot, not stick.** Reps earn the most XP and feed quests,
   but skipping one never punishes.
3. **Chests stay free.** Variable rewards are earned, never bought; no
   loot-box monetization.
4. **One reminder a day.** The trigger stays scarce so it keeps working.
5. **Timezone-correct everywhere.** All daily logic keys on the user's local
   day; a claim at 11pm in Auckland lands on the Auckland date.
6. **Premium gates access, not progress mechanics.** Chapters, coach volume,
   and streak repair are premium; XP, streaks, quests, and chests behave the
   same for everyone.

## Where the loop lives

| Piece | File |
|---|---|
| XP economy + lesson/step schemas | `lib/content.ts` |
| Streaks, quests, chests, daily state, awards | `lib/game.ts` |
| Levels (pure, client-safe) | `lib/levels.ts` |
| Mutation entry points (server actions) | `lib/actions.ts` |
| Content reads (zod-validated) | `lib/catalog.ts` |
| Coach scoring | `lib/coach.ts` |
| Reminder cron | `app/api/cron/reminders/route.ts`, `lib/push.ts` |
| Data model (`User`, `DailyState`, ...) | `prisma/schema.prisma` |
