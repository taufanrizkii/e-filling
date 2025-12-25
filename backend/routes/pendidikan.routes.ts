import { Router } from "express";
<<<<<<< HEAD
import {
  getAllPendidikan,
  createPendidikan,
  updatePendidikan,
} from "../controllers/pendidikan.controller";
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
router.get("/pendidikan", getAllPendidikan);
router.post("/pendidikan", upload.single("file_bukti"), createPendidikan);

// Route BARU untuk Update File (PUT)
router.put("/pendidikan/:id", upload.single("file_bukti"), updatePendidikan);
=======
import { PendidikanController } from "../controllers/pendidikan.controller";
//import { body } from "express-validator";
//import { validate } from '../middleware/validator';

const router = Router();
const pendidikanController = new PendidikanController();

router.get("/pendidikan/all", pendidikanController.getAll);
// router.get('/:id', exampleController.getById);
router.post("/pendidikan", pendidikanController.create);
// router.put('/:id', validate(createExampleValidation), exampleController.update);
// router.delete('/:id', exampleController.delete);
>>>>>>> 344a74ec6b47e0a460a433c76d0fa4877e48294c

export default router;
