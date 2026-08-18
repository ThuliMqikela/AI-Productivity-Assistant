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

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Workplace AI" },
      {
        name: "description",
        content: "Summarise a topic or article, separate sourced facts from AI interpretation, and get follow-up questions.",
      },
      { property: "og:title", content: "AI Research Assistant" },
      { property: "og:description", content: "Decision-useful research summaries with no fabricated sources." },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const [question, setQuestion] = useState("");
  const [source, setSource] = useState("");
  const [audience, setAudience] = useState("");

  const tool = useAiTool("research", () => `Research: ${question.slice(0, 48) || "Untitled topic"}`);

  const submit = useCallback(() => {
    void tool.run(
      buildUserPrompt({
        "Research question or topic": question,
        "Audience / decision this supports": audience,
        "Supplied source material": source,
      }),
    );
  }, [audience, question, source, tool]);

  const reset = () => {
    setQuestion("");
    setSource("");
    setAudience("");
    tool.clearOutput();
  };

  const busy = tool.status === "generating";
  const valid = question.trim().length > 3 || source.trim().length > 40;

  return (
    <AppShell title="AI Research Assistant" description="Summarise, analyse, and know what to verify">
      <div className="mx-auto max-w-6xl">
        <ToolLayout
          inputTitle="Research brief"
          inputDescription="Ask a question, or paste article text to have it summarised and analysed."
          input={
            <div className="flex flex-col gap-4">
              <Field label="Research question or topic" htmlFor="question">
                <Input
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. What should we consider before moving to a four-day week?"
                />
              </Field>

              <Field label="Audience / decision it supports" htmlFor="audience">
                <Input
                  id="audience"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="e.g. Exec team deciding on a pilot next quarter"
                />
              </Field>

              <Field
                label="Source material (optional)"
                htmlFor="source"
                hint="Paste an article or report. Findings from it are reported separately from AI interpretation."
              >
                <Textarea
                  id="source"
                  rows={12}
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="Paste the article or document text here…"
                />
              </Field>

              <div className="flex flex-wrap gap-2 pt-1">
                <Button onClick={submit} disabled={busy || !valid}>
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                  )}
                  {busy ? "Generating…" : "Run research"}
                </Button>
                <Button variant="outline" onClick={reset} disabled={busy}>
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Clear
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setQuestion("What should we consider before piloting a four-day work week?");
                    setAudience("Exec team deciding on a 3-month pilot");
                  }}
                  disabled={busy}
                >
                  Load sample question
                </Button>
              </div>
              {!valid && <p className="text-xs text-muted-foreground">Enter a question or paste source material.</p>}
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
              meta={source.trim() ? "Source-grounded" : "General knowledge"}
              emptyHint="Enter a question or paste source material to get a summary, insights and follow-up questions."
              notice="This assistant does not browse the web and will not cite sources it cannot verify. Check important claims, statistics and figures against authoritative sources before relying on them."
            />
          }
        />
      </div>
    </AppShell>
  );
}
