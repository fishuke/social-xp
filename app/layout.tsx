import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Social XP",
  description: "Social skills are just reps. 3 minutes a day.",
};

export const viewport: Viewport = {
  themeColor: "#FFF6EE",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable} h-full antialiased`}>
      <body className="min-h-dvh">
        {/* Phone-width column; fills the screen on mobile, centered card on desktop */}
        <div className="mx-auto flex min-h-dvh w-full max-w-[402px] flex-col bg-cream shadow-[0_0_48px_rgba(46,32,24,0.12)]">
          {children}
        </div>
      </body>
    </html>
  );
}
