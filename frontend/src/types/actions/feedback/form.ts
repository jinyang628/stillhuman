import { z } from "zod";

export const feedbackRequestSchema = z.object({
  user_id: z.string(),
  feedback: z.string().min(1, "Feedback is required"),
});

export type FeedbackRequest = z.infer<typeof feedbackRequestSchema>;
