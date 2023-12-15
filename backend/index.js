// index.js
import express from "express";
import cors from "cors";
import userRoute from "./src/routes/user.route.js";
import authRoute from "./src/routes/auth.route.js";
import newsRoute from "./src/routes/post.route.js";
import pictureRoute from "./src/routes/picture.route.js";
import { connectDB } from "./src/database/db.js";
import dotenv from "dotenv";

import { fileURLToPath } from "url";
import path from "path";

dotenv.config();

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cors());

app.use("/user", userRoute);
app.use("/auth", authRoute);
app.use("/post", newsRoute);
app.use("/picture", pictureRoute);

// Rota estática para servir imagens
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Servidor rodando na porta: ${port}`));
