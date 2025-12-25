export interface Pendidikan {
  id: number;
  tahun_ajaran: number;
  semester: string;
  mata_kuliah: string;
  kelas: string;
  sks: number;
  status: string;
  file_path?: string | null; // Field untuk menyimpan nama file di database
  created_at?: Date; // Optional karena digenerate database
  updated_at?: Date;
}

export interface PendidikanCreateDTO {
  tahun_ajaran: number;
  semester: string;
  mata_kuliah: string;
  kelas: string;
  sks: number;
  file_bukti?: string | null; // Field sementara dari upload controller
}

// Class DTO untuk respon ke Frontend
export class PendidikanItemDTO {
  constructor(
    public id: number,
    public tahun_semester: string,
    public mata_kuliah: string,
    public kelas_sks: string,
    public status: string,
    public file_path?: string | null // Tambahkan ini agar frontend bisa download file
  ) {}
}
