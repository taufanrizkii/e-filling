import { pool } from "../configs/database";
import { Pendidikan, PendidikanCreateDTO } from "../models/pendidikan";

// 1. Ambil Semua Data
export const findAllPendidikan = async (): Promise<Pendidikan[]> => {
  const query = "SELECT * FROM pendidikan ORDER BY created_at DESC";
  const result = await pool.query(query);
  return result.rows;
};

// 2. Buat Data Baru
export const createPendidikan = async (
  data: PendidikanCreateDTO & { file_bukti?: string | null }
): Promise<Pendidikan> => {
  const query = `
      INSERT INTO pendidikan (tahun_ajaran, semester, mata_kuliah, kelas, sks, status, file_path)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

  const statusAwal = data.file_bukti ? "SUDAH_UPLOAD" : "BELUM_UPLOAD";

  const values = [
    data.tahun_ajaran,
    data.semester,
    data.mata_kuliah,
    data.kelas,
    data.sks,
    statusAwal,
    data.file_bukti || null,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

// 3. Update File Bukti (Upload Susulan)
export const updateFilePendidikan = async (
  id: number,
  filename: string
): Promise<Pendidikan | null> => {
  const query = `
        UPDATE pendidikan 
        SET file_path = $1, status = 'SUDAH_UPLOAD' 
        WHERE id = $2
        RETURNING *;
    `;

  const result = await pool.query(query, [filename, id]);
  return result.rows.length > 0 ? result.rows[0] : null;
};
