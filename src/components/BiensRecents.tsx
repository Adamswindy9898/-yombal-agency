"use client";

import { useState, useEffect } from "react";
import BienCard from "./BienCard";
import { Bien } from "@/data/biens";
import { getBiens } from "@/lib/firestore";

export default function BiensRecents() {
  const [biens, setBiens] = useState<Bien[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBiens().then((data) => {
      setBiens(data.filter((b) => b.disponible).slice(0, 3));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (biens.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-foreground/50">Aucun bien disponible pour le moment.</p>
        <a
          href="https://wa.me/221776316751"
          className="inline-block mt-4 text-gold font-semibold hover:underline"
        >
          Contactez-nous directement
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {biens.map((bien) => (
        <BienCard key={bien.id} bien={bien} />
      ))}
    </div>
  );
}
