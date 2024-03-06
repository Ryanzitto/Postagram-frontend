import z from "zod";

export const editProfileSchema = z.object({
  avatar: z.string(),
  userName: z
    .string()
    .min(5, { message: "This field cannot contain less than 5 characters" })
    .max(30, { message: "This field cannot contain more than 30 characters" })
    .refine((value) => value.trim() !== "", {
      message: "The UserName must not contain only white spaces.",
    }),
  bio: z
    .string()
    .min(1)
    .max(40)
    .refine((value) => value.trim() !== "", {
      message: "The Bio must not contain only white spaces.",
    }),
});

export type Bio = z.infer<typeof editProfileSchema>;
