import z from "zod";

export const createBioSchema = z.object({
  bio: z.string().min(1),
});

export type User = z.infer<typeof createBioSchema>;
