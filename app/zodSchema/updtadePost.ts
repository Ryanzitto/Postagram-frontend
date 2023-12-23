import z from "zod";

export const updatePostSchema = z.object({
  title: z.string().min(1),
  text: z.string().min(1),
});

export type UpdatePost = z.infer<typeof updatePostSchema>;
