import { z } from "zod";

export const generateRequestSchema = z.object({
  api_key: z.string(),
  url: z.string(),
});

export type GenerateRequest = z.infer<typeof generateRequestSchema>;

export const generateResponseSchema = z.object({
  success: z.boolean(),
});

export type GenerateResponse = z.infer<typeof generateResponseSchema>;
