import { useGLTF } from "@react-three/drei/native";
import { Canvas, useFrame } from "@react-three/fiber/native";
import { useEffect, useMemo, useRef } from "react";
import { PanResponder, View } from "react-native";
import * as THREE from "three";
import type { GLTF } from "three-stdlib";
const skeletonAsset = require("../../../assets/models/human-skeleton-mobile_v2.glb");

export type ZoneKey = "sup" | "ax" | "inf";

type Props = {
  activeZone: ZoneKey;
  accentColor: string;
  interactive?: boolean;
  framing?: "small" | "normal";
  selectedBoneId?: string;
  isolateSelection?: boolean;
};

const DEFAULT_COLOR = "#9A9A9A";

/**
 * Small correction so the skeleton faces more to the front.
 * If it still looks left/right, adjust this a little:
 * try -0.15 / -0.25 / 0.15
 */
const FRONT_ROTATION_Y = -0.15;

const UPPER_BONES = new Set([
  "human_clavicle_bone_collarbone_01_001",
  "human_clavicle_bone_collarbone_01_002",
  "human_scapula_bone_003",
  "human_scapula_bone_004",
  "human_humerus_01_001",
  "human_humerus_01_002",
  "human_radial_bone_001",
  "human_radial_bone_002",
  "human_ulna_bone_01_001",
  "human_ulna_bone_01_002",
  "human_hand_bones_anatomy_01_low001",
  "human_hand_bones_anatomy_01_low002",
]);

const LOWER_BONES = new Set([
  "pelvis_male_01_001",
  "pelvis_male_02_001",
  "pubic_cone",
  "human_femur_01_001",
  "human_femur_01_002",
  "human_patella_bone_kneecap_01_001",
  "human_patella_bone_kneecap_01_002",
  "tibia_bone_01_001",
  "tibia_bone_01_002",
  "human_fibula_bone_01_002",
  "human_fibula_bone_01_003",
  "human_feet_bones_001",
  "human_feet_bones_002",
  "human_feet_bones_fingers_001",
  "human_feet_bones_fingers_002",
]);

const AXIAL_BONES = new Set([
  "human_skull",
  "human_jaw",
  "upper_teeth",
  "lower_teeth",
  "spinal_bones",
  "spinal_disks",
  "neck_discs_001",
  "ribcage_001",
  "ribs_connection",
  "spleen_001", // Sternum geometry with incorrect GLB mesh name
]);

const BONE_MESH_NAMES: Record<string, string[]> = {
  clavicule: [
    "human_clavicle_bone_collarbone_01_001",
    "human_clavicle_bone_collarbone_01_002",
  ],
  scapula: ["human_scapula_bone_003", "human_scapula_bone_004"],
  humerus: ["human_humerus_01_001", "human_humerus_01_002"],
  radius: ["human_radial_bone_001", "human_radial_bone_002"],
  ulna: ["human_ulna_bone_01_001", "human_ulna_bone_01_002"],
  carpe: [
    "human_hand_bones_anatomy_01_low001",
    "human_hand_bones_anatomy_01_low002",
  ],
  crane: ["human_skull", "human_jaw", "upper_teeth", "lower_teeth"],
  rachis: ["spinal_bones", "spinal_disks", "neck_discs_001"],
  thorax: ["ribcage_001", "ribs_connection", "spleen_001"],
  bassin: ["pelvis_male_01_001", "pelvis_male_02_001", "pubic_cone"],
  femur: ["human_femur_01_001", "human_femur_01_002"],
  "tibia-fibula": [
    "tibia_bone_01_001",
    "tibia_bone_01_002",
    "human_fibula_bone_01_002",
    "human_fibula_bone_01_003",
  ],
};

function isSelectedBone(meshName: string, selectedBoneId?: string): boolean {
  if (!selectedBoneId) return false;

  const names = BONE_MESH_NAMES[selectedBoneId];

  return names?.includes(meshName.toLowerCase()) ?? false;
}

function getBoneZone(object: THREE.Object3D): ZoneKey | null {
  let current: THREE.Object3D | null = object;

  while (current) {
    const name = current.name.toLowerCase();

    if (
      name.includes("sternum") ||
      name.includes("manubrium") ||
      name.includes("xiphoid") ||
      name.includes("xiphoide")
    ) {
      return "ax";
    }

    if (UPPER_BONES.has(name)) return "sup";
    if (LOWER_BONES.has(name)) return "inf";
    if (AXIAL_BONES.has(name)) return "ax";

    current = current.parent;
  }

  return null;
}

function RealSkeleton({
  activeZone,
  accentColor,
  rotationY,
  selectedBoneId,
  isolateSelection,
}: {
  activeZone: ZoneKey;
  accentColor: string;
  rotationY: React.MutableRefObject<number>;
  selectedBoneId?: string;
  isolateSelection?: boolean;
}) {
  const { scene } = useGLTF(skeletonAsset as unknown as string) as GLTF;
  const groupRef = useRef<THREE.Group>(null);

  const model = useMemo(() => {
    const clone = scene.clone(true);

    console.log("========== ALL SKELETON MESHES ==========");

    const meshNames: string[] = [];

    clone.traverse((object) => {
      if ((object as THREE.Mesh).isMesh) {
        meshNames.push(object.name || "(unnamed)");
      }
    });

    console.log("TOTAL MESHES:", meshNames.length);
    console.log(JSON.stringify(meshNames, null, 2));

    console.log("========================================");

    clone.traverse((object) => {
      if (!(object as THREE.Mesh).isMesh) return;

      const mesh = object as THREE.Mesh;

      mesh.material = new THREE.MeshStandardMaterial({
        color: DEFAULT_COLOR,
        roughness: 0.75,
        metalness: 0,
      });

      mesh.castShadow = false;
      mesh.receiveShadow = false;
      mesh.frustumCulled = false;
    });

    const wrapper = new THREE.Group();
    wrapper.add(clone);

    const box = new THREE.Box3().setFromObject(wrapper);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const maxDimension = Math.max(size.x, size.y, size.z);
    const SKELETON_SIZE = 3.5;

    const scale = maxDimension > 0 ? SKELETON_SIZE / maxDimension : 1;

    wrapper.scale.setScalar(scale);

    // Center model

    wrapper.position.set(
      -center.x * scale,
      -center.y * scale + 0.05,
      -center.z * scale,
    );

    return wrapper;
  }, [scene]);

  useEffect(() => {
    model.traverse((object) => {
      if (!(object as THREE.Mesh).isMesh) return;

      const mesh = object as THREE.Mesh;
      const material = mesh.material as THREE.MeshStandardMaterial;

      const name = mesh.name.toLowerCase();
      const zone = getBoneZone(mesh);

      const hasSelection = Boolean(selectedBoneId);
      const isSelected = isSelectedBone(name, selectedBoneId);

      // Sans os sélectionné : coloration de la zone entière.
      // Avec sélection : coloration uniquement des os concernés.
      const shouldHighlight =
        activeZone === "ax"
          ? zone === "ax"
          : hasSelection
            ? isSelected
            : zone === activeZone;

      material.color.set(shouldHighlight ? accentColor : DEFAULT_COLOR);

      // Mode isolation : les autres os deviennent discrets.
      material.transparent =
        Boolean(isolateSelection) && hasSelection && !isSelected;

      material.opacity = material.transparent ? 0.15 : 1;
      material.depthWrite = !material.transparent;
      material.needsUpdate = true;
    });
  }, [model, activeZone, accentColor, selectedBoneId, isolateSelection]);

  useFrame(() => {
    if (!groupRef.current) return;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      rotationY.current,
      0.12,
    );
  });

  return (
    <group ref={groupRef} rotation={[0, FRONT_ROTATION_Y, 0]}>
      <primitive object={model} dispose={null} />
    </group>
  );
}

export function LearningSkeletonViewer({
  activeZone,
  accentColor,
  interactive = true,
  framing = "small",
  selectedBoneId,
  isolateSelection = false,
}: Props) {
  const baseRotation = FRONT_ROTATION_Y;
  const rotationY = useRef(baseRotation);
  const startRotationY = useRef(baseRotation);

  const cameraZ = framing === "small" ? 5.2 : 4.7;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => interactive,
        onMoveShouldSetPanResponder: (_, gestureState) =>
          interactive && Math.abs(gestureState.dx) > 4,
        onPanResponderGrant: () => {
          startRotationY.current = rotationY.current;
        },
        onPanResponderMove: (_, gestureState) => {
          rotationY.current = startRotationY.current + gestureState.dx * 0.01;
        },
      }),
    [interactive],
  );

  return (
    <View
      style={{ flex: 1, width: "100%" }}
      {...(interactive ? panResponder.panHandlers : {})}
    >
      <Canvas
        style={{ flex: 1 }}
        camera={{
          position: [0, 0, cameraZ],
          fov: 38,
        }}
      >
        <ambientLight intensity={1.6} />

        <directionalLight position={[3, 4, 5]} intensity={1.4} />
        <directionalLight position={[-3, 2, 3]} intensity={0.8} />

        <RealSkeleton
          activeZone={activeZone}
          accentColor={accentColor}
          rotationY={rotationY}
          selectedBoneId={selectedBoneId}
          isolateSelection={isolateSelection}
        />
      </Canvas>
    </View>
  );
}
