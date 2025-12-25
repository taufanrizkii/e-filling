// backend/server.ts
import app from "./app";
import { config } from "./index";
import { pool } from "./configs/database";
import express from "express";
import path from "path";
import fs from "fs";

// Import Routes
import pendidikanRoutes from "./routes/pendidikan.routes";
import penelitianRoutes from "./routes/penelitian.routes";

const PORT = config.port || 5000;

// 1. Setup Static Files
const uploadsPath = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use("/uploads", express.static(uploadsPath));

// 2. DAFTARKAN ROUTE (Harus sebelum 404 handler)
app.use("/api/v1", pendidikanRoutes);
app.use("/api/v1", penelitianRoutes);

// 3. 404 Handler (Letakkan di sini, setelah semua rute terdaftar)
app.use((req, res) => {
  res.status(404).json({ error: "Route Not Found di Server" });
});

// 4. Start Server
const startServer = async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log(`✅ Database PostgreSQL connected: ${res.rows[0].now}`);

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(
        `📡 Penelitian URL: http://localhost:${PORT}/api/v1/penelitian`
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
