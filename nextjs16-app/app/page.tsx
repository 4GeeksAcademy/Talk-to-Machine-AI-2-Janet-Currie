"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { ChatHeader } from "@/components/chat-header";
import { ChatLayout } from "@/components/chat-layout";
import { MessageComposer } from "@/components/message-composer";
import { MessageHistoryPanel } from "@/components/message-history-panel";
import { TokenUsageSidebar } from "@/components/token-usage-sidebar";
import { loadSessionState, saveSessionState } from "@/lib/chat-storage";
import {
  EMPTY_TOTALS,
  type ChatMessage,
  type ChatResponsePayload,
  type SessionTotals,
  type TurnUsageMetric,
} from "@/types/chat";

type ApiErrorPayload = {
  error?: string;
};

function createMessage(role: "user" | "assistant", content: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}

function accumulateTotals(current: SessionTotals, metric: TurnUsageMetric): SessionTotals {
  return {
    promptTokens: current.promptTokens + metric.usage.prompt_tokens,
    completionTokens: current.completionTokens + metric.usage.completion_tokens,
    totalTokens: current.totalTokens + metric.usage.total_tokens,
  };
}

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totals, setTotals] = useState<SessionTotals>(EMPTY_TOTALS);
  const [usageMetrics, setUsageMetrics] = useState<TurnUsageMetric[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const saved = loadSessionState();

    const hydrationTimer = window.setTimeout(() => {
      setMessages(saved.messages);
      setTotals(saved.totals);
      setUsageMetrics(saved.usageMetrics);
      setHasHydrated(true);
    }, 0);

    return () => {
      window.clearTimeout(hydrationTimer);
    };
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    saveSessionState({ messages, totals, usageMetrics });
  }, [hasHydrated, messages, totals, usageMetrics]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const latestMetric = useMemo(
    () => usageMetrics[usageMetrics.length - 1] ?? null,
    [usageMetrics],
  );

  async function sendMessage() {
    if (isLoading) {
      return;
    }

    const trimmed = input.trim();
    if (!trimmed) {
      return;
    }

    setError(null);
    setInput("");

    const userMessage = createMessage("user", trimmed);
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as ApiErrorPayload | null;
        throw new Error(errorPayload?.error || "We could not get a response from Groq.");
      }

      const data = (await response.json()) as ChatResponsePayload;
      const nextMetric: TurnUsageMetric = {
        messageId: data.assistantMessage.id,
        model: data.model,
        usage: data.usage,
        responseTimeMs: data.responseTimeMs,
        tokensPerSecond: data.tokensPerSecond,
        createdAt: data.assistantMessage.createdAt,
      };

      setMessages((current) => [...current, data.assistantMessage]);
      setUsageMetrics((current) => [...current, nextMetric]);
      setTotals((totalsState) => accumulateTotals(totalsState, nextMetric));
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong while sending your message.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <ChatLayout
        chatPanel={
          <>
            <ChatHeader
              title="Groq Chat Interface"
              subtitle="Meta Llama 3.1 8B Instant with session-persistent token tracking"
            />
            {error ? (
              <div
                className="mx-4 mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            ) : null}
            <div ref={scrollContainerRef} className="flex min-h-0 flex-1 flex-col">
              <MessageHistoryPanel messages={messages} isLoading={isLoading} />
            </div>
            <MessageComposer
              input={input}
              isLoading={isLoading}
              onInputChange={setInput}
              onSubmit={sendMessage}
            />
          </>
        }
        sidebar={
          <TokenUsageSidebar
            totals={totals}
            usageMetrics={usageMetrics}
            latestModel={latestMetric?.model ?? null}
            latestResponseTimeMs={latestMetric?.responseTimeMs ?? null}
            latestTokensPerSecond={latestMetric?.tokensPerSecond ?? null}
          />
        }
      />
    </div>
  );
}
