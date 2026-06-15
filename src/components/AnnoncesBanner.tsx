"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Annonce, getAnnoncesActives } from "@/lib/firestore";

const typeColors: Record<string, string> = {
  info: "from-blue-600/80 to-blue-900/80",
  promo: "from-green-600/80 to-green-900/80",
  urgent: "from-red-600/80 to-red-900/80",
  nouveau: "from-amber-600/80 to-amber-900/80",
};

const typeBadge: Record<string, { label: string; bg: string }> = {
  info: { label: "Info", bg: "bg-blue-500" },
  promo: { label: "Promo", bg: "bg-green-500" },
  urgent: { label: "Urgent", bg: "bg-red-500" },
  nouveau: { label: "Nouveau", bg: "bg-amber-500" },
};

export default function AnnoncesBanner() {
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    getAnnoncesActives().then(setAnnonces).catch(() => {});
  }, []);

  const goTo = useCallback((index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setIsTransitioning(false);
    }, 300);
  }, []);

  const next = useCallback(() => {
    if (annonces.length <= 1) return;
    goTo((current + 1) % annonces.length);
  }, [current, annonces.length, goTo]);

  const prev = useCallback(() => {
    if (annonces.length <= 1) return;
    goTo((current - 1 + annonces.length) % annonces.length);
  }, [current, annonces.length, goTo]);

  useEffect(() => {
    if (annonces.length <= 1) return;
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [annonces.length, next]);

  if (annonces.length === 0) return null;

  const annonce = annonces[current];
  if (!annonce) return null;

  const overlay = typeColors[annonce.type] || typeColors.info;
  const badge = typeBadge[annonce.type] || typeBadge.info;
  const hasMedia = annonce.mediaUrl && annonce.mediaType;

  return (
    <div className="relative w-full overflow-hidden bg-gray-900" style={{ height: hasMedia ? "400px" : "200px" }}>
      {/* Background media */}
      {hasMedia && annonce.mediaType === "image" && (
        <img
          src={annonce.mediaUrl}
          alt={annonce.titre}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
        />
      )}
      {hasMedia && annonce.mediaType === "video" && (
        <video
          key={annonce.id}
          src={annonce.mediaUrl}
          autoPlay
          muted
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
        />
      )}

      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r ${overlay} ${!hasMedia ? "!from-gray-800 !to-gray-900" : ""}`} />

      {/* Content */}
      <div className={`relative h-full flex items-center justify-center transition-all duration-300 ${isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          {/* Badge */}
          <span className={`inline-block px-3 py-1 ${badge.bg} text-white text-xs font-bold uppercase rounded-full mb-3 tracking-wider`}>
            {badge.label}
          </span>

          {/* Title */}
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg">
            {annonce.titre}
          </h2>

          {/* Message */}
          <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto mb-5 drop-shadow">
            {annonce.message}
          </p>

          {/* CTA Link */}
          {annonce.lien && (
            <Link
              href={annonce.lien}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold hover:bg-gold-light text-primary-dark font-bold rounded-full transition-all shadow-lg hover:shadow-xl"
            >
              {annonce.lienTexte || "En savoir plus"}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          )}
        </div>
      </div>

      {/* Navigation arrows */}
      {annonces.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all"
            aria-label="Précédent"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all"
            aria-label="Suivant"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots indicator */}
      {annonces.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {annonces.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`transition-all rounded-full ${
                i === current
                  ? "w-8 h-2.5 bg-gold"
                  : "w-2.5 h-2.5 bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Annonce ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
