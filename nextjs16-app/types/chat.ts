export type MessageRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
};

export type UsageStats = {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
};

export type SessionTotals = {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
};

export type TurnUsageMetric = {
  messageId: string;
  model: string;
  usage: UsageStats;
  responseTimeMs: number;
  tokensPerSecond: number | null;
  createdAt: string;
};

export type PersistedChatSession = {
  version: 1;
  messages: ChatMessage[];
  totals: SessionTotals;
  usageMetrics: TurnUsageMetric[];
};

export type ChatCompletionMessage = {
  role: MessageRole;
  content: string;
};

export type ChatRequestPayload = {
  messages: ChatCompletionMessage[];
};

export type ChatResponsePayload = {
  assistantMessage: ChatMessage;
  usage: UsageStats;
  model: string;
  responseTimeMs: number;
  tokensPerSecond: number | null;
};

export const EMPTY_TOTALS: SessionTotals = {
  promptTokens: 0,
  completionTokens: 0,
  totalTokens: 0,
};
