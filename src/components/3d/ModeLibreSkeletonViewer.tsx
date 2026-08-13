import { Canvas, useFrame, useThree } from "@react-three/fiber/native";

import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { Suspense, useMemo, useRef, useState } from "react";

import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";

import * as THREE from "three";

import SkeletonModel from "./SkeletonModel";

import BoneDetailModal from "./BoneDetailModal";

import { ArrowRight } from "lucide-react-native";

type Rotation = {
  x: number;
  y: number;
};

type TapRequest = {
  x: number;
  y: number;
  id: number;
};

type PinchState = {
  id: number;
  active: boolean;
  focalX: number;
  focalY: number;
  startZoom: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

/* ============================================================
   3D SCENE
   ============================================================ */

function SkeletonScene({
  rotationRef,
  zoomRef,
  cameraOffsetRef,
  pinchRef,
  tapRequestRef,
  onBoneSelected,
  onAnnotationChange,
  onLoaded,
}: {
  onLoaded?: () => void;

  onAnnotationChange: (data: {
    x: number;
    y: number;
    visible: boolean;
  }) => void;

  rotationRef: React.MutableRefObject<Rotation>;

  zoomRef: React.MutableRefObject<number>;

  cameraOffsetRef: React.MutableRefObject<{
    x: number;
    y: number;
  }>;

  pinchRef: React.MutableRefObject<PinchState>;

  tapRequestRef: React.MutableRefObject<TapRequest | null>;

  onBoneSelected: (
    name: string,
    mesh: THREE.Mesh
  ) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const { camera, size } = useThree();

  /* ==========================================================
     PINCH / FOCAL ZOOM
     ========================================================== */

  const lastPinchIdRef = useRef(-1);

  const pinchWorldPointRef = useRef(new THREE.Vector3());

  const pinchStartCameraRef = useRef({
    x: 0,
    y: 0,
    z: 5,
  });

  const pinchPlane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
    [],
  );

  const pinchRaycaster = useMemo(() => new THREE.Raycaster(), []);

  const pinchPointer = useMemo(() => new THREE.Vector2(), []);

  /* ==========================================================
     TAP / BONE SELECTION
     ========================================================== */

  const lastTapId = useRef(0);

  const selectedMeshRef = useRef<THREE.Mesh | null>(null);

  const selectedAnchorLocalRef = useRef(new THREE.Vector3());

  const autoFocusRef = useRef<{
    phase: "idle" | "zoomOut" | "focus";
    x: number;
    y: number;
    z: number;
  }>({
    phase: "idle",
    x: 0,
    y: 0,
    z: 2.3,
  });

  const tempWorldPosition = useMemo(() => new THREE.Vector3(), []);

  const tempProjectedPosition = useMemo(() => new THREE.Vector3(), []);

  const annotationFrameRef = useRef(0);

  const originalMaterialsRef = useRef<
    Map<string, THREE.Material | THREE.Material[]>
  >(new Map());

  const pointer = useMemo(() => new THREE.Vector2(), []);

  const raycaster = useMemo(() => new THREE.Raycaster(), []);

  const yellowMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#FFD700",
        roughness: 0.45,
        metalness: 0,
      }),
    [],
  );

  useFrame(() => {
    const group = groupRef.current;

    if (!group) return;

    /* =========================
       ROTATION
       ========================= */

    group.rotation.x = rotationRef.current.x;

    group.rotation.y = rotationRef.current.y;

    /* =========================
       FOCAL ZOOM
       ========================= */

    const pinch = pinchRef.current;

    // Nouveau pinch
    if (pinch.active && pinch.id !== lastPinchIdRef.current) {
      lastPinchIdRef.current = pinch.id;

      pinchStartCameraRef.current = {
        x: cameraOffsetRef.current.x,
        y: cameraOffsetRef.current.y,
        z: pinch.startZoom,
      };

      // Coordonnées écran -> Three.js
      pinchPointer.x = (pinch.focalX / size.width) * 2 - 1;

      pinchPointer.y = -(pinch.focalY / size.height) * 2 + 1;

      camera.position.set(
        cameraOffsetRef.current.x,
        cameraOffsetRef.current.y,
        pinch.startZoom,
      );

      camera.lookAt(cameraOffsetRef.current.x, cameraOffsetRef.current.y, 0);

      camera.updateMatrixWorld();

      pinchRaycaster.setFromCamera(pinchPointer, camera);

      // Point 3D situé sous les doigts
      pinchRaycaster.ray.intersectPlane(pinchPlane, pinchWorldPointRef.current);
    }

    /* ==========================================================
   MANUAL PINCH ZOOM
   ========================================================== */

    if (pinch.active) {
      /*
       * Si l'utilisateur commence à zoomer manuellement,
       * on annule l'auto-focus.
       */
      autoFocusRef.current.phase = "idle";

      const focus = pinchWorldPointRef.current;

      const start = pinchStartCameraRef.current;

      const ratio = zoomRef.current / start.z;

      cameraOffsetRef.current.x = focus.x + (start.x - focus.x) * ratio;

      cameraOffsetRef.current.y = focus.y + (start.y - focus.y) * ratio;
    }

    /* ==========================================================
   AUTO FOCUS TRANSITION
   ========================================================== */

    if (!pinch.active) {
      const target = autoFocusRef.current;

      /* =====================================
     PHASE 1 : DEZOOM
     ===================================== */

      if (target.phase === "zoomOut") {
        cameraOffsetRef.current.x = THREE.MathUtils.lerp(
          cameraOffsetRef.current.x,
          0,
          0.1,
        );

        cameraOffsetRef.current.y = THREE.MathUtils.lerp(
          cameraOffsetRef.current.y,
          0,
          0.1,
        );

        zoomRef.current = THREE.MathUtils.lerp(zoomRef.current, 5, 0.1);

        const xReached = Math.abs(cameraOffsetRef.current.x) < 0.03;

        const yReached = Math.abs(cameraOffsetRef.current.y) < 0.03;

        const zoomReached = Math.abs(zoomRef.current - 5) < 0.05;

        if (xReached && yReached && zoomReached) {
          cameraOffsetRef.current.x = 0;
          cameraOffsetRef.current.y = 0;
          zoomRef.current = 5;

          /*
           * Le dézoom est terminé.
           * Maintenant on commence le zoom
           * vers le nouvel os.
           */
          target.phase = "focus";
        }
      } else if (target.phase === "focus") {
        /* =====================================
     PHASE 2 : ZOOM SUR LE NOUVEL OS
     ===================================== */
        cameraOffsetRef.current.x = THREE.MathUtils.lerp(
          cameraOffsetRef.current.x,
          target.x,
          0.12,
        );

        cameraOffsetRef.current.y = THREE.MathUtils.lerp(
          cameraOffsetRef.current.y,
          target.y,
          0.12,
        );

        zoomRef.current = THREE.MathUtils.lerp(zoomRef.current, target.z, 0.12);

        const xReached = Math.abs(cameraOffsetRef.current.x - target.x) < 0.01;

        const yReached = Math.abs(cameraOffsetRef.current.y - target.y) < 0.01;

        const zoomReached = Math.abs(zoomRef.current - target.z) < 0.01;

        if (xReached && yReached && zoomReached) {
          cameraOffsetRef.current.x = target.x;
          cameraOffsetRef.current.y = target.y;
          zoomRef.current = target.z;

          target.phase = "idle";
        }
      }
    }

    /* ==========================================================
   APPLY CAMERA
   ========================================================== */

    camera.position.set(
      cameraOffsetRef.current.x,
      cameraOffsetRef.current.y,
      zoomRef.current,
    );

    camera.lookAt(cameraOffsetRef.current.x, cameraOffsetRef.current.y, 0);

    camera.updateMatrixWorld();

    /* =========================
   BONE -> SCREEN POSITION
   ========================= */

    if (selectedMeshRef.current) {
      annotationFrameRef.current += 1;

      /*
       * 1 update every 3 frames is enough
       * for the React Native overlay.
       */
      if (annotationFrameRef.current % 3 === 0) {
        tempWorldPosition.copy(selectedAnchorLocalRef.current);

        selectedMeshRef.current.localToWorld(tempWorldPosition);

        tempProjectedPosition.copy(tempWorldPosition).project(camera);

        const x = (tempProjectedPosition.x * 0.5 + 0.5) * size.width;

        const y = (-tempProjectedPosition.y * 0.5 + 0.5) * size.height;

        const visible =
          tempProjectedPosition.z >= -1 && tempProjectedPosition.z <= 1;

        onAnnotationChange({
          x,
          y,
          visible,
        });
      }
    }

    /* =========================
       TAP / RAYCAST
       ========================= */

    const request = tapRequestRef.current;

    if (!request || request.id === lastTapId.current) {
      return;
    }

    lastTapId.current = request.id;

    pointer.x = (request.x / size.width) * 2 - 1;

    pointer.y = -(request.y / size.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);

    const intersections = raycaster.intersectObject(group, true);

    const firstMesh = intersections.find(
      (intersection) => (intersection.object as THREE.Mesh).isMesh,
    );

    if (!firstMesh) {
      return;
    }

    const mesh = firstMesh.object as THREE.Mesh;

    /* Restore previous bone */

    if (selectedMeshRef.current) {
      const previous = selectedMeshRef.current;

      const original = originalMaterialsRef.current.get(previous.uuid);

      if (original) {
        previous.material = original;
      }
    }

    /* Save original material */

    if (!originalMaterialsRef.current.has(mesh.uuid)) {
      originalMaterialsRef.current.set(mesh.uuid, mesh.material);
    }

    /* Selected bone -> yellow */

    mesh.material = yellowMaterial;

    selectedMeshRef.current = mesh;

    /*
     * Find the center of the selected bone.
     * We store it in local coordinates so it continues
     * following the bone when the skeleton rotates.
     */
    mesh.geometry.computeBoundingBox();

    if (mesh.geometry.boundingBox) {
      mesh.geometry.boundingBox.getCenter(selectedAnchorLocalRef.current);
    } else {
      selectedAnchorLocalRef.current.set(0, 0, 0);
    }

    /*
     * Convert bone center to world position.
     */
    tempWorldPosition.copy(selectedAnchorLocalRef.current);

    mesh.localToWorld(tempWorldPosition);

    onBoneSelected(mesh.name || "Unknown bone", mesh);

    /*
     * AUTO ZOOM
     *
     * Only auto-zoom if we are still looking at
     * almost the complete skeleton.
     */
    const boneBox = new THREE.Box3().setFromObject(mesh);

    const sphere = boneBox.getBoundingSphere(new THREE.Sphere());

    const perspectiveCamera = camera as THREE.PerspectiveCamera;

    const fov = THREE.MathUtils.degToRad(perspectiveCamera.fov);

    const calculatedZoom = sphere.radius / (0.28 * Math.tan(fov / 2));

    const targetZoom = clamp(calculatedZoom, 1.5, 3.0);

    /*
     * Si nous sommes déjà zoomés sur un os,
     * on commence par revenir à la vue générale.
     *
     * Sinon on peut zoomer directement.
     */

    const alreadyZoomed =
      zoomRef.current < 3.8 ||
      Math.abs(cameraOffsetRef.current.x) > 0.1 ||
      Math.abs(cameraOffsetRef.current.y) > 0.1;

    autoFocusRef.current = {
      phase: alreadyZoomed ? "zoomOut" : "focus",

      x: tempWorldPosition.x,
      y: tempWorldPosition.y,

      z: targetZoom,
    };
  });

  return (
    <group ref={groupRef}>
      <SkeletonModel
  variant="modeLibre"
  onLoaded={onLoaded}
/>
    </group>
  );
}

/* ============================================================
   CLEAN BONE NAME
   ============================================================ */

function formatBoneName(name: string) {
  const lower = name.toLowerCase();

  if (lower.includes("clavicle")) return "Clavicle";

  if (lower.includes("femur")) return "Femur";

  if (lower.includes("fibula")) return "Fibula";

  if (lower.includes("humerus")) return "Humerus";

  if (lower.includes("patella")) return "Patella";

  if (lower.includes("radial") || lower.includes("radius")) return "Radius";

  if (lower.includes("scapula")) return "Scapula";

  if (lower.includes("skull")) return "Skull";

  if (lower.includes("jaw")) return "Mandible";

  if (lower.includes("ulna")) return "Ulna";

  if (lower.includes("tibia")) return "Tibia";

  if (lower.includes("pelvis")) return "Pelvis";

  if (lower.includes("rib")) return "Rib Cage";

  if (lower.includes("spinal")) return "Spine";

  return name
    .replace(/^human_/i, "")
    .replace(/_\d+/g, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function BoneCallout({
  boneName,
  x,
  y,
}: {
  boneName: string;
  x: number;
  y: number;
}) {
  const screenWidth = Dimensions.get("window").width;

  const screenHeight = Dimensions.get("window").height;

  const [labelSize, setLabelSize] = useState({
    width: 100,
    height: 34,
  });

  const margin = 16;

  // Distance entre l'os et le label
  const gap = 65;

  const spaceRight = screenWidth - x;

  const spaceLeft = x;

  const canGoRight = spaceRight >= labelSize.width + gap + margin;

  const canGoLeft = spaceLeft >= labelSize.width + gap + margin;

  let placement: "right" | "left" | "bottom";

  if (canGoRight) {
    placement = "right";
  } else if (canGoLeft) {
    placement = "left";
  } else {
    placement = "bottom";
  }

  let labelX = 0;
  let labelY = 0;

  /* ==========================================
     LABEL POSITION
     ========================================== */

  if (placement === "right") {
    labelX = x + gap;

    labelY = y - labelSize.height / 2;
  } else if (placement === "left") {
    labelX = x - gap - labelSize.width;

    labelY = y - labelSize.height / 2;
  } else {
    // Pas de place sur les côtés
    // -> mettre le nom sous l'os

    labelX = x - labelSize.width / 2;

    labelY = y + gap;
  }

  /* ==========================================
     KEEP LABEL INSIDE SCREEN
     ========================================== */

  labelX = clamp(labelX, margin, screenWidth - labelSize.width - margin);

  labelY = clamp(
    labelY,

    // évite le header Mode Libre
    100,

    screenHeight - labelSize.height - 25,
  );

  /* ==========================================
     WHERE THE LINE ENDS
     ========================================== */

  let endX: number;
  let endY: number;

  if (placement === "right") {
    endX = labelX - 5;

    endY = labelY + labelSize.height / 2;
  } else if (placement === "left") {
    endX = labelX + labelSize.width + 5;

    endY = labelY + labelSize.height / 2;
  } else {
    endX = labelX + labelSize.width / 2;

    endY = labelY - 5;
  }

  /* ==========================================
     LINE GEOMETRY
     ========================================== */

  const dx = endX - x;
  const dy = endY - y;

  const distance = Math.sqrt(dx * dx + dy * dy);

  const angle = Math.atan2(dy, dx);

  const middleX = (x + endX) / 2;

  const middleY = (y + endY) / 2;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {/* Point sur l'os */}
      <View
        style={[
          styles.bonePoint,
          {
            left: x - 4,
            top: y - 4,
          },
        ]}
      />

      {/* Ligne os -> nom */}
      <View
        style={[
          styles.boneLine,
          {
            width: distance,

            left: middleX - distance / 2,

            top: middleY - 1,

            transform: [
              {
                rotate: `${angle}rad`,
              },
            ],
          },
        ]}
      />

      {/* Tête de flèche */}
      <View
        style={{
          position: "absolute",

          left: endX - 9,
          top: endY - 9,

          transform: [
            {
              rotate: `${angle}rad`,
            },
          ],
        }}
      >
        <ArrowRight size={18} color="#9B7300" strokeWidth={2.3} />
      </View>

      {/* Nom de l'os */}
      <View
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;

          if (
            Math.abs(width - labelSize.width) > 1 ||
            Math.abs(height - labelSize.height) > 1
          ) {
            setLabelSize({
              width,
              height,
            });
          }
        }}
        style={[
          styles.boneNameContainer,
          {
            left: labelX,
            top: labelY,
          },
        ]}
      >
        <Text style={styles.boneName} numberOfLines={2}>
          {boneName}
        </Text>
      </View>
    </View>
  );
}
/* ============================================================
   VIEWER
   ============================================================ */

type Props = {
  onLoaded?: () => void;
};

export default function ModeLibreSkeletonViewer({
  onLoaded,
}: Props) {
  const [selectedBone, setSelectedBone] = useState<string | null>(null);
  const [selectedBoneMesh, setSelectedBoneMesh] = useState<THREE.Mesh | null>(
    null,
  );

  const [detailVisible, setDetailVisible] = useState(false);
  const [annotation, setAnnotation] = useState<{
    x: number;
    y: number;
    visible: boolean;
  } | null>(null);

  /* -------------------------
     Rotation
     ------------------------- */

  const rotationRef = useRef<Rotation>({
    x: 0,
    y: 0,
  });

  const rotationStartRef = useRef<Rotation>({
    x: 0,
    y: 0,
  });

  /* -------------------------
     Zoom
     ------------------------- */

  const zoomRef = useRef(5);

  const zoomStartRef = useRef(5);

  const cameraOffsetRef = useRef({
    x: 0,
    y: 0,
  });

  const pinchRef = useRef<PinchState>({
    id: 0,
    active: false,
    focalX: 0,
    focalY: 0,
    startZoom: 5,
  });

  /* -------------------------
     Tap
     ------------------------- */

  const tapRequestRef = useRef<TapRequest | null>(null);

  const tapIdRef = useRef(0);

  /* ==========================================================
     ONE FINGER = ROTATION
     ========================================================== */

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .minPointers(1)
        .maxPointers(1)
        .minDistance(4)
        .runOnJS(true)

        .onBegin(() => {
          rotationStartRef.current = {
            ...rotationRef.current,
          };
        })

        .onUpdate((event) => {
          const sensitivity = 0.022;

          rotationRef.current.y =
            rotationStartRef.current.y + event.translationX * sensitivity;

          rotationRef.current.x = clamp(
            rotationStartRef.current.x + event.translationY * sensitivity,
            -1.4,
            1.4,
          );
        }),
    [],
  );

  /* ==========================================================
     TWO FINGERS = ZOOM
     ========================================================== */

  const pinchGesture = useMemo(
    () =>
      Gesture.Pinch()
        .runOnJS(true)

        .onBegin((event) => {
          zoomStartRef.current = zoomRef.current;

          pinchRef.current = {
            id: pinchRef.current.id + 1,

            active: true,

            focalX: event.focalX,

            focalY: event.focalY,

            startZoom: zoomRef.current,
          };
        })

        .onUpdate((event) => {
          const acceleratedScale = Math.pow(event.scale, 1.8);

          zoomRef.current = clamp(
            zoomStartRef.current / acceleratedScale,
            0.8,
            10,
          );
        })

        .onEnd(() => {
          pinchRef.current.active = false;
        })

        .onFinalize(() => {
          pinchRef.current.active = false;
        }),
    [],
  );

  /* ==========================================================
     TAP = SELECT BONE
     ========================================================== */

  const tapGesture = useMemo(
    () =>
      Gesture.Tap()
        .maxDistance(8)
        .maxDuration(250)
        .runOnJS(true)

        .onEnd((event, success) => {
          if (!success) return;

          tapIdRef.current += 1;

          tapRequestRef.current = {
            x: event.x,
            y: event.y,
            id: tapIdRef.current,
          };
        }),
    [],
  );

  /* ==========================================================
     COMBINE
     ========================================================== */

  const combinedGesture = useMemo(
    () => Gesture.Simultaneous(panGesture, pinchGesture, tapGesture),
    [panGesture, pinchGesture, tapGesture],
  );

  return (
    <GestureDetector gesture={combinedGesture}>
      <View style={styles.container}>
        <Canvas
          camera={{
            position: [0, 0, 5],
            fov: 45,
            near: 0.1,
            far: 100,
          }}
          gl={{
            antialias: false,
            alpha: true,
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <ambientLight intensity={1.5} />

          <directionalLight position={[5, 5, 5]} intensity={3} />

          <directionalLight position={[-5, 3, 2]} intensity={1.5} />

          <Suspense fallback={null}>
  <SkeletonScene
    rotationRef={rotationRef}
    zoomRef={zoomRef}
    cameraOffsetRef={cameraOffsetRef}
    pinchRef={pinchRef}
    tapRequestRef={tapRequestRef}

    onLoaded={onLoaded}

    onBoneSelected={(name, mesh) => {
      setSelectedBone(name);
      setSelectedBoneMesh(mesh);
    }}

    onAnnotationChange={(data) => {
      setAnnotation(data);
    }}
  />
</Suspense>
        </Canvas>

        {selectedBone && annotation && annotation.visible && (
          <BoneCallout
            boneName={formatBoneName(selectedBone)}
            x={annotation.x}
            y={annotation.y}
          />
        )}

        {selectedBone && selectedBoneMesh && (
          <Pressable
            style={styles.detailButton}
            onPress={() => {
              setDetailVisible(true);
            }}
          >
            <Text style={styles.detailButtonText}>Voir en détail</Text>
          </Pressable>
        )}

        <BoneDetailModal
          visible={detailVisible}
          boneName={selectedBone}
          mesh={selectedBoneMesh}
          onClose={() => {
            setDetailVisible(false);
          }}
        />
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  bonePoint: {
    position: "absolute",

    width: 8,
    height: 8,

    borderRadius: 4,

    backgroundColor: "#FFD700",

    borderWidth: 1,
    borderColor: "#8A6900",
  },

  boneLine: {
    position: "absolute",

    height: 2,

    backgroundColor: "#9B7300",
  },

  boneNameContainer: {
    position: "absolute",

    maxWidth: 170,

    paddingHorizontal: 8,
    paddingVertical: 5,

    backgroundColor: "rgba(255,255,255,0.88)",

    borderRadius: 7,
  },

  boneName: {
    color: "#27323A",
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  detailButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",

    backgroundColor: "#27323A",

    paddingHorizontal: 24,
    paddingVertical: 13,

    borderRadius: 24,
  },

  detailButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
