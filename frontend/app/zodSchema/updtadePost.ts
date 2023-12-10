import z from "zod";

export const updatePostSchema = z.object({
  title: z.string(),
  text: z.string(),
});

export type User = z.infer<typeof updatePostSchema>;
