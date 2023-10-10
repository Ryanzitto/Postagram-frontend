import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const router = Router();

import {
  getAll,
  create,
  topNews,
  getById,
  searchByTitle,
  searchByUser,
  update,
  deleteNews,
  like,
} from "../controllers/news.controller.js";

router.post("/", authMiddleware, create);
router.get("/", getAll);
router.get("/top", topNews);
router.get("/search", searchByTitle);
router.get("/byUser", authMiddleware, searchByUser);
router.get("/:id", authMiddleware, getById);
router.patch("/:id", authMiddleware, update);
router.delete("/:id", authMiddleware, deleteNews);
router.patch("/like/:id", authMiddleware, like);

export default router;
