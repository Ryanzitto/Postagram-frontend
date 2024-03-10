import z from "zod";

export const editProfileSchema = z.object({
  avatar: z.string(),
  bio: z
    .string()
    .min(1, { message: "Bio cannot contain less than 5 characters" })
    .max(40)
    .refine((value) => value.trim() !== "", {
      message: "The Bio must not contain only white spaces.",
    }),
});

export type Bio = z.infer<typeof editProfileSchema>;
