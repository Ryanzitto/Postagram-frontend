import z from "zod";

export const createBioSchema = z.object({
  bio: z
    .string()
    .min(1)
    .max(40)
    .refine((value) => value.trim() !== "", {
      message: "The Bio must not contain only white spaces.",
    }),
});

export type Bio = z.infer<typeof createBioSchema>;
