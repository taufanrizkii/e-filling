'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
} from 'lucide-react';

type MenuItem = { label: string; href: string; icon: React.ElementType };

export default function ResponsiveNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const MENU: MenuItem[] = useMemo(
    () => [
      { label: 'Beranda', href: '/', icon: LayoutDashboard },
      { label: 'Pendidikan', href: '/pendidikan', icon: GraduationCap },
      { label: 'Penelitian', href: '/penelitian', icon: FlaskConical },
      { label: 'Pengabdian', href: '/pengabdian', icon: Handshake },
      { label: 'Penunjang', href: '/penunjang', icon: Star },
    ],
    []
  );

  // Tutup menu ketika pindah halaman (mobile)
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Disable scroll saat menu mobile terbuka
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const NavLinks = ({ variant }: { variant: 'desktop' | 'mobile' }) => (
    <nav className={variant === 'desktop' ? 'mt-8 space-y-1' : 'py-3'}>
      {MENU.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-slate-800 hover:text-white active:scale-[0.98]"
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}

      <div className={variant === 'desktop' ? 'mt-8 pt-6 border-t border-slate-800' : 'mt-3 pt-3 border-t border-slate-800'}>
        <button
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
          onClick={() => alert('Logout belum diaktifkan (akan dibuat setelah login).')}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ===== Desktop Sidebar ===== */}
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-64 md:bg-slate-900 md:text-white md:px-4 md:py-6">
        <div className="text-xl font-bold leading-tight">
          eFilling Dosen
          <div className="text-xs font-medium tracking-wide text-slate-400 mt-1">
            Universitas Widyatama
          </div>
        </div>
        <NavLinks variant="desktop" />
      </aside>

      {/* ===== Mobile Topbar ===== */}
      <header className="md:hidden sticky top-0 z-50 bg-slate-900 text-white">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <div className="text-base font-bold leading-tight">E-Filling Dosen</div>
            <div className="text-[11px] font-medium tracking-wide text-slate-400">
              Universitas Widyatama
            </div>
          </div>

          <button
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-slate-800 transition"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Drop-down menu (turun dari topbar) */}
        <div
          className={[
            'overflow-hidden border-t border-slate-800 bg-slate-900 transition-[max-height,opacity] duration-300',
            open ? 'max-h-[70vh] opacity-100' : 'max-h-0 opacity-0',
          ].join(' ')}
        >
          <div className="px-4 pb-4">
            <NavLinks variant="mobile" />
          </div>
        </div>
      </header>

      {/* Overlay saat mobile menu terbuka */}
      {open ? (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setOpen(false)}
        />
      ) : null}

      {/* ===== Main Content ===== */}
      <main className="md:ml-64 p-6">{children}</main>
    </div>
  );
}
