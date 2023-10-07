import express from "express";
import cors from "cors";
import userRoute from "./src/routes/user.route.js";
import { connectDB } from "./src/database/db.js";

connectDB();

const app = express();

app.use(express.json());

app.use(cors());

app.use("/user", userRoute);

const port = 3000;
app.listen(port, () => console.log(`Servidor rodando na porta: ${port}`));
