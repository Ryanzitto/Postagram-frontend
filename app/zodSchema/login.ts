import z from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "This field cannot contain less than 8 characters" }),
});

export type Login = z.infer<typeof loginSchema>;
