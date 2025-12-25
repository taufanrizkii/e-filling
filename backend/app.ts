// backend/app.ts
import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

const app: Application = express();

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: false, // Penting agar gambar/file bisa diakses FE
  })
);
app.use(cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compression middleware
app.use(compression());

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// JANGAN DAFTARKAN ROUTE ATAU 404 HANDLER DI SINI
// Pindahkan semuanya ke server.ts agar urutannya benar

export default app;
