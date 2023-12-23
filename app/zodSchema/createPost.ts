import z from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1),
  text: z.string().min(1),
  file: typeof FileList !== "undefined" ? z.instanceof(FileList) : z.string(), // Check if FileList is defined
});

export type Post = z.infer<typeof createPostSchema>;
