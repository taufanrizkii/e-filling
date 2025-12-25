import { Pool } from "pg";

// Sesuaikan dengan user & password saat Anda install PostgreSQL
export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "db_efilling",
  password: "admin", // GANTI DENGAN PASSWORD POSTGRES ANDA
  port: 5432,
});

export const checkConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Database PostgreSQL connected successfully!");
    client.release();
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
};

checkConnection();
