import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListChecks, Search, MessagesSquare, ArrowRight, Clock, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DEMO_ACTIVITY, timeAgo, useActivity, usePreferences } from "@/lib/workspace-store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Automate workplace emails, meeting summaries, task plans and research with a structured, review-first AI assistant.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Five AI tools for professionals: email drafting, meeting summaries, task planning, research and chat.",
      },
    ],
  }),
  component: DashboardPage,
});

const TOOLS = [
  {
    to: "/email",
    label: "Smart Email Generator",
    icon: Mail,
    description: "Turn a short brief into a professional email with the right tone and subject line.",
    action: "Draft an email",
    iconClass: "bg-tool-1-soft text-tool-1",
    barClass: "bg-tool-1",
  },
  {
    to: "/meetings",
    label: "Meeting Notes Summarizer",
    icon: FileText,
    description: "Convert messy notes into decisions, action items, owners and open questions.",
    action: "Summarize notes",
    iconClass: "bg-tool-2-soft text-tool-2",
    barClass: "bg-tool-2",
  },
  {
    to: "/tasks",
    label: "AI Task Planner",
    icon: ListChecks,
    description: "Prioritise your workload and get a realistic schedule with conflicts flagged.",
    action: "Plan my day",
    iconClass: "bg-tool-3-soft text-tool-3",
    barClass: "bg-tool-3",
  },
  {
    to: "/research",
    label: "AI Research Assistant",
    icon: Search,
    description: "Summarise a topic or article and separate sourced facts from interpretation.",
    action: "Start research",
    iconClass: "bg-tool-4-soft text-tool-4",
    barClass: "bg-tool-4",
  },
  {
    to: "/chat",
    label: "AI Workplace Chat",
    icon: MessagesSquare,
    description: "Ask anything work-related and keep the context across the conversation.",
    action: "Open chat",
    iconClass: "bg-tool-5-soft text-tool-5",
    barClass: "bg-tool-5",
  },
] as const;

const QUICK_ACTIONS = [
  { to: "/email", label: "Decline a meeting politely" },
  { to: "/meetings", label: "Summarize yesterday's stand-up" },
  { to: "/tasks", label: "Plan a launch week" },
  { to: "/research", label: "Brief me on a competitor" },
] as const;

function DashboardPage() {
  const { items } = useActivity();
  const { prefs, hydrated } = usePreferences();
  const showDemo = hydrated && prefs.showDemoData;
  const activity = items.length > 0 ? items : showDemo ? DEMO_ACTIVITY : [];
  const usingDemo = items.length === 0 && activity.length > 0;

  return (
    <AppShell title="Dashboard" description="Your AI workspace overview">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <section className="relative overflow-hidden rounded-2xl border border-border bg-card bg-[image:var(--gradient-hero)] p-6 shadow-[var(--shadow-card)] md:p-8">
          <Badge variant="secondary" className="mb-3 gap-1.5">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Five AI tools, one workspace
          </Badge>
          <h2 className="text-2xl font-bold md:text-3xl">Work smarter with AI</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
            Automate repetitive workplace tasks, organize information, and turn ideas into actionable outcomes — with
            structured prompts, editable outputs and no invented facts.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/email">
                Draft an email <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/chat">Ask the assistant</Link>
            </Button>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Productivity tools</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {TOOLS.map(({ to, label, icon: Icon, description, action }) => (
              <Card key={to} className="flex h-full flex-col shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-lift)]">
                <CardHeader>
                  <span className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <CardTitle className="text-base">{label}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Button variant="secondary" size="sm" asChild>
                    <Link to={to}>
                      {action} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2 shadow-[var(--shadow-card)]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Recent activity</CardTitle>
                <CardDescription>Your latest generated outputs in this session.</CardDescription>
              </div>
              {usingDemo && <Badge variant="outline">Sample data</Badge>}
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {activity.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border py-10 text-center">
                  <p className="text-sm font-medium">No activity yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">Generate something and it will show up here.</p>
                </div>
              ) : (
                activity.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-1 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{item.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{item.excerpt}</p>
                    </div>
                    <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                      {timeAgo(item.at)}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="text-base">Quick actions</CardTitle>
              <CardDescription>Suggested starting points.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {QUICK_ACTIONS.map((q) => (
                <Button key={q.label} variant="outline" size="sm" className="justify-start" asChild>
                  <Link to={q.to}>{q.label}</Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}
