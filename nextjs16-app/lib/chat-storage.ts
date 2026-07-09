import {
  EMPTY_TOTALS,
  type ChatMessage,
  type PersistedChatSession,
  type SessionTotals,
  type TurnUsageMetric,
} from "@/types/chat";

const STORAGE_KEY = "groq-chat-session-v1";

type SessionState = {
  messages: ChatMessage[];
  totals: SessionTotals;
  usageMetrics: TurnUsageMetric[];
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function sanitizeSession(raw: unknown): SessionState {
  if (!isObject(raw)) {
    return { messages: [], totals: EMPTY_TOTALS, usageMetrics: [] };
  }

  const messages = Array.isArray(raw.messages) ? (raw.messages as ChatMessage[]) : [];
  const usageMetrics = Array.isArray(raw.usageMetrics)
    ? (raw.usageMetrics as TurnUsageMetric[])
    : [];
  const totals = isObject(raw.totals)
    ? {
        promptTokens: Number(raw.totals.promptTokens) || 0,
        completionTokens: Number(raw.totals.completionTokens) || 0,
        totalTokens: Number(raw.totals.totalTokens) || 0,
      }
    : EMPTY_TOTALS;

  return { messages, usageMetrics, totals };
}

export function loadSessionState(): SessionState {
  if (typeof window === "undefined") {
    return { messages: [], totals: EMPTY_TOTALS, usageMetrics: [] };
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { messages: [], totals: EMPTY_TOTALS, usageMetrics: [] };
  }

  try {
    const parsed = JSON.parse(raw) as PersistedChatSession;
    if (parsed.version !== 1) {
      return { messages: [], totals: EMPTY_TOTALS, usageMetrics: [] };
    }

    return sanitizeSession(parsed);
  } catch {
    return { messages: [], totals: EMPTY_TOTALS, usageMetrics: [] };
  }
}

export function saveSessionState(state: SessionState): void {
  if (typeof window === "undefined") {
    return;
  }

  const payload: PersistedChatSession = {
    version: 1,
    messages: state.messages,
    totals: state.totals,
    usageMetrics: state.usageMetrics,
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}
