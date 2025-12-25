import { pool } from "../configs/database";
import { Penelitian, PenelitianCreateDTO } from "../models/penelitian";

// 1. Ambil Semua Data
export const findAllPenelitian = async (): Promise<Penelitian[]> => {
  const query = "SELECT * FROM penelitian ORDER BY created_at DESC";
  const result = await pool.query(query);
  return result.rows;
};

// 2. Buat Data Baru
export const createPenelitian = async (
  data: PenelitianCreateDTO & { file_bukti?: string | null }
): Promise<Penelitian> => {
  const query = `
        INSERT INTO penelitian (judul_penelitian, jenis_karya, tahun_terbit, link_publikasi, status_penulis, status, file_path)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;

  const statusAwal = data.file_bukti ? "SUDAH_UPLOAD" : "BELUM_UPLOAD";

  const values = [
    data.judul_penelitian,
    data.jenis_karya,
    data.tahun_terbit,
    data.link_publikasi || null,
    statusAwal,
    data.file_bukti || null,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

// 3. Update File
export const updateFilePenelitian = async (
  id: number,
  filename: string
): Promise<Penelitian | null> => {
  const query = `
        UPDATE penelitian 
        SET file_path = $1, status = 'SUDAH_UPLOAD' 
        WHERE id = $2
        RETURNING *;
    `;

  const result = await pool.query(query, [filename, id]);
  return result.rows.length > 0 ? result.rows[0] : null;
};
