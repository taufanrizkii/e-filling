import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = "RAHASIA_NEGARA"; // Pastikan sama dengan yang di Controller

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Ambil token dari header 'Authorization' (Format: Bearer <token>)
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ status: "error", message: "Akses ditolak, token hilang" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    (req as any).user = decoded; // Simpan data user ke dalam request
    next(); // Lanjut ke controller
  } catch (error) {
    return res
      .status(403)
      .json({ status: "error", message: "Token tidak valid atau kedaluwarsa" });
  }
};
