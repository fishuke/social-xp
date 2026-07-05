"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CourseSwitcher({
  courses,
  activeCourseId,
}: {
  courses: { id: number; title: string }[];
  activeCourseId: number;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function switchTo(courseId: number) {
    if (busy || courseId === activeCourseId) return;
    setBusy(true);
    await fetch("/api/course", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    });
    router.refresh();
    setBusy(false);
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {courses.map((course) => {
        const active = course.id === activeCourseId;
        return (
          <button
            key={course.id}
            onClick={() => switchTo(course.id)}
            disabled={busy}
            className="shrink-0 rounded-full px-4 py-2 font-display text-[14px] font-semibold transition-colors"
            style={
              active
                ? { background: "#FF5A2C", color: "#fff", boxShadow: "0 3px 0 #D8431B" }
                : { background: "#fff", color: "#7A6A5C", border: "2px solid #EADFD5" }
            }
          >
            {course.title}
          </button>
        );
      })}
    </div>
  );
}
