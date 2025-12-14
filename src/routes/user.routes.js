import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { uploadProfileImage, removeProfileImage } from "../controllers/user.controller.js";

const router = Router();

router.post(
  "/upload-profile",
  authMiddleware,
  upload.single("profile"),
  uploadProfileImage
);

router.delete("/remove-profile", authMiddleware, removeProfileImage);

export default router;
