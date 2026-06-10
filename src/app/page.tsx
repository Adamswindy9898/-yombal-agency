import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BienCard from "@/components/BienCard";
import { biensDemoData } from "@/data/biens";
import { typesVehicules } from "@/data/assurances";

export default function Home() {
  const biensRecents = biensDemoData.slice(0, 3);

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative gradient-primary py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-gold rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Agence <span className="text-gradient">YOMBAL</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-4 max-w-2xl mx-auto">
              Votre partenaire immobilier & assurance de confiance à Thiès
            </p>
            <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto">
              Appartements, Chambres, Studios, Magasins, Terrains &amp;
              Assurances Auto
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/biens"
                className="w-full sm:w-auto px-8 py-4 bg-gold hover:bg-gold-light text-primary-dark font-bold rounded-full transition-all shadow-lg hover:shadow-xl text-lg"
              >
                Voir les Biens
              </Link>
              <a
                href="https://wa.me/221776316751"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 border-2 border-white/30 text-white hover:bg-white/10 font-semibold rounded-full transition-all text-lg"
              >
                Nous Contacter
              </a>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 md:py-24 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Nos Services
              </h2>
              <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
                Une agence complète pour tous vos besoins immobiliers et
                d&apos;assurance
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="card-hover bg-white p-8 rounded-2xl shadow-sm border border-border text-center">
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <svg
                    className="w-8 h-8 text-gold"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Immobilier
                </h3>
                <p className="text-foreground/60">
                  Location et vente d&apos;appartements, chambres, studios,
                  magasins et terrains à Thiès
                </p>
              </div>

              <div className="card-hover bg-white p-8 rounded-2xl shadow-sm border border-border text-center">
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <svg
                    className="w-8 h-8 text-gold"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Assurance
                </h3>
                <p className="text-foreground/60">
                  Assurances auto, cyclomoteurs et taxis. Couverture complète à
                  prix compétitifs
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Biens Récents */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Biens Disponibles
                </h2>
                <p className="text-foreground/60">
                  Découvrez nos dernières offres à Thiès
                </p>
              </div>
              <Link
                href="/biens"
                className="hidden sm:flex items-center gap-2 text-primary font-semibold hover:text-gold transition-colors"
              >
                Voir tout
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {biensRecents.map((bien) => (
                <BienCard key={bien.id} bien={bien} />
              ))}
            </div>

            <div className="text-center mt-8 sm:hidden">
              <Link
                href="/biens"
                className="inline-flex items-center gap-2 text-primary font-semibold"
              >
                Voir tous les biens →
              </Link>
            </div>
          </div>
        </section>

        {/* Assurances */}
        <section className="py-16 md:py-24 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Assurance Véhicules
              </h2>
              <p className="text-foreground/60 text-lg">
                Auto, Cyclomoteur, Taxi — Durée au choix : 1 à 12 mois
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {typesVehicules.map((vehicule) => (
                <div
                  key={vehicule.type}
                  className="card-hover bg-white p-8 rounded-2xl shadow-sm border border-border text-center"
                >
                  <div className="text-5xl mb-4">{vehicule.icon}</div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {vehicule.label}
                  </h3>
                  <p className="text-foreground/60 mb-4">
                    {vehicule.description}
                  </p>
                  <p className="text-gold font-semibold mb-6">
                    Durée : 1, 2, 3, 6 ou 12 mois
                  </p>
                  <Link
                    href="/assurance"
                    className="block text-center py-3 border-2 border-primary text-primary font-semibold rounded-full hover:bg-primary hover:text-white transition-all"
                  >
                    En savoir plus
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact / CTA */}
        <section className="py-16 md:py-24 gradient-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Besoin d&apos;un bien ou d&apos;une assurance ?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Contactez-nous directement par WhatsApp ou par téléphone.
              Nous sommes disponibles du lundi au samedi de 8h à 18h.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://wa.me/221776316751"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-full transition-all shadow-lg text-lg"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Agence
              </a>
              <a
                href="tel:+221783290324"
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 border-2 border-white/30 text-white hover:bg-white/10 font-semibold rounded-full transition-all text-lg"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                Appeler : 78 329 03 24
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
