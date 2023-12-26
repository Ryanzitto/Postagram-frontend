import z from "zod";

export const createCommentSchema = z.object({
  comment: z
    .string()
    .min(1)
    .max(40)
    .refine((value) => value.trim() !== "", {
      message: "The title must not contain only white spaces.",
    }),
});

export type Comment = z.infer<typeof createCommentSchema>;
