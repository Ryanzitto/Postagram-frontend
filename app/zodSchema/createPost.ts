import z from "zod";

export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, { message: "This field cannot contain less than 1 characters" })
    .max(75, { message: "This field cannot contain more than 75 characters" })
    .refine((value) => value.trim() !== "", {
      message: "The title must not contain only white spaces.",
    }),
  text: z
    .string()
    .min(1, { message: "This field cannot contain less than 1 characters" })
    .max(100, { message: "This field cannot contain more than 100 characters" })
    .refine((value) => value.trim() !== "", {
      message: "The title must not contain only white spaces.",
    }),
  file: typeof FileList !== "undefined" ? z.instanceof(FileList) : z.string(),
});

export type Post = z.infer<typeof createPostSchema>;
