// Seeds the content tables (Course/Unit/Lesson/Quote). Safe to re-run: wipes
// and recreates CONTENT only, never touches user data.
// Units follow docs/CURRICULUM.md. Every lesson: ~3 min. Concepts, one
// behavior quiz, one CBT thought-reframe (voice:"inner"), and "the move".
// Style rules: no em-dashes anywhere; quizzes have 3-4 options and the correct
// answer position varies (never a fixed slot).

import { PrismaClient } from "@prisma/client";
import {
  challengeSchema,
  lessonStepsSchema,
  type Challenge,
  type LessonStep,
} from "../lib/content";

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
const q = (theySay: string, question: string, options: string[], correctIndex: number, feedbackTitle: string, feedbackBody: string): LessonStep => ({
  type: "quiz", voice: "them", theySay, question, options, correctIndex, feedbackTitle, feedbackBody,
});
const r = (thought: string, question: string, options: string[], correctIndex: number, feedbackTitle: string, feedbackBody: string): LessonStep => ({
  type: "quiz", voice: "inner", theySay: thought, question, options, correctIndex, feedbackTitle, feedbackBody,
});

/* ================= UNIT 1 · First Contact ================= */

const unit1Lessons: SeedLesson[] = [
  {
    index: 1,
    title: "Say hi first",
    steps: [
      c(
        "Going first is the skill.",
        "Almost everyone waits to be approached, and almost everyone is relieved when someone else goes first. Going first is the whole move. It doesn't need to be clever, it needs to exist.",
        "Going first is the whole move",
        "“Hi counts. That's the whole thing.”"
      ),
      q(
        "You walk in and someone from your team is already there, scrolling their phone.",
        "What's the winning move?",
        [
          "Say hi first, even if it's tiny.",
          "Wait. If they want to talk, they'll look up.",
          "Think of a good opener first, then go over once you have one.",
          "Skip it and message them later. Less pressure for everyone.",
        ],
        0,
        "GOING FIRST WINS",
        "Waiting, drafting the perfect opener, texting later: all three are stalls dressed up as plans. A two-second “hey” is the whole challenge."
      ),
      c(
        "Lower the bar.",
        "A hello doesn't need a follow-up plan. No cleverness, no opener, no goal. Just eye contact, small smile, one word. Anything more is bonus.",
        "eye contact, small smile, one word"
      ),
      r(
        "If I say hi and they barely respond, I'll look stupid.",
        "Talk back to that thought:",
        [
          "True. Better to stay quiet and safe.",
          "I'll only greet people who greet me first. Then I can't lose.",
          "A flat response says they're busy, not that I failed. Nobody replays my hello at midnight.",
        ],
        2,
        "THOUGHT CHALLENGED",
        "That's mind-reading plus catastrophizing. Worst realistic case: a neutral nod. Survivable, forgettable, and still a completed hello."
      ),
      c(
        "Your move today.",
        "Greet one person before they greet you. First is the brave part, and you don't need more than “hey”. The win is going first, not what comes after.",
        "The win is going first"
      ),
    ],
    challenge: {
      text: "Say hi first to one person today, before they say it to you.",
      sub: "Barista, neighbor, coworker. Eye contact, smile, “hey”. That's it.",
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
        "You pass a coworker in a narrow hallway, both of you mid-walk.",
        "Right-size greeting?",
        [
          "Stop them for a proper handshake and a quick chat.",
          "A big wave and a loud “heyyy!” so it lands warm.",
          "Eyes on the floor. Hallways are for walking.",
          "Nod plus “hey” without breaking stride.",
        ],
        3,
        "SIZED RIGHT",
        "Hallways want small greetings. The handshake is oversized, the loud hello is oversized, and the floor-stare is a zero. Small and warm wins."
      ),
      c(
        "First meetings get the full package.",
        "When you're introduced, the package is short: stand if you're seated, hand out, your name said clearly, their name said back. Five seconds, done.",
        "stand if you're seated, hand out, name clear"
      ),
      r(
        "Handshakes and intros feel so formal. I'll seem try-hard.",
        "Talk back to that thought:",
        [
          "Nobody has ever thought less of someone for a clear name and a hand. “Try-hard” is my label, not theirs.",
          "Right. Better to stay vague and mumble.",
          "I'll skip intros entirely and just start talking. Smoother that way.",
        ],
        0,
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
      text: "Match one greeting to its setting today, deliberately.",
      sub: "Nod the hallway, wave the street, shake the intro.",
    },
  },
  {
    index: 3,
    title: "Remember the name",
    steps: [
      c(
        "Names slip in three seconds.",
        "You don't forget names. You never load them. While they say “I'm Maya,” your brain is busy rehearsing your own intro. Catch the name the moment it lands.",
        "Catch the name the moment it lands",
        "“Their name is the only word that matters in that sentence.”"
      ),
      q(
        "Hey, I'm Maya. I don't think we've met.",
        "Best way to lock in her name?",
        [
          "“Nice to meet you!” and keep it moving.",
          "“Maya, nice to meet you. How do you know everyone here?”",
          "Silently repeat “Maya Maya Maya” while she keeps talking.",
          "Ask for her number so her name is saved in your phone.",
        ],
        1,
        "SAY IT BACK ONCE",
        "Saying it back out loud files it in memory, and people love hearing it. Silent repetition means you miss her next sentence, and the phone trick skips the actual skill."
      ),
      c(
        "Repeat, use, associate.",
        "Three hooks: say it back once (“Maya, nice to meet you”), use it once mid-chat, and pin it to something (“Maya from Milan”). Three touches and it's yours.",
        "say it back, use it once, pin it"
      ),
      r(
        "I'm just bad with names. Always have been.",
        "Talk back to that thought:",
        [
          "True. Some brains don't do names.",
          "I'll just avoid using names so nobody notices.",
          "I should write every name down right after meeting people.",
          "I was never bad at names; I was skipping the loading step. Hooks are a technique, not a talent.",
        ],
        3,
        "THOUGHT CHALLENGED",
        "“Always have been” is a label, not a fact. Change the method and the result changes with it."
      ),
      c(
        "Your move today.",
        "Learn one new name with all three hooks: say it back, use it once, pin it to a detail. One name, fully loaded, beats ten heard and lost.",
        "One name, fully loaded"
      ),
    ],
    challenge: {
      text: "Learn one new name today with all three hooks: back, use, pin.",
      sub: "“Thanks, Maya” on the way out counts double.",
    },
  },
  {
    index: 4,
    title: "Use the name, lightly",
    steps: [
      c(
        "Names are seasoning.",
        "One name every few minutes warms the room; a name in every sentence reads like a sales script. Use it at hello, at a key moment, and at goodbye.",
        "at hello, at a key moment, and at goodbye",
        "“Season, don't marinate.”"
      ),
      q(
        "“Great point, Alex. You know, Alex, that's exactly why, Alex...”",
        "What's happening here?",
        [
          "Champion-level charisma. More names, more warmth.",
          "Nothing wrong, as long as the name is pronounced right.",
          "Name overdose. It starts to feel like a pitch.",
        ],
        2,
        "OVERDOSE SPOTTED",
        "Past a point, names stop feeling warm and start feeling engineered. Two or three per conversation is plenty."
      ),
      c(
        "Goodbye is the power slot.",
        "The name at goodbye lands hardest. “Good seeing you, Maya” proves the whole exchange registered and stayed with you.",
        "The name at goodbye lands hardest"
      ),
      r(
        "What if I say their name wrong and offend them?",
        "Talk back to that thought:",
        [
          "Exactly. Safer to never use names at all.",
          "A wrong attempt plus “did I get that right?” reads as care. Never trying reads as distance.",
          "I'll only use names I'm 100% sure of, which is basically none.",
        ],
        1,
        "THOUGHT CHALLENGED",
        "That's catastrophizing a correctable moment. People correct their name happily. It means you tried."
      ),
      c(
        "Your move today.",
        "Use someone's name exactly twice: once mid-conversation, once at goodbye. Feel the difference in how the goodbye lands.",
        "once mid-conversation, once at goodbye"
      ),
    ],
    challenge: {
      text: "Use someone's name twice today: mid-chat and at goodbye.",
      sub: "“Good seeing you, Maya” is the power slot.",
    },
  },
  {
    index: 5,
    title: "Not every hello is a conversation",
    steps: [
      c(
        "Hellos have exits.",
        "A greeting is complete by itself. “Hey, good to see you” plus moving on is polite, not cold. Forcing small talk at every hello burns both of you out.",
        "A greeting is complete by itself",
        "“You're allowed to keep walking.”"
      ),
      q(
        "You spot an acquaintance at the store, both of you mid-errand.",
        "The right size?",
        [
          "Warm wave plus “good to see you!” and carry on.",
          "Corner them for a ten-minute catch-up by the milk.",
          "Pretend you didn't see them. Saves everyone the hassle.",
          "Stop and apologize for being too busy to chat properly.",
        ],
        0,
        "RIGHT SIZE",
        "Both of you leave warmer, neither trapped. Hiding is a zero, and the apology turns a nice moment into a weird one. A complete hello needs no excuse."
      ),
      c(
        "The soft close.",
        "If a hello starts becoming a chat you can't hold, close it warm and forward: “I've got to run, let's catch up properly soon.” Name the limit, add a comeback.",
        "close it warm and forward"
      ),
      r(
        "If I cut this short, they'll think I don't like them.",
        "Talk back to that thought:",
        [
          "True. I owe everyone unlimited time.",
          "I'll avoid people when I'm busy so I never have to cut anything short.",
          "A warm exit with a reason reads as a full life, not rejection. Trapped-and-resentful me is worse company anyway.",
          "I'll stay in every chat but check my watch a lot so they get the hint.",
        ],
        2,
        "THOUGHT CHALLENGED",
        "Mind-reading again. People remember the warmth of the close, not the length of the chat. The watch trick is the actually cold option."
      ),
      c(
        "Your move today.",
        "Give one complete hello that stays a hello: warm in, warm out, keep walking. Notice that nothing bad happens.",
        "warm in, warm out, keep walking"
      ),
    ],
    challenge: {
      text: "Give one complete hello today that stays a hello.",
      sub: "Warm in, warm out, and keep walking.",
    },
  },
  {
    index: 6,
    title: "Checkpoint: three first contacts",
    isCheckpoint: true,
    steps: [
      c(
        "Stack the unit.",
        "Go first, size it right, catch the name, use it lightly, exit warm. One first contact uses all five moves, and three of them make a checkpoint.",
        "One first contact uses all five moves",
        "“Tiny ones count. Go collect three.”"
      ),
      q(
        "A new person joins your table and sits down next to you.",
        "Run the opening play:",
        [
          "Wait for someone else to handle it.",
          "Give them a polite smile and go back to your phone.",
          "“Hey, I'm Alex. I don't think we've met?”",
          "Ask the group loudly, “who's this then?”",
        ],
        2,
        "PLAY RAN",
        "Went first, name offered, door open. The smile-and-phone combo looks friendly but hands the moment away, and “who's this” makes them a spectacle."
      ),
      c(
        "Recovery is part of the skill.",
        "Blank on a name ten seconds after hearing it? Ask again immediately: “sorry, I lost your name mid-handshake.” Asking within a minute is charming; guessing for a month isn't.",
        "asking within a minute is charming"
      ),
      r(
        "Three conversations with strangers? That's way too much for me.",
        "Talk back to that thought:",
        [
          "A hello to the barista is contact #1. It's three tiny moments, not three speeches.",
          "Agreed. Skip today, start Monday.",
          "I'll do all three with the same person to get it over with.",
        ],
        0,
        "THOUGHT CHALLENGED",
        "All-or-nothing thinking makes tiny tasks look huge. Break it down: each contact is about ten seconds long."
      ),
      c(
        "Your move today.",
        "Three first contacts: greet first, catch the name if there is one, exit warm. That's the checkpoint, and the rare quote.",
        "greet first, catch the name, exit warm"
      ),
    ],
    challenge: {
      text: "Make three first contacts today: greet first, catch the name, exit warm.",
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
        "The working rule from communication research: hold eye contact about 50% of the time while you speak, and about 70% while you listen. Enough to connect, not enough to interrogate.",
        "50% while you speak, 70% while you listen",
        "“Look at them more when they talk than when you do.”"
      ),
      q(
        "They're telling you something that clearly matters to them.",
        "Where are your eyes?",
        [
          "Locked on theirs, unblinking, until they finish. Full commitment.",
          "Mostly on them. Listening earns more eye contact than talking.",
          "Anywhere else. Sustained eye contact is a lot.",
          "On their mouth, so they can tell you're processing the words.",
        ],
        1,
        "70 ON",
        "Eyes-on while they speak says “this matters” without a word. The unblinking stare overshoots into interrogation, and that's the trap: more isn't better, tuned is better."
      ),
      c(
        "Breaks are normal.",
        "Glancing away to think is human. Break sideways, the thinking direction, rather than down at your phone or past their shoulder, and come back when you land the thought.",
        "Break sideways, and come back"
      ),
      r(
        "Eye contact feels so intense. They'll think I'm weird for looking.",
        "Talk back to that thought:",
        [
          "Correct. Floors were made for looking at.",
          "I'll look at the bridge of their nose forever. Technically not eye contact.",
          "Discomfort with eye contact is mine, not theirs. Nobody has ever described a listener as “too attentive.”",
        ],
        2,
        "THOUGHT CHALLENGED",
        "That's emotional reasoning: “it feels intense, so it must look intense.” At 70% with natural breaks, it just looks like listening."
      ),
      c(
        "Your move today.",
        "One conversation with eyes up around 70% while they talk. Watch what it changes. People talk longer and warmer to eyes that stay.",
        "eyes up around 70% while they talk"
      ),
    ],
    challenge: {
      text: "Hold ~70% eye contact while someone talks to you today.",
      sub: "Break sideways to think, then come back.",
    },
  },
  {
    index: 2,
    title: "Face the person",
    steps: [
      c(
        "Bodies talk first.",
        "Your shoulders and feet announce interest before your mouth does. Squaring up to someone, even a quarter turn, says “you have me” louder than words.",
        "shoulders and feet announce interest",
        "“Point your belly button at the person.”"
      ),
      q(
        "A colleague starts talking while you're angled at your screen.",
        "The listening body?",
        [
          "Turn the chair, face them, hands off the keys.",
          "Keep typing and throw words over your shoulder.",
          "Turn your head only. The rest of you is mid-task.",
          "Say “one sec”, finish the paragraph, then turn.",
        ],
        0,
        "SQUARED UP",
        "The full turn costs three seconds and changes the conversation's temperature. Head-only says “half of me is listening.” And “one sec” is honest, but it spends goodwill you didn't need to spend."
      ),
      c(
        "Open beats closed.",
        "Crossed arms, hunched shoulders, a bag clutched like a shield: all read as “done talking.” Uncross, drop the shoulders, open the stance.",
        "Uncross, drop the shoulders, open the stance"
      ),
      r(
        "Crossed arms are just comfortable. Changing my posture is fake.",
        "Talk back to that thought:",
        [
          "Yes. Authenticity means never adjusting anything.",
          "Posture is communication, and I edit my words for clarity all the time. Opening up isn't fake, it's legible.",
          "Fine, I'll hold my arms rigidly at my sides like a soldier.",
        ],
        1,
        "THOUGHT CHALLENGED",
        "Comfort and signal are separate things. You can feel relaxed and still broadcast “closed.” Fixing the broadcast isn't dishonest."
      ),
      c(
        "Your move today.",
        "Once today, give someone the full turn: feet, shoulders, eyes. Three seconds of body language that outperforms a paragraph of “mm-hm.”",
        "the full turn: feet, shoulders, eyes"
      ),
    ],
    challenge: {
      text: "Square up fully to one person today: feet, shoulders, eyes.",
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
        [
          "Rapid-fire nodding. You've been going since sentence one.",
          "Stay perfectly still so you don't interrupt the moment.",
          "One slow nod, eyebrows up: “wow.”",
          "Jump in with a matching story of your own.",
        ],
        2,
        "PUNCTUATED",
        "A reaction that arrives exactly at their key moment proves you followed the whole road there. Stillness reads as absent, and the matching story steals the spotlight mid-landing."
      ),
      c(
        "Mix the signals.",
        "Nod plus a small sound (“mm”, “right”) plus a real expression change: together they paint the full listening picture. Any one alone, repeated, goes robotic.",
        "the full listening picture"
      ),
      r(
        "If I don't react constantly, they'll think I'm not listening.",
        "Talk back to that thought:",
        [
          "True. More nodding is always more listening.",
          "I'll set a mental timer: nod every five seconds, no matter what.",
          "Constant reacting is noise. Well-timed reactions are proof. Quality of attention beats quantity of motion.",
        ],
        2,
        "THOUGHT CHALLENGED",
        "That's over-compensation: performing listening instead of doing it. Timed beats constant, every time."
      ),
      c(
        "Your move today.",
        "One conversation where you nod only at their key beats, and let one “mm” or eyebrow-raise do the rest.",
        "nod only at their key beats"
      ),
    ],
    challenge: {
      text: "In one conversation today, nod only at the key beats.",
      sub: "Add one “mm” or “right”, timed, not constant.",
    },
  },
  {
    index: 4,
    title: "Phone down",
    steps: [
      c(
        "The phone is a wall.",
        "A phone face-up on the table taxes the conversation before it starts. Researchers call it phubbing, and people feel it even in a half-second glance.",
        "people feel it even in a half-second glance",
        "“There is no sneaky glance. They see all of them.”"
      ),
      q(
        "Your phone buzzes mid-story.",
        "The present move?",
        [
          "Quick peek while nodding. That's multitasking.",
          "Flip it face-down. Solved.",
          "Leave it. The buzz will still be there; the moment won't.",
          "Say “sorry, one sec” and answer it. Honesty beats pretending.",
        ],
        2,
        "WALL DOWN",
        "Every glance resets their sense of mattering to zero. Face-down on the table still says “I'm on call.” Leaving it alone mid-buzz is a visible gift."
      ),
      c(
        "Signal it.",
        "Phone away, in a pocket or bag out of reach, is something people consciously notice. If you truly must check, say it out loud: “sorry, expecting one thing.”",
        "say it out loud"
      ),
      r(
        "I might miss something important if I put it away.",
        "Talk back to that thought:",
        [
          "In one phone-free hour, the realistic miss is a meme. Real emergencies call twice.",
          "Right. Every notification is an emergency.",
          "I'll keep it in hand but only look during their boring parts.",
        ],
        0,
        "THOUGHT CHALLENGED",
        "That's the urgency illusion. Check the actual record: when did a 30-minute delay last cost you anything?"
      ),
      c(
        "Your move today.",
        "One fully phone-free conversation. Away, not face-down. Feel how different your own attention behaves without the wall.",
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
        "Whatever your face does at rest is what strangers read as “you.” Most resting faces read more tired or annoyed than their owner actually feels, especially after screens.",
        "read more tired or annoyed than their owner actually feels",
        "“Nobody looks as neutral as they feel.”"
      ),
      q(
        "A new teammate admits you seemed “hard to approach” at first.",
        "Likely culprit?",
        [
          "Your personality. Panic accordingly.",
          "Resting face. Screen-focus flattens everyone's default.",
          "Their oversensitivity. Not your problem.",
          "Your clothes. Time for a wardrobe rethink.",
        ],
        1,
        "CULPRIT FOUND",
        "It's the face, not the person. Which is great news: faces take feedback. Blaming them (or your shirt) skips the one variable you can adjust in two seconds."
      ),
      c(
        "Soften on entry.",
        "No permanent grin required. Just a two-second reset when someone approaches: eyebrows up a touch, jaw loose, small warm-up smile. Then talk.",
        "a two-second reset when someone approaches"
      ),
      r(
        "So my face is the problem? Great. I'm just unapproachable.",
        "Talk back to that thought:",
        [
          "Yes. Some people are simply built unapproachable.",
          "I'll hold a big smile all day so nobody can call me cold.",
          "I'll avoid new people until I've fixed my face in the mirror.",
          "A default is a habit, not an identity. Two seconds of reset changes what people meet.",
        ],
        3,
        "THOUGHT CHALLENGED",
        "That's labeling: turning one changeable signal into a permanent trait. The all-day grin overshoots into strained. The signal takes two seconds to change."
      ),
      c(
        "Your move today.",
        "Catch your resting face once (mirror, camera, window), then practice the two-second reset when someone approaches you.",
        "practice the two-second reset"
      ),
    ],
    challenge: {
      text: "Do the two-second face reset when someone approaches you today.",
      sub: "Eyebrows up a touch, jaw loose, small smile. Then talk.",
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
        "The present-body checklist starts with...",
        [
          "The perfect piece of advice.",
          "A hand on their shoulder, immediately.",
          "Face them, phone away, eyes on, before any words at all.",
          "“That's rough.” Words first, then settle in.",
        ],
        2,
        "BODY FIRST",
        "Presence lands before language. Get the body right and the words matter twice as much. Advice and touch might come later; neither is the opening move."
      ),
      c(
        "It's the cheapest superpower.",
        "Nothing in this unit needs wit, courage, or the right words. Deliberate attention is the rarest thing most people receive all day, and it costs you nothing.",
        "Deliberate attention is the rarest thing"
      ),
      r(
        "Mid-conversation I realize: arms crossed, phone in hand, eyes drifting. Ruined it.",
        "Talk back to that thought:",
        [
          "Noticing IS the skill working. Quietly fix all three and re-enter. No announcement needed.",
          "Yes. Abort the conversation in shame.",
          "I'll apologize out loud for my terrible body language.",
        ],
        0,
        "THOUGHT CHALLENGED",
        "All-or-nothing again. Presence isn't a streak you break; it's a dial you can turn up mid-sentence. The apology just makes it about you."
      ),
      c(
        "Your move today.",
        "One conversation with the full listening body, start to finish. That's the checkpoint, and the rare quote.",
        "the full listening body, start to finish"
      ),
    ],
    challenge: {
      text: "Hold one conversation with the full listening body, start to finish.",
      sub: "Beat the checkpoint to unlock the rare quote.",
    },
  },
];

/* ================= UNIT 3 · Conversation Mechanics 101 ================= */

const unit3Lessons: SeedLesson[] = [
  {
    index: 1,
    title: "Trade turns",
    steps: [
      c(
        "Conversation is tennis.",
        "A good conversation is a rally, not a monologue or a wall. You hit, they hit, roughly even. Talk too long and you're serving into an empty court; go silent and they're playing alone.",
        "A rally, not a monologue or a wall",
        "“Aim for a rough 50/50 split.”"
      ),
      q(
        "You've been telling a story for two solid minutes and their eyes just flicked to the door.",
        "What's the move?",
        [
          "Talk faster so you reach the good part before they check out.",
          "Land it soon and lob it back: “anyway, what about you?”",
          "Stop mid-sentence and ask “am I boring you?”",
          "Push through. The ending is worth it.",
        ],
        1,
        "RALLY SAVED",
        "A flick to the door is the “your turn” signal. Speeding up is more serving at an empty court, and “am I boring you” makes them manage your feelings. Wrap and hand it back."
      ),
      c(
        "Watch for the handoff.",
        "People signal the end of their turn: they trail off, drop their pitch, or ask you something. Those are open doors. Step through instead of waiting for silence to force you.",
        "trail off, drop their pitch, or ask you something"
      ),
      r(
        "If I stop talking, there'll be an awkward silence and it'll be my fault.",
        "Talk back to that thought:",
        [
          "True. I have to keep the words coming.",
          "I'll prepare three backup topics before every conversation.",
          "Silence is a shared pause, not my personal failure. It's their turn to fill it as much as mine.",
          "I'll just ask questions forever so there's never a gap.",
        ],
        2,
        "THOUGHT CHALLENGED",
        "That's over-responsibility: carrying the whole conversation alone. A rally needs two rackets. The quiet is an invitation, not a verdict."
      ),
      c(
        "Your move today.",
        "In one conversation, catch yourself at the handoff (a trail-off, a question, or the two-minute mark) and pass the ball back on purpose.",
        "pass the ball back on purpose"
      ),
    ],
    challenge: {
      text: "Trade turns evenly in one conversation today. Pass the ball back at the handoff.",
      sub: "Roughly 50/50. When you hit two minutes, lob it back.",
    },
  },
  {
    index: 2,
    title: "Answer, plus one",
    steps: [
      c(
        "One-word answers slam the door.",
        "“Good.” “Fine.” “Not much.” A bare answer leaves the other person with nothing to grab. Answer the question, then add one detail: a hook they can pull on.",
        "add one detail: a hook they can pull on",
        "“Answer +1. Never just the answer.”"
      ),
      q(
        "“How was your weekend?”",
        "Best reply?",
        [
          "“Good, thanks.” Polite and done.",
          "“Good! How was yours?” Bounce it straight back.",
          "A full ten-minute recap, start to finish.",
          "“Good. I finally tried that hiking trail everyone talks about.”",
        ],
        3,
        "HOOK ADDED",
        "The trail is a handle they can grab. The instant bounce-back looks generous but gives them nothing to work with, and the recap is +10 when the move is +1."
      ),
      c(
        "You're doing them a favor.",
        "Adding a detail isn't oversharing. It's generosity: it hands the other person an easy way in, so they don't have to dig for the next thing to say.",
        "it hands the other person an easy way in"
      ),
      r(
        "If I add extra stuff, I'm rambling and they'll think I love the sound of my own voice.",
        "Talk back to that thought:",
        [
          "One detail isn't a monologue. I'm not hogging the floor; I'm giving them a door.",
          "Right. Keep it short so I don't annoy anyone.",
          "I'll add details only if they explicitly ask for them.",
        ],
        0,
        "THOUGHT CHALLENGED",
        "That's mislabeling helpfulness as self-indulgence. One sentence of color is a gift, not a speech."
      ),
      c(
        "Your move today.",
        "Answer one “how are you?” with the truth plus one small detail. Watch how much easier the other person finds the next line.",
        "the truth plus one small detail"
      ),
    ],
    challenge: {
      text: "Answer +1 today: reply to a small question with one extra detail.",
      sub: "“Good. [one thing].” Give them a hook to grab.",
    },
  },
  {
    index: 3,
    title: "Send one back",
    steps: [
      c(
        "Every answer deserves a return.",
        "When someone answers your question, the warm move is to send one back, about them, not a fresh topic about you. It keeps the ball in play and says “I'm actually interested.”",
        "send one back, about them",
        "“Return the serve.”"
      ),
      q(
        "“I just got back from visiting my sister in Lisbon.”",
        "Which reply keeps it alive?",
        [
          "“Nice. I've never been.” Then silence.",
          "“Lisbon! I went there in 2019. Amazing food. So anyway...”",
          "“Lisbon. How often do you get to see her?”",
          "“Cool. What do you do for work?”",
        ],
        2,
        "SERVE RETURNED",
        "She offered two threads: Lisbon and her sister. The follow-up pulls one. The 2019 story quietly makes it about you, and the job question abandons her thread entirely."
      ),
      c(
        "One good question beats three facts.",
        "Harvard researchers found people who ask follow-up questions are rated more likeable, because a question about their answer proves you were listening, not just waiting to talk.",
        "a question about their answer proves you were listening"
      ),
      r(
        "If I ask questions, I'll run out and it'll turn into an awkward interview.",
        "Talk back to that thought:",
        [
          "True. Better not to start asking at all.",
          "I only need the next one, not a list. Their last sentence always hands me one.",
          "I'll memorize twenty stock questions tonight.",
        ],
        1,
        "THOUGHT CHALLENGED",
        "That's fortune-telling. You don't script an interview. You pull the thread in what they just said, one question at a time."
      ),
      c(
        "Your move today.",
        "After someone answers you, send exactly one question back about their answer before you add anything of your own.",
        "one question back about their answer"
      ),
    ],
    challenge: {
      text: "Return one serve today: ask a follow-up about their answer, not a fact about you.",
      sub: "Pull the thread they handed you.",
    },
  },
  {
    index: 4,
    title: "Match volume and pace",
    steps: [
      c(
        "Meet them where they are.",
        "Loud room, big energy: match it. Quiet café, someone speaking softly: come down to meet them. Talking at your own fixed volume ignores the room; matching it says “we're in this together.”",
        "matching it says “we're in this together”",
        "“Tune to the room, not to your habit.”"
      ),
      q(
        "You join a hushed, focused table where everyone's half-whispering.",
        "Your opener lands best if you...",
        [
          "Drop to their level first, then talk.",
          "Come in at full cheerful volume to lift the mood.",
          "Stay silent until someone addresses you directly.",
          "Whisper dramatically so they notice the effort.",
        ],
        0,
        "TUNED IN",
        "Blasting in over a quiet table reads as “didn't notice you.” Waiting forever reads as absent, and the theatrical whisper makes it a performance. Match the register, then speak."
      ),
      c(
        "Pace tells its own story.",
        "Racing through your words reads as nerves; a flat drone loses people. When it matters, slow down a notch and land the key line. Pace is punctuation you control.",
        "slow down a notch and land the key line"
      ),
      r(
        "If I slow down, they'll get bored and I'll lose them before I finish.",
        "Talk back to that thought:",
        [
          "Right. Speed keeps their attention.",
          "I'll slow down so much that every word gets its own dramatic pause.",
          "Rushing loses people; a steady pace holds them. Space around words makes them land harder, not softer.",
        ],
        2,
        "THOUGHT CHALLENGED",
        "That's emotional reasoning: “I feel rushed, so slow must feel dull.” In reality, calm pacing reads as confidence."
      ),
      c(
        "Your move today.",
        "Once today, notice the room's volume and pace before you speak, and tune to it. Then slow down for your one important line.",
        "tune to it. Then slow down for your one important line"
      ),
    ],
    challenge: {
      text: "Match one room's volume and pace today, then slow down for your key line.",
      sub: "Meet them where they are before you talk.",
    },
  },
  {
    index: 5,
    title: "Let them finish",
    steps: [
      c(
        "The pause isn't your cue to pounce.",
        "A small gap while someone thinks is not an opening. It's them mid-sentence in their head. Jumping in on it steals the turn you were about to be handed anyway.",
        "It's them mid-sentence in their head",
        "“Let the last word land before yours.”"
      ),
      q(
        "They pause mid-thought, clearly searching for the next word.",
        "The respectful move?",
        [
          "Jump in and finish their sentence for them. Teamwork.",
          "Suggest three possible words they might be looking for.",
          "Use the gap to start your own point. They lost the turn fair and square.",
          "Hold. Give the pause a beat and let them land it.",
        ],
        3,
        "SPACE GIVEN",
        "Finishing their sentence hijacks the turn, and the word-menu turns their thought into a quiz show. A held beat says “take your time,” and they almost always continue."
      ),
      c(
        "Hold your thought.",
        "Got a great point ready while they're still talking? Park it. Interrupting to drop it in trades their moment for yours, and the point keeps just fine for three more seconds.",
        "Park it"
      ),
      r(
        "If I don't say it right now, I'll forget it and lose my chance.",
        "Talk back to that thought:",
        [
          "True. Grab the gap or lose the point forever.",
          "A real point survives a few seconds' wait. If it vanishes, it wasn't the one that mattered.",
          "I'll keep repeating my point in my head and tune them out until my turn.",
        ],
        1,
        "THOUGHT CHALLENGED",
        "That's urgency thinking: treating every impulse as now-or-never. And silently rehearsing while they talk means you've stopped listening anyway."
      ),
      c(
        "Your move today.",
        "In one conversation, let every pause breathe and hold any point until they've fully finished. Notice they hand you the turn on their own.",
        "let every pause breathe"
      ),
    ],
    challenge: {
      text: "Let one person fully finish today. No jumping into their pauses.",
      sub: "Hold your point three seconds. They'll hand you the turn.",
    },
  },
  {
    index: 6,
    title: "Checkpoint: one clean rally",
    isCheckpoint: true,
    steps: [
      c(
        "Put the mechanics together.",
        "Trade turns, answer +1, send one back, match the room, let them finish. One real conversation runs all five, and suddenly it just flows, with no one working too hard.",
        "One real conversation runs all five",
        "“One clean rally. Go play it.”"
      ),
      q(
        "A neighbour you barely know says, “Long day. Just glad it's over.”",
        "Run the mechanics:",
        [
          "“Rough one? What happened?” Returned, matched, and calm.",
          "“Same.” And let it drop.",
          "“You think YOUR day was long. Listen to mine.”",
          "“Ah well, tomorrow's a new day!” Keep it positive and keep walking.",
        ],
        0,
        "RALLY RAN",
        "You matched their low-key tone, sent a question back, and left room for them to talk. “Same” is a wall, the one-up steals the turn, and the sunshine exit dodges the opening they gave you."
      ),
      c(
        "Repair beats perfection.",
        "Talk over someone by accident? “Sorry, go ahead” fixes it instantly. One clean recovery matters more than never slipping; nobody's tracking a flawless transcript.",
        "“Sorry, go ahead” fixes it instantly"
      ),
      r(
        "I always either talk too much or freeze up. I'm just bad at conversations.",
        "Talk back to that thought:",
        [
          "Agreed. Some people just can't do this.",
          "I'll write a script before every conversation from now on.",
          "“Always” and “bad at it” are labels, not facts. These are five habits I can practise, not a personality I'm stuck with.",
        ],
        2,
        "THOUGHT CHALLENGED",
        "That's labeling plus all-or-nothing. Swap the verdict for the skill: trade, +1, send back, match, let it land."
      ),
      c(
        "Your move today.",
        "One conversation using all five mechanics, start to finish. That's the checkpoint, and the rare quote.",
        "all five mechanics, start to finish"
      ),
    ],
    challenge: {
      text: "Hold one conversation today using all five mechanics: trade, +1, send back, match, let finish.",
      sub: "Beat the checkpoint to unlock the rare quote.",
    },
  },
];

/* ================= UNIT 4 · Politeness Protocol ================= */

const unit4Lessons: SeedLesson[] = [
  {
    index: 1,
    title: "The sorry diet",
    steps: [
      c(
        "Over-sorry shrinks you.",
        "“Sorry to bother you,” “sorry, quick question,” “sorry, just me again.” Apologising for existing trains people to see you as an interruption. Save “sorry” for when you've actually done harm.",
        "Save “sorry” for when you've actually done harm",
        "“Swap most sorries for thanks.”"
      ),
      q(
        "You arrive two minutes late to meet a friend who just got there too.",
        "Best opener?",
        [
          "“I'm so sorry, I'm the worst, sorry...”",
          "Say nothing about it. Two minutes doesn't exist.",
          "“Thanks for waiting!” Warm, no grovel.",
          "A detailed explanation of the traffic, so they know it wasn't your fault.",
        ],
        2,
        "REFRAMED",
        "“Thanks for waiting” gives them credit instead of making them manage your guilt. Ignoring it can read as entitled, and the traffic report makes two minutes feel like an incident."
      ),
      c(
        "Thanks, not sorry.",
        "Most “sorries” are thank-yous in disguise. “Sorry I'm late” becomes “thanks for your patience.” “Sorry for rambling” becomes “thanks for hearing me out.” Gratitude lifts the room; apology lowers you.",
        "Gratitude lifts the room; apology lowers you"
      ),
      r(
        "If I stop apologising so much, I'll come across as rude or arrogant.",
        "Talk back to that thought:",
        [
          "There's a wide lane between doormat and arrogant. Dropping reflex-sorries just lands me in normal.",
          "True. Constant sorries keep me safe and likeable.",
          "Fine, I'll never apologise for anything again, ever.",
        ],
        0,
        "THOUGHT CHALLENGED",
        "That's black-and-white thinking, and so is the never-apologise swing. Real apologies stay; the reflex ones go."
      ),
      c(
        "Your move today.",
        "Catch one reflex “sorry” that isn't about real harm, and swap it for a “thanks.” Feel how differently the same moment lands.",
        "swap it for a “thanks”"
      ),
    ],
    challenge: {
      text: "Swap one reflex “sorry” for a “thank you” today.",
      sub: "“Sorry I'm late” becomes “thanks for waiting.”",
    },
  },
  {
    index: 2,
    title: "Thank the specific thing",
    steps: [
      c(
        "Generic thanks evaporates.",
        "“Thanks!” is fine, but it's wallpaper. It slides off. Name what they did and it lands: “thanks for staying late to fix that” tells them you actually noticed.",
        "Name what they did and it lands",
        "“Thank the effort, not just the outcome.”"
      ),
      q(
        "A coworker reworked a slide deck for you overnight.",
        "Which thanks lands?",
        [
          "“Thanks, appreciate it!”",
          "“Thanks for redoing those slides overnight. That saved me this morning.”",
          "“You're a legend!! 🙌” with three emojis for emphasis.",
          "Buy them a coffee without saying anything. Actions over words.",
        ],
        1,
        "SPECIFIC WINS",
        "Naming the late night and the payoff proves you saw the effort. The hype and the silent coffee are nice, but neither tells them WHAT registered, and that's the part people remember."
      ),
      c(
        "Praise the effort.",
        "Thank the choice they made, not just the talent they have. “Thanks for being so patient with me” beats “you're so smart.” Effort is something they did on purpose, for you.",
        "Thank the choice they made"
      ),
      r(
        "If I make a big deal of thanking them, it'll sound fake or over-the-top.",
        "Talk back to that thought:",
        [
          "Right. Keep it to a quick “thanks” to stay cool.",
          "I'll thank them three separate times so it definitely lands.",
          "I'll skip thanking people I know well. They already know.",
          "Specific isn't fake. It's the opposite: the detail is the proof that the thanks is real.",
        ],
        3,
        "THOUGHT CHALLENGED",
        "That's mind-reading a bad motive onto a kind act. People rarely feel over-thanked; they feel seen. (And the people closest to you get under-thanked the most.)"
      ),
      c(
        "Your move today.",
        "Thank one person for a specific thing they did. Name the action and its effect on you.",
        "Name the action and its effect on you"
      ),
    ],
    challenge: {
      text: "Give one specific thank-you today: name what they did and why it mattered.",
      sub: "“Thanks for [exact thing], it [what it did for you].”",
    },
  },
  {
    index: 3,
    title: "Is this a good time?",
    steps: [
      c(
        "Check the runway first.",
        "Launching straight into your thing assumes the other person is free to catch it. Six words, “is now a good time?”, hand them control and make them far more receptive.",
        "hand them control",
        "“Ask for the runway before you land.”"
      ),
      q(
        "You catch a busy-looking colleague at their desk mid-focus.",
        "How do you open?",
        [
          "Dive straight into your three questions. Efficiency.",
          "Hover silently next to their desk until they notice you.",
          "“Got a couple minutes, or should I catch you later?”",
          "Email them instead. Never interrupt anyone, ever.",
        ],
        2,
        "RUNWAY CHECKED",
        "Offering “or later?” makes the yes real. Hovering is an interruption that pretends it isn't one, and always-email means simple things take days. Ask, with a real out."
      ),
      c(
        "A real out makes a real yes.",
        "Only offer “later” if you mean it. A genuine escape route lowers their guard, and the “sure, go ahead” you get back is wholehearted, not cornered.",
        "A genuine escape route lowers their guard"
      ),
      r(
        "If I give them an out, they'll say no and I'll never get my chance.",
        "Talk back to that thought:",
        [
          "True. Better to catch them before they can dodge.",
          "A “later” isn't a “no.” It's a better time. Cornered attention is worthless anyway.",
          "I'll ask, but stand there so it's awkward to say later.",
        ],
        1,
        "THOUGHT CHALLENGED",
        "That's scarcity thinking. Respecting their timing builds the trust that gets you a real yes next time. (And option three is just cornering with extra steps.)"
      ),
      c(
        "Your move today.",
        "Before one non-urgent ask, check the runway: “is now good, or later?” And mean the later.",
        "“is now good, or later?”"
      ),
    ],
    challenge: {
      text: "Ask “is this a good time?” before one non-urgent thing today.",
      sub: "Offer a real “later”, and mean it.",
    },
  },
  {
    index: 4,
    title: "Interrupt like a pro",
    steps: [
      c(
        "Sometimes you have to break in.",
        "Meetings and group chats don't leave neat gaps. Waiting forever for silence means never speaking. The skill isn't never interrupting; it's interrupting with a flag.",
        "interrupting with a flag",
        "“Signal before you step in.”"
      ),
      q(
        "The group's moved on, but you've got something that matters to add.",
        "Cleanest way in?",
        [
          "“Can I jump in quickly?” Then make it quick.",
          "Just start talking louder until they stop.",
          "Raise your hand and wait to be called on, like school.",
          "Let it go. If it mattered, someone else will say it.",
        ],
        0,
        "CLEAN ENTRY",
        "A short flag asks permission and warns them you're coming. Talking over the top is steamrolling, the raised hand outsources your turn, and “someone else will say it” is how good points die."
      ),
      c(
        "Name it and keep it short.",
        "Own the interruption (“sorry to cut in,” “before we move on”), then be brief and hand the floor back. A flagged, short break-in reads as engaged, not rude.",
        "flagged, short"
      ),
      r(
        "Interrupting is always rude. I should just stay quiet and not risk it.",
        "Talk back to that thought:",
        [
          "Right. Staying silent is the polite, safe choice.",
          "I'll interrupt freely. Everyone does it, why shouldn't I?",
          "A polite, flagged break-in is normal and expected. Never speaking isn't polite; it's invisible.",
          "I'll save all my points for a long message afterwards.",
        ],
        2,
        "THOUGHT CHALLENGED",
        "That's an all-or-nothing rule, and the free-for-all is its mirror image. There's a courteous way to enter; disappearing isn't more respectful, just quieter."
      ),
      c(
        "Your move today.",
        "Once today, break in on purpose with a flag: “can I add one thing?” Say it, and hand it straight back.",
        "break in on purpose with a flag"
      ),
    ],
    challenge: {
      text: "Make one flagged interruption today: “can I jump in?” Then keep it short.",
      sub: "Signal, say it, hand the floor back.",
    },
  },
  {
    index: 5,
    title: "Ask without shrinking",
    steps: [
      c(
        "A request isn't an imposition.",
        "“If it's not too much trouble, maybe, if you have a second, sorry...” Piling on softeners makes a normal ask sound like a confession. A clear, warm request respects you both.",
        "A clear, warm request respects you both",
        "“Please, not please-please-please.”"
      ),
      q(
        "You need a colleague to send a file you're waiting on.",
        "Best ask?",
        [
          "“So sorry, if you maybe get a chance, no rush at all, sorry...”",
          "“Send me that file.” Short and efficient.",
          "“Could you send that file when you get a sec? Thanks!”",
          "Wait another day. They'll probably remember on their own.",
        ],
        2,
        "CLEAN ASK",
        "One softener plus a clear request is plenty. The sorry-pile makes a tiny favour sound huge, the bare command lands cold, and waiting silently just moves the problem to tomorrow."
      ),
      c(
        "One softener, not seven.",
        "Politeness needs one cushion: a “could you,” a “thanks,” a smile. Beyond that, softeners stop being polite and start sounding anxious. Say the ask, then stop.",
        "Say the ask, then stop"
      ),
      r(
        "If I ask directly, I'm being demanding and they'll resent me.",
        "Talk back to that thought:",
        [
          "A clear ask with a please is easy to say yes to. Endless hedging is harder to follow, not kinder.",
          "True. Pile on the softeners so nobody's annoyed.",
          "I'll do everything myself. Asking is always a burden.",
        ],
        0,
        "THOUGHT CHALLENGED",
        "That's mind-reading resentment into a normal request. Clarity is a courtesy: it makes helping you effortless."
      ),
      c(
        "Your move today.",
        "Make one request with a single softener and a clear ask, then let the sentence end without piling on.",
        "a single softener and a clear ask"
      ),
    ],
    challenge: {
      text: "Make one clean request today: one “please/thanks,” then stop.",
      sub: "No stacked softeners. Say it and let it land.",
    },
  },
  {
    index: 6,
    title: "Checkpoint: a whole polite exchange",
    isCheckpoint: true,
    steps: [
      c(
        "Politeness that respects everyone.",
        "Thanks over sorry, specific gratitude, “is now good?”, a flagged break-in, a clean ask. Real politeness lifts the other person without lowering you: warmth and self-respect at once.",
        "warmth and self-respect at once",
        "“One graceful exchange. Go have it.”"
      ),
      q(
        "You need a quick favour from a friend who's clearly in the middle of something.",
        "Run the protocol:",
        [
          "“Sorry, sorry, I know you're busy, but, ugh, could you maybe...”",
          "“Quick one when you've got a sec: could you...? Thanks for always helping.”",
          "Do it yourself. Interrupting a busy friend isn't worth it.",
          "“You owe me anyway. Remember last month?”",
        ],
        1,
        "PROTOCOL RAN",
        "You checked their time, asked cleanly, and thanked the pattern, not just this once. The sorry-spiral shrinks you, self-sacrifice avoids the skill, and the debt-card turns a favour into a transaction."
      ),
      c(
        "Warmth without self-erasure.",
        "The goal was never to be smaller. Every move here (thanks, timing, clean asks) treats the other person as capable and you as worth their time. That's the real protocol.",
        "treats the other person as capable and you as worth their time"
      ),
      r(
        "Being polite means putting everyone else first and never inconveniencing anyone.",
        "Talk back to that thought:",
        [
          "Right. Good manners mean I always come last.",
          "Politeness is mutual respect, not self-erasure. I can be warm and still take up my fair share of space.",
          "Manners are fake anyway. I'll just be blunt with everyone.",
        ],
        1,
        "THOUGHT CHALLENGED",
        "That confuses courtesy with self-neglect, and the blunt swing throws out warmth entirely. The kindest people are gracious and grounded, not invisible."
      ),
      c(
        "Your move today.",
        "One exchange that runs the whole protocol: grateful, well-timed, clear, unshrinking. That's the checkpoint, and the rare quote.",
        "grateful, well-timed, clear, unshrinking"
      ),
    ],
    challenge: {
      text: "Run one full polite exchange today: thanks over sorry, good timing, a clean ask.",
      sub: "Beat the checkpoint to unlock the rare quote.",
    },
  },
];

/* ================= UNIT 5 · Emotion Recognition I ================= */

const unit5Lessons: SeedLesson[] = [
  {
    index: 1,
    title: "The six faces",
    steps: [
      c(
        "Six emotions, one face.",
        "Researcher Paul Ekman found six emotions the whole world shows the same way: happy, sad, angry, afraid, surprised, disgusted. Learn the six and you can read a face on any continent.",
        "happy, sad, angry, afraid, surprised, disgusted",
        "“Six flags everyone flies.”"
      ),
      q(
        "Mid-chat, someone's brows pull together and down, lips pressing thin.",
        "Most likely reading?",
        [
          "Fear. Wide-eyed and frozen.",
          "Deep focus. They're just concentrating on your point.",
          "Irritation building. Ease off or check in.",
          "Sadness. Time for comfort mode.",
        ],
        2,
        "READ RIGHT",
        "Down-drawn brows plus pressed lips are anger's signature. Focus can look similar, but the tight mouth is the tell: concentration doesn't press lips thin. Spotting it early lets you adjust before it grows."
      ),
      c(
        "The brow and mouth do the talking.",
        "You don't need a chart. Watch two zones: the eyebrows (up = surprise or fear, down = anger, inner-corners-up = sadness) and the mouth (tight, turned, or open). Two zones, most of the signal.",
        "Watch two zones: the eyebrows and the mouth"
      ),
      r(
        "I'm just bad at reading people. I never know what anyone's feeling.",
        "Talk back to that thought:",
        [
          "True. Some people can't read faces, and that's me.",
          "Reading faces is a skill with known cues, not a sixth sense. I can learn the six like anyone else.",
          "I'll just ask everyone “what are you feeling?” constantly instead.",
        ],
        1,
        "THOUGHT CHALLENGED",
        "That's a fixed-mindset label. Emotion recognition improves with practice. You've just never been shown the cues before."
      ),
      c(
        "Your move today.",
        "Name the emotion on one real face today (brows and mouth) and guess which of the six it is. No need to act, just notice.",
        "Name the emotion on one real face"
      ),
    ],
    challenge: {
      text: "Name the emotion on one face today. Pick from Ekman's six.",
      sub: "Read the brows and the mouth. Just notice.",
    },
  },
  {
    index: 2,
    title: "Real smile vs polite smile",
    steps: [
      c(
        "The eyes give it away.",
        "A polite smile lives in the mouth. A real one, the Duchenne smile, crinkles the eyes and lifts the cheeks. When the eyes stay flat, the smile is manners, not joy.",
        "crinkles the eyes and lifts the cheeks",
        "“Check the eyes, not the teeth.”"
      ),
      q(
        "You crack a joke; they smile, but the eyes stay still and it quickly resets.",
        "What's it telling you?",
        [
          "Big hit. They loved it, push for another.",
          "They hated it and are hiding it. Abort the conversation.",
          "They didn't get it. Explain the joke.",
          "Polite smile, not a real one. Read it as “fine,” not “more.”",
        ],
        3,
        "READ RIGHT",
        "A mouth-only smile that snaps back is courtesy, nothing more and nothing less. It isn't applause, it isn't hatred, and explaining the joke only makes everyone renegotiate the moment."
      ),
      c(
        "Don't over-read one smile.",
        "A flat smile isn't rejection. People are tired, distracted, or just being polite. It's a data point, not a verdict. Read it, adjust gently, and keep things light.",
        "a data point, not a verdict"
      ),
      r(
        "If their smile wasn't genuine, they must secretly dislike me.",
        "Talk back to that thought:",
        [
          "A polite smile usually means tired or busy, not hostile. Most flat faces have nothing to do with me.",
          "Right. A polite smile means they can't stand me.",
          "I'll stop joking around anyone who doesn't laugh properly.",
          "I'll test them with three more jokes and score the results.",
        ],
        0,
        "THOUGHT CHALLENGED",
        "That's personalising: reading a neutral cue as a secret verdict about you. Flat does not mean against you."
      ),
      c(
        "Your move today.",
        "Watch the eyes on one smile today. Real one? Lean in. Polite one? Ease off, no story about being disliked.",
        "Watch the eyes on one smile"
      ),
    ],
    challenge: {
      text: "Read the eyes on one smile today: real or just polite?",
      sub: "Crinkled eyes mean real. Flat means manners, not a verdict.",
    },
  },
  {
    index: 3,
    title: "Tone over words",
    steps: [
      c(
        "How beats what.",
        "“I'm fine” can mean fine, furious, or crushed. The words barely matter. Tone, pace, and volume carry the real message. When words and tone disagree, believe the tone.",
        "When words and tone disagree, believe the tone",
        "“Listen to the music, not just the lyrics.”"
      ),
      q(
        "“No, it's fine, do whatever you want.” Flat, clipped, quiet.",
        "What's actually going on?",
        [
          "It's genuinely fine. Take the words at face value.",
          "The tone says not fine. Check in gently instead of proceeding.",
          "They're indecisive. Just pick for them and move on.",
          "They're testing you. Call out the game directly.",
        ],
        1,
        "READ RIGHT",
        "Flat and clipped over “it's fine” is a classic mismatch: the tone is the true signal, the words are cover. Steaming ahead spends their goodwill, and “you're testing me” turns a feeling into an accusation."
      ),
      c(
        "Tune to the signal.",
        "Rising, fast, loud: excited or stressed. Falling, slow, quiet: tired or down. You already hear this in close friends. The skill is noticing it on purpose, early.",
        "noticing it on purpose, early"
      ),
      r(
        "I should just take people at their word. Reading into their tone is nosy or presumptuous.",
        "Talk back to that thought:",
        [
          "True. Reading into tone is overstepping.",
          "I'll analyse every syllable everyone says from now on.",
          "Noticing tone isn't mind-reading. It's basic attention. I can notice quietly and check instead of assuming.",
        ],
        2,
        "THOUGHT CHALLENGED",
        "That's disqualifying a real skill. Hearing the mismatch isn't intrusive; ignoring it is how you miss people."
      ),
      c(
        "Your move today.",
        "Catch one moment where someone's tone doesn't match their words. Trust the tone, and respond to that.",
        "Trust the tone"
      ),
    ],
    challenge: {
      text: "Catch one word/tone mismatch today, and trust the tone.",
      sub: "“I'm fine” said flat isn't fine. Notice it.",
    },
  },
  {
    index: 4,
    title: "Read busy, tired, done",
    steps: [
      c(
        "State comes before content.",
        "Before what someone means, read how they're doing. Shoulders, energy, speed, eye contact: they broadcast busy, tired, or done long before the words admit it.",
        "read how they're doing",
        "“Check the battery before you plug in.”"
      ),
      q(
        "Someone's giving one-word replies, glancing at their screen, half-turned away.",
        "The read?",
        [
          "They're rude. Push harder to get through.",
          "They're shy. Fill the silence with more of your energy.",
          "Low bandwidth right now. Keep it short or catch them later.",
          "They need cheering up. Time for your best story.",
        ],
        2,
        "READ RIGHT",
        "Short replies, drifting eyes, a turned body: that's “not now,” not “try harder.” Every other option pours more demand into a battery that's already at 5%."
      ),
      c(
        "Match your ask to their battery.",
        "Someone running on empty can't take a big conversation, and that's about their bandwidth, not their feelings for you. Shrink the ask, or come back when the meter's higher.",
        "Shrink the ask"
      ),
      r(
        "If they seem distant, it must be because they're annoyed with me.",
        "Talk back to that thought:",
        [
          "Right. Distant means I did something wrong.",
          "I'll ask them directly, right now, if they're mad at me.",
          "I'll replay our last three conversations for clues tonight.",
          "Distant usually means tired or slammed. Their low battery is rarely a message about me.",
        ],
        3,
        "THOUGHT CHALLENGED",
        "That's personalising again, and the interrogation and the midnight replay both feed it. Most “off” energy is about their day, not your worth."
      ),
      c(
        "Your move today.",
        "Read one person's battery before you speak (busy, tired, done?) and size your ask to match.",
        "size your ask to match"
      ),
    ],
    challenge: {
      text: "Read one person's energy today (busy, tired, or done) before you dive in.",
      sub: "Size your ask to their battery, not your agenda.",
    },
  },
  {
    index: 5,
    title: "Check, don't assume",
    steps: [
      c(
        "A read is a guess, not a fact.",
        "Cues point; they don't prove. The strongest move isn't a confident diagnosis. It's a gentle check: “you seem a bit quiet today, everything okay?” Offer the read, let them confirm.",
        "Offer the read, let them confirm",
        "“Name it softly, then listen.”"
      ),
      q(
        "A friend's been unusually flat all evening.",
        "Best move?",
        [
          "“You seem a little off tonight. Everything alright?”",
          "Decide they're mad at you and go cold to match.",
          "“What's wrong with you today?” Direct and efficient.",
          "Crank up your own energy to pull them out of it.",
        ],
        0,
        "CHECKED, NOT ASSUMED",
        "A soft, tentative check gives them room to open up or wave it off. “What's wrong with you” is an accusation wearing a question's clothes, and forced sunshine just tells them their mood is a problem."
      ),
      c(
        "Tentative wins.",
        "Lead with “seems like,” “I might be off, but,” “you okay?” Tentative language makes it easy to say “actually, yeah” or “no, I'm good.” Certainty backs people into a corner.",
        "Tentative language makes it easy"
      ),
      r(
        "If I ask whether they're okay and I'm wrong, I'll look stupid and make it awkward.",
        "Talk back to that thought:",
        [
          "True. Safer to say nothing and guess privately.",
          "A gentle “you okay?” lands as care even when I'm off. Being wrong-but-kind beats being silent-but-cold.",
          "I'll wait until I'm 100% certain something is wrong before asking.",
        ],
        1,
        "THOUGHT CHALLENGED",
        "That's catastrophising a caring question. Almost nobody resents “are you alright?” They remember that you asked. (And 100% certainty never arrives.)"
      ),
      c(
        "Your move today.",
        "Turn one read into a gentle check today: offer what you noticed, tentatively, then listen to the answer.",
        "offer what you noticed, tentatively"
      ),
    ],
    challenge: {
      text: "Turn one read into a gentle check today: “you seem... everything okay?”",
      sub: "Tentative, then listen. Let them confirm.",
    },
  },
  {
    index: 6,
    title: "Checkpoint: one read, gently checked",
    isCheckpoint: true,
    steps: [
      c(
        "Put the reading together.",
        "The six faces, the real smile, tone over words, the battery read, the gentle check. Emotion recognition is noticing early, then holding it lightly enough to ask.",
        "noticing early, then holding it lightly enough to ask",
        "“One read, gently checked. Go find it.”"
      ),
      q(
        "A coworker says “yeah, all good.” Flat tone, tired eyes, no real smile.",
        "Run the read:",
        [
          "Take “all good” at face value and move on.",
          "“You're clearly NOT all good. Talk to me.”",
          "Report your concern to their manager, to be safe.",
          "“You sound wiped. Long one? No pressure to get into it.”",
        ],
        3,
        "READ RAN",
        "You caught the tone and the flat smile, read low battery, and checked it gently with an easy out. The face-value exit misses them, the confrontation corners them, and escalating skips them entirely."
      ),
      c(
        "Reading serves connection, not judgement.",
        "The point of reading people isn't to analyse them or catch them out. It's to meet them where they are. Notice, soften, check, and let them tell you the rest.",
        "meet them where they are"
      ),
      r(
        "Now I'll overthink every face and freeze, scanning everyone for hidden feelings.",
        "Talk back to that thought:",
        [
          "Right. This just gives me one more thing to panic about.",
          "This runs in the background, like hearing tone in a friend. Notice, check if it matters, move on. No scanning required.",
          "I'll keep a mental spreadsheet of everyone's moods, updated hourly.",
        ],
        1,
        "THOUGHT CHALLENGED",
        "That's catastrophising a gentle skill into a burden. Reading emotion gets quieter and more automatic with reps, not louder."
      ),
      c(
        "Your move today.",
        "Make one accurate read today and check it gently: a face, a tone, or a battery, then a soft question. That's the checkpoint, and the rare quote.",
        "one accurate read"
      ),
    ],
    challenge: {
      text: "Make one gentle, accurate read today: notice the feeling, then check it kindly.",
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
  { unitId: 3, lessonIndex: 1, text: "Conversation is a game of circles.", author: "Ralph Waldo Emerson", authorNote: "on taking turns", rare: false },
  { unitId: 3, lessonIndex: 2, text: "The great gift of conversation lies less in displaying it ourselves than in drawing it out of others.", author: "Jean de La Bruyère", authorNote: "on giving", rare: false },
  { unitId: 3, lessonIndex: 3, text: "Judge a man by his questions rather than by his answers.", author: "Voltaire", authorNote: "on questions", rare: false },
  { unitId: 3, lessonIndex: 4, text: "Speak clearly, if you speak at all; carve every word before you let it fall.", author: "Oliver Wendell Holmes Sr.", authorNote: "on pace", rare: false },
  { unitId: 3, lessonIndex: 5, text: "Most people do not listen with the intent to understand; they listen with the intent to reply.", author: "Stephen R. Covey", authorNote: "on letting them finish", rare: false },
  { unitId: 3, lessonIndex: 6, text: "When people talk, listen completely.", author: "Ernest Hemingway", authorNote: "the rare one", rare: true },
  { unitId: 4, lessonIndex: 1, text: "Apology is a lovely perfume; it can transform the clumsiest moment into a gracious gift.", author: "Margaret Lee Runbeck", authorNote: "on apology", rare: false },
  { unitId: 4, lessonIndex: 2, text: "Gratitude is the memory of the heart.", author: "Jean Baptiste Massieu", authorNote: "on thanks", rare: false },
  { unitId: 4, lessonIndex: 3, text: "It is not enough to be busy; the question is: what are we busy about?", author: "Henry David Thoreau", authorNote: "on timing", rare: false },
  { unitId: 4, lessonIndex: 4, text: "Courtesy is as much a mark of a gentleman as courage.", author: "Theodore Roosevelt", authorNote: "on courtesy", rare: false },
  { unitId: 4, lessonIndex: 5, text: "Politeness is the flower of humanity.", author: "Joseph Joubert", authorNote: "on politeness", rare: false },
  { unitId: 4, lessonIndex: 6, text: "Politeness and consideration for others is like investing pennies and getting dollars back.", author: "Thomas Sowell", authorNote: "the rare one", rare: true },
  { unitId: 5, lessonIndex: 1, text: "The face is a picture of the mind, and the eyes are its interpreter.", author: "Cicero", authorNote: "on faces", rare: false },
  { unitId: 5, lessonIndex: 2, text: "Wrinkles should merely indicate where smiles have been.", author: "Mark Twain", authorNote: "on smiles", rare: false },
  { unitId: 5, lessonIndex: 3, text: "The most important thing in communication is hearing what isn't said.", author: "Peter Drucker", authorNote: "on tone", rare: false },
  { unitId: 5, lessonIndex: 4, text: "People will forget what you said, but people will never forget how you made them feel.", author: "Maya Angelou", authorNote: "on attunement", rare: false },
  { unitId: 5, lessonIndex: 5, text: "The single biggest problem in communication is the illusion that it has taken place.", author: "George Bernard Shaw", authorNote: "on checking", rare: false },
  { unitId: 5, lessonIndex: 6, text: "When dealing with people, remember you are not dealing with creatures of logic, but with creatures of emotion.", author: "Dale Carnegie", authorNote: "the rare one", rare: true },
];

async function main() {
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
    {
      id: 3, courseId: 1, number: 3, level: "A1", levelTitle: "Survival Social",
      title: "Conversation Mechanics 101", tagline: "Trade turns and keep it flowing",
      canDo: "Can keep a two-way conversation rallying back and forth", lessons: unit3Lessons,
    },
    {
      id: 4, courseId: 1, number: 4, level: "A1", levelTitle: "Survival Social",
      title: "Politeness Protocol", tagline: "Warm without shrinking",
      canDo: "Can be gracious and clear without over-apologising", lessons: unit4Lessons,
    },
    {
      id: 5, courseId: 1, number: 5, level: "A1", levelTitle: "Survival Social",
      title: "Emotion Recognition I", tagline: "Read the face, tone, and battery",
      canDo: "Can read a basic emotion and check it kindly", lessons: unit5Lessons,
    },
  ];

  // Validate ALL content up front, before any delete, so a bad lesson can
  // never leave the content tables half-wiped. Errors name the offending lesson.
  for (const unit of units) {
    for (const lesson of unit.lessons) {
      const where = `unit ${unit.id}, lesson ${lesson.index}`;
      try {
        lessonStepsSchema.parse(lesson.steps);
        challengeSchema.parse(lesson.challenge);
      } catch (e) {
        throw new Error(`Invalid seed content in ${where}: ${(e as Error).message}`);
      }
    }
  }

  // content only, user tables untouched
  await prisma.quote.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.unit.deleteMany({});
  await prisma.course.deleteMany({});

  await prisma.course.create({
    data: { id: 1, title: "Social Skills", tagline: "From first hello to leading the room", sortOrder: 0 },
  });

  for (const { lessons, ...unit } of units) {
    await prisma.unit.create({ data: unit });
    for (const lesson of lessons) {
      await prisma.lesson.create({
        data: {
          unitId: unit.id,
          index: lesson.index,
          title: lesson.title,
          isCheckpoint: lesson.isCheckpoint ?? false,
          // validate on write, the same schemas guard reads in lib/catalog.ts
          steps: lessonStepsSchema.parse(lesson.steps),
          challenge: challengeSchema.parse(lesson.challenge),
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
