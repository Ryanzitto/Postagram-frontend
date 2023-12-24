import z from "zod";

export const updatePostSchema = z.object({
  title: z.string().min(1).max(20),
  text: z.string().min(1).max(40),
});

export type UpdatePost = z.infer<typeof updatePostSchema>;
