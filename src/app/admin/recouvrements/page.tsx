"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  getProprietes,
  addPropriete,
  updatePropriete,
  deletePropriete,
  Propriete,
  Unite,
} from "@/lib/firestore";

function formatPrix(prix: number): string {
  return prix.toLocaleString("fr-FR") + " FCFA";
}

const moisLabels = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

export default function AdminRecouvrementsPage() {
  return (
    <AdminLayout>
      <RecouvrementsContent />
    </AdminLayout>
  );
}

function RecouvrementsContent() {
  const [proprietes, setProprietes] = useState<Propriete[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProp, setEditProp] = useState<Propriete | null>(null);
  const [moisSelectionne, setMoisSelectionne] = useState(new Date().getMonth());
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [successMsg, setSuccessMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<{
    nom: string;
    adresse: string;
    proprietaire: string;
    telephoneProprietaire: string;
    unites: { numero: string; type: Unite["type"]; loyer: number; locataire: string; telephone: string; statut: Unite["statut"] }[];
  }>({
    nom: "",
    adresse: "",
    proprietaire: "",
    telephoneProprietaire: "",
    unites: [{ numero: "", type: "chambre", loyer: 0, locataire: "", telephone: "", statut: "vacant" }],
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const data = await getProprietes();
    setProprietes(data);
    setLoading(false);
  }

  function resetForm() {
    setForm({
      nom: "",
      adresse: "",
      proprietaire: "",
      telephoneProprietaire: "",
      unites: [{ numero: "", type: "chambre", loyer: 0, locataire: "", telephone: "", statut: "vacant" }],
    });
    setEditProp(null);
    setShowForm(false);
  }

  function addUnite() {
    setForm({
      ...form,
      unites: [...form.unites, { numero: "", type: "chambre", loyer: 0, locataire: "", telephone: "", statut: "vacant" }],
    });
  }

  function removeUnite(index: number) {
    setForm({ ...form, unites: form.unites.filter((_, i) => i !== index) });
  }

  function updateUnite(index: number, field: string, value: string | number) {
    const updated = [...form.unites];
    (updated[index] as Record<string, unknown>)[field] = value;
    if (field === "locataire") {
      updated[index].statut = value ? "occupe" : "vacant";
    }
    setForm({ ...form, unites: updated });
  }

  function handleEdit(prop: Propriete) {
    setForm({
      nom: prop.nom,
      adresse: prop.adresse,
      proprietaire: prop.proprietaire,
      telephoneProprietaire: prop.telephoneProprietaire,
      unites: prop.unites.map((u) => ({ ...u, locataire: u.locataire || "", telephone: u.telephone || "" })),
    });
    setEditProp(prop);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        nom: form.nom,
        adresse: form.adresse,
        proprietaire: form.proprietaire,
        telephoneProprietaire: form.telephoneProprietaire,
        unites: form.unites,
        createdAt: editProp?.createdAt || new Date().toISOString().split("T")[0],
      };

      if (editProp) {
        await updatePropriete(editProp.id, data);
        setSuccessMsg("Propriété modifiée !");
      } else {
        await addPropriete(data);
        setSuccessMsg("Propriété ajoutée !");
      }
      await loadData();
      resetForm();
    } catch {
      alert("Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  }

  async function togglePaiement(propId: string, uniteIndex: number, moisKey: string, paye: boolean) {
    const prop = proprietes.find((p) => p.id === propId);
    if (!prop) return;
    const unites = [...prop.unites];
    if (!unites[uniteIndex].paiements) unites[uniteIndex].paiements = {};
    unites[uniteIndex].paiements![moisKey] = paye;
    await updatePropriete(propId, { unites });
    await loadData();
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette propriété ?")) return;
    await deletePropriete(id);
    await loadData();
    setSuccessMsg("Propriété supprimée.");
  }

  async function genererPDF(prop: Propriete) {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");

    const pdf = new jsPDF();
    const moisLabel = `${moisLabels[moisSelectionne]} ${annee}`;

    // En-tête
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text("AGENCE YOMBAL", 105, 20, { align: "center" });
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.text("Keur Issa, Thiès | Tel: 77 631 67 51", 105, 28, { align: "center" });

    // Titre
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text(`FICHE DE RECOUVREMENT - ${moisLabel}`, 105, 42, { align: "center" });

    // Info propriété
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Propriété : ${prop.nom}`, 14, 55);
    pdf.text(`Adresse : ${prop.adresse}`, 14, 62);
    pdf.text(`Propriétaire : ${prop.proprietaire}`, 14, 69);
    pdf.text(`Téléphone : ${prop.telephoneProprietaire}`, 14, 76);

    // Tableau
    const unitesOccupees = prop.unites.filter((u) => u.statut === "occupe");
    const tableData = unitesOccupees.map((u, i) => [
      (i + 1).toString(),
      u.numero,
      u.type.charAt(0).toUpperCase() + u.type.slice(1),
      u.locataire || "-",
      u.telephone || "-",
      formatPrix(u.loyer),
    ]);

    const total = unitesOccupees.reduce((sum, u) => sum + u.loyer, 0);

    autoTable(pdf, {
      startY: 84,
      head: [["#", "Unité", "Type", "Locataire", "Téléphone", "Loyer"]],
      body: tableData,
      foot: [["", "", "", "", "TOTAL", formatPrix(total)]],
      theme: "grid",
      headStyles: { fillColor: [30, 64, 175], textColor: 255, fontStyle: "bold" },
      footStyles: { fillColor: [245, 245, 245], textColor: [0, 0, 0], fontStyle: "bold" },
      styles: { fontSize: 10 },
    });

    // Signature
    const finalY = ((pdf as unknown as Record<string, { finalY: number }>).lastAutoTable)?.finalY || 160;
    pdf.setFontSize(10);
    pdf.text(`Montant total à verser au propriétaire : ${formatPrix(total)}`, 14, finalY + 15);
    pdf.text(`Date : ${new Date().toLocaleDateString("fr-FR")}`, 14, finalY + 25);
    pdf.text("Signature Agence : ___________________", 14, finalY + 40);
    pdf.text("Signature Propriétaire : ___________________", 110, finalY + 40);

    pdf.save(`Recouvrement_${prop.proprietaire.replace(/\s/g, "_")}_${moisLabel.replace(/\s/g, "_")}.pdf`);
  }

  async function exporterExcel() {
    const XLSX = await import("xlsx");
    const moisLabel = `${moisLabels[moisSelectionne]} ${annee}`;
    const rows: Record<string, string | number>[] = [];

    proprietes.forEach((prop) => {
      const unitesOccupees = prop.unites.filter((u) => u.statut === "occupe");
      unitesOccupees.forEach((u) => {
        const moisKey = `${annee}-${String(moisSelectionne + 1).padStart(2, "0")}`;
        rows.push({
          "Propriété": prop.nom,
          "Propriétaire": prop.proprietaire,
          "Unité": u.numero,
          "Type": u.type,
          "Locataire": u.locataire || "",
          "Téléphone": u.telephone || "",
          "Loyer (FCFA)": u.loyer,
          "Payé": u.paiements?.[moisKey] ? "Oui" : "Non",
        });
      });
      const totalProp = unitesOccupees.reduce((s, u) => s + u.loyer, 0);
      rows.push({
        "Propriété": "",
        "Propriétaire": "",
        "Unité": "",
        "Type": "",
        "Locataire": "",
        "Téléphone": `TOTAL ${prop.proprietaire}`,
        "Loyer (FCFA)": totalProp,
        "Payé": "",
      });
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, moisLabel);
    XLSX.writeFile(wb, `Recouvrement_${moisLabel.replace(/\s/g, "_")}.xlsx`);
  }

  async function genererPDFGlobal() {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");

    const pdf = new jsPDF();
    const moisLabel = `${moisLabels[moisSelectionne]} ${annee}`;

    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text("AGENCE YOMBAL", 105, 20, { align: "center" });
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.text("Keur Issa, Thiès | Tel: 77 631 67 51", 105, 28, { align: "center" });

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text(`RÉCAPITULATIF GLOBAL - ${moisLabel}`, 105, 42, { align: "center" });

    const tableData: string[][] = [];
    let grandTotal = 0;

    proprietes.forEach((prop) => {
      const unitesOccupees = prop.unites.filter((u) => u.statut === "occupe");
      const totalProp = unitesOccupees.reduce((sum, u) => sum + u.loyer, 0);
      grandTotal += totalProp;

      unitesOccupees.forEach((u) => {
        tableData.push([
          prop.nom,
          prop.proprietaire,
          u.numero,
          u.type.charAt(0).toUpperCase() + u.type.slice(1),
          u.locataire || "-",
          formatPrix(u.loyer),
        ]);
      });

      tableData.push(["", "", "", "", `Sous-total ${prop.proprietaire}`, formatPrix(totalProp)]);
    });

    autoTable(pdf, {
      startY: 50,
      head: [["Propriété", "Propriétaire", "Unité", "Type", "Locataire", "Loyer"]],
      body: tableData,
      foot: [["", "", "", "", "GRAND TOTAL", formatPrix(grandTotal)]],
      theme: "grid",
      headStyles: { fillColor: [30, 64, 175], textColor: 255, fontStyle: "bold" },
      footStyles: { fillColor: [212, 168, 67], textColor: [0, 0, 0], fontStyle: "bold" },
      styles: { fontSize: 9 },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      didParseCell: (data: any) => {
        const raw = data.row?.raw;
        if (Array.isArray(raw) && raw[0] === "" && raw[4]?.startsWith("Sous-total")) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [245, 245, 245];
        }
      },
    });

    pdf.save(`Recouvrement_Global_${moisLabel.replace(/\s/g, "_")}.pdf`);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-foreground/60 ml-4">Chargement...</p>
      </div>
    );
  }

  const totalGlobal = proprietes.reduce(
    (sum, p) => sum + p.unites.filter((u) => u.statut === "occupe").reduce((s, u) => s + u.loyer, 0),
    0
  );
  const totalUnites = proprietes.reduce((sum, p) => sum + p.unites.length, 0);
  const totalOccupees = proprietes.reduce((sum, p) => sum + p.unites.filter((u) => u.statut === "occupe").length, 0);

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Recouvrements</h1>
          <p className="text-foreground/60 mt-1">
            {proprietes.length} propriété(s) • {totalOccupees}/{totalUnites} occupées • Total: {formatPrix(totalGlobal)}/mois
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 px-5 py-3 gradient-gold text-primary-dark font-bold rounded-xl hover:opacity-90 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Propriété
          </button>
          {proprietes.length > 0 && (
            <>
              <button
                onClick={exporterExcel}
                className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Excel
              </button>
              <button
                onClick={genererPDFGlobal}
                className="flex items-center gap-2 px-5 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                PDF Global
              </button>
            </>
          )}
        </div>
      </div>

      {/* Sélecteur mois */}
      <div className="flex gap-4 mb-8 bg-white p-4 rounded-xl border border-border">
        <div>
          <label className="block text-sm font-medium text-foreground/70 mb-1">Mois</label>
          <select
            value={moisSelectionne}
            onChange={(e) => setMoisSelectionne(Number(e.target.value))}
            className="px-4 py-2 border border-border rounded-lg"
          >
            {moisLabels.map((m, i) => (
              <option key={i} value={i}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground/70 mb-1">Année</label>
          <select
            value={annee}
            onChange={(e) => setAnnee(Number(e.target.value))}
            className="px-4 py-2 border border-border rounded-lg"
          >
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
            <option value={2027}>2027</option>
          </select>
        </div>
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

      {/* Formulaire propriété */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 border border-border shadow-sm mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">
            {editProp ? `Modifier : ${editProp.nom}` : "Nouvelle propriété"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Nom de la propriété</label>
                <input
                  type="text"
                  required
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                  placeholder="Ex: Maison Keur Issa"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Adresse</label>
                <input
                  type="text"
                  required
                  value={form.adresse}
                  onChange={(e) => setForm({ ...form, adresse: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                  placeholder="Ex: Rue 10, Keur Issa, Thiès"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Nom du propriétaire</label>
                <input
                  type="text"
                  required
                  value={form.proprietaire}
                  onChange={(e) => setForm({ ...form, proprietaire: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                  placeholder="Ex: Mamadou Fall"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Téléphone propriétaire</label>
                <input
                  type="text"
                  required
                  value={form.telephoneProprietaire}
                  onChange={(e) => setForm({ ...form, telephoneProprietaire: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                  placeholder="77 000 00 00"
                />
              </div>
            </div>

            {/* Unités */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">Unités (chambres, studios...)</h3>
                <button
                  type="button"
                  onClick={addUnite}
                  className="text-sm px-3 py-1 bg-primary/10 text-primary font-medium rounded-lg hover:bg-primary/20 transition-all"
                >
                  + Ajouter unité
                </button>
              </div>

              <div className="space-y-3">
                {form.unites.map((unite, i) => (
                  <div key={i} className="flex flex-wrap gap-3 items-end p-4 bg-muted rounded-xl">
                    <div className="flex-1 min-w-[120px]">
                      <label className="block text-xs text-foreground/60 mb-1">Numéro</label>
                      <input
                        type="text"
                        required
                        value={unite.numero}
                        onChange={(e) => updateUnite(i, "numero", e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                        placeholder="Chambre 1, Studio A..."
                      />
                    </div>
                    <div className="w-[130px]">
                      <label className="block text-xs text-foreground/60 mb-1">Type</label>
                      <select
                        value={unite.type}
                        onChange={(e) => updateUnite(i, "type", e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                      >
                        <option value="chambre">Chambre</option>
                        <option value="mini-studio">Mini Studio</option>
                        <option value="studio">Studio</option>
                        <option value="appartement">Appartement</option>
                        <option value="magasin">Magasin</option>
                      </select>
                    </div>
                    <div className="w-[110px]">
                      <label className="block text-xs text-foreground/60 mb-1">Loyer (FCFA)</label>
                      <input
                        type="number"
                        required
                        value={unite.loyer || ""}
                        onChange={(e) => updateUnite(i, "loyer", Number(e.target.value))}
                        className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                        placeholder="25000"
                      />
                    </div>
                    <div className="flex-1 min-w-[120px]">
                      <label className="block text-xs text-foreground/60 mb-1">Locataire</label>
                      <input
                        type="text"
                        value={unite.locataire || ""}
                        onChange={(e) => updateUnite(i, "locataire", e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                        placeholder="Vide = vacant"
                      />
                    </div>
                    <div className="w-[120px]">
                      <label className="block text-xs text-foreground/60 mb-1">Téléphone</label>
                      <input
                        type="text"
                        value={unite.telephone || ""}
                        onChange={(e) => updateUnite(i, "telephone", e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                        placeholder="77..."
                      />
                    </div>
                    {form.unites.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeUnite(i)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 gradient-gold text-primary-dark font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
              >
                {saving ? "Enregistrement..." : editProp ? "Modifier" : "Enregistrer"}
              </button>
              <button type="button" onClick={resetForm} className="px-6 py-3 border border-border text-foreground/70 font-medium rounded-xl hover:bg-muted transition-all">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des propriétés */}
      {proprietes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border shadow-sm p-12 text-center">
          <p className="text-foreground/60 text-lg">Aucune propriété enregistrée.</p>
          <p className="text-foreground/40 mt-2">Ajoutez les maisons que vous gérez pour commencer les recouvrements.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {proprietes.map((prop) => {
            const occupees = prop.unites.filter((u) => u.statut === "occupe");
            const totalProp = occupees.reduce((sum, u) => sum + u.loyer, 0);

            return (
              <div key={prop.id} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border bg-muted/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{prop.nom}</h3>
                      <p className="text-sm text-foreground/60">
                        Propriétaire: <span className="font-medium">{prop.proprietaire}</span> • {prop.adresse}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gold">{formatPrix(totalProp)}</span>
                      <button
                        onClick={() => genererPDF(prop)}
                        className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-all"
                        title="Générer PDF"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        PDF
                      </button>
                      <button
                        onClick={() => handleEdit(prop)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Modifier"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(prop.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Supprimer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-muted/30">
                      <tr>
                        <th className="px-6 py-3 font-medium text-foreground/60">Unité</th>
                        <th className="px-6 py-3 font-medium text-foreground/60">Type</th>
                        <th className="px-6 py-3 font-medium text-foreground/60">Locataire</th>
                        <th className="px-6 py-3 font-medium text-foreground/60">Téléphone</th>
                        <th className="px-6 py-3 font-medium text-foreground/60">Loyer</th>
                        <th className="px-6 py-3 font-medium text-foreground/60">{moisLabels[moisSelectionne]}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prop.unites.map((unite, i) => {
                        const moisKey = `${annee}-${String(moisSelectionne + 1).padStart(2, "0")}`;
                        const estPaye = unite.paiements?.[moisKey] === true;

                        return (
                          <tr key={i} className="border-t border-border/30">
                            <td className="px-6 py-3 font-medium">{unite.numero}</td>
                            <td className="px-6 py-3 capitalize">{unite.type}</td>
                            <td className="px-6 py-3">{unite.locataire || <span className="text-foreground/40 italic">Vacant</span>}</td>
                            <td className="px-6 py-3">{unite.telephone || "-"}</td>
                            <td className="px-6 py-3 font-semibold">{formatPrix(unite.loyer)}</td>
                            <td className="px-6 py-3">
                              {unite.statut === "occupe" ? (
                                <button
                                  onClick={() => togglePaiement(prop.id, i, moisKey, !estPaye)}
                                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                                    estPaye
                                      ? "bg-green-50 text-green-700 hover:bg-green-100"
                                      : "bg-red-50 text-red-700 hover:bg-red-100"
                                  }`}
                                >
                                  {estPaye ? "Payé" : "Non payé"}
                                </button>
                              ) : (
                                <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
