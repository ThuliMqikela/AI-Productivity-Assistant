import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { Sparkles, Loader2, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ToolLayout, Field } from "@/components/tool-layout";
import { OutputPanel } from "@/components/output-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAiTool } from "@/lib/use-ai-tool";
import { buildUserPrompt } from "@/lib/prompts";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workplace AI" },
      {
        name: "description",
        content: "Turn raw meeting notes into decisions, action items, owners, deadlines and open questions.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer" },
      { property: "og:description", content: "Structured meeting summaries that never invent owners or deadlines." },
    ],
  }),
  component: MeetingsPage,
});

const SAMPLE_NOTES = `Q3 roadmap sync — Tues, 40 min. Present: Sam (eng), Dana (design), me.
Sam says the billing migration is blocked on the payments vendor sandbox, waiting since last week.
Dana showed 3 onboarding concepts, team liked option B. Agreed to ship option B in the next release.
Discussion about whether to delay the mobile beta — no decision, need input from marketing.
Sam to chase the vendor by Friday. Dana will prep final onboarding specs.
Someone should check whether support has capacity for the beta — unclear who owns that.`;

function MeetingsPage() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [context, setContext] = useState("");

  const tool = useAiTool("meetings", () => `Meeting: ${title.slice(0, 48) || "Untitled meeting"}`);

  const submit = useCallback(() => {
    void tool.run(
      buildUserPrompt({
        "Meeting title": title,
        "Attendees / context": context,
        "Raw meeting notes": notes,
      }),
    );
  }, [context, notes, title, tool]);

  const reset = () => {
    setTitle("");
    setNotes("");
    setContext("");
    tool.clearOutput();
  };

  const busy = tool.status === "generating";
  const valid = notes.trim().length > 20;

  return (
    <AppShell title="Meeting Notes Summarizer" description="Messy notes into a structured summary">
      <div className="mx-auto max-w-6xl">
        <ToolLayout
          inputTitle="Meeting notes"
          inputDescription="Paste raw notes. Missing owners or deadlines are labelled 'Not specified' — never guessed."
          input={
            <div className="flex flex-col gap-4">
              <Field label="Meeting title" htmlFor="title">
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Q3 roadmap sync"
                />
              </Field>

              <Field label="Attendees / context" htmlFor="context">
                <Input
                  id="context"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="e.g. Sam (eng), Dana (design), me"
                />
              </Field>

              <Field label="Raw notes *" htmlFor="notes" hint="Bullet points, fragments or transcript — all fine.">
                <Textarea
                  id="notes"
                  rows={14}
                  required
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Paste your meeting notes here…"
                />
              </Field>

              <div className="flex flex-wrap gap-2 pt-1">
                <Button onClick={submit} disabled={busy || !valid}>
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                  )}
                  {busy ? "Generating…" : "Summarize notes"}
                </Button>
                <Button variant="outline" onClick={reset} disabled={busy}>
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Clear
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setTitle("Q3 Roadmap Sync");
                    setContext("Sam (engineering), Dana (design), me");
                    setNotes(SAMPLE_NOTES);
                  }}
                  disabled={busy}
                >
                  Load sample notes
                </Button>
              </div>
              {!valid && <p className="text-xs text-muted-foreground">Paste at least a short paragraph of notes.</p>}
            </div>
          }
          output={
            <OutputPanel
              status={tool.status}
              value={tool.output}
              onChange={tool.setOutput}
              onRegenerate={tool.status === "error" ? submit : tool.regenerate}
              onClear={tool.clearOutput}
              onRefine={tool.refine}
              error={tool.error}
              meta="Structured summary"
              emptyHint="Paste your notes on the left to get an executive summary, decisions and action items."
              notice="Owners, deadlines and decisions are only included when your notes state them. Verify the summary against your own record before circulating it."
            />
          }
        />
      </div>
    </AppShell>
  );
}
