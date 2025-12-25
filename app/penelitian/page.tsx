'use client';

import React, { useState, useEffect, useRef } from 'react';

// Interface disesuaikan dengan kolom asli Database PostgreSQL
interface PenelitianItem {
    id: number;
    judul_penelitian: string;
    jenis_karya: string;
    tahun_terbit: number;
    link_publikasi: string;
    status_penulis: string; 
    status: string;         
    file_path?: string | null;
}

export default function PenelitianPage() {
    const [data, setData] = useState<PenelitianItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    // State Form
    const [formData, setFormData] = useState({
        judul_penelitian: '',
        jenis_karya: 'Jurnal Nasional',
        tahun_terbit: new Date().getFullYear(),
        link_publikasi: '',
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    // 1. Fetch Data
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/v1/penelitian');
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            
            const json = await res.json();
            if (json.status === 'success' && Array.isArray(json.data)) {
                setData(json.data);
            }
        } catch (error) {
            console.error("Gagal mengambil data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 2. Simpan Data Baru
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.judul_penelitian) return alert("Judul wajib diisi.");

        try {
            const dataToSend = new FormData();
            dataToSend.append('judul_penelitian', formData.judul_penelitian);
            dataToSend.append('jenis_karya', formData.jenis_karya);
            dataToSend.append('tahun_terbit', formData.tahun_terbit.toString());
            dataToSend.append('link_publikasi', formData.link_publikasi);
            
            if (fileInputRef.current?.files?.[0]) {
                dataToSend.append('file_bukti', fileInputRef.current.files[0]);
            }

            const res = await fetch('http://localhost:5000/api/v1/penelitian', {
                method: 'POST',
                body: dataToSend,
            });

            if (res.ok) {
                alert("Data berhasil disimpan!");
                setFormData({ judul_penelitian: '', jenis_karya: 'Jurnal Nasional', tahun_terbit: new Date().getFullYear(), link_publikasi: '' });
                if (fileInputRef.current) fileInputRef.current.value = "";
                fetchData();
            }
        } catch (error) {
            alert("Gagal koneksi ke server.");
        }
    };

    // 3. Upload File Susulan
    const handleUploadSusulan = async (id: number) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf';
        input.onchange = async (e: Event) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            const fd = new FormData();
            fd.append('file_bukti', file);
            setIsUploading(true);
            try {
                const res = await fetch(`http://localhost:5000/api/v1/penelitian/${id}`, { method: 'PUT', body: fd });
                if (res.ok) { alert("File terupload!"); fetchData(); }
            } finally { setIsUploading(false); }
        };
        input.click();
    };

    return (
        <div className="p-8 space-y-10 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 border-b pb-4">E-Filling Bidang Penelitian</h1>

            {/* Form Input */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Form Input Penelitian</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Judul Penelitian</label>
                        <input type="text" value={formData.judul_penelitian} onChange={(e) => setFormData({...formData, judul_penelitian: e.target.value})} className="mt-1 block w-full p-2 border rounded-md" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Jenis Karya</label>
                        <select value={formData.jenis_karya} onChange={(e) => setFormData({...formData, jenis_karya: e.target.value})} className="mt-1 block w-full p-2 border rounded-md">
                            <option>Jurnal Nasional</option>
                            <option>Jurnal Internasional</option>
                            <option>Prosiding Seminar</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tahun Terbit</label>
                        <input type="number" value={formData.tahun_terbit} onChange={(e) => setFormData({...formData, tahun_terbit: Number(e.target.value)})} className="mt-1 block w-full p-2 border rounded-md" required />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Link Publikasi</label>
                        <input type="text" value={formData.link_publikasi} onChange={(e) => setFormData({...formData, link_publikasi: e.target.value})} className="mt-1 block w-full p-2 border rounded-md" placeholder="https://..." />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">File Bukti (PDF)</label>
                        <input type="file" ref={fileInputRef} accept=".pdf" className="mt-1 block w-full text-sm" />
                    </div>
                    <button type="submit" className="col-span-2 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition">Simpan Data</button>
                </form>
            </div>

                {/* Tabel Riwayat */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b flex justify-between">
                        <h2 className="text-xl font-semibold text-gray-700">Riwayat Publikasi</h2>
                        <button onClick={fetchData} className="text-indigo-600 hover:underline">Refresh</button>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {/* Header kini hanya 4 kolom */}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul Penelitian</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detail Publikasi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status File</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            <tr><td colSpan={4} className="text-center py-10 text-gray-500">Memuat data...</td></tr>
                        ) : data.length === 0 ? (
                            <tr><td colSpan={4} className="text-center py-10 text-gray-500">Belum ada data.</td></tr>
                        ) : data.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                {/* 1. Kolom Judul */}
                                <td className="px-6 py-4 text-sm text-gray-900 font-bold max-w-xs break-words">
                                    {item.judul_penelitian}
                                </td>

                                {/* 2. Kolom Detail (Jenis & Tahun) */}
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <div className="font-semibold">{item.jenis_karya}</div>
                                    <div>Tahun: {item.tahun_terbit}</div>
                                    {item.link_publikasi && (
                                        <a href={item.link_publikasi} target="_blank" className="text-indigo-500 text-xs truncate block max-w-[150px]">
                                            {item.link_publikasi}
                                        </a>
                                    )}
                                </td>

                                {/* 3. Kolom Status File */}
                                <td className="px-6 py-4 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.status === 'SUDAH_UPLOAD' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {item.status ? item.status.replace('_', ' ') : 'BELUM UPLOAD'}
                                    </span>
                                    {item.file_path && (
                                        <a href={`http://localhost:5000/uploads/${item.file_path}`} target="_blank" className="block mt-1 text-blue-600 text-xs underline">
                                            Lihat File
                                        </a>
                                    )}
                                </td>

                                {/* 4. Kolom Aksi */}
                                <td className="px-6 py-4 text-sm font-medium space-x-3">
                                    <button onClick={() => handleUploadSusulan(item.id)} className="text-indigo-600 hover:text-indigo-900">Upload</button>
                                    <button className="text-red-600 hover:text-red-900">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>
        );
    }