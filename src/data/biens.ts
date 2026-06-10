export type TypeBien = "appartement" | "chambre" | "studio" | "magasin" | "terrain";

export interface Bien {
  id: string;
  titre: string;
  type: TypeBien;
  prix: number;
  prixParMois: boolean;
  surface: number;
  pieces?: number;
  quartier: string;
  ville: string;
  description: string;
  images: string[];
  disponible: boolean;
  createdAt: string;
}

export const biensDemoData: Bien[] = [
  {
    id: "1",
    titre: "Bel Appartement F3 Moderne",
    type: "appartement",
    prix: 150000,
    prixParMois: true,
    surface: 80,
    pieces: 3,
    quartier: "Keur Issa",
    ville: "Thiès",
    description:
      "Appartement F3 lumineux avec salon, 2 chambres, cuisine équipée, salle de bain moderne. Proche de toutes commodités.",
    images: ["/images/apt1.jpg"],
    disponible: true,
    createdAt: "2026-06-01",
  },
  {
    id: "2",
    titre: "Chambre Meublée Standing",
    type: "chambre",
    prix: 45000,
    prixParMois: true,
    surface: 20,
    pieces: 1,
    quartier: "Mbour 3",
    ville: "Thiès",
    description:
      "Chambre meublée avec lit, armoire, ventilateur. Douche interne. Idéale pour étudiant ou travailleur.",
    images: ["/images/chambre1.jpg"],
    disponible: true,
    createdAt: "2026-06-03",
  },
  {
    id: "3",
    titre: "Studio Moderne Climatisé",
    type: "studio",
    prix: 85000,
    prixParMois: true,
    surface: 35,
    pieces: 1,
    quartier: "Cité Lamy",
    ville: "Thiès",
    description:
      "Studio climatisé tout confort. Cuisine américaine, douche moderne. Parfait pour jeune professionnel.",
    images: ["/images/studio1.jpg"],
    disponible: true,
    createdAt: "2026-06-05",
  },
  {
    id: "4",
    titre: "Magasin Commercial Centre-Ville",
    type: "magasin",
    prix: 200000,
    prixParMois: true,
    surface: 50,
    quartier: "Centre-Ville",
    ville: "Thiès",
    description:
      "Magasin bien situé au centre-ville. Grande vitrine, arrière-boutique. Idéal pour commerce ou boutique.",
    images: ["/images/magasin1.jpg"],
    disponible: true,
    createdAt: "2026-06-02",
  },
  {
    id: "5",
    titre: "Terrain 300m² Viabilisé",
    type: "terrain",
    prix: 8000000,
    prixParMois: false,
    surface: 300,
    quartier: "Keur Issa",
    ville: "Thiès",
    description:
      "Terrain viabilisé de 300m² avec titre foncier. Route bitumée, eau et électricité disponibles.",
    images: ["/images/terrain1.jpg"],
    disponible: true,
    createdAt: "2026-06-04",
  },
  {
    id: "6",
    titre: "Appartement F4 avec Terrasse",
    type: "appartement",
    prix: 250000,
    prixParMois: true,
    surface: 120,
    pieces: 4,
    quartier: "Diakhao",
    ville: "Thiès",
    description:
      "Grand appartement F4 avec terrasse panoramique. 3 chambres, salon spacieux, cuisine, 2 salles de bain.",
    images: ["/images/apt2.jpg"],
    disponible: true,
    createdAt: "2026-06-06",
  },
];
