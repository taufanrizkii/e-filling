import { Router } from "express";
import {
  getAllPendidikan,
  createPendidikan,
  updatePendidikan,
} from "../controllers/pendidikan.controller";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// --- Konfigurasi Multer (Upload File) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    // Buat folder uploads jika belum ada
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Penamaan file unik: timestamp-random.ext
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit 5MB
  fileFilter: (req, file, cb) => {
    // Validasi tipe file
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

// --- Definisi Routes ---
// GET /api/pendidikan
router.get("/pendidikan", getAllPendidikan);

// POST /api/pendidikan (dengan upload file 'file_bukti')
router.post("/pendidikan", upload.single("file_bukti"), createPendidikan);

// PUT /api/pendidikan/:id (untuk update file susulan)
router.put("/pendidikan/:id", upload.single("file_bukti"), updatePendidikan);

export default router;
