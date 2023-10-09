import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const router = Router();

import {
  getAll,
  create,
  topNews,
  getById,
} from "../controllers/news.controller.js";

router.post("/", authMiddleware, create);
router.get("/", getAll);
router.get("/top", topNews);
router.get("/:id", getById);

export default router;
