import { Canvas } from "@react-three/fiber/native";

import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import * as THREE from "three";

import BoneDetailModel from "./BoneDetailModel";

import { boneData, BoneInfo } from "../../data/boneData";

import { useMemo, useRef } from "react";

import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { useFrame } from "@react-three/fiber/native";

type Props = {
  visible: boolean;

  boneName: string | null;

  mesh: THREE.Mesh | null;

  onClose: () => void;
};

function formatBoneName(name: string) {
  const lower = name.toLowerCase();

  if (lower.includes("clavicle")) return "Clavicle";
  if (lower.includes("femur")) return "Femur";
  if (lower.includes("fibula")) return "Fibula";
  if (lower.includes("humerus")) return "Humerus";
  if (lower.includes("patella")) return "Patella";

  if (lower.includes("radial") || lower.includes("radius")) {
    return "Radius";
  }

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

type Rotation = {
  x: number;
  y: number;
};

function InteractiveBone({
  mesh,
  rotationRef,
  zoomRef,
}: {
  mesh: THREE.Mesh;
  rotationRef: React.MutableRefObject<Rotation>;
  zoomRef: React.MutableRefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;

    groupRef.current.rotation.x = rotationRef.current.x;

    groupRef.current.rotation.y = rotationRef.current.y;

    groupRef.current.scale.setScalar(zoomRef.current);
  });

  return (
    <group ref={groupRef}>
      <BoneDetailModel mesh={mesh} />
    </group>
  );
}

export default function BoneDetailModal({
  visible,
  boneName,
  mesh,
  onClose,
}: Props) {
  const rotationRef = useRef<Rotation>({
    x: 0,
    y: 0,
  });

  const rotationStartRef = useRef<Rotation>({
    x: 0,
    y: 0,
  });

  const zoomRef = useRef(1);

  const zoomStartRef = useRef(1);

  /* ==========================================================
   ROTATION - 1 DOIGT
   ========================================================== */

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .minPointers(1)
        .maxPointers(1)
        .minDistance(3)
        .runOnJS(true)

        .onBegin(() => {
          rotationStartRef.current = {
            ...rotationRef.current,
          };
        })

        .onUpdate((event) => {
          const sensitivity = 0.015;

          rotationRef.current.y =
            rotationStartRef.current.y + event.translationX * sensitivity;

          rotationRef.current.x =
            rotationStartRef.current.x + event.translationY * sensitivity;
        }),
    [],
  );

  /* ==========================================================
   ZOOM - 2 DOIGTS
   ========================================================== */

  const pinchGesture = useMemo(
    () =>
      Gesture.Pinch()
        .runOnJS(true)

        .onBegin(() => {
          zoomStartRef.current = zoomRef.current;
        })

        .onUpdate((event) => {
          zoomRef.current = THREE.MathUtils.clamp(
            zoomStartRef.current * Math.pow(event.scale, 1.2),

            // zoom arrière max
            0.5,

            // zoom avant max
            4,
          );
        }),
    [],
  );

  /* ==========================================================
   COMBINAISON
   ========================================================== */

  const combinedGesture = useMemo(
    () => Gesture.Simultaneous(panGesture, pinchGesture),
    [panGesture, pinchGesture],
  );

  if (!boneName || !mesh) {
    return null;
  }

  const formattedName = formatBoneName(boneName);

  const info: BoneInfo | undefined = boneData[formattedName];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* HEADER */}

        <View style={styles.header}>
          <Text style={styles.title}>{formattedName}</Text>

          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </View>

        {/* 3D VIEWER */}

        {/* 3D VIEWER */}

        <GestureDetector gesture={combinedGesture}>
          <View style={styles.viewer}>
            <Canvas
              camera={{
                position: [0, 0, 3],
                fov: 45,
                near: 0.01,
                far: 1000,
              }}
              gl={{
                antialias: false,
                alpha: false,
              }}
              onCreated={({ gl }) => {
                gl.setClearColor(0xf5f6f7, 1);
              }}
            >
              <ambientLight intensity={2} />

              <directionalLight position={[5, 5, 5]} intensity={3} />

              <directionalLight position={[-5, 2, 4]} intensity={2} />

              <directionalLight position={[0, -5, 2]} intensity={1} />

              <InteractiveBone
                mesh={mesh}
                rotationRef={rotationRef}
                zoomRef={zoomRef}
              />
            </Canvas>
          </View>
        </GestureDetector>

        {/* INFORMATIONS */}

        <ScrollView
          style={styles.infoContainer}
          contentContainerStyle={styles.infoContent}
        >
          {info ? (
            <>
              <Text style={styles.sectionTitle}>Description</Text>

              <Text style={styles.text}>{info.description}</Text>

              <Text style={styles.sectionTitle}>Location</Text>

              <Text style={styles.text}>{info.location}</Text>

              <Text style={styles.sectionTitle}>Function</Text>

              <Text style={styles.text}>{info.function}</Text>

              {info.articulations && (
                <>
                  <Text style={styles.sectionTitle}>Articulations</Text>

                  <Text style={styles.text}>{info.articulations}</Text>
                </>
              )}
            </>
          ) : (
            <Text style={styles.text}>
              No information available yet for {formattedName}.
            </Text>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    height: 85,

    paddingTop: 35,
    paddingHorizontal: 20,

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 24,
    fontWeight: "800",

    color: "#27323A",
  },

  closeButton: {
    width: 40,
    height: 40,

    borderRadius: 20,

    backgroundColor: "#F0F1F2",

    alignItems: "center",
    justifyContent: "center",
  },

  closeText: {
    fontSize: 20,

    color: "#27323A",
  },

  viewer: {
    height: 330,

    backgroundColor: "#F5F6F7",
  },

  infoContainer: {
    flex: 1,
  },

  infoContent: {
    padding: 22,
    paddingBottom: 50,
  },

  sectionTitle: {
    marginTop: 18,
    marginBottom: 6,

    fontSize: 16,
    fontWeight: "800",

    color: "#27323A",
  },

  text: {
    fontSize: 15,
    lineHeight: 23,

    color: "#58636B",
  },
});
