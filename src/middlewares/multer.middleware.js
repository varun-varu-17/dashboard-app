import multer from "multer";

// Save uploaded files to `uploads/` so `req.file.path` is available
export const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});
