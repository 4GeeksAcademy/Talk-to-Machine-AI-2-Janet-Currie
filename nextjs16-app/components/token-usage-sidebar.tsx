import { ExtraMetricCard } from "@/components/extra-metric-card";
import { PerMessageUsageList } from "@/components/per-message-usage-list";
import { SessionTotals } from "@/components/session-totals";
import type { SessionTotals as SessionTotalsModel, TurnUsageMetric } from "@/types/chat";

type TokenUsageSidebarProps = {
  totals: SessionTotalsModel;
  usageMetrics: TurnUsageMetric[];
  latestModel: string | null;
  latestResponseTimeMs: number | null;
  latestTokensPerSecond: number | null;
};

export function TokenUsageSidebar({
  totals,
  usageMetrics,
  latestModel,
  latestResponseTimeMs,
  latestTokensPerSecond,
}: TokenUsageSidebarProps) {
  return (
    <div className="flex h-full flex-col gap-4">
      <SessionTotals totals={totals} />
      <ExtraMetricCard
        model={latestModel}
        responseTimeMs={latestResponseTimeMs}
        tokensPerSecond={latestTokensPerSecond}
      />
      <PerMessageUsageList usageMetrics={usageMetrics} />
    </div>
  );
}
