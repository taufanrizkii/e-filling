"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("budisantoso");
  const [password, setPassword] = useState("admin");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ penting biar cookie session tersimpan
        body: JSON.stringify({ username, password }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Login gagal");

      router.replace("/");
    } catch (e: any) {
      setErr(e?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white border rounded-xl p-6 shadow">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Login</h1>
        <p></p>
        {err && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded">{err}</div>}

        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
        <input
          className="w-full border rounded-lg px-3 py-2 mb-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          className="w-full border rounded-lg px-3 py-2 mb-5"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white rounded-lg py-2 font-semibold disabled:opacity-60"
        >
          {loading ? "Memproses..." : "Login"}
        </button>

        
      </form>
    </div>
  );
}
