'use client';

import React, { useState, useEffect, useRef } from 'react';

// Tipe data sesuai dengan respon API Backend (DTO)
interface PendidikanItem {
    id: number;
    tahun_semester: string; // "2024/2025 GANJIL"
    mata_kuliah: string;
    kelas_sks: string;      // "Kelas A / 3 SKS"
    status: string;         // "BELUM_UPLOAD" atau "SUDAH_UPLOAD"
    file_path?: string | null; // Menyimpan nama file bukti
}

export default function PendidikanPage() {
    const [data, setData] = useState<PendidikanItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    // State untuk Form Input
    const [formData, setFormData] = useState({
        tahun_ajaran: 2024,
        semester: 'GANJIL',
        mata_kuliah: '',
        kelas: '',
        sks: 0
    });

    // Ref untuk input file
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 1. Fetch Data
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/v1/pendidikan');
            if (!res.ok) throw new Error("Gagal mengambil data");
            const json = await res.json();
            if (json.status === 'success') {
                setData(json.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 2. Submit Data Baru
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.mata_kuliah || formData.sks <= 0) {
            alert("Lengkapi data!");
            return;
        }

        try {
            const dataToSend = new FormData();
            dataToSend.append('tahun_ajaran', formData.tahun_ajaran.toString());
            dataToSend.append('semester', formData.semester);
            dataToSend.append('mata_kuliah', formData.mata_kuliah);
            dataToSend.append('kelas', formData.kelas);
            dataToSend.append('sks', formData.sks.toString());

            if (fileInputRef.current?.files?.[0]) {
                dataToSend.append('file_bukti', fileInputRef.current.files[0]);
            }

            const res = await fetch('http://localhost:5000/api/v1/pendidikan', {
                method: 'POST',
                body: dataToSend,
            });

            if (res.ok) {
                alert("Data berhasil disimpan!");
                setFormData({ tahun_ajaran: 2024, semester: 'GANJIL', mata_kuliah: '', kelas: '', sks: 0 });
                if (fileInputRef.current) fileInputRef.current.value = "";
                fetchData();
            } else {
                alert("Gagal menyimpan data.");
            }
        } catch (error) {
            alert("Error koneksi.");
        }
    };

    // 3. Upload Susulan (DIPERBAIKI)
    const handleUploadSusulan = (id: number) => {
        // Buat input file invisible
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf,.jpg,.jpeg,.png';
        
        input.onchange = async (e: Event) => {
            const target = e.target as HTMLInputElement;
            const file = target.files?.[0];
            if (!file) return;

            // Konfirmasi upload
            if (!confirm(`Upload file "${file.name}" untuk ID ${id}?`)) return;

            const formDataUpload = new FormData();
            formDataUpload.append('file_bukti', file); // Pastikan nama field ini sama dengan di Backend (upload.single('file_bukti'))
            
            setIsUploading(true);

            try {
                // Perhatikan URL endpointnya
                const res = await fetch(`http://localhost:5000/api/v1/pendidikan/${id}`, {
                    method: 'PUT',
                    body: formDataUpload
                    // JANGAN tambahkan header Content-Type di sini! Biarkan otomatis.
                });

                const resultText = await res.text(); // Baca respon mentah dulu

                if (res.ok) {
                    alert("Upload BERHASIL!");
                    fetchData(); // Refresh tabel
                } else {
                    console.error("Server Error:", resultText);
                    alert(`Gagal upload. Server bilang: ${resultText}`);
                }
            } catch (error) {
                console.error("Network Error:", error);
                alert("Gagal koneksi ke server.");
            } finally {
                setIsUploading(false);
            }
        };

        input.click();
    };

    const handleDelete = async (id: number) => {
        if(confirm("Hapus data ini?")) {
             alert("Fitur hapus belum ada di backend.");
        }
    }

    return (
        <div className="space-y-10">
            <h1 className="text-3xl font-bold text-gray-800 border-b pb-4">
                E-Filling Bidang Pendidikan
            </h1>

            {/* Form Input */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Input Data Mata Kuliah</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Tahun Ajaran</label>
                        <input type="number" value={formData.tahun_ajaran} onChange={(e) => setFormData({ ...formData, tahun_ajaran: Number(e.target.value) })} className="mt-1 block w-full border p-2 rounded" required />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Semester</label>
                        <select value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: e.target.value })} className="mt-1 block w-full border p-2 rounded">
                            <option value="GANJIL">GANJIL</option>
                            <option value="GENAP">GENAP</option>
                        </select>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Mata Kuliah</label>
                        <input type="text" value={formData.mata_kuliah} onChange={(e) => setFormData({ ...formData, mata_kuliah: e.target.value })} className="mt-1 block w-full border p-2 rounded" required />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Kelas</label>
                        <input type="text" value={formData.kelas} onChange={(e) => setFormData({ ...formData, kelas: e.target.value })} className="mt-1 block w-full border p-2 rounded" required />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700">SKS</label>
                        <input type="number" value={formData.sks || ''} onChange={(e) => setFormData({ ...formData, sks: Number(e.target.value) })} className="mt-1 block w-full border p-2 rounded" required />
                    </div>
                    <div className="col-span-2">
                        <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Simpan Data</button>
                    </div>
                </form>
            </div>

            {/* Tabel Data */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 overflow-x-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Daftar Data</h2>
                    {isUploading && <span className="text-blue-600 animate-pulse font-bold">Sedang Mengupload...</span>}
                    <button onClick={fetchData} className="text-indigo-600 hover:underline">Refresh</button>
                </div>
                
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left">Tahun/Sem</th>
                            <th className="px-4 py-2 text-left">Matkul</th>
                            <th className="px-4 py-2 text-left">Kelas/SKS</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-left">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((item) => (
                            <tr key={item.id}>
                                <td className="px-4 py-2 text-sm">{item.tahun_semester}</td>
                                <td className="px-4 py-2 text-sm font-medium">{item.mata_kuliah}</td>
                                <td className="px-4 py-2 text-sm">{item.kelas_sks}</td>
                                <td className="px-4 py-2 text-sm">
                                    <span className={`px-2 py-1 rounded text-xs text-white ${item.status === 'SUDAH_UPLOAD' ? 'bg-green-500' : 'bg-red-500'}`}>
                                        {item.status ? item.status.replace('_', ' ') : 'BELUM'}
                                    </span>
                                    {/* Link Download File */}
                                    {item.file_path && item.file_path !== 'null' && (
                                        <div className="mt-1">
                                            <a 
                                                href={`http://localhost:5000/uploads/${item.file_path}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline text-xs hover:text-blue-800"
                                            >
                                                [Lihat File]
                                            </a>
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-2 text-sm space-x-2">
                                    <button onClick={() => handleUploadSusulan(item.id)} disabled={isUploading} className="text-indigo-600 hover:underline font-medium">
                                        Upload
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline">
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr><td colSpan={5} className="text-center py-4 text-gray-500">Data kosong</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}