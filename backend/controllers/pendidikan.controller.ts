import { Request, Response } from "express";
import {
  getAllPendidikanService,
  createPendidikanService,
  updatePendidikanFileService,
  deletePendidikanService,
} from "../services/pendidikan.service";
import fs from "fs";
import path from "path";

// 1. Ambil Semua Data
export const getAllPendidikan = async (req: Request, res: Response) => {
  try {
    const data = await getAllPendidikanService();
    res.json({
      status: "success",
      data: data,
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// 2. Buat Data Baru
export const createPendidikan = async (req: Request, res: Response) => {
  try {
    const { tahun_ajaran, semester, mata_kuliah, kelas, sks } = req.body;

    // Validasi input sederhana
    if (!mata_kuliah || !sks) {
      // Hapus file yang terlanjur terupload jika validasi gagal
      if (req.file) fs.unlinkSync(req.file.path);
      return res
        .status(400)
        .json({
          status: "error",
          message: "Data Mata Kuliah dan SKS wajib diisi",
        });
    }

    const data = await createPendidikanService({
      tahun_ajaran: Number(tahun_ajaran),
      semester,
      mata_kuliah,
      kelas,
      sks: Number(sks),
      file_bukti: req.file ? req.file.filename : null,
    });

    res.status(201).json({ status: "success", data });
  } catch (error: any) {
    if (req.file) fs.unlinkSync(req.file.path);
    console.error("❌ Error createPendidikan:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// 3. Update File (Upload Susulan)
export const updatePendidikan = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!req.file) return res.status(400).json({ message: "File wajib ada" });

    const updated = await updatePendidikanFileService(id, req.file.filename);
    res.json({ status: "success", data: updated });
  } catch (error: any) {
    // Hapus file jika update DB gagal
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// 4. Hapus Data
export const deletePendidikan = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    // Hapus data di DB dan dapatkan nama file
    const filePath = await deletePendidikanService(id);

    // Hapus file fisik di folder uploads jika ada
    if (filePath) {
      const absPath = path.join(process.cwd(), "uploads", filePath);
      if (fs.existsSync(absPath)) {
        fs.unlinkSync(absPath);
      }
    }

    res.json({
      status: "success",
      message: "Data pendidikan berhasil dihapus",
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
