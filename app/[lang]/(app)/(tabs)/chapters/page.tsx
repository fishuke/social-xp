import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { currentPosition, getCourseProgress } from "@/lib/game";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { coerceLocale } from "@/lib/i18n/config";
import { withLocale } from "@/lib/i18n/routing";
import {
  CheckIcon,
  ChevronLeftIcon,
  FlagIcon,
  LockIcon,
  PlayIcon,
} from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function UnitsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = coerceLocale(lang);
  const t = getDictionary(locale);
  const user = await getSessionUser();
  if (!user) redirect(withLocale(locale, "/onboarding"));

  const progress = await getCourseProgress(user, locale);
  const pos = currentPosition(progress);

  // group units by level, preserving order
  const levels: { code: string; title: string }[] = [];
  for (const p of progress) {
    if (!levels.some((l) => l.code === p.unit.level)) {
      levels.push({ code: p.unit.level, title: p.unit.levelTitle });
    }
  }

  return (
    <div className="page-enter flex flex-col gap-4 px-5 pb-8 pt-[58px]">
      <header className="flex items-center gap-2">
        <Link href={withLocale(locale, "/learn")} aria-label={t.chapters.back} className="-ml-1 p-1 text-cocoa">
          <ChevronLeftIcon size={24} />
        </Link>
        <h1 className="font-display text-[20px] font-semibold text-cocoa">{t.chapters.title}</h1>
      </header>

      {levels.map((level) => (
        <section key={level.code} className="flex flex-col gap-3">
          <div className="mt-1 flex items-center gap-2.5">
            <span className="rounded-[10px] bg-cocoa px-2.5 py-1 font-display text-[13px] font-semibold tracking-[1px] text-amber">
              {level.code}
            </span>
            <span className="font-display text-[15px] font-semibold text-sec2">{level.title}</span>
            <span className="h-[2px] flex-1 rounded-full bg-line" />
          </div>

          {progress
            .filter((p) => p.unit.level === level.code)
            .map(({ unit, completed, unlocked, complete }) => {
              const isActive = unit.id === pos.unitId && unlocked;
              const quotesLeft = unit.lessons.length - completed.length;

              if (!isActive) {
                return (
                  <Link
                    key={unit.id}
                    href={withLocale(locale, !unlocked ? "/paywall" : "/learn")}
                    className="flex items-center gap-4 rounded-[22px] bg-white p-4 opacity-85"
                  >
                    <span
                      className="flex h-[52px] w-[52px] items-center justify-center rounded-[16px] font-display text-[22px] font-semibold"
                      style={
                        complete
                          ? { background: "#58C08A", color: "#fff" }
                          : { background: "#EADFD5", color: "#8A7B70" }
                      }
                    >
                      {complete ? <CheckIcon size={26} /> : unit.number}
                    </span>
                    <span className="flex-1">
                      <span
                        className="block font-display text-[18px] font-semibold"
                        style={{ color: "#8A7B70" }}
                      >
                        {unit.title}
                      </span>
                      {complete ? (
                        <span className="flex items-start gap-1.5 font-body text-[13px] font-bold text-go-text">
                          <span className="mt-0.5 shrink-0">
                            <CheckIcon size={13} color="var(--color-go)" />
                          </span>
                          {unit.canDo}
                        </span>
                      ) : (
                        <span className="block font-body text-[13px] font-bold text-faint">
                          {unit.tagline}
                        </span>
                      )}
                    </span>
                    {!unlocked && <LockIcon size={22} />}
                  </Link>
                );
              }

              return (
                <section
                  key={unit.id}
                  className="rounded-[22px] border-2 border-coral bg-white p-4 shadow-[0_5px_0_rgba(255,90,44,0.15)]"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-[52px] w-[52px] items-center justify-center rounded-[16px] font-display text-[24px] font-semibold text-white"
                      style={{ background: "linear-gradient(160deg, #FF7A45, #FF5A2C)" }}
                    >
                      {unit.number}
                    </span>
                    <div>
                      <p className="font-display text-[19px] font-semibold text-cocoa">
                        {unit.title}
                      </p>
                      <p className="font-body text-[13px] font-extrabold text-coral">
                        {t.chapters.doneAndQuotes(completed.length, unit.lessons.length, quotesLeft)}
                      </p>
                    </div>
                  </div>

                  <p
                    className="mt-3 rounded-[12px] bg-tint-warm px-3 py-2 font-body text-[13px] font-extrabold"
                    style={{ color: "#7A5A3E" }}
                  >
                    🎯 {unit.canDo}
                  </p>

                  <div className="mt-4 flex flex-col gap-3">
                    {unit.lessons.map((lesson) => {
                      const done = completed.includes(lesson.index);
                      const current = lesson.index === pos.lessonIndex && unit.id === pos.unitId;
                      return (
                        <div key={lesson.index} className="flex items-center gap-3">
                          <span
                            className="flex h-[22px] w-[22px] items-center justify-center rounded-full"
                            style={{
                              background: done
                                ? "#58C08A"
                                : current
                                  ? "#FF5A2C"
                                  : lesson.isCheckpoint
                                    ? "#2E2018"
                                    : "#EADFD5",
                            }}
                          >
                            {done ? (
                              <CheckIcon size={13} />
                            ) : current ? (
                              <PlayIcon size={11} />
                            ) : lesson.isCheckpoint ? (
                              <FlagIcon size={12} />
                            ) : null}
                          </span>
                          <span
                            className="flex-1 font-body text-[14px]"
                            style={{
                              color: done || current ? "#544537" : "#B8A99C",
                              fontWeight: current ? 800 : 700,
                            }}
                          >
                            {lesson.isCheckpoint
                              ? t.chapters.checkpointLabel(lesson.title.replace("Checkpoint: ", ""))
                              : lesson.title}
                          </span>
                          {current && (
                            <span className="rounded-full bg-coral px-2 py-0.5 font-display text-[11px] font-semibold tracking-[1px] text-white">
                              {t.chapters.now}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <Link
                    href={withLocale(locale, `/lesson/${unit.id}/${pos.lessonIndex}`)}
                    className="btn btn-coral mt-4 rounded-[16px]"
                    style={{ fontSize: 17 }}
                  >
                    {t.chapters.continueWith(
                      unit.lessons.find((l) => l.index === pos.lessonIndex)?.title ?? "",
                    )}
                  </Link>
                </section>
              );
            })}
        </section>
      ))}
    </div>
  );
}
