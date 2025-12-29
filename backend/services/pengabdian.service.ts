import {
  findAllPengabdian,
  createPengabdian as createRepo,
  updateFilePengabdian,
  deletePengabdian,
  findPengabdianFilePathById,
} from "../repositories/pengabdian.repository";
import { PengabdianItemDTO } from "../models/pengabdian";

const toStatusBukti = (status: string): "Belum Upload" | "Sudah Upload" =>
  status === "SUDAH_UPLOAD" ? "Sudah Upload" : "Belum Upload";

export const getAllPengabdianService = async () => {
  const rows = await findAllPengabdian();
  return rows.map(
    (r) =>
      new PengabdianItemDTO(
        r.id,
        r.nama_kegiatan,
        r.lokasi_pelaksanaan,
        // Postgres DATE biasanya sudah 'YYYY-MM-DD'
        String(r.tanggal_pelaksanaan),
        r.sumber_dana ?? "",
        toStatusBukti(r.status),
        r.file_path ?? null
      )
  );
};

export const createPengabdianService = async (data: any) => {
  return await createRepo(data);
};

export const updatePengabdianFileService = async (
  id: number,
  filename: string
) => {
  return await updateFilePengabdian(id, filename);
};

export const deletePengabdianService = async (id: number) => {
  const filePath = await findPengabdianFilePathById(id);
  await deletePengabdian(id);
  return filePath; 
};