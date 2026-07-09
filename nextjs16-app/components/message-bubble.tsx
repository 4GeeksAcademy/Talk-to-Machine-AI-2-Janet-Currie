import type { ChatMessage } from "@/types/chat";

type MessageBubbleProps = {
  message: ChatMessage;
};

function formatTimestamp(isoDate: string): string {
  const date = new Date(isoDate);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <article className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-3 shadow-sm ${
          isUser
            ? "bg-slate-900 text-slate-50"
            : "bg-amber-50 text-slate-900 ring-1 ring-amber-100"
        }`}
      >
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-80">
          {isUser ? "You" : "Assistant"}
        </p>
        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
          {message.content}
        </p>
        <p className="mt-2 text-[10px] opacity-75">{formatTimestamp(message.createdAt)}</p>
      </div>
    </article>
  );
}
