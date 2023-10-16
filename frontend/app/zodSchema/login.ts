import z from "zod";

export const loginSchema = z.object({
  email: z.string().email().nonempty("Nome é obrigatório"),
  password: z.string().min(8),
});

export type User = z.infer<typeof loginSchema>;

// name
// "Ryan Henrique"
// userName
// "Ryanzitto"
// email
// "Ryanzitto@gmail.com"
// password
// "$2b$10$AFVGAk5gY8mzgufbhjUTDej6vpXN7EtRmv9U4Xc8pYAto/p75QOqa"
// avatar
// "https://avatars.githubusercontent.com/u/96020507?v=4"
// __v
// 0
// bio
// "Software developer 💻 - Skater 🛹 - Gorilla soul 🦍"

// name
// "Alice Benni"
// userName
// "AllieBenni"
// email
// "AllieBenni@gmail.com"
// password
// "$2b$10$quqpbcIDPXKyMQw8A3vALuzlmowNBOEIdOegFR8KciGwmhWIyzZka"
// avatar
// "https://burst.shopifycdn.com/photos/woman-side-profile-looking-up.jpg?…"
// __v
// 0
// bio
// "Artist, Dancer and CatLover"
