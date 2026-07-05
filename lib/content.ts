// Shared content types + XP economy. Actual lessons/units/quotes live in the
// database (Course/Unit/Lesson/Quote models) — seeded from prisma/seed.ts.

export const XP = {
  quizFirstTry: 10, // per quiz/reframe step answered right first try
  lessonClaim: 20,
  challenge: 30, // real-world challenge
} as const;

export type ConceptStep = {
  type: "concept";
  headline: string;
  body: string; // plain text; `keyPhrase` is bolded inside it
  keyPhrase: string;
  coachLine?: string;
};

// voice "them" = a person talking (behavior quiz).
// voice "inner" = your own automatic thought (CBT-style cognitive reframe).
export type QuizStep = {
  type: "quiz";
  voice: "them" | "inner";
  theySay: string;
  question: string;
  options: string[];
  correctIndex: number;
  feedbackTitle: string;
  feedbackBody: string;
};

export type LessonStep = ConceptStep | QuizStep;

export type Challenge = { text: string; sub: string };

export type LessonData = {
  id: number;
  unitId: number;
  index: number;
  title: string;
  isCheckpoint: boolean;
  steps: LessonStep[];
  challenge: Challenge;
};

export type LessonSummary = { index: number; title: string; isCheckpoint: boolean };

export type UnitData = {
  id: number;
  courseId: number;
  number: number;
  level: string;
  levelTitle: string;
  title: string;
  tagline: string;
  canDo: string;
  lessons: LessonSummary[];
};

export type QuoteData = {
  id: string;
  unitId: number;
  lessonIndex: number;
  text: string;
  author: string;
  authorNote: string;
  rare: boolean;
};
