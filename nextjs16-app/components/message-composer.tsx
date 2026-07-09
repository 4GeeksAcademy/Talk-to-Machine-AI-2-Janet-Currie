import { FormEvent, KeyboardEvent } from "react";

type MessageComposerProps = {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
};

export function MessageComposer({
  input,
  isLoading,
  onInputChange,
  onSubmit,
}: MessageComposerProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-amber-100 bg-white p-4">
      <label htmlFor="chat-message" className="mb-2 block text-sm font-medium text-slate-700">
        Your message
      </label>
      <div className="flex items-end gap-3">
        <textarea
          id="chat-message"
          value={input}
          onChange={(event) => onInputChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          rows={3}
          disabled={isLoading}
          className="min-h-24 w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-amber-400 transition focus:ring"
        />
        <button
          type="submit"
          disabled={isLoading || input.trim().length === 0}
          className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-500">Press Enter to send, Shift+Enter for a new line.</p>
    </form>
  );
}
