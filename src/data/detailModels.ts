export type DetailModelAxis = "x" | "y" | "z";
export type DetailModelView = {
  id: string;
  label: string;

  cameraDirection: [number, number, number];

  cameraUp: [number, number, number];
};
export type DetailModelFeatures = {
  landmarks?: boolean;
  zones?: boolean;
  standardViews?: boolean;
  orientationLabels?: boolean;
  mirror?: boolean;
  autoRotate?: boolean;
};

export type DetailModelConfig = {
  asset: number;

  initialRotation?: {
    x: number;
    y: number;
  };

  longitudinalAxis?: DetailModelAxis;

  views?: DetailModelView[];

  features?: DetailModelFeatures;
};

export const detailModels = {
  Clavicle: {
    asset: require("../../assets/models/details/clavicule_droite.glb"),

    initialRotation: {
      x: 0,
      y: 0,
    },

    longitudinalAxis: "x",

    views: [
      {
        id: "superieure",
        label: "Supérieure",
        cameraDirection: [0, 1, 0],
        cameraUp: [0, 0, -1],
      },
      {
        id: "inferieure",
        label: "Inférieure",
        cameraDirection: [0, -1, 0],
        cameraUp: [0, 0, 1],
      },
      {
        id: "anterieure",
        label: "Antérieure",
        cameraDirection: [0, 0, 1],
        cameraUp: [0, 1, 0],
      },
      {
        id: "posterieure",
        label: "Postérieure",
        cameraDirection: [0, 0, -1],
        cameraUp: [0, 1, 0],
      },
      {
        id: "laterale",
        label: "Latérale",
        cameraDirection: [-1, 0, 0],
        cameraUp: [0, 1, 0],
      },
      {
        id: "mediale",
        label: "Médiale",
        cameraDirection: [1, 0, 0],
        cameraUp: [0, 1, 0],
      },
    ],

    features: {
      landmarks: true,
      zones: true,
      standardViews: true,
      orientationLabels: true,
      mirror: true,
      autoRotate: true,
    },
  },

  Scapula: {
    asset: require("../../assets/models/details/scapula_droite.glb"),

    initialRotation: {
      x: 0,
      y: 0,
    },

    longitudinalAxis: "y",

    views: [
      {
        id: "anterieure",
        label: "Antérieure",
        cameraDirection: [0, 0, 1],
        cameraUp: [0, 1, 0],
      },
      {
        id: "posterieure",
        label: "Postérieure",
        cameraDirection: [0, 0, -1],
        cameraUp: [0, 1, 0],
      },
      {
        id: "laterale",
        label: "Latérale",
        cameraDirection: [-0.994, -0.101, -0.04],
        cameraUp: [0, 1, 0],
      },
      {
        id: "mediale",
        label: "Médiale",
        cameraDirection: [1, 0, 0],
        cameraUp: [0, 1, 0],
      },
      {
        id: "superieure",
        label: "Supérieure",
        cameraDirection: [0, 1, 0],
        cameraUp: [0, 0, -1],
      },
      {
        id: "inferieure",
        label: "Inférieure",
        cameraDirection: [0, -1, 0],
        cameraUp: [0, 0, 1],
      },
    ],

    features: {
      landmarks: true,
      zones: true,
      standardViews: true,
      orientationLabels: true,
      mirror: true,
      autoRotate: true,
    },
  },
} satisfies Record<string, DetailModelConfig>;

export type DetailModelName = keyof typeof detailModels;

export function getDetailModel(boneName: string): DetailModelConfig | null {
  return detailModels[boneName as DetailModelName] ?? null;
}
