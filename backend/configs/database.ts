<<<<<<< HEAD
import mysql from "mysql2/promise";
import { config } from "../index";

export const pool = mysql.createPool({
  host: config.database.host, // 'localhost'
  port: 3306, // Default MySQL port
  user: "root", // Default XAMPP user
  password: "", // Default XAMPP password (kosong)
  // PASTIKAN database 'db_efilling' SUDAH DIBUAT di phpMyAdmin sebelum menjalankan aplikasi
  database: "db_efilling",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Helper untuk cek koneksi saat server start
export const checkConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database MySQL connected successfully!");
    connection.release();
  } catch (error: any) {
    if (error.code === "ER_BAD_DB_ERROR") {
      console.error(
        "❌ Error: Database 'db_efilling' tidak ditemukan. Silakan buat database tersebut di phpMyAdmin."
      );
    } else {
      console.error("❌ Database connection failed:", error);
    }
  }
};

checkConnection();
=======
import { Pool } from 'pg';
import { config } from '../index';

export const pool = new Pool({
    host: config.database.host,
    port: config.database.port,
    database: config.database.name,
    user: config.database.user,
    password: config.database.password,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});
>>>>>>> 344a74ec6b47e0a460a433c76d0fa4877e48294c
