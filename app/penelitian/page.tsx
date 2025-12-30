// app/penelitian/page.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface PenelitianItem {
  id: number;
  judul_penelitian: string;
  jenis_karya: string;
  tahun_terbit: number;
  link_publikasi?: string | null;
  status: 'SUDAH_UPLOAD' | 'BELUM_UPLOAD';
  file_path?: string | null;
}

const API_BASE = 'http://localhost:5000';

export default function PenelitianPage() {
  // =========================
  // State: data + loading
  // =========================
  const [data, setData] = useState<PenelitianItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // =========================
  // State: form create
  // =========================
  const [formData, setFormData] = useState({
    judul_penelitian: '',
    jenis_karya: 'Jurnal Nasional',
    tahun_terbit: new Date().getFullYear(),
    link_publikasi: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  // =========================
  // File create
  // =========================
  const createFileRef = useRef<HTMLInputElement | null>(null);
  const [createFile, setCreateFile] = useState<File | null>(null);
  const [createFileName, setCreateFileName] = useState<string | null>(null);

  // =========================
  // Upload modal (PUT)
  // =========================
  const [showUpload, setShowUpload] = useState(false);
  const [uploadId, setUploadId] = useState<number | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadFileName, setUploadFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  // =========================
  // Preview 
  // =========================
  const openBuktiNewTab = (filePath: string) => {
    const url = `${API_BASE}/uploads/${filePath}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // =========================
  // Fetch
  // =========================
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/penelitian`);
      const json = await res.json();
      if (json?.status === 'success') setData(json.data ?? []);
      else setData([]);
    } catch (e) {
      console.error(e);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =========================
  // Create (POST)
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.judul_penelitian) {
      toast.error('Judul penelitian wajib diisi.');
      return;
    }

    setIsSaving(true);
    try {
      const fd = new FormData();
      fd.append('judul_penelitian', formData.judul_penelitian);
      fd.append('jenis_karya', formData.jenis_karya);
      fd.append('tahun_terbit', formData.tahun_terbit.toString());
      fd.append('link_publikasi', formData.link_publikasi);

      if (createFile) fd.append('file_bukti', createFile);

      const res = await fetch(`${API_BASE}/api/v1/penelitian`, {
        method: 'POST',
        body: fd,
      });

      const json = await res.json();
      if (!res.ok || json?.status !== 'success') {
        toast.error(json?.message || 'Gagal menyimpan data penelitian.');
        return;
      }

      toast.success('Data penelitian berhasil disimpan.');
      setFormData((p) => ({ ...p, judul_penelitian: '', link_publikasi: '' }));

      setCreateFile(null);
      setCreateFileName(null);
      if (createFileRef.current) createFileRef.current.value = '';

      await fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Terjadi error saat menyimpan data.');
    } finally {
      setIsSaving(false);
    }
  };

  // =========================
  // Upload/Ubah bukti (PUT) via modal
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

    // optional: batas ukuran 5MB
    if (uploadFile.size > 5 * 1024 * 1024) {
      toast.error('File terlalu besar! Maksimal 5MB.');
      return;
    }

    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append('file_bukti', uploadFile);

      const res = await fetch(`${API_BASE}/api/v1/penelitian/${uploadId}`, {
        method: 'PUT',
        body: fd,
      });

      const json = await res.json();
      if (!res.ok || json?.status !== 'success') {
        toast.error(json?.message || 'Gagal upload bukti.');
        return;
      }

      toast.success('Bukti berhasil diupload.');
      setShowUpload(false);
      await fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Terjadi error saat upload bukti.');
    } finally {
      setIsUploading(false);
    }
  };


  // =========================
  // Delete (DELETE) with toast confirm
  // =========================
  const handleDelete = (id: number) => {
    toast.warning('Yakin ingin menghapus data ini?', {
      action: {
        label: 'Hapus',
        onClick: async () => {
          try {
            const res = await fetch(`${API_BASE}/api/v1/penelitian/${id}`, {
              method: 'DELETE',
            });
            const json = await res.json();
            if (!res.ok || json?.status !== 'success') {
              throw new Error(json?.message || 'Gagal menghapus data.');
            }
            setData((prev) => prev.filter((x) => x.id !== id));
            toast.success('Data berhasil dihapus.');
          } catch (e: any) {
            toast.error(e.message || 'Terjadi kesalahan.');
          }
        },
      },
    });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 border-b pb-4">Bidang Penelitian (Publikasi, HAKI)</h1>

      {/* Form */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-4">Informasi Penelitian</h2>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Judul Penelitian</label>
            <input
              type="text"
              value={formData.judul_penelitian}
              onChange={(e) => setFormData({ ...formData, judul_penelitian: e.target.value })}
              className="mt-1 block w-full p-2 border rounded-md placeholder:italic placeholder:text-gray-400 placeholder:text-xs"
              placeholder="Contoh: Prediksi Penjualan Menggunakan Prophet"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Jenis Karya</label>
              <select
                value={formData.jenis_karya}
                onChange={(e) => setFormData({ ...formData, jenis_karya: e.target.value })}
                className="mt-1 block w-full p-2 border rounded-md"
              >
                <option>Jurnal Nasional</option>
                <option>Jurnal Internasional</option>
                <option>Prosiding</option>
                <option>Buku</option>
                <option>HKI</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tahun Terbit</label>
              <input
                type="number"
                value={formData.tahun_terbit}
                onChange={(e) => setFormData({ ...formData, tahun_terbit: Number(e.target.value) })}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Link Publikasi</label>
                <input
                type="text"
                value={formData.link_publikasi}
                onChange={(e) => setFormData({ ...formData, link_publikasi: e.target.value })}
                className="mt-1 block w-full p-2 border rounded-md placeholder:italic placeholder:text-gray-400 placeholder:text-xs"
                placeholder="https://..."
                />
                <p className="mt-1 text-xs text-gray-500">
                Opsional. Jika tidak diisi, link akan otomatis “-”.
                </p>
            </div>

            {/* File bukti (opsional) */}
            <div>
                <label className="block text-sm font-medium text-gray-700">File Bukti (PDF)</label>

                <input
                ref={createFileRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setCreateFile(file);
                    setCreateFileName(file ? file.name : null);
                }}
                />

                <div className="mt-1 flex items-center gap-3">
                <div className="flex items-center gap-2 w-full min-w-0 p-2.5 border rounded-md bg-white text-sm text-gray-700">
                    <span className="shrink-0">📄</span>
                    <span className="truncate">{createFileName || 'Belum Pilih File'}</span>
                </div>

                <button
                    type="button"
                    onClick={() => createFileRef.current?.click()}
                    className="block w-full p-2.5 rounded-md bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition"
                >
                    {createFileName ? 'Ganti File' : 'Pilih File'}
                </button>
                </div>

                <p className="mt-1 text-xs text-gray-500">Opsional. Jika diisi, status otomatis “SUDAH UPLOAD”.</p>
            </div>
          </div>

          

          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded-md bg-indigo-600 py-2 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {isSaving ? 'Menyimpan...' : 'Simpan Data'}
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-4">Riwayat Penelitian</h2>

        {isLoading ? (
          <p className="mt-4 text-gray-600">Memuat data...</p>
        ) : data.length === 0 ? (
          <p className="mt-4 text-gray-600">Belum ada data penelitian.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Info</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Bukti</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="font-bold">{item.judul_penelitian}</div>
                      {item.link_publikasi ? (
                        <a className="text-xs text-indigo-600 hover:underline" href={item.link_publikasi} target="_blank" rel="noreferrer">
                          {item.link_publikasi}
                        </a>
                      ) : (
                        <div className="text-xs text-gray-500 mt-1">-</div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>{item.jenis_karya}</div>
                      <div className="text-xs text-gray-500 mt-1">Tahun: {item.tahun_terbit}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={
                          item.status === 'SUDAH_UPLOAD'
                            ? 'inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800'
                            : 'inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800'
                        }
                      >
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                        onClick={() => openUpload(item.id)}
                        type="button"
                      >
                        {item.status === 'SUDAH_UPLOAD' ? 'Ubah Bukti' : 'Upload Bukti'}
                      </button>

                      {item.file_path ? (
                        <button
                            className="ml-4 text-gray-600 hover:text-gray-900 font-medium"
                            onClick={() => openBuktiNewTab(item.file_path!)}
                            type="button"
                        >
                            Lihat Bukti
                        </button>
                        ) : null}

                      <button
                        className="ml-4 text-red-600 hover:text-red-800 font-medium"
                        onClick={() => handleDelete(item.id)}
                        type="button"
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

      {/* Upload modal */}
      {showUpload ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-800">Upload Bukti Penelitian</h3>
            <p className="mt-1 text-sm text-gray-600">Format: PDF</p>

            <input
              ref={uploadInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setUploadFile(file);
                setUploadFileName(file ? file.name : null);
              }}
            />

            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center gap-2 w-full min-w-0 p-2.5 border rounded-md bg-white text-sm text-gray-700">
                <span className="shrink-0">📄</span>
                <span className="truncate">{uploadFileName || 'Belum Pilih File'}</span>
              </div>

              <button
                type="button"
                onClick={() => uploadInputRef.current?.click()}
                className="shrink-0 p-2.5 rounded-md bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition"
              >
                {uploadFileName ? 'Ganti File' : 'Pilih File'}
              </button>
            </div>

            <div className="mt-6 flex justify-center gap-2">
              <button
                className="rounded-md w-full border px-4 py-2 text-gray-700 hover:bg-gray-50"
                onClick={() => setShowUpload(false)}
                disabled={isUploading}
              >
                Batal
              </button>
              <button
                className="rounded-md w-full bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? 'Mengupload...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      
    </div>
  );
}
