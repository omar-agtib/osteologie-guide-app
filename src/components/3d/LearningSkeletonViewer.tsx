import { useGLTF } from "@react-three/drei/native";
import { Canvas, useFrame } from "@react-three/fiber/native";
import { useEffect, useMemo, useRef } from "react";
import { PanResponder, View } from "react-native";
import * as THREE from "three";

const skeletonAsset = require("../../../assets/models/human-skeleton-mobile_v2.glb");

export type ZoneKey = "sup" | "ax" | "inf";

type Props = {
  activeZone: ZoneKey;
  accentColor: string;
  interactive?: boolean;
  framing?: "small" | "normal";
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
]);

function getBoneZone(object: THREE.Object3D): ZoneKey | null {
  const meshName = (object.name || "").toLowerCase();

  if (UPPER_BONES.has(meshName)) return "sup";
  if (LOWER_BONES.has(meshName)) return "inf";
  if (AXIAL_BONES.has(meshName)) return "ax";

  // keep anything unknown gray
  return null;
}
function RealSkeleton({
  activeZone,
  accentColor,
  rotationY,
}: {
  activeZone: ZoneKey;
  accentColor: string;
  rotationY: React.MutableRefObject<number>;
}) {
  const { scene } = useGLTF(skeletonAsset);
  const groupRef = useRef<THREE.Group>(null);



  const model = useMemo(() => {
    const clone = scene.clone(true);

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
    const scale = maxDimension > 0 ? 3 / maxDimension : 1;

    wrapper.scale.setScalar(scale);

    // Center model
    wrapper.position.set(
      -center.x * scale,
      -center.y * scale - 0.15, // move slightly down to visually center it
      -center.z * scale,
    );

    return wrapper;
  }, [scene]);

  useEffect(() => {
    model.traverse((object) => {
      if (!(object as THREE.Mesh).isMesh) return;

      const mesh = object as THREE.Mesh;
      const material = mesh.material as THREE.MeshStandardMaterial;

      const zone = getBoneZone(mesh);

      if (zone === activeZone) {
        material.color.set(accentColor);
      } else {
        material.color.set(DEFAULT_COLOR);
      }

      material.needsUpdate = true;
    });
  }, [model, activeZone, accentColor]);

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
        />
      </Canvas>
    </View>
  );
}
