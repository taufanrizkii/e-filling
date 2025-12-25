// Representasi data mentah dari Database
export interface Penelitian {
  id: number;
  judul_penelitian: string;
  jenis_karya: string;
  tahun_terbit: number;
  link_publikasi?: string | null;
  status: string;
  file_path?: string | null;
}

// Data yang diterima dari Form Frontend
export interface PenelitianCreateDTO {
  judul_penelitian: string;
  jenis_karya: string;
  tahun_terbit: number;
  link_publikasi?: string;
  file_bukti?: string | null;
}

// Data output untuk Frontend
export class PenelitianItemDTO {
  constructor(
    public id: number,
    public judul: string, // Properti ini yang akan dibaca FE
    public detail_publikasi: string, // Ini berisi gabungan Jenis + Tahun
    public status: string,
    public file_path?: string | null
  ) {}
}
