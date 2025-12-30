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
  data: PendidikanCreateDTO
): Promise<Pendidikan> => {
  const query = `
        INSERT INTO pendidikan (
            tahun_ajaran, 
            semester, 
            mata_kuliah, 
            kelas, 
            sks, 
            status, 
            file_path
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;

  // Logika Status otomatis
  const statusAwal = data.file_bukti ? "SUDAH_UPLOAD" : "BELUM_UPLOAD";

  const values = [
    data.tahun_ajaran, // $1
    data.semester, // $2
    data.mata_kuliah, // $3
    data.kelas, // $4
    data.sks, // $5
    statusAwal, // $6
    data.file_bukti || null, // $7
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

// 3. Update File (Upload Susulan)
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

// 4. Hapus Data
export const deletePendidikan = async (id: number): Promise<void> => {
  const query = "DELETE FROM pendidikan WHERE id = $1";
  await pool.query(query, [id]);
};

// 5. Cari Nama File berdasarkan ID (untuk dihapus dari folder)
export const findPendidikanFilePathById = async (
  id: number
): Promise<string | null> => {
  const q = `SELECT file_path FROM pendidikan WHERE id = $1`;
  const r = await pool.query(q, [id]);
  if (r.rows.length === 0) return null;
  return r.rows[0].file_path ?? null;
};
