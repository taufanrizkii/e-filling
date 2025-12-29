// app/page.tsx
'use client';

import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';

interface SummaryCardProps {
  title: string;
  count: number;
  link: string;
  // statusText dihapus karena "Status Pengisian" mau dihapus
  statusColor: 'bg-green-500' | 'bg-red-500' | 'bg-yellow-500' | 'bg-purple-500';
  icon: React.ReactNode;
}

// Komponen Card Ringkasan (tanpa "Status Pengisian")
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
      {/* Bagian Status Pengisian DIHAPUS */}
    </div>
  </Link>
);

type ApiListResponse = { status?: string; data?: any[] };

export default function DashboardPage() {
  // Data Dosen (Simulasi dari hasil Login)
  const userData = {
    nama: 'Dr. Budi Santoso, S.Kom, M.T.',
    noInduk: '198501232010011005',
    jabatan: 'Lektor Kepala',
    prodi: 'Teknik Informatika',
  };

  // counts realtime (hasil hitung row)
  const [counts, setCounts] = useState({
    pendidikan: 0,
    penelitian: 0,
    pengabdian: 0,
    penunjang: 0, // kalau belum ada modulnya, tetap 0 dulu
  });

  const [isLoadingCounts, setIsLoadingCounts] = useState(true);

  const fetchCounts = async () => {
    try {
      setIsLoadingCounts(true);

      const [pendidikanRes, penelitianRes, pengabdianRes, penunjangRes] = await Promise.all([
        fetch('http://localhost:5000/api/v1/pendidikan'),
        fetch('http://localhost:5000/api/v1/penelitian'),
        fetch('http://localhost:5000/api/v1/pengabdian'),
        fetch('http://localhost:5000/api/v1/penunjang')
      ]);

      const [pendidikanJson, penelitianJson, pengabdianJson, penunjangJson] = await Promise.all([
        pendidikanRes.json(),
        penelitianRes.json(),
        pengabdianRes.json(),
        penunjangRes.json()
      ]);

      const pendidikanCount =
        (pendidikanJson as ApiListResponse)?.status === 'success' ? (pendidikanJson as ApiListResponse).data?.length ?? 0 : 0;

      const penelitianCount =
        (penelitianJson as ApiListResponse)?.status === 'success' ? (penelitianJson as ApiListResponse).data?.length ?? 0 : 0;

      const pengabdianCount =
        (pengabdianJson as ApiListResponse)?.status === 'success' ? (pengabdianJson as ApiListResponse).data?.length ?? 0 : 0;

      const penunjangCount =
        (penunjangJson as ApiListResponse)?.status === 'success' ? (penunjangJson as ApiListResponse).data?.length ?? 0 : 0;
  
      setCounts((prev) => ({
        ...prev,
        pendidikan: pendidikanCount,
        penelitian: penelitianCount,
        pengabdian: pengabdianCount,
        penunjang: penunjangCount,
      }));
    } catch (e) {
      console.error('Gagal mengambil count:', e);
      // kalau error, biarkan nilai terakhir; jangan reset biar UI tidak “kedip”
    } finally {
      setIsLoadingCounts(false);
    }
  };

  useEffect(() => {
    fetchCounts();

    // realtime sederhana: polling tiap 5 detik
    const t = setInterval(fetchCounts, 5000);
    return () => clearInterval(t);
  }, []);

  const cards: SummaryCardProps[] = useMemo(
    () => [
      {
        title: 'Bidang Pendidikan',
        count: counts.pendidikan,
        link: '/pendidikan',
        statusColor: 'bg-green-500',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.5v11m-6-6h12M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        title: 'Bidang Penelitian',
        count: counts.penelitian,
        link: '/penelitian',
        statusColor: 'bg-yellow-500',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2-8a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      {
        title: 'Bidang Pengabdian',
        count: counts.pengabdian,
        link: '/pengabdian',
        statusColor: 'bg-red-500',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h-4l-1-2H7l-1 2H3M5 13l2-2 4 4 4-4 2 2m-4-6h-4" />
          </svg>
        ),
      },
      {
        title: 'Bidang Penunjang',
        count: counts.penunjang,
        link: '/penunjang',
        statusColor: 'bg-purple-500',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        ),
      },
    ],
    [counts]
  );

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-extrabold text-gray-800">Selamat Datang, {userData.nama.split(',')[0]}! 👋</h1>

      {/* --- Informasi Dosen --- */}
      <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-600">
        <h2 className="text-2xl font-semibold mb-3 text-gray-700">Informasi Akun Dosen</h2>
        <div className="grid grid-cols-2 gap-4 text-gray-600">
          <p>
            <strong>NIP/NIDN:</strong> {userData.noInduk}
          </p>
          <p>
            <strong>Jabatan Fungsional:</strong> {userData.jabatan}
          </p>
          <p>
            <strong>Nama Lengkap:</strong> {userData.nama}
          </p>
          <p>
            <strong>Program Studi:</strong> {userData.prodi}
          </p>
        </div>
      </div>

      {/* --- Ringkasan Tri Dharma (Count Realtime) --- */}
      <div className="flex items-center justify-between pt-4">
        <h2 className="text-2xl font-bold text-gray-800">Ringkasan E-Filling (Tri Dharma)</h2>
        <span className="text-sm text-gray-500">{isLoadingCounts ? 'Memuat ringkasan...' : 'Update otomatis tiap 5 detik'}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <strong>Perhatian:</strong> Batas waktu pengisian data Tri Dharma Semester Ganjil TA 2024/2025 adalah tanggal <strong>31 Desember 2025</strong>.
            Harap segera lengkapi Bidang Pengabdian.
          </p>
        </div>
      </div>
    </div>
  );
}
