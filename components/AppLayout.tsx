// components/AppLayout.tsx

"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/ui/Sidebar";
import { Toaster } from "sonner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Cek apakah url saat ini adalah halaman login
  const isLoginPage = pathname === "/login";

  // Jika di halaman login, render konten tanpa Sidebar
  if (isLoginPage) {
    return (
      <>
        {children}
        <Toaster richColors position="top-center" />
      </>
    );
  }

  // Jika bukan halaman login, render dengan Sidebar
  return (
    <Sidebar>
      <div className="w-full px-6 py-6">
        {children}
      </div>
      <Toaster richColors position="top-center" />
    </Sidebar>
  );
}