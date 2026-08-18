import { streamText, type ModelMessage } from "ai";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import { SYSTEM_PROMPTS, REFINEMENTS, type ToolId } from "./prompts";

const MODEL = "google/gemini-3.6-flash";

class AiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

function friendly(err: unknown): never {
  const status = (err as { statusCode?: number; status?: number })?.statusCode ?? (err as AiError)?.status;
  if (status === 429) {
    throw new Error("The assistant is receiving a lot of requests right now. Please wait a moment and try again.");
  }
  if (status === 402) {
    throw new Error("AI credits for this workspace have run out. Add credits in Lovable to continue generating.");
  }
  if (status === 403) {
    throw new Error("AI access is currently blocked for this workspace. Please check the workspace AI settings.");
  }
  if (status === 401) {
    throw new Error("The AI service is not configured correctly. Please contact the app administrator.");
  }
  console.error("AI generation failed", err);
  throw new Error("Something went wrong while processing your request. Please try again.");
}

function gateway() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new AiError("missing key", 401);
  return createLovableAiGatewayProvider(key);
}

export async function runGeneration(tool: ToolId, prompt: string, refine?: string) {
  try {
    const refinement = refine ? REFINEMENTS[refine] : undefined;
    const system = SYSTEM_PROMPTS[tool];
    const result = streamText({
      model: gateway()(MODEL),
      system,
      prompt: refinement ? `${refinement}\n\n---\n${prompt}` : prompt,
    });
    const text = await result.text;
    if (!text || !text.trim()) {
      throw new Error("The assistant returned an empty response. Please try again.");
    }
    return { text };
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("The assistant returned")) throw err;
    return friendly(err);
  }
}

export async function runChat(messages: Array<{ role: "user" | "assistant"; content: string }>) {
  try {
    const result = streamText({
      model: gateway()(MODEL),
      system: SYSTEM_PROMPTS.chat,
      messages: messages as ModelMessage[],
    });
    const text = await result.text;
    return { text: text?.trim() || "I couldn't produce a reply just then — could you rephrase that?" };
  } catch (err) {
    return friendly(err);
  }
}
