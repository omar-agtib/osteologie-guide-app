import { useGLTF } from "@react-three/drei/native";
import { useMemo } from "react";
import * as THREE from "three";

const skeletonAsset = require("../../../assets/models/human-skeleton-mobile_v2.glb");

export default function SkeletonModel() {
  const { scene } = useGLTF(skeletonAsset);

  const model = useMemo(() => {
    // Important:
    // Home + Mode Libre peuvent utiliser le même GLB.
    // On clone la scène pour éviter qu'ils partagent les mêmes meshes/materials.
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

    // -------------------------
    // Center + normalize model
    // -------------------------

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

  return <primitive object={model} />;
}
