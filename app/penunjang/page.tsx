'use client';

import React, { useState, useEffect } from 'react';

// Interface sesuai output dari API Backend
interface Penunjang {
    id: number;
    nama_kegiatan: string;
    tingkat: string;
    peran: string;
    tahun_semester: string; // Gabungan tahun & semester dari backend
    status: 'SUDAH_UPLOAD' | 'BELUM_UPLOAD';
}

export default function PenunjangPage() {
    const [data, setData] = useState<Penunjang[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Form State: Disesuaikan dengan kolom Database
    const [formData, setFormData] = useState({
        namaKegiatan: '',
        tingkat: '',
        peran: '',
        tahunAjaran: new Date().getFullYear().toString(), // Default tahun sekarang
        semester: 'GANJIL'
    });

    // 1. FETCH DATA DARI DATABASE
    const fetchData = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/v1/penunjang');
            const result = await res.json();
            if (result.status === 'success') {
                setData(result.data);
            }
        } catch (error) {
            console.error("Gagal mengambil data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 2. SUBMIT FORM (Sesuai Database)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Gunakan FormData untuk mengirim data multipart/form-data
        const dataToSend = new FormData();
        
        // PENTING: Key string di sini harus sama persis dengan req.body di Controller
        dataToSend.append("nama_kegiatan", formData.namaKegiatan);
        dataToSend.append("tingkat", formData.tingkat);
        dataToSend.append("peran", formData.peran);
        dataToSend.append("tahun_ajaran", formData.tahunAjaran);
        dataToSend.append("semester", formData.semester);

        try {
            const res = await fetch('http://localhost:5000/api/v1/penunjang', {
                method: 'POST',
                body: dataToSend, 
            });

            const result = await res.json();

            if (res.ok) {
                alert("✅ Data berhasil disimpan ke Database!");
                setFormData({ ...formData, namaKegiatan: '', peran: '' }); // Reset sebagian
                fetchData(); // Refresh tabel
            } else {
                alert("❌ Gagal menyimpan: " + result.message);
            }
        } catch (error) {
            console.error("Error submit:", error);
            alert("Terjadi kesalahan koneksi ke server.");
        } finally {
            setIsLoading(false);
        }
    };

    // 3. UPLOAD FILE BUKTI
    const handleUploadClick = (id: number) => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'application/pdf, image/*'; // Hanya PDF atau Gambar

        fileInput.onchange = async (e: any) => {
            const file = e.target.files[0];
            if (!file) return;

            // Validasi ukuran di frontend (opsional, max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("File terlalu besar! Maksimal 5MB.");
                return;
            }

            const uploadData = new FormData();
            uploadData.append("file_bukti", file); // Key harus 'file_bukti' sesuai Multer

            try {
                const res = await fetch(`http://localhost:5000/api/v1/penunjang/${id}`, {
                    method: 'PUT',
                    body: uploadData
                });
                
                if (res.ok) {
                    alert("✅ Bukti berhasil diupload!");
                    fetchData();
                } else {
                    const result = await res.json();
                    alert("Gagal upload: " + result.message);
                }
            } catch (err) {
                console.error(err);
                alert("Error saat upload file.");
            }
        };

        fileInput.click();
    };

    return (
        <div className="space-y-10">
            <h1 className="text-3xl font-bold text-gray-800 border-b pb-4">
                E-Filling Bidang Penunjang
            </h1>

            {/* FORM INPUT */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Input Kegiatan Baru</h2>
                
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    
                    {/* Tahun Ajaran */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Tahun Ajaran</label>
                        <input
                            type="number"
                            value={formData.tahunAjaran}
                            onChange={(e) => setFormData({ ...formData, tahunAjaran: e.target.value })}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            placeholder="Contoh: 2024"
                        />
                    </div>

                    {/* Semester */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Semester</label>
                        <select
                            value={formData.semester}
                            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        >
                            <option value="GANJIL">GANJIL</option>
                            <option value="GENAP">GENAP</option>
                        </select>
                    </div>

                    {/* Nama Kegiatan */}
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Nama Kegiatan</label>
                        <input
                            type="text"
                            value={formData.namaKegiatan}
                            onChange={(e) => setFormData({ ...formData, namaKegiatan: e.target.value })}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            placeholder="Contoh: Seminar Nasional AI"
                        />
                    </div>

                    {/* Tingkat */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Tingkat</label>
                        <select
                            value={formData.tingkat}
                            onChange={(e) => setFormData({ ...formData, tingkat: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        >
                            <option value="">Pilih Tingkat...</option>
                            <option value="Lokal">Lokal / Institusi</option>
                            <option value="Nasional">Nasional</option>
                            <option value="Internasional">Internasional</option>
                        </select>
                    </div>

                    {/* Peran */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Peran / Jabatan</label>
                        <input
                            type="text"
                            value={formData.peran}
                            onChange={(e) => setFormData({ ...formData, peran: e.target.value })}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            placeholder="Contoh: Ketua / Peserta"
                        />
                    </div>

                    <div className="col-span-2 pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2 px-4 rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors font-medium shadow-sm"
                        >
                            {isLoading ? 'Menyimpan ke Database...' : 'Simpan Data'}
                        </button>
                    </div>
                </form>
            </div>

            {/* TABEL DATA */}
            <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto border border-gray-200">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Riwayat Kegiatan</h2>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kegiatan</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detail</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Bukti</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                    Belum ada data. Silakan input data baru.
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div className="font-bold">{item.nama_kegiatan}</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {item.tahun_semester}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {/* Menampilkan detail gabungan dari backend */}
                                        {(item as any).detail_kegiatan || `${item.tingkat} (${item.peran})`}
                                    </td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            item.status === 'SUDAH_UPLOAD' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                            {item.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        <button 
                                            onClick={() => handleUploadClick(item.id)}
                                            className="text-indigo-600 hover:text-indigo-900 transition-colors"
                                        >
                                            {item.status === 'SUDAH_UPLOAD' ? 'Ganti File' : 'Upload Bukti'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}