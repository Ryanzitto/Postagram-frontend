import z from "zod";

export const registerSchema = z
  .object({
    avatar: z.string(),
    name: z
      .string()
      .min(3, { message: "This field cannot contain less than 3 characters" })
      .max(30, { message: "This field cannot contain more than 30 characters" })
      .refine((value) => value.trim() !== "", {
        message: "The Name must not contain only white spaces.",
      }),
    userName: z
      .string()
      .min(5, { message: "This field cannot contain less than 5 characters" })
      .max(20, { message: "This field cannot contain more than 20 characters" })
      .refine((value) => value.trim() !== "", {
        message: "The UserName must not contain only white spaces.",
      })
      .refine((value) => !/\s/.test(value), {
        message: "The UserName must not contain spaces between characters.",
      }),
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "This field cannot contain less than 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password == data.confirmPassword, {
    message: "Passwords do not match",
    path: ["password"],
  });

export type Register = z.infer<typeof registerSchema>;
