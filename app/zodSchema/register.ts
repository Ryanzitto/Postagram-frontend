import z from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(3).max(30),
    userName: z.string().min(5).max(16),
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
