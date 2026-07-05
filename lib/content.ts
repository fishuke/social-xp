// Static seed content — chapters, lessons, quotes.
// Ships with the app per the handover; no backend content needed for MVP.

export const XP = {
  quizFirstTry: 10,
  lessonClaim: 20,
  rep: 30,
} as const;

export type Quiz = {
  theySay: string;
  question: string;
  options: [string, string];
  correctIndex: 0 | 1;
  feedbackTitle: string; // e.g. "THAT'S THE THREAD"
  feedbackBody: string;
};

export type Quote = {
  id: string; // "c1-l3"
  text: string;
  author: string;
  authorNote: string;
  chapterId: number;
  lessonIndex: number;
  rare: boolean;
};

export type Lesson = {
  index: number; // 1-based
  title: string;
  isCheckpoint: boolean;
  concept: {
    headline: string;
    body: string; // plain text; `keyPhrase` is bolded inside it
    keyPhrase: string;
    coachLine: string;
  };
  quiz: Quiz;
  rep: {
    challenge: string;
    sub: string;
  };
};

export type Chapter = {
  id: number; // globally unique across all courses
  courseId: number;
  number: number; // position within its course (display)
  level: string; // CEFR-style skill level: "A1", "A2", "B1"…
  title: string;
  tagline: string;
  canDo: string; // CEFR can-do statement — the unit's level-up condition
  lessons: Lesson[];
};

export type Course = {
  id: number;
  title: string;
  tagline: string;
  inspiration?: string; // shown as a credit line, e.g. the source school of thought
  levels: { code: string; title: string }[];
  chapters: Chapter[];
};

/* ---------------- Chapter 1 · Breaking the Ice ---------------- */

const c1Lessons: Lesson[] = [
  {
    index: 1,
    title: "Say hi first",
    isCheckpoint: false,
    concept: {
      headline: "Going first is the skill.",
      body: "Almost everyone waits to be approached. Almost everyone is relieved when someone else goes first. Going first is the whole move — it doesn't need to be clever, it needs to exist.",
      keyPhrase: "Going first is the whole move",
      coachLine: "“Hi counts. That's the entire rep.”",
    },
    quiz: {
      theySay: "You walk in and someone from your team is already there, scrolling their phone.",
      question: "What's the winning move?",
      options: [
        "Wait — if they want to talk, they'll look up.",
        "Say hi first, even if it's tiny.",
      ],
      correctIndex: 1,
      feedbackTitle: "GOING FIRST WINS",
      feedbackBody: "Waiting feels safe, but it hands the moment away. A two-second “hey” is a full rep.",
    },
    rep: {
      challenge: "Say hi first to one person today — before they say it to you.",
      sub: "Barista, neighbor, coworker — eye contact, smile, “hey”. That's it.",
    },
  },
  {
    index: 2,
    title: "React, don't open",
    isCheckpoint: false,
    concept: {
      headline: "You don't need an opener.",
      body: "Forget clever lines. The easiest way in is to comment on the moment you're both already in — the long line, the weather, the music. Shared moments are free openers.",
      keyPhrase: "comment on the moment you're both already in",
      coachLine: "“The situation wrote the opener for you. Just read it out loud.”",
    },
    quiz: {
      theySay: "Ugh, this line is taking forever.",
      question: "Which reply keeps it natural?",
      options: [
        "So… do you come here often?",
        "Right? I'm growing roots over here.",
      ],
      correctIndex: 1,
      feedbackTitle: "REACT TO THE MOMENT",
      feedbackBody: "Matching their comment keeps you in the shared moment. A canned opener yanks you out of it.",
    },
    rep: {
      challenge: "React out loud to something around you — with a stranger close enough to hear.",
      sub: "The line, the rain, the song playing. One honest sentence counts.",
    },
  },
  {
    index: 3,
    title: "The follow-up question",
    isCheckpoint: false,
    concept: {
      headline: "Answers are doors.",
      body: "Most people hunt for the next topic while the last answer is still hanging in the air. Every answer hands you the next question — you just have to pull the thread they gave you.",
      keyPhrase: "Every answer hands you the next question",
      coachLine: "“You never need a topic. They just gave you one.”",
    },
    quiz: {
      theySay: "Work's been crazy — we're launching this week.",
      question: "Which reply opens the door?",
      options: [
        "Nice. So… seen anything good lately?",
        "A launch? What are you launching?",
      ],
      correctIndex: 1,
      feedbackTitle: "THAT'S THE THREAD",
      feedbackBody: "They handed you “launch” — pulling that thread shows you actually heard them.",
    },
    rep: {
      challenge: "Ask someone how their day's going — then one follow-up about what they said.",
      sub: "Barista, classmate, coworker — anyone counts.",
    },
  },
  {
    index: 4,
    title: "Remember the name",
    isCheckpoint: false,
    concept: {
      headline: "Names are cheat codes.",
      body: "People light up when they hear their own name — and forget yours the second they say it, just like you do. Say it back once right when you hear it, and it sticks.",
      keyPhrase: "Say it back once right when you hear it",
      coachLine: "“Name, said back once, used once at goodbye. That's the trick.”",
    },
    quiz: {
      theySay: "Hey, I'm Maya — I don't think we've met.",
      question: "Best way to lock in her name?",
      options: [
        "“Nice to meet you!” — and keep it moving.",
        "“Maya — nice to meet you. How do you know everyone here?”",
      ],
      correctIndex: 1,
      feedbackTitle: "SAY IT BACK ONCE",
      feedbackBody: "Repeating the name out loud files it in memory — and people love hearing it.",
    },
    rep: {
      challenge: "Learn one new name today — and use it once before you part.",
      sub: "“Thanks, Maya” on the way out counts double.",
    },
  },
  {
    index: 5,
    title: "The graceful exit",
    isCheckpoint: false,
    concept: {
      headline: "End it while it's good.",
      body: "Conversations are remembered by how they end. Leave on a high note, on purpose — a warm close beats a slow fade every single time.",
      keyPhrase: "Leave on a high note, on purpose",
      coachLine: "“Exits aren't rude. Fizzling is.”",
    },
    quiz: {
      theySay: "Anyway, that's pretty much been my week.",
      question: "How do you land the exit?",
      options: [
        "Go quiet and glance at your phone until it ends itself.",
        "“I've got to run — this was great. Let's pick it up next time.”",
      ],
      correctIndex: 1,
      feedbackTitle: "END ON A HIGH",
      feedbackBody: "A named, warm exit leaves the good feeling intact. Drifting off erases it.",
    },
    rep: {
      challenge: "End one conversation on a high note — leave before it fizzles.",
      sub: "One warm closing line, then actually go.",
    },
  },
  {
    index: 6,
    title: "Checkpoint: 3 real conversations",
    isCheckpoint: true,
    concept: {
      headline: "Time to stack the reps.",
      body: "You've got the pieces: go first, react, pull the thread, use the name, exit warm. A real conversation is just those moves back to back.",
      keyPhrase: "those moves back to back",
      coachLine: "“Three conversations. Tiny ones count. Go collect them.”",
    },
    quiz: {
      theySay: "I'm so tired today, honestly.",
      question: "Which reply keeps the conversation alive?",
      options: [
        "Same.",
        "What's draining you — work, or life stuff?",
      ],
      correctIndex: 1,
      feedbackTitle: "THREAD FOUND",
      feedbackBody: "“Same” closes the door. A follow-up about their answer swings it open.",
    },
    rep: {
      challenge: "Have 3 real conversations today — a hello, a follow-up, and a warm exit in each.",
      sub: "Beat the checkpoint to unlock the rare quote.",
    },
  },
];

/* ---------------- Chapter 2 · Keeping It Going ---------------- */

const c2Lessons: Lesson[] = [
  {
    index: 1,
    title: "Listen for threads",
    isCheckpoint: false,
    concept: {
      headline: "Hear the hooks.",
      body: "Every sentence someone says has little hooks in it — a place, a name, a feeling. Most people miss them because they're busy loading their next line. Listen like you'll be quizzed on their words.",
      keyPhrase: "Listen like you'll be quizzed on their words",
      coachLine: "“Their last sentence is your whole script.”",
    },
    quiz: {
      theySay: "We just got back from my sister's wedding in Lisbon.",
      question: "Where are the hooks?",
      options: [
        "“Cool. So what do you do for work?”",
        "“A wedding in Lisbon? How was it?”",
      ],
      correctIndex: 1,
      feedbackTitle: "HOOK FOUND",
      feedbackBody: "Wedding, sister, Lisbon — three doors in one sentence. Pick any of them.",
    },
    rep: {
      challenge: "In one conversation today, pull a thread from their exact words.",
      sub: "Repeat their word back and ask about it.",
    },
  },
  {
    index: 2,
    title: "The two-beat pause",
    isCheckpoint: false,
    concept: {
      headline: "Don't rush the gap.",
      body: "The urge to fill every silence makes you interrupt and babble. Wait two beats after they finish — half the time they keep going, and what comes next is the good stuff.",
      keyPhrase: "Wait two beats after they finish",
      coachLine: "“Silence isn't awkward. Snatching the mic is.”",
    },
    quiz: {
      theySay: "…and honestly, that's the real reason I quit.",
      question: "They pause. What's the strongest move?",
      options: [
        "Jump in fast with your own quitting story.",
        "Hold the pause a moment — let them finish the thought.",
      ],
      correctIndex: 1,
      feedbackTitle: "LET IT BREATHE",
      feedbackBody: "People finish their real thought in the space you leave. Rushing in steals it.",
    },
    rep: {
      challenge: "Leave a two-beat pause before you reply — once today.",
      sub: "Count it silently: one… two… then talk.",
    },
  },
  {
    index: 3,
    title: "Share to match",
    isCheckpoint: false,
    concept: {
      headline: "Trade, don't interview.",
      body: "Endless questions start to feel like an interrogation. The rhythm is a trade: they share, you share something the same size, then hand the turn back.",
      keyPhrase: "share something the same size",
      coachLine: "“A question, then a piece of you. That's the loop.”",
    },
    quiz: {
      theySay: "I've been getting into running lately.",
      question: "Which reply keeps the trade going?",
      options: [
        "“Nice. How far? How often? What shoes?”",
        "“I just started morning walks — running feels like the boss level. What got you into it?”",
      ],
      correctIndex: 1,
      feedbackTitle: "THAT'S A TRADE",
      feedbackBody: "You gave a little of yourself and handed the turn back. That's flow.",
    },
    rep: {
      challenge: "Answer one question today with a bit of you — plus a question back.",
      sub: "Same-size share, not a monologue.",
    },
  },
  {
    index: 4,
    title: "Questions that open",
    isCheckpoint: false,
    concept: {
      headline: "Ask doors, not locks.",
      body: "Some questions close with one word: fine, yes, good. Open questions start with how, what, or “tell me” — they hand the other person room to actually talk.",
      keyPhrase: "how, what, or “tell me”",
      coachLine: "“If it can be answered with 'fine', upgrade it.”",
    },
    quiz: {
      theySay: "Just got back from vacation, actually.",
      question: "Which question opens the door?",
      options: [
        "“Was it good?”",
        "“What was the best day of it?”",
      ],
      correctIndex: 1,
      feedbackTitle: "OPEN DOOR",
      feedbackBody: "“Was it good” gets one word. “Best day” gets a story.",
    },
    rep: {
      challenge: "Swap one yes/no question for a what/how question today.",
      sub: "“How'd that go?” beats “Was it ok?”",
    },
  },
  {
    index: 5,
    title: "Rescue a dying chat",
    isCheckpoint: false,
    concept: {
      headline: "Dead air isn't dead.",
      body: "Every conversation dips. You don't need a miracle topic — jump back to something they said earlier, or name the moment you're both in now. Reviving beats restarting.",
      keyPhrase: "jump back to something they said earlier",
      coachLine: "“'Wait — you said…' is a defibrillator.”",
    },
    quiz: {
      theySay: "The small talk runs out and it goes quiet.",
      question: "What's the rescue move?",
      options: [
        "End it — silence means it's over.",
        "“Wait — you mentioned a big project earlier. What is it?”",
      ],
      correctIndex: 1,
      feedbackTitle: "REVIVED",
      feedbackBody: "Earlier threads don't expire. Circling back proves you were listening the whole time.",
    },
    rep: {
      challenge: "When a chat dips today, circle back to an earlier thread instead of bailing.",
      sub: "One “wait, you said…” counts.",
    },
  },
  {
    index: 6,
    title: "Checkpoint: a 10-minute conversation",
    isCheckpoint: true,
    concept: {
      headline: "String it all together.",
      body: "Threads, pauses, trades, open questions, rescues — ten minutes of real conversation is just those five moves on repeat. Time to prove it.",
      keyPhrase: "those five moves on repeat",
      coachLine: "“Ten minutes. One human. You've got the tools.”",
    },
    quiz: {
      theySay: "I've been so busy lately, it's ridiculous.",
      question: "Best door-opener?",
      options: [
        "“Same, honestly.”",
        "“Busy with what? Give me the headline.”",
      ],
      correctIndex: 1,
      feedbackTitle: "THREAD PULLED",
      feedbackBody: "“Same” ends it. Asking for the headline starts the show.",
    },
    rep: {
      challenge: "Hold one 10-minute conversation today using at least three moves from this chapter.",
      sub: "Beat the checkpoint to unlock the rare quote.",
    },
  },
];

/* ---------------- Chapter 3 · Telling Stories ---------------- */

const c3Lessons: Lesson[] = [
  {
    index: 1,
    title: "Start in the action",
    isCheckpoint: false,
    concept: {
      headline: "Skip the throat-clearing.",
      body: "Weak stories start with “so basically, last Tuesday, I think it was Tuesday…”. Strong ones drop the listener straight into the scene. Start at the moment things got interesting.",
      keyPhrase: "Start at the moment things got interesting",
      coachLine: "“First line = the scene, not the calendar.”",
    },
    quiz: {
      theySay: "Tell me about your week — anything good?",
      question: "Which opener lands?",
      options: [
        "“So basically Monday — no wait, Tuesday — I was kind of busy…”",
        "“I accidentally joined the wrong Zoom call — and stayed.”",
      ],
      correctIndex: 1,
      feedbackTitle: "IN THE ACTION",
      feedbackBody: "You opened inside the scene. Now they need to know what happened next.",
    },
    rep: {
      challenge: "Tell one tiny story today starting mid-action.",
      sub: "First sentence = the interesting part.",
    },
  },
  {
    index: 2,
    title: "The one-detail rule",
    isCheckpoint: false,
    concept: {
      headline: "One detail does the work.",
      body: "Ten details bury a story; one perfect detail lights it up. Pick the single specific thing that makes the scene real and cut the rest.",
      keyPhrase: "one perfect detail",
      coachLine: "“Not 'a dog'. 'A corgi in a raincoat.'”",
    },
    quiz: {
      theySay: "How was that new place you tried?",
      question: "Which answer paints the scene?",
      options: [
        "“Good. It was a restaurant, we ate, it was nice.”",
        "“The chef yelled 'INCOMING' every time food left the kitchen.”",
      ],
      correctIndex: 1,
      feedbackTitle: "THAT'S THE DETAIL",
      feedbackBody: "One specific image beats five vague ones. They can see it now.",
    },
    rep: {
      challenge: "In one story today, include exactly one vivid detail.",
      sub: "Specific beats complete.",
    },
  },
  {
    index: 3,
    title: "Land the ending",
    isCheckpoint: false,
    concept: {
      headline: "Stick the landing.",
      body: "A story that trails off with “so… yeah” dies on impact. Know your last line before you start — the punchline, the lesson, or the twist — and stop right after it.",
      keyPhrase: "Know your last line before you start",
      coachLine: "“Say the ending. Then stop talking.”",
    },
    quiz: {
      theySay: "You reach the end of your wrong-Zoom-call story.",
      question: "How do you end it?",
      options: [
        "“…so yeah. Anyway. I don't know.”",
        "“And that's how I ended up in someone else's team meeting — with opinions.”",
      ],
      correctIndex: 1,
      feedbackTitle: "LANDED",
      feedbackBody: "A clean last line tells them it's their turn to react — or laugh.",
    },
    rep: {
      challenge: "Tell one story today and end it on purpose.",
      sub: "Last line, then silence. No “so yeah”.",
    },
  },
  {
    index: 4,
    title: "Read the room",
    isCheckpoint: false,
    concept: {
      headline: "Watch them, not your script.",
      body: "A story isn't a performance, it's a loop. If they lean in, expand. If their eyes drift, cut to the ending. The audience tells you the length.",
      keyPhrase: "The audience tells you the length",
      coachLine: "“Eyes drifting? Skip to the good part.”",
    },
    quiz: {
      theySay: "Mid-story, your listener starts glancing at their phone.",
      question: "What's the read?",
      options: [
        "Add more backstory so it makes sense.",
        "Jump straight to the ending.",
      ],
      correctIndex: 1,
      feedbackTitle: "GOOD READ",
      feedbackBody: "Cutting a story at the right time makes people want your next one.",
    },
    rep: {
      challenge: "Mid-story today, check your listener once — and adjust.",
      sub: "Expand or cut. Their call.",
    },
  },
  {
    index: 5,
    title: "The callback",
    isCheckpoint: false,
    concept: {
      headline: "Bring it back around.",
      body: "The easiest laugh in any conversation is a callback — referencing a joke or moment from earlier. It tells people “I was here with you the whole time.”",
      keyPhrase: "referencing a joke or moment from earlier",
      coachLine: "“An old joke, returned at the right moment, doubles in value.”",
    },
    quiz: {
      theySay: "I still can't believe I spilled coffee on my boss this morning.",
      question: "Hours later, they nail a presentation. Best comment?",
      options: [
        "“Good job on the presentation.”",
        "“Incredible comeback for someone who assaulted their boss with a latte.”",
      ],
      correctIndex: 1,
      feedbackTitle: "CALLBACK LANDED",
      feedbackBody: "You linked their morning to their win. That's shared history now.",
    },
    rep: {
      challenge: "Make one callback today to something said earlier in the conversation.",
      sub: "Earlier joke + new moment = gold.",
    },
  },
  {
    index: 6,
    title: "Checkpoint: tell one story",
    isCheckpoint: true,
    concept: {
      headline: "Your story, out loud.",
      body: "Pick one small true moment from this week. Start in the action, one vivid detail, land the last line. Thirty seconds is plenty.",
      keyPhrase: "Start in the action, one vivid detail, land the last line",
      coachLine: "“A small story told well beats an epic told badly.”",
    },
    quiz: {
      theySay: "So what's new with you?",
      question: "What's the storyteller's move?",
      options: [
        "“Not much, honestly. Same old.”",
        "“Okay so — I got adopted by a cat on my run this morning.”",
      ],
      correctIndex: 1,
      feedbackTitle: "HOOKED",
      feedbackBody: "“Not much” is a wall. A tiny story is an invitation.",
    },
    rep: {
      challenge: "Tell one 30-second story to a real person today — beginning, detail, landing.",
      sub: "Beat the checkpoint to unlock the rare quote.",
    },
  },
];

/* ---------------- Chapter 4 · Confidence Under Pressure ---------------- */

const c4Lessons: Lesson[] = [
  {
    index: 1,
    title: "Slow is smooth",
    isCheckpoint: false,
    concept: {
      headline: "Speed reads as panic.",
      body: "Under pressure your words speed up, and fast talk sounds like an apology. Slowing your pace by 20% reads as certainty — even while your heart is sprinting.",
      keyPhrase: "Slowing your pace by 20% reads as certainty",
      coachLine: "“You're not boring anyone. Slow down.”",
    },
    quiz: {
      theySay: "Okay, you're up — tell everyone your idea.",
      question: "What's the confident open?",
      options: [
        "Blurt it fast before you lose your nerve.",
        "One breath. Then start slower than feels natural.",
      ],
      correctIndex: 1,
      feedbackTitle: "SMOOTH START",
      feedbackBody: "The breath buys your brain time and your voice weight. Slow is smooth, smooth is fast.",
    },
    rep: {
      challenge: "In one tense moment today, deliberately slow your first sentence.",
      sub: "Breathe once. Then speak.",
    },
  },
  {
    index: 2,
    title: "Own the silence",
    isCheckpoint: false,
    concept: {
      headline: "Stop flinching at quiet.",
      body: "Nervous talkers rush to plug every gap and end up saying less with more words. Finish your point, then hold the quiet. Whoever is comfortable in silence holds the room.",
      keyPhrase: "Finish your point, then hold the quiet",
      coachLine: "“The pause after your point is the point sinking in.”",
    },
    quiz: {
      theySay: "You make your case. Nobody responds for a moment.",
      question: "What now?",
      options: [
        "Keep talking — re-explain it a third way.",
        "Hold the silence and let it land.",
      ],
      correctIndex: 1,
      feedbackTitle: "HELD IT",
      feedbackBody: "Re-explaining undercuts you. Silence says you meant it.",
    },
    rep: {
      challenge: "Make one point today and don't add a single word after it.",
      sub: "Say it. Stop. Breathe.",
    },
  },
  {
    index: 3,
    title: "Disagree without drama",
    isCheckpoint: false,
    concept: {
      headline: "Soft front, firm spine.",
      body: "You can hold your position without heat. Acknowledge theirs first — “I get why you'd see it that way” — then state yours plainly. No volume required.",
      keyPhrase: "Acknowledge theirs first",
      coachLine: "“Agree with the person, then argue the point.”",
    },
    quiz: {
      theySay: "Honestly, I think the deadline is totally fine.",
      question: "How do you push back?",
      options: [
        "“No offense, but that's just wrong.”",
        "“I get why — most of it is on track. Two parts worry me, though.”",
      ],
      correctIndex: 1,
      feedbackTitle: "FIRM & CALM",
      feedbackBody: "You gave their view a seat, then made yours. Nobody has to lose.",
    },
    rep: {
      challenge: "Disagree once today — acknowledgment first, position second.",
      sub: "“I get it… and here's my take.”",
    },
  },
  {
    index: 4,
    title: "Ask for what you want",
    isCheckpoint: false,
    concept: {
      headline: "Vague asks get vague no's.",
      body: "Hinting feels safer, but people can't say yes to a hint. Make the ask specific, short, and out loud — then stop talking and let them answer.",
      keyPhrase: "specific, short, and out loud",
      coachLine: "“The ask is one sentence. Everything else is padding.”",
    },
    quiz: {
      theySay: "You want Friday off, and your manager is right there.",
      question: "What's the strong ask?",
      options: [
        "“So I was kind of thinking maybe sometime soon I might need a day…”",
        "“Could I take Friday off? I'll have the report done Thursday.”",
      ],
      correctIndex: 1,
      feedbackTitle: "CLEAN ASK",
      feedbackBody: "Specific and short — easy to hear, easy to grant.",
    },
    rep: {
      challenge: "Make one direct ask today, in one sentence.",
      sub: "Then stop talking. Let them answer.",
    },
  },
  {
    index: 5,
    title: "Recover from a flub",
    isCheckpoint: false,
    concept: {
      headline: "The save is the skill.",
      body: "Everyone stumbles — the pros just don't make it weird. Name it lightly, smile, keep rolling. A relaxed recovery reads as more confident than a flawless run.",
      keyPhrase: "Name it lightly, smile, keep rolling",
      coachLine: "“Nobody remembers the flub. They remember your face after it.”",
    },
    quiz: {
      theySay: "You blank mid-sentence in front of the whole group.",
      question: "Best recovery?",
      options: [
        "Apologize twice and go quiet.",
        "“—aaand my brain just buffered. Where was I? Right — the budget.”",
      ],
      correctIndex: 1,
      feedbackTitle: "SMOOTH SAVE",
      feedbackBody: "Naming it with a smile releases the tension for everyone — then you're back.",
    },
    rep: {
      challenge: "Next stumble today: name it, smile, continue.",
      sub: "No double apology. Keep rolling.",
    },
  },
  {
    index: 6,
    title: "Checkpoint: one brave ask",
    isCheckpoint: true,
    concept: {
      headline: "Pressure is the gym.",
      body: "Pick something you've been putting off asking — a favor, a fix, feedback, a discount. Slow first line, clean one-sentence ask, hold the silence.",
      keyPhrase: "Slow first line, clean one-sentence ask, hold the silence",
      coachLine: "“Thirty seconds of brave beats a month of maybe.”",
    },
    quiz: {
      theySay: "The moment before your big ask, your heart starts racing.",
      question: "That racing heart means…",
      options: [
        "Danger — abort the mission.",
        "Your body is warmed up. Ask anyway.",
      ],
      correctIndex: 1,
      feedbackTitle: "GO TIME",
      feedbackBody: "Fear and readiness feel identical in the body. Courage is asking anyway.",
    },
    rep: {
      challenge: "Make one brave ask today that you've been avoiding.",
      sub: "Beat the checkpoint to unlock the rare quote.",
    },
  },
];

/* ---------------- Chapter 5 · Lead the Room ---------------- */

const c5Lessons: Lesson[] = [
  {
    index: 1,
    title: "Greet like a host",
    isCheckpoint: false,
    concept: {
      headline: "Act like it's your party.",
      body: "Hosts don't wait to be welcomed — they welcome. Walking in with “hey, good to see you” energy flips you from guest to host in one move, anywhere.",
      keyPhrase: "they welcome",
      coachLine: "“Host isn't a job title. It's a decision.”",
    },
    quiz: {
      theySay: "You arrive and a few people are standing around quietly.",
      question: "The host move?",
      options: [
        "Find a corner and check your phone until it fills up.",
        "Greet the nearest person: “Hey — I'm Alex. How do you know everyone?”",
      ],
      correctIndex: 1,
      feedbackTitle: "HOST MODE",
      feedbackBody: "One warm greeting resets the whole room's temperature — starting with yours.",
    },
    rep: {
      challenge: "Greet one room today like you were the one hosting it.",
      sub: "First hello within 10 seconds of entering.",
    },
  },
  {
    index: 2,
    title: "Introduce people well",
    isCheckpoint: false,
    concept: {
      headline: "Connect, then step back.",
      body: "The most valuable social move costs nothing: “Maya, meet Sam — you both climb.” A good intro gives two people a reason to talk and makes you the one who connects.",
      keyPhrase: "gives two people a reason to talk",
      coachLine: "“Name + name + one shared thing. Done.”",
    },
    quiz: {
      theySay: "Two of your friends are standing next to you. They've never met.",
      question: "Best intro?",
      options: [
        "“Maya, Sam. Sam, Maya.” — and walk away.",
        "“Maya, meet Sam — you're both training for something ridiculous.”",
      ],
      correctIndex: 1,
      feedbackTitle: "CONNECTED",
      feedbackBody: "The shared thing is the ignition. Now the conversation starts itself.",
    },
    rep: {
      challenge: "Introduce two people today — names plus one shared thing.",
      sub: "Then let them run with it.",
    },
  },
  {
    index: 3,
    title: "Set the tone",
    isCheckpoint: false,
    concept: {
      headline: "Moods are contagious.",
      body: "Rooms copy the steadiest person in them. Bring the energy you want reflected back — warmth, calm, play — and watch it spread within minutes.",
      keyPhrase: "Rooms copy the steadiest person in them",
      coachLine: "“You don't just read the room's energy. You can write it.”",
    },
    quiz: {
      theySay: "Ugh, this meeting is going to be brutal.",
      question: "You want a lighter room. Your move?",
      options: [
        "“Yeah. Kill me now.”",
        "“High odds. Let's make it weirdly fun anyway.”",
      ],
      correctIndex: 1,
      feedbackTitle: "TONE SET",
      feedbackBody: "You met them where they were, then lifted it one notch. That's leading.",
    },
    rep: {
      challenge: "Pick a tone before entering one room today — and hold it for 5 minutes.",
      sub: "Warm, calm, or playful. Your call.",
    },
  },
  {
    index: 4,
    title: "Include the quiet one",
    isCheckpoint: false,
    concept: {
      headline: "Pull chairs into the circle.",
      body: "Every group has someone at the edge. “What do you think, Sam?” costs five words and buys their whole evening. Leaders make space, not noise.",
      keyPhrase: "Leaders make space, not noise",
      coachLine: "“The quiet one usually has the best take. Ask.”",
    },
    quiz: {
      theySay: "The group chat is flowing, but one person hasn't spoken in ten minutes.",
      question: "The leader's move?",
      options: [
        "Let it ride — they'd talk if they wanted to.",
        "“Sam, you've seen this before — what's your read?”",
      ],
      correctIndex: 1,
      feedbackTitle: "SPACE MADE",
      feedbackBody: "An invitation by name is the easiest door in the world to walk through.",
    },
    rep: {
      challenge: "Invite one quiet person into a conversation today — by name.",
      sub: "One question. Watch them light up.",
    },
  },
  {
    index: 5,
    title: "Close with warmth",
    isCheckpoint: false,
    concept: {
      headline: "Last impressions stick.",
      body: "How you leave is what they remember. Close with a specific note — “great meeting you, good luck with the marathon” — and the whole conversation glows in memory.",
      keyPhrase: "Close with a specific note",
      coachLine: "“Generic goodbye, generic memory. Specific goodbye, kept.”",
    },
    quiz: {
      theySay: "Anyway, I should head out.",
      question: "Which goodbye lands?",
      options: [
        "“Ok, bye.”",
        "“Good luck Thursday — text me how the interview goes.”",
      ],
      correctIndex: 1,
      feedbackTitle: "WARM CLOSE",
      feedbackBody: "A specific send-off proves the conversation registered. That's rare — and remembered.",
    },
    rep: {
      challenge: "End one conversation today with a specific, warm close.",
      sub: "Reference one thing they told you.",
    },
  },
  {
    index: 6,
    title: "Checkpoint: host a moment",
    isCheckpoint: true,
    concept: {
      headline: "Run the room once.",
      body: "Greet first, introduce two people, set the tone, include the edge, close warm. Do it once, on purpose, in any gathering — that's hosting.",
      keyPhrase: "Do it once, on purpose",
      coachLine: "“Every room you enter is yours to warm up.”",
    },
    quiz: {
      theySay: "You're at a small gathering where few people know each other.",
      question: "The full host play?",
      options: [
        "Stick with the one person you know all night.",
        "Greet, connect two strangers, and keep the circle open.",
      ],
      correctIndex: 1,
      feedbackTitle: "ROOM LED",
      feedbackBody: "That's the whole chapter in one move. Rooms remember their host.",
    },
    rep: {
      challenge: "At your next gathering: greet first, introduce two people, close warm.",
      sub: "Beat the checkpoint to unlock the rare quote.",
    },
  },
];

/* ---------------- Chapter 6 · The Sounds of Listening (Unit 7) ----------------
   Backchanneling — evidence anchors: Huang et al. (Harvard, 2017) on follow-up
   questions & likability; Derber's support vs. shift response. */

const c6Lessons: Lesson[] = [
  {
    index: 1,
    title: "The sounds of listening",
    isCheckpoint: false,
    concept: {
      headline: "Silence reads as absence.",
      body: "When someone tells you a story and gets nothing back, it feels like talking into a well. Small sounds — “mm”, “really?”, “no way” — are proof of life: tiny signals that you're in it with them. Researchers call it backchanneling.",
      keyPhrase: "tiny signals that you're in it with them",
      coachLine: "“'Really?' is doing more work than your best story.”",
    },
    quiz: {
      theySay: "…and then the landlord just never called back.",
      question: "They pause mid-story. What keeps them going?",
      options: [
        "Silence — let them decide whether to continue.",
        "“Wait, really? So what did you do?”",
      ],
      correctIndex: 1,
      feedbackTitle: "PROOF OF LIFE",
      feedbackBody: "A reaction sound plus a nudge tells them the story is landing. Silence tells them to wrap it up.",
    },
    rep: {
      challenge: "In one conversation today, react out loud at least three times.",
      sub: "“Mm”, “really?”, “no way” — three counts.",
    },
  },
  {
    index: 2,
    title: "Match the energy",
    isCheckpoint: false,
    concept: {
      headline: "Meet their news at its size.",
      body: "Big news deserves a big reaction; quiet worry deserves a quiet lean-in. Matching the energy of what they share — before adding anything — is how people feel you actually got it.",
      keyPhrase: "Matching the energy of what they share",
      coachLine: "“Their excitement is an invitation. RSVP.”",
    },
    quiz: {
      theySay: "I GOT THE JOB!!",
      question: "Pick the matched reaction:",
      options: [
        "“Oh nice. Anyway—”",
        "“NO WAY. The one from the second interview?!”",
      ],
      correctIndex: 1,
      feedbackTitle: "ENERGY MATCHED",
      feedbackBody: "Enthusiasm reflected doubles; enthusiasm flattened dies. How you meet good news builds the relationship.",
    },
    rep: {
      challenge: "Match someone's energy about their news today — size for size.",
      sub: "Big news, big reaction. Quiet news, warm lean-in.",
    },
  },
  {
    index: 3,
    title: "Echo the keyword",
    isCheckpoint: false,
    concept: {
      headline: "Repeat the loudest word.",
      body: "Echoing the most interesting word they said — “…a shark?!” — is the cheapest, fastest invitation to say more. No question needed; the echo is the question.",
      keyPhrase: "the echo is the question",
      coachLine: "“Find the word with the story in it. Say it back.”",
    },
    quiz: {
      theySay: "The trip was great until the boat thing happened.",
      question: "Best echo?",
      options: [
        "“Sounds fun overall!”",
        "“…the boat thing?”",
      ],
      correctIndex: 1,
      feedbackTitle: "ECHO LANDED",
      feedbackBody: "Two words, and now you're getting the real story. That's leverage.",
    },
    rep: {
      challenge: "Echo one keyword today and let it pull the story out.",
      sub: "Their word, question mark, done.",
    },
  },
  {
    index: 4,
    title: "And then? Keep them talking",
    isCheckpoint: false,
    concept: {
      headline: "Follow-ups are likability.",
      body: "In a Harvard study of thousands of conversations, people who asked more follow-up questions were consistently rated more likable — and even got more second dates. Not clever questions. Follow-ups: “and then?”, “how'd that feel?”, “what happened next?”",
      keyPhrase: "people who asked more follow-up questions were consistently rated more likable",
      coachLine: "“'And then?' — the two most charming words in English.”",
    },
    quiz: {
      theySay: "So I finally confronted my roommate about the dishes.",
      question: "The likability move?",
      options: [
        "“Yeah, roommates are the worst. Mine once…”",
        "“And? How did they take it?”",
      ],
      correctIndex: 1,
      feedbackTitle: "SECOND QUESTION WINS",
      feedbackBody: "The research is clear: staying in their story beats starting your own.",
    },
    rep: {
      challenge: "Ask “and then what happened?” at least twice in one conversation today.",
      sub: "Stay in their story two beats longer than usual.",
    },
  },
  {
    index: 5,
    title: "Support, don't shift",
    isCheckpoint: false,
    concept: {
      headline: "Don't steal the ball.",
      body: "Sociologist Charles Derber named the habit that quietly kills conversations: the shift response — grabbing every topic and pointing it at yourself. The support response keeps the ball with them until they're done.",
      keyPhrase: "the shift response",
      coachLine: "“Your similar story can wait. Theirs is live.”",
    },
    quiz: {
      theySay: "I've been so stressed about my mom's surgery.",
      question: "Which reply supports?",
      options: [
        "“I know exactly how you feel — when my dad had his knee done…”",
        "“That's a lot. When is the surgery?”",
      ],
      correctIndex: 1,
      feedbackTitle: "BALL RETURNED",
      feedbackBody: "Your story might connect later. Right now, relating means staying in theirs.",
    },
    rep: {
      challenge: "Catch one shift response today before it leaves your mouth — support instead.",
      sub: "One question about them beats one story about you.",
    },
  },
  {
    index: 6,
    title: "Checkpoint: all ears",
    isCheckpoint: true,
    concept: {
      headline: "One conversation, zero spotlight.",
      body: "Backchannel, match, echo, follow up, support — hold one full conversation today where your only job is making them feel heard. Watch how much they like you for it.",
      keyPhrase: "your only job is making them feel heard",
      coachLine: "“Be the best listener they meet this week.”",
    },
    quiz: {
      theySay: "Honestly, this week has been a rollercoaster.",
      question: "Your all-ears opener?",
      options: [
        "“Mine too, actually — listen to this.”",
        "“Rollercoaster how? Start from the top.”",
      ],
      correctIndex: 1,
      feedbackTitle: "ALL EARS",
      feedbackBody: "You just handed them the whole stage. That's rarer than charisma — and remembered longer.",
    },
    rep: {
      challenge: "Hold one conversation today entirely in listening mode — react, echo, follow up.",
      sub: "Beat the checkpoint to unlock the rare quote.",
    },
  },
];

/* ---------------- Course 2 · Courage to Be Disliked ----------------
   Original lessons teaching Adlerian psychology in practice.
   Inspired by Alfred Adler's work, popularized by Kishimi & Koga. */

const c101Lessons: Lesson[] = [
  {
    index: 1,
    title: "Whose task is it?",
    isCheckpoint: false,
    concept: {
      headline: "Separate the tasks.",
      body: "Adlerian psychology sorts every problem with one question: who faces the consequence? Your effort is your task. Their reaction is theirs. Most anxiety comes from carrying tasks that were never yours.",
      keyPhrase: "who faces the consequence?",
      coachLine: "“Do your task. Return the rest to sender.”",
    },
    quiz: {
      theySay: "My mom keeps saying I should've picked a safer career.",
      question: "Whose task is your career?",
      options: [
        "Hers too — she raised you, she gets a vote.",
        "Yours — you live the consequences. Her worry is her task.",
      ],
      correctIndex: 1,
      feedbackTitle: "TASKS SEPARATED",
      feedbackBody: "You can hear her worry with love and still not carry it. The consequence lands on you, so the choice is yours.",
    },
    rep: {
      challenge: "Catch yourself carrying someone else's task today — and set it down.",
      sub: "Name it: “that's their task; mine is…”",
    },
  },
  {
    index: 2,
    title: "Their opinion is their task",
    isCheckpoint: false,
    concept: {
      headline: "You can't manage minds.",
      body: "What people think of you is decided in their heads, by their history, on their schedule. It cannot be controlled from the outside — which makes managing it a task you can never complete.",
      keyPhrase: "It cannot be controlled from the outside",
      coachLine: "“Their verdict isn't your job. Your move is.”",
    },
    quiz: {
      theySay: "You speak up in a meeting and someone looks unimpressed.",
      question: "What's actually yours here?",
      options: [
        "Winning that person over before the meeting ends.",
        "Making your point well. Their face is their business.",
      ],
      correctIndex: 1,
      feedbackTitle: "YOURS VS THEIRS",
      feedbackBody: "One is in your control; one never was. Spend effort only where it works.",
    },
    rep: {
      challenge: "Do one thing today without checking anyone's face for approval.",
      sub: "Say it, do it, let the reaction be theirs.",
    },
  },
  {
    index: 3,
    title: "Drop the approval habit",
    isCheckpoint: false,
    concept: {
      headline: "Approval is a rented life.",
      body: "Living to be liked means everyone else holds the steering wheel. The desire for recognition feels safe, but the fee is your own path — paid daily.",
      keyPhrase: "everyone else holds the steering wheel",
      coachLine: "“Liked by everyone is a life spent on other people's errands.”",
    },
    quiz: {
      theySay: "Everyone will think it's weird if I switch fields now.",
      question: "The Adlerian read?",
      options: [
        "Then wait until people would approve.",
        "Some might. Living by their applause means living their plan.",
      ],
      correctIndex: 1,
      feedbackTitle: "WHEEL RETURNED",
      feedbackBody: "Approval is a bonus, not a compass. Direction has to come from you.",
    },
    rep: {
      challenge: "Make one small choice today that's fully yours — without polling anyone first.",
      sub: "Coffee order to career step — any size counts.",
    },
  },
  {
    index: 4,
    title: "The courage to say no",
    isCheckpoint: false,
    concept: {
      headline: "No is a complete move.",
      body: "Every yes spends your hours. Saying no to protect your task isn't selfish — it's honest bookkeeping. Discomfort at a “no” belongs to the asker; the guilt you add on top is optional.",
      keyPhrase: "Discomfort at a “no” belongs to the asker",
      coachLine: "“Short, warm, and no invoice of excuses.”",
    },
    quiz: {
      theySay: "Can you cover my shift Saturday? You're the only one I trust.",
      question: "You're already stretched. The honest move?",
      options: [
        "“I guess… fine.” — and resent it all week.",
        "“I can't this time — hope you find someone.”",
      ],
      correctIndex: 1,
      feedbackTitle: "CLEAN NO",
      feedbackBody: "A warm no keeps the friendship and your Saturday. A resentful yes loses one of them later.",
    },
    rep: {
      challenge: "Say one honest no today — warm, short, no excuse pile.",
      sub: "“I can't this time” is a full sentence.",
    },
  },
  {
    index: 5,
    title: "Don't trade in praise",
    isCheckpoint: false,
    concept: {
      headline: "Get off the praise payroll.",
      body: "If praise is your fuel, whoever hands it out owns your engine. Adler's alternative: do the task because it's yours. Praise becomes weather — nice, but not why you showed up.",
      keyPhrase: "Praise becomes weather",
      coachLine: "“Did you do your task? Then it was a good day.”",
    },
    quiz: {
      theySay: "Nobody even noticed I fixed the whole thing.",
      question: "The self-owned response?",
      options: [
        "Then why bother next time?",
        "It needed fixing; I fixed it. Noticing is their task.",
      ],
      correctIndex: 1,
      feedbackTitle: "SELF-POWERED",
      feedbackBody: "Work that needs applause dies in silence. Work that's yours survives it.",
    },
    rep: {
      challenge: "Do one useful thing today without telling anyone.",
      sub: "Let it stay invisible — on purpose.",
    },
  },
  {
    index: 6,
    title: "Checkpoint: one honest choice",
    isCheckpoint: true,
    concept: {
      headline: "Choose without the jury.",
      body: "Task separation, opinions returned, approval dropped, an honest no, praise-free work — now stack it: make one real decision today from your own values, jury dismissed.",
      keyPhrase: "jury dismissed",
      coachLine: "“One choice, fully yours. That's the rep.”",
    },
    quiz: {
      theySay: "You're about to decide — and start imagining everyone's reactions first.",
      question: "The courage move?",
      options: [
        "Rank everyone's likely opinions, then pick.",
        "Ask “whose task is this?” — then choose from your values.",
      ],
      correctIndex: 1,
      feedbackTitle: "CHOSEN, NOT VOTED",
      feedbackBody: "Input is welcome. The vote isn't. You live the consequences, so it's your call.",
    },
    rep: {
      challenge: "Make one honest choice today — and own it out loud.",
      sub: "Beat the checkpoint to unlock the rare quote.",
    },
  },
];

const c102Lessons: Lesson[] = [
  {
    index: 1,
    title: "Purpose over past",
    isCheckpoint: false,
    concept: {
      headline: "The past doesn't drive.",
      body: "Adler flipped the arrow: we don't act because of the past — we recruit the past to serve today's goal. “I'm shy because of school” can become “I use shyness to avoid risk today.” That flip hands you the keys.",
      keyPhrase: "we recruit the past to serve today's goal",
      coachLine: "“The past explains nothing you can't overrule.”",
    },
    quiz: {
      theySay: "I'm just bad with people — always have been.",
      question: "The Adlerian reframe?",
      options: [
        "Some people are wired quiet. That's that.",
        "“Always have been” is a choice renewed daily — and renewable differently.",
      ],
      correctIndex: 1,
      feedbackTitle: "ARROW FLIPPED",
      feedbackBody: "History is material, not instructions. Today's goal decides what it means.",
    },
    rep: {
      challenge: "Catch one “I've always been…” today and rewrite it as a choice.",
      sub: "“…and today I'm choosing differently, once.”",
    },
  },
  {
    index: 2,
    title: "Feelings are tools",
    isCheckpoint: false,
    concept: {
      headline: "Emotions have jobs.",
      body: "Adler's famous observation: we don't shout because anger overwhelms us — we manufacture anger to make someone comply. Feelings often serve a goal. Spot the job, and you can decline it.",
      keyPhrase: "Feelings often serve a goal",
      coachLine: "“Ask the feeling: what are you trying to get done?”",
    },
    quiz: {
      theySay: "Anxiety spikes right before you'd have to introduce yourself.",
      question: "What job might the anxiety be doing?",
      options: [
        "Warning of real danger — best to skip it.",
        "Providing an exit — “too anxious” excuses the avoid.",
      ],
      correctIndex: 1,
      feedbackTitle: "JOB SPOTTED",
      feedbackBody: "That anxiety isn't a smoke alarm — it's a hall pass. You can feel it and still walk in.",
    },
    rep: {
      challenge: "Once today, name the job a feeling is doing — then act anyway.",
      sub: "“This nervousness wants me to skip. I'm going.”",
    },
  },
  {
    index: 3,
    title: "All problems are people problems",
    isCheckpoint: false,
    concept: {
      headline: "It's all interpersonal.",
      body: "Adler claimed every real worry is an interpersonal one — even “self-esteem” is you, measured against imagined judges. Good news: people problems can be practiced, and practicing is exactly what you're doing here.",
      keyPhrase: "people problems can be practiced",
      coachLine: "“No audience, no problem. Notice that.”",
    },
    quiz: {
      theySay: "I hate how I sound in meetings.",
      question: "Where does this problem actually live?",
      options: [
        "In your voice.",
        "Between you and imagined listeners — an interpersonal rep to train.",
      ],
      correctIndex: 1,
      feedbackTitle: "PROBLEM LOCATED",
      feedbackBody: "Alone on an island, your voice wouldn't bother you. It's relational — so it's trainable.",
    },
    rep: {
      challenge: "Reframe one “me problem” today as a between-people problem.",
      sub: "Then pick the rep that trains it.",
    },
  },
  {
    index: 4,
    title: "Horizontal, not vertical",
    isCheckpoint: false,
    concept: {
      headline: "Meet people level.",
      body: "Vertical relationships rank: admire up, manage down, compete always. Horizontal ones say “different, but equal.” Encouragement — “thanks, that helped” — builds level ground; verdict-praise builds a ladder.",
      keyPhrase: "different, but equal",
      coachLine: "“Thank the act. Don't grade the person.”",
    },
    quiz: {
      theySay: "Your teammate finally nails the thing they'd been struggling with.",
      question: "The horizontal response?",
      options: [
        "“Good job! I'm proud of you.” — teacher voice.",
        "“That helped the whole team — thanks for grinding it out.”",
      ],
      correctIndex: 1,
      feedbackTitle: "LEVEL GROUND",
      feedbackBody: "Gratitude treats them as an equal contributor. Grading treats them as a student.",
    },
    rep: {
      challenge: "Replace one compliment-grade today with a thank-you for impact.",
      sub: "“That helped me” beats “good job”.",
    },
  },
  {
    index: 5,
    title: "Contribution beats comparison",
    isCheckpoint: false,
    concept: {
      headline: "Stop racing sideways.",
      body: "Comparison is vertical thinking in disguise — someone has to lose. Adler's exit is community feeling: measure the day by what you added, not where you ranked. Contribution has no leaderboard.",
      keyPhrase: "measure the day by what you added",
      coachLine: "“'What did I add?' beats 'where do I rank?'”",
    },
    quiz: {
      theySay: "Everyone my age seems further ahead than me.",
      question: "The contribution pivot?",
      options: [
        "Study their timelines and race to catch up.",
        "Ask what you can add today — rank isn't the game.",
      ],
      correctIndex: 1,
      feedbackTitle: "GAME CHANGED",
      feedbackBody: "Their timeline is their task. Your contribution is yours — and it compounds.",
    },
    rep: {
      challenge: "Add one visible bit of value to someone's day — and skip the scoreboard.",
      sub: "Help, share, fix, or teach. Small counts.",
    },
  },
  {
    index: 6,
    title: "Checkpoint: one act of contribution",
    isCheckpoint: true,
    concept: {
      headline: "Belonging is built, not begged.",
      body: "You don't earn a place in the room by being approved — you build it by contributing. One deliberate act of usefulness today, chosen freely: that's the whole philosophy in motion.",
      keyPhrase: "you build it by contributing",
      coachLine: "“Contribute once, on purpose. Feel the floor appear.”",
    },
    quiz: {
      theySay: "You want to feel like you belong with a new group.",
      question: "The Adlerian path in?",
      options: [
        "Wait until they signal you're accepted.",
        "Contribute something — belonging follows usefulness, not applause.",
      ],
      correctIndex: 1,
      feedbackTitle: "FLOOR BUILT",
      feedbackBody: "Acceptance you beg for wobbles. A place you built holds.",
    },
    rep: {
      challenge: "Do one deliberate act of contribution today — and notice how it feels.",
      sub: "Beat the checkpoint to unlock the rare quote.",
    },
  },
];

// Level names + unit placement follow docs/CURRICULUM.md (the 37-unit map).
export const COURSES: Course[] = [
  {
    id: 1,
    title: "Social Skills",
    tagline: "From first hello to leading the room",
    levels: [
      { code: "A1", title: "Survival Social" },
      { code: "A2", title: "Everyday Confidence" },
      { code: "B1", title: "Connection" },
    ],
    chapters: [
      { id: 1, courseId: 1, number: 1, level: "A1", title: "Breaking the Ice", tagline: "First words, made easy", canDo: "Can open, hold, and end a first hello", lessons: c1Lessons },
      { id: 2, courseId: 1, number: 2, level: "A1", title: "Keeping It Going", tagline: "Listening, flow, never running dry", canDo: "Can keep a conversation alive for ten minutes", lessons: c2Lessons },
      { id: 6, courseId: 1, number: 3, level: "A2", title: "The Sounds of Listening", tagline: "Really? No way. And then?", canDo: "Can make people feel heard — and keep them talking", lessons: c6Lessons },
      { id: 3, courseId: 1, number: 4, level: "A2", title: "Telling Stories", tagline: "Make your moments land", canDo: "Can tell a 30-second story that lands", lessons: c3Lessons },
      { id: 4, courseId: 1, number: 5, level: "A2", title: "Confidence Under Pressure", tagline: "High stakes, steady voice", canDo: "Can ask directly, hold a no, and recover from stumbles", lessons: c4Lessons },
      { id: 5, courseId: 1, number: 6, level: "B1", title: "Lead the Room", tagline: "Set the tone wherever you are", canDo: "Can host a room and include everyone in it", lessons: c5Lessons },
    ],
  },
  {
    id: 2,
    title: "Courage to Be Disliked",
    tagline: "Unhook from approval — Adlerian psychology in practice",
    inspiration: "Based on Alfred Adler's psychology, popularized by Kishimi & Koga",
    levels: [{ code: "A1", title: "Own your life" }],
    chapters: [
      { id: 101, courseId: 2, number: 1, level: "A1", title: "Your Tasks, Their Tasks", tagline: "Whose problem is it, really?", canDo: "Can make choices without polling for approval", lessons: c101Lessons },
      { id: 102, courseId: 2, number: 2, level: "A1", title: "Chosen, Not Fated", tagline: "You are not your past", canDo: "Can act from purpose instead of the past", lessons: c102Lessons },
    ],
  },
];

export const CHAPTERS: Chapter[] = COURSES.flatMap((c) => c.chapters);

export function getCourse(id: number): Course | undefined {
  return COURSES.find((c) => c.id === id);
}

export function courseChapters(courseId: number): Chapter[] {
  return getCourse(courseId)?.chapters ?? COURSES[0].chapters;
}

// One quote per lesson; checkpoint quote is the chapter's rare card.
// NOTE: attributions to be editorially verified before launch (see handover).
export const QUOTES: Quote[] = [
  // Chapter 1 · Breaking the Ice
  { id: "c1-l1", chapterId: 1, lessonIndex: 1, rare: false, text: "To be interesting, be interested.", author: "Dale Carnegie", authorNote: "on curiosity" },
  { id: "c1-l2", chapterId: 1, lessonIndex: 2, rare: false, text: "We have two ears and one mouth so we can listen twice as much as we speak.", author: "Epictetus", authorNote: "on listening" },
  { id: "c1-l3", chapterId: 1, lessonIndex: 3, rare: false, text: "The quality of your life is the quality of your conversations.", author: "Tony Robbins", authorNote: "on connection" },
  { id: "c1-l4", chapterId: 1, lessonIndex: 4, rare: false, text: "A person's name is, to that person, the sweetest sound in any language.", author: "Dale Carnegie", authorNote: "on names" },
  { id: "c1-l5", chapterId: 1, lessonIndex: 5, rare: false, text: "Great is the art of beginning, but greater is the art of ending.", author: "H. W. Longfellow", authorNote: "on exits" },
  { id: "c1-l6", chapterId: 1, lessonIndex: 6, rare: true, text: "Courage is what it takes to stand up and speak; courage is also what it takes to sit down and listen.", author: "Winston Churchill", authorNote: "the rare one" },

  // Chapter 2 · Keeping It Going
  { id: "c2-l1", chapterId: 2, lessonIndex: 1, rare: false, text: "Most people do not listen with the intent to understand; they listen with the intent to reply.", author: "Stephen R. Covey", authorNote: "on listening" },
  { id: "c2-l2", chapterId: 2, lessonIndex: 2, rare: false, text: "The right word may be effective, but no word was ever as effective as a rightly timed pause.", author: "Mark Twain", authorNote: "on pauses" },
  { id: "c2-l3", chapterId: 2, lessonIndex: 3, rare: false, text: "Friendship is born at that moment when one person says to another: “What! You too?”", author: "C. S. Lewis", authorNote: "on common ground" },
  { id: "c2-l4", chapterId: 2, lessonIndex: 4, rare: false, text: "Judge a man by his questions rather than by his answers.", author: "Voltaire", authorNote: "on questions" },
  { id: "c2-l5", chapterId: 2, lessonIndex: 5, rare: false, text: "Conversation is an art in which a man has all mankind for his competitors.", author: "R. W. Emerson", authorNote: "on conversation" },
  { id: "c2-l6", chapterId: 2, lessonIndex: 6, rare: true, text: "Wisdom is the reward you get for a lifetime of listening when you'd have preferred to talk.", author: "Doug Larson", authorNote: "the rare one" },

  // Chapter 3 · Telling Stories
  { id: "c3-l1", chapterId: 3, lessonIndex: 1, rare: false, text: "There is no greater agony than bearing an untold story inside you.", author: "Maya Angelou", authorNote: "on stories" },
  { id: "c3-l2", chapterId: 3, lessonIndex: 2, rare: false, text: "Don't tell me the moon is shining; show me the glint of light on broken glass.", author: "Anton Chekhov", authorNote: "on detail" },
  { id: "c3-l3", chapterId: 3, lessonIndex: 3, rare: false, text: "Always leave them wanting more.", author: "P. T. Barnum", authorNote: "on endings" },
  { id: "c3-l4", chapterId: 3, lessonIndex: 4, rare: false, text: "The most important thing in communication is hearing what isn't said.", author: "Peter Drucker", authorNote: "on reading the room" },
  { id: "c3-l5", chapterId: 3, lessonIndex: 5, rare: false, text: "A good laugh is sunshine in a house.", author: "W. M. Thackeray", authorNote: "on shared laughter" },
  { id: "c3-l6", chapterId: 3, lessonIndex: 6, rare: true, text: "The universe is made of stories, not of atoms.", author: "Muriel Rukeyser", authorNote: "the rare one" },

  // Chapter 4 · Confidence Under Pressure
  { id: "c4-l1", chapterId: 4, lessonIndex: 1, rare: false, text: "Nature does not hurry, yet everything is accomplished.", author: "Lao Tzu", authorNote: "on slowing down" },
  { id: "c4-l2", chapterId: 4, lessonIndex: 2, rare: false, text: "Silence is one of the great arts of conversation.", author: "Cicero", authorNote: "on silence" },
  { id: "c4-l3", chapterId: 4, lessonIndex: 3, rare: false, text: "Raise your words, not voice. It is rain that grows flowers, not thunder.", author: "Rumi", authorNote: "on disagreeing" },
  { id: "c4-l4", chapterId: 4, lessonIndex: 4, rare: false, text: "If you don't ask, the answer is always no.", author: "Nora Roberts", authorNote: "on asking" },
  { id: "c4-l5", chapterId: 4, lessonIndex: 5, rare: false, text: "Do not fear mistakes. There are none.", author: "Miles Davis", authorNote: "on recovery" },
  { id: "c4-l6", chapterId: 4, lessonIndex: 6, rare: true, text: "You gain strength, courage and confidence by every experience in which you really stop to look fear in the face.", author: "Eleanor Roosevelt", authorNote: "the rare one" },

  // Chapter 5 · Lead the Room
  { id: "c5-l1", chapterId: 5, lessonIndex: 1, rare: false, text: "There are no strangers here; only friends you haven't yet met.", author: "W. B. Yeats", authorNote: "on welcome" },
  { id: "c5-l2", chapterId: 5, lessonIndex: 2, rare: false, text: "The way to develop the best that is in a person is by appreciation and encouragement.", author: "Charles Schwab", authorNote: "on lifting others" },
  { id: "c5-l3", chapterId: 5, lessonIndex: 3, rare: false, text: "Keep your face to the sunshine and you cannot see a shadow.", author: "Helen Keller", authorNote: "on tone" },
  { id: "c5-l4", chapterId: 5, lessonIndex: 4, rare: false, text: "There is no exercise better for the heart than reaching down and lifting people up.", author: "John Holmes", authorNote: "on including others" },
  { id: "c5-l5", chapterId: 5, lessonIndex: 5, rare: false, text: "Kind words can be short and easy to speak, but their echoes are truly endless.", author: "Mother Teresa", authorNote: "on goodbyes" },
  { id: "c5-l6", chapterId: 5, lessonIndex: 6, rare: true, text: "People will forget what you said, people will forget what you did, but people will never forget how you made them feel.", author: "Maya Angelou", authorNote: "the rare one" },

  // Chapter 6 · The Sounds of Listening
  { id: "c6-l1", chapterId: 6, lessonIndex: 1, rare: false, text: "Listening is a magnetic and strange thing, a creative force.", author: "Brenda Ueland", authorNote: "on listening" },
  { id: "c6-l2", chapterId: 6, lessonIndex: 2, rare: false, text: "Shared joy is a double joy; shared sorrow is half a sorrow.", author: "Swedish proverb", authorNote: "on matching" },
  { id: "c6-l3", chapterId: 6, lessonIndex: 3, rare: false, text: "The word 'listen' contains the same letters as the word 'silent'.", author: "Alfred Brendel", authorNote: "on echoes" },
  { id: "c6-l4", chapterId: 6, lessonIndex: 4, rare: false, text: "Questions are the creative acts of intelligence.", author: "Frank Kingdon", authorNote: "on follow-ups" },
  { id: "c6-l5", chapterId: 6, lessonIndex: 5, rare: false, text: "Most conversations are simply monologues delivered in the presence of a witness.", author: "Margaret Millar", authorNote: "on shifting" },
  { id: "c6-l6", chapterId: 6, lessonIndex: 6, rare: true, text: "You can make more friends in two months by becoming interested in other people than in two years trying to get people interested in you.", author: "Dale Carnegie", authorNote: "the rare one" },

  // Course 2, Chapter 101 · Your Tasks, Their Tasks
  { id: "c101-l1", chapterId: 101, lessonIndex: 1, rare: false, text: "Care about what other people think and you will always be their prisoner.", author: "Lao Tzu", authorNote: "on approval" },
  { id: "c101-l2", chapterId: 101, lessonIndex: 2, rare: false, text: "You wouldn't worry so much about what others think of you if you realized how seldom they do.", author: "Eleanor Roosevelt", authorNote: "on being watched" },
  { id: "c101-l3", chapterId: 101, lessonIndex: 3, rare: false, text: "We all love ourselves more than other people, but care more about their opinion than our own.", author: "Marcus Aurelius", authorNote: "on opinions" },
  { id: "c101-l4", chapterId: 101, lessonIndex: 4, rare: false, text: "Half the troubles of this life can be traced to saying yes too quickly and not saying no soon enough.", author: "Josh Billings", authorNote: "on saying no" },
  { id: "c101-l5", chapterId: 101, lessonIndex: 5, rare: false, text: "It is easier to fight for one's principles than to live up to them.", author: "Alfred Adler", authorNote: "on daily practice" },
  { id: "c101-l6", chapterId: 101, lessonIndex: 6, rare: true, text: "The courage to be happy also includes the courage to be disliked.", author: "Kishimi & Koga", authorNote: "the rare one" },

  // Course 2, Chapter 102 · Chosen, Not Fated
  { id: "c102-l1", chapterId: 102, lessonIndex: 1, rare: false, text: "Meanings are not determined by situations; we determine ourselves by the meanings we give to situations.", author: "Alfred Adler", authorNote: "on choice" },
  { id: "c102-l2", chapterId: 102, lessonIndex: 2, rare: false, text: "Trust only movement. Life happens at the level of events, not of words.", author: "Alfred Adler", authorNote: "on action" },
  { id: "c102-l3", chapterId: 102, lessonIndex: 3, rare: false, text: "The only normal people are the ones you don't know very well.", author: "Alfred Adler", authorNote: "on people" },
  { id: "c102-l4", chapterId: 102, lessonIndex: 4, rare: false, text: "Treat people as if they were what they ought to be and you help them become what they are capable of being.", author: "Goethe", authorNote: "on encouragement" },
  { id: "c102-l5", chapterId: 102, lessonIndex: 5, rare: false, text: "Comparison is the thief of joy.", author: "Theodore Roosevelt", authorNote: "on comparison" },
  { id: "c102-l6", chapterId: 102, lessonIndex: 6, rare: true, text: "Happiness is the feeling of contribution.", author: "Kishimi & Koga", authorNote: "the rare one" },
];

export function getChapter(id: number): Chapter | undefined {
  return CHAPTERS.find((c) => c.id === id);
}

export function getLesson(chapterId: number, lessonIndex: number): Lesson | undefined {
  return getChapter(chapterId)?.lessons.find((l) => l.index === lessonIndex);
}

export function getQuote(chapterId: number, lessonIndex: number): Quote | undefined {
  return QUOTES.find((q) => q.chapterId === chapterId && q.lessonIndex === lessonIndex);
}

export function quoteById(id: string): Quote | undefined {
  return QUOTES.find((q) => q.id === id);
}
