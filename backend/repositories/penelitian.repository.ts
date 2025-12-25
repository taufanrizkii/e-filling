import { pool } from "../configs/database";
import { Penelitian, PenelitianCreateDTO } from "../models/penelitian";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// 1. Ambil Semua Data
export const findAllPenelitian = async (): Promise<Penelitian[]> => {
  const query = "SELECT * FROM penelitian ORDER BY created_at DESC";
  // Mengambil data dari database
  const [rows] = await pool.query<RowDataPacket[]>(query);
  return rows as Penelitian[];
};

// 2. Buat Data Baru
export const createPenelitian = async (
  data: PenelitianCreateDTO & { file_bukti?: string | null }
): Promise<Penelitian> => {
  const query = `
        INSERT INTO penelitian (judul_penelitian, jenis_karya, nama_jurnal, tahun_terbit, link_publikasi, status_penulis, status, file_path)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

  // Tentukan status awal: Jika ada file upload -> SUDAH_UPLOAD, jika tidak -> BELUM_UPLOAD
  const statusAwal = data.file_bukti ? "SUDAH_UPLOAD" : "BELUM_UPLOAD";

  const values = [
    data.judul_penelitian,
    data.jenis_karya,
    data.nama_jurnal,
    data.tahun_terbit,
    data.link_publikasi || null,
    data.status_penulis,
    statusAwal,
    data.file_bukti || null, // Jika tidak ada file, simpan NULL
  ];

  // Eksekusi query INSERT
  const [result] = await pool.query<ResultSetHeader>(query, values);

  // Ambil kembali data yang baru saja disimpan untuk dikembalikan ke service
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM penelitian WHERE id = ?",
    [result.insertId]
  );

  return rows[0] as Penelitian;
};

// 3. Update File (Upload Susulan)
export const updateFilePenelitian = async (
  id: number,
  filename: string
): Promise<Penelitian | null> => {
  const query = `
        UPDATE penelitian 
        SET file_path = ?, status = 'SUDAH_UPLOAD' 
        WHERE id = ?
    `;

  // Eksekusi query UPDATE
  await pool.query<ResultSetHeader>(query, [filename, id]);

  // Ambil data terbaru setelah diupdate untuk memastikan perubahan berhasil
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM penelitian WHERE id = ?",
    [id]
  );

  return rows.length > 0 ? (rows[0] as Penelitian) : null;
};
