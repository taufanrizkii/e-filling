export interface Pendidikan {
  id: number;
  tahun_ajaran: number;
  semester: string;
  mata_kuliah: string;
<<<<<<< HEAD
  kelas: string;
  sks: number;
  status: string;
  file_path?: string | null; // Tambahkan ini
=======
  sks: number;
  kelas: string;
  status: string;
>>>>>>> 344a74ec6b47e0a460a433c76d0fa4877e48294c
  created_at: Date;
  updated_at: Date;
}

<<<<<<< HEAD
=======
export class PendidikanItemDTO {
  id: number;
  tahun_semester: string;
  mata_kuliah: string;
  kelas_sks: string;
  status: string;

  constructor(
    id: number,
    tahun_semester: string,
    mata_kuliah: string,
    kelas_sks: string,
    status: string
  ) {
    this.id = id;
    this.tahun_semester = tahun_semester;
    this.mata_kuliah = mata_kuliah;
    this.kelas_sks = kelas_sks;
    this.status = status;
  }
}
>>>>>>> 344a74ec6b47e0a460a433c76d0fa4877e48294c
export interface PendidikanCreateDTO {
  tahun_ajaran: number;
  semester: string;
  mata_kuliah: string;
<<<<<<< HEAD
  kelas: string;
  sks: number;
  file_bukti?: string | null; // Tambahkan ini untuk menampung nama file dari controller
}

export class PendidikanItemDTO {
  constructor(
    public id: number,
    public tahun_semester: string,
    public mata_kuliah: string,
    public kelas_sks: string,
    public status: string,
    public file_path?: string | null // Tambahkan ini agar frontend bisa tau link downloadnya
  ) {}
=======
  sks: number;
  kelas: string;
>>>>>>> 344a74ec6b47e0a460a433c76d0fa4877e48294c
}
