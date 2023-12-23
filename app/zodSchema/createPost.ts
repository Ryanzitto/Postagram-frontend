import z from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1),
  text: z.string().min(1),
  file: z.instanceof(FileList),
});

export type User = z.infer<typeof createPostSchema>;
