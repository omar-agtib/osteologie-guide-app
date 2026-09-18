import { Canvas, useFrame } from "@react-three/fiber/native";
import { Suspense, useRef } from "react";
import { StyleSheet, View } from "react-native";
import * as THREE from "three";
import { useSkeletonGestures } from "../../hooks/useSkeletonGestures";
import SkeletonModel from "./SkeletonModel";

type Rotation = { x: number; y: number };
function SkeletonScene({
  rotationRef,
  onLoaded,
}: {
  rotationRef: React.RefObject<Rotation>;
  onLoaded?: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.x = rotationRef.current.x;
    groupRef.current.rotation.y = rotationRef.current.y;
  });
  return (
    <group ref={groupRef}>
      <SkeletonModel onLoaded={onLoaded} />
    </group>
  );
}
export function HomeSkeletonViewer({ onLoaded }: { onLoaded?: () => void }) {
  const rotationRef = useRef<Rotation>({ x: 0, y: 0 });
  const handlers = useSkeletonGestures({
    onRotate: (dx, dy) => {
      rotationRef.current.y += dx * 0.022;
      rotationRef.current.x = THREE.MathUtils.clamp(
        rotationRef.current.x + dy * 0.022,
        -0.7,
        0.7,
      );
    },
  });
  return (
    <View style={styles.container}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ antialias: false, alpha: true }}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        >
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 5, 5]} intensity={3} />
          <directionalLight position={[-5, 3, 2]} intensity={1.5} />
          <Suspense fallback={null}>
            <SkeletonScene rotationRef={rotationRef} onLoaded={onLoaded} />
          </Suspense>
        </Canvas>
      </View>
      <View collapsable={false} style={StyleSheet.absoluteFill} {...handlers} />
    </View>
  );
}
const styles = StyleSheet.create({ container: { flex: 1, width: "100%" } });
