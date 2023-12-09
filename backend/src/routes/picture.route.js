import { Router } from "express";

import upload from "../../config/multer.js";

import {
  findAll,
  remove,
  getPictureById,
} from "../controllers/pictureController.js";

const router = Router();

router.delete("/:id", remove);

// router.post("/", upload.single("file"), create);

router.get("/", findAll);

router.get("/:id", getPictureById);

export default router;
