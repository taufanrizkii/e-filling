CREATE TABLE if not EXISTS pendidikan (
    id serial PRIMARY KEY,
    tahun_ajaran INTEGER NOT NULL DEFAULT 0,
    semester VARCHAR(10) NOT NULL DEFAULT 'GANJIL',
    mata_kuliah VARCHAR(255),
    sks INTEGER NOT NULL DEFAULT 0,
    kelas VARCHAR(10) NOT NULL DEFAULT 'A',
    status VARCHAR(15) NOT NULL DEFAULT 'BELUM_UPLOAD',
    created_at timestamp NOT NULL DEFAULT NOW(),
    updated_at timestamp NOT NULL DEFAULT NOW()
);