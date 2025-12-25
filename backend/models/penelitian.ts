// Representasi data mentah dari Database (Sesuai kolom di MySQL)
export interface Penelitian {
  id: number;
  judul_penelitian: string;
  jenis_karya: string; // Contoh: Jurnal Nasional, Internasional, HAKI
  nama_jurnal: string; // Nama Jurnal / Konferensi
  tahun_terbit: number;
  link_publikasi?: string; // Opsional (bisa null)
  status_penulis: string; // Penulis Utama / Anggota
  status: string; // BELUM_UPLOAD / SUDAH_UPLOAD
  file_path?: string | null; // Nama file di folder uploads
  created_at: Date;
  updated_at: Date;
}

// Data yang dibutuhkan saat membuat data baru (Input dari Controller)
export interface PenelitianCreateDTO {
  judul_penelitian: string;
  jenis_karya: string;
  nama_jurnal: string;
  tahun_terbit: number;
  link_publikasi?: string;
  status_penulis: string; // Biasanya diisi otomatis "Penulis Utama" di controller
  file_bukti?: string | null; // Field optional untuk nama file
}

// Data yang dikirim ke Frontend (Output yang sudah diformat)
export class PenelitianItemDTO {
  constructor(
    public id: number,
    public judul: string,
    public detail_publikasi: string, // Gabungan "Nama Jurnal (Tahun)"
    public peran: string, // Status Penulis
    public status: string,
    public file_path?: string | null // Untuk link download/lihat file
  ) {}
}
