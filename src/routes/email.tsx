import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { Sparkles, Loader2, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ToolLayout, Field } from "@/components/tool-layout";
import { OutputPanel } from "@/components/output-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAiTool } from "@/lib/use-ai-tool";
import { buildUserPrompt } from "@/lib/prompts";
import { usePreferences } from "@/lib/workspace-store";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workplace AI" },
      { name: "description", content: "Generate professional workplace emails with the right tone from a short brief." },
      { property: "og:title", content: "Smart Email Generator" },
      { property: "og:description", content: "Draft professional workplace emails in seconds, fully editable." },
    ],
  }),
  component: EmailPage,
});

const SAMPLE = {
  recipient: "Priya Naidoo, procurement lead at our software vendor",
  purpose: "Request a two-week extension on the contract renewal deadline",
  points: "- Our legal review is still in progress\n- We remain committed to renewing\n- Propose a call next week to align",
  extra: "Keep it under 150 words.",
};

function EmailPage() {
  const { prefs, hydrated } = usePreferences();
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [points, setPoints] = useState("");
  const [tone, setTone] = useState<string>("");
  const [extra, setExtra] = useState("");

  const effectiveTone = tone || (hydrated ? prefs.defaultTone : "Formal");

  const tool = useAiTool("email", () => `Email: ${purpose.slice(0, 48) || "Untitled draft"}`);

  const submit = useCallback(() => {
    void tool.run(
      buildUserPrompt({
        "Recipient / context": recipient,
        "Purpose of the email": purpose,
        "Key points to include": points,
        "Desired tone": effectiveTone,
        "Preferred length": hydrated ? prefs.outputLength : "Balanced",
        "Additional instructions": extra,
      }),
    );
  }, [effectiveTone, extra, hydrated, points, prefs.outputLength, purpose, recipient, tool]);

  const reset = () => {
    setRecipient("");
    setPurpose("");
    setPoints("");
    setExtra("");
    tool.clearOutput();
  };

  const loadSample = () => {
    setRecipient(SAMPLE.recipient);
    setPurpose(SAMPLE.purpose);
    setPoints(SAMPLE.points);
    setExtra(SAMPLE.extra);
  };

  const busy = tool.status === "generating";
  const valid = purpose.trim().length > 0;

  return (
    <AppShell title="Smart Email Generator" description="Brief in, professional email out">
      <div className="mx-auto max-w-6xl">
        <ToolLayout
          inputTitle="Email brief"
          inputDescription="Tell the assistant who it's for and what it must say. It won't invent facts you don't provide."
          input={
            <div className="flex flex-col gap-4">
              <Field label="Recipient / context" htmlFor="recipient">
                <Input
                  id="recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="e.g. My manager, after a missed deadline"
                />
              </Field>

              <Field label="Purpose of the email *" htmlFor="purpose">
                <Input
                  id="purpose"
                  required
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Request a deadline extension"
                />
              </Field>

              <Field label="Key points" htmlFor="points" hint="One per line. Only these facts will be used.">
                <Textarea
                  id="points"
                  rows={5}
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  placeholder={"- Legal review still running\n- Still committed to renewing"}
                />
              </Field>

              <Field label="Tone" htmlFor="tone">
                <Select value={effectiveTone} onValueChange={setTone}>
                  <SelectTrigger id="tone">
                    <SelectValue placeholder="Select a tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Formal">Formal</SelectItem>
                    <SelectItem value="Friendly">Friendly</SelectItem>
                    <SelectItem value="Persuasive">Persuasive</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Additional instructions" htmlFor="extra">
                <Textarea
                  id="extra"
                  rows={2}
                  value={extra}
                  onChange={(e) => setExtra(e.target.value)}
                  placeholder="e.g. Mention I'm on leave Friday"
                />
              </Field>

              <div className="flex flex-wrap gap-2 pt-1">
                <Button onClick={submit} disabled={busy || !valid}>
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                  )}
                  {busy ? "Generating…" : "Generate email"}
                </Button>
                <Button variant="outline" onClick={reset} disabled={busy}>
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Clear
                </Button>
                <Button variant="ghost" onClick={loadSample} disabled={busy}>
                  Load sample brief
                </Button>
              </div>
              {!valid && <p className="text-xs text-muted-foreground">Add a purpose to enable generation.</p>}
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
              meta={`${effectiveTone} tone`}
              emptyHint="Fill in the brief on the left and generate a draft email you can edit before sending."
            />
          }
        />
      </div>
    </AppShell>
  );
}
