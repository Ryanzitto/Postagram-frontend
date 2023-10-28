import z from "zod";

export const createCommentSchema = z.object({
  bio: z.string().min(1),
});

export type User = z.infer<typeof createCommentSchema>;
