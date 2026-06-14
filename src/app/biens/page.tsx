"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BienCard from "@/components/BienCard";
import { Bien, TypeBien } from "@/data/biens";
import { getBiens } from "@/lib/firestore";

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
  const [biens, setBiens] = useState<Bien[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [prixMax, setPrixMax] = useState<number | null>(null);

  useEffect(() => {
    getBiens().then((data) => {
      setBiens(data.filter((b) => b.disponible));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const biensFiltres = biens.filter((b) => {
    if (filtre !== "tous" && b.type !== filtre) return false;
    if (prixMax && b.prix > prixMax) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        b.titre.toLowerCase().includes(q) ||
        b.quartier.toLowerCase().includes(q) ||
        b.ville.toLowerCase().includes(q)
      );
    }
    return true;
  });

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
              Trouvez le bien ideal a Thies : location ou achat
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* Recherche */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher par nom, quartier..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>
              <select
                value={prixMax || ""}
                onChange={(e) => setPrixMax(e.target.value ? Number(e.target.value) : null)}
                className="px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Budget max</option>
                <option value="50000">50 000 FCFA</option>
                <option value="100000">100 000 FCFA</option>
                <option value="150000">150 000 FCFA</option>
                <option value="250000">250 000 FCFA</option>
                <option value="500000">500 000 FCFA</option>
                <option value="10000000">10 000 000 FCFA</option>
              </select>
            </div>

            {/* Filtres type */}
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

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-foreground/60">Chargement des biens...</p>
                </div>
              </div>
            ) : (
              <>
                <p className="text-foreground/60 mb-6">
                  {biensFiltres.length} bien{biensFiltres.length > 1 ? "s" : ""}{" "}
                  trouve{biensFiltres.length > 1 ? "s" : ""}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {biensFiltres.map((bien) => (
                    <BienCard key={bien.id} bien={bien} />
                  ))}
                </div>

                {biensFiltres.length === 0 && (
                  <div className="text-center py-20">
                    <p className="text-foreground/50 text-lg">
                      Aucun bien disponible dans cette categorie pour le moment.
                    </p>
                    <a
                      href="https://wa.me/221776316751"
                      className="inline-block mt-4 text-gold font-semibold hover:underline"
                    >
                      Contactez-nous pour vos recherches personnalisees
                    </a>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
