import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field } from "@/components/tool-layout";
import { usePreferences, type Preferences } from "@/lib/workspace-store";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Workplace AI" },
      { name: "description", content: "Set your default email tone, output length and AI response preferences." },
      { property: "og:title", content: "Settings — Workplace AI" },
      { property: "og:description", content: "Personalise tone, length and responsible-AI behaviour." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { prefs, update, reset, hydrated } = usePreferences();

  return (
    <AppShell title="Settings" description="Preferences and responsible AI information">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="text-base">User preferences</CardTitle>
            <CardDescription>Applied as defaults across the AI tools.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <Field label="Display name" htmlFor="name">
              <Input
                id="name"
                value={hydrated ? prefs.name : ""}
                onChange={(e) => update({ name: e.target.value })}
                placeholder="Your name"
              />
            </Field>

            <Field label="Default email tone" htmlFor="tone-pref">
              <Select
                value={prefs.defaultTone}
                onValueChange={(v) => update({ defaultTone: v as Preferences["defaultTone"] })}
              >
                <SelectTrigger id="tone-pref">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Formal">Formal</SelectItem>
                  <SelectItem value="Friendly">Friendly</SelectItem>
                  <SelectItem value="Persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Default output length" htmlFor="length-pref">
              <Select
                value={prefs.outputLength}
                onValueChange={(v) => update({ outputLength: v as Preferences["outputLength"] })}
              >
                <SelectTrigger id="length-pref">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Concise">Concise</SelectItem>
                  <SelectItem value="Balanced">Balanced</SelectItem>
                  <SelectItem value="Detailed">Detailed</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-3">
              <label htmlFor="clarify" className="text-sm">
                <span className="font-medium">Ask for missing information</span>
                <span className="block text-xs text-muted-foreground">
                  The assistant asks a short question instead of guessing details.
                </span>
              </label>
              <Switch
                id="clarify"
                checked={prefs.askClarifying}
                onCheckedChange={(v) => update({ askClarifying: v })}
              />
            </div>

            <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-3">
              <label htmlFor="demo" className="text-sm">
                <span className="font-medium">Show sample content</span>
                <span className="block text-xs text-muted-foreground">
                  Display clearly-labelled demo activity when you have none yet.
                </span>
              </label>
              <Switch id="demo" checked={prefs.showDemoData} onCheckedChange={(v) => update({ showDemoData: v })} />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Responsible AI
            </CardTitle>
            <CardDescription>How this assistant is designed to behave.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
            <p>
              Every tool uses a task-specific structured prompt that forbids inventing names, dates, statistics,
              deadlines, decisions, sources or commitments. Missing information is labelled “Not specified”.
            </p>
            <p>
              AI-generated content may still contain errors or omissions. Review important information before using it
              for workplace, business, legal, financial or other consequential decisions. The assistant does not replace
              professional judgment, and outputs are never guaranteed accurate or optimal.
            </p>
            <p>Your AI credentials are handled server-side and are never exposed to the browser.</p>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="text-base">Local data</CardTitle>
            <CardDescription>Preferences and recent activity are stored in this browser only.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={() => {
                reset();
                toast.success("Local preferences and activity cleared");
              }}
            >
              Clear local data
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
