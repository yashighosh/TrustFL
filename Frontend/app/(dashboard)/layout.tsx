"use client";

import { ToastProvider } from "@/app/context/ToastContext";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import Toast from "@/app/components/ui/Toast";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <ToastProvider>
      <Navbar onLogoClick={() => router.push("/")} />
      <Toast />
      <div className="min-h-screen pt-16 relative z-[1]">
        {children}
      </div>
      <Footer />
    </ToastProvider>
  );
}
