"use client";

import { useRouter } from "next/navigation";
import AuthPage from "@/app/components/auth/AuthPage";

export default function Auth() {
  const router = useRouter();
  return (
    <AuthPage 
      onLogin={() => router.push("/database")} 
      onBack={() => router.push("/")} 
    />
  );
}
