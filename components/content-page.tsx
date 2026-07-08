// Layout-agnostic renderer for the shared content pages (method, privacy,
// terms). Single readable column so it works in both the marketing chrome
// and the 402px app chrome; content comes from lib/site-content.ts.

import type { ContentSection } from "@/lib/site-content";

type Props = {
  kicker: string;
  title: string;
  intro: string;
  sections: ContentSection[];
  footer?: React.ReactNode;
};

export function ContentPage({ kicker, title, intro, sections, footer }: Props) {
  return (
    <div className="mx-auto w-full max-w-[720px] px-6 py-10 md:py-16">
      <p className="font-display text-[13px] font-semibold uppercase tracking-[2px] text-coral">
        {kicker}
      </p>
      <h1 className="mt-3 font-display text-[30px] font-semibold leading-[1.12] text-cocoa md:text-[40px]">
        {title}
      </h1>
      <p className="mt-3 font-body text-[15px] font-bold leading-[1.55] text-sec2">{intro}</p>

      <div className="mt-6 flex flex-col gap-3">
        {sections.map((s) => (
          <div
            key={s.title}
            className="rounded-[18px] bg-white p-5 shadow-[0_2px_0_rgba(0,0,0,0.04)]"
          >
            <p className="font-display text-[16px] font-semibold text-cocoa">
              {s.emoji && <span className="mr-2">{s.emoji}</span>}
              {s.title}
            </p>
            <p className="mt-1.5 font-body text-[14px] font-bold leading-[1.55] text-sec">
              {s.body}
            </p>
          </div>
        ))}
      </div>

      {footer && <div className="mt-8">{footer}</div>}
    </div>
  );
}
