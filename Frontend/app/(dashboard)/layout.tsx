"use client";

import { ToastProvider } from "@/app/context/ToastContext";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import Toast from "@/app/components/ui/Toast";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  let activeTab = 0;
  if (pathname.includes("/blockchain")) activeTab = 1;
  if (pathname.includes("/fl")) activeTab = 2;

  const handleTabChange = (idx: number) => {
    if (idx === 0) router.push("/database");
    if (idx === 1) router.push("/blockchain");
    if (idx === 2) router.push("/fl");
  };

  return (
    <ToastProvider>
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogoClick={() => router.push("/")}
      />
      <Toast />
      <div className="min-h-screen pt-16 relative z-[1]">
        {children}
      </div>
      <Footer />
    </ToastProvider>
  );
}
