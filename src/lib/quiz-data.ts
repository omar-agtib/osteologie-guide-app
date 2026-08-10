import { ZoneKey } from "../components/3d/SkeletonViewer";

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
};

export const QUIZ_QUESTIONS: Record<ZoneKey, QuizQuestion[]> = {
  sup: [
    {
      id: "q1",
      question: "Quel os relie le sternum à la scapula ?",
      options: ["Humérus", "Clavicule", "Radius", "Carpe"],
      correctIndex: 1,
    },
    {
      id: "q2",
      question:
        "Quel os s'articule avec la scapula en haut et le radius/l'ulna au coude ?",
      options: ["Clavicule", "Carpe", "Humérus", "Scapula"],
      correctIndex: 2,
    },
    {
      id: "q3",
      question:
        "Lequel de ces os pivote autour de l'autre lors de la pronation ?",
      options: [
        "Le radius autour de l'ulna",
        "L'ulna autour du radius",
        "Le carpe autour du radius",
        "Aucun des deux",
      ],
      correctIndex: 0,
    },
    {
      id: "q4",
      question: "Combien de petits os composent le carpe ?",
      options: ["5", "6", "7", "8"],
      correctIndex: 3,
    },
    {
      id: "q5",
      question: "La scapula est un os :",
      options: ["Long", "Plat", "Court", "Irrégulier"],
      correctIndex: 1,
    },
  ],
  ax: [
    {
      id: "q1",
      question: "Quelle est la fonction principale du crâne ?",
      options: [
        "Protéger le cœur",
        "Protéger le cerveau",
        "Soutenir les jambes",
        "Produire des cellules sanguines",
      ],
      correctIndex: 1,
    },
    {
      id: "q2",
      question: "Combien de vertèbres compose le rachis ?",
      options: ["24", "28", "33", "40"],
      correctIndex: 2,
    },
    {
      id: "q3",
      question: "Le thorax protège principalement :",
      options: [
        "Le cerveau",
        "Les reins",
        "Le cœur et les poumons",
        "L'estomac",
      ],
      correctIndex: 2,
    },
    {
      id: "q4",
      question: "Le rachis fait partie du squelette :",
      options: ["Appendiculaire", "Axial", "Périphérique", "Aucun des deux"],
      correctIndex: 1,
    },
  ],
  inf: [
    {
      id: "q1",
      question: "Le bassin relie le rachis à :",
      options: ["Les bras", "Les membres inférieurs", "Le thorax", "Le crâne"],
      correctIndex: 1,
    },
    {
      id: "q2",
      question: "Quel est l'os le plus long du corps humain ?",
      options: ["Tibia", "Humérus", "Fémur", "Fibula"],
      correctIndex: 2,
    },
    {
      id: "q3",
      question: "Le tibia et la fibula se trouvent :",
      options: [
        "Dans le bras",
        "Dans la cuisse",
        "Dans la jambe",
        "Dans le pied",
      ],
      correctIndex: 2,
    },
    {
      id: "q4",
      question: "Le fémur relie :",
      options: [
        "La hanche au genou",
        "L'épaule au coude",
        "Le genou à la cheville",
        "Le bassin au thorax",
      ],
      correctIndex: 0,
    },
  ],
};
