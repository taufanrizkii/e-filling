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

export const getAllPendidikanService = async (): Promise<
  PendidikanItemDTO[]
> => {
  const result = await findAllPendidikan();
  return result.map((pendidikan) => {
    const tahunSemester = `${pendidikan.tahun_ajaran}/${
      pendidikan.tahun_ajaran + 1
    } ${pendidikan.semester}`;
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

export const createPendidikanService = async (
  data: PendidikanCreateDTO
): Promise<Pendidikan> => {
  return await createPendidikanRepo(data);
};

export const updatePendidikanFileService = async (
  id: number,
  filename: string
): Promise<Pendidikan | null> => {
  return await updateFilePendidikan(id, filename);
};
