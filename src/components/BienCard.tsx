"use client";

import Link from "next/link";
import { Bien } from "@/data/biens";
import { useState, useEffect } from "react";

function formatPrix(prix: number): string {
  return prix.toLocaleString("fr-FR") + " FCFA";
}

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    appartement: "Appartement",
    chambre: "Chambre",
    studio: "Studio",
    magasin: "Magasin",
    terrain: "Terrain",
  };
  return labels[type] || type;
}

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    appartement: "bg-blue-100 text-blue-700",
    chambre: "bg-green-100 text-green-700",
    studio: "bg-purple-100 text-purple-700",
    magasin: "bg-orange-100 text-orange-700",
    terrain: "bg-amber-100 text-amber-700",
  };
  return colors[type] || "bg-gray-100 text-gray-700";
}

function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("yombal-favorites");
  return stored ? JSON.parse(stored) : [];
}

function toggleFavorite(id: string): boolean {
  const favs = getFavorites();
  const index = favs.indexOf(id);
  if (index > -1) {
    favs.splice(index, 1);
  } else {
    favs.push(id);
  }
  localStorage.setItem("yombal-favorites", JSON.stringify(favs));
  return index === -1;
}

export default function BienCard({ bien }: { bien: Bien }) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setIsFav(getFavorites().includes(bien.id));
  }, [bien.id]);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFav(toggleFavorite(bien.id));
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/biens/${bien.id}`;
    const text = `${bien.titre} - ${formatPrix(bien.prix)}${bien.prixParMois ? "/mois" : ""} à ${bien.quartier}, ${bien.ville}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + "\n" + url)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Link href={`/biens/${bien.id}`}>
      <div className="card-hover bg-white rounded-2xl overflow-hidden border border-border shadow-sm">
        <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center overflow-hidden">
          {bien.images.length > 0 && bien.images[0] !== "/images/apt1.jpg" && !bien.images[0].startsWith("/images/") ? (
            <img src={bien.images[0]} alt={bien.titre} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center">
              <div className="text-4xl mb-2">
                {bien.type === "appartement" && "🏢"}
                {bien.type === "chambre" && "🛏️"}
                {bien.type === "studio" && "🏠"}
                {bien.type === "magasin" && "🏪"}
                {bien.type === "terrain" && "🏗️"}
              </div>
              <span className="text-sm text-primary/60">Photo à venir</span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(bien.type)}`}
            >
              {getTypeLabel(bien.type)}
            </span>
          </div>
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={handleFavorite}
              className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
            >
              <svg
                className={`w-4 h-4 ${isFav ? "text-red-500 fill-red-500" : "text-gray-600"}`}
                fill={isFav ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
            <button
              onClick={handleShare}
              className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-1">
            {bien.titre}
          </h3>

          <div className="flex items-center gap-1 text-sm text-foreground/60 mb-3">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>
              {bien.quartier}, {bien.ville}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-foreground/60 mb-4">
            <span className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
              {bien.surface} m²
            </span>
            {bien.pieces && (
              <span className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                {bien.pieces} pièces
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div>
              <span className="text-lg font-bold text-gold">
                {formatPrix(bien.prix)}
              </span>
              {bien.prixParMois && (
                <span className="text-sm text-foreground/50">/mois</span>
              )}
            </div>
            <span className="text-primary font-medium text-sm hover:text-gold transition-colors">
              Voir détails →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
