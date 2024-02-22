import z from "zod";

export const createPostSchema = z.object({
  subject: z
    .string()
    .min(1, { message: "The subject cannot contain less than 1 characters" })
    .max(40, { message: "The subject  cannot contain more than 40 characters" })
    .refine((value) => value.trim() !== "", {
      message: "The subject must not contain only white spaces.",
    }),
  text: z
    .string()
    .min(1, { message: "This field cannot contain less than 1 characters" })
    .max(100, { message: "This field cannot contain more than 100 characters" })
    .refine((value) => value.trim() !== "", {
      message: "The content must not contain only white spaces.",
    }),
  bgColor: z.string(),
  textColor: z.string(),
});

export type Post = z.infer<typeof createPostSchema>;
