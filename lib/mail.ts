import "server-only";
import { coerceLocale, DEFAULT_LOCALE, type Locale } from "./i18n/config";

// Outbound email via Resend's REST API (no SDK needed). Without RESEND_API_KEY
// the mail is logged to the server console instead, so reset/verify flows stay
// fully testable in development.

type Mail = { to: string; subject: string; text: string };

async function sendMail(mail: Mail): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM || "Convozy <onboarding@resend.dev>";

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

const resetMail: Record<Locale, (link: string) => { subject: string; text: string }> = {
  en: (link) => ({
    subject: "Reset your Convozy password",
    text: [
      "Hi,",
      "",
      "Someone (hopefully you) asked to reset the password for this Convozy account.",
      "The link below works once and expires in 1 hour:",
      "",
      link,
      "",
      "Didn't ask for this? You can safely ignore this email. Your password stays as it is.",
      "",
      "Convozy",
    ].join("\n"),
  }),
  tr: (link) => ({
    subject: "Convozy şifreni sıfırla",
    text: [
      "Merhaba,",
      "",
      "Birisi (umarız sensindir) bu Convozy hesabının şifresini sıfırlamak istedi.",
      "Aşağıdaki bağlantı bir kez çalışır ve 1 saat içinde geçerliliğini yitirir:",
      "",
      link,
      "",
      "Bunu sen istemediysen bu e-postayı yok sayabilirsin. Şifren olduğu gibi kalır.",
      "",
      "Convozy",
    ].join("\n"),
  }),
};

const verifyMail: Record<Locale, (link: string) => { subject: string; text: string }> = {
  en: (link) => ({
    subject: "Verify your Convozy email",
    text: [
      "Hi,",
      "",
      "Confirm this email address for your Convozy account by opening the link below.",
      "It expires in 24 hours:",
      "",
      link,
      "",
      "Didn't create an account? You can safely ignore this email.",
      "",
      "Convozy",
    ].join("\n"),
  }),
  tr: (link) => ({
    subject: "Convozy e-postanı doğrula",
    text: [
      "Merhaba,",
      "",
      "Aşağıdaki bağlantıyı açarak bu e-posta adresini Convozy hesabın için doğrula.",
      "Bağlantı 24 saat içinde geçerliliğini yitirir:",
      "",
      link,
      "",
      "Bir hesap oluşturmadıysan bu e-postayı yok sayabilirsin.",
      "",
      "Convozy",
    ].join("\n"),
  }),
};

export async function sendPasswordResetMail(
  to: string,
  token: string,
  locale: string = DEFAULT_LOCALE,
): Promise<void> {
  const l = coerceLocale(locale);
  const link = `${appUrl()}/${l}/reset-password/${token}`;
  await sendMail({ to, ...resetMail[l](link) });
}

export async function sendVerificationMail(
  to: string,
  token: string,
  locale: string = DEFAULT_LOCALE,
): Promise<void> {
  // /api/verify is not locale-prefixed; the post-verify redirect adds the locale.
  const link = `${appUrl()}/api/verify?token=${token}`;
  await sendMail({ to, ...verifyMail[coerceLocale(locale)](link) });
}
