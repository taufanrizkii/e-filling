CREATE TABLE IF NOT EXISTS penelitian (
    id INT AUTO_INCREMENT PRIMARY KEY,
    judul_penelitian VARCHAR(255) NOT NULL,
    jenis_karya VARCHAR(50) NOT NULL, -- Jurnal Nasional/Internasional/HAKI
    tahun_terbit INT NOT NULL,
    link_publikasi VARCHAR(255),
    status_penulis VARCHAR(50), -- Penulis Utama / Anggota
    status VARCHAR(15) NOT NULL DEFAULT 'BELUM_UPLOAD',
    file_path VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);