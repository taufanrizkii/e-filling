// app/penunjang/page.tsx

'use client';

import React, { useState } from 'react';

// Tipe data untuk Kegiatan Penunjang
interface Penunjang {
    id: number;
    namaKegiatan: string;
    kategori: string;
    tingkat: string;
    peran: string;
    tanggal: string; // Format YYYY-MM-DD
    statusBukti: 'Belum Upload' | 'Sudah Upload';
}

// Data dummy awal
const initialPenunjang: Penunjang[] = [
    {
        id: 1,
        namaKegiatan: 'Panitia Wisuda Universitas Widyatama Gelombang 1',
        kategori: 'Kepanitiaan',
        tingkat: 'Universitas',
        peran: 'Anggota Divisi Acara',
        tanggal: '2024-05-20',
        statusBukti: 'Sudah Upload'
    },
    {
        id: 2,
        namaKegiatan: 'Seminar Nasional Artificial Intelligence',
        kategori: 'Seminar/Workshop',
        tingkat: 'Nasional',
        peran: 'Peserta',
        tanggal: '2024-08-10',
        statusBukti: 'Belum Upload'
    },
];

export default function PenunjangPage() {
    const [data, setData] = useState<Penunjang[]>(initialPenunjang);
    const [formData, setFormData] = useState({
        namaKegiatan: '', kategori: '', tingkat: '', peran: '', tanggal: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newEntry: Penunjang = {
            id: Date.now(),
            ...formData,
            statusBukti: 'Belum Upload',
        };
        setData([...data, newEntry]);
        // Reset form
        setFormData({ namaKegiatan: '', kategori: '', tingkat: '', peran: '', tanggal: '' });
    };

    const handleUpload = (id: number) => {
        alert(`Membuka dialog unggah Sertifikat/SK Panitia untuk ID: ${id}.`);
        setData(data.map(item =>
            item.id === id ? { ...item, statusBukti: 'Sudah Upload' } : item
        ));
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            setData(data.filter(item => item.id !== id));
        }
    };

    return (
        <div className="space-y-10">
            <h1 className="text-3xl font-bold text-gray-800 border-b pb-4">
                E-Filling Bidang Penunjang & Lain-lain
            </h1>

            {/* Form Input Bidang Penunjang */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Input Kegiatan Penunjang</h2>
                <p className="text-sm text-gray-500 mb-6">
                    Masukkan data kegiatan pendukung seperti: Kepanitiaan Kampus, Anggota Organisasi Profesi, Peserta Seminar, atau Penghargaan.
                </p>

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Nama Kegiatan</label>
                        <input
                            type="text"
                            name="namaKegiatan"
                            value={formData.namaKegiatan}
                            onChange={(e) => setFormData({ ...formData, namaKegiatan: e.target.value })}
                            required
                            placeholder="Contoh: Anggota Panitia Akreditasi Prodi"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Kategori Kegiatan</label>
                        <select
                            name="kategori"
                            value={formData.kategori}
                            onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        >
                            <option value="">Pilih Kategori</option>
                            <option value="Kepanitiaan">Kepanitiaan (Panitia Pusat/Daerah)</option>
                            <option value="Organisasi Profesi">Anggota Organisasi Profesi</option>
                            <option value="Seminar/Workshop">Peserta Seminar/Workshop</option>
                            <option value="Penghargaan">Penghargaan/Tanda Jasa</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Tingkat</label>
                        <select
                            name="tingkat"
                            value={formData.tingkat}
                            onChange={(e) => setFormData({ ...formData, tingkat: e.target.value })}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        >
                            <option value="">Pilih Tingkat</option>
                            <option value="Lokal/Insitusi">Lokal / Institusi</option>
                            <option value="Nasional">Nasional</option>
                            <option value="Internasional">Internasional</option>
                        </select>
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Peran / Jabatan</label>
                        <input
                            type="text"
                            name="peran"
                            value={formData.peran}
                            onChange={(e) => setFormData({ ...formData, peran: e.target.value })}
                            required
                            placeholder="Contoh: Ketua / Anggota / Peserta"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Tanggal Pelaksanaan</label>
                        <input
                            type="date"
                            name="tanggal"
                            value={formData.tanggal}
                            onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        />
                    </div>

                    <div className="col-span-2 pt-2">
                        <button
                            type="submit"
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                        >
                            Simpan Data Penunjang
                        </button>
                    </div>
                </form>
            </div>

            {/* Tabel Data Penunjang yang Sudah Diinput */}
            <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto border border-gray-200">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Riwayat Kegiatan Penunjang</h2>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kegiatan</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori & Peran</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tingkat</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Bukti</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((item) => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                                    <div className="font-medium">{item.namaKegiatan}</div>
                                    <div className="text-xs text-gray-500">{item.tanggal}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {item.kategori}
                                    <span className="text-xs text-gray-500 block">Sebagai: {item.peran}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {item.tingkat}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.statusBukti === 'Sudah Upload' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {item.statusBukti}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => handleUpload(item.id)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                        title="Unggah Sertifikat/SK"
                                    >
                                        Upload
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="text-red-600 hover:text-red-900"
                                        title="Hapus Data"
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}