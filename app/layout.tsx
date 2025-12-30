// app/layout.tsx (Modifikasi)

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import '@/app/globals.css';
import Sidebar from "@/components/ui/Sidebar";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "eFilling Dosen",
  description: "Sistem E-Filling Data Dosen",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <Sidebar>
            <div className="w-full px-6 py-6">
              {children}
            </div>
            <Toaster richColors position="top-center" />
          </Sidebar>
        </div>
      </body>
    </html>
  );
}