"use client";

import AnimateOnScroll from "./AnimateOnScroll";

const testimonials = [
  {
    name: "Moussa Diop",
    role: "Locataire",
    text: "J'ai trouvé mon appartement à Thiès en moins de 2 jours grâce à YOMBAL. Service rapide et professionnel.",
    rating: 5,
  },
  {
    name: "Fatou Sow",
    role: "Cliente assurance",
    text: "Mon assurance auto faite en 30 minutes, avec tous les papiers en règle. Je recommande à 100%.",
    rating: 5,
  },
  {
    name: "Ibrahima Ndiaye",
    role: "Propriétaire",
    text: "YOMBAL gère mes biens depuis 1 an. Les locataires paient à temps et je suis toujours informé.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AnimateOnScroll>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ce que disent nos clients
            </h2>
            <p className="text-foreground/60 text-lg">
              La confiance de nos clients est notre meilleure publicité
            </p>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <AnimateOnScroll key={t.name} delay={i * 150}>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-border h-full flex flex-col">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <svg
                      key={j}
                      className="w-5 h-5 text-gold"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-foreground/70 italic flex-1 mb-4">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="border-t border-border pt-4">
                  <p className="font-semibold text-foreground">{t.name}</p>
                  <p className="text-foreground/50 text-sm">{t.role}</p>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
