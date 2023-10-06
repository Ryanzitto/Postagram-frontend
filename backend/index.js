const express = require("express");
const cors = require("cors");
const userRoute = require("./src/routes/user.route");
const connectDB = require("./src/database/db");

connectDB();

const app = express();

app.use(express.json());

app.use(cors());

app.use("/user", userRoute);

const port = 3000;
app.listen(port, () => console.log(`Servidor rodando na porta: ${port}`));
