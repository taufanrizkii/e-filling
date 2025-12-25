import app from "./app";
import { config } from "./index";
import { pool } from "./configs/database"; // Menggunakan pool PostgreSQL yang sudah kita setup
import express from "express";
import path from "path";
import fs from "fs";

// Import Route
import pendidikanRoutes from "./routes/pendidikan.routes";
// import penelitianRoutes from "./routes/penelitian.routes"; // Uncomment jika modul penelitian sudah siap

const PORT = config.port || 5000;

// --- 1. Konfigurasi Folder Uploads (Penting untuk menyimpan file bukti) ---
let uploadsPath = path.join(process.cwd(), "uploads");

// Fallback: cek apakah ada di __dirname jika tidak ketemu di root
if (!fs.existsSync(uploadsPath)) {
  uploadsPath = path.join(__dirname, "uploads");
}

// Buat folder jika belum ada
if (!fs.existsSync(uploadsPath)) {
  try {
    fs.mkdirSync(uploadsPath);
    console.log(`📂 Folder uploads dibuat di: ${uploadsPath}`);
  } catch (err) {
    console.error("❌ Gagal membuat folder uploads:", err);
  }
}

console.log(`✅ Melayani file statis dari: ${uploadsPath}`);

// --- 2. Middleware ---
// Serve Static Files (Agar file bisa diakses via URL http://localhost:5000/uploads/namafile.pdf)
app.use("/uploads", express.static(uploadsPath));

// Parsing JSON & URL Encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 3. Daftarkan Routes ---
// Gunakan prefix /api/v1 agar rapi
app.use("/api/v1", pendidikanRoutes);
// app.use("/api/v1", penelitianRoutes);

const startServer = async () => {
  try {
    // Test koneksi ke PostgreSQL sebelum server jalan
    const res = await pool.query("SELECT NOW()");
    console.log(`✅ Database PostgreSQL connected: ${res.rows[0].now}`);

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📡 API URL: http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// --- 4. Graceful Shutdown ---
// Menutup koneksi database saat aplikasi dimatikan (Ctrl+C)
process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: closing HTTP server");
  await pool.end();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT signal received: closing HTTP server");
  await pool.end();
  process.exit(0);
});
