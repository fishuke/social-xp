"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { changePassword } from "@/lib/actions";

const inputClass =
  "w-full rounded-[18px] border-2 border-line bg-white px-5 py-[14px] font-body text-[16px] font-bold text-cocoa placeholder:text-faint focus:border-coral focus:outline-none";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (next !== confirm) {
      setError("Those passwords don't match.");
      return;
    }
    setBusy(true);
    setError(null);
    const result = await changePassword({ currentPassword: current, newPassword: next });
    if (result.ok) {
      setDone(true);
      setTimeout(() => router.push("/you"), 1200);
    } else {
      setError(result.error);
      setBusy(false);
    }
  }

  return (
    <div className="page-enter flex flex-1 flex-col px-6 pb-8 pt-[58px]">
      <h1 className="font-display text-[30px] font-semibold leading-[1.15] text-cocoa">
        Change password
      </h1>
      <p className="mt-2 font-body text-[15px] font-bold text-sec2">
        Current one first, then the new one twice.
      </p>

      {done ? (
        <div className="mt-8 rounded-[18px] border-2 border-go-border bg-go-tint p-5 text-center">
          <p className="font-display text-[17px] font-semibold text-go-text">Password updated ✅</p>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-8 flex flex-col gap-3">
          <input
            type="password"
            required
            autoComplete="current-password"
            placeholder="Current password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className={inputClass}
          />
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="New password (8+ characters)"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            className={inputClass}
          />
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Repeat the new one"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={inputClass}
          />
          {error && (
            <p className="rounded-[14px] bg-tint-coral px-4 py-3 font-body text-[13px] font-extrabold text-coral">
              {error}
            </p>
          )}
          <button type="submit" className="btn btn-coral mt-2" disabled={busy}>
            {busy ? "One sec…" : "Update password"}
          </button>
        </form>
      )}

      <div className="mt-auto pt-6 text-center">
        <Link href="/you" className="font-display text-[15px] font-medium text-sec2">
          Back to profile
        </Link>
      </div>
    </div>
  );
}
