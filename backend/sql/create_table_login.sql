DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Masukkan 1 user untuk tes (Password: 123456)
INSERT INTO
    users (nama, email, password)
VALUES (
        'danang',
        'danang@gmail.com',
        '123456'
    );