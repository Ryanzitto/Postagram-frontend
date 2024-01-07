import z from "zod";

export const registerSchema = z
  .object({
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
      .max(30, { message: "This field cannot contain more than 30 characters" })
      .refine((value) => value.trim() !== "", {
        message: "The UserName must not contain only white spaces.",
      }),
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "This field cannot contain less than 8 characters" }),
    confirmPassword: z.string(),
    file: typeof FileList !== "undefined" ? z.instanceof(FileList) : z.string(), // Check if FileList is defined
  })
  .refine((data) => data.password == data.confirmPassword, {
    message: "Passwords do not match",
    path: ["password"],
  });

export type Register = z.infer<typeof registerSchema>;
