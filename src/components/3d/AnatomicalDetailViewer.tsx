import { Canvas, useFrame, useThree } from "@react-three/fiber/native";

import { useGLTF } from "@react-three/drei/native";

import { Suspense, useMemo, useRef, useState } from "react";

import { Pressable, StyleSheet, Text, View } from "react-native";

import * as THREE from "three";

import { useSkeletonGestures } from "../../hooks/useSkeletonGestures";

/* ============================================================
   TYPES
   ============================================================ */

type Rotation = {
  x: number;
  y: number;
};

export type AnatomicalLandmark = {
  numero: number;
  id: string;
  nom: string;
  description: string;

  x: number;
  y: number;

  visible: boolean;
};

type Props = {
  modelAsset: number;

  initialRotation?: {
    x: number;
    y: number;
  };

  onLandmarkPress?: (landmark: AnatomicalLandmark) => void;
};

/* ============================================================
   3D SCENE
   ============================================================ */

function AnatomicalScene({
  modelAsset,
  rotationRef,
  zoomRef,
  onMarkersChange,
}: {
  modelAsset: number;

  rotationRef: React.MutableRefObject<Rotation>;

  zoomRef: React.MutableRefObject<number>;

  onMarkersChange: (markers: AnatomicalLandmark[]) => void;
}) {
  const gltf = useGLTF(modelAsset);

  const groupRef = useRef<THREE.Group>(null);

  const { camera, size } = useThree();

  const frameRef = useRef(0);

  /* ----------------------------------------------------------
     CLONE MODEL
     ---------------------------------------------------------- */

  const scene = useMemo(() => {
    return gltf.scene.clone(true);
  }, [gltf.scene]);

  useMemo(() => {
    console.log("========== DETAIL MODEL MATERIALS ==========");

    scene.traverse((object: any) => {
  if (!object.isMesh) {
    return;
  }

  const materials = Array.isArray(object.material)
    ? object.material
    : [object.material];

      materials.forEach((material: any, index) => {
        console.log("MESH:", object.name);
        console.log("MATERIAL:", material?.name);
        console.log("TYPE:", material?.type);

        console.log("COLOR:", material?.color?.getHexString?.());

        console.log("BASE COLOR MAP:", material?.map ? "YES" : "NONE");

        console.log("NORMAL MAP:", material?.normalMap ? "YES" : "NONE");

        console.log("ROUGHNESS:", material?.roughness);

        console.log("ROUGHNESS MAP:", material?.roughnessMap ? "YES" : "NONE");

        console.log("AO MAP:", material?.aoMap ? "YES" : "NONE");

        console.log("METALNESS:", material?.metalness);

        console.log("-----------------------------");
      });
    });

    return null;
  }, [scene]);
  /* ----------------------------------------------------------
     FIND LANDMARKS

     Any GLB can work as long as its nodes contain:

     userData.numero
     userData.nom
     userData.description
     ---------------------------------------------------------- */

  const landmarks = useMemo(() => {
    const result: {
      numero: number;
      id: string;
      nom: string;
      description: string;

      normal: THREE.Vector3 | null;

      object: THREE.Object3D;
    }[] = [];

    scene.traverse((object) => {
      const data = object.userData;

      if (typeof data?.numero !== "number") {
        return;
      }

      const normal =
        Array.isArray(data.normale) && data.normale.length >= 3
          ? new THREE.Vector3(
              data.normale[0],
              data.normale[1],
              data.normale[2],
            ).normalize()
          : null;

      result.push({
        numero: data.numero,

        id: data.id ?? `repere_${data.numero}`,

        nom: data.nom ?? `Repère ${data.numero}`,

        description: data.description ?? "",

        normal,

        object,
      });
    });

    result.sort((a, b) => a.numero - b.numero);

    console.log(
      "ANATOMICAL LANDMARKS:",
      result.map((landmark) => `${landmark.numero} - ${landmark.nom}`),
    );

    return result;
  }, [scene]);

  /* ----------------------------------------------------------
     CENTER + NORMALIZE MODEL
     ---------------------------------------------------------- */

  const modelData = useMemo(() => {
    scene.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(scene);

    const center = box.getCenter(new THREE.Vector3());

    const dimensions = box.getSize(new THREE.Vector3());

    const maxDimension = Math.max(dimensions.x, dimensions.y, dimensions.z);

    /*
     * Every detailed bone gets normalized
     * to approximately the same viewer size.
     */

    const targetSize = 3.4;
    const scale = maxDimension > 0 ? targetSize / maxDimension : 1;

    return {
      center,
      scale,
    };
  }, [scene]);

  const worldPosition = useMemo(() => new THREE.Vector3(), []);
  const worldNormal = useMemo(() => new THREE.Vector3(), []);

  const cameraDirection = useMemo(() => new THREE.Vector3(), []);

  const normalMatrix = useMemo(() => new THREE.Matrix3(), []);

  const projectedPosition = useMemo(() => new THREE.Vector3(), []);

  /* ----------------------------------------------------------
     ANIMATION + 3D -> SCREEN
     ---------------------------------------------------------- */

  useFrame(() => {
    const group = groupRef.current;

    if (!group) {
      return;
    }

    /* Rotation */

    group.rotation.x = rotationRef.current.x;

    group.rotation.y = rotationRef.current.y;

    /* Zoom */

    group.scale.setScalar(modelData.scale * zoomRef.current);

    group.updateWorldMatrix(true, true);

    /*
     * Don't update React labels
     * on every single frame.
     */

    frameRef.current += 1;

    if (frameRef.current % 3 !== 0) {
      return;
    }

    const screenMarkers = landmarks.map((landmark) => {
      landmark.object.getWorldPosition(worldPosition);
      let facingCamera = true;

      if (landmark.normal) {
        /*
         * Convert the landmark's local normal
         * to the current rotated model orientation.
         */
        normalMatrix.getNormalMatrix(landmark.object.matrixWorld);

        worldNormal
          .copy(landmark.normal)
          .applyMatrix3(normalMatrix)
          .normalize();

        /*
         * Direction from landmark toward camera.
         */
        cameraDirection.copy(camera.position).sub(worldPosition).normalize();

        /*
         * Positive dot product = this anatomical
         * surface is facing the camera.
         *
         * 0.15 gives us a small tolerance near edges.
         */
        facingCamera = worldNormal.dot(cameraDirection) > 0.15;
      }

      projectedPosition.copy(worldPosition).project(camera);

      const x = (projectedPosition.x * 0.5 + 0.5) * size.width;

      const y = (-projectedPosition.y * 0.5 + 0.5) * size.height;

      const visible =
        facingCamera &&
        projectedPosition.z >= -1 &&
        projectedPosition.z <= 1 &&
        x >= -30 &&
        x <= size.width + 30 &&
        y >= -30 &&
        y <= size.height + 30;

      return {
        numero: landmark.numero,

        id: landmark.id,

        nom: landmark.nom,

        description: landmark.description,

        x,
        y,
        visible,
      };
    });

    onMarkersChange(screenMarkers);
  });

  return (
    <group
      ref={groupRef}
      position={[
        -modelData.center.x * modelData.scale,

        -modelData.center.y * modelData.scale,

        -modelData.center.z * modelData.scale,
      ]}
    >
      <primitive object={scene} />
    </group>
  );
}

/* ============================================================
   VIEWER
   ============================================================ */

export default function AnatomicalDetailViewer({
  modelAsset,

  initialRotation = {
    x: 0,
    y: 0,
  },

  onLandmarkPress,
}: Props) {
  const rotationRef = useRef<Rotation>({
    ...initialRotation,
  });

  const zoomRef = useRef(1);

  const zoomStartRef = useRef(1);

  const [markers, setMarkers] = useState<AnatomicalLandmark[]>([]);

  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  /* ----------------------------------------------------------
     GESTURES
     ---------------------------------------------------------- */

  const handlers = useSkeletonGestures({
    onRotate: (dx, dy) => {
      rotationRef.current.y += dx * 0.015;

      rotationRef.current.x = THREE.MathUtils.clamp(
        rotationRef.current.x + dy * 0.015,

        -Math.PI / 2,

        Math.PI / 2,
      );
    },

    onPinchStart: () => {
      zoomStartRef.current = zoomRef.current;
    },

    onPinch: (scale) => {
      zoomRef.current = THREE.MathUtils.clamp(
        zoomStartRef.current * Math.pow(scale, 1.2),

        0.6,

        3,
      );
    },
  });

  return (
    <View style={styles.container}>
      {/* ========================================
          THREE.JS
          ======================================== */}

      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <Canvas
          camera={{
            position: [0, 0, 4],
            fov: 38,
            near: 0.01,
            far: 100,
          }}
          gl={{
            antialias: false,
            alpha: false,
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(0xf5f6f7, 1);

            gl.outputColorSpace = THREE.SRGBColorSpace;

            gl.toneMapping = THREE.ACESFilmicToneMapping;

            gl.toneMappingExposure = 1;
          }}
        >
          <ambientLight intensity={0.65} />

          <directionalLight position={[4, 5, 6]} intensity={1.6} />

          <directionalLight position={[-4, 2, 3]} intensity={0.55} />

          <directionalLight position={[0, -3, 2]} intensity={0.3} />

          <Suspense fallback={null}>
            <AnatomicalScene
              modelAsset={modelAsset}
              rotationRef={rotationRef}
              zoomRef={zoomRef}
              onMarkersChange={setMarkers}
            />
          </Suspense>
        </Canvas>
      </View>

      {/* ========================================
          GESTURES
          ======================================== */}

      <View collapsable={false} style={StyleSheet.absoluteFill} {...handlers} />

      {/* ========================================
          NUMBERS + NAMES
          ======================================== */}

      <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        {markers
          .filter((marker) => marker.visible)
          .map((marker) => {
            const selected = selectedNumber === marker.numero;

            return (
              <Pressable
                key={marker.id}
                onPress={() => {
                  setSelectedNumber(marker.numero);

                  onLandmarkPress?.(marker);
                }}
                style={[
                  styles.marker,
                  {
                    left: marker.x - 13,

                    top: marker.y - 13,
                  },
                ]}
              >
                <View
                  style={[
                    styles.numberCircle,

                    selected && styles.numberCircleSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.numberText,

                      selected && styles.numberTextSelected,
                    ]}
                  >
                    {marker.numero}
                  </Text>
                </View>
              </Pressable>
            );
          })}
      </View>

      {/* ========================================
          RESET
          ======================================== */}

      <Pressable
        style={styles.resetButton}
        onPress={() => {
          rotationRef.current = {
            ...initialRotation,
          };

          zoomRef.current = 1;
        }}
      >
        <Text style={styles.resetText}>Réinitialiser</Text>
      </Pressable>
    </View>
  );
}

/* ============================================================
   STYLES
   ============================================================ */

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#F5F6F7",
  },

  marker: {
    position: "absolute",

    flexDirection: "row",

    alignItems: "center",
  },

  numberCircle: {
    width: 26,
    height: 26,

    borderRadius: 13,

    backgroundColor: "#27323A",

    borderWidth: 2,
    borderColor: "#FFFFFF",

    alignItems: "center",
    justifyContent: "center",

    zIndex: 2,
  },

  numberCircleSelected: {
    backgroundColor: "#FFD700",

    borderColor: "#9B7300",
  },

  numberText: {
    color: "#FFFFFF",

    fontSize: 10,

    fontWeight: "800",
  },

  numberTextSelected: {
    color: "#27323A",
  },

  resetButton: {
    position: "absolute",

    right: 14,

    bottom: 14,

    paddingHorizontal: 14,

    paddingVertical: 8,

    borderRadius: 18,

    backgroundColor: "rgba(39,50,58,0.90)",
  },

  resetText: {
    color: "#FFFFFF",

    fontSize: 12,

    fontWeight: "700",
  },
});
