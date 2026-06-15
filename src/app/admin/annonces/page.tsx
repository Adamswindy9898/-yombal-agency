"use client";

import { useState, useEffect, useRef } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  getAnnonces,
  addAnnonce,
  updateAnnonce,
  deleteAnnonce,
  Annonce,
} from "@/lib/firestore";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    titre: "",
    message: "",
    type: "info" as Annonce["type"],
    mediaUrl: "",
    mediaType: "" as "" | "image" | "video",
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
    setForm({ titre: "", message: "", type: "info", mediaUrl: "", mediaType: "", lien: "", lienTexte: "", actif: true });
    setEditAnnonce(null);
    setShowForm(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleEdit(a: Annonce) {
    setForm({
      titre: a.titre,
      message: a.message,
      type: a.type,
      mediaUrl: a.mediaUrl || "",
      mediaType: a.mediaType || "",
      lien: a.lien || "",
      lienTexte: a.lienTexte || "",
      actif: a.actif,
    });
    setEditAnnonce(a);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      alert("Fichier non supporté. Choisissez une photo ou une vidéo.");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      alert("Fichier trop volumineux (max 50 Mo).");
      return;
    }

    setUploading(true);
    setUploadProgress("Envoi en cours...");

    try {
      const ext = file.name.split(".").pop();
      const fileName = `annonces/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      setForm((prev) => ({
        ...prev,
        mediaUrl: url,
        mediaType: isImage ? "image" : "video",
      }));
      setUploadProgress("Fichier envoyé !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi du fichier. Vérifiez les règles Firebase Storage.");
      setUploadProgress("");
    } finally {
      setUploading(false);
    }
  }

  function removeMedia() {
    setForm((prev) => ({ ...prev, mediaUrl: "", mediaType: "" }));
    setUploadProgress("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        titre: form.titre,
        message: form.message,
        type: form.type,
        mediaUrl: form.mediaUrl || undefined,
        mediaType: form.mediaType || undefined,
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
              <textarea
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
                placeholder="Ex: Appartement F3 à Keur Issa, 150 000 FCFA/mois. Disponible immédiatement !"
              />
            </div>

            {/* Section Média — Upload direct */}
            <div className="border border-dashed border-border rounded-xl p-4 bg-muted/30">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Photo ou Vidéo (optionnel)
              </h3>

              {!form.mediaUrl ? (
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`border-2 border-dashed border-border rounded-xl p-8 text-center transition-all hover:border-gold hover:bg-gold/5 ${uploading ? "pointer-events-none opacity-60" : ""}`}>
                    {uploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-foreground/60">{uploadProgress}</p>
                      </div>
                    ) : (
                      <>
                        <svg className="w-10 h-10 text-foreground/30 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-sm font-medium text-foreground/70">Cliquez ou glissez une photo / vidéo ici</p>
                        <p className="text-xs text-foreground/40 mt-1">JPG, PNG, MP4 — max 50 Mo</p>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {form.mediaType === "image" && (
                    <img src={form.mediaUrl} alt="Aperçu" className="w-full h-48 object-cover rounded-lg" />
                  )}
                  {form.mediaType === "video" && (
                    <video src={form.mediaUrl} controls className="w-full h-48 object-cover rounded-lg" />
                  )}
                  <button
                    type="button"
                    onClick={removeMedia}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <p className="text-xs text-green-600 mt-2 font-medium">{uploadProgress || "Média ajouté"}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Lien / bouton (optionnel)</label>
                <input
                  type="text"
                  value={form.lien}
                  onChange={(e) => setForm({ ...form, lien: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                  placeholder="/biens ou https://wa.me/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Texte du bouton</label>
                <input
                  type="text"
                  value={form.lienTexte}
                  onChange={(e) => setForm({ ...form, lienTexte: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                  placeholder="Voir le bien"
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
                disabled={saving || uploading}
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
          <p className="text-foreground/40 mt-2">Créez une annonce avec photo ou vidéo pour informer vos visiteurs.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {annonces.map((a) => {
            const t = typeLabels[a.type] || typeLabels.info;
            return (
              <div key={a.id} className={`bg-white rounded-xl border border-border shadow-sm overflow-hidden ${!a.actif ? "opacity-50" : ""}`}>
                <div className="flex flex-col sm:flex-row">
                  {/* Thumbnail */}
                  {a.mediaUrl && a.mediaType === "image" && (
                    <div className="sm:w-40 h-32 sm:h-auto flex-shrink-0">
                      <img src={a.mediaUrl} alt={a.titre} className="w-full h-full object-cover" />
                    </div>
                  )}
                  {a.mediaUrl && a.mediaType === "video" && (
                    <div className="sm:w-40 h-32 sm:h-auto flex-shrink-0 relative bg-gray-900 flex items-center justify-center">
                      <video src={a.mediaUrl} className="w-full h-full object-cover" muted />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center">
                          <svg className="w-4 h-4 text-gray-800 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${t.color}`}>
                          {t.label}
                        </span>
                        {a.mediaType && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            {a.mediaType === "image" ? "Photo" : "Vidéo"}
                          </span>
                        )}
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
                      <p className="text-sm text-foreground/60 line-clamp-2">{a.message}</p>
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
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
