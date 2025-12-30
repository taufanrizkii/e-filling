// backend/controllers/penunjang.controller.ts
import { Request, Response, NextFunction } from "express";
import {
  getAllPenunjangService,
  createPenunjangService,
  updatePenunjangFileService,
} from "../services/penunjang.service";
import fs from "fs";
import path from "path";
import { deletePenunjangService } from "../services/penunjang.service";

// 1. GET All
export const getAllPenunjang = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await getAllPenunjangService();
    res.json({
      status: "success",
      data: data,
    });
  } catch (error: any) {
    console.error("❌ Error getAllPenunjang:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// 2. POST Create
export const createPenunjang = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validasi sederhana
    if (!req.body.nama_kegiatan) {
      if (req.file) fs.unlinkSync(req.file.path); 
      res.status(400).json({
        status: "error",
        message: "Nama kegiatan wajib diisi.",
      });
      return;
    }

    const penunjangData = {
      tahun_ajaran: Number(req.body.tahun_ajaran),
      semester: req.body.semester,
      nama_kegiatan: req.body.nama_kegiatan,
      tingkat: req.body.tingkat || "Lokal",
      peran: req.body.peran || "Anggota",
      file_bukti: req.file ? req.file.filename : null,
    };

    const data = await createPenunjangService(penunjangData);

    res.status(201).json({
      status: "success",
      data: data,
      file_uploaded: req.file ? req.file.filename : "Tidak ada file",
    });
  } catch (error: any) {
    console.error("❌ Error createPenunjang:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// 3. PUT Update File
export const updatePenunjang = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    if (!req.file) {
      res.status(400).json({ status: "error", message: "File wajib diupload." });
      return;
    }

    const updatedData = await updatePenunjangFileService(
      id,
      req.file.filename
    );

    if (!updatedData) {
      fs.unlinkSync(req.file.path);
      res.status(404).json({ status: "error", message: "Data tidak ditemukan." });
      return;
    }

    res.json({
      status: "success",
      data: updatedData,
      message: "File berhasil diupdate",
    });
  } catch (error: any) {
    console.error("❌ Error updatePenunjang:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const deletePenunjang = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const filePath = await deletePenunjangService(id);

    // hapus file bukti kalau ada
    if (filePath) {
      const abs = path.join(process.cwd(), "uploads", filePath);
      if (fs.existsSync(abs)) fs.unlinkSync(abs);
    }

    res.json({ status: "success", message: "Data penunjang berhasil dihapus" });
  } catch (error: any) {
    console.error("❌ Error deletePenunjang:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};