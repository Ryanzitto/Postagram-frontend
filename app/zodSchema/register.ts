import z from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(3)
      .max(30)
      .refine((value) => value.trim() !== "", {
        message: "The Name must not contain only white spaces.",
      }),
    userName: z
      .string()
      .min(5)
      .max(16)
      .refine((value) => value.trim() !== "", {
        message: "The UserName must not contain only white spaces.",
      }),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
    file: typeof FileList !== "undefined" ? z.instanceof(FileList) : z.string(), // Check if FileList is defined
  })
  .refine((data) => data.password == data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["password"],
  });

export type Register = z.infer<typeof registerSchema>;
