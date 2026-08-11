import { Canvas, useFrame } from "@react-three/fiber/native";

import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { Suspense, useMemo, useRef , useEffect} from "react";

import { StyleSheet, View } from "react-native";

import * as THREE from "three";

import SkeletonModel from "./SkeletonModel";


type Rotation = {
  x: number;
  y: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

/* ============================================================
   3D SCENE
   ============================================================ */

function SkeletonScene({
  rotationRef,
  onLoaded,
}: {
  rotationRef: React.MutableRefObject<Rotation>;
  onLoaded?: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const group = groupRef.current;

    if (!group) {
      return;
    }

    group.rotation.x = rotationRef.current.x;
    group.rotation.y = rotationRef.current.y;
  });

  return (
    <group ref={groupRef}>
      <SkeletonModel onLoaded={onLoaded} />
    </group>
  );
}

/* ============================================================
   HOME VIEWER
   ROTATION ONLY
   ============================================================ */

export function HomeSkeletonViewer({
  onLoaded,
}: {
  onLoaded?: () => void;
  }) {
  


  const rotationRef = useRef<Rotation>({
    x: 0,
    y: 0,
  });

  const rotationStartRef = useRef<Rotation>({
    x: 0,
    y: 0,
  });

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

          // Left / right
          rotationRef.current.y =
            rotationStartRef.current.y + event.translationX * sensitivity;

          // Up / down
          rotationRef.current.x = clamp(
            rotationStartRef.current.x + event.translationY * sensitivity,
            -0.7,
            0.7,
          );
        }),
    [],
  );

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.container}>
        <Canvas
          camera={{
            position: [0, 0, 5],
            fov: 45,
          }}
          gl={{
            antialias: false,
          }}
        >
          <ambientLight intensity={1.5} />

          <directionalLight position={[5, 5, 5]} intensity={3} />

          <directionalLight position={[-5, 3, 2]} intensity={1.5} />

          <Suspense fallback={null}>
            <SkeletonScene rotationRef={rotationRef} onLoaded={onLoaded} />
          </Suspense>
        </Canvas>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
