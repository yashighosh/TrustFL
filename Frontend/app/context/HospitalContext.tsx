"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

/* ──────── Types ──────── */
export interface Hospital {
  id: string;
  name: string;
  location: string;
  type: string;
  email: string;
  phone: string;
  registeredAt: string;
}

interface HospitalContextType {
  hospital: Hospital | null;
  setHospital: (h: Hospital | null) => void;
  isLoggedIn: boolean;
  logout: () => void;
}

const HospitalContext = createContext<HospitalContextType>({
  hospital: null,
  setHospital: () => {},
  isLoggedIn: false,
  logout: () => {},
});

export function HospitalProvider({ children }: { children: ReactNode }) {
  const [hospital, setHospital] = useState<Hospital | null>(null);

  const logout = () => setHospital(null);

  return (
    <HospitalContext.Provider value={{ hospital, setHospital, isLoggedIn: !!hospital, logout }}>
      {children}
    </HospitalContext.Provider>
  );
}

export function useHospital() {
  return useContext(HospitalContext);
}
