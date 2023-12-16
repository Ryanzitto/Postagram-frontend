import { Router } from "express";
const router = Router();

import upload from "../../config/multer.js";
import userController from "../controllers/user.controller.js";

import { validId, validUser } from "../middlewares/global.middlewares.js";

router.post("/", upload.single("file"), userController.create);

router.get("/", userController.findAll);

router.get("/:userName", userController.findByUserName);

router.get("/:id", validId, validUser, userController.findById);

router.put(
  "/:id",
  upload.single("file"),
  validId,
  validUser,
  userController.update
);

export default router;
