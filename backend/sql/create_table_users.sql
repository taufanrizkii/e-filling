-- Table users (simple)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed admin/admin (jika belum ada)
INSERT INTO users (username, password)
SELECT 'budisantoso', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');
