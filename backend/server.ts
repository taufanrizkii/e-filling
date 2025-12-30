import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// Import Routes
import pendidikanRoutes from "./routes/pendidikan.routes";
import penelitianRoutes from "./routes/penelitian.routes";
import pengabdianRoutes from "./routes/pengabdian.routes";
import penunjangRoutes from "./routes/penunjang.routes";
import authRoutes from "./routes/auth.routes";
import { authenticateToken } from "./middleware/auth.middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Pastikan sesuai port Frontend Next.js
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], // Izinkan header Authorization untuk JWT
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Folder untuk upload file bukti
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Daftar Routes ---

// 1. Rute Publik (Bisa diakses tanpa login)
app.use("/api/v1/auth", authRoutes);

// 2. Rute Terlindungi (Wajib login/punya token)
// Menambahkan authenticateToken di sini akan melindungi seluruh endpoint di dalam route tersebut
app.use("/api/v1/pendidikan", authenticateToken, pendidikanRoutes);
app.use("/api/v1/penelitian", authenticateToken, penelitianRoutes);
app.use("/api/v1/pengabdian", authenticateToken, pengabdianRoutes);
app.use("/api/v1/penunjang", authenticateToken, penunjangRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
