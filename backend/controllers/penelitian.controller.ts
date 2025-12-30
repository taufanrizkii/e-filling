import { Request, Response } from "express";
import {
  getAllPenelitianService,
  createPenelitianService,
  updatePenelitianFileService,
  deletePenelitianService, // Tambahkan import service hapus
} from "../services/penelitian.service";
import fs from "fs";
import path from "path";

// 1. Ambil Semua Data
export const getAllPenelitian = async (req: Request, res: Response) => {
  try {
    const data = await getAllPenelitianService();
    res.json({
      status: "success",
      data: data,
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// 2. Buat Data Baru
export const createPenelitian = async (req: Request, res: Response) => {
  try {
    const { judul_penelitian, jenis_karya, tahun_terbit, link_publikasi } =
      req.body;

    // Validasi input
    if (!judul_penelitian) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res
        .status(400)
        .json({ status: "error", message: "Judul wajib diisi" });
    }

    const data = await createPenelitianService({
      judul_penelitian,
      jenis_karya,
      tahun_terbit: Number(tahun_terbit), // Memastikan menjadi Integer untuk DB
      link_publikasi,
      status_penulis: "Penulis Utama",
      file_bukti: req.file ? req.file.filename : null,
    });

    res.status(201).json({ status: "success", data });
  } catch (error: any) {
    // Menghapus file jika terjadi error saat simpan ke DB
    if (req.file) fs.unlinkSync(req.file.path);
    console.error("❌ Error createPenelitian:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// 3. Update File (Upload Susulan)
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



export const deletePenelitian = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const filePath = await deletePenelitianService(id);

    // ✅ hapus file fisik kalau ada
    if (filePath) {
      const abs = path.join(process.cwd(), "uploads", filePath);
      if (fs.existsSync(abs)) fs.unlinkSync(abs);
    }

    res.json({
      status: "success",
      message: "Data penelitian berhasil dihapus",
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
