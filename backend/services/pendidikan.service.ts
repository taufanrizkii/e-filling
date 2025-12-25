<<<<<<< HEAD
import {
  findAllPendidikan,
  createPendidikan as createPendidikanRepo,
  updateFilePendidikan,
} from "../repositories/pendidikan.repository";
=======
import { PendidikanRepository } from "../repositories/pendidikan.repository";
>>>>>>> 344a74ec6b47e0a460a433c76d0fa4877e48294c
import {
  PendidikanItemDTO,
  PendidikanCreateDTO,
  Pendidikan,
} from "../models/pendidikan";
<<<<<<< HEAD

// 1. Service untuk Mengambil Semua Data & Memformatnya
export const getAllPendidikanService = async (): Promise<
  PendidikanItemDTO[]
> => {
  const result = await findAllPendidikan();

  // Transformasi data mentah dari database ke format DTO untuk frontend
  return result.map((pendidikan) => {
    // Contoh format: "2024/2025 GANJIL"
    const tahunSemester = `${pendidikan.tahun_ajaran}/${
      pendidikan.tahun_ajaran + 1
    } ${pendidikan.semester}`;
    // Contoh format: "Kelas A / 3 SKS"
    const kelasSks = `Kelas ${pendidikan.kelas} / ${pendidikan.sks} SKS`;

    return new PendidikanItemDTO(
      pendidikan.id,
      tahunSemester,
      pendidikan.mata_kuliah,
      kelasSks,
      pendidikan.status,
      pendidikan.file_path // Pastikan field ini ada di DTO dan Model
    );
  });
};

// 2. Service untuk Membuat Data Baru
export const createPendidikanService = async (
  data: PendidikanCreateDTO
): Promise<Pendidikan> => {
  // Di sini bisa ditambahkan logika validasi bisnis tambahan jika perlu
  return await createPendidikanRepo(data);
};

// 3. Service untuk Update File (Upload Susulan)
export const updatePendidikanFileService = async (
  id: number,
  filename: string
): Promise<Pendidikan | null> => {
  // Panggil repository untuk update kolom file_path dan status
  return await updateFilePendidikan(id, filename);
};
=======
// import { Result } from "pg";
// import { stat } from "fs";

export class PendidikanService {
  private pendidikanRepository: PendidikanRepository;

  constructor() {
    this.pendidikanRepository = new PendidikanRepository();
  }

  async getAll(): Promise<PendidikanItemDTO[]> {
    const result = await this.pendidikanRepository.findAll();
    return result.map(
      (pendidikan) =>
        new PendidikanItemDTO(
          pendidikan.id,
          pendidikan.tahun_ajaran.toString() +
            "/" +
            (pendidikan.tahun_ajaran + 1).toString() +
            " " +
            pendidikan.semester,
          pendidikan.mata_kuliah,
          pendidikan.kelas + "/" + pendidikan.sks.toString() + "SKS",
          pendidikan.status
        )
    );
  }

  //   async getById(id: number): Promise<Example | null> {
  //     return await this.exampleRepository.findById(id);
  //   }

  async create(data: PendidikanCreateDTO): Promise<Pendidikan> {
    return await this.pendidikanRepository.create(data);
  }

  //   async update(id: number, data: UpdateExampleDTO): Promise<Example | null> {
  //     return await this.exampleRepository.update(id, data);
  //   }

  //   async delete(id: number): Promise<void> {
  //     await this.exampleRepository.delete(id);
  //   }
}
>>>>>>> 344a74ec6b47e0a460a433c76d0fa4877e48294c
