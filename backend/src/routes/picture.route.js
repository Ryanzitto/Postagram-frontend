import { Router } from "express";

import upload from "../../config/multer.js";

import { create, findAll, remove } from "../controllers/pictureController.js";

const router = Router();

router.delete("/:id", remove);

router.post("/", upload.single("file"), create);

router.get("/", findAll);

export default router;
