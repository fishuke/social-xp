// Single source of truth for the method / privacy / terms content. Rendered
// by components/content-page.tsx in both chromes: marketing web layout for
// visitors, phone-frame app layout for signed-in users (app/(site)/layout.tsx).

// TODO: switch to the real support address once the production domain lands
// (docs/ROADMAP.md item 5).
export const SUPPORT_EMAIL = "support@social-xp.app";

export const LEGAL_UPDATED = "July 7, 2026";

export type ContentSection = { emoji?: string; title: string; body: string };

export const METHOD_SECTIONS: ContentSection[] = [
  {
    emoji: "🔁",
    title: "Behavioral Skills Training",
    body: "The best-validated way to teach social skills: instruction → modeling → rehearsal → feedback. It's why every lesson shows you the move, quizzes you on it, then sends you out to try it for real.",
  },
  {
    emoji: "🌍",
    title: "Real-world practice",
    body: "Decades of CBT research agree: practice between sessions is what actually changes behavior. The daily challenge isn't a bonus, it's the whole point. The lesson just loads the move.",
  },
  {
    emoji: "🧠",
    title: "Thought work, not just behavior",
    body: "Straight from CBT's cognitive side: every lesson includes a “challenge the thought” step: catch the anxious prediction (“they'll think I'm weird”), name the distortion, answer it with the balanced take. Confidence needs both the reframe and the rep.",
  },
  {
    emoji: "📶",
    title: "Graded courage",
    body: "Confidence is built like exposure therapy builds it: starting small, stepping up gradually, and collecting evidence that the scary thing was survivable. Levels A1 → A2 → B1 follow that ladder.",
  },
  {
    emoji: "🧩",
    title: "Spaced practice & retrieval",
    body: "Quizzes make you retrieve, not re-read: the single most reliable memory effect in learning science. Streaks and daily quests apply habit research: small, visible, daily beats big and rare.",
  },
  {
    emoji: "🔭",
    title: "Reviewed and re-tuned",
    body: "We're building an expert board of psychologists and social scientists to review every unit, and we re-tune lessons continuously from real learner results.",
  },
];

export const PRIVACY_SECTIONS: ContentSection[] = [
  {
    title: "What we collect",
    body: "Your progress: XP, streaks, completed lessons, quiz results, saved quotes, and how a lesson felt. If you create an account, also your email address and a securely hashed password. During onboarding we ask for your goal, pace, and timezone so daily resets happen on your calendar day. Everything works without an account; progress is then tied to an anonymous ID stored in a cookie on your device.",
  },
  {
    title: "Voice recordings",
    body: "Coach recordings are sent to Google's Gemini API for analysis and are not stored by us. We keep only the written transcript and the scores so you can see your progress. Don't say anything in a rep you wouldn't want written down.",
  },
  {
    title: "Payments",
    body: "Subscriptions are sold through Lemon Squeezy, our merchant of record. They are the legal seller and handle your payment details; we never see your card number. We store your subscription status (plan, renewal date) to unlock premium features.",
  },
  {
    title: "Notifications",
    body: "If you turn on daily reminders, we store a push subscription for your browser or device. Turn it off any time on the You page, or revoke the permission in your browser.",
  },
  {
    title: "Cookies",
    body: "We use cookies only to keep you signed in and to remember anonymous progress. No advertising cookies, no third-party trackers, no selling data. Ever.",
  },
  {
    title: "Who processes data for us",
    body: "Vercel (hosting), Neon (database), Resend (transactional email like password resets), Google Gemini (voice analysis), and Lemon Squeezy (payments). Each receives only what it needs to do its job.",
  },
  {
    title: "Your choices",
    body: `You can use Social XP without an account, opt out of reminders, and cancel your subscription any time. To access or delete your data, email ${SUPPORT_EMAIL} and we'll handle it within 30 days.`,
  },
];

export const TERMS_SECTIONS: ContentSection[] = [
  {
    title: "The service",
    body: "Social XP is a training app for social confidence: short lessons, quizzes, real-world challenges, and an AI speaking coach. You need to be at least 13 to use it (or the minimum age in your country), and under 18 you'll need a parent or guardian's OK.",
  },
  {
    title: "Not therapy",
    body: "Social XP builds confidence through practice. It is not therapy, medical care, or mental-health treatment, and it doesn't replace them. If you're struggling, please reach out to a qualified professional.",
  },
  {
    title: "Your account",
    body: "You can train anonymously; creating an account keeps your progress safe across devices. You're responsible for keeping your password to yourself. Anonymous progress lives in a cookie and can be lost if you clear it, so claim your account if your streak matters to you.",
  },
  {
    title: "Subscriptions & billing",
    body: `Social XP+ is sold through Lemon Squeezy, our merchant of record and the legal seller. Plans start with a 7-day free trial, then renew automatically (monthly or yearly) until you cancel. Cancel any time from Manage subscription on the You page; you keep access until the end of the period you paid for. Refund requests go through Lemon Squeezy or ${SUPPORT_EMAIL}.`,
  },
  {
    title: "Fair use",
    body: "Don't abuse the service: no breaking in, scraping, reselling, reverse engineering, or using the coach to process other people's voices without their consent. We can suspend accounts that do.",
  },
  {
    title: "Our content",
    body: "Lessons, quotes curation, and app design belong to Social XP. They're licensed to you for personal use, not for republishing or building competing courses.",
  },
  {
    title: "No guarantees",
    body: "We work hard to keep Social XP up and improving, but it's provided as is, without warranties. To the extent the law allows, our liability is limited to what you paid us in the last 12 months.",
  },
  {
    title: "Changes",
    body: "We may update these terms as the product evolves. If a change is significant we'll flag it in the app. Continuing to train after a change means you accept it.",
  },
];
