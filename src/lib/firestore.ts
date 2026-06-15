import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "./firebase";
import { Bien, TypeBien } from "@/data/biens";

// ========================
// BIENS
// ========================

export async function getBiens(): Promise<Bien[]> {
  const snapshot = await getDocs(collection(db, "biens"));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Bien));
}

export async function getBienById(id: string): Promise<Bien | null> {
  const docRef = doc(db, "biens", id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Bien;
}

export async function getBiensByType(type: TypeBien): Promise<Bien[]> {
  const q = query(collection(db, "biens"), where("type", "==", type));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Bien));
}

export async function addBien(bien: Omit<Bien, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "biens"), bien);
  return docRef.id;
}

export async function updateBien(id: string, data: Partial<Bien>): Promise<void> {
  const docRef = doc(db, "biens", id);
  await updateDoc(docRef, data);
}

export async function deleteBien(id: string): Promise<void> {
  const docRef = doc(db, "biens", id);
  await deleteDoc(docRef);
}

// ========================
// LOCATAIRES
// ========================

export interface Locataire {
  id: string;
  nom: string;
  telephone: string;
  bien: string;
  loyer: number;
  dateEntree: string;
  statut: "a_jour" | "en_retard" | "impaye";
  dernierPaiement: string;
}

export async function getLocataires(): Promise<Locataire[]> {
  const snapshot = await getDocs(collection(db, "locataires"));
  const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Locataire));
  return data.sort((a, b) => a.nom.localeCompare(b.nom));
}

export async function addLocataire(locataire: Omit<Locataire, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "locataires"), locataire);
  return docRef.id;
}

export async function updateLocataire(id: string, data: Partial<Locataire>): Promise<void> {
  const docRef = doc(db, "locataires", id);
  await updateDoc(docRef, data);
}

export async function deleteLocataire(id: string): Promise<void> {
  const docRef = doc(db, "locataires", id);
  await deleteDoc(docRef);
}

// ========================
// ANNONCES
// ========================

export interface Annonce {
  id: string;
  titre: string;
  message: string;
  type: "info" | "promo" | "urgent" | "nouveau";
  mediaUrl?: string;
  mediaType?: "image" | "video";
  lien?: string;
  lienTexte?: string;
  actif: boolean;
  createdAt: string;
}

export async function getAnnonces(): Promise<Annonce[]> {
  const snapshot = await getDocs(collection(db, "annonces"));
  const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Annonce));
  return data.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getAnnoncesActives(): Promise<Annonce[]> {
  const q = query(collection(db, "annonces"), where("actif", "==", true));
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Annonce));
  return data.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addAnnonce(annonce: Omit<Annonce, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "annonces"), annonce);
  return docRef.id;
}

export async function updateAnnonce(id: string, data: Partial<Annonce>): Promise<void> {
  const docRef = doc(db, "annonces", id);
  await updateDoc(docRef, data);
}

export async function deleteAnnonce(id: string): Promise<void> {
  const docRef = doc(db, "annonces", id);
  await deleteDoc(docRef);
}

// ========================
// PROPRIETES (maisons gérées pour des propriétaires)
// ========================

export interface Unite {
  numero: string;
  type: "chambre" | "studio" | "mini-studio" | "appartement" | "magasin";
  loyer: number;
  locataire?: string;
  telephone?: string;
  statut: "occupe" | "vacant";
  paiements?: Record<string, boolean>; // "2026-06": true = payé
}

export interface Propriete {
  id: string;
  nom: string; // "Maison Keur Issa", "Immeuble Mbour 3"
  adresse: string;
  proprietaire: string; // nom du propriétaire
  telephoneProprietaire: string;
  unites: Unite[];
  createdAt: string;
}

export async function getProprietes(): Promise<Propriete[]> {
  const snapshot = await getDocs(collection(db, "proprietes"));
  const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Propriete));
  return data.sort((a, b) => a.nom.localeCompare(b.nom));
}

export async function addPropriete(propriete: Omit<Propriete, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "proprietes"), propriete);
  return docRef.id;
}

export async function updatePropriete(id: string, data: Partial<Propriete>): Promise<void> {
  const docRef = doc(db, "proprietes", id);
  await updateDoc(docRef, data);
}

export async function deletePropriete(id: string): Promise<void> {
  const docRef = doc(db, "proprietes", id);
  await deleteDoc(docRef);
}

// ========================
// ASSURANCES
// ========================

export interface ContratAssurance {
  id: string;
  client: string;
  telephone: string;
  typeVehicule: "auto" | "cyclomoteur" | "taxi";
  immatriculation: string;
  compagnie: string;
  duree: number;
  prixAchat: number;
  prixVente: number;
  dateDebut: string;
  dateFin: string;
  statut: "actif" | "expire" | "bientot";
}

export async function getContrats(): Promise<ContratAssurance[]> {
  const snapshot = await getDocs(collection(db, "assurances"));
  const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as ContratAssurance));
  return data.sort((a, b) => b.dateFin.localeCompare(a.dateFin));
}

export async function addContrat(contrat: Omit<ContratAssurance, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "assurances"), contrat);
  return docRef.id;
}

export async function updateContrat(id: string, data: Partial<ContratAssurance>): Promise<void> {
  const docRef = doc(db, "assurances", id);
  await updateDoc(docRef, data);
}

export async function deleteContrat(id: string): Promise<void> {
  const docRef = doc(db, "assurances", id);
  await deleteDoc(docRef);
}
