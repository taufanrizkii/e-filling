import { Request, Response } from "express";
import * as repo from "../repositories/auth.repository";
import jwt from "jsonwebtoken";

const SECRET_KEY = "RAHASIA_NEGARA"; // Sebaiknya simpan di .env

// Pastikan ada kata 'export' agar file ini dianggap sebagai module
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Cari User di Repository
    const user = await repo.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Email tidak ditemukan",
      });
    }

    // 2. Cek Password (Sederhana)
    if (user.password !== password) {
      return res.status(401).json({
        status: "error",
        message: "Password salah",
      });
    }

    // 3. Buat Token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "1d",
    });

    res.json({
      status: "success",
      token,
      user: { nama: user.nama, email: user.email },
    });
  } catch (error: any) {
    console.error("Login Error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};
