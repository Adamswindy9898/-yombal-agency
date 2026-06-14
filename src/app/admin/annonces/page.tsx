"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  getAnnonces,
  addAnnonce,
  updateAnnonce,
  deleteAnnonce,
  Annonce,
} from "@/lib/firestore";

const typeLabels: Record<string, { label: string; color: string }> = {
  info: { label: "Information", color: "bg-blue-100 text-blue-700" },
  promo: { label: "Promotion", color: "bg-green-100 text-green-700" },
  urgent: { label: "Urgent", color: "bg-red-100 text-red-700" },
  nouveau: { label: "Nouveau", color: "bg-amber-100 text-amber-700" },
};

export default function AdminAnnoncesPage() {
  return (
    <AdminLayout>
      <AnnoncesContent />
    </AdminLayout>
  );
}

function AnnoncesContent() {
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editAnnonce, setEditAnnonce] = useState<Annonce | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [form, setForm] = useState({
    titre: "",
    message: "",
    type: "info" as Annonce["type"],
    lien: "",
    lienTexte: "",
    actif: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const data = await getAnnonces();
    setAnnonces(data);
    setLoading(false);
  }

  function resetForm() {
    setForm({ titre: "", message: "", type: "info", lien: "", lienTexte: "", actif: true });
    setEditAnnonce(null);
    setShowForm(false);
  }

  function handleEdit(a: Annonce) {
    setForm({
      titre: a.titre,
      message: a.message,
      type: a.type,
      lien: a.lien || "",
      lienTexte: a.lienTexte || "",
      actif: a.actif,
    });
    setEditAnnonce(a);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        titre: form.titre,
        message: form.message,
        type: form.type,
        lien: form.lien || undefined,
        lienTexte: form.lienTexte || undefined,
        actif: form.actif,
        createdAt: editAnnonce?.createdAt || new Date().toISOString(),
      };

      if (editAnnonce) {
        await updateAnnonce(editAnnonce.id, data);
        setSuccessMsg("Annonce modifiée !");
      } else {
        await addAnnonce(data as Omit<Annonce, "id">);
        setSuccessMsg("Annonce créée !");
      }
      await loadData();
      resetForm();
    } catch {
      alert("Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(id: string, actif: boolean) {
    await updateAnnonce(id, { actif: !actif });
    await loadData();
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette annonce ?")) return;
    await deleteAnnonce(id);
    await loadData();
    setSuccessMsg("Annonce supprimée.");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Annonces en direct</h1>
          <p className="text-foreground/60 mt-1">
            {annonces.filter((a) => a.actif).length} active(s) sur {annonces.length}
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-5 py-3 gradient-gold text-primary-dark font-bold rounded-xl hover:opacity-90 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouvelle annonce
        </button>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-green-800 font-medium text-sm">{successMsg}</p>
          <button onClick={() => setSuccessMsg("")} className="ml-auto text-green-600 hover:text-green-800">✕</button>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-2xl p-6 border border-border shadow-sm mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">
            {editAnnonce ? "Modifier l'annonce" : "Nouvelle annonce"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Titre</label>
                <input
                  type="text"
                  required
                  value={form.titre}
                  onChange={(e) => setForm({ ...form, titre: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                  placeholder="Ex: Nouveau bien disponible !"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as Annonce["type"] })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                >
                  <option value="info">Information</option>
                  <option value="promo">Promotion</option>
                  <option value="urgent">Urgent</option>
                  <option value="nouveau">Nouveau</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Message</label>
              <input
                type="text"
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                placeholder="Ex: Appartement F3 à Keur Issa, 150 000 FCFA/mois"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Lien (optionnel)</label>
                <input
                  type="text"
                  value={form.lien}
                  onChange={(e) => setForm({ ...form, lien: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                  placeholder="/biens ou https://wa.me/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Texte du lien</label>
                <input
                  type="text"
                  value={form.lienTexte}
                  onChange={(e) => setForm({ ...form, lienTexte: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                  placeholder="Voir le bien →"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.actif}
                  onChange={(e) => setForm({ ...form, actif: e.target.checked })}
                  className="w-4 h-4 rounded border-border text-gold focus:ring-gold"
                />
                <span className="text-sm font-medium text-foreground">Active (visible sur le site)</span>
              </label>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 gradient-gold text-primary-dark font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
              >
                {saving ? "Enregistrement..." : editAnnonce ? "Modifier" : "Publier"}
              </button>
              <button type="button" onClick={resetForm} className="px-6 py-3 border border-border text-foreground/70 font-medium rounded-xl hover:bg-muted transition-all">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {annonces.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border shadow-sm p-12 text-center">
          <p className="text-foreground/60 text-lg">Aucune annonce.</p>
          <p className="text-foreground/40 mt-2">Créez une annonce pour informer vos visiteurs en temps réel.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {annonces.map((a) => {
            const t = typeLabels[a.type] || typeLabels.info;
            return (
              <div key={a.id} className={`bg-white rounded-xl border border-border shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4 ${!a.actif ? "opacity-50" : ""}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${t.color}`}>
                      {t.label}
                    </span>
                    {a.actif ? (
                      <span className="flex items-center gap-1 text-xs text-green-600">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        En direct
                      </span>
                    ) : (
                      <span className="text-xs text-foreground/40">Désactivée</span>
                    )}
                  </div>
                  <p className="font-semibold text-foreground">{a.titre}</p>
                  <p className="text-sm text-foreground/60">{a.message}</p>
                  {a.lien && <p className="text-xs text-primary mt-1">{a.lienTexte || a.lien}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(a.id, a.actif)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      a.actif
                        ? "bg-orange-50 text-orange-700 hover:bg-orange-100"
                        : "bg-green-50 text-green-700 hover:bg-green-100"
                    }`}
                  >
                    {a.actif ? "Désactiver" : "Activer"}
                  </button>
                  <button
                    onClick={() => handleEdit(a)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
