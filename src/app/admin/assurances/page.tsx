"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/lib/admin-context";
import {
  addContrat,
  updateContrat,
  deleteContrat,
  ContratAssurance,
} from "@/lib/firestore";

function formatPrix(prix: number): string {
  return prix.toLocaleString("fr-FR") + " FCFA";
}

function getStatutBadge(statut: string) {
  switch (statut) {
    case "actif":
      return <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">Actif</span>;
    case "bientot":
      return <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs font-semibold rounded-full">Expire bientôt</span>;
    case "expire":
      return <span className="px-2 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full">Expiré</span>;
    default:
      return null;
  }
}

function getTypeLabel(type: string) {
  switch (type) {
    case "auto": return "Auto";
    case "cyclomoteur": return "Cyclo";
    case "taxi": return "Taxi";
    default: return type;
  }
}

export default function AdminAssurancesPage() {
  return (
    <AdminLayout>
      <AssurancesContent />
    </AdminLayout>
  );
}

function AssurancesContent() {
  const { contrats, loading, refreshContrats } = useAdmin();

  useEffect(() => {
    refreshContrats();
  }, [refreshContrats]);
  const [showForm, setShowForm] = useState(false);
  const [editContrat, setEditContrat] = useState<ContratAssurance | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [form, setForm] = useState({
    client: "",
    telephone: "",
    typeVehicule: "auto" as "auto" | "cyclomoteur" | "taxi",
    immatriculation: "",
    compagnie: "",
    duree: "1",
    prixAchat: "",
    prixVente: "",
    dateDebut: "",
    statut: "actif" as "actif" | "expire" | "bientot",
  });

  function resetForm() {
    setForm({ client: "", telephone: "", typeVehicule: "auto", immatriculation: "", compagnie: "", duree: "1", prixAchat: "", prixVente: "", dateDebut: "", statut: "actif" });
    setEditContrat(null);
    setShowForm(false);
  }

  function handleEdit(contrat: ContratAssurance) {
    setForm({
      client: contrat.client,
      telephone: contrat.telephone,
      typeVehicule: contrat.typeVehicule,
      immatriculation: contrat.immatriculation,
      compagnie: contrat.compagnie,
      duree: contrat.duree.toString(),
      prixAchat: contrat.prixAchat.toString(),
      prixVente: contrat.prixVente.toString(),
      dateDebut: contrat.dateDebut,
      statut: contrat.statut,
    });
    setEditContrat(contrat);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function calculerDateFin(dateDebut: string, duree: number): string {
    if (!dateDebut) return "";
    const date = new Date(dateDebut);
    date.setMonth(date.getMonth() + duree);
    return date.toISOString().split("T")[0];
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    try {
      const duree = parseInt(form.duree);
      const data = {
        client: form.client,
        telephone: form.telephone,
        typeVehicule: form.typeVehicule,
        immatriculation: form.immatriculation,
        compagnie: form.compagnie,
        duree,
        prixAchat: parseInt(form.prixAchat),
        prixVente: parseInt(form.prixVente),
        dateDebut: form.dateDebut,
        dateFin: calculerDateFin(form.dateDebut, duree),
        statut: form.statut,
      };

      if (editContrat) {
        await updateContrat(editContrat.id, data);
        setSuccessMsg("Contrat modifié avec succès !");
      } else {
        await addContrat(data);
        setSuccessMsg("Contrat enregistré avec succès !");
      }
      await refreshContrats();
      resetForm();
    } catch (error: any) {
      console.error("Erreur enregistrement:", error);
      if (error?.code === "permission-denied") {
        alert("Accès refusé par Firebase. Vérifiez les règles Firestore.");
      } else {
        alert("Erreur lors de l'enregistrement. Vérifiez votre connexion.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce contrat ?")) return;
    try {
      await deleteContrat(id);
      await refreshContrats();
      setSuccessMsg("Contrat supprimé.");
    } catch (error: any) {
      console.error("Erreur suppression:", error);
      alert("Erreur lors de la suppression.");
    }
  }

  const actifs = contrats.filter((c) => c.statut === "actif").length;
  const totalBenefice = contrats.reduce((sum, c) => sum + (c.prixVente - c.prixAchat), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground/60">Chargement des contrats...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Assurances</h1>
          <p className="text-foreground/60 mt-1">
            {contrats.length} contrat(s) • {actifs} actifs • Bénéfice total : {formatPrix(totalBenefice)}
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-5 py-3 gradient-gold text-primary-dark font-bold rounded-xl hover:opacity-90 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouveau contrat
        </button>
      </div>

      {/* Message de succès */}
      {successMsg && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-green-800 font-medium text-sm">{successMsg}</p>
          <button onClick={() => setSuccessMsg("")} className="ml-auto text-green-600 hover:text-green-800">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Formulaire */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 border border-border shadow-sm mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">
            {editContrat ? `Modifier : ${editContrat.client}` : "Vendre une assurance"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Nom du client</label>
              <input
                type="text"
                required
                value={form.client}
                onChange={(e) => setForm({ ...form, client: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                placeholder="Ex: Abdoulaye Sow"
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
                placeholder="77 111 22 33"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Type de véhicule</label>
              <select
                value={form.typeVehicule}
                onChange={(e) => setForm({ ...form, typeVehicule: e.target.value as "auto" | "cyclomoteur" | "taxi" })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                <option value="auto">Auto</option>
                <option value="cyclomoteur">Cyclomoteur</option>
                <option value="taxi">Taxi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Immatriculation</label>
              <input
                type="text"
                required
                value={form.immatriculation}
                onChange={(e) => setForm({ ...form, immatriculation: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                placeholder="DK-1234-AB"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Compagnie d&apos;assurance</label>
              <input
                type="text"
                required
                value={form.compagnie}
                onChange={(e) => setForm({ ...form, compagnie: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                placeholder="Ex: NSIA, Askia, Allianz..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Durée</label>
              <select
                value={form.duree}
                onChange={(e) => setForm({ ...form, duree: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                <option value="1">1 mois</option>
                <option value="2">2 mois</option>
                <option value="3">3 mois</option>
                <option value="6">6 mois</option>
                <option value="12">12 mois</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Prix d&apos;achat (FCFA)</label>
              <input
                type="number"
                required
                value={form.prixAchat}
                onChange={(e) => setForm({ ...form, prixAchat: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                placeholder="Prix payé à la compagnie"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Prix de vente (FCFA)</label>
              <input
                type="number"
                required
                value={form.prixVente}
                onChange={(e) => setForm({ ...form, prixVente: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                placeholder="Prix vendu au client"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Date de début</label>
              <input
                type="date"
                required
                value={form.dateDebut}
                onChange={(e) => setForm({ ...form, dateDebut: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Date de fin (auto)</label>
              <input
                type="text"
                readOnly
                value={form.dateDebut ? calculerDateFin(form.dateDebut, parseInt(form.duree)) : "—"}
                className="w-full px-4 py-2 border border-border rounded-lg bg-muted text-foreground/70"
              />
            </div>
            {editContrat && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Statut</label>
                <select
                  value={form.statut}
                  onChange={(e) => setForm({ ...form, statut: e.target.value as "actif" | "expire" | "bientot" })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                >
                  <option value="actif">Actif</option>
                  <option value="bientot">Expire bientôt</option>
                  <option value="expire">Expiré</option>
                </select>
              </div>
            )}
            {form.prixAchat && form.prixVente && (
              <div className="md:col-span-2 bg-green-50 p-4 rounded-xl">
                <p className="text-green-700 font-semibold">
                  Bénéfice : {formatPrix(parseInt(form.prixVente) - parseInt(form.prixAchat))}
                </p>
              </div>
            )}
            <div className="md:col-span-2 flex gap-3 mt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 gradient-gold text-primary-dark font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
              >
                {saving ? "Enregistrement..." : editContrat ? "Enregistrer les modifications" : "Enregistrer la vente"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border border-border text-foreground/70 font-medium rounded-xl hover:bg-muted transition-all"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste */}
      {contrats.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border shadow-sm p-12 text-center">
          <p className="text-foreground/60 text-lg">Aucun contrat enregistré.</p>
          <p className="text-foreground/40 mt-2">Cliquez sur &quot;Nouveau contrat&quot; pour commencer.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-foreground/70">Client</th>
                  <th className="px-6 py-4 text-sm font-semibold text-foreground/70">Véhicule</th>
                  <th className="px-6 py-4 text-sm font-semibold text-foreground/70">Compagnie</th>
                  <th className="px-6 py-4 text-sm font-semibold text-foreground/70">Durée</th>
                  <th className="px-6 py-4 text-sm font-semibold text-foreground/70">Bénéfice</th>
                  <th className="px-6 py-4 text-sm font-semibold text-foreground/70">Expiration</th>
                  <th className="px-6 py-4 text-sm font-semibold text-foreground/70">Statut</th>
                  <th className="px-6 py-4 text-sm font-semibold text-foreground/70">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contrats.map((contrat) => (
                  <tr key={contrat.id} className="border-t border-border/50 hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{contrat.client}</p>
                      <p className="text-xs text-foreground/50">{contrat.telephone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                        {getTypeLabel(contrat.typeVehicule)}
                      </span>
                      <p className="text-xs text-foreground/50 mt-1 font-mono">{contrat.immatriculation}</p>
                    </td>
                    <td className="px-6 py-4 text-foreground/70 text-sm">{contrat.compagnie}</td>
                    <td className="px-6 py-4 text-foreground/70">{contrat.duree} mois</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-green-600">+{formatPrix(contrat.prixVente - contrat.prixAchat)}</p>
                      <p className="text-xs text-foreground/40">Vendu: {formatPrix(contrat.prixVente)}</p>
                    </td>
                    <td className="px-6 py-4 text-foreground/70 text-sm">{contrat.dateFin}</td>
                    <td className="px-6 py-4">{getStatutBadge(contrat.statut)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(contrat)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Modifier"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <a
                          href={`https://wa.me/221${contrat.telephone.replace(/\s/g, "")}?text=${encodeURIComponent(`Bonjour ${contrat.client}, votre assurance ${contrat.typeVehicule} (${contrat.immatriculation}) expire le ${contrat.dateFin}. Passez à l'agence YOMBAL pour le renouvellement. Merci.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                          title="Rappel renouvellement WhatsApp"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                        </a>
                        <button
                          onClick={() => handleDelete(contrat.id)}
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
    </>
  );
}
