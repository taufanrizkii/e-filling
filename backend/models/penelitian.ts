// backend/models/penelitian.ts

export interface Penelitian {
  id: number;
  judul_penelitian: string;
  jenis_karya: string;
  tahun_terbit: number;
  link_publikasi?: string | null;
  status_penulis: string;
  status: string;
  file_path?: string | null;
}

export interface PenelitianCreateDTO {
  judul_penelitian: string;
  jenis_karya: string;
  tahun_terbit: number;
  link_publikasi?: string;
  status_penulis: string;
  file_bukti?: string | null;
}
