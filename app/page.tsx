// app/page.tsx
'use client';

import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import { GraduationCap, FlaskConical, Handshake, Star } from "lucide-react";
import styles from './dashboard/dashboard.module.css';

interface SummaryCardProps {
  title: string;
  count: number;
  link: string;
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
        fetch('http://localhost:5000/api/v1/pendidikan', { credentials: "include" }),
        fetch('http://localhost:5000/api/v1/penelitian', { credentials: "include" }),
        fetch('http://localhost:5000/api/v1/pengabdian', { credentials: "include" }),
        fetch('http://localhost:5000/api/v1/penunjang', { credentials: "include" })
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
    ],
    [counts]
  );

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        {/* LEFT ICON RAIL */}
        

        {/* MAIN */}
        <main className={styles.main}>
         

          {/* HERO */}
          <section className={styles.hero}>
            <div className={styles.heroInner}>
              <div className={styles.heroKicker}>eFilling Dosen Widyatama</div>
              <h1 className={styles.heroTitle}>Selamat Datang, Dr. Budi Santoso</h1>
              <p className={styles.heroSub}>
                Kelola pengisian Pendidikan, Penelitian, Pengabdian, dan Penunjang.
              </p>
            </div>
          </section>

          {/* CONTENT */}
          <section className={styles.contentGrid}>
           

            {/* STATS + ACCOUNT */}
            <div style={{ display: 'grid', gap: 16 }}>
              {/* Stats */}
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statTop}>
                    <div className={styles.statLabel}>Bidang Pendidikan</div>
                    
                  </div>
                  <div className={styles.statNum}>{counts.pendidikan}</div>
                  <div className={styles.muted}>Data tersimpan</div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statTop}>
                    <div className={styles.statLabel}>Bidang Penelitian</div>
                    
                  </div>
                  <div className={styles.statNum}>{counts.penelitian}</div>
                  <div className={styles.muted}>Data tersimpan</div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statTop}>
                    <div className={styles.statLabel}>Bidang Pengabdian</div>
                    
                  </div>
                  <div className={styles.statNum}>{counts.pengabdian}</div>
                  <div className={styles.muted}>Data tersimpan</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statTop}>
                    <div className={styles.statLabel}>Bidang Penunjang</div>
                    
                  </div>
                  <div className={styles.statNum}>{counts.penunjang}</div>
                  <div className={styles.muted}>Data tersimpan</div>
                </div>
              </div>

              {/* Account info */}
              <div className={`${styles.card} ${styles.pad}`}>
                <div className={styles.cardTitle}>Profile Dosen</div>
                

                <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <div className={styles.muted}>NIP/NIDN</div>
                    <div style={{ fontWeight: 800, color: '#111827' }}>198501232010011005</div>
                  </div>
                  <div>
                    <div className={styles.muted}>Jabatan</div>
                    <div style={{ fontWeight: 800, color: '#111827' }}>Lektor Kepala</div>
                  </div>
                  <div>
                    <div className={styles.muted}>Nama</div>
                    <div style={{ fontWeight: 800, color: '#111827' }}>Dr. Budi Santoso, S.Kom., M.T.</div>
                  </div>
                  <div>
                    <div className={styles.muted}>Program Studi</div>
                    <div style={{ fontWeight: 800, color: '#111827' }}>Teknik Informatika</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}