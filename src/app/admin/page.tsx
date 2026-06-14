"use client";

import { useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/lib/admin-context";
import QRCodeCard from "@/components/admin/QRCodeCard";

export default function AdminPage() {
  return (
    <AdminLayout>
      <DashboardContent />
    </AdminLayout>
  );
}

function formatPrix(prix: number): string {
  return prix.toLocaleString("fr-FR") + " FCFA";
}

function StatIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "building":
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    case "users":
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    case "shield":
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case "money":
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    default:
      return null;
  }
}

function DashboardContent() {
  const { biens, locataires, contrats, loading, refreshAll } = useAdmin();

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const totalLoyers = locataires.reduce((sum, l) => sum + l.loyer, 0);
  const locatairesEnRetard = locataires.filter((l) => l.statut !== "a_jour");
  const contratsActifs = contrats.filter((c) => c.statut === "actif");
  const tauxOccupation = biens.length > 0 ? Math.round((biens.filter(b => !b.disponible).length / biens.length) * 100) : 0;

  const today = new Date().toISOString().split("T")[0];
  const in7days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const contratsExpirentBientot = contrats.filter((c) => c.dateFin >= today && c.dateFin <= in7days);

  const stats = [
    { label: "Biens Disponibles", value: biens.filter(b => b.disponible).length.toString(), color: "bg-blue-50 text-blue-700", icon: "building" },
    { label: "Locataires Actifs", value: locataires.length.toString(), color: "bg-green-50 text-green-700", icon: "users" },
    { label: "Assurances Actives", value: contratsActifs.length.toString(), color: "bg-purple-50 text-purple-700", icon: "shield" },
    { label: "Loyers du mois", value: formatPrix(totalLoyers), color: "bg-amber-50 text-amber-700", icon: "money" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground/60">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Tableau de bord</h1>
        <p className="text-foreground/60 mt-1">Bienvenue, gérant de YOMBAL</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 border border-border shadow-sm">
            <div className={`w-14 h-14 rounded-xl ${stat.color} flex items-center justify-center mb-4`}>
              <StatIcon icon={stat.icon} />
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-foreground/60 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Taux d'occupation */}
      <div className="bg-white rounded-2xl p-6 border border-border shadow-sm mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Taux d&apos;occupation</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-blue-600 to-blue-400 h-4 rounded-full transition-all"
                style={{ width: `${tauxOccupation}%` }}
              />
            </div>
          </div>
          <span className="text-2xl font-bold text-foreground">{tauxOccupation}%</span>
        </div>
        <p className="text-foreground/50 text-sm mt-2">
          {biens.filter(b => !b.disponible).length} occupé(s) sur {biens.length} bien(s)
        </p>
      </div>

      {/* Assurances expirant bientôt */}
      {contratsExpirentBientot.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-orange-200 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
            Assurances expirent dans 7 jours
          </h2>
          <div className="space-y-3">
            {contratsExpirentBientot.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                <div>
                  <p className="font-medium text-foreground">{c.client}</p>
                  <p className="text-sm text-foreground/60">{c.typeVehicule} • {c.immatriculation}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-orange-700">Expire le {c.dateFin}</p>
                  <a
                    href={`https://wa.me/221${c.telephone.replace(/\s/g, "")}?text=${encodeURIComponent(`Bonjour ${c.client}, votre assurance ${c.typeVehicule} (${c.immatriculation}) expire le ${c.dateFin}. Passez à l'agence YOMBAL pour le renouvellement. Merci.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-600 font-medium hover:underline"
                  >
                    Rappel WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions rapides */}
      <div className="bg-white rounded-2xl p-6 border border-border shadow-sm mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/admin/biens"
            className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all"
          >
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-medium text-blue-700">Gérer les biens</span>
          </a>
          <a
            href="/admin/locataires"
            className="flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-all"
          >
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span className="font-medium text-green-700">Locataires</span>
          </a>
          <a
            href="/admin/recouvrements"
            className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-all"
          >
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
            </svg>
            <span className="font-medium text-amber-700">Recouvrements</span>
          </a>
          <a
            href="/admin/assurances"
            className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all"
          >
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="font-medium text-purple-700">Assurances</span>
          </a>
        </div>
      </div>

      {/* Loyers en retard */}
      <div className="bg-white rounded-2xl p-6 border border-border shadow-sm mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">
          Loyers en retard
          {locatairesEnRetard.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-red-50 text-red-600 text-sm rounded-full">
              {locatairesEnRetard.length}
            </span>
          )}
        </h2>
        {locatairesEnRetard.length === 0 ? (
          <p className="text-foreground/50 text-center py-6">Tous les locataires sont à jour !</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-sm font-semibold text-foreground/70">Locataire</th>
                  <th className="pb-3 text-sm font-semibold text-foreground/70">Bien</th>
                  <th className="pb-3 text-sm font-semibold text-foreground/70">Montant</th>
                  <th className="pb-3 text-sm font-semibold text-foreground/70">Statut</th>
                  <th className="pb-3 text-sm font-semibold text-foreground/70">Rappel</th>
                </tr>
              </thead>
              <tbody>
                {locatairesEnRetard.map((loc) => (
                  <tr key={loc.id} className="border-b border-border/50">
                    <td className="py-3 text-foreground">{loc.nom}</td>
                    <td className="py-3 text-foreground/70">{loc.bien}</td>
                    <td className="py-3 font-semibold text-foreground">{formatPrix(loc.loyer)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${loc.statut === "impaye" ? "bg-red-50 text-red-600" : "bg-orange-50 text-orange-600"}`}>
                        {loc.statut === "impaye" ? "Impayé" : "En retard"}
                      </span>
                    </td>
                    <td className="py-3">
                      <a
                        href={`https://wa.me/221${loc.telephone.replace(/\s/g, "")}?text=${encodeURIComponent(`Bonjour ${loc.nom}, ceci est un rappel pour le paiement de votre loyer de ${formatPrix(loc.loyer)}. Merci. - Agence YOMBAL`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all inline-flex"
                        title="Rappel WhatsApp"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QR Code */}
      <QRCodeCard />

      {/* Biens occupés */}
      {biens.filter(b => !b.disponible).length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-4">Biens Occupés</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {biens.filter(b => !b.disponible).map((bien) => (
              <div key={bien.id} className="p-4 bg-red-50/50 border border-red-100 rounded-xl">
                <p className="font-medium text-foreground">{bien.titre}</p>
                <p className="text-sm text-foreground/60">{bien.quartier} • {formatPrix(bien.prix)}/mois</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
