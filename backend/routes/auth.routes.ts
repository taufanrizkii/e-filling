import { Router } from "express";
import { pool } from "../configs/database";

const router = Router();

// POST /api/v1/auth/login
router.post("/auth/login", async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ status: "error", message: "Username & password wajib diisi" });
  }

  const result = await pool.query(
    "SELECT id, username, password FROM users WHERE username = $1 LIMIT 1",
    [username]
  );

  const user = result.rows[0];
  if (!user || user.password !== password) {
    return res.status(401).json({ status: "error", message: "Login gagal" });
  }

  // ✅ set session
  (req.session as any).userId = user.id;
  (req.session as any).username = user.username;

  return res.json({ status: "success", message: "Login berhasil", user: { id: user.id, username: user.username } });
});

// POST /api/v1/auth/logout
router.post("/auth/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ status: "error", message: "Gagal logout" });
    res.clearCookie("connect.sid");
    return res.json({ status: "success", message: "Logout berhasil" });
  });
});

// GET /api/v1/auth/me
router.get("/auth/me", async (req, res) => {
  const s = req.session as any;
  if (!s?.userId) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  return res.json({ status: "success", user: { id: s.userId, username: s.username } });
});

router.post("/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ status: "error", message: "Logout gagal" });
    }

    res.clearCookie("connect.sid");
    return res.json({ status: "success", message: "Logout berhasil" });
  });
});


export default router;
