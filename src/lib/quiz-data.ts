import type { ZoneKey } from "../components/3d/SkeletonViewer";

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndexes: number[];
  /** Explication associée à chaque proposition (même indice que options). */
  explanations?: string[];
};

// QCM fondés sur les supports FMPT 2026.
// correctIndexes utilise les indices 0-based des options.
// Plusieurs bonnes réponses sont possibles.
export const QUIZ_QUESTIONS: Record<ZoneKey, QuizQuestion[]> = {
  sup: [
    {
      "id": "sup-clavicule-01",
      "question": "La clavicule est :",
      "options": [
        "Un os du squelette axial.",
        "Un os plat et triangulaire.",
        "L'élément postérieur des os du squelette de la ceinture scapulaire.",
        "Un os long, pair, en forme de « S » étiré.",
        "L'élément antérieur des os du squelette de la ceinture scapulaire."
      ],
      "correctIndexes": [
        3,
        4
      ],
      "explanations": [
        "C'est un os de la ceinture scapulaire, qui fait partie du squelette périphérique (appendiculaire).",
        "C'est un os long, pair, en forme de « S » étiré ; l'os plat et triangulaire de la ceinture scapulaire est la scapula.",
        "C'est l'élément antérieur de la ceinture scapulaire ; l'élément postérieur est la scapula.",
        "Cette proposition est correcte.",
        "Cette proposition est correcte."
      ]
    },
    {
      "id": "sup-clavicule-02",
      "question": "La clavicule s'articule :",
      "options": [
        "En dehors avec l'humérus.",
        "En dedans avec la première côte.",
        "En dehors avec la scapula.",
        "En dehors avec le sternum.",
        "En dedans avec le sternum."
      ],
      "correctIndexes": [
        2,
        4
      ],
      "explanations": [
        "Elle s'articule en dehors avec la scapula (acromion), pas avec l'humérus.",
        "Elle s'articule en dedans avec le sternum ; elle est seulement reliée à la côte par le ligament costo-claviculaire.",
        "Cette proposition est correcte.",
        "Le sternum est en dedans ; en dehors, elle s'articule avec la scapula.",
        "Cette proposition est correcte."
      ]
    },
    {
      "id": "sup-clavicule-03",
      "question": "Quelles affirmations sont correctes concernant l'orientation de la clavicule ?",
      "options": [
        "La face supérieure est rugueuse.",
        "La face inférieure est rugueuse.",
        "L'extrémité volumineuse est médiale.",
        "L'extrémité volumineuse est latérale.",
        "La grande convexité est médiale et antérieure."
      ],
      "correctIndexes": [
        1,
        2,
        4
      ],
      "explanations": [
        "C'est la face inférieure qui est rugueuse ; la face supérieure est lisse.",
        "Cette proposition est correcte.",
        "Cette proposition est correcte.",
        "L'extrémité volumineuse (sternale) est médiale.",
        "Cette proposition est correcte."
      ]
    },
    {
      "id": "sup-clavicule-04",
      "question": "Le corps de la clavicule comprend :",
      "options": [
        "Trois faces et trois bords.",
        "Deux faces et trois bords.",
        "Deux faces et deux bords.",
        "Un bord antérieur et un bord postérieur.",
        "Une face supérieure et une face inférieure."
      ],
      "correctIndexes": [
        2,
        3,
        4
      ],
      "explanations": [
        "Le corps comprend 2 faces et 2 bords.",
        "Le corps comprend 2 faces et 2 bords (antérieur et postérieur).",
        "Cette proposition est correcte.",
        "Cette proposition est correcte.",
        "Cette proposition est correcte."
      ]
    },
    {
      "id": "sup-clavicule-05",
      "question": "La face supérieure de la clavicule est :",
      "options": [
        "Rugueuse.",
        "Sous-cutanée.",
        "Centrée par un sillon.",
        "Palpable et saillante chez les sujets amaigris.",
        "Lisse."
      ],
      "correctIndexes": [
        1,
        3,
        4
      ],
      "explanations": [
        "Elle est lisse ; c'est la face inférieure qui est rugueuse.",
        "Cette proposition est correcte.",
        "C'est la face inférieure qui est centrée par un sillon (muscle subclavier).",
        "Cette proposition est correcte.",
        "Cette proposition est correcte."
      ]
    },
    {
      "id": "sup-clavicule-06",
      "question": "La face inférieure de la clavicule :",
      "options": [
        "Est centrée par un sillon où s'insère le muscle grand pectoral.",
        "Présente de chaque côté du sillon une zone d'insertion ligamentaire.",
        "Est lisse et sous-cutanée.",
        "Est rugueuse.",
        "Est centrée par un sillon où s'insère le muscle subclavier."
      ],
      "correctIndexes": [
        1,
        3,
        4
      ],
      "explanations": [
        "Le sillon donne insertion au muscle subclavier ; le grand pectoral s'insère sur la partie médiale du bord antérieur.",
        "Cette proposition est correcte.",
        "Ce sont les caractères de la face supérieure ; la face inférieure est rugueuse.",
        "Cette proposition est correcte.",
        "Cette proposition est correcte."
      ]
    },
    {
      "id": "sup-clavicule-07",
      "question": "Concernant les empreintes ligamentaires de la face inférieure de la clavicule :",
      "options": [
        "La ligne trapézoïde, en arrière, donne insertion au ligament trapézoïde.",
        "Le tubercule conoïde, en arrière, donne insertion au ligament conoïde.",
        "L'empreinte du ligament costo-claviculaire est située en dehors du sillon.",
        "L'empreinte des ligaments coraco-claviculaires est située en dehors du sillon.",
        "L'empreinte du ligament costo-claviculaire est située en dedans du sillon."
      ],
      "correctIndexes": [
        1,
        3,
        4
      ],
      "explanations": [
        "La ligne trapézoïde est en avant ; c'est le tubercule conoïde qui est en arrière.",
        "Cette proposition est correcte.",
        "Elle est en dedans du sillon ; en dehors se trouve l'empreinte des ligaments coraco-claviculaires.",
        "Cette proposition est correcte.",
        "Cette proposition est correcte."
      ]
    },
    {
      "id": "sup-clavicule-08",
      "question": "Le bord antérieur de la clavicule :",
      "options": [
        "Est concave dans sa partie médiale.",
        "Donne insertion au muscle trapèze dans sa partie latérale.",
        "Est convexe dans sa partie médiale.",
        "Est concave dans sa partie latérale où s'insère le muscle deltoïde.",
        "Donne insertion au muscle grand pectoral dans sa partie médiale."
      ],
      "correctIndexes": [
        2,
        3,
        4
      ],
      "explanations": [
        "Il est convexe dans sa partie médiale (grand pectoral) et concave dans sa partie latérale (deltoïde).",
        "Sa partie latérale donne insertion au deltoïde ; le trapèze s'insère sur la partie latérale du bord postérieur.",
        "Cette proposition est correcte.",
        "Cette proposition est correcte.",
        "Cette proposition est correcte."
      ]
    },
    {
      "id": "sup-clavicule-09",
      "question": "Le bord postérieur de la clavicule :",
      "options": [
        "Donne insertion au muscle sterno-cléïdo-mastoïdien dans sa partie médiale.",
        "Est concave dans sa partie médiale.",
        "Donne insertion au muscle trapèze dans sa partie latérale.",
        "Est convexe dans sa partie latérale.",
        "Donne insertion au muscle deltoïde dans sa partie latérale."
      ],
      "correctIndexes": [
        0,
        1,
        2,
        3
      ],
      "explanations": [
        "Cette proposition est correcte.",
        "Cette proposition est correcte.",
        "Cette proposition est correcte.",
        "Cette proposition est correcte.",
        "Sa partie latérale donne insertion au trapèze ; le deltoïde s'insère sur la partie latérale du bord antérieur."
      ]
    },
    {
      "id": "sup-clavicule-10",
      "question": "L'épiphyse médiale de la clavicule :",
      "options": [
        "Comprend une surface articulaire avec le sternum.",
        "Porte une facette articulaire avec l'acromion.",
        "Est mince et aplatie dans le sens vertical.",
        "Est volumineuse et arrondie.",
        "Est aussi appelée épiphyse sternale."
      ],
      "correctIndexes": [
        0,
        3,
        4
      ],
      "explanations": [
        "Cette proposition est correcte.",
        "C'est l'épiphyse latérale qui s'articule avec l'acromion ; l'épiphyse médiale s'articule avec le sternum.",
        "Ce sont les caractères de l'épiphyse latérale ; l'épiphyse médiale est volumineuse et arrondie.",
        "Cette proposition est correcte.",
        "Cette proposition est correcte."
      ]
    },
    {
      "id": "sup-clavicule-11",
      "question": "L'épiphyse latérale de la clavicule :",
      "options": [
        "Est mince.",
        "Est volumineuse et arrondie.",
        "Est aplatie dans le sens vertical.",
        "Est aussi appelée épiphyse acromiale.",
        "Porte une facette articulaire avec l'acromion."
      ],
      "correctIndexes": [
        0,
        2,
        3,
        4
      ],
      "explanations": [
        "Cette proposition est correcte.",
        "C'est l'épiphyse médiale qui est volumineuse et arrondie ; la latérale est mince et aplatie verticalement.",
        "Cette proposition est correcte.",
        "Cette proposition est correcte.",
        "Cette proposition est correcte."
      ]
    },
    {
      "id": "sup-clavicule-12",
      "question": "Concernant les repères palpables de la clavicule :",
      "options": [
        "C'est un os sous-cutané.",
        "Elle n'est pas palpable.",
        "Sa face supérieure est palpable.",
        "Elle est entièrement palpable sauf sur sa face inférieure.",
        "Sa face inférieure est palpable."
      ],
      "correctIndexes": [
        0,
        2,
        3
      ],
      "explanations": [
        "Cette proposition est correcte.",
        "C'est un os sous-cutané, entièrement palpable sauf sur sa face inférieure.",
        "Cette proposition est correcte.",
        "Cette proposition est correcte.",
        "La face inférieure est la seule partie non palpable."
      ]
    },
    {
      "id": "sup-clavicule-13",
      "question": "Quelles sont les applications cliniques de la clavicule ?",
      "options": [
        "La fracture de la clavicule, fréquente lors des accidents de la voie publique.",
        "La luxation acromio-claviculaire.",
        "La luxation scapulo-humérale.",
        "La fracture de la clavicule est exceptionnelle.",
        "La luxation sterno-claviculaire."
      ],
      "correctIndexes": [
        0,
        1,
        4
      ],
      "explanations": [
        "Cette proposition est correcte.",
        "Cette proposition est correcte.",
        "Elle ne concerne pas la clavicule ; les luxations de la clavicule sont acromio-claviculaire et sterno-claviculaire.",
        "Elle est fréquente, notamment lors des accidents de la voie publique.",
        "Cette proposition est correcte."
      ]
    },
    {
      "id": "sup-scapula-14",
      "question": "La scapula est :",
      "options": [
        "Un os de la ceinture scapulaire.",
        "Un os présentant deux faces, trois bords et trois angles.",
        "Un os plat et triangulaire.",
        "Un os long présentant trois faces.",
        "Situé dans la région postéro-supérieure du thorax."
      ],
      "correctIndexes": [
        0,
        1,
        2,
        4
      ],
      "explanations": [
        "Cette proposition est correcte.",
        "Cette proposition est correcte.",
        "Cette proposition est correcte.",
        "C'est un os plat et triangulaire, avec deux faces, trois bords et trois angles.",
        "Cette proposition est correcte."
      ]
    },
    {
      "id": "sup-scapula-15",
      "question": "Quelles affirmations concernant la situation de la scapula sont correctes ?",
      "options": [
        "Elle s'articule en dehors avec l'humérus.",
        "Elle s'articule en haut et en dehors avec la clavicule.",
        "Elle se projette en regard de la 1re à la 5e côte.",
        "Elle est amarrée par des muscles à la paroi thoracique postérieure.",
        "Elle se projette en regard de la 2e à la 7e côte."
      ],
      "correctIndexes": [
        0,
        1,
        3,
        4
      ],
      "explanations": [
        "Cette proposition est correcte.",
        "Cette proposition est correcte.",
        "Elle se projette en regard de la 2e à la 7e côte.",
        "Cette proposition est correcte.",
        "Cette proposition est correcte."
      ]
    },
    {
      "id": "sup-scapula-16",
      "question": "Quelles affirmations concernant l'orientation de la scapula sont correctes ?",
      "options": [
        "La face antérieure ou costale est concave.",
        "La cavité glénoïdale est supérieure et latérale.",
        "La face antérieure ou costale est convexe.",
        "La cavité glénoïdale est inférieure et latérale.",
        "La cavité glénoïdale est supérieure et médiale."
      ],
      "correctIndexes": [
        0,
        1
      ],
      "explanations": [
        "Cette proposition est correcte.",
        "Cette proposition est correcte.",
        "Elle est concave (fosse subscapulaire).",
        "Elle est supérieure et latérale.",
        "Elle est supérieure et latérale."
      ]
    },
    {
      "id": "sup-scapula-17",
      "question": "La face costale (antérieure) de la scapula :",
      "options": [
        "Est divisée en deux fosses par l'épine de la scapula.",
        "Constitue la fosse subscapulaire.",
        "Donne insertion au muscle infra-épineux.",
        "Est excavée.",
        "Donne insertion au muscle subscapulaire sur sa plus grande surface."
      ],
      "correctIndexes": [
        1,
        3,
        4
      ],
      "explanations": [
        "C'est la face postérieure qui est divisée par l'épine ; la face costale forme une seule fosse, subscapulaire.",
        "Cette proposition est correcte.",
        "Elle donne insertion au muscle subscapulaire ; l'infra-épineux s'insère sur la face postérieure (fosse infra-épineuse).",
        "Cette proposition est correcte.",
        "Cette proposition est correcte."
      ]
    },
    {
      "id": "sup-scapula-18",
      "question": "La face postérieure (dorsale) de la scapula :",
      "options": [
        "Présente la fosse subscapulaire.",
        "Présente la fosse infra-épineuse.",
        "Est divisée en deux fosses par l'épine de la scapula.",
        "Sa fosse supra-épineuse donne insertion au muscle subscapulaire.",
        "Sa fosse supra-épineuse donne insertion au muscle supra-épineux."
      ],
      "correctIndexes": [
        1,
        2,
        4
      ],
      "explanations": [
        "La fosse subscapulaire correspond à la face costale (antérieure).",
        "Cette proposition est correcte.",
        "Cette proposition est correcte.",
        "Elle donne insertion au muscle supra-épineux ; le subscapulaire s'insère sur la face costale.",
        "Cette proposition est correcte."
      ]
    },
    {
      "id": "sup-scapula-19",
      "question": "L'épine de la scapula :",
      "options": [
        "Est implantée perpendiculairement à la face postérieure.",
        "Est implantée sur la face costale.",
        "Est implantée au niveau du quart supérieur de la face postérieure.",
        "Est aplatie et triangulaire.",
        "Est implantée au niveau du quart inférieur de la face postérieure."
      ],
      "correctIndexes": [
        0,
        2,
        3
      ],
      "explanations": [
        "Cette proposition est correcte.",
        "Elle est implantée sur la face postérieure.",
        "Cette proposition est correcte.",
        "Cette proposition est correcte.",
        "Elle est implantée au niveau du quart supérieur de la face postérieure."
      ]
    },
    {
      "id": "sup-scapula-20",
      "question": "Concernant les lèvres de l'épine de la scapula :",
      "options": [
        "L'épine présente deux lèvres.",
        "La lèvre supérieure donne insertion au muscle deltoïde.",
        "La lèvre supérieure donne insertion au muscle trapèze.",
        "La lèvre inférieure donne insertion au muscle deltoïde.",
        "La lèvre inférieure donne insertion au muscle trapèze."
      ],
      "correctIndexes": [
        0,
        2,
        3
      ],
      "explanations": [
        "Cette proposition est correcte.",
        "La lèvre supérieure donne insertion au trapèze ; le deltoïde s'insère sur la lèvre inférieure.",
        "Cette proposition est correcte.",
        "Cette proposition est correcte.",
        "La lèvre inférieure donne insertion au deltoïde ; le trapèze s'insère sur la lèvre supérieure."
      ]
    },
    {
      "id": "sup-scapula-21",
      "question": "L'acromion :",
      "options": [
        "Termine latéralement l'épine de la scapula.",
        "Est un volumineux processus.",
        "Est projeté en avant.",
        "Est situé au-dessus de la cavité glénoïdale.",
        "Est situé au-dessous de la cavité glénoïdale."
      ],
      "correctIndexes": [
        0,
        1,
        2,
        3
      ],
      "explanations": [
        "Cette proposition est correcte.",
        "Cette proposition est correcte.",
        "Cette proposition est correcte.",
        "Cette proposition est correcte.",
        "Il est projeté en avant, au-dessus de la cavité glénoïdale."
      ]
    },
    {
      "id": "sup-scapula-22",
      "question": "La fosse infra-épineuse :",
      "options": [
        "Son aire latérale donne insertion aux muscles petit et grand ronds.",
        "Son aire médiale donne insertion au muscle infra-épineux.",
        "Présente une crête le long du bord spinal.",
        "Son aire médiale donne insertion aux muscles petit et grand ronds.",
        "Présente une crête le long du bord axillaire."
      ],
      "correctIndexes": [
        0,
        1,
        4
      ],
      "explanations": [
        "Cette proposition est correcte.",
        "Cette proposition est correcte.",
        "La crête longe le bord axillaire (latéral).",
        "Les ronds s'insèrent sur l'aire latérale ; l'aire médiale reçoit le muscle infra-épineux.",
        "Cette proposition est correcte."
      ]
    },
    {
      "id": "sup-scapula-23",
      "question": "Le bord supérieur ou cervical de la scapula :",
      "options": [
        "Donne insertion au muscle omo-hyoïdien.",
        "Est épais.",
        "Est séparé du processus coracoïde par l'incisure scapulaire.",
        "Est aussi appelé bord spinal.",
        "Est mince."
      ],
      "correctIndexes": [
        0,
        2,
        4
      ],
      "explanations": [
        "Cette proposition est correcte.",
        "Il est mince.",
        "Cette proposition est correcte.",
        "Le bord spinal est le bord médial ; le bord supérieur est dit cervical.",
        "Cette proposition est correcte."
      ]
    },
    {
      "id": "sup-scapula-24",
      "question": "Concernant l'incisure scapulaire :",
      "options": [
        "Elle sépare le bord supérieur du processus coracoïde.",
        "L'artère supra-scapulaire y passe au-dessus du ligament transverse de la scapula.",
        "Le nerf supra-scapulaire y passe au-dessous du ligament transverse de la scapula.",
        "Le nerf supra-scapulaire y passe au-dessus du ligament transverse de la scapula.",
        "Elle livre passage au nerf infra-scapulaire."
      ],
      "correctIndexes": [
        0,
        1,
        2
      ],
      "explanations": [
        "Cette proposition est correcte.",
        "Cette proposition est correcte.",
        "Cette proposition est correcte.",
        "Le nerf passe au-dessous du ligament transverse ; c'est l'artère qui passe au-dessus.",
        "Elle livre passage au nerf supra-scapulaire."
      ]
    },
    {
      "id": "sup-scapula-25",
      "question": "Le bord médial ou spinal de la scapula :",
      "options": [
        "Donne insertion au muscle omo-hyoïdien.",
        "Est palpable.",
        "Donne insertion aux muscles petit et grand rhomboïdes, au-dessous de l'épine.",
        "Donne insertion sur son versant postérieur au muscle élévateur de la scapula, au-dessus de l'épine.",
        "Donne insertion aux muscles rhomboïdes, au-dessus de l'épine."
      ],
      "correctIndexes": [
        1,
        2,
        3
      ],
      "explanations": [
        "L'omo-hyoïdien s'insère sur le bord supérieur.",
        "Cette proposition est correcte.",
        "Cette proposition est correcte.",
        "Cette proposition est correcte.",
        "Les rhomboïdes s'insèrent au-dessous de l'épine ; au-dessus s'insère l'élévateur de la scapula."
      ]
    },
    {
      "id": "sup-scapula-26",
      "question": "Le bord latéral ou axillaire de la scapula :",
      "options": [
        "Est épais sur toute sa longueur.",
        "Donne insertion au muscle omo-hyoïdien.",
        "Est séparé du processus coracoïde par l'incisure scapulaire.",
        "Est mince.",
        "S'épaissit au niveau du col de la scapula."
      ],
      "correctIndexes": [
        3,
        4
      ],
      "explanations": [
        "Il est mince et s'épaissit seulement au niveau du col.",
        "L'omo-hyoïdien s'insère sur le bord supérieur.",
        "C'est le bord supérieur qui est séparé du processus coracoïde par l'incisure scapulaire.",
        "Cette proposition est correcte.",
        "Cette proposition est correcte."
      ]
    },
    {
      "id": "sup-scapula-27",
      "question": "L'angle supérieur de la scapula :",
      "options": [
        "Donne insertion au muscle grand rhomboïde.",
        "Se projette en regard de la septième vertèbre thoracique (T7).",
        "Est presque droit.",
        "Donne insertion au muscle élévateur de la scapula.",
        "Est arrondi."
      ],
      "correctIndexes": [
        2,
        3
      ],
      "explanations": [
        "Il donne insertion à l'élévateur de la scapula ; les rhomboïdes s'insèrent sur le bord médial, au-dessous de l'épine.",
        "C'est l'angle inférieur qui se projette en regard de T7.",
        "Cette proposition est correcte.",
        "Cette proposition est correcte.",
        "Il est presque droit ; c'est l'angle inférieur qui est arrondi."
      ]
    },
    {
      "id": "sup-scapula-28",
      "question": "L'angle inférieur de la scapula :",
      "options": [
        "Se projette en regard de la septième vertèbre thoracique (T7).",
        "Est arrondi.",
        "Est presque droit.",
        "Est un repère anatomique palpable.",
        "Se projette en regard de la deuxième vertèbre thoracique (T2)."
      ],
      "correctIndexes": [
        0,
        1,
        3
      ],
      "explanations": [
        "Cette proposition est correcte.",
        "Cette proposition est correcte.",
        "Il est arrondi ; c'est l'angle supérieur qui est presque droit.",
        "Cette proposition est correcte.",
        "Il se projette en regard de T7."
      ]
    },
    {
      "id": "sup-scapula-29",
      "question": "L'angle latéral de la scapula présente :",
      "options": [
        "Le processus coracoïde.",
        "Le col de la scapula, qui porte la cavité glénoïdale.",
        "L'incisure scapulaire.",
        "L'acromion.",
        "La cavité glénoïdale."
      ],
      "correctIndexes": [
        0,
        1,
        4
      ],
      "explanations": [
        "Cette proposition est correcte.",
        "Cette proposition est correcte.",
        "L'incisure scapulaire appartient au bord supérieur.",
        "L'acromion termine latéralement l'épine de la scapula ; il n'appartient pas à l'angle latéral.",
        "Cette proposition est correcte."
      ]
    },
    {
      "id": "sup-scapula-30",
      "question": "Le processus coracoïde donne insertion aux muscles :",
      "options": [
        "Coraco-brachial.",
        "Long chef du triceps brachial.",
        "Petit pectoral.",
        "Long chef du biceps brachial.",
        "Court chef du biceps brachial."
      ],
      "correctIndexes": [
        0,
        2,
        4
      ],
      "explanations": [
        "Cette proposition est correcte.",
        "Le long chef du triceps s'insère sur le tubercule infra-glénoïdal.",
        "Cette proposition est correcte.",
        "Le long chef du biceps s'insère sur le tubercule supra-glénoïdal ; c'est le court chef qui s'insère sur le coracoïde.",
        "Cette proposition est correcte."
      ]
    },
    {
      "id": "sup-scapula-31",
      "question": "La cavité glénoïdale :",
      "options": [
        "Est une surface articulaire ovalaire peu profonde.",
        "Est orientée en avant et latéralement.",
        "Est entourée par un anneau osseux qui diminue la congruence avec la tête humérale.",
        "S'articule avec la tête humérale.",
        "Est entourée par le labrum glénoïdal, anneau fibro-cartilagineux qui augmente la congruence avec la tête humérale."
      ],
      "correctIndexes": [
        0,
        1,
        3,
        4
      ],
      "explanations": [
        "Cette proposition est correcte.",
        "Cette proposition est correcte.",
        "Elle est entourée par le labrum, anneau fibro-cartilagineux qui augmente la congruence.",
        "Cette proposition est correcte.",
        "Cette proposition est correcte."
      ]
    },
    {
      "id": "sup-scapula-32",
      "question": "Le col de la scapula :",
      "options": [
        "Le tubercule supra-glénoïdal donne insertion au long chef du triceps brachial.",
        "Présente en bas le tubercule infra-glénoïdal, où s'insère le long chef du triceps brachial.",
        "Est épais.",
        "Le tubercule infra-glénoïdal donne insertion au court chef du biceps brachial.",
        "Présente en haut le tubercule supra-glénoïdal, où s'insère le long chef du biceps brachial."
      ],
      "correctIndexes": [
        1,
        2,
        4
      ],
      "explanations": [
        "Il donne insertion au long chef du biceps brachial ; le triceps s'insère sur le tubercule infra-glénoïdal.",
        "Cette proposition est correcte.",
        "Cette proposition est correcte.",
        "Il donne insertion au long chef du triceps brachial ; le court chef du biceps s'insère sur le processus coracoïde.",
        "Cette proposition est correcte."
      ]
    },
    {
      "id": "sup-scapula-33",
      "question": "Quels sont les repères anatomiques palpables de la scapula ?",
      "options": [
        "La cavité glénoïdale.",
        "L'épine.",
        "L'angle inférieur.",
        "Le processus coracoïde.",
        "L'acromion."
      ],
      "correctIndexes": [
        1,
        2,
        3,
        4
      ],
      "explanations": [
        "Elle n'est pas palpable ; les repères palpables sont l'épine, l'acromion, l'angle inférieur, le bord médial et le processus coracoïde.",
        "Cette proposition est correcte.",
        "Cette proposition est correcte.",
        "Cette proposition est correcte.",
        "Cette proposition est correcte."
      ]
    },
    {
      "id": "sup-scapula-34",
      "question": "Quelles affirmations concernant les applications cliniques de la scapula sont correctes ?",
      "options": [
        "L'acromion est un point de repère anatomique dans l'abord chirurgical de l'épaule.",
        "La luxation sterno-claviculaire.",
        "La fracture du col de la scapula ne nécessite jamais de chirurgie.",
        "L'angle inférieur est le repère de l'abord chirurgical de l'épaule.",
        "La fracture du col de la scapula nécessite parfois une intervention chirurgicale."
      ],
      "correctIndexes": [
        0,
        4
      ],
      "explanations": [
        "Cette proposition est correcte.",
        "C'est une application clinique de la clavicule, pas de la scapula.",
        "Une intervention chirurgicale est parfois nécessaire.",
        "C'est l'acromion qui est le repère de l'abord chirurgical de l'épaule.",
        "Cette proposition est correcte."
      ]
    },
  ],
  ax: [
    {
      id: "ax-q1",
      question: "Le sternum :",
      options: [
        "Comprend le manubrium, le corps et le processus xiphoïde.",
        "S’articule avec les clavicules.",
        "Possède une concavité antérieure comme critère d’orientation.",
        "L’angle sternal unit le corps du sternum au processus xiphoïde.",
        "Le sternum est un os pair situé sur la paroi postérieure du thorax.",
      ],
      correctIndexes: [0, 1],
    },
    {
      id: "ax-q2",
      question: "À propos des incisures du sternum :",
      options: [
        "La première incisure costale est située sur le processus xiphoïde.",
        "L’incisure jugulaire est médiane.",
        "Les incisures costales sont au nombre de douze de chaque côté.",
        "La septième incisure costale se trouve à la jonction corps–processus xiphoïde.",
        "Les incisures claviculaires se trouvent sur le processus xiphoïde.",
      ],
      correctIndexes: [1, 3],
    },
    {
      id: "ax-q3",
      question: "Les côtes thoraciques :",
      options: [
        "Les côtes 8 à 10 possèdent une extrémité antérieure libre.",
        "Les sept premières paires de côtes sont flottantes.",
        "Sont au nombre de 12 paires.",
        "Toutes s’articulent directement au sternum.",
        "Les 11e et 12e sont flottantes.",
      ],
      correctIndexes: [2, 4],
    },
    {
      id: "ax-q4",
      question: "Une côte typique possède :",
      options: [
        "Une dent odontoïde.",
        "Un sillon costal sur la partie inférieure de la face médiale.",
        "Un col.",
        "Une côte typique ne possède pas de tête.",
        "Le corps d’une côte typique est cylindrique sans bords.",
      ],
      correctIndexes: [1, 2],
    },
    {
      id: "ax-q5",
      question: "La première côte se caractérise par :",
      options: [
        "Le sillon de l’artère subclavière est situé en avant.",
        "Un tubercule du scalène antérieur séparant les sillons.",
        "Une forme plus courte et plus courbée que les autres côtes.",
        "Une absence de tête.",
        "Le sillon de la veine subclavière est situé en arrière.",
      ],
      correctIndexes: [1, 2],
    },
    {
      id: "ax-q6",
      question: "Le rachis cervical :",
      options: [
        "L’atlas correspond à la deuxième vertèbre cervicale.",
        "Présente une lordose cervicale.",
        "Le rachis cervical comprend cinq vertèbres.",
        "Constitue le squelette du cou.",
        "Comprend douze vertèbres.",
      ],
      correctIndexes: [1, 3],
    },
    {
      id: "ax-q7",
      question: "Une vertèbre cervicale typique présente :",
      options: [
        "Les processus transverses cervicaux typiques sont dépourvus de foramens.",
        "La vertèbre cervicale type ne possède pas de corps vertébral.",
        "Un foramen vertébral.",
        "Un foramen transverse.",
        "Des fossettes costales sur le corps comme caractère typique.",
      ],
      correctIndexes: [2, 3],
    },
    {
      id: "ax-q8",
      question: "L’atlas (C1) :",
      options: [
        "S’articule en haut avec les condyles occipitaux.",
        "Ne possède pas de corps vertébral.",
        "Les masses latérales sont absentes de l’atlas.",
        "Possède une dent odontoïde.",
        "L’atlas comporte un corps vertébral volumineux et aucun arc postérieur.",
      ],
      correctIndexes: [0, 1],
    },
    {
      id: "ax-q9",
      question: "L’axis (C2) :",
      options: [
        "La dent de l’axis est dirigée vers le bas.",
        "Présente une surface articulaire antérieure sur sa dent.",
        "Ne possède aucun corps vertébral.",
        "S’articule avec l’atlas.",
        "Le processus épineux de l’axis est typiquement non bifide.",
      ],
      correctIndexes: [1, 3],
    },
    {
      id: "ax-q10",
      question: "La vertèbre cervicale C7 :",
      options: [
        "Est appelée vertèbre proéminente.",
        "A généralement un processus épineux non bifide.",
        "Est la première vertèbre thoracique.",
        "Possède une dent odontoïde.",
        "Possède un processus épineux saillant et palpable.",
      ],
      correctIndexes: [0, 1, 4],
    },
    {
      id: "ax-q11",
      question: "Le rachis thoracique :",
      options: [
        "Présente une cyphose thoracique.",
        "S’articule avec les côtes.",
        "Est situé sous le sacrum.",
        "Les vertèbres thoraciques typiques ne comportent aucune fossette costale.",
        "Le rachis thoracique comprend sept vertèbres.",
      ],
      correctIndexes: [0, 1],
    },
    {
      id: "ax-q12",
      question: "Les vertèbres lombaires :",
      options: [
        "Sont au nombre de cinq.",
        "Les vertèbres lombaires portent des foramens transverses typiques.",
        "Présentent une lordose lombaire.",
        "Les vertèbres lombaires possèdent un petit corps vertébral rond.",
        "Sont les vertèbres qui portent les articulations costales typiques.",
      ],
      correctIndexes: [0, 2],
    },
    {
      id: "ax-q13",
      question: "Le sacrum :",
      options: [
        "S’articule en bas avec le fémur.",
        "Le sacrum résulte de la soudure de trois vertèbres sacrales.",
        "Présente des foramens sacraux antérieurs et postérieurs.",
        "Le sacrum s’articule en haut avec la vertèbre T12.",
        "Est concave en avant.",
      ],
      correctIndexes: [2, 4],
    },
    {
      id: "ax-q14",
      question: "Sur le sacrum, la face postérieure présente :",
      options: [
        "Les foramens sacraux postérieurs sont situés exclusivement sur la face pelvienne.",
        "Des cornes sacrales.",
        "La surface patellaire.",
        "La face postérieure du sacrum est dépourvue de crête médiane.",
        "Un hiatus sacral.",
      ],
      correctIndexes: [1, 4],
    },
    {
      id: "ax-q15",
      question: "Le coccyx :",
      options: [
        "La base du coccyx s’articule directement avec L5.",
        "Le coccyx est normalement constitué de sept vertèbres mobiles.",
        "A une concavité antérieure.",
        "S’articule directement avec la cinquième vertèbre lombaire.",
        "Peut être à l’origine d’une coccygodynie.",
      ],
      correctIndexes: [2, 4],
    },
  ],
  inf: [
    {
      id: "inf-q1",
      question: "L’os coxal :",
      options: [
        "Les deux os coxaux se rejoignent en arrière par une symphyse pubienne.",
        "S’articule avec le sacrum par la surface auriculaire.",
        "L’os coxal provient de la fusion du fémur, du sacrum et du pubis.",
        "S’articule latéralement avec la tête fémorale.",
        "S’articule directement avec le sternum.",
      ],
      correctIndexes: [1, 3],
    },
    {
      id: "inf-q2",
      question: "Pour orienter l’os coxal, on place :",
      options: [
        "La grande incisure ischiatique en arrière.",
        "La crête iliaque en bas.",
        "L’acétabulum en dedans.",
        "Le foramen obturé en bas.",
        "La cavité acétabulaire en dehors.",
      ],
      correctIndexes: [0, 3, 4],
    },
    {
      id: "inf-q3",
      question: "La cavité acétabulaire :",
      options: [
        "Contient une fosse acétabulaire centrale.",
        "Est située sur la face médiale de l’os coxal.",
        "S’articule avec la tête fémorale.",
        "La surface semi-lunaire de l’acétabulum est dépourvue de cartilage.",
        "Le labrum acétabulaire diminue la congruence de l’articulation.",
      ],
      correctIndexes: [0, 2],
    },
    {
      id: "inf-q4",
      question: "Le fémur :",
      options: [
        "A une tête dirigée en bas et en dehors.",
        "Le fémur s’articule distalement avec la fibula uniquement.",
        "Forme le squelette de la cuisse.",
        "S’articule en haut avec l’acétabulum.",
        "Le fémur est l’os le plus court de la cuisse.",
      ],
      correctIndexes: [2, 3],
    },
    {
      id: "inf-q5",
      question: "L’épiphyse proximale du fémur comprend :",
      options: [
        "La malléole médiale.",
        "La tête fémorale.",
        "La malléole latérale.",
        "Le petit trochanter.",
        "La trochlée fémorale.",
      ],
      correctIndexes: [1, 3],
    },
    {
      id: "inf-q6",
      question: "Concernant la diaphyse fémorale :",
      options: [
        "La ligne âpre se compose de trois lèvres.",
        "La ligne pectinée rejoint directement le condyle latéral.",
        "La diaphyse ne présente aucune insertion musculaire.",
        "Elle présente une ligne âpre en arrière.",
        "Le muscle vaste médial s’insère sur la lèvre médiale.",
      ],
      correctIndexes: [3, 4],
    },
    {
      id: "inf-q7",
      question: "La patella :",
      options: [
        "S’articule directement avec la fibula.",
        "Est située en avant du genou.",
        "La patella possède une base inférieure et un apex supérieur.",
        "S’articule avec la trochlée fémorale.",
        "La patella est un os long cylindrique.",
      ],
      correctIndexes: [1, 3],
    },
    {
      id: "inf-q8",
      question: "Au niveau de la patella :",
      options: [
        "Le tendon du quadriceps se termine sur l’apex de la patella.",
        "L’apex se situe au-dessus de la base.",
        "La face antérieure est palpable.",
        "La face postérieure est articulaire.",
        "Le ligament patellaire s’insère sur la base de la patella.",
      ],
      correctIndexes: [2, 3],
    },
    {
      id: "inf-q9",
      question: "Le tibia :",
      options: [
        "Le tibia est l’os postéro-latéral de la jambe.",
        "S’articule avec la fibula en haut et en bas.",
        "S’articule en haut avec le fémur.",
        "Est situé latéralement par rapport à la fibula.",
        "Le tibia s’articule en bas directement avec le calcanéum.",
      ],
      correctIndexes: [1, 2],
    },
    {
      id: "inf-q10",
      question: "Concernant les repères du tibia :",
      options: [
        "Le ligament patellaire s’insère sur la malléole médiale.",
        "La malléole médiale est distale.",
        "La malléole latérale appartient au tibia.",
        "La ligne du muscle soléaire se trouve sur la face antérieure du tibia.",
        "Le bord antérieur est palpable.",
      ],
      correctIndexes: [1, 4],
    },
    {
      id: "inf-q11",
      question: "La fibula :",
      options: [
        "La fibula est l’os antéro-médial de la jambe.",
        "S’articule avec le talus.",
        "La fibula forme à elle seule la surface portante du genou.",
        "Porte la malléole médiale.",
        "S’articule avec le tibia.",
      ],
      correctIndexes: [1, 4],
    },
    {
      id: "inf-q12",
      question: "À propos de la fibula :",
      options: [
        "La malléole latérale est son épiphyse distale.",
        "La diaphyse ne comporte qu’une face.",
        "Le col fibulaire est normalement éloigné du nerf fibulaire commun.",
        "L’apex de la tête donne insertion au biceps fémoral.",
        "Le sillon malléolaire latéral transmet le tendon d’Achille.",
      ],
      correctIndexes: [0, 3],
    },
    {
      id: "inf-q13",
      question: "Le pied comprend :",
      options: [
        "Le tarse comprend huit os.",
        "26 os constants.",
        "Des phalanges.",
        "Huit os du tarse.",
        "Le pied comporte six métatarsiens.",
      ],
      correctIndexes: [1, 2],
    },
    {
      id: "inf-q14",
      question: "Quels éléments appartiennent au tarse ?",
      options: [
        "Patella.",
        "Talus.",
        "Naviculaire.",
        "Tibia.",
        "Patella.",
      ],
      correctIndexes: [1, 2],
    },
    {
      id: "inf-q15",
      question: "L’articulation du genou :",
      options: [
        "Est une articulation entre le fémur et le talus.",
        "Est stabilisée par les ligaments croisés.",
        "Comprend des surfaces articulaires fémorales, tibiales et patellaires.",
        "Le ménisque médial a une forme de O.",
        "Le ménisque latéral a une forme de C.",
      ],
      correctIndexes: [1, 2],
    },
  ],
};
