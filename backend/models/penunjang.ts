// backend/models/penunjang.ts

// Representasi data di Database
export interface Penunjang {
  id: number;
  tahun_ajaran: number;
  semester: string;
  nama_kegiatan: string;
  tingkat: string;
  peran: string;
  status: string;
  file_path: string | null;
  created_at?: Date;
  updated_at?: Date;
}

// DTO untuk Input Data (Create)
export interface PenunjangCreateDTO {
  tahun_ajaran: number;
  semester: string;
  nama_kegiatan: string;
  tingkat: string;
  peran: string;
  file_bukti?: string | null;
}

// DTO untuk Tampilan ke Frontend (Read)
export class PenunjangItemDTO {
  constructor(
    public id: number,
    public tahun_semester: string,
    public nama_kegiatan: string,
    public detail_kegiatan: string, // Gabungan Tingkat & Peran
    public status: string,
    public file_path: string | null
  ) {}
}