import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { performance } from "node:perf_hooks";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

import type {
  ChatCompletionMessage,
  ChatRequestPayload,
  ChatResponsePayload,
  UsageStats,
} from "@/types/chat";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant";

async function resolveGroqApiKey(): Promise<string | null> {
  if (process.env.GROQ_API_KEY) {
    return process.env.GROQ_API_KEY;
  }

  try {
    const filePath = join(process.cwd(), "groq-AIP-Key.env");
    const key = (await readFile(filePath, "utf8")).trim();
    return key || null;
  } catch {
    return null;
  }
}

function normalizeMessages(messages: unknown): ChatCompletionMessage[] | null {
  if (!Array.isArray(messages) || messages.length === 0) {
    return null;
  }

  const normalized: ChatCompletionMessage[] = [];
  for (const message of messages) {
    if (
      typeof message !== "object" ||
      message === null ||
      !("role" in message) ||
      !("content" in message)
    ) {
      return null;
    }

    const role = (message as { role: unknown }).role;
    const content = (message as { content: unknown }).content;

    if ((role !== "user" && role !== "assistant") || typeof content !== "string") {
      return null;
    }

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      return null;
    }

    normalized.push({ role, content: trimmedContent });
  }

  return normalized;
}

function extractUsage(rawUsage: unknown): UsageStats {
  const usage = (rawUsage ?? {}) as Record<string, unknown>;
  return {
    prompt_tokens: Number(usage.prompt_tokens) || 0,
    completion_tokens: Number(usage.completion_tokens) || 0,
    total_tokens: Number(usage.total_tokens) || 0,
  };
}

export async function POST(request: Request) {
  const apiKey = await resolveGroqApiKey();
  if (!apiKey) {
    return NextResponse.json(
      { error: "Groq API key is missing. Add GROQ_API_KEY or groq-AIP-Key.env." },
      { status: 500 },
    );
  }

  let body: ChatRequestPayload;
  try {
    body = (await request.json()) as ChatRequestPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  const messages = normalizeMessages(body.messages);
  if (!messages) {
    return NextResponse.json(
      {
        error:
          "Invalid messages payload. Send a non-empty array of { role: user|assistant, content: string }.",
      },
      { status: 400 },
    );
  }

  const startedAt = performance.now();

  try {
    const groqResponse = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
      }),
    });

    const groqJson = (await groqResponse.json()) as {
      error?: { message?: string };
      model?: string;
      usage?: unknown;
      choices?: Array<{ message?: { content?: string } }>;
    };

    if (!groqResponse.ok) {
      const upstreamError = groqJson.error?.message || "Groq request failed.";
      return NextResponse.json(
        { error: `Groq API error: ${upstreamError}` },
        { status: groqResponse.status },
      );
    }

    const assistantContent = groqJson.choices?.[0]?.message?.content?.trim() || "";
    if (!assistantContent) {
      return NextResponse.json(
        { error: "Groq returned an empty assistant response." },
        { status: 502 },
      );
    }

    const responseTimeMs = Math.round(performance.now() - startedAt);
    const usage = extractUsage(groqJson.usage);
    const tokensPerSecond =
      usage.completion_tokens > 0 && responseTimeMs > 0
        ? Number(((usage.completion_tokens / responseTimeMs) * 1000).toFixed(2))
        : null;

    const payload: ChatResponsePayload = {
      assistantMessage: {
        id: randomUUID(),
        role: "assistant",
        content: assistantContent,
        createdAt: new Date().toISOString(),
      },
      usage,
      model: groqJson.model || GROQ_MODEL,
      responseTimeMs,
      tokensPerSecond,
    };

    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(
      {
        error:
          "Unable to contact Groq right now. Please check your network connection and try again.",
      },
      { status: 502 },
    );
  }
}
