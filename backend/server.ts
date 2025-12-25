<<<<<<< HEAD
import app from "./app";
import { config } from "./index";
import "./configs/database";
import express from "express"; // Import express
import path from "path"; // Import path
import fs from "fs";

// IMPORT ROUTE PENELITIAN
import penelitianRoutes from "./routes/penelitian.routes";
import pendidikanRoutes from "./routes/pendidikan.routes"; // Asumsi ini sudah ada

const PORT = config.port || 5000;

// Logika penentuan path uploads yang lebih robust
// Kita prioritaskan folder uploads yang berada di ROOT folder project backend (sejajar dengan package.json)
let uploadsPath = path.join(process.cwd(), "uploads");

// Jika folder tidak ada di root, cek apakah ada di __dirname (fallback)
if (!fs.existsSync(uploadsPath)) {
  console.log(
    `⚠️ Folder uploads tidak ditemukan di ${uploadsPath}, mencoba __dirname...`
  );
  uploadsPath = path.join(__dirname, "uploads");
}

// Pastikan folder benar-benar ada, jika tidak buat baru
if (!fs.existsSync(uploadsPath)) {
  console.log(
    `⚠️ Folder uploads tidak ditemukan di manapun. Membuat folder baru di: ${uploadsPath}`
  );
  fs.mkdirSync(uploadsPath);
}

console.log(`✅ Melayani file statis dari: ${uploadsPath}`);

// Middleware Static Files: Letakkan ini SEBELUM route API
app.use("/uploads", express.static(uploadsPath));

// Middleware JSON parser (Pastikan ini ada jika belum ada di app.ts)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DAFTARKAN ROUTE DI SINI
// Pastikan prefix '/api/v1' digunakan
app.use("/api/v1", pendidikanRoutes);
app.use("/api/v1", penelitianRoutes); // <--- INI WAJIB DITAMBAHKAN AGAR ROUTE DITEMUKAN

const startServer = () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API URL: http://localhost:${PORT}${config.apiPrefix}`);
      console.log(`Static Files URL: http://localhost:${PORT}/uploads/`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
=======
import app from './app';
import { config } from './index';
import { pool } from './configs/database';

const PORT = config.port || 5000;

const startServer = async () => {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('Database connected successfully');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
>>>>>>> 344a74ec6b47e0a460a433c76d0fa4877e48294c
    process.exit(1);
  }
};

startServer();
<<<<<<< HEAD
=======

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await pool.end();
  process.exit(0);
});
>>>>>>> 344a74ec6b47e0a460a433c76d0fa4877e48294c
