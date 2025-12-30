import { pool } from "../configs/database";
import { User } from "../models/auth";

/**
 * Mencari user berdasarkan email untuk proses login
 */
export const findUserByEmail = async (email: string): Promise<User | null> => {
  const query = "SELECT * FROM users WHERE email = $1";
  const result = await pool.query(query, [email]);

  // Jika data ditemukan, kembalikan baris pertama, jika tidak kembalikan null
  return result.rows.length > 0 ? result.rows[0] : null;
};
