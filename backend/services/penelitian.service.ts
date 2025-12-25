import {
  findAllPenelitian,
  createPenelitian as createRepo,
  updateFilePenelitian,
} from "../repositories/penelitian.repository";

export const getAllPenelitianService = async () => {
  // Ambil data langsung dari database
  const result = await findAllPenelitian();
  // Return apa adanya tanpa mengubah nama field
  return result;
};

export const createPenelitianService = async (data: any) => {
  return await createRepo(data);
};

export const updatePenelitianFileService = async (
  id: number,
  filename: string
) => {
  return await updateFilePenelitian(id, filename);
};
