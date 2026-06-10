import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { typesVehicules, durees } from "@/data/assurances";

export default function AssurancePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="gradient-primary py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Assurance Véhicules
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Obtenez votre assurance rapidement : auto, cyclomoteur, taxi.
              Durée au choix : 1, 2, 3, 6 ou 12 mois.
            </p>
          </div>
        </section>

        {/* Types de véhicules */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Choisissez votre assurance
              </h2>
              <p className="text-foreground/60 text-lg">
                Assurance immédiate — Venez avec vos documents, repartez assuré
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {typesVehicules.map((vehicule) => (
                <div
                  key={vehicule.type}
                  className="card-hover bg-white border border-border rounded-2xl overflow-hidden shadow-sm"
                >
                  <div className="gradient-primary p-6 text-center">
                    <div className="text-5xl mb-3">{vehicule.icon}</div>
                    <h3 className="text-2xl font-bold text-white">
                      {vehicule.label}
                    </h3>
                  </div>
                  <div className="p-6">
                    <p className="text-foreground/70 mb-6 text-center">
                      {vehicule.description}
                    </p>

                    <h4 className="font-semibold text-foreground mb-3 text-center">
                      Durées disponibles :
                    </h4>
                    <div className="flex flex-wrap gap-2 justify-center mb-6">
                      {durees.map((d) => (
                        <span
                          key={d.value}
                          className="px-4 py-2 bg-gold/10 text-gold-dark font-semibold rounded-full text-sm"
                        >
                          {d.label}
                        </span>
                      ))}
                    </div>

                    <a
                      href={`https://wa.me/221776316751?text=${encodeURIComponent(`Bonjour, je voudrais faire une ${vehicule.label}. Merci de me donner les informations.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gold hover:bg-gold-light text-primary-dark font-bold rounded-xl transition-all"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Demander cette assurance
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment ça marche */}
            <div className="bg-muted rounded-2xl p-8 md:p-12 mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                Comment ça marche ?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-14 h-14 gradient-gold rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary-dark font-bold text-xl">1</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Contactez-nous</h3>
                  <p className="text-foreground/60 text-sm">Par WhatsApp ou passez à l&apos;agence</p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 gradient-gold rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary-dark font-bold text-xl">2</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Apportez vos documents</h3>
                  <p className="text-foreground/60 text-sm">Carte grise, CNI, permis</p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 gradient-gold rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary-dark font-bold text-xl">3</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Choisissez la durée</h3>
                  <p className="text-foreground/60 text-sm">1, 2, 3, 6 ou 12 mois</p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 gradient-gold rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary-dark font-bold text-xl">4</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Repartez assuré</h3>
                  <p className="text-foreground/60 text-sm">Attestation délivrée sur place</p>
                </div>
              </div>
            </div>

            {/* Documents nécessaires */}
            <div className="bg-white rounded-2xl p-8 md:p-12 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                Documents à apporter
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-muted p-6 rounded-xl">
                  <h3 className="font-semibold text-foreground mb-3">
                    🚗 Auto
                  </h3>
                  <ul className="space-y-2 text-foreground/70 text-sm">
                    <li>• Carte grise du véhicule</li>
                    <li>• Pièce d&apos;identité (CNI)</li>
                    <li>• Permis de conduire</li>
                    <li>• Ancienne attestation (si renouvellement)</li>
                  </ul>
                </div>
                <div className="bg-muted p-6 rounded-xl">
                  <h3 className="font-semibold text-foreground mb-3">
                    🏍️ Cyclomoteur
                  </h3>
                  <ul className="space-y-2 text-foreground/70 text-sm">
                    <li>• Carte grise ou facture d&apos;achat</li>
                    <li>• Pièce d&apos;identité (CNI)</li>
                    <li>• Numéro de châssis</li>
                  </ul>
                </div>
                <div className="bg-muted p-6 rounded-xl">
                  <h3 className="font-semibold text-foreground mb-3">
                    🚕 Taxi
                  </h3>
                  <ul className="space-y-2 text-foreground/70 text-sm">
                    <li>• Carte grise</li>
                    <li>• Licence de transport</li>
                    <li>• Permis de conduire</li>
                    <li>• Visite technique</li>
                    <li>• Pièce d&apos;identité</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 gradient-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Besoin d&apos;une assurance rapidement ?
            </h2>
            <p className="text-white/70 mb-6">
              Passez à l&apos;agence YOMBAL à Keur Issa ou contactez-nous par WhatsApp
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/221776316751"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-full transition-all text-lg"
              >
                WhatsApp : 77 631 67 51
              </a>
              <a
                href="tel:+221783290324"
                className="px-8 py-4 border-2 border-white/30 text-white hover:bg-white/10 font-semibold rounded-full transition-all text-lg"
              >
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
