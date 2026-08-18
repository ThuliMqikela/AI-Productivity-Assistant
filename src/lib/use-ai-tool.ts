import { useCallback, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateWithAI } from "@/lib/ai.functions";
import { logActivity, type ToolKey } from "@/lib/workspace-store";
import type { OutputStatus } from "@/components/output-panel";

export function useAiTool(tool: ToolKey, activityTitle: () => string) {
  const generate = useServerFn(generateWithAI);
  const [status, setStatus] = useState<OutputStatus>("empty");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const lastPrompt = useRef<string>("");

  const run = useCallback(
    async (prompt: string, refine?: string) => {
      if (status === "generating") return;
      if (!prompt.trim()) {
        setError("Please fill in the required fields before generating.");
        setStatus("error");
        return;
      }
      lastPrompt.current = prompt;
      setStatus("generating");
      setError(null);
      try {
        const res = await generate({ data: { tool, prompt, refine } });
        setOutput(res.text);
        setStatus("generated");
        logActivity({
          tool,
          title: activityTitle(),
          excerpt: res.text.replace(/[#*`|]/g, "").trim().slice(0, 110),
        });
      } catch (err) {
        setError(
          err instanceof Error && err.message
            ? err.message
            : "Something went wrong while processing your request. Please try again.",
        );
        setStatus("error");
      }
    },
    [activityTitle, generate, status, tool],
  );

  const refine = useCallback(
    (key: string) => {
      if (!output.trim()) return;
      void run(output, key);
    },
    [output, run],
  );

  const regenerate = useCallback(() => {
    if (lastPrompt.current) void run(lastPrompt.current);
  }, [run]);

  const clearOutput = useCallback(() => {
    setOutput("");
    setError(null);
    setStatus("empty");
  }, []);

  return { status, output, setOutput, error, run, refine, regenerate, clearOutput };
}
