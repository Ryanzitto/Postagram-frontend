import z from "zod";

export const createBioSchema = z.object({
  bio: z.string().min(1).max(40),
});

export type Bio = z.infer<typeof createBioSchema>;
