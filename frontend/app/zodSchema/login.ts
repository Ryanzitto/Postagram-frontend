import z from "zod";

export const loginSchema = z.object({
  email: z.string().email().nonempty("Nome é obrigatório"),
  password: z.string().min(8),
});

export type User = z.infer<typeof loginSchema>;
