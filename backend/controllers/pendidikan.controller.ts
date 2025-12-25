import { Request, Response, NextFunction } from "express";
import {
  getAllPendidikanService,
  createPendidikanService,
  updatePendidikanFileService,
} from "../services/pendidikan.service";
import fs from "fs";

// 1. Handler GET
export const getAllPendidikan = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await getAllPendidikanService();
    res.json({
      status: "success",
      data: data,
    });
  } catch (error: any) {
    console.error("❌ Error getAllPendidikan:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// 2. Handler POST (Create)
export const createPendidikan = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validasi sederhana
    if (!req.body.mata_kuliah || !req.body.sks) {
      if (req.file) fs.unlinkSync(req.file.path); // Hapus file jika validasi gagal
      res
        .status(400)
        .json({ status: "error", message: "Mata kuliah dan SKS wajib diisi." });
      return;
    }

    const pendidikanData = {
      tahun_ajaran: Number(req.body.tahun_ajaran),
      semester: req.body.semester,
      mata_kuliah: req.body.mata_kuliah,
      kelas: req.body.kelas,
      sks: Number(req.body.sks),
      file_bukti: req.file ? req.file.filename : null,
    };

    const data = await createPendidikanService(pendidikanData);

    res.status(201).json({
      status: "success",
      data: data,
      file_uploaded: req.file ? req.file.filename : "Tidak ada file",
    });
  } catch (error: any) {
    console.error("❌ Error createPendidikan:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// 3. Handler PUT (Update File)
export const updatePendidikan = async (
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

    const updatedData = await updatePendidikanFileService(
      id,
      req.file.filename
    );

    if (!updatedData) {
      fs.unlinkSync(req.file.path);
      res
        .status(404)
        .json({ status: "error", message: "Data tidak ditemukan." });
      return;
    }

    res.json({
      status: "success",
      data: updatedData,
      message: "File berhasil diupdate",
    });
  } catch (error: any) {
    console.error("❌ Error updatePendidikan:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};
