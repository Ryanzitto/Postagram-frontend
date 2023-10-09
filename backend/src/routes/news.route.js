import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const router = Router();

import { getAll, create } from "../controllers/news.controller.js";

router.post("/", authMiddleware, create);
router.get("/", getAll);

export default router;
