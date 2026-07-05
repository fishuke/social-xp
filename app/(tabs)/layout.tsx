import { TabBar } from "@/components/tab-bar";

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="flex flex-1 flex-col">{children}</main>
      <TabBar />
    </>
  );
}
