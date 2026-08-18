import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ToolSchema = z.enum(["email", "meetings", "tasks", "research", "chat"]);

const GenerateInput = z.object({
  tool: ToolSchema,
  prompt: z.string().min(1).max(20000),
  refine: z.string().max(60).optional(),
});

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(20000),
      }),
    )
    .min(1)
    .max(40),
});

export const generateWithAI = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => GenerateInput.parse(input))
  .handler(async ({ data }) => {
    const { runGeneration } = await import("./ai.server");
    return runGeneration(data.tool, data.prompt, data.refine);
  });

export const chatWithAI = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const { runChat } = await import("./ai.server");
    return runChat(data.messages);
  });
