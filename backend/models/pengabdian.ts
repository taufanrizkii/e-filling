export interface Pengabdian {
  id: number;
  nama_kegiatan: string;
  lokasi_pelaksanaan: string;
  tanggal_pelaksanaan: string; // YYYY-MM-DD dari Postgres DATE
  sumber_dana?: string | null;
  status: string;
  file_path?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface PengabdianCreateDTO {
  nama_kegiatan: string;
  lokasi_pelaksanaan: string;
  tanggal_pelaksanaan: string; // YYYY-MM-DD
  sumber_dana?: string | null;
  file_bukti?: string | null; // sementara (nama file dari multer)
}

// DTO untuk frontend (sesuai page pengabdian yang pakai camelCase + label Indonesia)
export class PengabdianItemDTO {
  constructor(
    public id: number,
    public namaKegiatan: string,
    public lokasi: string,
    public tanggal: string,
    public sumberDana: string,
    public statusBukti: "Belum Upload" | "Sudah Upload",
    public file_path?: string | null
  ) {}
}
