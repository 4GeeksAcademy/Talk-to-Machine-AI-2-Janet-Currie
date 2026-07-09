# Chat Interface — Component Outline

A TypeScript component breakdown for a chat interface featuring a **message
history panel** and a **token usage stats sidebar**. All API interactions use a
`Authorization: Bearer <API_KEY>` header. Chat history persists across refreshes,
and every API response's `usage` object is tracked and displayed across the full
session.


---

## 1. Architecture at a Glance

```
App
├── ChatProvider (context: messages, usage, session lifecycle)
│
├── ChatLayout
│   ├── ChatPanel                 ← main column
│   │   ├── ChatHeader
│   │   ├── MessageHistoryPanel   ← scrollable message list (persisted)
│   │   │   └── MessageBubble[]
│   │   └── MessageComposer       ← input + send
│   │
│   └── TokenUsageSidebar         ← right column
│       ├── SessionTotals
│       ├── PerMessageUsageList
│       └── ExtraMetricCard       ← model / response time / tokens-per-sec
```

**Data flow**

1. `MessageComposer` submits text → `ChatProvider.sendMessage()`.
2. `apiClient.sendChat()` POSTs to the API with the `Bearer` auth header.
3. Response returns `{ message, usage, model, ... }`.
4. `ChatProvider` appends the message, accumulates `usage`, derives extra
   metrics, and persists everything to storage.
5. `MessageHistoryPanel` and `TokenUsageSidebar` re-render from context.

