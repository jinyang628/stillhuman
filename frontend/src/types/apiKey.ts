import { z } from "zod";

const apiKeySchema = z.object({
  apiKey: z.string(),
  isValid: z.boolean(),
});

export type ApiKey = z.infer<typeof apiKeySchema>;

export const defaultApiKeySchema = apiKeySchema.parse({
  apiKey: "",
  isValid: false,
});
