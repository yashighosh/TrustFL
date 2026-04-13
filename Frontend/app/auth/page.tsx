"use client";

import { useRouter } from "next/navigation";
import AuthPage from "@/app/components/auth/AuthPage";
import { useHospital } from "@/app/context/HospitalContext";

export default function Auth() {
  const router = useRouter();
  const { setHospital } = useHospital();

  return (
    <AuthPage
      onRegister={(hospitalData) => {
        setHospital(hospitalData);
        router.push("/database");
      }}
      onBack={() => router.push("/")}
      onSuperAdmin={() => router.push("/admin")}
    />
  );
}
