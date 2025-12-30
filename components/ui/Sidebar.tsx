'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  FlaskConical,
  Handshake,
  Star,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      router.replace("/login");
    } catch (e) {
      console.error(e);
    }
  };

  const MENU = useMemo(
    () => [
      { label: 'Beranda', href: '/', icon: LayoutDashboard },
      { label: 'Pendidikan', href: '/pendidikan', icon: GraduationCap },
      { label: 'Penelitian', href: '/penelitian', icon: FlaskConical },
      { label: 'Pengabdian', href: '/pengabdian', icon: Handshake },
      { label: 'Penunjang', href: '/penunjang', icon: Star },
    ],
    []
  );

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const NavItem = ({ item, isMobile = false }: { item: any, isMobile?: boolean }) => {
    const active = pathname === item.href;
    const Icon = item.icon;
    const showLabel = isMobile || isOpen; 

    return (
      <Link
        href={item.href}
        className={`
          group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200
          ${active ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
          ${!showLabel && !isMobile ? 'justify-center' : ''}
        `}
        title={!showLabel ? item.label : ''}
      >
        <Icon className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6 min-w-[24px]'}`} />
        <span className={`whitespace-nowrap transition-all duration-300 ${showLabel ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'}`}>
          {item.label}
        </span>
      </Link>
    );
  };

  return (
    <>
      {/* ===== DESKTOP SIDEBAR (Floating Style) ===== */}
      <aside 
        className={`
          hidden md:flex flex-col fixed left-0 z-20 bg-slate-900 text-white transition-all duration-300 ease-in-out
          border border-slate-800 shadow-xl
          m-3 rounded-2xl  // <--- Margin & Rounded
          ${isOpen ? 'w-64 px-4' : 'w-20 px-2'}
        `}
        style={{ height: 'calc(100vh - 1.5rem)' }} // Tinggi dikurangi total margin (top+bottom)
      >
        {/* Header */}
        <div className={`flex items-center h-16 border-b border-slate-800 mb-4 ${!isOpen ? 'justify-center' : 'justify-between'}`}>
          <div className={`overflow-hidden transition-all duration-300 ${!isOpen ? 'w-0 opacity-0 hidden' : 'w-auto'}`}>
            <div className="text-xl font-bold leading-tight">eFilling</div>
            <div className="text-[10px] font-medium text-slate-400">Universitas Widyatama</div>
          </div>
          
          {!isOpen && <div className="font-bold text-indigo-500 text-xl">EF</div>}

          {isOpen && (
            <button onClick={onToggle} className="p-1 rounded hover:bg-slate-800 text-slate-400 transition-colors">
               <ChevronLeft size={20} />
            </button>
          )}
        </div>
        
        {/* Toggle Button (When Closed) */}
        {!isOpen && (
           <button 
             onClick={onToggle} 
             className="absolute -right-3 top-7 bg-slate-800 text-slate-400 p-1.5 rounded-full border border-slate-700 shadow-lg z-50 hover:text-white hover:scale-110 transition-all"
           >
             <ChevronRight size={14} />
           </button>
        )}

        {/* Menu */}
        <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
          {MENU.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </nav>

        {/* Footer / Logout */}
        <div className="pt-4 border-t border-slate-800 mb-2">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-red-900/30 hover:text-red-400 transition ${!isOpen ? 'justify-center' : ''}`}
            title={!isOpen ? "Logout" : ""}
          >
            <LogOut className="h-5 w-5 min-w-[20px]" />
            <span className={`whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* ===== MOBILE HEADER (Tidak Berubah) ===== */}
      <header className="md:hidden sticky top-0 z-50 bg-slate-900 text-white w-full shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <div className="text-base font-bold">eFilling Dosen</div>
            <div className="text-[10px] text-slate-400">Universitas Widyatama</div>
          </div>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="p-2 rounded-lg hover:bg-slate-800 transition"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <div className={`overflow-hidden bg-slate-900 transition-all duration-300 ${mobileOpen ? 'max-h-[70vh] opacity-100 border-t border-slate-800' : 'max-h-0 opacity-0'}`}>
          <div className="px-4 pb-4 pt-2 space-y-1">
            {MENU.map((item) => <NavItem key={item.href} item={item} isMobile={true} />)}
            <div className="mt-3 pt-3 border-t border-slate-800">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:text-white">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {mobileOpen && <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)} />}
    </>
  );
}