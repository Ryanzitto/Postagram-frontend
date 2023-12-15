import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import upload from "../../config/multer.js";

const router = Router();

import {
  getAll,
  create,
  getById,
  searchByTitle,
  searchByUser,
  searchByUserName,
  update,
  deletePost,
  like,
  comment,
  removeComment,
} from "../controllers/post.controller.js";

router.post("/", authMiddleware, upload.single("file"), create);
router.get("/", getAll);
router.get("/search", searchByTitle);
router.get("/byUser", authMiddleware, searchByUser);
router.get("/byUserName/:userName", searchByUserName);
router.get("/:id", authMiddleware, getById);
router.post("/", authMiddleware, upload.single("file"), create);
router.patch("/:id", authMiddleware, update);
router.delete("/:id", authMiddleware, deletePost);
router.patch("/like/:id", authMiddleware, like);
router.patch("/comment/:id", authMiddleware, comment);
router.patch("/removeComment/:id/:idComment", authMiddleware, removeComment);

export default router;
