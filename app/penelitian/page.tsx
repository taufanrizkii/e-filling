'use client';

import React, { useState, useEffect, useRef } from 'react';

// Tipe data sesuai dengan respon API Backend dan Struktur Database
interface PenelitianItem {
    id: number;
    judul_penelitian: string;
    jenis_karya: string;
    // nama_jurnal DIHAPUS
    tahun_terbit: number;
    link_publikasi: string;
    status_penulis: string; // Penulis Utama / Anggota
    status: string;         // "BELUM_UPLOAD" atau "SUDAH_UPLOAD"
    file_path?: string | null; // Menyimpan nama file bukti
}

export default function PenelitianPage() {
    const [data, setData] = useState<PenelitianItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    // State untuk Form Input
    const [formData, setFormData] = useState({
        judul_penelitian: '',
        jenis_karya: 'Jurnal Nasional',
        // nama_jurnal DIHAPUS
        tahun_terbit: new Date().getFullYear(),
        link_publikasi: '',
        // status_penulis tidak perlu diinput user karena otomatis di backend (sesuai diskusi sebelumnya)
    });

    // Ref untuk input file agar bisa direset
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 1. Fetch Data dari Backend saat halaman dibuka
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/v1/penelitian');
            
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const json = await res.json();
            
            if (json.status === 'success' && Array.isArray(json.data)) {
                // Mapping data dari backend ke state (jika struktur response sedikit berbeda)
                // Namun karena kita menyesuaikan interface, kita bisa langsung set data jika response backend sudah sesuai
                // Pastikan backend mengembalikan field yang sama persis dengan nama kolom database
                setData(json.data);
            } else {
                console.error("Format respon API tidak sesuai:", json);
                setData([]); 
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

    // 2. Handle Submit Form ke Backend (dengan Upload File)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validasi sederhana (Hapus nama_jurnal dari validasi)
        if (!formData.judul_penelitian) {
            alert("Mohon lengkapi Judul Penelitian.");
            return;
        }

        try {
            const dataToSend = new FormData();
            dataToSend.append('judul_penelitian', formData.judul_penelitian);
            dataToSend.append('jenis_karya', formData.jenis_karya);
            // dataToSend.append('nama_jurnal', formData.nama_jurnal); // DIHAPUS
            dataToSend.append('tahun_terbit', formData.tahun_terbit.toString());
            dataToSend.append('link_publikasi', formData.link_publikasi);
            
            // Cek apakah ada file yang dipilih
            if (fileInputRef.current?.files?.[0]) {
                dataToSend.append('file_bukti', fileInputRef.current.files[0]);
            }

            const res = await fetch('http://localhost:5000/api/v1/penelitian', {
                method: 'POST',
                body: dataToSend,
            });

            if (res.ok) {
                const result = await res.json();
                alert("Data berhasil disimpan! ID: " + result.data.id);
                
                // Reset form
                setFormData({ 
                    judul_penelitian: '',
                    jenis_karya: 'Jurnal Nasional',
                    // nama_jurnal DIHAPUS
                    tahun_terbit: new Date().getFullYear(),
                    link_publikasi: ''
                });
                
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                
                fetchData();
            } else {
                // Perbaikan handling error
                const errorText = await res.text();
                console.error("Error response text:", errorText); // Log error mentah ke console untuk debugging
                try {
                    const errorJson = JSON.parse(errorText);
                    // Tampilkan pesan error dari backend jika ada, atau fallback ke teks error mentah
                    alert(`Gagal menyimpan data: ${errorJson.message || errorText}`);
                } catch {
                    // Jika parsing JSON gagal, tampilkan teks error mentah
                    alert(`Gagal menyimpan data (Server Error): ${errorText}`);
                }
            }
        } catch (error) {
            console.error("Error submit:", error);
            alert("Terjadi kesalahan koneksi saat menyimpan data. Pastikan backend aktif.");
        }
    };

    // 3. Fungsi Upload Susulan
    const handleUploadSusulan = async (id: number) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf,.jpg,.jpeg,.png';
        
        input.onchange = async (e: Event) => {
            const target = e.target as HTMLInputElement;
            const file = target.files?.[0];
            
            if (!file) return;

            const formDataUpload = new FormData();
            formDataUpload.append('file_bukti', file);
            
            setIsUploading(true);

            try {
                const res = await fetch(`http://localhost:5000/api/v1/penelitian/${id}`, {
                    method: 'PUT', 
                    body: formDataUpload
                });

                if (res.ok) {
                    alert("File berhasil diupload!");
                    fetchData();
                } else {
                    const errText = await res.text();
                    console.error("Gagal upload:", errText);
                    alert(`Gagal upload file: ${errText}`);
                }
            } catch (error) {
                console.error("Error upload:", error);
                alert("Terjadi kesalahan koneksi saat upload.");
            } finally {
                setIsUploading(false);
            }
        };

        input.click();
    };

    const handleDelete = async (id: number) => {
        if(confirm("Apakah Anda yakin ingin menghapus data ini?")) {
             alert("Fitur hapus belum diimplementasikan di backend.");
        }
    }

    return (
        <div className="space-y-10">
            <h1 className="text-3xl font-bold text-gray-800 border-b pb-4">
                E-Filling Bidang Penelitian
            </h1>

            {/* Form Input */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Input Data Penelitian & Publikasi</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Judul Penelitian / Karya</label>
                        <input
                            type="text"
                            value={formData.judul_penelitian}
                            onChange={(e) => setFormData({ ...formData, judul_penelitian: e.target.value })}
                            required
                            placeholder="Judul lengkap artikel atau penelitian..."
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Jenis Karya</label>
                        <select
                            value={formData.jenis_karya}
                            onChange={(e) => setFormData({ ...formData, jenis_karya: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="Jurnal Nasional">Jurnal Nasional</option>
                            <option value="Jurnal Internasional">Jurnal Internasional</option>
                            <option value="Prosiding Seminar">Prosiding Seminar</option>
                            <option value="HAKI / Paten">HAKI / Paten</option>
                            <option value="Buku / Monograf">Buku / Monograf</option>
                        </select>
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Tahun Terbit</label>
                        <input
                            type="number"
                            value={formData.tahun_terbit}
                            onChange={(e) => setFormData({ ...formData, tahun_terbit: Number(e.target.value) })}
                            required
                            min="2000"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* INPUT NAMA JURNAL DIHAPUS */}

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Link Publikasi / DOI (Opsional)</label>
                        <input
                            type="text"
                            value={formData.link_publikasi}
                            onChange={(e) => setFormData({ ...formData, link_publikasi: e.target.value })}
                            placeholder="https://doi.org/..."
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* Input File Upload */}
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Upload Full Text (PDF)</label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept=".pdf"
                            className="mt-1 block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-indigo-50 file:text-indigo-700
                                hover:file:bg-indigo-100"
                        />
                        <span className="text-xs text-gray-500">Opsional. Format: PDF. Max 5MB.</span>
                    </div>

                    <div className="col-span-2 pt-2">
                        <button
                            type="submit"
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Simpan Data
                        </button>
                    </div>
                </form>
            </div>

            {/* Tabel Data */}
            <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-700">Riwayat Publikasi</h2>
                    <div className="flex gap-2">
                         {isUploading && (
                             <span className="text-sm text-blue-600 animate-pulse font-medium flex items-center">
                                 Mengupload...
                             </span>
                         )}
                        <button 
                            onClick={fetchData} 
                            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        >
                            Refresh Data
                        </button>
                    </div>
                </div>
                
                {isLoading ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 mt-2">Sedang mengambil data...</p>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul Penelitian</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detail Publikasi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peran</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status File</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-gray-500 italic">
                                        Belum ada data penelitian.
                                    </td>
                                </tr>
                            ) : (
                                data.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium max-w-xs break-words">
                                            {item.judul_penelitian}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="font-semibold">{item.jenis_karya}</div>
                                            {/* Menghapus nama_jurnal dari tampilan detail */}
                                            <div>Tahun: {item.tahun_terbit}</div>
                                            {item.link_publikasi && (
                                                <a href={item.link_publikasi} target="_blank" rel="noreferrer" className="text-indigo-500 text-xs hover:underline truncate block max-w-[200px]">
                                                    {item.link_publikasi}
                                                </a>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.status_penulis}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex flex-col">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full w-fit ${
                                                    item.status === 'SUDAH_UPLOAD' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {item.status ? item.status.replace('_', ' ') : 'BELUM UPLOAD'}
                                                </span>
                                                {item.file_path && item.file_path !== 'null' && (
                                                    <a 
                                                        href={`http://localhost:5000/uploads/${item.file_path}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="mt-1 ml-1 text-blue-600 hover:text-blue-800 text-xs underline cursor-pointer"
                                                    >
                                                        Lihat File
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => handleUploadSusulan(item.id)}
                                                disabled={isUploading}
                                                className={`font-medium ${isUploading ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:text-indigo-900'}`}
                                            >
                                                Upload
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}