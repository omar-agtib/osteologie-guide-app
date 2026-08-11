import { useGLTF } from "@react-three/drei/native";

import { useEffect, useMemo } from "react";

import * as THREE from "three";

const skeletonAsset = require("../../../assets/models/human-skeleton-mobile_v2.glb");

type Props = {
  onLoaded?: () => void;
};

export default function SkeletonModel({ onLoaded }: Props) {
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

    const maxDimension = Math.max(size.x, size.y, size.z);

    const scale = maxDimension > 0 ? 3 / maxDimension : 1;

    clone.scale.setScalar(scale);

    clone.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

    return clone;
  }, [scene]);

  /*
   * useGLTF utilise Suspense.
   * Donc si ce composant arrive ici,
   * le GLB est déjà disponible.
   */
  useEffect(() => {
    onLoaded?.();
  }, [model, onLoaded]);

  return <primitive object={model} />;
}
