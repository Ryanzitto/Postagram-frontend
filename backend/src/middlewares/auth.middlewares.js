import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userService from "../services/user.service.js";

dotenv.config();

export const authMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.send(401);
    }

    const parts = authorization.split(" ");

    const [schema, token] = parts;

    if (parts.length !== 2 || schema !== "Bearer") {
      return res.send(401);
    }

    jwt.verify(token, process.env.SECRET, async (error, decoded) => {
      if (error) {
        return res.status(401).send({ message: "Token has expired" });
      }

      const user = await userService.findByIdService(decoded.id);

      if (!user || !user.id) {
        return res.status(401).send({ message: "Invalid token!" });
      }

      req.userId = user._id;

      return next();
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
