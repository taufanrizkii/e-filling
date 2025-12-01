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
export declare class PendidikanItemDTO {
    id: number;
    tahun_semester: string;
    mata_kuliah: string;
    kelas_sks: string;
    status: string;
    constructor(id: number, tahun_semester: string, mata_kuliah: string, kelas_sks: string, status: string);
}
//# sourceMappingURL=pendidikan.d.ts.map