import z from "zod";

export const createCommentSchema = z.object({
  comment: z
    .string()
    .min(1, { message: "This field cannot contain less than 1 characters" })
    .max(100, { message: "This field cannot contain more than 100 characters" })
    .refine((value) => value.trim() !== "", {
      message: "The title must not contain only white spaces.",
    }),
});

export type Comment = z.infer<typeof createCommentSchema>;
