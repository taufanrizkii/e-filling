import {
  findAllPenelitian,
  createPenelitian as createPenelitianRepo,
  updateFilePenelitian,
} from "../repositories/penelitian.repository";
import {
  PenelitianItemDTO,
  PenelitianCreateDTO,
  Penelitian,
} from "../models/penelitian";

export const getAllPenelitianService = async (): Promise<
  PenelitianItemDTO[]
> => {
  const result = await findAllPenelitian();

  return result.map((p) => {
    // Format string detail: "Jurnal Teknologi (2024)"
    const detail = `${p.jenis_karya} - ${p.nama_jurnal} (${p.tahun_terbit})`;

    return new PenelitianItemDTO(
      p.id,
      p.judul_penelitian,
      detail,
      p.status_penulis,
      p.status,
      p.file_path
    );
  });
};

export const createPenelitianService = async (
  data: PenelitianCreateDTO
): Promise<Penelitian> => {
  return await createPenelitianRepo(data);
};

export const updatePenelitianFileService = async (
  id: number,
  filename: string
): Promise<Penelitian | null> => {
  return await updateFilePenelitian(id, filename);
};
