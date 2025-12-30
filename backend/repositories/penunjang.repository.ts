// backend/repositories/penunjang.repository.ts
import { pool } from "../configs/database";
import { Penunjang, PenunjangCreateDTO } from "../models/penunjang";

// 1. Ambil Semua Data
export const findAllPenunjang = async (): Promise<Penunjang[]> => {
  const query = "SELECT * FROM penunjang ORDER BY created_at DESC";
  const result = await pool.query(query);
  return result.rows;
};

// 2. Buat Data Baru
export const createPenunjang = async (
  data: PenunjangCreateDTO & { file_bukti?: string | null }
): Promise<Penunjang> => {
  const query = `
      INSERT INTO penunjang (tahun_ajaran, semester, nama_kegiatan, tingkat, peran, status, file_path)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

  const statusAwal = data.file_bukti ? "SUDAH_UPLOAD" : "BELUM_UPLOAD";

  const values = [
    data.tahun_ajaran,
    data.semester,
    data.nama_kegiatan,
    data.tingkat,
    data.peran,
    statusAwal,
    data.file_bukti || null,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

// 3. Update File Bukti
export const updateFilePenunjang = async (
  id: number,
  filename: string
): Promise<Penunjang | null> => {
  const query = `
        UPDATE penunjang 
        SET file_path = $1, status = 'SUDAH_UPLOAD' 
        WHERE id = $2
        RETURNING *;
    `;

  const result = await pool.query(query, [filename, id]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

export const findPenunjangFilePathById = async (id: number): Promise<string | null> => {
  const q = `SELECT file_path FROM penunjang WHERE id = $1`;
  const r = await pool.query(q, [id]);
  if (r.rows.length === 0) return null;
  return r.rows[0].file_path ?? null;
};

export const deletePenunjang = async (id: number): Promise<void> => {
  const q = `DELETE FROM penunjang WHERE id = $1`;
  await pool.query(q, [id]);
};
