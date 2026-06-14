"use client";

import { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react";
import { Bien } from "@/data/biens";
import { Locataire, ContratAssurance, getBiens, getLocataires, getContrats } from "./firestore";

interface AdminData {
  biens: Bien[];
  locataires: Locataire[];
  contrats: ContratAssurance[];
  loading: boolean;
  error: string | null;
  refreshBiens: () => Promise<void>;
  refreshLocataires: () => Promise<void>;
  refreshContrats: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

const AdminContext = createContext<AdminData | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [biens, setBiens] = useState<Bien[]>([]);
  const [locataires, setLocataires] = useState<Locataire[]>([]);
  const [contrats, setContrats] = useState<ContratAssurance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadedRef = useRef({ biens: false, locataires: false, contrats: false });

  const refreshBiens = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getBiens();
      setBiens(data);
      loadedRef.current.biens = true;
      setError(null);
    } catch (e: any) {
      console.error("Erreur chargement biens:", e);
      setError(e?.code === "permission-denied"
        ? "Acces refuse par Firebase."
        : "Erreur de connexion a Firebase.");
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshLocataires = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getLocataires();
      setLocataires(data);
      loadedRef.current.locataires = true;
      setError(null);
    } catch (e: any) {
      console.error("Erreur chargement locataires:", e);
      setError(e?.code === "permission-denied"
        ? "Acces refuse par Firebase."
        : "Erreur de connexion a Firebase.");
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshContrats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getContrats();
      setContrats(data);
      loadedRef.current.contrats = true;
      setError(null);
    } catch (e: any) {
      console.error("Erreur chargement contrats:", e);
      setError(e?.code === "permission-denied"
        ? "Acces refuse par Firebase."
        : "Erreur de connexion a Firebase.");
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [biensData, locatairesData, contratsData] = await Promise.all([
        getBiens(),
        getLocataires(),
        getContrats(),
      ]);
      setBiens(biensData);
      setLocataires(locatairesData);
      setContrats(contratsData);
      loadedRef.current = { biens: true, locataires: true, contrats: true };
    } catch (e: any) {
      console.error("Erreur chargement donnees:", e);
      if (e?.code === "permission-denied") {
        setError("Acces refuse par Firebase. Verifiez les regles Firestore.");
      } else {
        setError("Impossible de se connecter a Firebase. Verifiez votre connexion internet.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AdminContext.Provider
      value={{ biens, locataires, contrats, loading, error, refreshBiens, refreshLocataires, refreshContrats, refreshAll }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside AdminProvider");
  return ctx;
}
