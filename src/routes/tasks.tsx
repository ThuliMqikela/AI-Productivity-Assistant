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

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Workplace AI" },
      {
        name: "description",
        content: "Prioritise your tasks and get a realistic daily or weekly schedule with conflicts flagged.",
      },
      { property: "og:title", content: "AI Task Planner" },
      { property: "og:description", content: "Turn a task list into a prioritised, realistic plan you can edit." },
    ],
  }),
  component: TasksPage,
});

const SAMPLE_TASKS = `- Finish Q3 budget spreadsheet (due Thursday, ~3h)
- Review 4 design pull requests (~1h)
- Prepare client presentation for Friday (~4h, high priority)
- Write onboarding docs (no deadline, ~2h)
- Weekly 1:1s (Wed 10:00-12:00, fixed)
- Respond to vendor contract email (15 min, urgent)`;

function TasksPage() {
  const [tasks, setTasks] = useState("");
  const [horizon, setHorizon] = useState("Daily plan");
  const [availability, setAvailability] = useState("");
  const [constraints, setConstraints] = useState("");

  const tool = useAiTool("tasks", () => `Plan: ${horizon}`);

  const submit = useCallback(() => {
    void tool.run(
      buildUserPrompt({
        "Planning horizon": horizon,
        "Tasks (with any deadlines, durations, priorities)": tasks,
        "Workday availability": availability,
        "Additional constraints": constraints,
      }),
    );
  }, [availability, constraints, horizon, tasks, tool]);

  const reset = () => {
    setTasks("");
    setAvailability("");
    setConstraints("");
    tool.clearOutput();
  };

  const busy = tool.status === "generating";
  const valid = tasks.trim().length > 5;

  return (
    <AppShell title="AI Task Planner" description="Prioritised, realistic scheduling">
      <div className="mx-auto max-w-6xl">
        <ToolLayout
          inputTitle="Your workload"
          inputDescription="List tasks with any deadlines, durations or priorities. Anything missing stays 'Not specified'."
          input={
            <div className="flex flex-col gap-4">
              <Field label="Planning horizon" htmlFor="horizon">
                <Select value={horizon} onValueChange={setHorizon}>
                  <SelectTrigger id="horizon">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily plan">Daily plan</SelectItem>
                    <SelectItem value="Weekly plan">Weekly plan</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Tasks *" htmlFor="tasks" hint="One per line. Add (due …) or (~2h) where you know it.">
                <Textarea
                  id="tasks"
                  rows={10}
                  required
                  value={tasks}
                  onChange={(e) => setTasks(e.target.value)}
                  placeholder={"- Finish budget sheet (due Thu, ~3h)\n- Review PRs (~1h)"}
                />
              </Field>

              <Field label="Workday availability" htmlFor="availability">
                <Input
                  id="availability"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  placeholder="e.g. 09:00–17:00, lunch 13:00, Wed mornings blocked"
                />
              </Field>

              <Field label="Additional constraints" htmlFor="constraints">
                <Textarea
                  id="constraints"
                  rows={2}
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                  placeholder="e.g. Deep work only in the morning; no meetings after 16:00"
                />
              </Field>

              <div className="flex flex-wrap gap-2 pt-1">
                <Button onClick={submit} disabled={busy || !valid}>
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                  )}
                  {busy ? "Generating…" : "Generate plan"}
                </Button>
                <Button variant="outline" onClick={reset} disabled={busy}>
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Clear
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setTasks(SAMPLE_TASKS);
                    setAvailability("09:00–17:00, lunch 12:30–13:00");
                    setConstraints("Deep work best before noon.");
                  }}
                  disabled={busy}
                >
                  Load sample tasks
                </Button>
              </div>
              {!valid && <p className="text-xs text-muted-foreground">Add at least one task to enable planning.</p>}
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
              meta={horizon}
              emptyHint="Add your tasks on the left to get a prioritised list and a suggested schedule."
              notice="This plan is a suggestion, not a guaranteed-optimal schedule. Review it against your real commitments and adjust before committing."
            />
          }
        />
      </div>
    </AppShell>
  );
}
