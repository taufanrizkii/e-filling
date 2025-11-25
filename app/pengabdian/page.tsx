// app/pengabdian/page.tsx

'use client';

import React, { useState } from 'react';

// Tipe data untuk Pengabdian Masyarakat
interface Pengabdian {
    id: number;
    namaKegiatan: string;
    lokasi: string;
    tanggal: string; // Format YYYY-MM-DD
    sumberDana: string;
    statusBukti: 'Belum Upload' | 'Sudah Upload';
}

const initialPengabdian: Pengabdian[] = [
    { id: 1, namaKegiatan: 'Pelatihan Literasi Digital di Desa X', lokasi: 'Desa X, Kab. Y', tanggal: '2024-06-15', sumberDana: 'Mandiri', statusBukti: 'Belum Upload' },
];

export default function PengabdianPage() {
    const [data, setData] = useState<Pengabdian[]>(initialPengabdian);
    const [formData, setFormData] = useState({
        namaKegiatan: '', lokasi: '', tanggal: '', sumberDana: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newEntry: Pengabdian = {
            id: Date.now(),
            ...formData,
            statusBukti: 'Belum Upload',
        };
        setData([...data, newEntry]);
        setFormData({ namaKegiatan: '', lokasi: '', tanggal: '', sumberDana: '' });
    };

    const handleUpload = (id: number) => {
        alert(`Membuka dialog unggah Dokumentasi/Surat Tugas untuk ID: ${id}.`);
        setData(data.map(item =>
            item.id === id ? { ...item, statusBukti: 'Sudah Upload' } : item
        ));
    };

    return (
        <div className="space-y-10">
            <h1 className="text-3xl font-bold text-gray-800 border-b pb-4">
                E-Filling Bidang Pengabdian kepada Masyarakat
            </h1>

            {/* Form Input Bidang Pengabdian */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Input Data Kegiatan Pengabdian</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Nama Kegiatan</label>
                        <textarea
                            name="namaKegiatan"
                            value={formData.namaKegiatan}
                            onChange={(e) => setFormData({ ...formData, namaKegiatan: e.target.value })}
                            required
                            rows={2}
                            placeholder="Contoh: Pelatihan Pengolahan Sampah Organik"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Lokasi Pelaksanaan</label>
                        <input
                            type="text"
                            name="lokasi"
                            value={formData.lokasi}
                            onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                            required
                            placeholder="Contoh: Balai Desa Sukamaju"
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

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Sumber Dana (Opsional)</label>
                        <input
                            type="text"
                            name="sumberDana"
                            value={formData.sumberDana}
                            onChange={(e) => setFormData({ ...formData, sumberDana: e.target.value })}
                            placeholder="Contoh: Dana Internal Kampus / Mandiri"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        />
                    </div>

                    <div className="col-span-2 pt-2">
                        <button
                            type="submit"
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
                        >
                            Simpan Data Pengabdian
                        </button>
                    </div>
                </form>
            </div>

            {/* Tabel Data Pengabdian yang Sudah Diinput */}
            <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto border border-gray-200">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Daftar Kegiatan Pengabdian</h2>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Kegiatan</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi & Tanggal</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Bukti</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((item) => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">{item.namaKegiatan}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {item.lokasi}
                                    <span className="text-xs text-gray-500 block">{item.tanggal}</span>
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
                                        title="Unggah Dokumentasi/Surat Tugas"
                                    >
                                        Upload
                                    </button>
                                    {/* ... Tambahkan tombol Edit/Hapus ... */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}