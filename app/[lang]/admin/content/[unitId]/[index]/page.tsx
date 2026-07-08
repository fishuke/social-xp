import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { getLessonData, getQuoteData, getUnit } from "@/lib/catalog";
import { LessonEditor } from "./lesson-editor";

export const dynamic = "force-dynamic";

export default async function AdminLessonPage({
  params,
}: {
  params: Promise<{ unitId: string; index: string }>;
}) {
  await requireAdmin();
  const { unitId: u, index: i } = await params;
  const unitId = Number(u);
  const index = Number(i);

  const [unit, lesson, quote] = await Promise.all([
    getUnit(unitId),
    getLessonData(unitId, index),
    getQuoteData(unitId, index),
  ]);
  if (!unit || !lesson) notFound();

  return (
    <LessonEditor
      unitTitle={`Unit ${unit.number} · ${unit.title}`}
      lesson={lesson}
      quote={quote}
    />
  );
}
