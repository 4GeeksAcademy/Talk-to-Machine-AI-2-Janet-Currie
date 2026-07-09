import { MessageBubble } from "@/components/message-bubble";
import type { ChatMessage } from "@/types/chat";

type MessageHistoryPanelProps = {
  messages: ChatMessage[];
  isLoading: boolean;
};

export function MessageHistoryPanel({
  messages,
  isLoading,
}: MessageHistoryPanelProps) {
  if (messages.length === 0) {
    return (
      <section className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="max-w-md rounded-2xl border border-dashed border-amber-300 bg-amber-50 px-5 py-6 text-center text-sm text-slate-700">
          Start the conversation by typing a message below.
        </div>
      </section>
    );
  }

  return (
    <section className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {isLoading ? (
        <div className="flex items-center gap-2 px-2 text-sm text-slate-500" aria-live="polite">
          <span className="inline-block size-2 animate-pulse rounded-full bg-slate-400" />
          Assistant is thinking...
        </div>
      ) : null}
    </section>
  );
}
