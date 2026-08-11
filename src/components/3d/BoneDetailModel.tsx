import { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber/native";
import * as THREE from "three";

export default function BoneDetailModel({
  mesh,
}: {
  mesh: THREE.Mesh;
}) {
  const { camera } = useThree();

  const standaloneBone = useMemo(() => {
    /*
     * Important :
     * mettre à jour toutes les transformations
     * provenant du squelette.
     */
    mesh.updateWorldMatrix(true, false);

    /*
     * On clone uniquement la géométrie de l'os.
     */
    const geometry = mesh.geometry.clone();

    /*
     * On applique la transformation WORLD du mesh.
     *
     * Cela conserve :
     * - rotation
     * - scale
     * - position
     * provenant du squelette original.
     */
    geometry.applyMatrix4(mesh.matrixWorld);

    /*
     * Calcul du centre de l'os.
     */
    geometry.computeBoundingBox();

    const box = geometry.boundingBox;

    if (box) {
      const center = new THREE.Vector3();

      box.getCenter(center);

      /*
       * On place le centre réel de l'os
       * exactement à (0, 0, 0).
       */
      geometry.translate(
        -center.x,
        -center.y,
        -center.z,
      );
    }

    /*
     * On donne volontairement un nouveau matériau.
     *
     * Comme ça la popup n'utilise PAS
     * le matériau jaune de la sélection.
     */
    const material =
      new THREE.MeshStandardMaterial({
        color: "#B8B8B8",
        roughness: 0.65,
        metalness: 0,
      });

    const bone =
      new THREE.Mesh(
        geometry,
        material,
      );

    bone.position.set(0, 0, 0);

    return bone;
  }, [mesh]);

  /*
   * Ajustement automatique de la caméra
   * selon la taille de l'os.
   */
  useEffect(() => {
    const box =
      new THREE.Box3().setFromObject(
        standaloneBone,
      );

    const sphere =
      box.getBoundingSphere(
        new THREE.Sphere(),
      );

    const perspectiveCamera =
      camera as THREE.PerspectiveCamera;

    const fov =
      THREE.MathUtils.degToRad(
        perspectiveCamera.fov,
      );

    /*
     * Distance permettant d'afficher
     * correctement l'os entier.
     */
    let distance =
      sphere.radius /
      Math.tan(fov / 2);

    distance *= 1.8;

    /*
     * Sécurité pour les petits os.
     */
    distance = Math.max(
      distance,
      0.5,
    );

    camera.position.set(
      0,
      0,
      distance,
    );

    camera.lookAt(0, 0, 0);

    perspectiveCamera.near =
      Math.max(
        distance / 100,
        0.001,
      );

    perspectiveCamera.far =
      distance * 100;

    perspectiveCamera.updateProjectionMatrix();
    perspectiveCamera.updateMatrixWorld();
  }, [standaloneBone, camera]);

  return (
    <primitive
      object={standaloneBone}
    />
  );
}