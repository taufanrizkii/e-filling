DROP TABLE IF EXISTS pengabdian;

CREATE TABLE pengabdian (
    id SERIAL PRIMARY KEY,
    nama_kegiatan VARCHAR(255) NOT NULL,
    lokasi_pelaksanaan VARCHAR(255) NOT NULL,
    tanggal_pelaksanaan DATE NOT NULL,
    sumber_dana VARCHAR(255),
    status VARCHAR(50) DEFAULT 'BELUM_UPLOAD',
    file_path VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
