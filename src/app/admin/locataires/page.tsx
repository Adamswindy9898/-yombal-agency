"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  getLocataires,
  addLocataire,
  updateLocataire,
  deleteLocataire,
  Locataire,
} from "@/lib/firestore";

function formatPrix(prix: number): string {
  return prix.toLocaleString("fr-FR") + " FCFA";
}

function getStatutBadge(statut: string) {
  switch (statut) {
    case "a_jour":
      return <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">À jour</span>;
    case "en_retard":
      return <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs font-semibold rounded-full">En retard</span>;
    case "impaye":
      return <span className="px-2 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full">Impayé</span>;
    default:
      return null;
  }
}

export default function AdminLocatairesPage() {
  const [locataires, setLocataires] = useState<Locataire[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nom: "",
    telephone: "",
    bien: "",
    loyer: "",
    dateEntree: "",
  });

  useEffect(() => {
    loadLocataires();
  }, []);

  async function loadLocataires() {
    try {
      const data = await getLocataires();
      setLocataires(data);
    } catch (error) {
      console.error("Erreur chargement locataires:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const newLocataire: Omit<Locataire, "id"> = {
        nom: form.nom,
        telephone: form.telephone,
        bien: form.bien,
        loyer: parseInt(form.loyer),
        dateEntree: form.dateEntree,
        statut: "a_jour",
        dernierPaiement: new Date().toISOString().split("T")[0],
      };
      await addLocataire(newLocataire);
      await loadLocataires();
      setForm({ nom: "", telephone: "", bien: "", loyer: "", dateEntree: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Erreur enregistrement:", error);
      alert("Erreur lors de l'enregistrement. Vérifiez votre connexion.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Supprimer ce locataire ?")) {
      try {
        await deleteLocataire(id);
        setLocataires(locataires.filter((l) => l.id !== id));
      } catch (error) {
        console.error("Erreur suppression:", error);
        alert("Erreur lors de la suppression.");
      }
    }
  }

  async function handleMarkPaid(id: string) {
    try {
      await updateLocataire(id, {
        statut: "a_jour",
        dernierPaiement: new Date().toISOString().split("T")[0],
      });
      await loadLocataires();
    } catch (error) {
      console.error("Erreur mise à jour:", error);
    }
  }

  const totalLoyers = locataires.reduce((sum, l) => sum + l.loyer, 0);
  const enRetard = locataires.filter((l) => l.statut !== "a_jour").length;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-foreground/60">Chargement des locataires...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Locataires</h1>
          <p className="text-foreground/60 mt-1">
            {locataires.length} locataire(s) • {enRetard} en retard • Total loyers: {formatPrix(totalLoyers)}/mois
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-3 gradient-gold text-primary-dark font-bold rounded-xl hover:opacity-90 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ajouter
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 border border-border shadow-sm mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Nouveau locataire</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Nom complet</label>
              <input
                type="text"
                required
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                placeholder="Ex: Moussa Diop"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Téléphone</label>
              <input
                type="text"
                required
                value={form.telephone}
                onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                placeholder="77 123 45 67"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Bien occupé</label>
              <input
                type="text"
                required
                value={form.bien}
                onChange={(e) => setForm({ ...form, bien: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                placeholder="Ex: Apt F3 - Keur Issa"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Loyer (FCFA/mois)</label>
              <input
                type="number"
                required
                value={form.loyer}
                onChange={(e) => setForm({ ...form, loyer: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                placeholder="150000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Date d&apos;entrée</label>
              <input
                type="date"
                required
                value={form.dateEntree}
                onChange={(e) => setForm({ ...form, dateEntree: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
            <div className="md:col-span-2 flex gap-3 mt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 gradient-gold text-primary-dark font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
              >
                {saving ? "Enregistrement..." : "Ajouter"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 border border-border text-foreground/70 font-medium rounded-xl hover:bg-muted transition-all"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des locataires */}
      {locataires.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border shadow-sm p-12 text-center">
          <p className="text-foreground/60 text-lg">Aucun locataire enregistré.</p>
          <p className="text-foreground/40 mt-2">Cliquez sur &quot;Ajouter&quot; pour commencer.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-foreground/70">Locataire</th>
                  <th className="px-6 py-4 text-sm font-semibold text-foreground/70">Bien</th>
                  <th className="px-6 py-4 text-sm font-semibold text-foreground/70">Loyer</th>
                  <th className="px-6 py-4 text-sm font-semibold text-foreground/70">Dernier paiement</th>
                  <th className="px-6 py-4 text-sm font-semibold text-foreground/70">Statut</th>
                  <th className="px-6 py-4 text-sm font-semibold text-foreground/70">Actions</th>
                </tr>
              </thead>
              <tbody>
                {locataires.map((locataire) => (
                  <tr key={locataire.id} className="border-t border-border/50 hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{locataire.nom}</p>
                      <p className="text-xs text-foreground/50">{locataire.telephone}</p>
                    </td>
                    <td className="px-6 py-4 text-foreground/70">{locataire.bien}</td>
                    <td className="px-6 py-4 font-semibold text-foreground">{formatPrix(locataire.loyer)}</td>
                    <td className="px-6 py-4 text-foreground/70">{locataire.dernierPaiement}</td>
                    <td className="px-6 py-4">{getStatutBadge(locataire.statut)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {locataire.statut !== "a_jour" && (
                          <button
                            onClick={() => handleMarkPaid(locataire.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                            title="Marquer comme payé"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        )}
                        <a
                          href={`https://wa.me/221${locataire.telephone.replace(/\s/g, "")}?text=${encodeURIComponent(`Bonjour ${locataire.nom}, ceci est un rappel pour le paiement de votre loyer de ${formatPrix(locataire.loyer)}. Merci. - Agence YOMBAL`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                          title="Rappel WhatsApp"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                        </a>
                        <button
                          onClick={() => handleDelete(locataire.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Supprimer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
