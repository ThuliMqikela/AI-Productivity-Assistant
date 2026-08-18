import { Info } from "lucide-react";

export function ResponsibleAiNotice({ children }: { children?: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2 rounded-lg border border-border bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground">
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>
        {children ??
          "AI-generated content may contain errors or omissions. You remain responsible for reviewing and approving the final output."}
      </span>
    </p>
  );
}
