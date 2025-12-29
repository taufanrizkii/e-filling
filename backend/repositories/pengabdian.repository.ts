import { pool } from "../configs/database";
import { Pengabdian, PengabdianCreateDTO } from "../models/pengabdian";

export const findAllPengabdian = async (): Promise<Pengabdian[]> => {
  const query = "SELECT * FROM pengabdian ORDER BY created_at DESC";
  const result = await pool.query(query);
  return result.rows;
};

export const createPengabdian = async (
  data: PengabdianCreateDTO & { file_bukti?: string | null }
): Promise<Pengabdian> => {
  const query = `
    INSERT INTO pengabdian (nama_kegiatan, lokasi_pelaksanaan, tanggal_pelaksanaan, sumber_dana, status, file_path)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [
    data.nama_kegiatan,
    data.lokasi_pelaksanaan,
    data.tanggal_pelaksanaan,
    data.sumber_dana || null,
    data.file_bukti ? "SUDAH_UPLOAD" : "BELUM_UPLOAD",
    data.file_bukti || null,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const updateFilePengabdian = async (
  id: number,
  filename: string
): Promise<Pengabdian | null> => {
  const query = `
    UPDATE pengabdian
    SET file_path = $1, status = 'SUDAH_UPLOAD', updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *;
  `;

  const result = await pool.query(query, [filename, id]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

export const findPengabdianFilePathById = async (
  id: number
): Promise<string | null> => {
  const q = "SELECT file_path FROM pengabdian WHERE id = $1";
  const r = await pool.query(q, [id]);
  return r.rows[0]?.file_path ?? null;
};

export const deletePengabdian = async (id: number): Promise<void> => {
  const q = "DELETE FROM pengabdian WHERE id = $1";
  await pool.query(q, [id]);
};
