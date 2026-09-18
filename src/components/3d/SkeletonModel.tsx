import { useGLTF } from "@react-three/drei/native";
import { useFrame } from "@react-three/fiber/native";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const homeAsset = require("../../../assets/models/human-skeleton-mobile_v2.glb");
type Props = { asset?: number; onLoaded?: () => void };

export default function SkeletonModel({ asset = homeAsset, onLoaded }: Props) {
  const { scene } = useGLTF(asset);
  const model = useMemo(() => {
    const clone = scene.clone(true);
    const material = new THREE.MeshStandardMaterial({
      color: "#9A9A9A",
      roughness: 0.75,
      metalness: 0,
    });
    clone.traverse((object) => {
      if ((object as THREE.Mesh).isMesh) {
        const mesh = object as THREE.Mesh;
        mesh.material = material;
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        mesh.frustumCulled = false;
      }
    });
    // Normalize a wrapper so imported root transformations remain intact.
    const wrapper = new THREE.Group();
    wrapper.add(clone);
    const box = new THREE.Box3().setFromObject(wrapper);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z);
    const scale = maxDimension > 0 ? 3 / maxDimension : 1;
    wrapper.scale.setScalar(scale);
    wrapper.position.copy(center).multiplyScalar(-scale);
    return wrapper;
  }, [scene]);

  const ready = useRef({ model, frames: 0, notified: false });
  useFrame(() => {
    if (ready.current.model !== model)
      ready.current = { model, frames: 0, notified: false };
    ready.current.frames += 1;
    // Suspense has resolved and at least one render frame has run.
    if (!ready.current.notified && ready.current.frames >= 2) {
      ready.current.notified = true;
      onLoaded?.();
    }
  });
  // Geometries come from the shared GLTF cache; do not dispose them on reset.
  return <primitive object={model} dispose={null} />;
}
