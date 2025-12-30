'use client';

import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import { GraduationCap, FlaskConical, Handshake, Star } from "lucide-react";

// --- TIPE DATA ---
interface SummaryCardProps {
  title: string;
  count: number;
  link: string;
  statusColor: 'bg-green-500' | 'bg-red-500' | 'bg-yellow-500' | 'bg-purple-500';
  icon: React.ReactNode;
}

interface User {
  nama: string;
  email: string;
}

interface ApiListResponse {
  status?: string;
  data?: any[];
}

// --- KOMPONEN KARTU ---
const SummaryCard: React.FC<SummaryCardProps> = ({ title, count, link, statusColor, icon }) => (
  <Link href={link} className="block hover:shadow-lg transition-shadow duration-300">
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">{title}</h3>
          <p className="text-4xl font-bold text-gray-900">{count}</p>
          <p className="text-sm text-gray-500 mt-1">Data Tersimpan</p>
        </div>
        <div className={`p-3 rounded-full text-white ${statusColor}`}>{icon}</div>
      </div>
    </div>
  </Link>
);

export default function DashboardPage() {
  // 1. STATE UNTUK USER (DINAMIS)
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // 2. STATE UNTUK COUNT DATA
  const [counts, setCounts] = useState({
    pendidikan: 0,
    penelitian: 0,
    pengabdian: 0,
    penunjang: 0,
  });
  const [isLoadingCounts, setIsLoadingCounts] = useState(true);

  // 3. EFFECT: AMBIL USER DARI LOCALSTORAGE
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoadingUser(false);
  }, []);

  // 4. EFFECT: AMBIL DATA COUNT DARI API
  const fetchCounts = async () => {
    try {
      // Helper untuk mengambil token
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      const headers = { 'Authorization': `Bearer ${token}` };

      setIsLoadingCounts(true);

      const [pendidikanRes, penelitianRes, pengabdianRes, penunjangRes] = await Promise.all([
        fetch('http://localhost:5000/api/v1/pendidikan', { headers }),
        fetch('http://localhost:5000/api/v1/penelitian', { headers }),
        fetch('http://localhost:5000/api/v1/pengabdian', { headers }),
        fetch('http://localhost:5000/api/v1/penunjang', { headers })
      ]);

      const [pendidikanJson, penelitianJson, pengabdianJson, penunjangJson] = await Promise.all([
        pendidikanRes.json(),
        penelitianRes.json(),
        pengabdianRes.json(),
        penunjangRes.json()
      ]);

      const getCount = (json: ApiListResponse) => (json?.status === 'success' && Array.isArray(json?.data) ? json.data.length : 0);

      setCounts({
        pendidikan: getCount(pendidikanJson),
        penelitian: getCount(penelitianJson),
        pengabdian: getCount(pengabdianJson),
        penunjang: getCount(penunjangJson),
      });

    } catch (e) {
      console.error('Gagal mengambil count:', e);
    } finally {
      setIsLoadingCounts(false);
    }
  };

  useEffect(() => {
    fetchCounts();
    const interval = setInterval(fetchCounts, 5000);
    return () => clearInterval(interval);
  }, []);

  // 5. MEMO: DATA KARTU
  const cards: SummaryCardProps[] = useMemo(() => [
    {
      title: "Bidang Pendidikan",
      count: counts.pendidikan,
      link: "/pendidikan",
      statusColor: "bg-green-500",
      icon: <GraduationCap className="w-6 h-6" />,
    },
    {
      title: "Bidang Penelitian",
      count: counts.penelitian,
      link: "/penelitian",
      statusColor: "bg-yellow-500",
      icon: <FlaskConical className="w-6 h-6" />,
    },
    {
      title: "Bidang Pengabdian",
      count: counts.pengabdian,
      link: "/pengabdian",
      statusColor: "bg-red-500",
      icon: <Handshake className="w-6 h-6" />,
    },
    {
      title: "Bidang Penunjang",
      count: counts.penunjang,
      link: "/penunjang",
      statusColor: "bg-purple-500",
      icon: <Star className="w-6 h-6" />,
    },
  ], [counts]);

  return (
    <div className="space-y-8">
      {/* --- Header Selamat Datang --- */}
      <h1 className="text-4xl font-extrabold text-gray-800 capitalize">
        Selamat Datang, {loadingUser ? '...' : (user?.nama || 'Dosen')}! 👋
      </h1>

      {/* --- Informasi Dosen (DIPERBARUI) --- */}
      <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-600">
        <h2 className="text-2xl font-semibold mb-3 text-gray-700">Informasi Akun Dosen</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
          <div>
            <p className="mb-1 text-sm text-gray-500 uppercase tracking-wide">Nama Lengkap</p>
            {/* Nama diambil dinamis dari Login */}
            <p className="text-lg font-bold text-gray-900 capitalize">{user?.nama || 'Nama Dosen'}</p>
          </div>
          <div>
            <p className="mb-1 text-sm text-gray-500 uppercase tracking-wide">NIP/NIDN</p>
            {/* Data Dummy karena belum ada di DB */}
            <p className="text-lg font-bold text-gray-900">198501232010011005</p>
          </div>
          <div>
            <p className="mb-1 text-sm text-gray-500 uppercase tracking-wide">Jabatan Fungsional</p>
             {/* Data Dummy */}
            <p className="text-lg font-medium text-gray-900">Lektor Kepala</p>
          </div>
          <div>
            <p className="mb-1 text-sm text-gray-500 uppercase tracking-wide">Program Studi</p>
             {/* Data Dummy */}
            <p className="text-lg font-medium text-gray-900">Teknik Informatika</p>
          </div>
        </div>
      </div>

      {/* --- Ringkasan Tri Dharma --- */}
      <div className="flex items-center justify-between pt-4">
        <h2 className="text-2xl font-bold text-gray-800">Ringkasan eFilling (Tri Dharma)</h2>
        <span className="text-sm text-gray-500">
          {isLoadingCounts ? 'Memuat data...' : 'Data terbaru'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {cards.map((c, idx) => (
          <SummaryCard key={idx} {...c} />
        ))}
      </div>

      {/* --- Pemberitahuan Penting --- */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.3 17c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm text-yellow-800 font-medium">
            <strong>Perhatian:</strong> Pastikan data Anda selalu terupdate sebelum akhir semester.
          </p>
        </div>
      </div>
    </div>
  );
}