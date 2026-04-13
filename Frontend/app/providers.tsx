"use client";

import { HospitalProvider } from "@/app/context/HospitalContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HospitalProvider>
      {children}
    </HospitalProvider>
  );
}
