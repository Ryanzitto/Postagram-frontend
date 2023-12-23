import z from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(3),
    userName: z.string().min(5),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
    file: z.instanceof(File),
  })
  .refine((data) => data.password == data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["password"],
  });

export type Register = z.infer<typeof registerSchema>;
