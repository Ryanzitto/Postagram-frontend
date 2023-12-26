import z from "zod";

export const updatePostSchema = z.object({
  title: z
    .string()
    .min(1)
    .max(20)
    .refine((value) => value.trim() !== "", {
      message: "The Title must not contain only white spaces.",
    }),
  text: z
    .string()
    .min(1)
    .max(40)
    .refine((value) => value.trim() !== "", {
      message: "The Text must not contain only white spaces.",
    }),
});

export type UpdatePost = z.infer<typeof updatePostSchema>;
