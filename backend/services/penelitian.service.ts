import {
  findAllPenelitian,
  createPenelitian as createRepo,
  updateFilePenelitian,
  deletePenelitian,
  findPenelitianFilePathById,
} from "../repositories/penelitian.repository";

// 1. Ambil Semua Data
export const getAllPenelitianService = async () => {
  // Mengambil data mentah dari database agar field 'judul_penelitian' dan 'tahun_terbit' tetap utuh
  const result = await findAllPenelitian();
  return result;
};

// 2. Buat Data Baru
export const createPenelitianService = async (data: any) => {
  // Meneruskan data dari controller ke repository
  return await createRepo(data);
};

// 3. Update File Bukti (Upload Susulan)
export const updatePenelitianFileService = async (
  id: number,
  filename: string
) => {
  return await updateFilePenelitian(id, filename);
};


export const deletePenelitianService = async (id: number) => {
  const filePath = await findPenelitianFilePathById(id);
  await deletePenelitian(id);
  return filePath;
};

