import z from "zod";

export const editProfileSchema = z.object({
  avatar: z.string(),
  userName: z
    .string()
    .min(5, { message: "The userName cannot contain less than 5 characters" })
    .max(20, {
      message: "The userName  cannot contain more than 20 characters",
    })
    .refine((value) => value.trim() !== "", {
      message: "The UserName must not contain only white spaces.",
    })
    .refine((value) => !/\s/.test(value), {
      message: "The UserName must not contain spaces between characters.",
    }),
  bio: z
    .string()
    .min(1, { message: "Bio cannot contain less than 5 characters" })
    .max(40)
    .refine((value) => value.trim() !== "", {
      message: "The Bio must not contain only white spaces.",
    }),
});

export type Bio = z.infer<typeof editProfileSchema>;
