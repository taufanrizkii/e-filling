import { Router } from "express";
import {
  getAllPengabdian,
  createPengabdian,
  updatePengabdian,
  deletePengabdianController,
} from "../controllers/pengabdian.controller";
import multer from "multer";
import path from "path";
import fs from "fs";
import { requireAuth } from "../middlewares/auth";

const router = Router();
router.use(requireAuth);


// --- Konfigurasi Multer ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype.startsWith("image/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Hanya diperbolehkan upload file PDF atau Gambar!"));
    }
  },
});

// --- Routes ---
router.get("/pengabdian", getAllPengabdian);
router.post("/pengabdian", upload.single("file_bukti"), createPengabdian);
router.put("/pengabdian/:id", upload.single("file_bukti"), updatePengabdian);
router.delete("/pengabdian/:id", deletePengabdianController);

export default router;
