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
  // Query ini meminta 7 parameter ($1 s/d $7)
  const query = `
        INSERT INTO penelitian (
          judul_penelitian, 
          jenis_karya, 
          tahun_terbit, 
          link_publikasi, 
          status_penulis, 
          status, 
          file_path
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;

  const statusAwal = data.file_bukti ? "SUDAH_UPLOAD" : "BELUM_UPLOAD";

  // Perbaikan: Array values HARUS berisi 7 item sesuai urutan query di atas
  const values = [
    data.judul_penelitian, // $1
    data.jenis_karya, // $2
    data.tahun_terbit, // $3
    data.link_publikasi || null, // $4
    data.status_penulis || "Penulis Utama", // $5 (Tadi ini terlewat)
    statusAwal, // $6
    data.file_bukti || null, // $7
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

// 4. Tambahkan Fungsi Hapus (Agar tombol hapus di FE berfungsi)
export const deletePenelitian = async (id: number): Promise<void> => {
  const query = "DELETE FROM penelitian WHERE id = $1";
  await pool.query(query, [id]);
};
