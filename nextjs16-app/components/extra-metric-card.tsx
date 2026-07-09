type ExtraMetricCardProps = {
  model: string | null;
  responseTimeMs: number | null;
  tokensPerSecond: number | null;
};

export function ExtraMetricCard({
  model,
  responseTimeMs,
  tokensPerSecond,
}: ExtraMetricCardProps) {
  return (
    <section className="rounded-xl border border-amber-200 bg-amber-50 p-4">
      <h2 className="mb-2 text-sm font-semibold text-slate-900">Latest Response Metrics</h2>
      <dl className="space-y-2 text-sm text-slate-700">
        <div className="flex items-center justify-between gap-3">
          <dt>Model</dt>
          <dd className="truncate font-semibold">{model ?? "—"}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt>Response time</dt>
          <dd className="font-semibold">
            {responseTimeMs !== null ? `${responseTimeMs} ms` : "—"}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt>Tokens/sec</dt>
          <dd className="font-semibold">
            {tokensPerSecond !== null ? tokensPerSecond.toFixed(2) : "—"}
          </dd>
        </div>
      </dl>
    </section>
  );
}
