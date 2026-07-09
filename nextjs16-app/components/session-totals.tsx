import type { SessionTotals as SessionTotalsModel } from "@/types/chat";

type SessionTotalsProps = {
  totals: SessionTotalsModel;
};

export function SessionTotals({ totals }: SessionTotalsProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">Session Totals</h2>
      <dl className="space-y-2 text-sm text-slate-700">
        <div className="flex items-center justify-between">
          <dt>Prompt tokens</dt>
          <dd className="font-semibold">{totals.promptTokens}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>Completion tokens</dt>
          <dd className="font-semibold">{totals.completionTokens}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>Total tokens</dt>
          <dd className="font-semibold">{totals.totalTokens}</dd>
        </div>
      </dl>
    </section>
  );
}
