export interface Pendidikan {
  id: number;
  tahun_ajaran: number;
  semester: string;
  mata_kuliah: string;
  sks: number;
  kelas: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

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
export interface PendidikanCreateDTO {
  tahun_ajaran: number;
  semester: string;
  mata_kuliah: string;
  sks: number;
  kelas: string;
}
