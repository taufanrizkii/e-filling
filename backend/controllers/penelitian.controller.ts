import { Request, Response } from "express";
import {
  getAllPenelitianService,
  createPenelitianService,
  updatePenelitianFileService,
} from "../services/penelitian.service";
import fs from "fs";
export const getAllPenelitian = async (req: Request, res: Response) => {
  try {
    const data = await getAllPenelitianService();
    res.json({
      status: "success",
      data: data, // Mengirimkan array objek penelitian asli
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// ... kode create dan update lainnya tetap sama ...
// 2. Buat Data Baru
export const createPenelitian = async (req: Request, res: Response) => {
  try {
    const { judul_penelitian, jenis_karya, tahun_terbit, link_publikasi } =
      req.body;

    if (!judul_penelitian) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res
        .status(400)
        .json({ status: "error", message: "Judul wajib diisi" });
    }

    const data = await createPenelitianService({
      judul_penelitian,
      jenis_karya,
      tahun_terbit: Number(tahun_terbit),
      link_publikasi,
      status_penulis: "Penulis Utama", // Otomatis
      file_bukti: req.file ? req.file.filename : null,
    });

    res.status(201).json({ status: "success", data });
  } catch (error: any) {
    console.error("❌ Error createPenelitian:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// 3. Update File
export const updatePenelitian = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!req.file) return res.status(400).json({ message: "File wajib ada" });

    const updated = await updatePenelitianFileService(id, req.file.filename);
    res.json({ status: "success", data: updated });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
