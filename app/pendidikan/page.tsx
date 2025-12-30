// app/pendidikan/page.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

// Tipe data untuk tampilan di tabel (sesuai respon backend)
interface PendidikanItem {
  id: number;
  tahun_semester: string; // contoh: "2024/2025 GANJIL"
  mata_kuliah: string;
  kelas_sks: string;      // contoh: "Kelas A / 3 SKS"
  status: string;         // "BELUM_UPLOAD" | "SUDAH_UPLOAD"
  file_path?: string | null;
}

const API_BASE = 'http://localhost:5000';

export default function PendidikanPage() {
  // =========================
  // State: data + loading
  // =========================
  const [data, setData] = useState<PendidikanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // =========================
  // State: form create
  // =========================
  const [formData, setFormData] = useState({
    tahun_ajaran: new Date().getFullYear(),
    semester: 'GANJIL',
    mata_kuliah: '',
    kelas: '',
    sks: 3,
  });
  const [isSaving, setIsSaving] = useState(false);

  // =========================
  // File create (Input File di Form Tambah)
  // =========================
  const createFileRef = useRef<HTMLInputElement | null>(null);
  const [createFile, setCreateFile] = useState<File | null>(null);
  const [createFileName, setCreateFileName] = useState<string | null>(null);

  // =========================
  // Upload modal (PUT untuk Upload Susulan)
  // =========================
  const [showUpload, setShowUpload] = useState(false);
  const [uploadId, setUploadId] = useState<number | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadFileName, setUploadFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  // =========================
  // Helper: Buka file di tab baru
  // =========================
  const openBuktiNewTab = (filePath: string) => {
    const url = `${API_BASE}/uploads/${filePath}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // =========================
  // 1. Fetch Data
  // =========================
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/pendidikan`, { credentials: "include" });
      const json = await res.json();
      
      if (json?.status === 'success') {
        setData(json.data ?? []);
      } else if (Array.isArray(json)) {
        setData(json);
      } else {
        setData([]);
      }
    } catch (e) {
      console.error(e);
      toast.error("Gagal mengambil data pendidikan.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =========================
  // 2. Create (POST)
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.mata_kuliah || formData.sks <= 0) {
      toast.error('Mata kuliah dan SKS wajib diisi dengan benar.');
      return;
    }

    setIsSaving(true);
    try {
      const fd = new FormData();
      fd.append('tahun_ajaran', formData.tahun_ajaran.toString());
      fd.append('semester', formData.semester);
      fd.append('mata_kuliah', formData.mata_kuliah);
      fd.append('kelas', formData.kelas);
      fd.append('sks', formData.sks.toString());

      if (createFile) {
        fd.append('file_bukti', createFile);
      }

      const res = await fetch(`${API_BASE}/api/v1/pendidikan`, {
        method: 'POST',
        body: fd,
        credentials: "include",
      });

      const json = await res.json();
      
      if (!res.ok) {
        throw new Error(json?.message || "Gagal menyimpan data.");
      }

      toast.success('Data pendidikan berhasil disimpan.');
      
      // Reset form
      setFormData({
        tahun_ajaran: new Date().getFullYear(),
        semester: 'GANJIL',
        mata_kuliah: '',
        kelas: '',
        sks: 3,
      });
      setCreateFile(null);
      setCreateFileName(null);
      if (createFileRef.current) createFileRef.current.value = '';

      await fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Terjadi error saat menyimpan data.');
    } finally {
      setIsSaving(false);
    }
  };

  // =========================
  // 3. Modal Logic (Open & Upload)
  // =========================
  const openUpload = (id: number) => {
    setUploadId(id);
    setUploadFile(null);
    setUploadFileName(null);
    setShowUpload(true);
    if (uploadInputRef.current) uploadInputRef.current.value = '';
  };

  const handleUpload = async () => {
    if (!uploadId) return;
    if (!uploadFile) {
      toast.error('Pilih file bukti terlebih dahulu.');
      return;
    }

    if (uploadFile.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file terlalu besar (Maks 5MB).');
      return;
    }

    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append('file_bukti', uploadFile);

      const res = await fetch(`${API_BASE}/api/v1/pendidikan/${uploadId}`, {
        method: 'PUT',
        body: fd,
        credentials: "include",
      });

      const text = await res.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch {
        // Abaikan jika bukan JSON
      }

      if (!res.ok) {
        throw new Error(json?.message || text || 'Gagal upload bukti.');
      }

      toast.success('Bukti berhasil diupload.');
      setShowUpload(false);
      await fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Terjadi error saat upload bukti.');
    } finally {
      setIsUploading(false);
    }
  };

  // =========================
  // 4. Delete (DELETE)
  // =========================
  const handleDelete = (id: number) => {
    toast.warning('Yakin ingin menghapus data ini?', {
      action: {
        label: 'Hapus',
        onClick: async () => {
          try {
            const res = await fetch(`${API_BASE}/api/v1/pendidikan/${id}`, {
              method: 'DELETE',
              credentials: "include",
            });
            
            if (!res.ok) {
              const json = await res.json();
              throw new Error(json?.message || 'Gagal menghapus data.');
            }
            
            setData((prev) => prev.filter((x) => x.id !== id));
            toast.success('Data berhasil dihapus.');
          } catch (e: any) {
            toast.error(e.message || 'Terjadi kesalahan saat menghapus.');
          }
        },
      },
    });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 border-b pb-4">
        Bidang Pendidikan (Pengajaran)
      </h1>

      {/* Form Input */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-4">Informasi Pendidikan</h2>
        
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Baris 1: Tahun Ajaran & Semester */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tahun Ajaran</label>
              <input
                type="number"
                value={formData.tahun_ajaran}
                onChange={(e) => setFormData({ ...formData, tahun_ajaran: Number(e.target.value) })}
                className="mt-1 block w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Semester</label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="mt-1 block w-full p-2 border rounded-md"
              >
                <option value="GANJIL">GANJIL</option>
                <option value="GENAP">GENAP</option>
              </select>
            </div>
          </div>

          {/* Baris 2: Mata Kuliah & SKS (SEJAJAR) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Mata Kuliah</label>
              <input
                type="text"
                value={formData.mata_kuliah}
                onChange={(e) => setFormData({ ...formData, mata_kuliah: e.target.value })}
                className="mt-1 block w-full p-2 border rounded-md placeholder:italic placeholder:text-gray-400 placeholder:text-xs"
                placeholder="Contoh: Kalkulus 2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">SKS</label>
              <input
                type="number"
                value={formData.sks || ''}
                onChange={(e) => setFormData({ ...formData, sks: Number(e.target.value) })}
                className="mt-1 block w-full p-2 border rounded-md"
                placeholder="Contoh: 3"
                required
              />
            </div>
          </div>

          {/* Baris 3: Kelas & File Bukti (SEJAJAR) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Kelas</label>
              <input
                type="text"
                value={formData.kelas}
                onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                className="mt-1 block w-full p-2 border rounded-md placeholder:italic placeholder:text-gray-400 placeholder:text-xs"
                placeholder="Contoh: REG A1"
                required
              />
            </div>

            {/* File Bukti */}
            <div>
              <label className="block text-sm font-medium text-gray-700">File Bukti (Opsional)</label>
              <input
                ref={createFileRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setCreateFile(file);
                  setCreateFileName(file ? file.name : null);
                }}
              />
              
              <div className="mt-1 flex items-center gap-3">
                <div className="flex items-center gap-2 w-full min-w-0 p-2.5 border rounded-md bg-white text-sm text-gray-700 h-[42px]">
                  <span className="shrink-0">📄</span>
                  <span className="truncate">{createFileName || 'Belum Pilih File'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => createFileRef.current?.click()}
                  className="block w-full p-2.5 rounded-md bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition"
                  >
                  {createFileName ? 'Ganti' : 'Pilih File'}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">Opsional. Jika diisi, status otomatis “SUDAH UPLOAD”.</p>

            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded-md bg-indigo-600 py-2 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 transition mt-6"
          >
            {isSaving ? 'Menyimpan...' : 'Simpan Data'}
          </button>
        </form>
      </div>

      {/* Tabel Data */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <div className="flex justify-between items-center mb-4 border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-800">Riwayat Pendidikan</h2>
            <button onClick={fetchData} className="text-sm text-indigo-600 hover:underline">Refresh Data</button>
        </div>

        {isLoading ? (
          <p className="mt-4 text-gray-600 text-center py-4">Memuat data...</p>
        ) : data.length === 0 ? (
          <p className="mt-4 text-gray-500 text-center py-4">Belum ada data pendidikan.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tahun / Sem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mata Kuliah
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kelas / SKS
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.tahun_semester}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {item.mata_kuliah}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.kelas_sks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          item.status === 'SUDAH_UPLOAD'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                      <button
                        onClick={() => openUpload(item.id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        {item.status === 'SUDAH_UPLOAD' ? 'Ubah Bukti' : 'Upload Bukti'}
                      </button>
                      {item.file_path && (
                        <button
                          onClick={() => openBuktiNewTab(item.file_path!)}
                          className="text-gray-600 hover:text-gray-900 mr-4"
                        >
                          Lihat Bukti
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Upload Susulan */}
      {showUpload && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              Upload Bukti Pendidikan
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Silakan upload file bukti pengajaran (SK, Jadwal, dll).
            </p>

            <input
              ref={uploadInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setUploadFile(file);
                setUploadFileName(file ? file.name : null);
              }}
            />

            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2 w-full min-w-0 p-3 border rounded-lg bg-gray-50 text-sm text-gray-700">
                <span className="shrink-0 text-xl">📄</span>
                <span className="truncate font-medium">
                  {uploadFileName || 'Belum ada file dipilih'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => uploadInputRef.current?.click()}
                className="shrink-0 px-4 py-3 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition"
              >
                {uploadFileName ? 'Ganti' : 'Pilih'}
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowUpload(false)}
                disabled={isUploading}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="flex-1 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-70 transition"
              >
                {isUploading ? 'Mengupload...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}