import z from "zod";

export const createCommentSchema = z.object({
  comment: z.string().min(1),
});

export type Comment = z.infer<typeof createCommentSchema>;
