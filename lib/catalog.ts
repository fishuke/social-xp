// Async accessors for DB-managed content (units, lessons, quotes).
// JSON columns are zod-validated on read: bad content edits fail loudly here,
// with the offending lesson named, instead of breaking a screen downstream.
//
// Localization: English lives in the base rows; other locales add rows in the
// *Translation tables. Each accessor takes a locale and overlays the matching
// translation, falling back to the English base when a translation is missing.

import { z } from "zod";
import { prisma } from "./db";
import {
  challengeSchema,
  lessonStepsSchema,
  type LessonData,
  type QuoteData,
  type UnitData,
} from "./content";
import { DEFAULT_LOCALE, type Locale } from "./i18n/config";

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

const lessonSummarySelect = (locale: Locale) =>
  ({
    orderBy: { index: "asc" },
    select: {
      index: true,
      title: true,
      isCheckpoint: true,
      translations: { where: { locale }, select: { title: true } },
    },
  }) as const;

type UnitRow = {
  id: number;
  courseId: number;
  number: number;
  level: string;
  levelTitle: string;
  title: string;
  tagline: string;
  canDo: string;
  lessons: {
    index: number;
    title: string;
    isCheckpoint: boolean;
    translations: { title: string }[];
  }[];
  translations: { levelTitle: string; title: string; tagline: string; canDo: string }[];
};

function overlayUnit(unit: UnitRow): UnitData {
  const t = unit.translations[0];
  return {
    id: unit.id,
    courseId: unit.courseId,
    number: unit.number,
    level: unit.level, // CEFR code — never translated
    levelTitle: t?.levelTitle ?? unit.levelTitle,
    title: t?.title ?? unit.title,
    tagline: t?.tagline ?? unit.tagline,
    canDo: t?.canDo ?? unit.canDo,
    lessons: unit.lessons.map((l) => ({
      index: l.index,
      title: l.translations[0]?.title ?? l.title,
      isCheckpoint: l.isCheckpoint,
    })),
  };
}

export async function getUnits(locale: Locale = DEFAULT_LOCALE, courseId = 1): Promise<UnitData[]> {
  const units = await prisma.unit.findMany({
    where: { courseId },
    orderBy: { number: "asc" },
    include: {
      lessons: lessonSummarySelect(locale),
      translations: { where: { locale } },
    },
  });
  return units.map(overlayUnit);
}

export async function getUnit(id: number, locale: Locale = DEFAULT_LOCALE): Promise<UnitData | null> {
  const unit = await prisma.unit.findUnique({
    where: { id },
    include: {
      lessons: lessonSummarySelect(locale),
      translations: { where: { locale } },
    },
  });
  return unit ? overlayUnit(unit) : null;
}

export async function getLessonData(
  unitId: number,
  index: number,
  locale: Locale = DEFAULT_LOCALE,
): Promise<LessonData | null> {
  const lesson = await prisma.lesson.findUnique({
    where: { unitId_index: { unitId, index } },
    include: { translations: { where: { locale } } },
  });
  if (!lesson) return null;
  const t = lesson.translations[0];
  const where = `unit ${unitId}, lesson ${index}${t ? ` (${locale})` : ""}`;
  return {
    id: lesson.id,
    unitId: lesson.unitId,
    index: lesson.index,
    title: t?.title ?? lesson.title,
    isCheckpoint: lesson.isCheckpoint,
    steps: parseContent(lessonStepsSchema, t?.steps ?? lesson.steps, where),
    challenge: parseContent(challengeSchema, t?.challenge ?? lesson.challenge, where),
  };
}

export async function getQuoteData(
  unitId: number,
  lessonIndex: number,
  locale: Locale = DEFAULT_LOCALE,
): Promise<QuoteData | null> {
  const quote = await prisma.quote.findUnique({
    where: { unitId_lessonIndex: { unitId, lessonIndex } },
    include: { translations: { where: { locale } } },
  });
  return quote ? overlayQuote(quote) : null;
}

export async function getUnitQuotes(
  unitId: number,
  locale: Locale = DEFAULT_LOCALE,
): Promise<QuoteData[]> {
  const quotes = await prisma.quote.findMany({
    where: { unitId },
    orderBy: { lessonIndex: "asc" },
    include: { translations: { where: { locale } } },
  });
  return quotes.map(overlayQuote);
}

type QuoteRow = {
  id: string;
  unitId: number;
  lessonIndex: number;
  text: string;
  author: string;
  authorNote: string;
  rare: boolean;
  translations: { text: string; author: string; authorNote: string }[];
};

function overlayQuote(quote: QuoteRow): QuoteData {
  const t = quote.translations[0];
  return {
    id: quote.id,
    unitId: quote.unitId,
    lessonIndex: quote.lessonIndex,
    text: t?.text ?? quote.text,
    author: t?.author ?? quote.author,
    authorNote: t?.authorNote ?? quote.authorNote,
    rare: quote.rare,
  };
}
