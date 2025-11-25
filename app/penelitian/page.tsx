// app/penelitian/page.tsx

'use client';

import React, { useState } from 'react';

// Tipe data untuk Penelitian/Publikasi
interface Penelitian {
    id: number;
    jenisKarya: string;
    judul: string;
    tahunTerbit: number;
    linkPublikasi: string;
    statusBukti: 'Belum Upload' | 'Sudah Upload';
}

const initialPenelitian: Penelitian[] = [
    { id: 1, jenisKarya: 'Jurnal Nasional', judul: 'Penerapan AI dalam Analisis Big Data', tahunTerbit: 2023, linkPublikasi: 'http://jurnal.ac.id/ai-2023', statusBukti: 'Sudah Upload' },
];

export default function PenelitianPage() {
    const [data, setData] = useState<Penelitian[]>(initialPenelitian);
    const [formData, setFormData] = useState({
        jenisKarya: '', judul: '', tahunTerbit: 0, linkPublikasi: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newEntry: Penelitian = {
            id: Date.now(),
            ...formData,
            tahunTerbit: Number(formData.tahunTerbit),
            statusBukti: 'Belum Upload',
        };
        setData([...data, newEntry]);
        setFormData({ jenisKarya: '', judul: '', tahunTerbit: 0, linkPublikasi: '' });
    };

    const handleUpload = (id: number) => {
        alert(`Membuka dialog unggah Bukti Fisik/HAKI untuk ID: ${id}.`);
        setData(data.map(item =>
            item.id === id ? { ...item, statusBukti: 'Sudah Upload' } : item
        ));
    };

    return (
        <div className="space-y-10">
            <h1 className="text-3xl font-bold text-gray-800 border-b pb-4">
                E-Filling Bidang Penelitian & HAKI
            </h1>

            {/* Form Input Bidang Penelitian */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Input Data Penelitian/Karya Ilmiah</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Jenis Karya</label>
                        <select
                            name="jenisKarya"
                            value={formData.jenisKarya}
                            onChange={(e) => setFormData({ ...formData, jenisKarya: e.target.value })}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        >
                            <option value="">Pilih Jenis</option>
                            <option value="Jurnal Nasional">Jurnal Nasional</option>
                            <option value="Jurnal Internasional">Jurnal Internasional</option>
                            <option value="Prosiding">Prosiding</option>
                            <option value="HAKI">HAKI (Hak Kekayaan Intelektual)</option>
                        </select>
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Tahun Terbit</label>
                        <input
                            type="number"
                            name="tahunTerbit"
                            value={formData.tahunTerbit || ''}
                            onChange={(e) => setFormData({ ...formData, tahunTerbit: Number(e.target.value) })}
                            required
                            min="2000"
                            placeholder="Contoh: 2024"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Judul Penelitian/Karya</label>
                        <textarea
                            name="judul"
                            value={formData.judul}
                            onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                            required
                            rows={3}
                            placeholder="Masukkan judul lengkap karya ilmiah atau HAKI Anda"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Link Publikasi / URL / DOI</label>
                        <input
                            type="url"
                            name="linkPublikasi"
                            value={formData.linkPublikasi}
                            onChange={(e) => setFormData({ ...formData, linkPublikasi: e.target.value })}
                            placeholder="Contoh: https://doi.org/10.xxxx"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        />
                    </div>

                    <div className="col-span-2 pt-2">
                        <button
                            type="submit"
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                        >
                            Simpan Data Penelitian
                        </button>
                    </div>
                </form>
            </div>

            {/* Tabel Data Penelitian yang Sudah Diinput */}
            <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto border border-gray-200">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Daftar Karya Ilmiah</h2>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Karya</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul & Tahun</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Bukti</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((item) => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {item.jenisKarya}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 max-w-sm overflow-hidden text-ellipsis">
                                    <p className="font-semibold">{item.judul}</p>
                                    <span className="text-xs text-gray-500">({item.tahunTerbit})</span>
                                    {item.linkPublikasi && (
                                        <a href={item.linkPublikasi} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 text-xs block truncate">
                                            {item.linkPublikasi}
                                        </a>
                                    )}
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
                                        title="Unggah Full Text/Sertifikat HAKI/Turnitin"
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