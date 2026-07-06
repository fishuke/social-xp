// Content types + XP economy. Zod schemas are the single source of truth for
// the JSON stored in Lesson.steps / Lesson.challenge — the seed validates on
// write and the catalog validates on read, so hand-edited DB content fails
// loudly instead of breaking a screen.

import { z } from "zod";

export const XP = {
  quizFirstTry: 10, // per quiz/reframe step answered right first try
  lessonClaim: 20,
  challenge: 30, // real-world challenge
} as const;

export const conceptStepSchema = z.object({
  type: z.literal("concept"),
  headline: z.string().min(1),
  body: z.string().min(1),
  keyPhrase: z.string().min(1),
  coachLine: z.string().optional(),
});

// voice "them" = a person talking (behavior quiz).
// voice "inner" = your own automatic thought (CBT-style cognitive reframe).
export const quizStepSchema = z.object({
  type: z.literal("quiz"),
  voice: z.enum(["them", "inner"]),
  theySay: z.string().min(1),
  question: z.string().min(1),
  options: z.array(z.string().min(1)).length(2),
  correctIndex: z.number().int().min(0).max(1),
  feedbackTitle: z.string().min(1),
  feedbackBody: z.string().min(1),
});

export const lessonStepSchema = z.discriminatedUnion("type", [
  conceptStepSchema,
  quizStepSchema,
]);
export const lessonStepsSchema = z.array(lessonStepSchema).min(1);

export const challengeSchema = z.object({
  text: z.string().min(1),
  sub: z.string().min(1),
});

export type ConceptStep = z.infer<typeof conceptStepSchema>;
export type QuizStep = z.infer<typeof quizStepSchema>;
export type LessonStep = z.infer<typeof lessonStepSchema>;
export type Challenge = z.infer<typeof challengeSchema>;

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
