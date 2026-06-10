"use client";

import AdminLayout from "@/components/admin/AdminLayout";

const stats = [
  { label: "Biens Disponibles", value: "6", color: "bg-blue-50 text-blue-700", icon: "building" },
  { label: "Locataires Actifs", value: "12", color: "bg-green-50 text-green-700", icon: "users" },
  { label: "Assurances Actives", value: "24", color: "bg-purple-50 text-purple-700", icon: "shield" },
  { label: "Loyers du mois", value: "850 000 FCFA", color: "bg-amber-50 text-amber-700", icon: "money" },
];

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

export default function AdminDashboard() {
  return (
    <AdminLayout>
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

      {/* Actions rapides */}
      <div className="bg-white rounded-2xl p-6 border border-border shadow-sm mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="/admin/biens"
            className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all"
          >
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-medium text-blue-700">Ajouter un bien</span>
          </a>
          <a
            href="/admin/locataires"
            className="flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-all"
          >
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span className="font-medium text-green-700">Ajouter un locataire</span>
          </a>
          <a
            href="/admin/assurances"
            className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all"
          >
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="font-medium text-purple-700">Nouveau contrat</span>
          </a>
        </div>
      </div>

      {/* Loyers en retard */}
      <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
        <h2 className="text-xl font-bold text-foreground mb-4">Loyers en retard</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 text-sm font-semibold text-foreground/70">Locataire</th>
                <th className="pb-3 text-sm font-semibold text-foreground/70">Bien</th>
                <th className="pb-3 text-sm font-semibold text-foreground/70">Montant</th>
                <th className="pb-3 text-sm font-semibold text-foreground/70">Retard</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="py-3 text-foreground">Moussa Diop</td>
                <td className="py-3 text-foreground/70">Apt F3 - Keur Issa</td>
                <td className="py-3 font-semibold text-foreground">150 000 FCFA</td>
                <td className="py-3"><span className="px-2 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full">15 jours</span></td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 text-foreground">Awa Ndiaye</td>
                <td className="py-3 text-foreground/70">Chambre - Mbour 3</td>
                <td className="py-3 font-semibold text-foreground">45 000 FCFA</td>
                <td className="py-3"><span className="px-2 py-1 bg-orange-50 text-orange-600 text-xs font-semibold rounded-full">5 jours</span></td>
              </tr>
              <tr>
                <td className="py-3 text-foreground">Ibrahima Fall</td>
                <td className="py-3 text-foreground/70">Studio - Cité Lamy</td>
                <td className="py-3 font-semibold text-foreground">85 000 FCFA</td>
                <td className="py-3"><span className="px-2 py-1 bg-orange-50 text-orange-600 text-xs font-semibold rounded-full">3 jours</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
