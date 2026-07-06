import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { getUnits } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function AdminContent() {
  await requireAdmin();
  const units = await getUnits();

  return (
    <div className="flex flex-col gap-6">
      <p className="font-body text-[13px] font-bold text-sec2">
        Edits go live immediately: steps and challenges are zod-validated on save, so a bad edit
        can&apos;t ship. New units still come from <code>prisma/seed.ts</code>.
      </p>
      {units.map((unit) => (
        <section key={unit.id} className="rounded-xl border border-[#E5E0D8] bg-white">
          <div className="flex items-center gap-3 border-b border-[#E5E0D8] px-4 py-3">
            <span className="rounded-md bg-cocoa px-2 py-0.5 font-display text-[12px] font-semibold text-amber">
              {unit.level}
            </span>
            <span className="font-display text-[15px] font-semibold text-cocoa">
              Unit {unit.number} · {unit.title}
            </span>
            <span className="font-body text-[12px] font-bold text-faint">{unit.canDo}</span>
          </div>
          <div>
            {unit.lessons.map((lesson) => (
              <Link
                key={lesson.index}
                href={`/admin/content/${unit.id}/${lesson.index}`}
                className="flex items-center gap-3 border-b border-[#F1EDE7] px-4 py-2.5 last:border-0 hover:bg-[#FAF8F5]"
              >
                <span className="w-6 font-body text-[12px] font-bold text-faint">
                  {lesson.index}
                </span>
                <span className="flex-1 font-body text-[14px] font-bold text-cocoa">
                  {lesson.title}
                </span>
                {lesson.isCheckpoint && (
                  <span className="rounded-full bg-tint-chest px-2 py-0.5 font-body text-[11px] font-bold text-amber-dark">
                    checkpoint
                  </span>
                )}
                <span className="font-body text-[12px] font-bold text-coral">Edit →</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
