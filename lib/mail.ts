import "server-only";

// Outbound email via Resend's REST API (no SDK needed). Without RESEND_API_KEY
// the mail is logged to the server console instead, so reset/verify flows stay
// fully testable in development.

type Mail = { to: string; subject: string; text: string };

export async function sendMail(mail: Mail): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM || "Social XP <onboarding@resend.dev>";

  if (!apiKey) {
    console.log(`[mail:dev] to=${mail.to} subject="${mail.subject}"\n${mail.text}`);
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [mail.to], subject: mail.subject, text: mail.text }),
  });
  if (!res.ok) {
    throw new Error(`Mail send failed (${res.status}): ${await res.text()}`);
  }
}

function appUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
    "http://localhost:3000"
  );
}

export async function sendPasswordResetMail(to: string, token: string): Promise<void> {
  const link = `${appUrl()}/reset-password/${token}`;
  await sendMail({
    to,
    subject: "Reset your Social XP password",
    text: [
      "Hi,",
      "",
      "Someone (hopefully you) asked to reset the password for this Social XP account.",
      "The link below works once and expires in 1 hour:",
      "",
      link,
      "",
      "Didn't ask for this? You can safely ignore this email. Your password stays as it is.",
      "",
      "Social XP",
    ].join("\n"),
  });
}

export async function sendVerificationMail(to: string, token: string): Promise<void> {
  const link = `${appUrl()}/api/verify?token=${token}`;
  await sendMail({
    to,
    subject: "Verify your Social XP email",
    text: [
      "Hi,",
      "",
      "Confirm this email address for your Social XP account by opening the link below.",
      "It expires in 24 hours:",
      "",
      link,
      "",
      "Didn't create an account? You can safely ignore this email.",
      "",
      "Social XP",
    ].join("\n"),
  });
}
