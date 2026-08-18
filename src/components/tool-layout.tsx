import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ToolLayout({
  inputTitle,
  inputDescription,
  input,
  output,
}: {
  inputTitle: string;
  inputDescription: string;
  input: ReactNode;
  output: ReactNode;
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card className="h-full shadow-[var(--shadow-card)]">
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="text-base">{inputTitle}</CardTitle>
          <CardDescription>{inputDescription}</CardDescription>
        </CardHeader>
        <CardContent className="pt-5">{input}</CardContent>
      </Card>
      {output}
    </div>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
