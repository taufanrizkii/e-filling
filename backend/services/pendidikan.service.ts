import {
  findAllPendidikan,
  createPendidikan as createRepo,
  updateFilePendidikan,
  deletePendidikan,
  findPendidikanFilePathById,
} from "../repositories/pendidikan.repository";
import { PendidikanItemDTO, PendidikanCreateDTO } from "../models/pendidikan";

// 1. Ambil Semua Data & Format untuk DTO Frontend
export const getAllPendidikanService = async () => {
  const rawData = await findAllPendidikan();

  // Mapping data DB ke format DTO yang siap ditampilkan di tabel Frontend
  return rawData.map((item) => {
    // Logic format Tahun: "2024" menjadi "2024/2025 GANJIL"
    const tahunFull = `${item.tahun_ajaran}/${item.tahun_ajaran + 1} ${
      item.semester
    }`;
    // Logic format Kelas: "Kelas A / 3 SKS"
    const kelasSks = `Kelas ${item.kelas} / ${item.sks} SKS`;

    return new PendidikanItemDTO(
      item.id,
      tahunFull,
      item.mata_kuliah,
      kelasSks,
      item.status,
      item.file_path
    );
  });
};

// 2. Buat Data Baru
export const createPendidikanService = async (data: PendidikanCreateDTO) => {
  return await createRepo(data);
};

// 3. Update File Bukti
export const updatePendidikanFileService = async (
  id: number,
  filename: string
) => {
  return await updateFilePendidikan(id, filename);
};

// 4. Hapus Data
export const deletePendidikanService = async (id: number) => {
  const filePath = await findPendidikanFilePathById(id);
  await deletePendidikan(id);
  return filePath; // Return path agar controller bisa menghapus file fisik
};
