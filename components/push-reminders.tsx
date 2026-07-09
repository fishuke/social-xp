"use client";

// Client-side reminder opt-in: registers the service worker, requests
// notification permission, and subscribes/unsubscribes via server actions.
// Two entry points share one hook:
//   <ReminderSetting /> - full toggle for the You page
//   <ReminderNudge />   - gentle prompt shown after a streak extends

import { useCallback, useEffect, useState } from "react";
import {
  sendTestReminder,
  subscribeToReminders,
  unsubscribeFromReminders,
} from "@/lib/actions";
import { useT } from "@/components/i18n-provider";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
}

type Status = "loading" | "unsupported" | "idle" | "subscribed" | "denied";

function usePushReminders() {
  const [status, setStatus] = useState<Status>("loading");
  const [busy, setBusy] = useState(false);
  const [sub, setSub] = useState<PushSubscription | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supported =
        "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
      if (!supported || !VAPID_PUBLIC_KEY) {
        if (!cancelled) setStatus("unsupported");
        return;
      }
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });
        const existing = await reg.pushManager.getSubscription();
        if (cancelled) return;
        setSub(existing);
        if (existing) setStatus("subscribed");
        else setStatus(Notification.permission === "denied" ? "denied" : "idle");
      } catch {
        if (!cancelled) setStatus("unsupported");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const subscribe = useCallback(async () => {
    if (!VAPID_PUBLIC_KEY) return;
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const next = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
      });
      await subscribeToReminders(JSON.parse(JSON.stringify(next)));
      setSub(next);
      setStatus("subscribed");
    } catch {
      // permission dismissed or blocked
      setStatus(Notification.permission === "denied" ? "denied" : "idle");
    } finally {
      setBusy(false);
    }
  }, []);

  const unsubscribe = useCallback(async () => {
    if (!sub) return;
    setBusy(true);
    try {
      const { endpoint } = sub;
      await sub.unsubscribe();
      await unsubscribeFromReminders(endpoint);
      setSub(null);
      setStatus("idle");
    } finally {
      setBusy(false);
    }
  }, [sub]);

  return { status, busy, subscribe, unsubscribe };
}

/** Full reminder control for the You page. */
export function ReminderSetting() {
  const t = useT();
  const { status, busy, subscribe, unsubscribe } = usePushReminders();
  const [testMsg, setTestMsg] = useState<string | null>(null);

  if (status === "loading" || status === "unsupported") return null;

  const on = status === "subscribed";

  async function test() {
    setTestMsg(null);
    const { sent } = await sendTestReminder();
    setTestMsg(sent > 0 ? t.reminders.testSent : t.reminders.testNoDevice);
  }

  return (
    <div className="mt-5 rounded-[18px] bg-white p-4 shadow-[0_2px_0_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-3">
        <span className="text-[24px]">🔔</span>
        <span className="flex-1">
          <span className="block font-display text-[15px] font-semibold text-cocoa">
            {t.reminders.title}
          </span>
          <span className="block font-body text-[12px] font-bold text-sec2">
            {status === "denied" ? t.reminders.denied : on ? t.reminders.on : t.reminders.off}
          </span>
        </span>
        {status !== "denied" && (
          <button
            onClick={on ? unsubscribe : subscribe}
            disabled={busy}
            aria-pressed={on}
            className="relative h-[30px] w-[52px] rounded-full transition-colors disabled:opacity-60"
            style={{ background: on ? "var(--color-coral)" : "var(--color-line)" }}
          >
            <span
              className="absolute top-[3px] h-[24px] w-[24px] rounded-full bg-white shadow transition-all"
              style={{ left: on ? "25px" : "3px" }}
            />
          </button>
        )}
      </div>
      {on && (
        <div className="mt-3 flex items-center gap-3 border-t border-line pt-3">
          <button
            onClick={test}
            className="font-display text-[13px] font-semibold text-coral"
          >
            {t.reminders.sendTest}
          </button>
          {testMsg && <span className="font-body text-[12px] font-bold text-sec2">{testMsg}</span>}
        </div>
      )}
    </div>
  );
}

/** Gentle post-streak prompt (dark background - matches the streak screen). */
export function ReminderNudge() {
  const t = useT();
  const { status, busy, subscribe } = usePushReminders();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || status !== "idle") return null;

  return (
    <div className="pop-in mt-6 w-full rounded-[18px] bg-white/12 p-4 text-left" style={{ animationDelay: "650ms" }}>
      <p className="font-display text-[16px] font-semibold text-white">{t.streak.nudgeTitle}</p>
      <p className="mt-1 font-body text-[13px] font-bold leading-[1.5] text-ondark">
        {t.streak.nudgeBody}
      </p>
      <div className="mt-3 flex gap-2">
        <button onClick={subscribe} disabled={busy} className="btn btn-amber flex-1">
          {t.streak.turnOnReminders}
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="rounded-full px-4 font-display text-[14px] font-semibold text-ondark/70"
        >
          {t.common.notNow}
        </button>
      </div>
    </div>
  );
}
