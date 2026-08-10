import { ZoneKey } from "../components/3d/SkeletonViewer";
import { AccentKey } from "../constants/theme";

export type Bone = {
  id: string;
  name: string;
  description: string;
  // Position of the bone's leader-line anchor point on the 3D stage, as a
  // percentage of stage width/height — e.g. {x: 50, y: 20} is top-center.
  anchor: { x: number; y: number };
  // Position of the floating label chip itself, same percentage system.
  chip: { x: number; y: number };
};

export type ZoneDetail = {
  zoneKey: ZoneKey;
  accentKey: AccentKey;
  title: string; // header title, e.g. "Ceinture & bras"
  eyebrow: string; // e.g. "MEMBRE SUPÉRIEUR"
  bones: Bone[];
};

export const ZONE_DETAILS: Record<ZoneKey, ZoneDetail> = {
  sup: {
    zoneKey: "sup",
    accentKey: "red",
    title: "Ceinture & bras",
    eyebrow: "MEMBRE SUPÉRIEUR",
    bones: [
      {
        id: "clavicule",
        name: "Clavicule",
        description:
          "Os long en S, relie le sternum à la scapula ; seul os long horizontal du corps.",
        anchor: { x: 38, y: 22 },
        chip: { x: 14, y: 10 },
      },
      {
        id: "scapula",
        name: "Scapula",
        description:
          "Os plat triangulaire de l'épaule, s'articule avec la clavicule et l'humérus.",
        anchor: { x: 62, y: 28 },
        chip: { x: 78, y: 16 },
      },
      {
        id: "humerus",
        name: "Humérus",
        description:
          "Os long du bras, s'articule avec la scapula en haut et avec le radius et l'ulna au coude.",
        anchor: { x: 58, y: 48 },
        chip: { x: 82, y: 44 },
      },
      {
        id: "radius-ulna",
        name: "Radius / Ulna",
        description:
          "Les deux os de l'avant-bras ; le radius pivote autour de l'ulna lors de la pronation.",
        anchor: { x: 55, y: 68 },
        chip: { x: 80, y: 70 },
      },
      {
        id: "carpe",
        name: "Carpe",
        description:
          "Huit petits os courts formant le poignet, entre l'avant-bras et la main.",
        anchor: { x: 52, y: 84 },
        chip: { x: 22, y: 88 },
      },
    ],
  },
  ax: {
    zoneKey: "ax",
    accentKey: "dark",
    title: "Tête & tronc",
    eyebrow: "AXIAL",
    bones: [
      {
        id: "crane",
        name: "Crâne",
        description: "Ensemble d'os plats soudés protégeant le cerveau.",
        anchor: { x: 50, y: 12 },
        chip: { x: 78, y: 8 },
      },
      {
        id: "rachis",
        name: "Rachis",
        description:
          "Colonne vertébrale : 33 vertèbres empilées, soutient le tronc et protège la moelle épinière.",
        anchor: { x: 50, y: 45 },
        chip: { x: 20, y: 42 },
      },
      {
        id: "thorax",
        name: "Thorax",
        description:
          "Cage formée par les côtes et le sternum, protège le cœur et les poumons.",
        anchor: { x: 50, y: 62 },
        chip: { x: 78, y: 65 },
      },
    ],
  },
  inf: {
    zoneKey: "inf",
    accentKey: "green",
    title: "Bassin & jambes",
    eyebrow: "MEMBRE INFÉRIEUR",
    bones: [
      {
        id: "bassin",
        name: "Bassin",
        description:
          "Ceinture osseuse reliant le rachis aux membres inférieurs.",
        anchor: { x: 50, y: 15 },
        chip: { x: 78, y: 10 },
      },
      {
        id: "femur",
        name: "Fémur",
        description: "Os le plus long du corps, de la hanche au genou.",
        anchor: { x: 46, y: 45 },
        chip: { x: 18, y: 42 },
      },
      {
        id: "tibia-fibula",
        name: "Tibia / Fibula",
        description: "Les deux os de la jambe, entre le genou et la cheville.",
        anchor: { x: 46, y: 75 },
        chip: { x: 78, y: 78 },
      },
    ],
  },
};
