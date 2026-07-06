"use client";

import Link from "next/link";
import { useState } from "react";
import type { LessonData, QuoteData } from "@/lib/content";
import { saveLesson, saveQuote, type AdminSaveResult } from "@/lib/admin-actions";

const fieldClass =
  "w-full rounded-lg border border-[#DDD6CC] bg-white px-3 py-2 font-body text-[13px] text-cocoa focus:border-coral focus:outline-none";
const labelClass = "mb-1 block font-body text-[12px] font-bold text-sec2";

function SaveBar({ busy, result }: { busy: boolean; result: AdminSaveResult | null }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="submit"
        disabled={busy}
        className="rounded-lg bg-coral px-5 py-2 font-display text-[14px] font-semibold text-white shadow-[0_2px_0_#D8431B] disabled:opacity-50"
      >
        {busy ? "Saving…" : "Save"}
      </button>
      {result?.ok && <span className="font-body text-[13px] font-bold text-go-dark">Saved ✓</span>}
      {result && !result.ok && (
        <span className="font-body text-[13px] font-bold text-coral">{result.error}</span>
      )}
    </div>
  );
}

export function LessonEditor({
  unitTitle,
  lesson,
  quote,
}: {
  unitTitle: string;
  lesson: LessonData;
  quote: QuoteData | null;
}) {
  const [title, setTitle] = useState(lesson.title);
  const [isCheckpoint, setIsCheckpoint] = useState(lesson.isCheckpoint);
  const [stepsJson, setStepsJson] = useState(JSON.stringify(lesson.steps, null, 2));
  const [challengeJson, setChallengeJson] = useState(JSON.stringify(lesson.challenge, null, 2));
  const [lessonResult, setLessonResult] = useState<AdminSaveResult | null>(null);
  const [lessonBusy, setLessonBusy] = useState(false);

  const [quoteText, setQuoteText] = useState(quote?.text ?? "");
  const [author, setAuthor] = useState(quote?.author ?? "");
  const [authorNote, setAuthorNote] = useState(quote?.authorNote ?? "");
  const [rare, setRare] = useState(quote?.rare ?? false);
  const [quoteResult, setQuoteResult] = useState<AdminSaveResult | null>(null);
  const [quoteBusy, setQuoteBusy] = useState(false);

  async function submitLesson(e: React.FormEvent) {
    e.preventDefault();
    setLessonBusy(true);
    setLessonResult(
      await saveLesson({
        unitId: lesson.unitId,
        index: lesson.index,
        title,
        isCheckpoint,
        stepsJson,
        challengeJson,
      })
    );
    setLessonBusy(false);
  }

  async function submitQuote(e: React.FormEvent) {
    e.preventDefault();
    setQuoteBusy(true);
    setQuoteResult(
      await saveQuote({
        unitId: lesson.unitId,
        lessonIndex: lesson.index,
        text: quoteText,
        author,
        authorNote,
        rare,
      })
    );
    setQuoteBusy(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/content" className="font-body text-[13px] font-bold text-sec2">
          ← All content
        </Link>
        <h1 className="mt-1 font-display text-[22px] font-semibold text-cocoa">
          {unitTitle} · Lesson {lesson.index}
        </h1>
      </div>

      <form onSubmit={submitLesson} className="rounded-xl border border-[#E5E0D8] bg-white p-5">
        <div className="mb-4 flex items-end gap-4">
          <div className="flex-1">
            <label className={labelClass}>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={fieldClass} />
          </div>
          <label className="flex items-center gap-2 pb-2 font-body text-[13px] font-bold text-sec2">
            <input
              type="checkbox"
              checked={isCheckpoint}
              onChange={(e) => setIsCheckpoint(e.target.checked)}
            />
            Checkpoint
          </label>
        </div>
        <label className={labelClass}>
          Steps: array of {"{type:\"concept\"}"} and {"{type:\"quiz\", voice:\"them\"|\"inner\"}"}
        </label>
        <textarea
          value={stepsJson}
          onChange={(e) => setStepsJson(e.target.value)}
          rows={22}
          spellCheck={false}
          className={`${fieldClass} font-mono text-[12px]`}
        />
        <label className={`${labelClass} mt-4`}>Challenge: {"{text, sub}"}</label>
        <textarea
          value={challengeJson}
          onChange={(e) => setChallengeJson(e.target.value)}
          rows={5}
          spellCheck={false}
          className={`${fieldClass} font-mono text-[12px]`}
        />
        <div className="mt-4">
          <SaveBar busy={lessonBusy} result={lessonResult} />
        </div>
      </form>

      {quote && (
        <form onSubmit={submitQuote} className="rounded-xl border border-[#E5E0D8] bg-white p-5">
          <h2 className="mb-4 font-display text-[16px] font-semibold text-cocoa">Quote card</h2>
          <label className={labelClass}>Text</label>
          <textarea
            value={quoteText}
            onChange={(e) => setQuoteText(e.target.value)}
            rows={3}
            className={fieldClass}
          />
          <div className="mt-3 flex gap-4">
            <div className="flex-1">
              <label className={labelClass}>Author</label>
              <input value={author} onChange={(e) => setAuthor(e.target.value)} className={fieldClass} />
            </div>
            <div className="flex-1">
              <label className={labelClass}>Author note</label>
              <input
                value={authorNote}
                onChange={(e) => setAuthorNote(e.target.value)}
                className={fieldClass}
              />
            </div>
            <label className="flex items-center gap-2 pt-5 font-body text-[13px] font-bold text-sec2">
              <input type="checkbox" checked={rare} onChange={(e) => setRare(e.target.checked)} />
              Rare
            </label>
          </div>
          <div className="mt-4">
            <SaveBar busy={quoteBusy} result={quoteResult} />
          </div>
        </form>
      )}
    </div>
  );
}
