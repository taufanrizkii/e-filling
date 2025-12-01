import { PendidikanRepository } from "../repositories/pendidikan.repository";
import {
  PendidikanItemDTO,
  PendidikanCreateDTO,
  Pendidikan,
} from "../models/pendidikan";
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
