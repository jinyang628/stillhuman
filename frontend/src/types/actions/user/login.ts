import { z } from "zod";

export const loginRequestSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
