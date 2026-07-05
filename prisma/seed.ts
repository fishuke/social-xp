// Seeds the content tables (Course/Unit/Lesson/Quote). Safe to re-run: wipes
// and recreates CONTENT only — never touches user data.
// Units follow docs/CURRICULUM.md. Every lesson: ~3 min — concepts, one
// behavior quiz, one CBT thought-reframe (voice:"inner"), and "the move".

import { PrismaClient } from "@prisma/client";
import type { Challenge, LessonStep } from "../lib/content";

const prisma = new PrismaClient();

type SeedLesson = {
  index: number;
  title: string;
  isCheckpoint?: boolean;
  steps: LessonStep[];
  challenge: Challenge;
};

const c = (headline: string, body: string, keyPhrase: string, coachLine?: string): LessonStep => ({
  type: "concept", headline, body, keyPhrase, coachLine,
});
const q = (theySay: string, question: string, options: string[], feedbackTitle: string, feedbackBody: string): LessonStep => ({
  type: "quiz", voice: "them", theySay, question, options, correctIndex: 1, feedbackTitle, feedbackBody,
});
const r = (thought: string, question: string, options: string[], feedbackTitle: string, feedbackBody: string): LessonStep => ({
  type: "quiz", voice: "inner", theySay: thought, question, options, correctIndex: 1, feedbackTitle, feedbackBody,
});

/* ================= UNIT 1 · First Contact ================= */

const unit1Lessons: SeedLesson[] = [
  {
    index: 1,
    title: "Say hi first",
    steps: [
      c(
        "Going first is the skill.",
        "Almost everyone waits to be approached. Almost everyone is relieved when someone else goes first. Going first is the whole move — it doesn't need to be clever, it needs to exist.",
        "Going first is the whole move",
        "“Hi counts. That's the whole thing.”"
      ),
      q(
        "You walk in and someone from your team is already there, scrolling their phone.",
        "What's the winning move?",
        ["Wait — if they want to talk, they'll look up.", "Say hi first, even if it's tiny."],
        "GOING FIRST WINS",
        "Waiting feels safe, but it hands the moment away. A two-second “hey” is the whole challenge."
      ),
      c(
        "Lower the bar.",
        "A hello doesn't need a follow-up plan. No cleverness, no opener, no goal — eye contact, small smile, one word. Anything more is bonus.",
        "eye contact, small smile, one word"
      ),
      r(
        "If I say hi and they barely respond, I'll look stupid.",
        "Talk back to that thought:",
        [
          "True — better to stay quiet and safe.",
          "A flat response says they're busy, not that I failed. Nobody replays my hello at midnight.",
        ],
        "THOUGHT CHALLENGED",
        "That's mind-reading plus catastrophizing. Worst realistic case: a neutral nod — survivable, forgettable, and still a completed hello."
      ),
      c(
        "Your move today.",
        "Greet one person before they greet you. First is the brave part — you don't need more than “hey”. The win is going first, not what comes after.",
        "The win is going first"
      ),
    ],
    challenge: {
      text: "Say hi first to one person today — before they say it to you.",
      sub: "Barista, neighbor, coworker — eye contact, smile, “hey”. That's it.",
    },
  },
  {
    index: 2,
    title: "Match the greeting",
    steps: [
      c(
        "Read the setting.",
        "A greeting has a size: nod for the hallway, wave across the street, handshake when you're introduced. Matching the setting beats maximizing warmth.",
        "Matching the setting beats maximizing warmth",
        "“When in doubt, go one size smaller.”"
      ),
      q(
        "You pass a coworker in a narrow hallway — both of you mid-walk.",
        "Right-size greeting?",
        ["Stop them for a proper handshake and a chat.", "Nod + “hey” without breaking stride."],
        "SIZED RIGHT",
        "Hallways want small greetings. Saving the handshake for real meetings keeps both natural."
      ),
      c(
        "First meetings get the full package.",
        "When you're introduced, the package is short: stand if you're seated, hand out, your name said clearly, their name said back. Five seconds, done.",
        "stand if you're seated, hand out, name clear"
      ),
      r(
        "Handshakes and intros feel so formal — I'll seem try-hard.",
        "Talk back to that thought:",
        [
          "Right — better to stay vague and mumble.",
          "Nobody has ever thought less of someone for a clear name and a hand. “Try-hard” is my label, not theirs.",
        ],
        "THOUGHT CHALLENGED",
        "That's fortune-telling. The actual data: people rate a clear intro as confidence, not effort."
      ),
      c(
        "Your move today.",
        "Pick the right size on purpose: nod the hallway, wave the street, shake the intro. Sizing it deliberately once makes it automatic forever.",
        "Pick the right size on purpose"
      ),
    ],
    challenge: {
      text: "Match one greeting to its setting today — deliberately.",
      sub: "Nod the hallway, wave the street, shake the intro.",
    },
  },
  {
    index: 3,
    title: "Remember the name",
    steps: [
      c(
        "Names slip in three seconds.",
        "You don't forget names — you never load them. While they say “I'm Maya,” your brain is busy rehearsing your own intro. Catch the name the moment it lands.",
        "Catch the name the moment it lands",
        "“Their name is the only word that matters in that sentence.”"
      ),
      q(
        "Hey, I'm Maya — I don't think we've met.",
        "Best way to lock in her name?",
        ["“Nice to meet you!” — and keep it moving.", "“Maya — nice to meet you. How do you know everyone here?”"],
        "SAY IT BACK ONCE",
        "Repeating the name out loud files it in memory — and people love hearing it."
      ),
      c(
        "Repeat, use, associate.",
        "Three hooks: say it back once (“Maya — nice to meet you”), use it once mid-chat, and pin it to something (“Maya from Milan”). Three touches and it's yours.",
        "say it back, use it once, pin it"
      ),
      r(
        "I'm just bad with names. Always have been.",
        "Talk back to that thought:",
        [
          "True — some brains don't do names.",
          "I was never bad at names; I was skipping the loading step. Hooks are a technique, not a talent.",
        ],
        "THOUGHT CHALLENGED",
        "“Always have been” is a label, not a fact. Change the method and the result changes with it."
      ),
      c(
        "Your move today.",
        "Learn one new name with all three hooks — say it back, use it once, pin it to a detail. One name, fully loaded, beats ten heard and lost.",
        "One name, fully loaded"
      ),
    ],
    challenge: {
      text: "Learn one new name today with all three hooks — back, use, pin.",
      sub: "“Thanks, Maya” on the way out counts double.",
    },
  },
  {
    index: 4,
    title: "Use the name — lightly",
    steps: [
      c(
        "Names are seasoning.",
        "One name every few minutes warms the room; a name in every sentence reads like a sales script. Use it at hello, at a key moment, and at goodbye.",
        "at hello, at a key moment, and at goodbye",
        "“Season, don't marinate.”"
      ),
      q(
        "“Great point, Alex. You know, Alex, that's exactly why, Alex—”",
        "What's happening here?",
        ["Champion-level charisma.", "Name overdose — it starts to feel like a pitch."],
        "OVERDOSE SPOTTED",
        "Past a point, names stop feeling warm and start feeling engineered. Two or three per conversation is plenty."
      ),
      c(
        "Goodbye is the power slot.",
        "The name at goodbye lands hardest — “good seeing you, Maya” proves the whole exchange registered and stayed with you.",
        "The name at goodbye lands hardest"
      ),
      r(
        "What if I say their name wrong and offend them?",
        "Talk back to that thought:",
        [
          "Exactly — safer to never use names at all.",
          "A wrong attempt plus “did I get that right?” reads as care. Never trying reads as distance.",
        ],
        "THOUGHT CHALLENGED",
        "That's catastrophizing a correctable moment. People correct their name happily — it means you tried."
      ),
      c(
        "Your move today.",
        "Use someone's name exactly twice: once mid-conversation, once at goodbye. Feel the difference in how the goodbye lands.",
        "once mid-conversation, once at goodbye"
      ),
    ],
    challenge: {
      text: "Use someone's name twice today — mid-chat and at goodbye.",
      sub: "“Good seeing you, Maya” is the power slot.",
    },
  },
  {
    index: 5,
    title: "Not every hello is a conversation",
    steps: [
      c(
        "Hellos have exits.",
        "A greeting is complete by itself. “Hey, good to see you” plus moving on is polite, not cold — forcing small talk at every hello burns both of you out.",
        "A greeting is complete by itself",
        "“You're allowed to keep walking.”"
      ),
      q(
        "You spot an acquaintance at the store — both of you mid-errand.",
        "The right size?",
        ["Corner them for a ten-minute catch-up by the milk.", "Warm wave + “good to see you!” and carry on."],
        "RIGHT SIZE",
        "Both of you leave warmer, neither trapped. That's a perfect hello."
      ),
      c(
        "The soft close.",
        "If a hello starts becoming a chat you can't hold, close it warm and forward: “I've got to run — let's catch up properly soon.” Name the limit, add a comeback.",
        "close it warm and forward"
      ),
      r(
        "If I cut this short, they'll think I don't like them.",
        "Talk back to that thought:",
        [
          "True — I owe everyone unlimited time.",
          "A warm exit with a reason reads as a full life, not rejection. Trapped-and-resentful me is worse company anyway.",
        ],
        "THOUGHT CHALLENGED",
        "Mind-reading again. People remember the warmth of the close, not the length of the chat."
      ),
      c(
        "Your move today.",
        "Give one complete hello that stays a hello — warm in, warm out, keep walking. Notice that nothing bad happens.",
        "warm in, warm out, keep walking"
      ),
    ],
    challenge: {
      text: "Give one complete hello today that stays a hello.",
      sub: "Warm in, warm out — and keep walking.",
    },
  },
  {
    index: 6,
    title: "Checkpoint: three first contacts",
    isCheckpoint: true,
    steps: [
      c(
        "Stack the unit.",
        "Go first, size it right, catch the name, use it lightly, exit warm. One first contact uses all five moves — three of them make a checkpoint.",
        "One first contact uses all five moves",
        "“Tiny ones count. Go collect three.”"
      ),
      q(
        "A new person joins your table and sits down next to you.",
        "Run the opening play:",
        ["Wait for someone else to handle it.", "“Hey, I'm Alex — I don't think we've met?”"],
        "PLAY RAN",
        "Went first, name offered, door open. That's the whole unit in one sentence."
      ),
      c(
        "Recovery is part of the skill.",
        "Blank on a name ten seconds after hearing it? Ask again immediately — “sorry, I lost your name mid-handshake” — asking within a minute is charming; guessing for a month isn't.",
        "asking within a minute is charming"
      ),
      r(
        "Three conversations with strangers? That's way too much for me.",
        "Talk back to that thought:",
        [
          "Agreed — skip today, start Monday.",
          "A hello to the barista is contact #1. It's three tiny moments, not three speeches.",
        ],
        "THOUGHT CHALLENGED",
        "All-or-nothing thinking makes tiny tasks look huge. Break it down: each contact is ~10 seconds long."
      ),
      c(
        "Your move today.",
        "Three first contacts: greet first, catch the name if there is one, exit warm. That's the checkpoint — and the rare quote.",
        "greet first, catch the name, exit warm"
      ),
    ],
    challenge: {
      text: "Make three first contacts today — greet first, catch the name, exit warm.",
      sub: "Beat the checkpoint to unlock the rare quote.",
    },
  },
];

/* ================= UNIT 2 · The Listening Body ================= */

const unit2Lessons: SeedLesson[] = [
  {
    index: 1,
    title: "The 50/70 rule",
    steps: [
      c(
        "Eyes carry the signal.",
        "The working rule from communication research: hold eye contact about 50% of the time while you speak, and about 70% while you listen. Enough to connect — not enough to interrogate.",
        "50% while you speak, 70% while you listen",
        "“Look at them more when they talk than when you do.”"
      ),
      q(
        "They're telling you something that clearly matters to them.",
        "Where are your eyes?",
        ["Anywhere else — sustained eye contact is a lot.", "Mostly on them — listening earns more eye contact than talking."],
        "70 ON",
        "Eyes-on while they speak is the loudest way to say “this matters” without a word."
      ),
      c(
        "Breaks are normal.",
        "Glancing away to think is human. Break sideways — the thinking direction — rather than down at your phone or past their shoulder, and come back when you land the thought.",
        "Break sideways, and come back"
      ),
      r(
        "Eye contact feels so intense — they'll think I'm weird for looking.",
        "Talk back to that thought:",
        [
          "Correct — floors were made for looking at.",
          "Discomfort with eye contact is mine, not theirs. Nobody has ever described a listener as “too attentive.”",
        ],
        "THOUGHT CHALLENGED",
        "That's emotional reasoning — “it feels intense, so it must look intense.” At 70% with natural breaks, it just looks like listening."
      ),
      c(
        "Your move today.",
        "One conversation with eyes up around 70% while they talk. Watch what it changes — people talk longer and warmer to eyes that stay.",
        "eyes up around 70% while they talk"
      ),
    ],
    challenge: {
      text: "Hold ~70% eye contact while someone talks to you today.",
      sub: "Break sideways to think — then come back.",
    },
  },
  {
    index: 2,
    title: "Face the person",
    steps: [
      c(
        "Bodies talk first.",
        "Your shoulders and feet announce interest before your mouth does. Squaring up to someone — even a quarter turn — says “you have me” louder than words.",
        "shoulders and feet announce interest",
        "“Point your belly button at the person.”"
      ),
      q(
        "A colleague starts talking while you're angled at your screen.",
        "The listening body?",
        ["Keep typing and throw words over your shoulder.", "Turn the chair, face them, hands off the keys."],
        "SQUARED UP",
        "The turn costs three seconds and changes the entire conversation's temperature."
      ),
      c(
        "Open beats closed.",
        "Crossed arms, hunched shoulders, a bag clutched like a shield — all read as “done talking.” Uncross, drop the shoulders, open the stance.",
        "Uncross, drop the shoulders, open the stance"
      ),
      r(
        "Crossed arms are just comfortable — changing my posture is fake.",
        "Talk back to that thought:",
        [
          "Yes — authenticity means never adjusting anything.",
          "Posture is communication, and I edit my words for clarity all the time. Opening up isn't fake — it's legible.",
        ],
        "THOUGHT CHALLENGED",
        "Comfort and signal are separate things. You can feel relaxed and still broadcast “closed” — fixing the broadcast isn't dishonest."
      ),
      c(
        "Your move today.",
        "Once today, give someone the full turn: feet, shoulders, eyes. Three seconds of body language that outperforms a paragraph of “mm-hm.”",
        "the full turn: feet, shoulders, eyes"
      ),
    ],
    challenge: {
      text: "Square up fully to one person today — feet, shoulders, eyes.",
      sub: "Especially when it's inconvenient. That's when it counts.",
    },
  },
  {
    index: 3,
    title: "Nod like you mean it",
    steps: [
      c(
        "Nods are punctuation.",
        "Slow single nods at their key points say “tracking.” Machine-gun nodding through everything says “please finish.” Nod at the beats, not the whole song.",
        "Nod at the beats, not the whole song",
        "“One good nod beats nine fast ones.”"
      ),
      q(
        "They land the most important line of their story.",
        "Right response?",
        ["Rapid-fire nodding — you've been going since sentence one.", "One slow nod, eyebrows up: “wow.”"],
        "PUNCTUATED",
        "A reaction that arrives exactly at their key moment proves you followed the whole road there."
      ),
      c(
        "Mix the signals.",
        "Nod + a small sound (“mm”, “right”) + a real expression change — together they paint the full listening picture. Any one alone, repeated, goes robotic.",
        "the full listening picture"
      ),
      r(
        "If I don't react constantly, they'll think I'm not listening.",
        "Talk back to that thought:",
        [
          "True — more nodding is always more listening.",
          "Constant reacting is noise. Well-timed reactions are proof. Quality of attention beats quantity of motion.",
        ],
        "THOUGHT CHALLENGED",
        "That's over-compensation — performing listening instead of doing it. Timed beats constant, every time."
      ),
      c(
        "Your move today.",
        "One conversation where you nod only at their key beats — and let one “mm” or eyebrow-raise do the rest.",
        "nod only at their key beats"
      ),
    ],
    challenge: {
      text: "In one conversation today, nod only at the key beats.",
      sub: "Add one “mm” or “right” — timed, not constant.",
    },
  },
  {
    index: 4,
    title: "Phone down",
    steps: [
      c(
        "The phone is a wall.",
        "A phone face-up on the table taxes the conversation before it starts — researchers call it phubbing, and people feel it even in a half-second glance.",
        "people feel it even in a half-second glance",
        "“There is no sneaky glance. They see all of them.”"
      ),
      q(
        "Your phone buzzes mid-story.",
        "The present move?",
        ["Quick peek while nodding — that's multitasking.", "Leave it. The buzz will still be there; the moment won't."],
        "WALL DOWN",
        "Every glance resets their sense of mattering to zero. Leaving it face-down mid-buzz is a visible gift."
      ),
      c(
        "Signal it.",
        "Phone away — pocket, bag, face-down out of reach — is something people consciously notice. If you truly must check, say it out loud: “sorry — expecting one thing.”",
        "say it out loud",
      ),
      r(
        "I might miss something important if I put it away.",
        "Talk back to that thought:",
        [
          "Right — every notification is an emergency.",
          "In one phone-free hour, the realistic miss is a meme. Real emergencies call twice.",
        ],
        "THOUGHT CHALLENGED",
        "That's the urgency illusion. Check the actual record: when did a 30-minute delay last cost you anything?"
      ),
      c(
        "Your move today.",
        "One fully phone-free conversation — away, not face-down. Feel how different your own attention behaves without the wall.",
        "away, not face-down"
      ),
    ],
    challenge: {
      text: "Have one fully phone-free conversation today.",
      sub: "In the bag, not face-down on the table.",
    },
  },
  {
    index: 5,
    title: "Your resting face",
    steps: [
      c(
        "Your face has a default.",
        "Whatever your face does at rest is what strangers read as “you.” Most resting faces read more tired or annoyed than their owner actually feels — especially after screens.",
        "read more tired or annoyed than their owner actually feels",
        "“Nobody looks as neutral as they feel.”"
      ),
      q(
        "A new teammate admits you seemed “hard to approach” at first.",
        "Likely culprit?",
        ["Your personality. Panic accordingly.", "Resting face — screen-focus flattens everyone's default."],
        "CULPRIT FOUND",
        "It's the face, not the person. Which is great news — faces take feedback."
      ),
      c(
        "Soften on entry.",
        "No permanent grin required — just a two-second reset when someone approaches: eyebrows up a touch, jaw loose, small warm-up smile. Then talk.",
        "a two-second reset when someone approaches"
      ),
      r(
        "So my face is the problem? Great — I'm just unapproachable.",
        "Talk back to that thought:",
        [
          "Yes. Some people are simply built unapproachable.",
          "A default is a habit, not an identity. Two seconds of reset changes what people meet.",
        ],
        "THOUGHT CHALLENGED",
        "That's labeling — turning one changeable signal into a permanent trait. The signal takes two seconds to change."
      ),
      c(
        "Your move today.",
        "Catch your resting face once — mirror, camera, window — then practice the two-second reset when someone approaches you.",
        "practice the two-second reset"
      ),
    ],
    challenge: {
      text: "Do the two-second face reset when someone approaches you today.",
      sub: "Eyebrows up a touch, jaw loose, small smile — then talk.",
    },
  },
  {
    index: 6,
    title: "Checkpoint: one fully-present conversation",
    isCheckpoint: true,
    steps: [
      c(
        "The full listening body.",
        "Eyes at 70, body squared, nods on the beats, phone gone, face soft. Five silent signals, one message: “you have my whole attention.”",
        "Five silent signals, one message",
        "“Attention, deliberately shown, is rare. Be the rare one.”"
      ),
      q(
        "Your friend starts sharing something heavy.",
        "The present-body checklist starts with…",
        ["The perfect piece of advice.", "Face them, phone away, eyes on — before any words at all."],
        "BODY FIRST",
        "Presence lands before language. Get the body right and the words matter twice as much."
      ),
      c(
        "It's the cheapest superpower.",
        "Nothing in this unit needs wit, courage, or the right words. Deliberate attention is the rarest thing most people receive all day — and it costs you nothing.",
        "Deliberate attention is the rarest thing"
      ),
      r(
        "Mid-conversation I realize: arms crossed, phone in hand, eyes drifting. Ruined it.",
        "Talk back to that thought:",
        [
          "Yes — abort the conversation in shame.",
          "Noticing IS the skill working. Quietly fix all three and re-enter — no announcement needed.",
        ],
        "THOUGHT CHALLENGED",
        "All-or-nothing again. Presence isn't a streak you break; it's a dial you can turn up mid-sentence."
      ),
      c(
        "Your move today.",
        "One conversation with the full listening body, start to finish. That's the checkpoint — and the rare quote.",
        "the full listening body, start to finish"
      ),
    ],
    challenge: {
      text: "Hold one conversation with the full listening body — start to finish.",
      sub: "Beat the checkpoint to unlock the rare quote.",
    },
  },
];

/* ================= quotes ================= */

const quotes = [
  { unitId: 1, lessonIndex: 1, text: "To be interesting, be interested.", author: "Dale Carnegie", authorNote: "on curiosity", rare: false },
  { unitId: 1, lessonIndex: 2, text: "You never get a second chance to make a first impression.", author: "Will Rogers", authorNote: "on first contact", rare: false },
  { unitId: 1, lessonIndex: 3, text: "A person's name is, to that person, the sweetest sound in any language.", author: "Dale Carnegie", authorNote: "on names", rare: false },
  { unitId: 1, lessonIndex: 4, text: "The right word may be effective, but no word was ever as effective as a rightly timed pause.", author: "Mark Twain", authorNote: "on timing", rare: false },
  { unitId: 1, lessonIndex: 5, text: "Great is the art of beginning, but greater is the art of ending.", author: "H. W. Longfellow", authorNote: "on exits", rare: false },
  { unitId: 1, lessonIndex: 6, text: "There are no strangers here; only friends you haven't yet met.", author: "W. B. Yeats", authorNote: "the rare one", rare: true },
  { unitId: 2, lessonIndex: 1, text: "The eyes have one language everywhere.", author: "George Herbert", authorNote: "on eye contact", rare: false },
  { unitId: 2, lessonIndex: 2, text: "The body never lies.", author: "Martha Graham", authorNote: "on posture", rare: false },
  { unitId: 2, lessonIndex: 3, text: "We have two ears and one mouth so we can listen twice as much as we speak.", author: "Epictetus", authorNote: "on listening", rare: false },
  { unitId: 2, lessonIndex: 4, text: "Wherever you are, be all there.", author: "Jim Elliot", authorNote: "on presence", rare: false },
  { unitId: 2, lessonIndex: 5, text: "Peace begins with a smile.", author: "Mother Teresa", authorNote: "on your face", rare: false },
  { unitId: 2, lessonIndex: 6, text: "The most basic of all human needs is the need to understand and be understood.", author: "Ralph Nichols", authorNote: "the rare one", rare: true },
];

async function main() {
  // content only — user tables untouched
  await prisma.quote.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.unit.deleteMany({});
  await prisma.course.deleteMany({});

  await prisma.course.create({
    data: { id: 1, title: "Social Skills", tagline: "From first hello to leading the room", sortOrder: 0 },
  });

  const units = [
    {
      id: 1, courseId: 1, number: 1, level: "A1", levelTitle: "Survival Social",
      title: "First Contact", tagline: "Hellos, names, and easy exits",
      canDo: "Can open, hold, and end a first hello", lessons: unit1Lessons,
    },
    {
      id: 2, courseId: 1, number: 2, level: "A1", levelTitle: "Survival Social",
      title: "The Listening Body", tagline: "Presence before words",
      canDo: "Can look, face, and stay present in a conversation", lessons: unit2Lessons,
    },
  ];

  for (const { lessons, ...unit } of units) {
    await prisma.unit.create({ data: unit });
    for (const lesson of lessons) {
      await prisma.lesson.create({
        data: {
          unitId: unit.id,
          index: lesson.index,
          title: lesson.title,
          isCheckpoint: lesson.isCheckpoint ?? false,
          steps: lesson.steps,
          challenge: lesson.challenge,
        },
      });
    }
  }

  for (const quote of quotes) {
    await prisma.quote.create({
      data: { id: `u${quote.unitId}-l${quote.lessonIndex}`, ...quote },
    });
  }

  const counts = await Promise.all([prisma.unit.count(), prisma.lesson.count(), prisma.quote.count()]);
  console.log(`Seeded: ${counts[0]} units, ${counts[1]} lessons, ${counts[2]} quotes`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
