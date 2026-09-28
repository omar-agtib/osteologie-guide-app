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

import {
  useEffect,
  useRef,
  useState,
} from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useSkeletonGestures } from "../../hooks/useSkeletonGestures";

import { useFrame } from "@react-three/fiber/native";

import AnatomicalDetailViewer, {
  AnatomicalLandmark,
} from "./AnatomicalDetailViewer";

import {
  getDetailModel,
} from "../../data/detailModels";

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
  const [
    selectedLandmark,
    setSelectedLandmark,
  ] =
    useState<AnatomicalLandmark | null>(
      null,
    );

  const rotationRef =
    useRef<Rotation>({
      x: 0,
      y: 0,
    });

  const zoomRef = useRef(1);
  const zoomStartRef = useRef(1);
  useEffect(() => {
  if (visible) {
    rotationRef.current = {
      x: 0,
      y: 0,
    };

    zoomRef.current = 1;

    setSelectedLandmark(
      null,
    );
  }
}, [visible, mesh]);
  const handlers = useSkeletonGestures({
    onRotate: (dx, dy) => {
      rotationRef.current.y += dx * 0.015;
      rotationRef.current.x += dy * 0.015;
    },
    onPinchStart: () => {
      zoomStartRef.current = zoomRef.current;
    },
    onPinch: (scale) => {
      zoomRef.current = THREE.MathUtils.clamp(
        zoomStartRef.current * Math.pow(scale, 1.2),
        0.5,
        4,
      );
    },
  });

  if (!boneName || !mesh) {
    return null;
  }

const formattedName =
  formatBoneName(boneName);

const detailModel =
  getDetailModel(
    formattedName,
  );

const info:
  | BoneInfo
  | undefined =
  boneData[formattedName];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaProvider>
        <SafeAreaView
          style={styles.container}
          edges={["top", "bottom", "left", "right"]}
        >
          {/* HEADER */}

          <View style={styles.header}>
            <Text style={styles.title}>{formattedName}</Text>

            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          {/* 3D VIEWER */}

          {/* 3D VIEWER */}

         <View style={styles.viewer}>
  {detailModel ? (
    <AnatomicalDetailViewer
      modelAsset={
        detailModel.asset
      }

      initialRotation={
        detailModel.initialRotation
      }

      onLandmarkPress={(
        landmark,
      ) => {
        setSelectedLandmark(
          landmark,
        );
      }}
    />
  ) : (
    <>
      <View
        pointerEvents="none"
        style={
          StyleSheet.absoluteFill
        }
      >
        <Canvas
          camera={{
            position: [
              0,
              0,
              3,
            ],

            fov: 45,

            near: 0.01,

            far: 1000,
          }}
          gl={{
            antialias: false,

            alpha: false,
          }}
          onCreated={({
            gl,
          }) => {
            gl.setClearColor(
              0xf5f6f7,
              1,
            );
          }}
        >
          <ambientLight
            intensity={2}
          />

          <directionalLight
            position={[
              5,
              5,
              5,
            ]}
            intensity={3}
          />

          <directionalLight
            position={[
              -5,
              2,
              4,
            ]}
            intensity={2}
          />

          <directionalLight
            position={[
              0,
              -5,
              2,
            ]}
            intensity={1}
          />

          <InteractiveBone
            mesh={mesh}
            rotationRef={
              rotationRef
            }
            zoomRef={
              zoomRef
            }
          />
        </Canvas>
      </View>

      <View
        collapsable={false}
        style={
          StyleSheet.absoluteFill
        }
        {...handlers}
      />
    </>
  )}
</View>

          {/* INFORMATIONS */}

          <ScrollView
            style={styles.infoContainer}
            contentContainerStyle={styles.infoContent}
          >
            {selectedLandmark && (
  <View
    style={
      styles.landmarkCard
    }
  >
    <View
      style={
        styles.landmarkHeader
      }
    >
      <View
        style={
          styles.landmarkNumber
        }
      >
        <Text
          style={
            styles.landmarkNumberText
          }
        >
          {
            selectedLandmark.numero
          }
        </Text>
      </View>

      <Text
        style={
          styles.landmarkTitle
        }
      >
        {
          selectedLandmark.nom
        }
      </Text>
    </View>

    <Text
      style={
        styles.landmarkDescription
      }
    >
      {
        selectedLandmark.description
      }
    </Text>
  </View>
)}
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
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    minHeight: 56,
    paddingVertical: 8,
    paddingHorizontal: 20,

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    flex: 1,
    marginRight: 12,
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
    flex: 1,
    maxHeight: 330,

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
  landmarkCard: {
  marginBottom: 12,

  padding: 16,

  borderRadius: 14,

  backgroundColor:
    "#FFF9DE",

  borderWidth: 1,

  borderColor:
    "#E8D68A",
},

landmarkHeader: {
  flexDirection: "row",

  alignItems: "center",

  marginBottom: 10,
},

landmarkNumber: {
  width: 34,

  height: 34,

  marginRight: 10,

  borderRadius: 17,

  backgroundColor:
    "#FFD700",

  alignItems: "center",

  justifyContent:
    "center",
},

landmarkNumberText: {
  color: "#27323A",

  fontSize: 14,

  fontWeight: "900",
},

landmarkTitle: {
  flex: 1,

  color: "#27323A",

  fontSize: 17,

  fontWeight: "800",
},

landmarkDescription: {
  color: "#58636B",

  fontSize: 14,

  lineHeight: 21,
},
});
