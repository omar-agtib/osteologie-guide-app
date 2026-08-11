export type BoneInfo = {
  name: string;
  description: string;
  location: string;
  function: string;
  articulations?: string;
};

export const boneData: Record<string, BoneInfo> = {
  Femur: {
    name: "Femur",

    description:
      "The femur is the longest and strongest bone in the human body.",

    location:
      "Located in the thigh between the hip and the knee.",

    function:
      "Supports body weight and plays a major role in standing, walking and running.",

    articulations:
      "Articulates with the acetabulum at the hip and with the tibia and patella at the knee.",
  },

  Tibia: {
    name: "Tibia",

    description:
      "The tibia is the larger and stronger of the two bones of the lower leg.",

    location:
      "Located between the knee and ankle.",

    function:
      "Supports most of the body's weight transmitted through the lower leg.",

    articulations:
      "Articulates with the femur, fibula and talus.",
  },

  Clavicle: {
    name: "Clavicle",

    description:
      "The clavicle is an S-shaped bone that connects the upper limb to the axial skeleton.",

    location:
      "Located horizontally at the upper anterior part of the thorax.",

    function:
      "Supports the shoulder and transfers forces from the upper limb to the trunk.",

    articulations:
      "Articulates with the sternum and the acromion of the scapula.",
  },

  Humerus: {
    name: "Humerus",

    description:
      "The humerus is the long bone of the upper arm.",

    location:
      "Located between the shoulder and elbow.",

    function:
      "Provides structural support for the arm and participates in shoulder and elbow movement.",

    articulations:
      "Articulates with the scapula, radius and ulna.",
  },
};