import {
  findAllPendidikan,
  createPendidikan as createPendidikanRepo,
  updateFilePendidikan,
} from "../repositories/pendidikan.repository";
import {
  PendidikanItemDTO,
  PendidikanCreateDTO,
  Pendidikan,
} from "../models/pendidikan";

// 1. Service untuk Mengambil Semua Data
export const getAllPendidikanService = async (): Promise<
  PendidikanItemDTO[]
> => {
  const result = await findAllPendidikan();

  return result.map((pendidikan) => {
    // Format: "2024/2025 GANJIL"
    const tahunSemester = `${pendidikan.tahun_ajaran}/${
      pendidikan.tahun_ajaran + 1
    } ${pendidikan.semester}`;
    // Format: "Kelas A / 3 SKS"
    const kelasSks = `Kelas ${pendidikan.kelas} / ${pendidikan.sks} SKS`;

    return new PendidikanItemDTO(
      pendidikan.id,
      tahunSemester,
      pendidikan.mata_kuliah,
      kelasSks,
      pendidikan.status,
      pendidikan.file_path
    );
  });
};

// 2. Service untuk Membuat Data
export const createPendidikanService = async (
  data: PendidikanCreateDTO
): Promise<Pendidikan> => {
  return await createPendidikanRepo(data);
};

// 3. Service untuk Update File
export const updatePendidikanFileService = async (
  id: number,
  filename: string
): Promise<Pendidikan | null> => {
  return await updateFilePendidikan(id, filename);
};
