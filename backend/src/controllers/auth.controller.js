import bcrypt from "bcrypt";
import { loginService, generateToken } from "../services/auth.service.js";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await loginService(email);

    if (!user) {
      return res.status(404).send({ message: "User or Password invalid" });
    }

    const isPasswordIsValid = await bcrypt.compare(password, user.password);

    if (!isPasswordIsValid) {
      return res.status(400).send({ message: "User or Password invalid" });
    }

    const token = generateToken(user.id);

    res.send({ user, token });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export { login };
