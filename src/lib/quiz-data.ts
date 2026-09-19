import { ZoneKey } from "../components/3d/SkeletonViewer";

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];

  // Une question peut avoir une ou plusieurs bonnes réponses.
  correctIndexes: number[];
};

export const QUIZ_QUESTIONS: Record<ZoneKey, QuizQuestion[]> = {
  // =========================================================
  // MEMBRE SUPÉRIEUR — Questions 1 à 10
  // =========================================================
  sup: [
    {
      id: "sup-q1",
      question: "La clavicule s'articule avec :",
      options: [
        "Le sternum seul.",
        "Le sternum en dedans et l’acromion en dehors.",
        "La scapula seule.",
        "L’humérus seul.",
        "La scapula et l'humérus.",
      ],
      correctIndexes: [1],
    },
    {
      id: "sup-q2",
      question:
        "Quelles affirmations sont correctes concernant l'orientation de la clavicule ?",
      options: [
        "La grande convexité est latérale et postérieure.",
        "La grande convexité est médiale et antérieure.",
        "La face inférieure est rugueuse et présente une gouttière.",
        "La face inférieure est lisse et sous-cutanée.",
        "L'extrémité volumineuse est médiale.",
      ],
      correctIndexes: [1, 2, 4],
    },
    {
      id: "sup-q3",
      question:
        "Quel muscle s'insère dans la gouttière de la face inférieure de la clavicule ?",
      options: [
        "Le muscle trapèze.",
        "Le muscle deltoïde.",
        "Le muscle subclavier.",
        "Le muscle grand pectoral.",
        "Le muscle petit pectoral.",
      ],
      correctIndexes: [2],
    },
    {
      id: "sup-q4",
      question:
        "Quelles affirmations concernant l'orientation de la scapula sont correctes ?",
      options: [
        "La face antérieure ou costale est convexe.",
        "La face antérieure ou costale est concave.",
        "La cavité glénoïdale est supérieure et latérale.",
        "L'épine de l'omoplate est antérieure.",
        "L’épine de l’omoplate est postérieure.",
      ],
      correctIndexes: [1, 2, 4],
    },
    {
      id: "sup-q5",
      question:
        "Le bord supérieur ou cervical de la scapula est caractérisé par :",
      options: [
        "La présence du processus coracoïde.",
        "La présence du processus coronoïde.",
        "La présence d'une incisure scapulaire où passent l'artère et le nerf infra-scapulaire.",
        "La présence d'une incisure scapulaire où passent l'artère et le nerf supra-scapulaire.",
        "L’insertion au muscle omo-hyoïdien.",
      ],
      correctIndexes: [0, 3, 4],
    },
    {
      id: "sup-q6",
      question: "Le processus coracoïde donne insertion aux muscles :",
      options: [
        "Muscle coraco-brachial.",
        "Muscle long chef du biceps brachial.",
        "Muscle court chef du biceps brachial.",
        "Muscle petit pectoral.",
        "Muscle grand pectoral.",
      ],
      correctIndexes: [0, 2, 3],
    },
    {
      id: "sup-q7",
      question: "La face postérieure de l'humérus est creusée par :",
      options: [
        "Le sillon du nerf ulnaire.",
        "Le sillon du nerf radial.",
        "Le sillon du nerf médian.",
        "Le sillon du nerf musculo-cutané.",
        "Le sillon de l’artère humérale.",
      ],
      correctIndexes: [1],
    },
    {
      id: "sup-q8",
      question: "La tubérosité radiale donne insertion au :",
      options: [
        "Tendon du muscle triceps brachial.",
        "Tendon du muscle brachial antérieur.",
        "Tendon du muscle biceps brachial.",
        "Tendon du muscle brachioradial.",
        "Tendon du muscle carré pronateur.",
      ],
      correctIndexes: [2],
    },
    {
      id: "sup-q9",
      question: "L’ulna s'articule avec :",
      options: [
        "La trochlée humérale en haut.",
        "Le capitulum huméral en haut.",
        "En haut et en dehors avec le radius via l'incisure ulnaire du radius.",
        "La tubérosité radiale.",
        "L'épicondyle latéral en haut.",
      ],
      correctIndexes: [0, 2],
    },
    {
      id: "sup-q10",
      question:
        "La face postérieure du corps sternal donne insertion au muscle :",
      options: [
        "Muscle sterno-cléïdo-hyoïdien.",
        "Muscle triangulaire du sternum.",
        "Muscle sterno-cléïdo-mastoïdien.",
        "Muscle sterno-thyroïdien.",
        "Ligament sterno-claviculaire.",
      ],
      correctIndexes: [1],
    },
  ],

  // =========================================================
  // SQUELETTE AXIAL — Questions 11 à 15
  // =========================================================
  ax: [
    {
      id: "ax-q11",
      question: "Quelles affirmations sont correctes concernant les côtes ?",
      options: [
        "Les 7 premières côtes sont appelées côtes flottantes.",
        "Les 7 premières côtes s'articulent avec le sternum, appelées côtes sternales.",
        "Les 3 dernières côtes s'articulent avec le sternum, appelées côtes sternales.",
        "Les côtes flottantes sont au nombre de trois.",
        "Les deux dernières côtes sont appelées côtes flottantes.",
      ],
      correctIndexes: [1, 4],
    },
    {
      id: "ax-q12",
      question:
        "Quel est le nombre de vertèbres qui composent la colonne cervicale ?",
      options: [
        "5 vertèbres.",
        "6 vertèbres.",
        "7 vertèbres.",
        "8 vertèbres.",
        "9 vertèbres.",
      ],
      correctIndexes: [2],
    },
    {
      id: "ax-q13",
      question:
        "Quelle est la spécificité de la deuxième vertèbre cervicale (Axis) ?",
      options: [
        "Elle est fusionnée avec l'Atlas.",
        "Elle possède une dent ou odontoïde qui s'articule avec l'Atlas.",
        "Elle est plus petite que les autres vertèbres cervicales.",
        "Elle a un processus transverse plus long que les autres vertèbres cervicales.",
        "Elle est caractérisée par l’absence du corps vertébral.",
      ],
      correctIndexes: [1],
    },
    {
      id: "ax-q14",
      question: "Les vertèbres du rachis thoracique :",
      options: [
        "S’articulent avec les arcs osseux et les côtes.",
        "Sont au nombre de huit.",
        "Sont au nombre de dix.",
        "Sont au nombre de douze.",
        "Sont dépourvues de processus transverses.",
      ],
      correctIndexes: [0, 3],
    },
    {
      id: "ax-q15",
      question: "Quelles affirmations sont correctes concernant le sacrum ?",
      options: [
        "Il est formé par la soudure des 5 vertèbres sacrées.",
        "La soudure des corps vertébraux donne les tubercules postérieurs sacrés.",
        "La soudure des corps vertébraux donne la bande médiane antérieure.",
        "La réunion des processus épineux correspond à la crête sacrée.",
        "La superposition des lames vertébrales forme les gouttières sacrées.",
      ],
      correctIndexes: [0, 2, 3, 4],
    },
  ],

  // =========================================================
  // MEMBRE INFÉRIEUR — Questions 16 à 25
  // =========================================================
  inf: [
    {
      id: "inf-q16",
      question: "L’os coxal s'articule :",
      options: [
        "En dehors avec la tête fémorale par l’acétabulum.",
        "En haut et en arrière avec le sacrum par la facette auriculaire.",
        "En haut avec la cinquième vertèbre lombaire.",
        "En bas avec le coccyx par l'articulation sacro-coccygienne.",
        "En dedans avec le pubis controlatéral pour former la symphyse pubienne.",
      ],
      correctIndexes: [0, 1, 4],
    },
    {
      id: "inf-q17",
      question:
        "Quelles affirmations concernant l'orientation de l'os coxal sont correctes ?",
      options: [
        "La grande incisure ischiatique est située en arrière.",
        "La grande incisure ischiatique est située en avant.",
        "Le foramen obturé se trouve en bas.",
        "La cavité glénoïdale est orientée en dehors.",
        "La cavité glénoïdale est orientée en dedans.",
      ],
      correctIndexes: [0, 2, 3],
    },
    {
      id: "inf-q18",
      question: "Le fémur :",
      options: [
        "Est un os long, pair et symétrique.",
        "C'est l'os le plus long du corps humain.",
        "Son extrémité sphérique est en haut et en dedans.",
        "Il s'articule en haut et en dedans avec l’acétabulum.",
        "Il s’articule en bas avec le tibia et la patella.",
      ],
      correctIndexes: [1, 2, 3, 4],
    },
    {
      id: "inf-q19",
      question: "Quelle structure s'insère sur le petit trochanter ?",
      options: [
        "Le muscle moyen fessier.",
        "Le muscle vaste latéral.",
        "Le muscle piriforme.",
        "Le muscle grand psoas (psoas-iliaque).",
        "Les muscles pelvi-trochantériens.",
      ],
      correctIndexes: [3],
    },
    {
      id: "inf-q20",
      question:
        "Quelles sont les propositions justes concernant l'épiphyse distale du fémur ?",
      options: [
        "Elle est volumineuse, régulière et plus étendue longitudinalement.",
        "Elle est volumineuse, irrégulière, et plus étendue transversalement.",
        "Elle est petite, arrondie, et symétrique.",
        "Elle est formée par deux condyles latéral et médial séparés par une fosse intercondylaire.",
        "Elle s’articule avec le tibia seul.",
      ],
      correctIndexes: [1, 3],
    },
    {
      id: "inf-q21",
      question: "La patella :",
      options: [
        "Est un os sésamoïde, triangulaire.",
        "S’articule avec la trochlée fémorale.",
        "Possède une face postérieure articulaire.",
        "Son apex donne insertion au ligament patellaire.",
        "Sa base donne insertion au tendon du quadriceps fémoral.",
      ],
      correctIndexes: [0, 1, 2, 3, 4],
    },
    {
      id: "inf-q22",
      question: "Le tibia :",
      options: [
        "Est un os long, pair et asymétrique.",
        "Est l’os antérieur et latéral de la jambe.",
        "S'articule en haut avec les condyles du fémur.",
        "S’articule en bas avec le calcanéum.",
        "La face latérale de son épiphyse distale s’articule avec la fibula.",
      ],
      correctIndexes: [0, 2, 4],
    },
    {
      id: "inf-q23",
      question: "La fibula :",
      options: [
        "Est un os long, pair et asymétrique.",
        "Forme avec le tibia le squelette de la jambe.",
        "Est l’os antérieur et médial de la jambe.",
        "S'articule en haut et en dedans avec le tibia.",
        "Sa diaphyse présente trois faces et trois bords.",
      ],
      correctIndexes: [0, 1, 3, 4],
    },
    {
      id: "inf-q24",
      question: "Le squelette du pied est formé de :",
      options: [
        "24 os constants répartis en trois groupes.",
        "25 os constants répartis en trois groupes.",
        "26 os constants répartis en trois groupes.",
        "27 os constants répartis en trois groupes.",
        "28 os constants répartis en trois groupes.",
      ],
      correctIndexes: [2],
    },
    {
      id: "inf-q25",
      question: "Les métatarses :",
      options: [
        "Sont des os du squelette du pied.",
        "Sont au nombre de 5, numérotés de I à V.",
        "Sont des os longs.",
        "L’extrémité postérieure est dite base du métatarsien.",
        "L’extrémité antérieure est dite tête du métatarsien.",
      ],
      correctIndexes: [0, 1, 2, 3, 4],
    },
  ],
};
