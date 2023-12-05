import { Router } from "express";

import upload from "../../config/multer.js";

import { create } from "../controllers/pictureController.js";

const router = Router();

router.post("/", upload.single("file"), create);

export default router;
