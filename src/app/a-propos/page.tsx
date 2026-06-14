import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function AProposPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="gradient-primary py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              À propos de YOMBAL
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Votre partenaire de confiance pour l&apos;immobilier et l&apos;assurance à Thiès
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Notre histoire</h2>
                <p className="text-foreground/70 leading-relaxed mb-4">
                  L&apos;agence YOMBAL est née de la volonté d&apos;offrir un service immobilier et
                  d&apos;assurance de qualité à Thiès et ses environs. Basée à Keur Issa, nous
                  accompagnons propriétaires et locataires dans tous leurs projets.
                </p>
                <p className="text-foreground/70 leading-relaxed">
                  &ldquo;YOMBAL&rdquo; signifie &ldquo;réussir&rdquo; en wolof. C&apos;est notre promesse :
                  vous aider à réussir vos projets immobiliers avec transparence, rapidité et professionnalisme.
                </p>
              </div>
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-12 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 gradient-gold rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary-dark font-bold text-4xl">Y</span>
                  </div>
                  <p className="text-primary font-bold text-xl">YOMBAL</p>
                  <p className="text-foreground/50 text-sm mt-1">Depuis 2023</p>
                </div>
              </div>
            </div>

            <div className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Nos valeurs</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-6 bg-muted rounded-2xl">
                  <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Confiance</h3>
                  <p className="text-foreground/60 text-sm">
                    Transparence totale dans nos transactions. Pas de frais cachés.
                  </p>
                </div>
                <div className="text-center p-6 bg-muted rounded-2xl">
                  <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Rapidité</h3>
                  <p className="text-foreground/60 text-sm">
                    Réponse dans l&apos;heure. Assurance délivrée sur place.
                  </p>
                </div>
                <div className="text-center p-6 bg-muted rounded-2xl">
                  <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Proximité</h3>
                  <p className="text-foreground/60 text-sm">
                    Disponible par WhatsApp, téléphone ou en personne à l&apos;agence.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-muted rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">Nos services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
                <div className="flex items-start gap-3">
                  <span className="text-gold text-xl">&#10003;</span>
                  <p className="text-foreground/70">Location d&apos;appartements, chambres et studios</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gold text-xl">&#10003;</span>
                  <p className="text-foreground/70">Vente de terrains avec titre foncier</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gold text-xl">&#10003;</span>
                  <p className="text-foreground/70">Assurance auto, cyclomoteur, taxi</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gold text-xl">&#10003;</span>
                  <p className="text-foreground/70">Gestion locative pour propriétaires</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gold text-xl">&#10003;</span>
                  <p className="text-foreground/70">Recouvrement de loyers</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gold text-xl">&#10003;</span>
                  <p className="text-foreground/70">Conseil et accompagnement immobilier</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
