// components/AppLayout.tsx

"use client";

import React, { useState } from 'react';
import { usePathname } from "next/navigation";
import Sidebar from "@/components/ui/Sidebar";
import { Toaster } from "sonner"; // Pastikan import ini ada

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return (
      <>
        {children}
        <Toaster richColors position="top-center" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
      />

      <main 
        className={`
          flex-1 transition-all duration-300 ease-in-out p-6 w-full
          ${isSidebarOpen ? 'md:pl-[17.5rem]' : 'md:pl-[6.5rem]'}
        `}
      >
        {children}
      </main>

      {/* TAMBAHKAN INI DI SINI AGAR NOTIFIKASI MUNCUL */}
      <Toaster richColors position="top-center" />
    </div>
  );
}