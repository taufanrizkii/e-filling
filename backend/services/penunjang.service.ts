// backend/services/penunjang.service.ts
import {
  findAllPenunjang,
  createPenunjang as createPenunjangRepo,
  updateFilePenunjang,
  deletePenunjang,                 
  findPenunjangFilePathById,  
} from "../repositories/penunjang.repository";
import {
  PenunjangItemDTO,
  PenunjangCreateDTO,
  Penunjang,
} from "../models/penunjang";


// 1. Service Get All (Format Data untuk FE)
export const getAllPenunjangService = async (): Promise<
  PenunjangItemDTO[]
> => {
  const result = await findAllPenunjang();

  return result.map((item) => {
    // Format: "2024/2025 GANJIL"
    const tahunSemester = `${item.tahun_ajaran}/${
      item.tahun_ajaran + 1
    } ${item.semester}`;
    
    // Format Detail: "Nasional (Ketua)"
    const detail = `${item.tingkat} (${item.peran})`;

    return new PenunjangItemDTO(
      item.id,
      tahunSemester,
      item.nama_kegiatan,
      detail,
      item.status,
      item.file_path
    );
  });
};

// 2. Service Create
export const createPenunjangService = async (
  data: PenunjangCreateDTO
): Promise<Penunjang> => {
  return await createPenunjangRepo(data);
};

// 3. Service Update File
export const updatePenunjangFileService = async (
  id: number,
  filename: string
): Promise<Penunjang | null> => {
  return await updateFilePenunjang(id, filename);
};

export const deletePenunjangService = async (id: number) => {
  const filePath = await findPenunjangFilePathById(id);
  await deletePenunjang(id);
  return filePath;
};