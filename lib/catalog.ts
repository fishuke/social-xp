// Async accessors for DB-managed content (units, lessons, quotes).
// JSON columns are zod-validated on read: bad content edits fail loudly here,
// with the offending lesson named, instead of breaking a screen downstream.

import { z } from "zod";
import { prisma } from "./db";
import {
  challengeSchema,
  lessonStepsSchema,
  type LessonData,
  type QuoteData,
  type UnitData,
} from "./content";

const lessonSummarySelect = {
  orderBy: { index: "asc" },
  select: { index: true, title: true, isCheckpoint: true },
} as const;

function parseContent<T>(schema: z.ZodType<T>, value: unknown, where: string): T {
  const result = schema.safeParse(value);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    throw new Error(`Invalid lesson content in ${where}: ${issues}`);
  }
  return result.data;
}

export async function getUnits(courseId = 1): Promise<UnitData[]> {
  return prisma.unit.findMany({
    where: { courseId },
    orderBy: { number: "asc" },
    include: { lessons: lessonSummarySelect },
  });
}

export async function getUnit(id: number): Promise<UnitData | null> {
  return prisma.unit.findUnique({
    where: { id },
    include: { lessons: lessonSummarySelect },
  });
}

export async function getLessonData(unitId: number, index: number): Promise<LessonData | null> {
  const lesson = await prisma.lesson.findUnique({
    where: { unitId_index: { unitId, index } },
  });
  if (!lesson) return null;
  const where = `unit ${unitId}, lesson ${index}`;
  return {
    ...lesson,
    steps: parseContent(lessonStepsSchema, lesson.steps, where),
    challenge: parseContent(challengeSchema, lesson.challenge, where),
  };
}

export async function getQuoteData(unitId: number, lessonIndex: number): Promise<QuoteData | null> {
  return prisma.quote.findUnique({ where: { unitId_lessonIndex: { unitId, lessonIndex } } });
}

export async function getUnitQuotes(unitId: number): Promise<QuoteData[]> {
  return prisma.quote.findMany({ where: { unitId }, orderBy: { lessonIndex: "asc" } });
}
