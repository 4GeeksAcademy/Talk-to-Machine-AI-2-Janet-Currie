import type { TurnUsageMetric } from "@/types/chat";

type PerMessageUsageListProps = {
  usageMetrics: TurnUsageMetric[];
};

export function PerMessageUsageList({ usageMetrics }: PerMessageUsageListProps) {
  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold text-slate-900">Per Response Usage</h2>
      {usageMetrics.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-3 text-xs text-slate-500">
          Usage metrics will appear after your first response.
        </p>
      ) : (
        <ul className="max-h-72 space-y-2 overflow-y-auto pr-1">
          {usageMetrics
            .slice()
            .reverse()
            .map((metric, index) => (
              <li key={metric.messageId} className="rounded-xl border border-slate-200 p-3 text-xs">
                <p className="mb-2 font-semibold text-slate-700">Response {usageMetrics.length - index}</p>
                <p>Prompt: {metric.usage.prompt_tokens}</p>
                <p>Completion: {metric.usage.completion_tokens}</p>
                <p>Total: {metric.usage.total_tokens}</p>
              </li>
            ))}
        </ul>
      )}
    </section>
  );
}
