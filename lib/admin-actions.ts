"use server";

// Admin-only server actions. Every action re-checks the admin role itself —
// never rely on the page gate alone.

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "./db";
import { getSessionUser } from "./session";
import { challengeSchema, lessonStepsSchema } from "./content";

async function requireAdminUser() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") throw new Error("Admins only");
  return user;
}

export type AdminSaveResult = { ok: true } | { ok: false; error: string };

function asError(error: unknown): AdminSaveResult {
  if (error instanceof z.ZodError) {
    const issues = error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    return { ok: false, error: issues };
  }
  if (error instanceof SyntaxError) return { ok: false, error: `Invalid JSON — ${error.message}` };
  return { ok: false, error: error instanceof Error ? error.message : "Save failed" };
}

const lessonMetaSchema = z.object({
  title: z.string().min(1),
  isCheckpoint: z.boolean(),
});

export async function saveLesson(input: {
  unitId: number;
  index: number;
  title: string;
  isCheckpoint: boolean;
  stepsJson: string; // validated against lessonStepsSchema
  challengeJson: string; // validated against challengeSchema
}): Promise<AdminSaveResult> {
  await requireAdminUser();
  try {
    const meta = lessonMetaSchema.parse({ title: input.title, isCheckpoint: input.isCheckpoint });
    const steps = lessonStepsSchema.parse(JSON.parse(input.stepsJson));
    const challenge = challengeSchema.parse(JSON.parse(input.challengeJson));
    await prisma.lesson.update({
      where: { unitId_index: { unitId: input.unitId, index: input.index } },
      data: { ...meta, steps, challenge },
    });
    revalidatePath("/", "layout"); // lesson content is read on many screens
    return { ok: true };
  } catch (error) {
    return asError(error);
  }
}

const quoteSchema = z.object({
  text: z.string().min(1),
  author: z.string().min(1),
  authorNote: z.string().min(1),
  rare: z.boolean(),
});

export async function saveQuote(input: {
  unitId: number;
  lessonIndex: number;
  text: string;
  author: string;
  authorNote: string;
  rare: boolean;
}): Promise<AdminSaveResult> {
  await requireAdminUser();
  try {
    const data = quoteSchema.parse(input);
    await prisma.quote.update({
      where: { unitId_lessonIndex: { unitId: input.unitId, lessonIndex: input.lessonIndex } },
      data,
    });
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (error) {
    return asError(error);
  }
}

export async function togglePremium(userId: string): Promise<AdminSaveResult> {
  await requireAdminUser();
  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) return { ok: false, error: "User not found" };
  await prisma.user.update({ where: { id: userId }, data: { isPremium: !target.isPremium } });
  revalidatePath("/admin/users");
  return { ok: true };
}
