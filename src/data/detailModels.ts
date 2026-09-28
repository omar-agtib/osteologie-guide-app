export type DetailModelConfig = {
  asset: number;

  initialRotation?: {
    x: number;
    y: number;
  };
};

export const detailModels = {
  Clavicle: {
    asset: require("../../assets/models/details/clavicule_droite.glb"),

    initialRotation: {
      x: 0,
      y: 0,
    },
  },
} satisfies Record<string, DetailModelConfig>;

export type DetailModelName = keyof typeof detailModels;

export function getDetailModel(
  boneName: string,
): DetailModelConfig | null {
  return (
    detailModels[
      boneName as DetailModelName
    ] ?? null
  );
}