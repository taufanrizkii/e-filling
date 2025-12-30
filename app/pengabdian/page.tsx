// app/pengabdian/page.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { toast } from "sonner";

interface PengabdianItem {
  id: number;
  namaKegiatan: string;
  lokasi: string;
  tanggal: string; // YYYY-MM-DD
  sumberDana: string;
  statusBukti: 'Belum Upload' | 'Sudah Upload';
  file_path?: string | null;
}

type FormState = {
  namaKegiatan: string;
  lokasi: string;
  tanggal: string;
  sumberDana: string;
};

const API_BASE = 'http://localhost:5000';

export default function PengabdianPage() {
  // =========================
  // State: data + loading
  // =========================
  const [data, setData] = useState<PengabdianItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // =========================
  // State: form create
  // =========================
  const [formData, setFormData] = useState<FormState>({
    namaKegiatan: '',
    lokasi: '',
    tanggal: '',
    sumberDana: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  // =========================
  // State + ref: file create
  // =========================
  const createFileRef = useRef<HTMLInputElement | null>(null);
  const [createFile, setCreateFile] = useState<File | null>(null);
  const [createFileName, setCreateFileName] = useState<string | null>(null);

  // =========================
  // State: upload modal (PUT)
  // =========================
  const [showUpload, setShowUpload] = useState(false);
  const [uploadId, setUploadId] = useState<number | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  // =========================
  // State: preview modal
  // =========================
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewIsPdf, setPreviewIsPdf] = useState(false);

  // =========================
  // Helpers
  // =========================
  const formatTanggal = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  // =========================
  // API calls
  // =========================
  const fetchPengabdian = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/api/v1/pengabdian`, { credentials: "include" });
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

  // =========================
  // Effects
  // =========================
  useEffect(() => {
    fetchPengabdian();
  }, []);

  // =========================
  // Actions: create (POST)
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.namaKegiatan || !formData.lokasi || !formData.tanggal) {
      toast.error("Nama kegiatan, lokasi, dan tanggal wajib diisi.");
      return;
    }

    setIsSaving(true);
    try {
      const fd = new FormData();
      fd.append('nama_kegiatan', formData.namaKegiatan);
      fd.append('lokasi_pelaksanaan', formData.lokasi);
      fd.append('tanggal_pelaksanaan', formData.tanggal);
      fd.append('sumber_dana', formData.sumberDana);

      if (createFile) fd.append('file_bukti', createFile);

      const res = await fetch(`${API_BASE}/api/v1/pengabdian`, {
        method: 'POST',
        body: fd,
        credentials: "include",
      });

      const json = await res.json();
      if (!res.ok || json?.status !== 'success') {
        toast.error(json?.message || 'Gagal menyimpan data pengabdian.');
        return;
      }

      // reset form + file input
      setFormData({ namaKegiatan: '', lokasi: '', tanggal: '', sumberDana: '' });
      setCreateFile(null);
      setCreateFileName(null);
      if (createFileRef.current) createFileRef.current.value = '';

      await fetchPengabdian();
    } catch (err) {
      console.error(err);
      toast.error('Terjadi error saat menyimpan data.');
    } finally {
      setIsSaving(false);
    }
  };

  // =========================
  // Actions: upload modal (PUT)
  // =========================
  const openUpload = (id: number) => {
    setUploadId(id);
    setUploadFile(null);
    setSelectedFileName(null);
    setShowUpload(true);
    if (uploadInputRef.current) uploadInputRef.current.value = '';
  };

  const handleUploadSusulan = async () => {
    if (!uploadId) return;

    if (!uploadFile) {
      toast.error('Pilih file bukti terlebih dahulu.');
      return;
    }

    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append('file_bukti', uploadFile);

      const res = await fetch(`${API_BASE}/api/v1/pengabdian/${uploadId}`, {
        method: 'PUT',
        body: fd,
        credentials: "include",
      });

      const json = await res.json();
      if (!res.ok || json?.status !== 'success') {
        toast.error(json?.message || 'Gagal upload bukti.');
        return;
      }

      toast.success("Bukti berhasil diupload.");
      setShowUpload(false);
      await fetchPengabdian();
    } catch (err) {
      console.error(err);
      toast.error('Terjadi error saat upload bukti.');
    } finally {
      setIsUploading(false);
    }
  };

  // =========================
  // Actions: preview modal
  // =========================
  const openPreview = (filePath: string) => {
    const url = `${API_BASE}/uploads/${filePath}`;
    setPreviewUrl(url);
    setPreviewIsPdf(filePath.toLowerCase().endsWith('.pdf'));
    setShowPreview(true);
  };

  // =========================
  // Actions: delete
  // =========================
  const handleDelete = async (id: number) => {
  toast.warning("Yakin ingin menghapus data ini?", {
      action: {
        label: "Hapus",
        onClick: async () => {
          try {
            const r = await fetch(`${API_BASE}/api/v1/pengabdian/${id}`, {
              method: "DELETE",
              credentials: "include",
            });

            const j = await r.json();
            if (!r.ok) throw new Error(j?.message ?? "Gagal menghapus data");

            setData((prev) => prev.filter((x) => x.id !== id));
            toast.success("Data berhasil dihapus.");
          } catch (e: any) {
            toast.error(e.message ?? "Terjadi kesalahan.");
          }
        },
      },
    });
  };

  // =========================
  // Render
  // =========================
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 border-b pb-4">
        Bidang Pengabdian Kepada Masyarakat (PKM)
      </h1>

      {/* Form input */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-4">
          Informasi Pengabdian (PKM)
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Kegiatan</label>
            <input
              value={formData.namaKegiatan}
              onChange={(e) => setFormData({ ...formData, namaKegiatan: e.target.value })}
              className="mt-1 block w-full p-2 border rounded-md placeholder:italic placeholder:text-gray-400 placeholder:text-xs"
              placeholder="Contoh: Pelatihan Pengolahan Sampah Organik"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Lokasi Pelaksanaan</label>
              <input
                value={formData.lokasi}
                onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                className="mt-1 block w-full p-2 border rounded-md placeholder:italic placeholder:text-gray-400 placeholder:text-xs"
                placeholder="Contoh: Balai Desa Sukamaju"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tanggal Pelaksanaan</label>
              <input
                type="date"
                value={formData.tanggal}
                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Sumber Dana</label>
              <input
                value={formData.sumberDana}
                onChange={(e) => setFormData({ ...formData, sumberDana: e.target.value })}
                className="mt-1 block w-full p-2 border rounded-md placeholder:italic placeholder:text-gray-400 placeholder:text-xs"
                placeholder="Contoh: Dana Internal Kampus / Mandiri"
              />
              <p className="mt-1 text-xs text-gray-500">
                Opsional. Jika tidak diisi, maka tidak akan ditampilkan.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">File Bukti (PDF/JPG/PNG)</label>

              <input
                ref={createFileRef}
                type="file"
                accept="application/pdf,image/*"
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

              <p className="mt-1 text-xs text-gray-500">
                Opsional. Jika diisi, status akan otomatis “SUDAH UPLOAD”.
              </p>
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
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-4">Daftar Kegiatan Pengabdian</h2>

        {isLoading ? (
          <p className="mt-4 text-gray-600">Memuat data...</p>
        ) : data.length === 0 ? (
          <p className="mt-4 text-gray-600">Belum ada data pengabdian.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Kegiatan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lokasi & Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status Bukti
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.namaKegiatan}</td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-medium">{item.lokasi}</div>
                      <div className="text-xs text-gray-500">{formatTanggal(item.tanggal)}</div>
                      {item.sumberDana ? (
                        <div className="text-xs text-gray-500">Dana: {item.sumberDana}</div>
                      ) : null}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={
                          item.statusBukti === 'Sudah Upload'
                            ? 'inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800'
                            : 'inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800'
                        }
                      >
                        {item.statusBukti.toUpperCase()}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                        onClick={() => openUpload(item.id)}
                        type="button"
                      >
                        {item.statusBukti === 'Sudah Upload' ? 'Ubah Bukti' : 'Upload Bukti'}
                      </button>

                      {item.file_path ? (
                        <button
                          className="ml-4 text-gray-600 hover:text-gray-900 font-medium"
                          onClick={() => openPreview(item.file_path!)}
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
            <h3 className="text-lg font-semibold text-gray-800">Upload Bukti Pengabdian</h3>
            <p className="mt-1 text-sm text-gray-600">Format: PDF/JPG/PNG</p>

            <input
              ref={uploadInputRef}
              type="file"
              accept="application/pdf,image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setUploadFile(file);
                setSelectedFileName(file ? file.name : null);
              }}
            />

            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center gap-2 w-full min-w-0 p-2.5 border rounded-md bg-white text-sm text-gray-700">
                <span className="shrink-0">📄</span>
                <span className="truncate">{selectedFileName || 'Belum Pilih File'}</span>
              </div>

              <button
                type="button"
                onClick={() => uploadInputRef.current?.click()}
                className="shrink-0 p-2.5 rounded-md bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition"
              >
                {selectedFileName ? 'Ganti File' : 'Pilih File'}
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
                onClick={handleUploadSusulan}
                disabled={isUploading}
              >
                {isUploading ? 'Mengupload...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Preview modal */}
      {showPreview && previewUrl ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-4xl rounded-lg bg-white p-4 shadow">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-semibold text-gray-800">Preview Bukti</h3>

              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Tutup
              </button>
            </div>

            <div className="mt-4">
              {previewIsPdf ? (
                <iframe src={previewUrl} className="h-[70vh] w-full rounded-md border" title="Preview PDF" />
              ) : (
                <img
                  src={previewUrl}
                  alt="Preview Bukti"
                  className="mx-auto max-h-[70vh] w-full rounded-md object-contain"
                />
              )}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Buka di Tab Baru
              </a>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
