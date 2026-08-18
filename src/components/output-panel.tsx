import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Copy,
  Check,
  RefreshCw,
  Trash2,
  Loader2,
  AlertTriangle,
  Pencil,
  Eye,
  Wand2,
  Minimize2,
  Briefcase,
  ListChecks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsibleAiNotice } from "@/components/responsible-ai-notice";
import { toast } from "sonner";

export type OutputStatus = "empty" | "generating" | "generated" | "error";

const REFINE_ACTIONS = [
  { key: "improve", label: "Improve output", icon: Wand2 },
  { key: "shorter", label: "Make shorter", icon: Minimize2 },
  { key: "professional", label: "More professional", icon: Briefcase },
  { key: "actions", label: "To action items", icon: ListChecks },
] as const;

export function OutputPanel({
  status,
  value,
  onChange,
  onRegenerate,
  onClear,
  onRefine,
  error,
  emptyHint,
  meta,
  notice,
}: {
  status: OutputStatus;
  value: string;
  onChange: (v: string) => void;
  onRegenerate: () => void;
  onClear: () => void;
  onRefine: (key: string) => void;
  error?: string | null;
  emptyHint: string;
  meta?: string;
  notice?: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const busy = status === "generating";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't copy — select the text and copy manually.");
    }
  };

  const words = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <Card className="flex h-full flex-col shadow-[var(--shadow-card)]">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">Output</CardTitle>
          <StatusBadge status={status} />
        </div>
        {status === "generated" && (
          <div className="flex flex-wrap gap-1.5">
            <Button variant="outline" size="sm" onClick={() => setEditing((e) => !e)}>
              {editing ? <Eye className="h-4 w-4" aria-hidden="true" /> : <Pencil className="h-4 w-4" aria-hidden="true" />}
              {editing ? "Preview" : "Edit"}
            </Button>
            <Button variant="outline" size="sm" onClick={copy}>
              {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={onRegenerate} disabled={busy}>
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Regenerate
            </Button>
            <Button variant="ghost" size="sm" onClick={onClear}>
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Clear
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 pt-5">
        {status === "generating" && (
          <div
            role="status"
            aria-live="polite"
            className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center"
          >
            <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden="true" />
            <p className="text-sm font-medium">Generating your response…</p>
            <p className="max-w-xs text-xs text-muted-foreground">
              Structuring your input with a task-specific prompt. This usually takes a few seconds.
            </p>
          </div>
        )}

        {status === "error" && (
          <div role="alert" className="flex flex-1 flex-col items-center justify-center gap-3 py-14 text-center">
            <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden="true" />
            <p className="text-sm font-semibold">Unable to generate response</p>
            <p className="max-w-sm text-xs text-muted-foreground">
              {error ?? "Something went wrong while processing your request. Please try again."}
            </p>
            <Button size="sm" onClick={onRegenerate} className="mt-1">
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Try again
            </Button>
          </div>
        )}

        {status === "empty" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-16 text-center">
            <p className="text-sm font-medium">Nothing generated yet</p>
            <p className="max-w-xs text-xs text-muted-foreground">{emptyHint}</p>
          </div>
        )}

        {status === "generated" && (
          <>
            {editing ? (
              <>
                <label htmlFor="ai-output-editor" className="sr-only">
                  Edit generated output
                </label>
                <Textarea
                  id="ai-output-editor"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="min-h-80 flex-1 font-mono text-sm leading-relaxed"
                />
              </>
            ) : (
              <div className="prose-ai max-w-none text-sm">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>{words} words</span>
              {meta && <span>· {meta}</span>}
              <span>· Editable draft</span>
            </div>

            <div className="flex flex-wrap gap-1.5 border-t border-border pt-3">
              {REFINE_ACTIONS.map(({ key, label, icon: Icon }) => (
                <Button key={key} variant="secondary" size="sm" onClick={() => onRefine(key)} disabled={busy}>
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {label}
                </Button>
              ))}
            </div>
          </>
        )}

        <div className="mt-auto pt-2">
          <ResponsibleAiNotice>{notice}</ResponsibleAiNotice>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: OutputStatus }) {
  const map: Record<OutputStatus, { label: string; className: string }> = {
    empty: { label: "Empty", className: "bg-muted text-muted-foreground" },
    generating: { label: "Generating", className: "bg-warning/15 text-warning-foreground" },
    generated: { label: "Generated", className: "bg-success/15 text-foreground" },
    error: { label: "Error", className: "bg-destructive/15 text-destructive" },
  };
  const { label, className } = map[status];
  return (
    <Badge variant="secondary" className={className}>
      {label}
    </Badge>
  );
}
