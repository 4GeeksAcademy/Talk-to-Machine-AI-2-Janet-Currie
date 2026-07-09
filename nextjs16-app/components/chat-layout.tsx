import type { ReactNode } from "react";

type ChatLayoutProps = {
  chatPanel: ReactNode;
  sidebar: ReactNode;
};

export function ChatLayout({ chatPanel, sidebar }: ChatLayoutProps) {
  return (
    <div className="grid min-h-screen gap-4 bg-[radial-gradient(circle_at_top,_#fef3c7,_#fff7ed_45%,_#f8fafc)] p-4 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
      <section className="flex min-h-[75vh] flex-col rounded-2xl border border-amber-200 bg-white shadow-sm">
        {chatPanel}
      </section>
      <aside className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur">
        {sidebar}
      </aside>
    </div>
  );
}
