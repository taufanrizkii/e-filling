// app/pengabdian/page.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';

interface PengabdianItem {
  id: number;
  namaKegiatan: string;
  lokasi: string;
  tanggal: string; // YYYY-MM-DD
  sumberDana: string;
  statusBukti: 'Belum Upload' | 'Sudah Upload';
  file_path?: string | null;
}

export default function PengabdianPage() {
  const [data, setData] = useState<PengabdianItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    namaKegiatan: '',
    lokasi: '',
    tanggal: '',
    sumberDana: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Upload modal state
  const [showUpload, setShowUpload] = useState(false);
  const [uploadId, setUploadId] = useState<number | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  const fetchPengabdian = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:5000/api/v1/pengabdian');
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
    fetchPengabdian();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.namaKegiatan || !formData.lokasi || !formData.tanggal) {
      alert('Nama kegiatan, lokasi pelaksanaan, dan tanggal pelaksanaan wajib diisi.');
      return;
    }

    setIsSaving(true);
    try {
      const fd = new FormData();
      fd.append('nama_kegiatan', formData.namaKegiatan);
      fd.append('lokasi_pelaksanaan', formData.lokasi);
      fd.append('tanggal_pelaksanaan', formData.tanggal);
      fd.append('sumber_dana', formData.sumberDana);

      const res = await fetch('http://localhost:5000/api/v1/pengabdian', {
        method: 'POST',
        body: fd,
      });

      const json = await res.json();
      if (!res.ok || json?.status !== 'success') {
        alert(json?.message || 'Gagal menyimpan data pengabdian.');
        return;
      }

      setFormData({ namaKegiatan: '', lokasi: '', tanggal: '', sumberDana: '' });
      await fetchPengabdian();
    } catch (err) {
      console.error(err);
      alert('Terjadi error saat menyimpan data.');
    } finally {
      setIsSaving(false);
    }
  };

  const openUpload = (id: number) => {
    setUploadId(id);
    setUploadFile(null);
    setShowUpload(true);
    if (uploadInputRef.current) uploadInputRef.current.value = '';
  };

  const handleUploadSusulan = async () => {
    if (!uploadId) return;
    if (!uploadFile) {
      alert('Pilih file bukti terlebih dahulu.');
      return;
    }

    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append('file_bukti', uploadFile);

      const res = await fetch(`http://localhost:5000/api/v1/pengabdian/${uploadId}`, {
        method: 'PUT',
        body: fd,
      });

      const json = await res.json();
      if (!res.ok || json?.status !== 'success') {
        alert(json?.message || 'Gagal upload bukti.');
        return;
      }

      setShowUpload(false);
      await fetchPengabdian();
    } catch (err) {
      console.error(err);
      alert('Terjadi error saat upload bukti.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const ok = window.confirm("Yakin ingin menghapus data pengabdian ini?");
    if (!ok) return;

    try {
        const r = await fetch(`http://localhost:5000/api/v1/pengabdian/${id}`, {
        method: "DELETE",
        });
        const j = await r.json();
        if (!r.ok) throw new Error(j?.message ?? "Gagal menghapus data");

        setData((prev) => prev.filter((x) => x.id !== id));
    } catch (e: any) {
        alert(e.message ?? "Terjadi error saat menghapus data");
    }
  };

  const formatTanggal = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">E-Filling Bidang Pengabdian kepada Masyarakat</h1>

        {/* Form input */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800">Input Data Kegiatan Pengabdian</h2>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Kegiatan</label>
              <input
                value={formData.namaKegiatan}
                onChange={(e) => setFormData({ ...formData, namaKegiatan: e.target.value })}
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                placeholder="Contoh: Pelatihan Pengolahan Sampah Organik"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Lokasi Pelaksanaan</label>
                <input
                  value={formData.lokasi}
                  onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                  placeholder="Contoh: Balai Desa Sukamaju"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tanggal Pelaksanaan</label>
                <input
                  type="date"
                  value={formData.tanggal}
                  onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Sumber Dana (Opsional)</label>
              <input
                value={formData.sumberDana}
                onChange={(e) => setFormData({ ...formData, sumberDana: e.target.value })}
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                placeholder="Contoh: Dana Internal Kampus / Mandiri"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full rounded-md bg-green-600 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-60"
            >
              {isSaving ? 'Menyimpan...' : 'Simpan Data Pengabdian'}
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800">Daftar Kegiatan Pengabdian</h2>

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
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                        {item.sumberDana ? <div className="text-xs text-gray-500">Dana: {item.sumberDana}</div> : null}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={
                            item.statusBukti === 'Sudah Upload'
                              ? 'inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800'
                              : 'inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800'
                          }
                        >
                          {item.statusBukti}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                            className="text-indigo-600 hover:text-indigo-900 font-medium"
                            onClick={() => openUpload(item.id)}
                            >
                            {item.statusBukti === "Sudah Upload" ? "Ubah Bukti" : "Upload Bukti"}
                        </button>
                        {item.file_path ? (
                          <a
                            className="ml-4 text-gray-600 hover:text-gray-900"
                            href={`http://localhost:5000/uploads/${item.file_path}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Lihat
                          </a>
                        ) : null}
                        <button
                            className="ml-4 text-red-600 hover:text-red-800 font-medium"
                            onClick={() => handleDelete(item.id)}
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
              className="mt-4 w-full"
              onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
            />

            <div className="mt-6 flex justify-end gap-2">
              <button
                className="rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-50"
                onClick={() => setShowUpload(false)}
                disabled={isUploading}
              >
                Batal
              </button>
              <button
                className="rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                onClick={handleUploadSusulan}
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
