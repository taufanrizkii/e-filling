// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import '@/app/globals.css';
import AppLayout from "@/components/AppLayout"; // Import komponen wrapper baru

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
          {/* Gunakan AppLayout untuk menangani logika tampilan Sidebar */}
          <AppLayout>
            {children}
          </AppLayout>
        </div>
      </body>
    </html>
  );
}