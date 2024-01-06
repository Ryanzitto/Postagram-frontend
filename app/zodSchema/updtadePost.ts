import z from "zod";

export const updatePostSchema = z.object({
  title: z
    .string()
    .min(1, { message: "This field cannot contain less than 1 characters" })
    .max(75, { message: "This field cannot contain more than 75 characters" })
    .refine((value) => value.trim() !== "", {
      message: "The Title must not contain only white spaces.",
    }),
  text: z
    .string()
    .min(1, { message: "This field cannot contain less than 1 characters" })
    .max(100, { message: "This field cannot contain more than 100 characters" })
    .refine((value) => value.trim() !== "", {
      message: "The Text must not contain only white spaces.",
    }),
});

export type UpdatePost = z.infer<typeof updatePostSchema>;
