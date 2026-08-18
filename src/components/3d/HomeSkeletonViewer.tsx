import { Canvas, useFrame } from "@react-three/fiber/native";

import { Suspense, useMemo, useRef } from "react";
import {
  PanResponder,
  StyleSheet,
  View,
} from "react-native";
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

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,

        onMoveShouldSetPanResponder: () => true,

        onPanResponderGrant: () => {
          console.log("PAN START");

          rotationStartRef.current = {
            ...rotationRef.current,
          };
        },

        onPanResponderMove: (_, gestureState) => {
          const sensitivity = 0.022;

          rotationRef.current.y =
            rotationStartRef.current.y +
            gestureState.dx * sensitivity;

          rotationRef.current.x = clamp(
            rotationStartRef.current.x +
            gestureState.dy * sensitivity,
            -1.4,
            1.4
          );
        },

        onPanResponderRelease: () => {
          console.log("PAN END");
        },

        onPanResponderTerminate: () => {
          console.log("PAN TERMINATED");
        },
      }),
    []
  );

  return (
    <View style={styles.container}>
      {/* 3D rendering */}
      <View
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      >
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

          <directionalLight
            position={[5, 5, 5]}
            intensity={3}
          />

          <directionalLight
            position={[-5, 3, 2]}
            intensity={1.5}
          />

          <Suspense fallback={null}>
            <SkeletonScene
              rotationRef={rotationRef}
              onLoaded={onLoaded}
            />
          </Suspense>
        </Canvas>
      </View>

      {/* Touch layer */}
      <View
        style={styles.gestureLayer}
        collapsable={false}
        {...panResponder.panHandlers}
      />
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  gestureLayer: {
    ...StyleSheet.absoluteFillObject,
  },
});
