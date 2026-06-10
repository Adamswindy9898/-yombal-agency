export type TypeVehicule = "auto" | "cyclomoteur" | "taxi";
export type DureeAssurance = 1 | 2 | 3 | 6 | 12;

export interface Assurance {
  type: TypeVehicule;
  label: string;
  description: string;
  icon: string;
}

export const typesVehicules: Assurance[] = [
  {
    type: "auto",
    label: "Assurance Auto",
    description: "Pour voitures personnelles et familiales",
    icon: "🚗",
  },
  {
    type: "cyclomoteur",
    label: "Assurance Cyclomoteur",
    description: "Pour motos, scooters et Jakarta",
    icon: "🏍️",
  },
  {
    type: "taxi",
    label: "Assurance Taxi",
    description: "Pour taxis et véhicules de transport",
    icon: "🚕",
  },
];

export const durees: { value: DureeAssurance; label: string }[] = [
  { value: 1, label: "1 mois" },
  { value: 2, label: "2 mois" },
  { value: 3, label: "3 mois" },
  { value: 6, label: "6 mois" },
  { value: 12, label: "12 mois" },
];
