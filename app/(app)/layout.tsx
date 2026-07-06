export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    /* Phone-width column; fills the screen on mobile, centered card on desktop */
    <div className="mx-auto flex min-h-dvh w-full max-w-[402px] flex-col bg-cream shadow-[0_0_48px_rgba(46,32,24,0.12)]">
      {children}
    </div>
  );
}
