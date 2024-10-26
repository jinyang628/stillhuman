import { z } from "zod";

export const apiKeySchema = z.object({
  apiKey: z.string(),
  isValid: z.boolean(),
});

export type ApiKey = z.infer<typeof apiKeySchema>;

export const defaultApiKeyState = apiKeySchema.parse({
  apiKey: "",
  isValid: false,
});
