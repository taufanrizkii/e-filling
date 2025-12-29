DROP TABLE IF EXISTS penelitian;

CREATE TABLE penelitian (
    id SERIAL PRIMARY KEY,
    judul_penelitian VARCHAR(255) NOT NULL,
    jenis_karya VARCHAR(50) NOT NULL,
    tahun_terbit INTEGER NOT NULL,
    link_publikasi VARCHAR(255),
    status_penulis VARCHAR(50),
    status VARCHAR(50) DEFAULT 'BELUM_UPLOAD',
    file_path VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);