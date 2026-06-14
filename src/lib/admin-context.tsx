"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from "react";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const didInit = useRef(false);

  const refreshBiens = useCallback(async () => {
    try {
      const data = await getBiens();
      setBiens(data);
      setError(null);
    } catch (e: any) {
      console.error("Erreur chargement biens:", e);
      setError(
        e?.code === "permission-denied"
          ? "Acces refuse par Firebase. Verifiez les regles Firestore."
          : "Erreur de connexion a Firebase."
      );
    }
  }, []);

  const refreshLocataires = useCallback(async () => {
    try {
      const data = await getLocataires();
      setLocataires(data);
      setError(null);
    } catch (e: any) {
      console.error("Erreur chargement locataires:", e);
      setError(
        e?.code === "permission-denied"
          ? "Acces refuse par Firebase. Verifiez les regles Firestore."
          : "Erreur de connexion a Firebase."
      );
    }
  }, []);

  const refreshContrats = useCallback(async () => {
    try {
      const data = await getContrats();
      setContrats(data);
      setError(null);
    } catch (e: any) {
      console.error("Erreur chargement contrats:", e);
      setError(
        e?.code === "permission-denied"
          ? "Acces refuse par Firebase. Verifiez les regles Firestore."
          : "Erreur de connexion a Firebase."
      );
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
    } catch (e: any) {
      console.error("Erreur chargement donnees:", e);
      if (e?.code === "permission-denied") {
        setError("Acces refuse par Firebase. Allez dans la console Firebase > Firestore > Rules et autorisez les lectures/ecritures.");
      } else {
        setError("Impossible de se connecter a Firebase. Verifiez votre connexion internet puis rechargez la page.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true;
      refreshAll();
    }
  }, [refreshAll]);

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
