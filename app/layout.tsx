import type { Metadata } from "next";

import "@/app/globals.css";
import { ToastProvider } from "@/components/ui/toast";

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
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
