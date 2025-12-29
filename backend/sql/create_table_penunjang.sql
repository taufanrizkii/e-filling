CREATE TABLE IF NOT EXISTS penunjang (
    id SERIAL PRIMARY KEY,
    tahun_ajaran INTEGER NOT NULL DEFAULT 0,
    semester VARCHAR(20) NOT NULL DEFAULT 'GANJIL',
    nama_kegiatan VARCHAR(255) NOT NULL,
    tingkat VARCHAR(100) NOT NULL DEFAULT 'Lokal', -- Contoh: Lokal, Nasional, Internasional
    peran VARCHAR(100) DEFAULT 'Anggota', -- Contoh: Ketua, Anggota, Peserta
    status VARCHAR(50) DEFAULT 'BELUM_UPLOAD',
    file_path VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);