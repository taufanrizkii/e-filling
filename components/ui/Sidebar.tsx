// components/Sidebar.tsx

import Link from 'next/link';
import React from 'react';

const navItems = [
    { name: 'Beranda', href: '/' },
    { name: 'Pendidikan', href: '/pendidikan' },
    { name: 'Penelitian', href: '/penelitian' },
    { name: 'Pengabdian', href: '/pengabdian' },
    { name: 'Penunjang', href: '/penunjang' },
    { name: 'Logout', href: '/api/auth/logout' },
];

export default function Sidebar() {
    return (
        <div className="flex flex-col w-64 bg-gray-800 text-white min-h-screen p-4 shadow-lg">
            <div className="text-xl font-bold mb-8 border-b border-gray-700 pb-4">
                E-Filling Dosen
            </div>
            <nav className="flex flex-col space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-700 hover:text-yellow-400"
                    >
                        {item.name}
                    </Link>
                ))}
            </nav>
            <div className="mt-auto pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-400">Selamat datang, [Nama Dosen]</p>
            </div>
        </div>
    );
}