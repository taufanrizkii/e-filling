import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import {
  getAllPengabdianService,
  createPengabdianService,
  updatePengabdianFileService,
  deletePengabdianService,
} from "../services/pengabdian.service";

export const getAllPengabdian = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await getAllPengabdianService();
    res.json({ status: "success", data });
  } catch (error: any) {
    console.error("❌ Error getAllPengabdian:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const createPengabdian = async (req: Request, res: Response) => {
  try {
    if (!req.body.nama_kegiatan || !req.body.lokasi_pelaksanaan || !req.body.tanggal_pelaksanaan) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        status: "error",
        message: "Nama kegiatan, lokasi pelaksanaan, dan tanggal pelaksanaan wajib diisi.",
      });
    }

    const filePath = req.file ? req.file.filename : null;

    const payload = {
      nama_kegiatan: req.body.nama_kegiatan,
      lokasi_pelaksanaan: req.body.lokasi_pelaksanaan,
      tanggal_pelaksanaan: req.body.tanggal_pelaksanaan,
      sumber_dana: req.body.sumber_dana || null,
      file_path: filePath,
      status: filePath ? "SUDAH_UPLOAD" : "BELUM_UPLOAD",
    };

    const data = await createPengabdianService(payload);

    return res.status(201).json({
      status: "success",
      data,
      file_uploaded: filePath,
    });
  } catch (error: any) {
    console.error("❌ Error createPengabdian:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
};


export const updatePengabdian = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    if (!req.file) {
      res
        .status(400)
        .json({ status: "error", message: "File wajib diupload." });
      return;
    }

    const updatedData = await updatePengabdianFileService(id, req.file.filename);

    if (!updatedData) {
      res.status(404).json({ status: "error", message: "Data tidak ditemukan." });
      return;
    }

    res.json({
      status: "success",
      data: updatedData,
      message: "File berhasil diupdate",
    });
  } catch (error: any) {
    console.error("❌ Error updatePengabdian:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const deletePengabdianController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const filePath = await deletePengabdianService(id);

    // hapus file bukti kalau ada
    if (filePath) {
      const abs = path.join(process.cwd(), "uploads", filePath);
      if (fs.existsSync(abs)) fs.unlinkSync(abs);
    }

    res.json({ status: "success", message: "Data pengabdian berhasil dihapus" });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
