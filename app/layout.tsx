import type { Metadata } from "next";

import "@/app/globals.css";
import { ToastProvider } from "@/components/ui/toast";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "UKM UPJ",
  description: "Lihat Informasi UKM",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="id">
      <body>
        <ToastProvider>
          {/* pass current user to client navbar for auth-aware navigation */}
          <Navbar user={user ?? undefined} />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
