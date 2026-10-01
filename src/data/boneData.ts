export type BoneInfo = {
  name: string;

  definition: string;
  situation: string;

  orientation?: string;

  descriptionAnatomique?: string;

  articulations?: string;

  reperesPalpables?: string;

  applicationsCliniques?: string;
};

export const boneData: Record<string, BoneInfo> = {
  Clavicle: {
    name: "Clavicule",

    definition:
      "Os allongé en forme de « S » étiré, la clavicule est l’élément antérieur des os du squelette de la ceinture scapulaire.",

    situation:
      "Elle s’articule en dedans avec le sternum et en dehors avec la scapula.",

    orientation:
      "L’extrémité volumineuse est médiale, la face inférieure est rugueuse et la grande convexité est médiale et antérieure.",

    descriptionAnatomique:
      "Le corps comprend deux faces et deux bords. La face supérieure est lisse, sous-cutanée et palpable. La face inférieure est rugueuse et centrée par une gouttière où s’insère le muscle subclavier. Les épiphyses sont médiale ou sternale et latérale ou acromiale.",

    articulations:
      "L’épiphyse médiale porte une surface articulaire avec le sternum. L’épiphyse latérale porte une facette articulaire avec l’acromion.",

    reperesPalpables:
      "La clavicule est sous-cutanée et entièrement palpable sauf sur sa face inférieure.",

    applicationsCliniques:
      "La fracture de la clavicule est fréquente lors des accidents de la voie publique.",
  },

  Humerus: {
    name: "Humérus",

    definition:
      "Os long, pair et asymétrique qui constitue le squelette du bras, formé d’une diaphyse et de deux épiphyses.",

    situation:
      "Il s’articule en haut, en dedans et en arrière avec la cavité glénoïdale de la scapula et en bas avec les deux os de l’avant-bras.",

    orientation:
      "La surface sphérique est située en haut et en dedans, tandis que la fosse olécranienne est située en bas et en arrière.",

    descriptionAnatomique:
      "L’humérus comprend une épiphyse proximale, une diaphyse triangulaire à la coupe et une épiphyse distale. L’épiphyse proximale comprend notamment la tête humérale, les cols anatomique et chirurgical, les tubercules majeur et mineur et le sillon intertuberculaire.",

    articulations:
      "La tête humérale s’articule avec la cavité glénoïdale de la scapula. L’extrémité distale s’articule avec le radius et l’ulna.",

    reperesPalpables:
      "Les principaux repères palpables sont le tubercule majeur, le tubercule mineur, l’épicondyle latéral et l’épicondyle médial.",

    applicationsCliniques:
      "Les fractures peuvent intéresser le tiers moyen de la diaphyse, l’épicondyle médial ou l’extrémité supérieure.",
  },

  Femur: {
    name: "Fémur",

    definition:
      "Os long, pair et asymétrique, le fémur forme le squelette de la cuisse et constitue l’os le plus long du corps humain.",

    situation:
      "Il s’articule en haut avec l’acétabulum de l’os coxal, en bas avec le tibia et en bas et en avant avec la patella.",

    orientation:
      "L’extrémité sphérique est située en haut et en dedans, tandis que la ligne âpre forme un bord saillant en arrière.",

    descriptionAnatomique:
      "Le fémur comprend une épiphyse proximale avec la tête, le col et les trochanters, une diaphyse présentant trois faces et trois bords, et une épiphyse distale comportant les condyles et la surface patellaire.",

    articulations:
      "La tête fémorale s’articule avec l’acétabulum. Les condyles s’articulent avec le tibia et la surface patellaire avec la patella.",

    reperesPalpables:
      "Les principaux repères palpables sont les épicondyles, le grand trochanter et la trochlée pendant la flexion.",

    applicationsCliniques:
      "Les fractures du fémur sont fréquentes et graves. La fracture du col fémoral est particulièrement importante sur le plan fonctionnel.",
  },

  Tibia: {
    name: "Tibia",

    definition:
      "Os long, pair et asymétrique. Le tibia est l’os antérieur et médial de la jambe et forme avec la fibula le squelette de la jambe.",

    situation:
      "Il est situé à la face antéro-interne de la jambe. Il s’articule en haut avec le fémur, avec la fibula en haut et en bas, et en bas avec le talus.",

    orientation:
      "La malléole médiale est située en bas et en dedans, et le bord antérieur saillant est dirigé en avant.",

    descriptionAnatomique:
      "Le tibia présente une diaphyse et deux épiphyses. L’épiphyse proximale est volumineuse et présente les surfaces articulaires tibiales supérieures. La diaphyse est triangulaire à la coupe. L’épiphyse distale est moins volumineuse et se prolonge médialement par la malléole médiale.",

    articulations:
      "Il s’articule avec les condyles fémoraux, la fibula et le talus.",

    reperesPalpables:
      "Le bord antérieur, la tubérosité tibiale, les condyles et la malléole médiale sont facilement palpables.",

    applicationsCliniques:
      "Les fractures du tibia sont très fréquentes et peuvent être ouvertes en raison de sa situation superficielle.",
  },
};