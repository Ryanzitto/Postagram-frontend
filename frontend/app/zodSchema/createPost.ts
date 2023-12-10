import z from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1),
  text: z.string().min(1),
  file: z.unknown(), // Tipo desconhecido, aceitará qualquer coisa inicialmente
});

export type User = z.infer<typeof createPostSchema>;
