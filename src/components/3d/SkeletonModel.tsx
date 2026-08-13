import { useGLTF } from "@react-three/drei/native";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

// Modèle utilisé dans la Home
const homeSkeletonAsset = require(
  "../../../assets/models/human-skeleton-mobile_v2.glb"
);

// Nouveau modèle utilisé dans Mode Libre
const modeLibreSkeletonAsset = require(
  "../../../assets/models/overview-skeleton-mobile.glb"
);

type Props = {
  onLoaded?: () => void;

  // Par défaut = home pour ne rien casser
  variant?: "home" | "modeLibre";
};

export default function SkeletonModel({
  onLoaded,
  variant = "home",
}: Props) {
  // Choisit le bon fichier GLB
  const skeletonAsset =
    variant === "modeLibre"
      ? modeLibreSkeletonAsset
      : homeSkeletonAsset;

  const { scene } = useGLTF(skeletonAsset);

  const model = useMemo(() => {
    const clone = scene.clone(true);

    const grayMaterial = new THREE.MeshStandardMaterial({
      color: "#9A9A9A",
      roughness: 0.75,
      metalness: 0,
    });

    clone.traverse((object) => {
      if ((object as THREE.Mesh).isMesh) {
        const mesh = object as THREE.Mesh;

        mesh.material = grayMaterial.clone();

        mesh.castShadow = false;
        mesh.receiveShadow = false;
        mesh.frustumCulled = false;
      }
    });

    const box = new THREE.Box3().setFromObject(clone);

    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    box.getSize(size);
    box.getCenter(center);

    const maxDimension = Math.max(
      size.x,
      size.y,
      size.z
    );

    const scale =
      maxDimension > 0
        ? 3 / maxDimension
        : 1;

    clone.scale.setScalar(scale);

    clone.position.set(
      -center.x * scale,
      -center.y * scale,
      -center.z * scale
    );

    return clone;
  }, [scene]);

  useEffect(() => {
    onLoaded?.();
  }, [model, onLoaded]);

  return <primitive object={model} />;
}