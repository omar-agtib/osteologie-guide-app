export type IdentificationLandmark = {
  number: number;
  answers: string[];
};

export type IdentificationExercise = {
  id: string;
  title: string;
  subtitle: string;
  image: number;
  landmarks: IdentificationLandmark[];
};

type LandmarkMap = Record<number, string[]>;

function pick(map: LandmarkMap, numbers: number[]): IdentificationLandmark[] {
  return numbers
    .filter((number) => map[number])
    .map((number) => ({
      number,
      answers: map[number],
    }));
}

// ======================================================
// OS COXAL
// ======================================================

const COXAL: LandmarkMap = {
  1: ["ilium"],
  2: ["ischium"],
  3: ["pubis"],

  4: ["face latérale", "face laterale"],

  5: ["fosse iliaque externe"],

  6: [
    "lignes glutéales",
    "lignes gluteales",
    "lignes semi-circulaires",
    "lignes semicirculaires",
  ],

  7: ["segments glutéaux", "segments gluteaux", "trois segments"],

  8: ["cavité acétabulaire", "cavite acetabulaire", "acétabulum", "acetabulum"],

  9: ["limbus acétabulaire", "limbus acetabulaire"],

  10: [
    "partie périphérique de l'acétabulum",
    "partie peripherique de l'acetabulum",
    "surface articulaire de l'acétabulum",
    "surface articulaire de l'acetabulum",
  ],

  11: [
    "arrière-fond de la cavité acétabulaire",
    "arriere-fond de la cavite acetabulaire",
    "arrière-fond de l'acétabulum",
    "arriere-fond de l'acetabulum",
  ],

  12: [
    "ligament de la tête fémorale",
    "ligament de la tete femorale",
    "ligament rond",
  ],

  13: ["foramen obturé", "foramen obture"],

  14: ["branche horizontale du pubis"],

  15: ["branche descendante du pubis"],

  16: [
    "branches de l'ischium",
    "branches de l’ischium",
    "branche ascendante et descendante de l'ischium",
    "branche ascendante et descendante de l’ischium",
  ],

  17: [
    "tubérosité ischiatique",
    "tuberosite ischiatique",
    "tubérosité de l'ischium",
    "tuberosite de l'ischium",
  ],

  18: ["sillon obturateur", "canal obturateur"],

  19: ["face médiale", "face mediale"],

  20: [
    "ligne arquée de l'ilium",
    "ligne arquee de l'ilium",
    "ligne innominée",
    "ligne innominee",
  ],

  21: ["fosse iliaque interne"],

  22: ["facette auriculaire", "surface auriculaire"],

  23: ["tubérosité iliaque", "tuberosite iliaque"],

  24: ["surface quadrilatère", "surface quadrilatere"],

  25: ["bord supérieur", "bord superieur", "crête iliaque", "crete iliaque"],

  26: [
    "épine iliaque postéro-supérieure",
    "epine iliaque postero-superieure",
    "EIPS",
  ],

  27: [
    "épine iliaque antéro-supérieure",
    "epine iliaque antero-superieure",
    "EIAS",
  ],

  28: ["bord antérieur", "bord anterieur"],

  29: [
    "incisure inter-épineuse antérieure",
    "incisure inter-epineuse anterieure",
  ],

  30: [
    "épine iliaque antéro-inférieure",
    "epine iliaque antero-inferieure",
    "EIAI",
  ],

  31: ["éminence ilio-pectinée", "eminence ilio-pectinee"],

  32: ["surface pectinéale", "surface pectineale"],

  33: ["épine du pubis", "epine du pubis"],

  34: ["angle du pubis"],

  35: [
    "incisure inter-épineuse postérieure",
    "incisure inter-epineuse posterieure",
  ],

  36: [
    "épine iliaque postéro-inférieure",
    "epine iliaque postero-inferieure",
    "EIPI",
  ],

  37: ["grande incisure ischiatique"],

  38: ["épine ischiatique", "epine ischiatique"],

  39: ["petite incisure ischiatique"],

  40: ["bord inférieur", "bord inferieur"],

  41: ["symphyse pubienne", "symphyse pubique"],
};

// ======================================================
// FÉMUR
// ======================================================

const FEMUR: LandmarkMap = {
  1: ["tête fémorale", "tete femorale"],

  2: ["fovéa capitis", "fovea capitis"],

  3: ["col fémoral", "col femoral", "col du fémur", "col du femur"],

  4: [
    "ligne intertrochantérique postérieure",
    "ligne intertrochanterique posterieure",
  ],

  5: [
    "crête intertrochantérique antérieure",
    "crete intertrochanterique anterieure",
  ],

  6: ["grand trochanter"],

  7: [
    "fossette digitale",
    "face médiale du grand trochanter",
    "face mediale du grand trochanter",
  ],

  8: ["petit trochanter"],

  9: ["face antérieure", "face anterieure"],

  10: ["face postéro-latérale", "face postero-laterale"],

  11: ["face postéro-médiale", "face postero-mediale"],

  12: ["bords latéral et médial", "bords lateral et medial"],

  13: ["ligne âpre", "ligne apre", "bord postérieur", "bord posterieur"],

  14: [
    "lèvre médiale de la ligne âpre",
    "levre mediale de la ligne apre",
    "lèvre médiale",
    "levre mediale",
  ],

  15: [
    "lèvre latérale de la ligne âpre",
    "levre laterale de la ligne apre",
    "lèvre latérale",
    "levre laterale",
  ],

  16: ["ligne spirale"],

  17: ["ligne pectinée", "ligne pectinee"],

  18: ["tubérosité glutéale", "tuberosite gluteale"],

  19: ["surface poplitée", "surface poplitee"],

  20: ["condyle médial", "condyle medial"],

  21: ["condyle latéral", "condyle lateral"],

  22: ["surface patellaire", "trochlée fémorale", "trochlee femorale"],

  23: ["fosse intercondylaire"],

  24: ["tubercule supracondylaire médial", "tubercule supracondylaire medial"],

  25: [
    "tubercule supracondylaire latéral",
    "tubercule supracondylaire lateral",
  ],

  26: ["épicondyle latéral", "epicondyle lateral"],

  27: ["épicondyle médial", "epicondyle medial"],
};

// ======================================================
// PATELLA
// ======================================================

const PATELLA: LandmarkMap = {
  1: ["face antérieure", "face anterieure"],

  2: ["face postérieure", "face posterieure", "face articulaire"],

  3: ["bord médial", "bord medial"],

  4: ["bord latéral", "bord lateral"],

  5: ["base", "base de la patella"],

  6: ["apex", "apex de la patella"],
};

// ======================================================
// TIBIA
// ======================================================

const TIBIA: LandmarkMap = {
  1: ["face supérieure", "face superieure"],

  2: [
    "surfaces articulaires tibiales supérieures",
    "surfaces articulaires tibiales superieures",
    "plateaux tibiaux",
  ],

  3: ["aires intercondylaires", "aire intercondylaire"],

  4: [
    "épines du tibia",
    "epines du tibia",
    "épines tibiales",
    "epines tibiales",
  ],

  5: [
    "tubérosité du tibia",
    "tuberosite du tibia",
    "tubérosité tibiale",
    "tuberosite tibiale",
  ],

  6: ["face latérale", "face laterale"],

  7: [
    "surface articulaire avec la fibula",
    "surface fibulaire",
    "facette articulaire fibulaire",
  ],

  8: ["tubercule de Gerdy", "tubercule du tractus ilio-tibial"],

  9: ["face médiale", "face mediale"],

  10: ["sillon du semi-membraneux", "sillon du muscle semi-membraneux"],

  11: ["face médiale de la diaphyse", "face mediale de la diaphyse"],

  12: ["face latérale de la diaphyse", "face laterale de la diaphyse"],

  13: [
    "face postérieure",
    "face posterieure",
    "face postérieure de la diaphyse",
    "face posterieure de la diaphyse",
  ],

  14: ["bord antérieur", "bord anterieur"],

  15: ["bord médial", "bord medial"],

  16: ["bord interosseux"],

  17: [
    "face antérieure de l'épiphyse distale",
    "face anterieure de l'epiphyse distale",
  ],

  18: [
    "face postérieure de l'épiphyse distale",
    "face posterieure de l'epiphyse distale",
  ],

  19: ["sillon malléolaire", "sillon malleolaire"],

  20: [
    "sillon du long fléchisseur de l'hallux",
    "sillon du long flechisseur de l'hallux",
  ],

  21: [
    "face médiale de l'épiphyse distale",
    "face mediale de l'epiphyse distale",
  ],

  22: [
    "malléole médiale",
    "malleole mediale",
    "malléole interne",
    "malleole interne",
  ],

  23: [
    "face latérale de l'épiphyse distale",
    "face laterale de l'epiphyse distale",
  ],

  24: ["facette fibulaire", "surface articulaire avec la fibula"],

  25: ["face inférieure", "face inferieure"],

  26: [
    "surface articulaire de la malléole médiale",
    "surface articulaire de la malleole mediale",
  ],
};

// ======================================================
// FIBULA
// ======================================================

const FIBULA: LandmarkMap = {
  1: [
    "tête de la fibula",
    "tete de la fibula",
    "tête fibulaire",
    "tete fibulaire",
  ],

  2: [
    "surface articulaire de la tête fibulaire",
    "surface articulaire de la tete fibulaire",
  ],

  3: [
    "apex de la tête",
    "apex de la tete",
    "apophyse styloïde",
    "apophyse styloide",
  ],

  4: ["col de la fibula", "col fibulaire"],

  5: ["face médiale", "face mediale"],

  6: ["face latérale", "face laterale"],

  7: ["sillon malléolaire latéral", "sillon malleolaire lateral"],

  8: ["face postérieure", "face posterieure"],

  9: [
    "aire médiale",
    "aire mediale",
    "aire du muscle tibial postérieur",
    "aire du muscle tibial posterieur",
  ],

  10: ["bord antérieur", "bord anterieur"],

  11: ["bord postérieur", "bord posterieur"],

  12: ["bord interosseux"],

  13: [
    "malléole latérale",
    "malleole laterale",
    "épiphyse distale",
    "epiphyse distale",
  ],

  14: ["sillon malléolaire latéral", "sillon malleolaire lateral"],

  15: [
    "surface articulaire de la malléole latérale",
    "surface articulaire de la malleole laterale",
  ],
};

// ======================================================
// PIED
// ======================================================

const FOOT: LandmarkMap = {
  1: ["tarse"],

  2: ["métatarse", "metatarse", "métatarses", "metatarses"],

  3: ["phalanges"],

  4: ["talus", "astragale"],

  5: [
    "trochlée astragalienne",
    "trochlee astragalienne",
    "trochlée du talus",
    "trochlee du talus",
  ],

  6: [
    "os naviculaire",
    "naviculaire",
    "scaphoïde tarsien",
    "scaphoide tarsien",
  ],

  7: ["tête du talus", "tete du talus"],

  8: ["col du talus"],

  9: ["corps du talus"],

  10: ["calcanéum", "calcaneum"],

  11: [
    "tubérosité postérieure du calcanéum",
    "tuberosite posterieure du calcaneum",
    "tubérosité du calcanéum",
    "tuberosite du calcaneum",
  ],

  12: [
    "gouttière du calcanéum",
    "gouttiere du calcaneum",
    "gouttière de la face médiale du calcanéum",
    "gouttiere de la face mediale du calcaneum",
  ],

  13: ["cuboïde", "cuboide", "os cuboïde", "os cuboide"],

  14: ["os cunéiformes", "os cuneiformes", "cunéiformes", "cuneiformes"],

  15: [
    "cunéiforme médial",
    "cuneiforme medial",
    "os cunéiforme médial",
    "os cuneiforme medial",
  ],

  16: [
    "cunéiforme intermédiaire",
    "cuneiforme intermediaire",
    "os cunéiforme intermédiaire",
    "os cuneiforme intermediaire",
  ],

  17: [
    "cunéiforme latéral",
    "cuneiforme lateral",
    "os cunéiforme latéral",
    "os cuneiforme lateral",
  ],

  18: [
    "base du métatarsien",
    "base du metatarsien",
    "base des métatarsiens",
    "base des metatarsiens",
  ],

  19: [
    "tête du métatarsien",
    "tete du metatarsien",
    "tête des métatarsiens",
    "tete des metatarsiens",
  ],

  20: [
    "os sésamoïdes du pied",
    "os sesamoides du pied",
    "os sésamoïdes",
    "os sesamoides",
  ],
};
// ======================================================
// CLAVICULE
// ======================================================

const CLAVICLE: LandmarkMap = {
  1: ["face supérieure"],
  2: ["face inférieure"],
  3: ["gouttière du muscle subclavier", "gouttière subclavière"],
  4: ["empreinte du ligament costo-claviculaire"],
  5: ["empreinte des ligaments coraco-claviculaires"],
  6: ["tubercule conoïde"],
  7: ["tubercule trapézoïde"],
  8: ["bord antérieur"],
  9: ["muscle grand pectoral", "insertion du muscle grand pectoral"],
  10: ["muscle deltoïde", "insertion du muscle deltoïde"],
  11: ["bord postérieur"],
  12: [
    "muscle sterno-cléido-mastoïdien",
    "insertion du muscle sterno-cléido-mastoïdien",
  ],
  13: ["muscle trapèze", "insertion du muscle trapèze"],
  14: ["épiphyse médiale", "épiphyse sternale", "extrémité sternale"],
  15: ["surface articulaire avec le sternum", "facette articulaire sternale"],
  16: ["épiphyse latérale", "épiphyse acromiale", "extrémité acromiale"],
  17: ["facette articulaire avec l'acromion", "facette articulaire acromiale"],
};

// ======================================================
// SCAPULA
// ======================================================

const SCAPULA: LandmarkMap = {
  1: ["face costale", "face antérieure", "fosse subscapulaire"],

  2: ["face postérieure", "face dorsale"],

  3: ["épine de la scapula"],

  4: ["lèvre supérieure de l'épine", "lèvre supérieure"],

  5: ["lèvre inférieure de l'épine", "lèvre inférieure"],

  6: ["acromion"],

  7: ["fosse supra-épineuse", "fosse sus-épineuse"],

  8: ["fosse infra-épineuse", "fosse sous-épineuse"],

  9: ["bord supérieur", "bord cervical"],

  10: ["incisure scapulaire"],

  11: ["bord médial", "bord spinal"],

  12: ["bord latéral", "bord axillaire"],

  13: ["angle supérieur"],

  14: ["angle inférieur"],

  15: ["processus coracoïde"],

  16: ["cavité glénoïdale", "cavité glénoïde"],

  17: ["col de la scapula"],

  18: ["tubercule supra-glénoïdal", "tubercule sus-glénoïdien"],

  19: ["tubercule infra-glénoïdal", "tubercule sous-glénoïdien"],
};

// ======================================================
// HUMÉRUS
// ======================================================

const HUMERUS: LandmarkMap = {
  1: ["tête humérale", "tête de l'humérus"],

  2: ["col anatomique"],

  3: ["col chirurgical"],

  4: ["tubercule majeur", "trochiter"],

  5: ["tubercule mineur", "trochin"],

  6: ["sillon intertuberculaire", "gouttière bicipitale"],

  7: ["face antéro-médiale"],

  8: ["face antéro-latérale"],

  9: ["tubérosité deltoïdienne", "V deltoïdien"],

  10: ["face postérieure"],

  11: ["sillon du nerf radial", "sillon spiral"],

  12: ["bord antérieur"],

  13: ["fosse coronoïdienne", "fossette coronoïde"],

  14: ["bord latéral"],

  15: ["bord médial"],

  16: ["capitulum huméral", "capitulum"],

  17: ["trochlée humérale", "trochlée"],

  18: ["fosse olécranienne", "fossette olécranienne"],

  19: ["palette humérale"],

  20: ["épicondyle médial", "épitrochlée"],

  21: ["épicondyle latéral"],
};

// ======================================================
// RADIUS
// ======================================================

const RADIUS: LandmarkMap = {
  1: ["tête du radius", "tête radiale"],

  2: ["fossette articulaire radiale", "cupule radiale"],

  3: ["col du radius", "col radial"],

  4: ["tubérosité radiale"],

  5: ["face antérieure", "face ventrale"],

  6: ["face postérieure", "face dorsale"],

  7: ["face latérale"],

  8: ["bord antérieur"],

  9: ["bord médial", "bord interosseux"],

  10: ["bord postérieur"],

  11: ["face antérieure de l'épiphyse distale", "face antérieure"],

  12: ["face postérieure de l'épiphyse distale", "face postérieure"],

  13: [
    "face latérale de l'épiphyse distale",
    "face latérale",
    "processus styloïde du radius",
  ],

  14: [
    "face médiale de l'épiphyse distale",
    "face médiale",
    "incisure ulnaire du radius",
  ],

  15: ["face inférieure", "face carpienne"],
};

// ======================================================
// ULNA
// ======================================================

const ULNA: LandmarkMap = {
  1: ["incisure trochléaire", "grande cavité sigmoïde"],

  2: ["olécrane"],

  3: ["processus coronoïde"],

  4: ["incisure radiale de l'ulna", "petite cavité sigmoïde"],

  5: ["face antérieure"],

  6: ["face médiale"],

  7: ["face postérieure"],

  8: ["bord latéral", "bord interosseux"],

  9: ["bord dorsal", "bord postérieur"],

  10: ["bord médial"],

  11: ["tête de l'ulna", "tête ulnaire", "circonférence articulaire ulnaire"],

  12: ["processus styloïde ulnaire", "processus styloïde de l'ulna"],
};

// ======================================================
// MAIN
// ======================================================

const HAND: LandmarkMap = {
  1: ["scaphoïde"],

  2: ["lunatum", "semi-lunaire"],

  3: ["triquetrum", "pyramidal"],

  4: ["pisiforme"],

  5: ["trapèze"],

  6: ["trapézoïde"],

  7: ["capitatum", "grand os"],

  8: ["hamatum", "os crochu"],

  9: ["corps du métacarpien", "corps du métacarpe"],

  10: ["base du métacarpien", "base du métacarpe"],

  11: ["tête du métacarpien", "tête du métacarpe"],

  12: ["phalange proximale", "P1"],

  13: ["phalange moyenne", "P2"],

  14: ["phalange distale", "P3"],
};

// ======================================================
// STERNUM
// ======================================================

const STERNUM: LandmarkMap = {
  1: ["manubrium sternal", "manubrium"],
  2: ["appendice xiphoïde", "processus xiphoïde"],
  3: ["corps du sternum", "corps"],
  4: ["angle de Louis", "angle sternal"],
  5: ["première échancrure costale", "1ère échancrure costale"],
  6: ["deuxième échancrure costale", "2ème échancrure costale"],
  7: ["échancrure claviculaire", "échancrures claviculaires"],
};

// ======================================================
// CÔTES
// ======================================================

const RIBS: LandmarkMap = {
  1: ["tête de la côte", "tête"],
  2: ["col de la côte", "col"],
  3: ["corps de la côte", "corps"],
  4: ["bord supérieur"],
  5: ["bord inférieur"],
  6: ["tubérosité costale", "tubercule costal"],
  7: ["angle postérieur de la côte", "angle postérieur"],
  8: ["angle antérieur de la côte", "angle antérieur"],
  9: ["gouttière costale"],

  10: ["tête de la première côte", "tête de la 1ère côte"],
  11: ["col de la première côte", "col de la 1ère côte"],
  12: ["gouttière de l'artère sous-clavière", "gouttière postérieure"],
  13: ["gouttière de la veine sous-clavière", "gouttière antérieure"],
  14: ["tubercule de Lisfranc", "tubercule costal"],

  15: ["face supéro-latérale de la deuxième côte", "face supéro-latérale"],

  16: ["tête de la onzième côte", "tête de la 11ème côte"],
  17: ["surface articulaire de la onzième côte", "surface articulaire"],
  18: ["face supérieure de la onzième côte", "face supérieure"],
  19: ["face inférieure de la onzième côte", "face inférieure"],

  20: ["tête de la douzième côte", "tête de la 12ème côte"],
  21: ["surface articulaire de la douzième côte", "surface articulaire"],
  22: ["corps de la douzième côte", "corps"],
};

// ======================================================
// VERTÈBRE CERVICALE TYPE
// ======================================================

const CERVICAL_TYPICAL: LandmarkMap = {
  1: ["corps vertébral", "corps"],
  2: ["pédicule", "pédicules"],
  3: ["processus articulaire", "processus articulaires"],
  4: ["surface articulaire supérieure"],
  5: ["surface articulaire inférieure"],
  6: ["lame vertébrale", "lames vertébrales"],
  7: ["processus épineux"],
  8: ["processus transverse", "processus transverses"],
  9: ["foramen transverse"],
  10: ["foramen vertébral", "trou vertébral"],
};

// ======================================================
// ATLAS — C1
// ======================================================

const ATLAS: LandmarkMap = {
  1: ["arc antérieur"],
  2: ["arc postérieur"],
  3: ["tubercule antérieur"],
  4: ["tubercule postérieur"],
  5: ["foramen vertébral", "trou vertébral"],
  6: ["masse latérale", "masses latérales"],
  7: ["surface articulaire supérieure"],
  8: ["surface articulaire inférieure"],
  9: ["fossette du processus odontoïde", "fossette odontoïdienne"],
  10: ["foramen transverse"],
  11: ["processus transverse"],
  12: ["gouttière de l'artère vertébrale", "sillon de l'artère vertébrale"],
};

// ======================================================
// AXIS — C2
// ======================================================

const AXIS: LandmarkMap = {
  1: ["processus odontoïde", "dent de l'axis", "odontoïde"],
  2: ["facette articulaire atloïdienne", "facette articulaire antérieure"],
  3: ["facette articulaire postérieure"],
  4: ["processus articulaire", "processus articulaires"],
  5: ["surface articulaire supérieure"],
  6: ["surface articulaire inférieure"],
  7: ["processus transverse"],
  8: ["foramen transverse"],
  9: ["bec de l'axis"],
  10: ["processus épineux"],
  11: ["arc neural"],
  12: ["foramen vertébral", "trou vertébral"],
};

// ======================================================
// C7 — VERTÈBRE PROÉMINENTE
// ======================================================

const C7: LandmarkMap = {
  1: ["processus épineux"],
  2: ["processus transverse"],
};

// ======================================================
// VERTÈBRE THORACIQUE
// ======================================================

const THORACIC: LandmarkMap = {
  1: ["corps vertébral", "corps"],
  2: ["facettes costales", "facette costale"],
  3: ["lames vertébrales", "lame vertébrale"],
  4: ["processus épineux"],
  5: ["pédicule vertébral", "pédicule"],
  6: ["processus transverse"],
  7: ["processus articulaire supérieur"],
  8: ["processus articulaire inférieur"],
  9: ["trou vertébral", "foramen vertébral"],
};

// ======================================================
// VERTÈBRE LOMBAIRE
// ======================================================

const LUMBAR: LandmarkMap = {
  1: ["corps vertébral", "corps"],
  2: ["pédicule", "pédicule vertébral"],
  3: ["lames vertébrales", "lame vertébrale"],
  4: ["processus épineux"],
  5: ["processus articulaire supérieur"],
  6: ["tubercule mamillaire"],
  7: ["processus articulaire inférieur"],
  8: ["processus transverse"],
  9: ["processus costiforme"],
  10: ["tubercule accessoire"],
  11: ["trou vertébral", "foramen vertébral"],
};

// ======================================================
// SACRUM
// ======================================================

const SACRUM: LandmarkMap = {
  1: ["bande des corps vertébraux", "corps vertébraux"],
  2: ["crêtes transversales", "crête transversale"],
  3: ["trous sacrés antérieurs", "foramens sacrés antérieurs"],
  4: ["gouttières des nerfs sacrés", "gouttière des nerfs sacrés"],

  5: ["crête sacrée"],
  6: ["cornes du sacrum"],
  7: ["échancrure sacrée"],
  8: ["gouttières sacrées", "gouttière sacrée"],
  9: ["tubercules sacrés postéro-médiaux", "tubercule sacré postéro-médial"],
  10: ["trous sacrés postérieurs", "foramens sacrés postérieurs"],
  11: ["tubercules sacrés postéro-latéraux", "tubercule sacré postéro-latéral"],

  12: ["surface auriculaire"],
  13: ["base du sacrum", "base"],
  14: ["orifice supérieur du canal sacré", "canal sacré"],
  15: ["processus articulaires supérieurs", "processus articulaire supérieur"],
  16: ["ailerons sacrés", "aileron sacré"],
  17: ["sommet du sacrum", "apex du sacrum"],
};

// ======================================================
// COCCYX
// ======================================================

const COCCYX: LandmarkMap = {
  1: ["vertèbres coccygiennes", "vertèbre coccygienne"],
  2: ["petites cornes du coccyx", "cornes du coccyx"],
  3: ["processus transverses", "processus transverse"],
  4: ["base du coccyx", "base"],
  5: ["apex du coccyx", "apex"],
};

// ======================================================
// EXERCICES
// ======================================================

export const IDENTIFICATION_EXERCISES: Record<
  string,
  IdentificationExercise[]
> = {
  sup: [
    // ====================================================
    // CLAVICULE
    // ====================================================

    {
      id: "clavicle",
      title: "La clavicule",
      subtitle: "Vues supérieure et inférieure",
      image: require("../../assets/courses/membre-superieur/page-04.webp"),
      landmarks: pick(
        CLAVICLE,
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
      ),
    },

    // ====================================================
    // SCAPULA
    // ====================================================

    {
      id: "scapula-anterior",
  title: "La scapula",
  subtitle: "Vue antérieure",
  image: require("../../assets/courses/membre-superieur/page-09.webp"),
      landmarks: pick(SCAPULA, [1, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]),
    },

    {
      id: "scapula-posterior",
      title: "La scapula",
      subtitle: "Vue postérieure",
      image: require("../../assets/courses/membre-superieur/page-10.webp"),
      landmarks: pick(SCAPULA, [2, 3, 4, 5, 6, 7, 8]),
    },

    // ====================================================
    // HUMÉRUS
    // ====================================================

    {
      id: "humerus",
      title: "L'humérus",
      subtitle: "Vues antérieure et postérieure",
      image: require("../../assets/courses/membre-superieur/page-14.webp"),
      landmarks: pick(
        HUMERUS,
        [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
          21,
        ],
      ),
    },

    // ====================================================
    // RADIUS
    // ====================================================

    {
      id: "radius",
      title: "Le radius",
      subtitle: "Vues postérieure et antérieure",
      image: require("../../assets/courses/membre-superieur/page-18.webp"),
      landmarks: pick(
        RADIUS,
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      ),
    },

    // ====================================================
    // ULNA
    // ====================================================

    {
      id: "ulna",
      title: "L'ulna",
      subtitle: "Vues antérieure et postérieure",
      image: require("../../assets/courses/membre-superieur/page-21.webp"),
      landmarks: pick(ULNA, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
    },

    // ====================================================
    // MAIN
    // ====================================================

    {
      id: "hand-anterior",
      title: "Le squelette de la main",
      subtitle: "Vue antérieure",
      image: require("../../assets/courses/membre-superieur/page-24.webp"),
      landmarks: pick(HAND, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]),
    },

    {
      id: "hand-dorsal",
      title: "Le squelette de la main",
      subtitle: "Vue dorsale",
      image: require("../../assets/courses/membre-superieur/page-25.webp"),
      landmarks: pick(HAND, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]),
    },
  ],

  ax: [
    // ====================================================
    // STERNUM
    // ====================================================

    {
      id: "sternum",
      title: "Le sternum",
      subtitle: "Repères anatomiques",
      image: require("../../assets/courses/squelette-axial/page-04.webp"),
      landmarks: pick(STERNUM, [1, 2, 3, 4, 5, 6, 7]),
    },

    // ====================================================
    // CÔTES
    // ====================================================

    {
      id: "ribs-typical",
      title: "Les côtes",
      subtitle: "Côte typique",
      image: require("../../assets/courses/squelette-axial/page-07.webp"),
      landmarks: pick(RIBS, [1, 2, 3, 4, 5, 6, 7, 8, 9]),
    },

    {
      id: "ribs-special",
      title: "Les côtes",
      subtitle: "Côtes particulières",
      image: require("../../assets/courses/squelette-axial/page-08.webp"),
      landmarks: pick(
        RIBS,
        [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
      ),
    },

    // ====================================================
    // RACHIS CERVICAL
    // ====================================================

    {
      id: "cervical-typical",
      title: "Le rachis cervical",
      subtitle: "Vertèbre cervicale type",
      image: require("../../assets/courses/squelette-axial/page-12.webp"),
      landmarks: pick(CERVICAL_TYPICAL, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    },

    {
      id: "cervical-atlas",
      title: "L'Atlas — C1",
      subtitle: "Première vertèbre cervicale",
      image: require("../../assets/courses/squelette-axial/page-13.webp"),
      landmarks: pick(ATLAS, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
    },

    {
      id: "cervical-axis",
      title: "L'Axis — C2",
      subtitle: "Deuxième vertèbre cervicale",
      image: require("../../assets/courses/squelette-axial/page-14.webp"),
      landmarks: pick(AXIS, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
    },

    {
      id: "cervical-c7",
      title: "C7",
      subtitle: "Vertèbre proéminente",
      image: require("../../assets/courses/squelette-axial/page-15.webp"),
      landmarks: pick(C7, [1, 2]),
    },

    // ====================================================
    // RACHIS THORACIQUE
    // ====================================================

    {
      id: "thoracic",
      title: "Le rachis thoracique",
      subtitle: "Vertèbre thoracique type",
      image: require("../../assets/courses/squelette-axial/page-18.webp"),
      landmarks: pick(THORACIC, [1, 2, 3, 4, 5, 6, 7, 8, 9]),
    },

    // ====================================================
    // RACHIS LOMBAIRE
    // ====================================================

    {
      id: "lumbar",
      title: "Le rachis lombaire",
      subtitle: "Vertèbre lombaire type",
      image: require("../../assets/courses/squelette-axial/page-21.webp"),
      landmarks: pick(LUMBAR, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    },

    // ====================================================
    // SACRUM
    // ====================================================

    {
      id: "sacrum",
      title: "Le sacrum",
      subtitle: "Repères anatomiques",
      image: require("../../assets/courses/squelette-axial/page-24.webp"),
      landmarks: pick(
        SACRUM,
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
      ),
    },

    // ====================================================
    // COCCYX
    // ====================================================

    {
      id: "coccyx",
      title: "Le coccyx",
      subtitle: "Repères anatomiques",
      image: require("../../assets/courses/squelette-axial/page-26.webp"),
      landmarks: pick(COCCYX, [1, 2, 3, 4, 5]),
    },
  ],

  inf: [
    // --------------------------------------------------
    // OS COXAL
    // --------------------------------------------------

    {
      id: "coxal-medial",
      title: "L'os coxal",
      subtitle: "Vue médiale",
      image: require("../../assets/courses/membre-inferieur/page-06.webp"),
      landmarks: pick(
        COXAL,
        [
          17, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
          36, 37, 38, 39, 40, 41,
        ],
      ),
    },

    {
      id: "coxal-lateral",
      title: "L'os coxal",
      subtitle: "Vue latérale",
      image: require("../../assets/courses/membre-inferieur/page-07.webp"),
      landmarks: pick(
        COXAL,
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
      ),
    },

    // --------------------------------------------------
    // FÉMUR
    // --------------------------------------------------

    {
      id: "femur-anterior",
      title: "Le fémur",
      subtitle: "Vue antérieure",
      image: require("../../assets/courses/membre-inferieur/page-11.webp"),
      landmarks: pick(FEMUR, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 22]),
    },

    {
      id: "femur-posterior",
      title: "Le fémur",
      subtitle: "Vue postérieure",
      image: require("../../assets/courses/membre-inferieur/page-12.webp"),
      landmarks: pick(
        FEMUR,
        [4, 7, 8, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 23, 24, 25, 26, 27],
      ),
    },

    // --------------------------------------------------
    // PATELLA
    // --------------------------------------------------

    {
      id: "patella",
      title: "La patella",
      subtitle: "Vues antérieure et postérieure",
      image: require("../../assets/courses/membre-inferieur/page-14.webp"),
      landmarks: pick(PATELLA, [1, 2, 3, 4, 5, 6]),
    },

    // --------------------------------------------------
    // TIBIA
    // --------------------------------------------------

    {
      id: "tibia-anterior",
      title: "Le tibia",
      subtitle: "Vue antérieure",
      image: require("../../assets/courses/membre-inferieur/page-18.webp"),
      landmarks: pick(
        TIBIA,
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 14, 15, 16, 17, 21, 22, 23, 24, 25],
      ),
    },

    {
      id: "tibia-posterior",
      title: "Le tibia",
      subtitle: "Vue postérieure",
      image: require("../../assets/courses/membre-inferieur/page-19.webp"),
      landmarks: pick(
        TIBIA,
        [1, 2, 9, 10, 13, 18, 19, 20, 21, 22, 23, 24, 25, 26],
      ),
    },

    // --------------------------------------------------
    // FIBULA
    // --------------------------------------------------

    {
      id: "fibula",
      title: "La fibula",
      subtitle: "Vues antérieure, postérieure et médiale",
      image: require("../../assets/courses/membre-inferieur/page-22.webp"),
      landmarks: pick(
        FIBULA,
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      ),
    },

    // --------------------------------------------------
    // PIED
    // --------------------------------------------------

    {
      id: "foot-anterior-plantar",
      title: "Le squelette du pied",
      subtitle: "Vues antérieure et plantaire",
      image: require("../../assets/courses/membre-inferieur/page-25.webp"),
      landmarks: pick(
        FOOT,
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      ),
    },

    {
      id: "foot-lateral-medial",
      title: "Le squelette du pied",
      subtitle: "Vues latérale et médiale",
      image: require("../../assets/courses/membre-inferieur/page-26.webp"),
      landmarks: pick(FOOT, [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 18, 19]),
    },
  ],
};
