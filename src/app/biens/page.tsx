"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BienCard from "@/components/BienCard";
import { biensDemoData, TypeBien } from "@/data/biens";

const types: { value: TypeBien | "tous"; label: string }[] = [
  { value: "tous", label: "Tous" },
  { value: "appartement", label: "Appartements" },
  { value: "chambre", label: "Chambres" },
  { value: "studio", label: "Studios" },
  { value: "magasin", label: "Magasins" },
  { value: "terrain", label: "Terrains" },
];

export default function BiensPage() {
  const [filtre, setFiltre] = useState<TypeBien | "tous">("tous");

  const biensFiltres =
    filtre === "tous"
      ? biensDemoData
      : biensDemoData.filter((b) => b.type === filtre);

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="gradient-primary py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Nos Biens Immobiliers
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Trouvez le bien idéal à Thiès : location ou achat
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* Filtres */}
            <div className="flex flex-wrap gap-3 mb-10">
              {types.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setFiltre(type.value)}
                  className={`px-5 py-2 rounded-full font-medium transition-all ${
                    filtre === type.value
                      ? "bg-primary text-white shadow-md"
                      : "bg-muted text-foreground/70 hover:bg-primary/10"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {/* Résultats */}
            <p className="text-foreground/60 mb-6">
              {biensFiltres.length} bien{biensFiltres.length > 1 ? "s" : ""}{" "}
              trouvé{biensFiltres.length > 1 ? "s" : ""}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {biensFiltres.map((bien) => (
                <BienCard key={bien.id} bien={bien} />
              ))}
            </div>

            {biensFiltres.length === 0 && (
              <div className="text-center py-20">
                <p className="text-foreground/50 text-lg">
                  Aucun bien disponible dans cette catégorie pour le moment.
                </p>
                <a
                  href="https://wa.me/221776316751"
                  className="inline-block mt-4 text-gold font-semibold hover:underline"
                >
                  Contactez-nous pour vos recherches personnalisées
                </a>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
