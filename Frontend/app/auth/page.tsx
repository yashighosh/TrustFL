"use client";

import { useRouter } from "next/navigation";
import AuthPage from "@/app/components/auth/AuthPage";
import { useHospital } from "@/app/context/HospitalContext";
import { useEffect } from "react";

export default function Auth() {
  const router = useRouter();
  const { isLoggedIn, isAdmin, isLoading } = useHospital();

  useEffect(() => {
    if (!isLoading) {
      if (isAdmin) router.push("/admin");
      else if (isLoggedIn) router.push("/database");
    }
  }, [isLoggedIn, isAdmin, isLoading, router]);

  if (isLoading || isLoggedIn) return <div className="min-h-screen bg-bg-color flex items-center justify-center font-mono text-primary">Loading...</div>;

  return (
    <AuthPage
      onHospitalEntry={() => router.push("/database")}
      onBack={() => router.push("/")}
      onSuperAdmin={() => router.push("/admin")}
    />
  );
}
