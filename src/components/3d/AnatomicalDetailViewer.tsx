import { Canvas, useFrame, useThree } from "@react-three/fiber/native";
import { Asset } from "expo-asset";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";

import * as FileSystem from "expo-file-system/legacy";
import type {
  DetailModelAxis,
  DetailModelFeatures,
  DetailModelView,
} from "../../data/detailModels";
import { useSkeletonGestures } from "../../hooks/useSkeletonGestures";
import { SkeletonLoader } from "../ui/SkeletonLoader";
import { LinearGradient } from "expo-linear-gradient";
/* ============================================================
   TYPES
   ============================================================ */

export type AnatomicalLandmark = {
  numero: number;
  id: string;
  nom: string;
  description: string;

  zone_t?: [number, number];

  zone_bit?: number;

  camera?: [number, number, number];

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

  longitudinalAxis?: DetailModelAxis;

  views?: DetailModelView[];

  features?: DetailModelFeatures;

  onLandmarkPress?: (landmark: AnatomicalLandmark) => void;
  onInteractionChange?: (interacting: boolean) => void;
};

const DEFAULT_ZOOM = 0.5;

type OrientationLabels = {
  top: string;
  bottom: string;
  left: string;
  right: string;
};



/* ============================================================
   3D SCENE
   ============================================================ */

   function CameraFollowingLight() {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const { camera } = useThree();

  useFrame(() => {
    if (!lightRef.current) return;

    lightRef.current.position.copy(camera.position);
    lightRef.current.target.position.set(0, 0, 0);
    lightRef.current.target.updateMatrixWorld();
  });

  return (
    <directionalLight
      ref={lightRef}
      intensity={1.8}
      color="#FFFFFF"
    />
  );
}

function AnatomicalScene({
  loadedScene,
  rotationRef,
  zoomRef,
  onMarkersChange,
  onLoaded,
  selectedNumber,
  longitudinalAxis,
  requestedViewRef,
  mirrored,
  onOrientationChange,
}: {
  loadedScene: THREE.Group;

  rotationRef: React.MutableRefObject<THREE.Quaternion>;

  zoomRef: React.MutableRefObject<number>;

  onMarkersChange: (markers: AnatomicalLandmark[]) => void;

  onLoaded: () => void;

  selectedNumber: number | null;
  longitudinalAxis: DetailModelAxis;
  requestedViewRef: React.MutableRefObject<DetailModelView | null>;
  mirrored: boolean;
  onOrientationChange: (labels: OrientationLabels) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const lastRequestedViewRef = useRef<string | null>(null);

  const { camera, size } = useThree();

  const frameRef = useRef(0);

  /* ----------------------------------------------------------
     CLONE MODEL
     ---------------------------------------------------------- */

  const scene = useMemo(() => {
    const cloned = loadedScene.clone(true);

    /*
     * Keep the detailed model reliable on native GL.
     * We do not replace its materials because the GLB
     * contains its own vertex colors/material configuration.
     */
    cloned.traverse((object: any) => {
      if (!object.isMesh) {
        return;
      }

      object.frustumCulled = false;

      // Each detailed model may contain vertex colors.
      // Clone the geometry so highlighting never modifies
      // the original GLB geometry.
      object.geometry = object.geometry.clone();

      const colorAttribute = object.geometry.getAttribute("color");

      if (colorAttribute) {
        const originalColors = new Float32Array(colorAttribute.count * 3);

        for (let i = 0; i < colorAttribute.count; i++) {
          originalColors[i * 3] = colorAttribute.getX(i);

          originalColors[i * 3 + 1] = colorAttribute.getY(i);

          originalColors[i * 3 + 2] = colorAttribute.getZ(i);
        }

        // Keep an untouched copy.
        object.userData.originalVertexColors = originalColors;

        // Use a Float32 color buffer for runtime highlighting.
        object.geometry.setAttribute(
          "color",
          new THREE.BufferAttribute(originalColors.slice(), 3),
        );
      }

      // Save the GLB's original vertex colors.
      // We use these to restore the bone when another
      // landmark is selected.

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      materials.forEach((material: any) => {
        if (!material) {
          return;
        }

        material.transparent = false;
        material.opacity = 1;
        material.depthWrite = true;
        material.depthTest = true;
        material.needsUpdate = true;
      });
    });

    return cloned;
  }, [loadedScene]);

  /* ----------------------------------------------------------
     MODEL IS READY
     ---------------------------------------------------------- */

  useEffect(() => {
    console.log("DETAIL SCENE: model ready inside Canvas");

    onLoaded();
  }, [scene, onLoaded]);

  /* ----------------------------------------------------------
     FIND LANDMARKS

     Any GLB can work as long as its nodes contain:

     userData.numero
     userData.nom
     userData.description
     userData.normale
     ---------------------------------------------------------- */

  const landmarks = useMemo(() => {
    const result: {
      numero: number;
      id: string;
      nom: string;
      description: string;

      zone_t?: [number, number];

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

  zone_t:
    Array.isArray(data.zone_t) && data.zone_t.length >= 2
      ? [Number(data.zone_t[0]), Number(data.zone_t[1])]
      : undefined,

  zone_bit:
    typeof data.zone_bit === "number"
      ? data.zone_bit
      : undefined,

  camera:
    Array.isArray(data.camera) && data.camera.length >= 3
      ? [
          Number(data.camera[0]),
          Number(data.camera[1]),
          Number(data.camera[2]),
        ]
      : undefined,

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

  const selectedLandmark = useMemo(() => {
    if (selectedNumber === null) {
      return null;
    }

    return (
      landmarks.find((landmark) => landmark.numero === selectedNumber) ?? null
    );
  }, [landmarks, selectedNumber]);

  const selectedZone = selectedLandmark?.zone_t ?? null;

const selectedZoneBit =
  selectedLandmark?.zone_bit ?? null;

  // ======================================================
  // LONGITUDINAL RANGE OF THE DETAILED MODEL
  // ======================================================

  const getAxisValue = useCallback(
    (attribute: THREE.BufferAttribute, index: number) => {
      switch (longitudinalAxis) {
        case "y":
          return attribute.getY(index);

        case "z":
          return attribute.getZ(index);

        case "x":
        default:
          return attribute.getX(index);
      }
    },
    [longitudinalAxis],
  );

  const longitudinalRange = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;

    scene.traverse((object: any) => {
      if (!object.isMesh) {
        return;
      }

      const position = object.geometry?.getAttribute("position");

      if (!position) {
        return;
      }

      for (let i = 0; i < position.count; i++) {
        const value = getAxisValue(position as THREE.BufferAttribute, i);

        min = Math.min(min, value);
        max = Math.max(max, value);
      }
    });

    if (!Number.isFinite(min) || !Number.isFinite(max)) {
      return null;
    }

    return {
      min,
      max,
      length: max - min,
    };
  }, [scene, getAxisValue]);

  // ======================================================
  // SELECTED ZONE HIGHLIGHT
  // ======================================================

  useEffect(() => {
  const highlightColor = new THREE.Color("#F2C94C");

  scene.traverse((object: any) => {
    if (!object.isMesh) {
      return;
    }

    const geometry = object.geometry as THREE.BufferGeometry;

    const position = geometry.getAttribute("position");
    const color = geometry.getAttribute("color");

    const zones =
      geometry.getAttribute("_zones") ??
      geometry.getAttribute("_ZONES");

    const originalColors =
      object.userData.originalVertexColors as
        | Float32Array
        | undefined;

    if (!position || !color || !originalColors) {
      return;
    }

    // Restaurer les couleurs originales
    for (let i = 0; i < color.count; i++) {
      color.setXYZ(
        i,
        originalColors[i * 3],
        originalColors[i * 3 + 1],
        originalColors[i * 3 + 2],
      );
    }

    /*
     * ==============================================
     * SYSTEME 1 : zone_bit + _ZONES
     * Scapula, etc.
     * ==============================================
     */

    if (
      selectedZoneBit !== null &&
      zones
    ) {
      const mask = 1 << selectedZoneBit;

      for (let i = 0; i < position.count; i++) {
        const vertexZones = zones.getX(i);

        if ((vertexZones & mask) === 0) {
          continue;
        }

        const originalColor = new THREE.Color(
          originalColors[i * 3],
          originalColors[i * 3 + 1],
          originalColors[i * 3 + 2],
        );

        originalColor.lerp(highlightColor, 0.72);

        color.setXYZ(
          i,
          originalColor.r,
          originalColor.g,
          originalColor.b,
        );
      }

      color.needsUpdate = true;

      return;
    }

    /*
     * ==============================================
     * SYSTEME 2 : zone_t
     * Clavicule
     * ==============================================
     */

    if (
      selectedZone &&
      longitudinalRange &&
      longitudinalRange.length > 0
    ) {
      for (let i = 0; i < position.count; i++) {
        const axisValue = getAxisValue(
          position as THREE.BufferAttribute,
          i,
        );

        const t =
          (axisValue - longitudinalRange.min) /
          longitudinalRange.length;

        if (
          t < selectedZone[0] ||
          t > selectedZone[1]
        ) {
          continue;
        }

        const originalColor = new THREE.Color(
          originalColors[i * 3],
          originalColors[i * 3 + 1],
          originalColors[i * 3 + 2],
        );

        originalColor.lerp(
          highlightColor,
          0.72,
        );

        color.setXYZ(
          i,
          originalColor.r,
          originalColor.g,
          originalColor.b,
        );
      }
    }

    color.needsUpdate = true;
  });
}, [
  scene,
  selectedZone,
  selectedZoneBit,
  longitudinalRange,
  getAxisValue,
]);

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

    console.log("DETAIL MODEL DIMENSIONS:", dimensions.toArray());

    console.log("DETAIL MODEL SCALE:", scale);

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


  const inverseModelMatrix = useMemo(() => new THREE.Matrix4(), []);

  const cameraRightWorld = useMemo(() => new THREE.Vector3(), []);

  const cameraUpWorld = useMemo(() => new THREE.Vector3(), []);

  const localRight = useMemo(() => new THREE.Vector3(), []);

  const localLeft = useMemo(() => new THREE.Vector3(), []);

  const localTop = useMemo(() => new THREE.Vector3(), []);

  const localBottom = useMemo(() => new THREE.Vector3(), []);

  const getDirectionName = useCallback((direction: THREE.Vector3) => {
    const x = direction.x;
    const y = direction.y;
    const z = direction.z;

    const absX = Math.abs(x);
    const absY = Math.abs(y);
    const absZ = Math.abs(z);

    const threshold = 0.8;

    if (absX >= absY && absX >= absZ && absX >= threshold) {
      return x > 0 ? "MÉDIAL" : "LATÉRAL";
    }

    if (absY >= absX && absY >= absZ && absY >= threshold) {
      return y > 0 ? "SUPÉRIEUR" : "INFÉRIEUR";
    }

    if (absZ >= absX && absZ >= absY && absZ >= threshold) {
      return z > 0 ? "ANTÉRIEUR" : "POSTÉRIEUR";
    }

    return "";
  }, []);
  /* ----------------------------------------------------------
     ANIMATION + 3D -> SCREEN
     ---------------------------------------------------------- */

  useFrame(() => {
    const group = groupRef.current;

    if (!group) {
      return;
    }

    const requestedView = requestedViewRef.current;

    if (requestedView && requestedView.id !== lastRequestedViewRef.current) {
      lastRequestedViewRef.current = requestedView.id;

      const direction = new THREE.Vector3(
        ...requestedView.cameraDirection,
      ).normalize();

      const up = new THREE.Vector3(...requestedView.cameraUp).normalize();

      const distance = 4;

      if (requestedView.id !== "__reset__") {
        rotationRef.current.identity();
      }

      camera.position.copy(direction.multiplyScalar(distance));

      camera.up.copy(up);

      camera.lookAt(0, 0, 0);

      camera.updateProjectionMatrix();
      camera.updateMatrixWorld(true);
    }

    /* Rotation */

    group.quaternion.copy(rotationRef.current);

    /* Zoom */

    const scale = modelData.scale * zoomRef.current;

    group.scale.set(mirrored ? -scale : scale, scale, scale);

    group.updateWorldMatrix(true, true);

    camera.updateMatrixWorld(true);

    /*
     * Camera screen axes in world coordinates.
     *
     * matrixWorld:
     * column 0 = screen right
     * column 1 = screen up
     */
    cameraRightWorld
      .set(
        camera.matrixWorld.elements[0],
        camera.matrixWorld.elements[1],
        camera.matrixWorld.elements[2],
      )
      .normalize();

    cameraUpWorld
      .set(
        camera.matrixWorld.elements[4],
        camera.matrixWorld.elements[5],
        camera.matrixWorld.elements[6],
      )
      .normalize();

    /*
     * Convert screen directions from world space
     * back into the bone's anatomical/local space.
     *
     * This is the important part.
     */
    inverseModelMatrix.copy(group.matrixWorld).invert();

    localRight.copy(cameraRightWorld).transformDirection(inverseModelMatrix);

    localTop.copy(cameraUpWorld).transformDirection(inverseModelMatrix);

    localLeft.copy(localRight).multiplyScalar(-1);

    localBottom.copy(localTop).multiplyScalar(-1);
   
    /*
     * Don't update React labels
     * on every single frame.
     */

    frameRef.current += 1;

    if (frameRef.current % 3 !== 0) {
      return;
    }

    onOrientationChange({
      right: getDirectionName(localRight),
      left: getDirectionName(localLeft),
      top: getDirectionName(localTop),
      bottom: getDirectionName(localBottom),
    });

    const screenMarkers = landmarks.map((landmark) => {
      landmark.object.getWorldPosition(worldPosition);

      let facingCamera = true;

      if (landmark.normal) {
        /*
         * Convert the landmark's local
         * normal to the current rotated
         * model orientation.
         */

        normalMatrix.getNormalMatrix(landmark.object.matrixWorld);

        worldNormal
          .copy(landmark.normal)
          .applyMatrix3(normalMatrix)
          .normalize();

        /*
         * Direction from landmark
         * toward camera.
         */

        cameraDirection.copy(camera.position).sub(worldPosition).normalize();

        /*
         * Positive dot product means
         * the anatomical surface is
         * facing the camera.
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

        zone_t: landmark.zone_t,

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

        -modelData.center.y * modelData.scale + 0.25,

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
  longitudinalAxis = "x",
  views = [],
  features = {},
  onLandmarkPress,
  onInteractionChange,
}: Props) {
  const rotationRef = useRef(
    new THREE.Quaternion().setFromEuler(
      new THREE.Euler(initialRotation.x, initialRotation.y, 0, "XYZ"),
    ),
  );

  const zoomRef = useRef(DEFAULT_ZOOM);

  const requestedViewRef = useRef<DetailModelView | null>(null);

  const zoomStartRef = useRef(1);

  const [loading, setLoading] = useState(true);

  const [loadedScene, setLoadedScene] = useState<THREE.Group | null>(null);

  const [markers, setMarkers] = useState<AnatomicalLandmark[]>([]);

  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  const [mirrored, setMirrored] = useState(false);

  const [orientationLabels, setOrientationLabels] = useState<OrientationLabels>(
    {
      top: "",
      bottom: "",
      left: "",
      right: "",
    },
  );
  /* ----------------------------------------------------------
     LOAD EXPO ASSET + GLTF
     ---------------------------------------------------------- */

  useEffect(() => {
    let cancelled = false;

    const loadModel = async () => {
      try {
        console.log("DETAIL: resolving asset", modelAsset);

        setLoading(true);
        setLoadedScene(null);
        setMarkers([]);
        setSelectedNumber(null);

        /* -----------------------------------------
         RESOLVE EXPO ASSET
         ----------------------------------------- */

        const asset = Asset.fromModule(modelAsset);

        console.log("DETAIL: asset info", {
          name: asset.name,
          type: asset.type,
          uri: asset.uri,
          localUri: asset.localUri,
        });

        await asset.downloadAsync();

        if (cancelled) {
          return;
        }

        const uri = asset.localUri ?? asset.uri;

        if (!uri) {
          throw new Error("Unable to resolve GLB URI.");
        }

        console.log("DETAIL: asset ready", uri);

        /* -----------------------------------------
         READ GLB INTO MEMORY

         We do this instead of:
         loader.load(file://...)

         because Android/Expo converts that path
         to filesystem.local and returns 404.
         ----------------------------------------- */

        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        if (cancelled) {
          return;
        }

        console.log("DETAIL: GLB read into memory", base64.length);

        /* -----------------------------------------
         BASE64 -> ARRAYBUFFER
         ----------------------------------------- */

        const binaryString = atob(base64);

        const bytes = new Uint8Array(binaryString.length);

        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const arrayBuffer = bytes.buffer;

        console.log("DETAIL: GLB ArrayBuffer ready", arrayBuffer.byteLength);

        /* -----------------------------------------
         PARSE GLB DIRECTLY FROM MEMORY
         ----------------------------------------- */

        const loader = new GLTFLoader();

        loader.parse(
          arrayBuffer,

          "",

          (gltf) => {
            if (cancelled) {
              return;
            }

            console.log("DETAIL: GLTFLoader PARSE SUCCESS", {
              children: gltf.scene.children.length,
            });

            setLoadedScene(gltf.scene);
          },

          (error) => {
            if (cancelled) {
              return;
            }

            console.error("DETAIL: GLTFLoader PARSE ERROR", error);

            setLoading(false);
          },
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error("DETAIL: MODEL LOAD ERROR", error);

        setLoading(false);
      }
    };

    loadModel();

    return () => {
      cancelled = true;
    };
  }, [modelAsset]);

  /* ----------------------------------------------------------
     MODEL READY
     ---------------------------------------------------------- */

  const handleLoaded = useCallback(() => {
    console.log("=== DETAIL MODEL FULLY LOADED ===");

    setLoading(false);
  }, []);

  /* ----------------------------------------------------------
     GESTURES
     ---------------------------------------------------------- */

  const handlers = useSkeletonGestures({
    onRotate: (dx, dy) => {
      const sensitivity = 0.008;

      const horizontalRotation = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        dx * sensitivity,
      );

      const verticalRotation = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(1, 0, 0),
        dy * sensitivity,
      );

      rotationRef.current
        .premultiply(horizontalRotation)
        .premultiply(verticalRotation)
        .normalize();

      requestedViewRef.current = null;
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

  /* ----------------------------------------------------------
     RESET WHEN MODEL CHANGES
     ---------------------------------------------------------- */

  useEffect(() => {
    rotationRef.current.setFromEuler(
      new THREE.Euler(initialRotation.x, initialRotation.y, 0, "XYZ"),
    );

    zoomRef.current = DEFAULT_ZOOM;
  }, [modelAsset, initialRotation.x, initialRotation.y]);

  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <View style={styles.container}>
      {/* ========================================
          THREE.JS
          ======================================== */}

      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <LinearGradient
  colors={["#DCE2E4", "#C9D1D4"]}
  style={StyleSheet.absoluteFill}
/>
        <Canvas
          camera={{
            position: [0, 0, 4],

            fov: 38,

            near: 0.01,

            far: 100,
          }}
         gl={{
  antialias: false,
  alpha: true,
}}
        onCreated={({ gl }) => {
  gl.setClearColor(0x000000, 0);

  gl.outputColorSpace = THREE.SRGBColorSpace;

  gl.toneMapping = THREE.NoToneMapping;
}}
        >
         <hemisphereLight
  args={["#FFFFFF", "#AAB2B6", 1.7]}
/>



          {loadedScene && (
            <AnatomicalScene
              loadedScene={loadedScene}
              rotationRef={rotationRef}
              zoomRef={zoomRef}
              onMarkersChange={setMarkers}
              onLoaded={handleLoaded}
              selectedNumber={selectedNumber}
              longitudinalAxis={longitudinalAxis}
              requestedViewRef={requestedViewRef}
              mirrored={mirrored}
              onOrientationChange={setOrientationLabels}
            />
          )}
          <CameraFollowingLight />
        </Canvas>
      </View>

      {/* ========================================
          GESTURES
          ======================================== */}

      <View
        collapsable={false}
        style={StyleSheet.absoluteFill}
        onTouchStart={() => {
          onInteractionChange?.(true);
        }}
        onTouchEnd={() => {
          onInteractionChange?.(false);
        }}
        onTouchCancel={() => {
          onInteractionChange?.(false);
        }}
        {...handlers}
      />

      {/* ========================================
          NUMBERS
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
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {!!orientationLabels.top && (
          <Text style={[styles.orientationLabel, styles.orientationTop]}>
            {orientationLabels.top}
          </Text>
        )}

        {!!orientationLabels.bottom && (
          <Text style={[styles.orientationLabel, styles.orientationBottom]}>
            {orientationLabels.bottom}
          </Text>
        )}

        {!!orientationLabels.left && (
          <Text style={[styles.orientationLabel, styles.orientationLeft]}>
            {orientationLabels.left}
          </Text>
        )}

        {!!orientationLabels.right && (
          <Text style={[styles.orientationLabel, styles.orientationRight]}>
            {orientationLabels.right}
          </Text>
        )}
      </View>

      <View style={styles.controlsContainer} pointerEvents="box-none">
  {/* TOP ROW: MIRROR + RESET */}

  <View style={styles.secondaryActions}>
    <Pressable
      style={[
        styles.mirrorButton,
        mirrored && styles.mirrorButtonActive,
      ]}
      onPress={() => {
        setMirrored((prev) => !prev);
      }}
    >
      <Text
        style={[
          styles.mirrorButtonText,
          mirrored && styles.mirrorButtonTextActive,
        ]}
      >
        {mirrored
          ? "Clavicule droite"
          : "Clavicule gauche (miroir)"}
      </Text>
    </Pressable>

    <Pressable
      style={styles.resetButton}
      onPress={() => {
        rotationRef.current.setFromEuler(
          new THREE.Euler(
            initialRotation.x,
            initialRotation.y,
            0,
            "XYZ",
          ),
        );

        zoomRef.current = DEFAULT_ZOOM;

        setSelectedNumber(null);

        requestedViewRef.current = {
          id: "__reset__",
          label: "",
          cameraDirection: [0, 0, 1],
          cameraUp: [0, 1, 0],
        };
      }}
    >
      <Text style={styles.resetText}>
        Réinitialiser
      </Text>
    </Pressable>
  </View>

  {/* BELOW: 6 ANATOMICAL VIEWS */}

  {features.standardViews && views.length > 0 && (
    <View style={styles.viewsGrid}>
      {views.map((view) => (
        <Pressable
          key={view.id}
          style={styles.viewButton}
          onPress={() => {
            requestedViewRef.current = view;
          }}
        >
          <Text style={styles.viewButtonText}>
            {view.label}
          </Text>
        </Pressable>
      ))}
    </View>
  )}
</View>

      {/* ========================================
          LOADING
          ======================================== */}

      {loading && <SkeletonLoader backgroundColor="#DCE2E4" />}
    </View>
  );
}

/* ============================================================
   STYLES
   ============================================================ */

const styles = StyleSheet.create({
  container: {
    flex: 1,

      backgroundColor: "#DCE2E4",

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
  minHeight: 38,

  paddingHorizontal: 18,
  paddingVertical: 9,

  alignItems: "center",
  justifyContent: "center",

  borderRadius: 12,

  backgroundColor: "#27323A",
},

  resetText: {
  color: "#FFFFFF",

  fontSize: 11,
  fontWeight: "700",
},

  viewButton: {
    width: "31.5%",

    minHeight: 38,

    paddingHorizontal: 5,
    paddingVertical: 9,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 12,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#D8DEE2",
  },

  viewButtonText: {
    color: "#27323A",

    fontSize: 11,
    fontWeight: "700",

    textAlign: "center",
  },
  controlsContainer: {
    position: "absolute",

    left: 14,
    right: 14,
    bottom: 14,

    gap: 12,
  },
  secondaryActions: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "space-between",

    gap: 10,
  },
  viewsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",

    justifyContent: "space-between",

    rowGap: 8,
  },

  mirrorButton: {
    flex: 1,

    minHeight: 38,

    paddingHorizontal: 12,
    paddingVertical: 9,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 12,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#D8DEE2",
  },

  mirrorButtonActive: {
    backgroundColor: "#27323A",
    borderColor: "#27323A",
  },

  mirrorButtonText: {
    color: "#27323A",
    fontSize: 11,
    fontWeight: "700",
  },

  mirrorButtonTextActive: {
    color: "#FFFFFF",
  },
  orientationLabel: {
    position: "absolute",
    color: "#66737A",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },

  orientationTop: {
    top: 12,
    alignSelf: "center",
  },

  orientationBottom: {
  bottom: 178,
  alignSelf: "center",
},

  orientationLeft: {
    left: 10,
    top: "48%",
  },

  orientationRight: {
    right: 10,
    top: "48%",
  },
});
