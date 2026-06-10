import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { Bien, TypeBien } from "@/data/biens";

// ========================
// BIENS
// ========================

export async function getBiens(): Promise<Bien[]> {
  const q = query(collection(db, "biens"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Bien));
}

export async function getBienById(id: string): Promise<Bien | null> {
  const docRef = doc(db, "biens", id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Bien;
}

export async function getBiensByType(type: TypeBien): Promise<Bien[]> {
  const q = query(collection(db, "biens"), where("type", "==", type), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Bien));
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
  const q = query(collection(db, "locataires"), orderBy("nom"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Locataire));
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
  const q = query(collection(db, "assurances"), orderBy("dateFin", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ContratAssurance));
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
