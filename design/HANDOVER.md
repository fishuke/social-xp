# Handoff: Social XP — MVP (v2)

Duolingo-style mobile app for training social skills. Chapters of 3-minute lessons, one real-world challenge ("rep") per day, a collectible quote per lesson, XP, streaks, and daily quests.

## Overview

Target user: people who doomscroll all day and feel their social skills slipping — starting conversations, making connections, leaving an impression. The app converts self-development book content into a Duolingo-grade engagement loop.

**Core loop (once a day, ~5 minutes):**
1. **Learn** — a 3-minute lesson (5 beats, see Lesson Flow)
2. **Try** — a real-world rep (honor-system challenge, e.g. "ask someone how their day's going + one follow-up")
3. **Claim** — XP + a collectible quote card
4. **Return** — streak, daily quests, and chest rewards pull the user back tomorrow

**Three comeback hooks:** don't break the streak · finish the 3-quest chest · complete the chapter's quote set.

## About the Design Files

The files in this bundle are **design references created in HTML** — prototypes showing intended look and behavior, **not production code to copy directly**. The task is to **recreate these designs in the target codebase's environment** (React Native, SwiftUI, Flutter, etc.) using its established patterns. If no codebase exists yet, choose the most appropriate mobile stack (this product is an iOS-first mobile app; Expo/React Native or SwiftUI are sensible defaults) and implement the designs there.

Open `Social XP - All Screens v2.dc.html` in a browser to see all 16 screens rendered inside iPhone frames, organized into 9 sections with annotations.

## Fidelity

**High-fidelity.** Colors, typography, spacing, radii, shadows, and copy are final. Recreate pixel-perfectly at a 402×874 pt reference viewport (iPhone Pro Max class; scale proportionally for smaller devices). The iPhone bezel/status bar in the HTML is presentation chrome only — do not build it.

## Information Architecture

Tab bar (4 tabs): **Learn** (home path) · **Quotes** (collection) · **Coach** (AI, v2 — show locked state in MVP) · **You** (progress).
Chapters list is pushed from the chapter banner on Learn (not a tab). Lesson flow, streak celebration, and paywall are modal/full-screen flows without the tab bar.

## Content Model

- **Chapter** (5 in MVP): id, number, title, tagline, lessons[6]. Titles: 1 Breaking the Ice · 2 Keeping It Going ("Listening, flow, never running dry") · 3 Telling Stories ("Make your moments land") · 4 Confidence Under Pressure ("High stakes, steady voice") · 5 Lead the Room ("Set the tone wherever you are"). Chapters unlock sequentially (all unlocked for Premium).
- **Lesson** (6 per chapter; #6 is a Checkpoint): id, title, concept beat, quiz beat, quote, real-world rep, XP values. Chapter 1 lessons: 1 Say hi first · 2 React, don't open · 3 The follow-up question · 4 Remember the name · 5 The graceful exit · 6 Checkpoint: 3 real conversations.
- **Quote**: text, author, authorNote, chapterId, lessonIndex. One unlocked per completed lesson; checkpoint unlocks a "rare" one. Seed data used in mocks: "To be interesting, be interested." — Dale Carnegie (L1); "We have two ears and one mouth so we can listen twice as much as we speak." — Epictetus (L2); "The quality of your life is the quality of your conversations." — Tony Robbins (L3).
- **Daily quests** (reset daily): Finish 1 lesson · Earn 30 XP · Do your real-world rep. All 3 → chest reward (bonus XP; suggested +40).

## Screens / Views

All screens: background Cream `#FFF6EE` unless noted; safe-area top padding ≈58px in mocks; content side padding 20–26px.

### 1. Onboarding — Welcome
- Purpose: sell the belief in 20 seconds.
- Layout: full-height column, `justify-content:space-between`. Top: wordmark "SOCIAL XP" (Fredoka 700 16px, letter-spacing 2px, uppercase, Coral). Middle (centered): logo 100×100 → H1 "Social skills are just reps." (Fredoka 600 33px, line-height 1.06, letter-spacing -0.5px, 2 lines) → body "Confidence isn't a talent you're born with. It's built — one tiny conversation at a time. 3 minutes a day." (Nunito 18px/1.5, `#6E5F54`, max-width 300px, centered).
- Bottom: primary CTA "Start training" + ghost link "I already have an account" (Fredoka 500 16px `#7A6A5C`).

### 2. Onboarding — Goal
- Progress bar 8px (track `#EADFD5`, fill Coral, 40%). H2 "What brings you here?" (Fredoka 600 30px). Sub: "Pick the one that matters most right now — you can change it later."
- 5 single-select option rows (radius 18px, padding 18/20, Fredoka 500 18px, radio circle 26px right-aligned): Ease social nerves (selected: border 2px Coral, bg `#FFEDE4`, filled radio) · More confidence · Be a better listener · Make conversation easy · Stop seeking approval (unselected: border 2px `#EADFD5`, bg white).
- CTA "Continue".

### 3. Onboarding — Pace
- Progress bar 75%. H2 centered "How hard do we go?" Sub "You can change this anytime. No pressure."
- 3 option rows (emoji 28px + title Fredoka 600 19px + sub Nunito 700 14px `#7A6A5C`): 🌱 Chill — 1 lesson a day · ~3 min; 🔥 Steady — Lesson + real-world rep · ~5 min (selected, coral border + `#FFF0E9` bg + "PICKED" chip); ⚡ Beast — Stack lessons + reps all day. Options group is vertically centered (`flex:1; justify-content:center`).
- "Daily reminder — Keep your streak alive / 7:30 PM" row (white card, coral time). CTA "Let's go →".

### 4. Home — Learn path (default screen)
- Header row: streak pill (flame icon + "7") left; right: quotes pill (diamond icon + "3") and XP pill (amber square + "1,240"). Pills: white, radius 14px, padding 8/12, shadow `0 2px 0 rgba(0,0,0,0.04)`, Fredoka 600 17px.
- **Chapter banner** (tappable → Chapters): coral gradient `160deg #FF7A45→#FF5A2C`, radius 20px, white text. "CHAPTER 1 · 2 OF 6 DONE" (11px, ls 1.5) / "Breaking the Ice" (Fredoka 600 21px) / progress bar 7px (track white 28%, fill Amber, 33%). Right: book icon + chevron. Shadow `0 6px 16px rgba(255,90,44,0.28)`.
- **Daily quests card**: white, radius 18px. Header "DAILY QUESTS … 0 / 3". Three rows: empty 15px circle + label (Nunito 800 13px): Finish 1 lesson · Earn 30 XP · Do your real-world rep. Right: 52px chest tile (`#FFF3D6` bg, amber chest icon).
- **Path** (vertical, nodes zig-zag ±30–52px off center, connected by 3px dashed `#E6D4C4` verticals):
  - Done node: 56px circle, Green `#58C08A`, white check, hard shadow `0 5px 0 #3F9E6E`, label under (Nunito 800 12px `#7A6A5C`). L1 "Say hi first", L2 "React, don't open".
  - **Current node**: 82px circle, coral gradient, white play icon, shadow `0 7px 0 #D8431B` + halo `0 0 0 6px rgba(255,90,44,0.18)`; tooltip above: cocoa pill "START · +20 XP" (Fredoka 600 13px); label under "The follow-up question" (Fredoka 600 15px).
  - Chest node: 56px Amber circle, white chest icon, shadow `0 5px 0 #E0A52F`, label "Reward" (`#C9A23B`).
  - Locked node: 56px `#EADFD5` circle, lock icon `#B8A99C`, label "Remember the name".
  - Checkpoint node (peeking at fold): 60px Cocoa circle, amber flag icon, shadow `0 5px 0 #171008`.
- Tab bar: white, top border `#F0E4D8`, 4 items (icon 26px + 11px label). Active = Coral (800 weight), inactive `#B8A99C`.

### 5. Chapters (pushed from banner)
- Header: back chevron + "Chapters" (Fredoka 600 20px).
- **Chapter 1 card (active)**: white, border 2px Coral, radius 22px, shadow `0 5px 0 rgba(255,90,44,0.15)`. Header row: 52px coral-gradient number tile "1" + "Breaking the Ice" (Fredoka 600 19px) + "2 of 6 done · 4 quotes to collect" (Coral 800 13px). Lesson list (6 rows, 22px state circle + 14px label): done = green check circle; current = coral play circle + bold label + "NOW" coral pill; locked = `#EADFD5` circle + `#B8A99C` label; checkpoint = cocoa circle + amber flag + "Checkpoint · 3 real conversations". Inline CTA "Continue · The follow-up question" (coral, radius 16px, Fredoka 600 17px).
- Locked chapter rows (2, 3, 4): white radius 22px, opacity 0.85 — number tile `#EADFD5`, title `#8A7B70`, tagline `#B8A99C`, lock icon right.
- Tab bar (Learn active).

### 6–10. Lesson flow (5 beats; full-screen, no tab bar)
Shared chrome: X close (top-left) + 5-segment progress bar (8px, filled Coral, rest `#EADFD5`; on dark screens filled Amber, rest white 18%); kicker "CHAPTER 1 · LESSON 3 · THE FOLLOW-UP QUESTION" (Nunito 800 13px `#7A6A5C`); beat label "① THE CONCEPT" style (Fredoka 600 13px, ls 2px, Coral).

- **Beat 1 · Concept**: H2 "Answers are doors." (Fredoka 600 36px). Body 20px/1.6 `#544537` with coral bold key phrase ("Every answer hands you the next question"). Coach bubble card (`#FFEFE4`, radius 20px): chat icon tile + «"You never need a topic. They just gave you one."» (Nunito 700 16px `#7A5A3E`). CTA "Continue".
- **Beat 2 · Your call (tap quiz)**: "THEY SAY" speech bubble (white, border `#F0E4D8`, bottom-left radius 6px): "Work's been crazy — we're launching this week." Question (Fredoka 600 20px) "Which reply opens the door?" Two answer cards: wrong = white/`#EADFD5` border, muted text ("Nice. So… seen anything good lately?"); correct selected = border Green, bg `#EAF8F0`, green check badge ("A launch? What are you launching?"). Feedback banner (`#EAF8F0`): "THAT'S THE THREAD · +10 XP" + explanation. CTA turns Green ("Continue", shadow `0 6px 0 #3F9E6E`). Behavior: options tappable; wrong pick shakes + shows coral border, then reveals correct; +10 XP only on first-try correct.
- **Beat 3 · Quote unlocked** (dark screen, bg gradient `170deg #2E2018→#43301F`): centered collectible card — Cream, radius 24px, shadow `0 16px 40px rgba(0,0,0,0.4)`, "NEW" coral pill overlapping top-right, giant ember "“", quote (Fredoka 500 26px/1.32 Cocoa), author row (book-spine block 38×50 coral gradient + "Tony Robbins" + "on connection") + "3 of 6" with diamond icon. Below: "Added to your collection · Breaking the Ice set" + 6 progress dots (3 amber, 3 white 22%). Buttons: ghost "Save" + ghost "Share" (border white 25%), then Amber CTA "Continue" (text Cocoa, shadow `0 6px 0 #D89E2E`).
- **Beat 4 · Real-world rep**: centered coral-gradient card (radius 26px): challenge (Fredoka 600 26px) "Ask someone how their day's going — then one follow-up about what they said." + sub "Barista, classmate, coworker — anyone counts." + "+30 XP" chip (white 22% pill with amber square). Under card: "Honor system. No recording, no grade — the only person you'd cheat is you." (Nunito 700 14px `#7A6A5C`). CTAs: "I'm in — let's go" (primary) / "Remind me tonight" (ghost). "Remind me tonight" schedules a local notification and completes the lesson without the rep quest.
- **Beat 5 · Claim**: bg gradient `180deg #FFF1D6→#FFF6EE 40%`. Logo in 110px white circle, "Lesson complete! 💪" (Fredoka 600 31px), sub "That's how confidence gets built." Reward chips: "+20 XP" (amber square + Fredoka 600 24px Coral) and "+1 quote" (diamond icon). Daily-quests card mid-screen shows live ticks: Finish 1 lesson ✓ (green) · Earn 30 XP 20/30 (amber bar 66%) · rep unchecked. "HOW'D IT FEEL?" self-report: 😎 Crushed it / 🙂 Got it / 😬 Shaky (selected = coral border + `#FFF0E9`). CTA "Claim & continue" → XP counter animates, then streak screen if this completed the daily goal.

### 11. Quotes — collection (tab)
- Header: "Quotes" (Fredoka 600 26px) + "3 / 6" pill; sub "Pocket wisdom — one card per lesson."; chapter filter row: "CHAPTER 1" ember chip + "Breaking the Ice" + 8px progress bar (50%).
- 2-column grid (gap 12px), cards min-height 170px, radius 20px:
  - Collected: white, shadow `0 4px 0 rgba(0,0,0,0.04)`, ember "“", quote (Fredoka 500 15px/1.35), author (Nunito 800 12px), "Lesson N" (11px `#B8A99C`). Newest card: 2px ember border + "NEW" pill.
  - Locked: 2px dashed `#D8C9B8`, lock icon, "Finish Lesson N to unlock". Checkpoint slot: dashed Amber, amber flag, "Beat the checkpoint for the rare one", bg `#FFF9EC`.
- Tap a card → full-screen view (reuse Beat-3 card) with Share. Tab bar (Quotes active).

### 12. Streak celebration (modal after daily goal)
- Bg gradient `180deg #3A2416→#7A2E14`; static confetti squares/dots (8–12px, Amber/Green/white/ember, rotated). "STREAK EXTENDED" (Fredoka 600 15px ls 2px Amber).
- Flame: SVG flame with vertical gradient `#FF5A2C→#FF914D→#FFC24A`, ~190×206, big "8" overlaid (Fredoka 700 58px white). H2 "8 day streak!" (32px white) + sub "You showed up 8 days straight. That's not luck — that's a habit forming." (`#F4D8C2`).
- Week row: 7 circles 34px (M–S): done = Ember + white check; today = Amber + flame icon + halo `0 0 0 4px rgba(255,194,74,0.25)`; future = white 14%.
- Stat cards (white 12% bg, radius 18px): "+50 / XP today" (amber number) and "2 / days to a chest". Bottom: Amber CTA "Keep it going" + ghost "Share my streak" (generates a share image of flame + number).

### 13. You — progress (tab)
- Header: coral gradient, bottom radius 30px. "YOUR TOTAL XP" + "1,240 XP" (Fredoka 600 46px). Stat pills (white 16% bg, radius 12px, nowrap): flame "7-day streak" · "⚡ 18 reps" · diamond "3 quotes".
- "THE ROAD" list: Chapter 1 card (coral border, gradient number tile, "2 of 6 lessons", 11px progress bar, gradient fill `90deg #FFC24A→#FF914D` 33%) + chapters 2–5 locked rows (opacity 0.75, lock icons).
- Tab bar (You active).

### 14. Paywall (modal; triggered after free daily lesson is spent, or from locked chapters)
- X top-right. Logo 78px, "SOCIAL XP+" gradient pill (`90deg #FF914D→#FF5A2C`), H2 "Train as much as you want." (Fredoka 600 30px, centered).
- Perks (green check circles + Nunito 700 16px, group vertically centered): Unlimited lessons & reps per day · All chapters unlocked from day one · AI speaking coach & feedback · Streak repair — one slip forgiven.
- Plan cards: Monthly $6.99 (white/`#EADFD5`) · Yearly $39.99 (selected: `#FFF0E9` + coral border + "SAVE 52%" pill). CTA "Start 7-day free trial"; sub "Then $39.99/yr · cancel anytime"; legal line "Social XP builds confidence through practice. It's not therapy or mental-health treatment." (11px `#A99A8C`) — **keep this disclaimer**.

### 15–16. AI Coach (V2 — build the locked tab state only in MVP)
- **Record**: dark bg `180deg #241A12→#3A2416`. "AI COACH" amber header, "TODAY'S PROMPT", prompt (Fredoka 600 30px white) "Introduce yourself like we just met at an event.", sub "Aim for 30 seconds. No script — just talk." Center: waveform bars (5px wide, radius 99, ember/amber/coral heights 22–90px). Timer "0:18" + record button (84px circle, coral 3px border, `rgba(255,90,44,0.18)` fill, 34px coral rounded square = stop).
- **Feedback**: coral gradient header ("YOUR INTRO · 0:28" / "Warm and easy to follow. 🔥"). Score card: "84" (Fredoka 700 40px Green) + "Strong rep, Alex." + "Up 9 points from last time". Metric bars (9px): Confidence 82, Clarity 88, Energy 79 (green); Pace "A touch fast" 68% (`#FFB020`). "ONE THING TO TRY" card (`#FFEFE4`, label `#C9554A`): "You said \"um\" 6 times — totally normal. Next rep, try pausing instead. Silence reads as confidence." CTA "Try again · +15 XP". Tone rule: encouraging first, actionable always, never a stinging grade.

## Interactions & Behavior

- **Navigation**: tabs switch instantly; chapter banner → Chapters (push); path current node or chapter CTA → Lesson beat 1; lesson beats advance linearly with slide-left transition (~250ms ease-out); X → confirm-abandon if past beat 1.
- **Pressable buttons**: all hard-shadow buttons depress on tap (translateY(4px) + shadow shrinks to `0 2px 0`), ~90ms.
- **XP awards**: quiz first-try +10, lesson claim +20, real-world rep +30, coach rep +15 (v2). Counters animate (count-up ~600ms).
- **Real-world rep completion**: from Beat 4 "I'm in" → rep is pending; later "Mark done" from quest row or notification → +30 XP, quest ticks. Honor system, no proof.
- **Streak**: a day counts when daily pace goal is met (Steady = lesson + rep). Streak screen fires once/day max. Streak repair is Premium-only.
- **Chest**: opens with a short bounce/confetti burst when 3/3 quests done or on path chest node; grants bonus XP.
- **Free gating**: 1 lesson/day free; starting a 2nd lesson or a locked chapter → Paywall.
- **Quote share**: renders the quote card (Beat-3 style, 4:5) with small wordmark — no user data.
- **Empty/edge states**: day 1 (streak 1, empty quests ticked live), chapter complete (checkpoint celebration → next chapter unlock), missed day (streak resets, gentle copy — never shame).

## State Management

- `user`: id, name, goal, pace (chill/steady/beast), reminderTime, isPremium.
- `progress`: totalXP, streakCount, lastGoalMetDate, currentChapterId, currentLessonIndex, lessonsCompleted[], repsCompleted count, feelLog[].
- `quotes`: collectedQuoteIds[] (+ savedAt).
- `dailyState` (resets at local midnight): lessonsDoneToday, xpEarnedToday, repDoneToday, questsClaimed, chestOpened, freeLessonUsed.
- Content (chapters/lessons/quotes) ships as static seed data (JSON/DB); no backend needed for MVP beyond auth + persistence.

## Design Tokens

**Colors**
- Coral (primary) `#FF5A2C` · pressed-shadow `#D8431B` · gradient top `#FF7A45`
- Ember `#FF914D` · Amber XP `#FFC24A` (shadow `#D89E2E` / `#E0A52F`) · quest amber `#FFB020`
- Go green `#58C08A` (shadow `#3F9E6E`) · green tint `#EAF8F0` (border `#BFEAD2`, text `#2E5A44`)
- Cream bg `#FFF6EE` · warm tints `#FFEFE4` `#FFF0E9` `#FFEDE4` `#FFF3D6` `#FFF9EC` `#FFF1D6`
- Cocoa `#2E2018` · body `#544537` · secondary `#6E5F54` `#7A6A5C` · muted `#8A7B70` `#B8A99C` `#A99A8C`
- Borders `#EADFD5` `#F0E4D8` · dashed `#D8C9B8` · path connector `#E6D4C4`
- Dark screens: `#241A12` `#3A2416` `#43301F` `#7A2E14`; on-dark text `#F4D8C2`
- Spec-sheet canvas (not in app): `#E9E2D9`

**Type**
- Fredoka 400–700 — headlines, numbers, buttons, labels. Key sizes: 46 (XP hero), 36/33/30 (H2), 26 (card titles), 20 (buttons), 13 uppercase ls 2px (kickers).
- Nunito 400–900 — body & UI text. 20/18/16 body, 700–800 weight for UI labels, 13–14 metadata, 11 tab labels.

**Shape & elevation**
- Radii: buttons 20 · cards 18–26 · pills 99 · phone-content images 16.
- Hard shadows (signature style): CTA `0 6px 0 <darker>` · nodes `0 5–7px 0 <darker>` · cards `0 2–5px 0 rgba(0,0,0,0.03–0.05)`.
- Soft glow: coral cards `0 10–12px 24–26px rgba(255,90,44,0.32)`.
- Spacing: screen padding 20–26; card padding 14–20; stack gaps 12–14; section gaps 18–30.

**Iconography**: simple geometric SVGs, 2.2–2.6 stroke, round caps — flame, diamond (quotes), chest, flag (checkpoint), lock, check, play, mic, home, person. No icon font.

## Assets

- **Logo**: coral rounded square + white voice-meter bars — see `Logo.dc.html` (SVG, recreate as vector asset).
- Fonts: Fredoka + Nunito (Google Fonts, OFL).
- Everything else is drawn with code (SVG/shapes); no raster images.
- Quote texts attribute real authors — verify/curate final quote list editorially before launch.

## Files

- `Social XP - All Screens v2.dc.html` — all 16 screens, annotated (open in browser; needs the three support files below in the same folder)
- `Logo.dc.html` — app icon / logo
- `ios-frame.jsx` — iPhone presentation frame (chrome only, not part of the app)
- `support.js` — runtime for the HTML preview (ignore for implementation)

## Out of scope for MVP

AI Coach recording/feedback (screens 15–16 are V2 — ship the tab in a locked state), leaderboards/friends, push-notification content beyond the daily reminder, Android-specific polish.
