# Convozy: Curriculum Map (source of truth)

CEFR-style progression for the **Social Skills** course. Every lesson gets a **can-do statement**
("Can decline a favor and survive the silence") — completing it is the level-up condition.
Shipped units live in `lib/content.ts`; this doc is the roadmap for everything else.

Status legend: ✅ shipped · 🔜 next · ⬜ planned

---

## A1 — Survival Social

| # | Unit | Contents | Status |
|---|------|----------|--------|
| 1 | First Contact | Greetings & introductions · matching the greeting to context · remembering names (repeat, use, associate) · using a name without overdoing it · ending a hello | ✅ (as "First Contact", DB-seeded) |
| 2 | The Listening Body | Eye contact (50/70 rule) · posture & orientation · nodding without bobbleheading · phone-down rule · resting face awareness | ✅ (DB-seeded) |
| 3 | Conversation Mechanics 101 | Turn-taking · "Answer +1" · asking one question back · volume & pace calibration | ⬜ (v1 content in git history) |
| 4 | Politeness Protocol | Please/thanks/sorry inflation · interrupting politely · "Is this a good time?" | ⬜ |
| 5 | Emotion Recognition I | Six basic emotions on faces · tone of voice basics · noticing busy/tired/done | ⬜ |

## A2 — Everyday Confidence

| # | Unit | Contents | Status |
|---|------|----------|--------|
| 6 | The Small Talk Engine | Shared-context openers · FORD topics · 5–10 min conversations · topic threading | ⬜ (partially in Units 1/3) |
| 7 | The Sounds of Listening | Backchanneling ("Really?", "No way", "And then?") · minimal encouragers · reaction matching · keyword echoing · the follow-up question (Harvard 2017: most likability-boosting habit) · support vs. shift response (Derber) | ⬜ (v1 content in git history) |
| 8 | Compliments | Specific compliments (effort > traits) · receiving without deflecting · compliment + question opener | ⬜ |
| 9 | Digital Basics | Response-time norms · emoji/punctuation tone · text → call escalation · group chat & voice message etiquette | ⬜ |
| 10 | Graceful Exits | Exit lines without fake emergencies · warm goodbye with future hook · leaving group conversations | ⬜ (partially in Unit 1) |

## B1 — Connection

| # | Unit | Contents | Status |
|---|------|----------|--------|
| 11 | Storytelling I | Hook → stakes → payoff · the 60-second edit · story stack (5 go-to stories) · callbacks | ⬜ (v1 content in git history) |
| 12 | Question Craft | Open vs. closed · the second question · deep-but-not-intense (36-questions research) · curiosity as charisma | ⬜ |
| 13 | Empathy in Action | Validating without agreeing · "comfort or solutions?" · active constructive responding · what not to say | ⬜ |
| 14 | The Friendship Formula | Proximity + repetition + escalating vulnerability · being the inviter · "thinking of you" texts · remembering details · adult friendship | ⬜ |
| 15 | Boundaries I | No without an essay · handling pushback · broken record · letting silence sit | ⬜ (v1 content in git history) |
| 16 | Awkwardness First Aid | Forgotten names · flopped jokes · collision interruptions · tolerating silence | ⬜ |
| 17 | Apology Anatomy | Acknowledge → impact → responsibility → repair → change · banned words ("but", "if", "sorry you feel that way") · apology sizing | ⬜ |

## B2 — Social Intelligence

| # | Unit | Contents | Status |
|---|------|----------|--------|
| 18 | Subtext & Cues | Decoding "I'm fine" · disengagement signals · energy reading · the question behind the question | ⬜ |
| 19 | Feedback Culture | Why feedback fails (criticism as threat) · praise that lands · hamburger technique + why it gets stale · SBI model · radical candor & ruinous empathy · receiving feedback · asking for feedback · upward feedback · written vs. face-to-face · direct vs. indirect cultures | ⬜ |
| 20 | Humor Calibration | Timing & dosage · punching up · self-deprecation (pratfall effect) · callbacks · taking a joke · when the room needs none | ⬜ |
| 21 | Group Dynamics | Making space for quiet people · amplification · redirecting dominators · the connector move | ⬜ (v1 content in git history) |
| 22 | Assertiveness | Passive/aggressive/passive-aggressive/assertive · I-statements · DESC script · disagreeing upward | ⬜ |
| 23 | Difficult People & Manipulation Defense | De-escalation · boundary phrases · guilt trips, gaslighting, love bombing · "let me think about it" | ⬜ |
| 24 | Workplace Fluency | Speaking early in meetings · email/Slack tone · pre-meeting small talk · video presence | ⬜ |

## C1 — Influence & Hard Conversations

| # | Unit | Contents | Status |
|---|------|----------|--------|
| 25 | Difficult Conversations | What happened / feelings / identity · soft startups · staying in dialogue · naming the dynamic | ⬜ |
| 26 | Negotiation I | BATNA · anchoring · mirroring & labeling (Voss) · silence as a tool · calibrated questions | ⬜ |
| 27 | Persuasion & Its Ethics | Cialdini's six principles · framing & defaults · influence vs. manipulation bright line · Ben Franklin effect | ⬜ |
| 28 | Public Voice | Structuring a talk · nerves protocols · reading the audience mid-talk · hostile questions · impromptu speaking | ⬜ |
| 29 | Leading Humans | Meetings people don't hate · praise publicly, correct privately · real 1:1s · delegating · mentoring | ⬜ |
| 30 | Trust Engineering | Keeping small promises · vulnerability loops · repairing broken trust | ⬜ |
| 31 | High-Stakes Empathy | Delivering bad news (SPIKES) · grief — what to say and never say · ring theory · sitting with pain | ⬜ |

## C2 — Mastery

| # | Unit | Contents | Status |
|---|------|----------|--------|
| 32 | Mediation & Diplomacy | Staying neutral · positions → interests · the wedding-seating final boss | ⬜ |
| 33 | Cross-Cultural Mastery | High/low-context · directness, eye contact, touch, silence norms · humor & apology across cultures | ⬜ |
| 34 | Repair Mastery | Rupture & repair · reconciling after years · ending relationships with grace | ⬜ |
| 35 | Crisis Communication | Under fire · admitting fault publicly · calming a panicked group | ⬜ |
| 36 | The Invisible Skills | Not saying the clever thing · strategic silence · making others feel smart · becoming what the room needs | ⬜ |
| 37 | Rule-Breaking | Which rules exist to be broken · calibrated authenticity | ⬜ |

---

## Lesson format (v2, DB-managed)

Lessons live in the database (`Unit`/`Lesson`/`Quote` tables, seeded from `prisma/seed.ts`) and run
~3 minutes: concept → behavior quiz → deeper concept → **thought-reframe (CBT cognitive step,
voice:"inner")** → "the move" → quote → real-world challenge → claim. Every lesson challenges one
automatic thought, not just behavior.

**Separate course, planned v3+:** "Courage to Be Disliked" (Adlerian) — v1 content in git history.

## App mechanics to build against this map

- **Can-do statements**: every unit/lesson carries one; completing the real-world rep = the level-up condition. (Shipped: `canDo` per chapter.)
- **Placement quiz**: scenario questions at onboarding ("a coworker says 'I'm fine' with crossed arms — what's happening?") to skip confident users past A1.
- **Spaced-repetition cards**: backchanneling phrases and scripts (DESC, SBI, apology anatomy) work as reviewable cards.
- **Elective tracks**: Dating, Networking, Interviews — assembled from core units rather than authored separately.
- **Evidence anchors** worth citing in lessons: follow-up questions/likability (Huang et al., Harvard 2017), perceived responsiveness, Derber's conversational narcissism, pratfall effect, active constructive responding, 36 questions (Aron et al.), SPIKES, ring theory, Cialdini, Voss.

## Content rules

- Original wording only — teach ideas, never copy source text.
- Every technique should trace to a named, checkable source or study.
- Tone: encouraging first, actionable always, never shame.
- All quotes and studies get an editorial verification pass before launch.
