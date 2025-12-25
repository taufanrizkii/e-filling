import { Router } from "express";
import {
  getAllPenelitian,
  createPenelitian,
  updatePenelitian,
} from "../controllers/penelitian.controller";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// --- Konfigurasi Multer ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
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
router.get("/penelitian", getAllPenelitian);
router.post("/penelitian", upload.single("file_bukti"), createPenelitian);
router.put("/penelitian/:id", upload.single("file_bukti"), updatePenelitian);

export default router;
