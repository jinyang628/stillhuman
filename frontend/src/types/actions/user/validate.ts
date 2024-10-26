import { z } from "zod";

export const validateRequestSchema = z.object({
  id: z.string(),
  api_key: z.string()
});

export type ValidateRequest = z.infer<typeof validateRequestSchema>;

export const validateResponseSchema = z.object({
  success: z.boolean(),
});

export type ValidateResponse = z.infer<typeof validateResponseSchema>;
