import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send, Loader2, Trash2, Bot, User, AlertTriangle } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResponsibleAiNotice } from "@/components/responsible-ai-notice";
import { chatWithAI } from "@/lib/ai.functions";
import { logActivity } from "@/lib/workspace-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Workplace Chat — Workplace AI" },
      {
        name: "description",
        content: "Ask workplace questions, draft emails, prep for meetings and prioritise work in one conversation.",
      },
      { property: "og:title", content: "AI Workplace Chat" },
      { property: "og:description", content: "A context-aware workplace assistant for everyday professional tasks." },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Help me prepare for a difficult performance conversation",
  "Turn these notes into an action plan",
  "How should I prioritise three competing deadlines?",
  "Draft a polite reminder about an overdue invoice",
];

const DEMO_CONVERSATION: Msg[] = [
  { role: "user", content: "I have a client call in an hour about a delayed delivery. How should I open it?" },
  {
    role: "assistant",
    content:
      "Open with ownership, then facts, then a plan:\n\n1. **Acknowledge** the delay directly in the first sentence — no build-up.\n2. **State what you know** (only confirmed facts; avoid speculating on a new date you can't commit to).\n3. **Offer the next step** — a revised timeline or a follow-up time when you'll have one.\n\n_Suggestion, not verified advice._ Want me to draft the exact opening lines? Tell me the cause of the delay and whether you have a confirmed new date.",
  },
];

function ChatPage() {
  const send = useServerFn(chatWithAI);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDemo, setShowDemo] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  const submit = async (text: string) => {
    const content = text.trim();
    if (!content || busy) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setShowDemo(false);
    setBusy(true);
    setError(null);
    try {
      const res = await send({ data: { messages: next.slice(-20) } });
      setMessages([...next, { role: "assistant", content: res.text }]);
      logActivity({ tool: "chat", title: `Chat: ${content.slice(0, 48)}`, excerpt: res.text.slice(0, 110) });
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Something went wrong while processing your request. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  const visible = messages.length === 0 && showDemo ? DEMO_CONVERSATION : messages;
  const isDemo = messages.length === 0 && showDemo;

  return (
    <AppShell title="AI Workplace Chat" description="Context-aware help for everyday work">
      <div className="mx-auto flex max-w-4xl flex-col gap-4">
        <Card className="flex min-h-[60vh] flex-col shadow-[var(--shadow-card)]">
          <CardContent className="flex flex-1 flex-col gap-4 pt-6">
            <div className="flex items-center justify-between gap-2">
              {isDemo ? <Badge variant="outline">Sample conversation</Badge> : <span className="text-xs text-muted-foreground">{messages.length} messages this session</span>}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setMessages([]);
                  setShowDemo(false);
                  setError(null);
                }}
                disabled={busy || (messages.length === 0 && !showDemo)}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Clear conversation
              </Button>
            </div>

            <div className="flex flex-1 flex-col gap-4" role="log" aria-live="polite" aria-label="Conversation">
              {visible.length === 0 && (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-14 text-center">
                  <p className="text-sm font-medium">Start a conversation</p>
                  <p className="max-w-xs text-xs text-muted-foreground">
                    Ask about emails, meetings, priorities or workplace topics.
                  </p>
                </div>
              )}

              {visible.map((m, i) => (
                <div key={i} className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}>
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                      m.role === "user" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground",
                    )}
                    aria-hidden="true"
                  >
                    {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </span>
                  <div
                    className={cn(
                      "max-w-[85%] rounded-xl border px-4 py-3 text-sm",
                      m.role === "user"
                        ? "border-primary/20 bg-primary/10"
                        : "border-border bg-muted/40",
                    )}
                  >
                    <span className="sr-only">{m.role === "user" ? "You said:" : "Assistant said:"}</span>
                    <div className="prose-ai">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}

              {busy && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground" role="status">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Generating your response…
                </div>
              )}

              {error && (
                <div role="alert" className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
                  <div>
                    <p className="font-medium">Unable to generate response</p>
                    <p className="text-xs text-muted-foreground">{error}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() => {
                        const last = [...messages].reverse().find((m) => m.role === "user");
                        if (last) {
                          setMessages((prev) => prev.slice(0, prev.findLastIndex((m) => m.role === "user")));
                          void submit(last.content);
                        }
                      }}
                    >
                      Try again
                    </Button>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {visible.length <= DEMO_CONVERSATION.length && (
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <Button key={s} variant="secondary" size="sm" onClick={() => void submit(s)} disabled={busy}>
                    {s}
                  </Button>
                ))}
              </div>
            )}

            <form
              className="flex items-end gap-2 border-t border-border pt-4"
              onSubmit={(e) => {
                e.preventDefault();
                void submit(input);
              }}
            >
              <label htmlFor="chat-input" className="sr-only">
                Message the assistant
              </label>
              <Textarea
                id="chat-input"
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void submit(input);
                  }
                }}
                placeholder="Ask anything work-related… (Enter to send, Shift+Enter for a new line)"
                className="min-h-11 flex-1 resize-none"
              />
              <Button type="submit" disabled={busy || !input.trim()} aria-label="Send message">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
                Send
              </Button>
            </form>
          </CardContent>
        </Card>

        <ResponsibleAiNotice>
          The assistant keeps context for this session only and may be wrong. Treat replies as suggestions and verify
          anything consequential before acting on it.
        </ResponsibleAiNotice>
      </div>
    </AppShell>
  );
}
