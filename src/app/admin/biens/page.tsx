"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Bien, TypeBien } from "@/data/biens";
import { getBiens, addBien, updateBien, deleteBien } from "@/lib/firestore";

function formatPrix(prix: number): string {
  return prix.toLocaleString("fr-FR") + " FCFA";
}

export default function AdminBiensPage() {
  const [biens, setBiens] = useState<Bien[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editBien, setEditBien] = useState<Bien | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const [form, setForm] = useState({
    titre: "",
    type: "appartement" as TypeBien,
    prix: "",
    prixParMois: true,
    surface: "",
    pieces: "",
    quartier: "",
    ville: "Thiès",
    description: "",
    disponible: true,
  });

  useEffect(() => {
    loadBiens();
  }, []);

  async function loadBiens() {
    try {
      const data = await getBiens();
      setBiens(data);
    } catch (error) {
      console.error("Erreur chargement biens:", error);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm({
      titre: "",
      type: "appartement",
      prix: "",
      prixParMois: true,
      surface: "",
      pieces: "",
      quartier: "",
      ville: "Thiès",
      description: "",
      disponible: true,
    });
    setEditBien(null);
    setImageUrl("");
    setShowForm(false);
  }

  function handleEdit(bien: Bien) {
    setForm({
      titre: bien.titre,
      type: bien.type,
      prix: bien.prix.toString(),
      prixParMois: bien.prixParMois,
      surface: bien.surface.toString(),
      pieces: bien.pieces?.toString() || "",
      quartier: bien.quartier,
      ville: bien.ville,
      description: bien.description,
      disponible: bien.disponible,
    });
    setEditBien(bien);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrls: string[] = editBien?.images || [];

      if (imageUrl.trim()) {
        imageUrls = [...imageUrls, imageUrl.trim()];
      }

      const bienData = {
        titre: form.titre,
        type: form.type,
        prix: parseInt(form.prix),
        prixParMois: form.prixParMois,
        surface: parseInt(form.surface),
        pieces: form.pieces ? parseInt(form.pieces) : undefined,
        quartier: form.quartier,
        ville: form.ville,
        description: form.description,
        images: imageUrls,
        disponible: form.disponible,
        createdAt: editBien?.createdAt || new Date().toISOString().split("T")[0],
      };

      if (editBien) {
        await updateBien(editBien.id, bienData);
      } else {
        await addBien(bienData as Omit<Bien, "id">);
      }
      await loadBiens();

      resetForm();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce bien ?")) return;
    try {
      await deleteBien(id);
      await loadBiens();
    } catch (error) {
      console.error("Erreur suppression:", error);
      alert("Erreur lors de la suppression.");
    }
  }

  async function handleToggleDisponible(bien: Bien) {
    const newStatut = !bien.disponible;
    try {
      await updateBien(bien.id, { disponible: newStatut });
      await loadBiens();
    } catch (error) {
      console.error("Erreur:", error);
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-foreground/60">Chargement...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Biens</h1>
          <p className="text-foreground/60 mt-1">
            {biens.length} bien(s) au total
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
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
          <h2 className="text-xl font-bold text-foreground mb-4">
            {editBien ? "Modifier le bien" : "Nouveau bien"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Titre</label>
              <input
                type="text"
                required
                value={form.titre}
                onChange={(e) => setForm({ ...form, titre: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                placeholder="Ex: Appartement F3 Moderne"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as TypeBien })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                <option value="appartement">Appartement</option>
                <option value="chambre">Chambre</option>
                <option value="studio">Studio</option>
                <option value="magasin">Magasin</option>
                <option value="terrain">Terrain</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Prix (FCFA)</label>
              <input
                type="number"
                required
                value={form.prix}
                onChange={(e) => setForm({ ...form, prix: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                placeholder="150000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Type de prix</label>
              <select
                value={form.prixParMois ? "mois" : "vente"}
                onChange={(e) => setForm({ ...form, prixParMois: e.target.value === "mois" })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                <option value="mois">Par mois (location)</option>
                <option value="vente">Prix de vente</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Surface (m²)</label>
              <input
                type="number"
                required
                value={form.surface}
                onChange={(e) => setForm({ ...form, surface: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                placeholder="80"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Nombre de pièces</label>
              <input
                type="number"
                value={form.pieces}
                onChange={(e) => setForm({ ...form, pieces: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                placeholder="3 (optionnel)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Quartier</label>
              <input
                type="text"
                required
                value={form.quartier}
                onChange={(e) => setForm({ ...form, quartier: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                placeholder="Keur Issa"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Ville</label>
              <input
                type="text"
                required
                value={form.ville}
                onChange={(e) => setForm({ ...form, ville: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                placeholder="Thiès"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1">Description</label>
              <textarea
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 h-24"
                placeholder="Description du bien..."
              />
            </div>

            {/* Lien photo */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1">
                Lien de la photo (optionnel)
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                placeholder="Collez le lien de la photo ici (ex: https://...)"
              />
              <p className="text-xs text-foreground/40 mt-1">
                Envoyez la photo sur Google Drive ou ImgBB, puis collez le lien ici
              </p>
              {editBien && editBien.images.length > 0 && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  {editBien.images.map((img, i) => (
                    <div key={i} className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-2 flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.disponible}
                  onChange={(e) => setForm({ ...form, disponible: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-foreground">Disponible</span>
              </label>
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={uploading}
                className="px-6 py-3 gradient-gold text-primary-dark font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
              >
                {uploading ? "Enregistrement..." : editBien ? "Modifier" : "Ajouter"}
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

      {/* Liste des biens */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-foreground/70">Bien</th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground/70">Type</th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground/70">Prix</th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground/70">Quartier</th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground/70">Statut</th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground/70">Actions</th>
              </tr>
            </thead>
            <tbody>
              {biens.map((bien) => (
                <tr key={bien.id} className="border-t border-border/50 hover:bg-muted/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {bien.images.length > 0 ? (
                        <img src={bien.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-sm">
                          {bien.type === "appartement" && "🏢"}
                          {bien.type === "chambre" && "🛏️"}
                          {bien.type === "studio" && "🏠"}
                          {bien.type === "magasin" && "🏪"}
                          {bien.type === "terrain" && "🏗️"}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-foreground">{bien.titre}</p>
                        <p className="text-xs text-foreground/50">{bien.surface} m²{bien.pieces ? ` • ${bien.pieces} pièces` : ""}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 capitalize text-foreground/70">{bien.type}</td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-foreground">{formatPrix(bien.prix)}</p>
                    <p className="text-xs text-foreground/50">{bien.prixParMois ? "/mois" : "vente"}</p>
                  </td>
                  <td className="px-6 py-4 text-foreground/70">{bien.quartier}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleDisponible(bien)}
                      className={`px-2 py-1 rounded-full text-xs font-semibold cursor-pointer ${bien.disponible ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                    >
                      {bien.disponible ? "Disponible" : "Occupé"}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(bien)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Modifier"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(bien.id)}
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
    </AdminLayout>
  );
}
