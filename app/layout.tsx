import type { Metadata } from "next";

import "@/app/globals.css";
import { ToastProvider } from "@/components/ui/toast";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Sistem Informasi UKM",
  description: "Fondasi Sistem Informasi Pengelolaan Unit Kegiatan Mahasiswa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <ToastProvider>
          <Navbar />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
