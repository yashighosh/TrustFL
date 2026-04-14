"use client";

"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { apiFetch } from "@/app/lib/api";

/* ──────── Types ──────── */
export interface Hospital {
  id: string;      // maps from hospital_id
  name: string;    // maps from hospital_name
  location: string;
  type: string;
  email: string;   // maps from contact_email
  phone: string;   // maps from contact_phone
  registeredAt: string; // maps from created_at
}

interface HospitalContextType {
  hospital: Hospital | null;
  setHospital: (h: Hospital | null) => void;
  isAdmin: boolean;
  setIsAdmin: (v: boolean) => void;
  isLoggedIn: boolean;
  isLoading: boolean;
  logout: () => void;
}

const HospitalContext = createContext<HospitalContextType>({
  hospital: null,
  setHospital: () => {},
  isAdmin: false,
  setIsAdmin: () => {},
  isLoggedIn: false,
  isLoading: true,
  logout: () => {},
});

export function HospitalProvider({ children }: { children: ReactNode }) {
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      const token = localStorage.getItem("trustfl_token");
      const role = localStorage.getItem("trustfl_role");
      
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      if (role === "admin") {
        setIsAdmin(true);
        setIsLoading(false);
        return;
      }

      try {
        const data = await apiFetch("/auth/me");
        setHospital({
          id: data.hospital_id,
          name: data.hospital_name,
          location: data.hospital_location,
          type: data.hospital_type,
          email: data.contact_email,
          phone: data.contact_phone,
          registeredAt: new Date(data.created_at).toISOString().split("T")[0]
        });
      } catch (err) {
        console.error("Failed to restore session:", err);
        localStorage.removeItem("trustfl_token");
        localStorage.removeItem("trustfl_role");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem("trustfl_token");
    localStorage.removeItem("trustfl_role");
    setHospital(null);
    setIsAdmin(false);
  };

  return (
    <HospitalContext.Provider value={{ 
      hospital, 
      setHospital, 
      isAdmin,
      setIsAdmin,
      isLoggedIn: !!hospital || isAdmin, 
      isLoading,
      logout 
    }}>
      {children}
    </HospitalContext.Provider>
  );
}

export function useHospital() {
  return useContext(HospitalContext);
}
