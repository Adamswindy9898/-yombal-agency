"use client";

import { useEffect, useState } from "react";
import { Annonce, getAnnoncesActives } from "@/lib/firestore";

const typeStyles: Record<string, { bg: string; icon: string; border: string }> = {
  info: { bg: "bg-blue-50", icon: "text-blue-600", border: "border-blue-200" },
  promo: { bg: "bg-green-50", icon: "text-green-600", border: "border-green-200" },
  urgent: { bg: "bg-red-50", icon: "text-red-600", border: "border-red-200" },
  nouveau: { bg: "bg-amber-50", icon: "text-amber-600", border: "border-amber-200" },
};

const typeIcons: Record<string, string> = {
  info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  promo: "M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7",
  urgent: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  nouveau: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
};

export default function AnnoncesBanner() {
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [current, setCurrent] = useState(0);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    getAnnoncesActives().then(setAnnonces).catch(() => {});
  }, []);

  useEffect(() => {
    if (annonces.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % annonces.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [annonces.length]);

  const visibleAnnonces = annonces.filter((a) => !dismissed.includes(a.id));
  if (visibleAnnonces.length === 0) return null;

  const annonce = visibleAnnonces[current % visibleAnnonces.length];
  if (!annonce) return null;

  const style = typeStyles[annonce.type] || typeStyles.info;
  const iconPath = typeIcons[annonce.type] || typeIcons.info;

  return (
    <div className={`${style.bg} border-b ${style.border} relative overflow-hidden`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-center gap-3">
          <svg className={`w-5 h-5 ${style.icon} flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
          </svg>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-foreground">{annonce.titre}</span>
            <span className="text-foreground/70">{annonce.message}</span>
            {annonce.lien && (
              <a
                href={annonce.lien}
                className={`font-semibold ${style.icon} hover:underline ml-1`}
              >
                {annonce.lienTexte || "En savoir plus →"}
              </a>
            )}
          </div>
          <button
            onClick={() => setDismissed([...dismissed, annonce.id])}
            className="ml-auto text-foreground/40 hover:text-foreground/70 flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {visibleAnnonces.length > 1 && (
          <div className="flex justify-center gap-1 mt-2">
            {visibleAnnonces.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === current % visibleAnnonces.length ? "bg-foreground/50 w-4" : "bg-foreground/20"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
