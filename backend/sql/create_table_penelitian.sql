CREATE TABLE IF NOT EXISTS penelitian (
    id SERIAL PRIMARY KEY,
    judul_penelitian VARCHAR(255) NOT NULL,
    jenis_karya VARCHAR(50) NOT NULL, -- Jurnal Nasional/Internasional/HAKI/dll
    tahun_terbit INTEGER NOT NULL,
    link_publikasi VARCHAR(255),
    status_penulis VARCHAR(50), -- Penulis Utama / Anggota
    status VARCHAR(50) DEFAULT 'BELUM_UPLOAD',
    file_path VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);