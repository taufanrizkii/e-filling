import { Request, Response, NextFunction } from "express";
import {
  getAllPenelitianService,
  createPenelitianService,
  updatePenelitianFileService,
} from "../services/penelitian.service";

// 1. GET ALL
export const getAllPenelitian = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await getAllPenelitianService();
    res.json({ status: "success", data });
  } catch (error: any) {
    console.error("❌ Error getAllPenelitian:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// 2. CREATE (POST)
export const createPenelitian = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validasi input minimal
    if (!req.body.judul_penelitian || !req.body.tahun_terbit) {
      res
        .status(400)
        .json({ status: "error", message: "Judul dan Tahun wajib diisi." });
      return;
    }

    // AUTO-FILL: Status Penulis (Simulasi Login)
    // Di aplikasi nyata, ini diambil dari req.user
    const statusPenulisOtomatis = "Penulis Utama (Otomatis)";

    const penelitianData = {
      judul_penelitian: req.body.judul_penelitian,
      jenis_karya: req.body.jenis_karya,
      nama_jurnal: req.body.nama_jurnal,
      tahun_terbit: Number(req.body.tahun_terbit),
      link_publikasi: req.body.link_publikasi,
      status_penulis: statusPenulisOtomatis, // <--- Diisi Otomatis
      file_bukti: req.file ? req.file.filename : null,
    };

    const data = await createPenelitianService(penelitianData);

    res.status(201).json({
      status: "success",
      data,
      file_uploaded: req.file ? req.file.filename : "Tidak ada",
    });
  } catch (error: any) {
    console.error("❌ Error createPenelitian:", error);
    res
      .status(500)
      .json({ status: "error", message: error.sqlMessage || error.message });
  }
};

// 3. UPDATE FILE (PUT)
export const updatePenelitian = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    if (!req.file) {
      res
        .status(400)
        .json({ status: "error", message: "Tidak ada file yang diupload." });
      return;
    }

    const updatedData = await updatePenelitianFileService(
      id,
      req.file.filename
    );

    if (!updatedData) {
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
    console.error("❌ Error updatePenelitian:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};
