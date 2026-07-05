// Async accessors for DB-managed content (units, lessons, quotes).

import { prisma } from "./db";
import type { Challenge, LessonData, LessonStep, QuoteData, UnitData } from "./content";

export async function getUnits(courseId = 1): Promise<UnitData[]> {
  const units = await prisma.unit.findMany({
    where: { courseId },
    orderBy: { number: "asc" },
    include: {
      lessons: {
        orderBy: { index: "asc" },
        select: { index: true, title: true, isCheckpoint: true },
      },
    },
  });
  return units;
}

export async function getUnit(id: number): Promise<UnitData | null> {
  return prisma.unit.findUnique({
    where: { id },
    include: {
      lessons: {
        orderBy: { index: "asc" },
        select: { index: true, title: true, isCheckpoint: true },
      },
    },
  });
}

export async function getLessonData(unitId: number, index: number): Promise<LessonData | null> {
  const lesson = await prisma.lesson.findUnique({
    where: { unitId_index: { unitId, index } },
  });
  if (!lesson) return null;
  return {
    ...lesson,
    steps: lesson.steps as LessonStep[],
    challenge: lesson.challenge as Challenge,
  };
}

export async function getQuoteData(unitId: number, lessonIndex: number): Promise<QuoteData | null> {
  return prisma.quote.findUnique({ where: { unitId_lessonIndex: { unitId, lessonIndex } } });
}

export async function getUnitQuotes(unitId: number): Promise<QuoteData[]> {
  return prisma.quote.findMany({ where: { unitId }, orderBy: { lessonIndex: "asc" } });
}
