import { Canvas, useFrame } from "@react-three/fiber";
import { useIsFocused } from "expo-router";
import { useMemo, useRef } from "react";
import { PanResponder, StyleSheet, View } from "react-native";
import * as THREE from "three";

export type ZoneKey = "sup" | "ax" | "inf";

type Props = {
  activeZone?: ZoneKey | null;
  accentColor?: string;
  interactive?: boolean;
  framing?: "full" | "small";
};

const NEUTRAL = new THREE.Color("#8593A0");

function Rig({
  activeZone,
  accentColor,
}: {
  activeZone?: ZoneKey | null;
  accentColor?: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const accent = useMemo(
    () => new THREE.Color(accentColor ?? "#000000"),
    [accentColor],
  );

  const axSkull = useRef<THREE.Mesh>(null);
  const axSpine = useRef<THREE.Mesh>(null);
  const axRibs = useRef<THREE.Mesh>(null);
  const supArmL1 = useRef<THREE.Mesh>(null);
  const supArmL2 = useRef<THREE.Mesh>(null);
  const supArmL3 = useRef<THREE.Mesh>(null);
  const supArmR1 = useRef<THREE.Mesh>(null);
  const supArmR2 = useRef<THREE.Mesh>(null);
  const supArmR3 = useRef<THREE.Mesh>(null);
  const infPelvis = useRef<THREE.Mesh>(null);
  const infLegL1 = useRef<THREE.Mesh>(null);
  const infLegL2 = useRef<THREE.Mesh>(null);
  const infLegR1 = useRef<THREE.Mesh>(null);
  const infLegR2 = useRef<THREE.Mesh>(null);

  const meshEntries = useMemo(
    () => [
      { ref: axSkull, zone: "ax" as ZoneKey },
      { ref: axSpine, zone: "ax" as ZoneKey },
      { ref: axRibs, zone: "ax" as ZoneKey },
      { ref: supArmL1, zone: "sup" as ZoneKey },
      { ref: supArmL2, zone: "sup" as ZoneKey },
      { ref: supArmL3, zone: "sup" as ZoneKey },
      { ref: supArmR1, zone: "sup" as ZoneKey },
      { ref: supArmR2, zone: "sup" as ZoneKey },
      { ref: supArmR3, zone: "sup" as ZoneKey },
      { ref: infPelvis, zone: "inf" as ZoneKey },
      { ref: infLegL1, zone: "inf" as ZoneKey },
      { ref: infLegL2, zone: "inf" as ZoneKey },
      { ref: infLegR1, zone: "inf" as ZoneKey },
      { ref: infLegR2, zone: "inf" as ZoneKey },
    ],
    [],
  );

  useFrame((_, delta) => {
    if (groupRef.current && !activeZone) {
      groupRef.current.rotation.y += delta * 0.15;
    }
    for (const entry of meshEntries) {
      const mat = entry.ref.current?.material as
        | THREE.MeshBasicMaterial
        | undefined;
      if (!mat) continue;
      mat.color.copy(entry.zone === activeZone ? accent : NEUTRAL);
    }
  });

  return (
    <group ref={groupRef}>
      <group name="zone-ax">
        <mesh ref={axSkull} position={[0, 1.55, 0]}>
          <sphereGeometry args={[0.28, 20, 20]} />
          <meshBasicMaterial color={NEUTRAL} />
        </mesh>
        <mesh ref={axSpine} position={[0, 0.7, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 1.3, 12]} />
          <meshBasicMaterial color={NEUTRAL} />
        </mesh>
        <mesh ref={axRibs} position={[0, 1.0, 0]}>
          <torusGeometry args={[0.32, 0.035, 8, 20]} />
          <meshBasicMaterial color={NEUTRAL} />
        </mesh>
      </group>

      <group name="zone-sup">
        <mesh
          ref={supArmL1}
          position={[-0.32, 1.25, 0]}
          rotation={[0, 0, -0.3]}
        >
          <cylinderGeometry args={[0.04, 0.04, 0.4, 10]} />
          <meshBasicMaterial color={NEUTRAL} />
        </mesh>
        <mesh ref={supArmL2} position={[-0.42, 0.75, 0]}>
          <cylinderGeometry args={[0.045, 0.04, 0.7, 10]} />
          <meshBasicMaterial color={NEUTRAL} />
        </mesh>
        <mesh ref={supArmL3} position={[-0.46, 0.15, 0]}>
          <cylinderGeometry args={[0.035, 0.03, 0.62, 10]} />
          <meshBasicMaterial color={NEUTRAL} />
        </mesh>
        <mesh ref={supArmR1} position={[0.32, 1.25, 0]} rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.04, 0.04, 0.4, 10]} />
          <meshBasicMaterial color={NEUTRAL} />
        </mesh>
        <mesh ref={supArmR2} position={[0.42, 0.75, 0]}>
          <cylinderGeometry args={[0.045, 0.04, 0.7, 10]} />
          <meshBasicMaterial color={NEUTRAL} />
        </mesh>
        <mesh ref={supArmR3} position={[0.46, 0.15, 0]}>
          <cylinderGeometry args={[0.035, 0.03, 0.62, 10]} />
          <meshBasicMaterial color={NEUTRAL} />
        </mesh>
      </group>

      <group name="zone-inf">
        <mesh ref={infPelvis} position={[0, 0.05, 0]}>
          <boxGeometry args={[0.5, 0.25, 0.3]} />
          <meshBasicMaterial color={NEUTRAL} />
        </mesh>
        <mesh ref={infLegL1} position={[-0.14, -0.55, 0]}>
          <cylinderGeometry args={[0.05, 0.045, 0.9, 10]} />
          <meshBasicMaterial color={NEUTRAL} />
        </mesh>
        <mesh ref={infLegL2} position={[-0.14, -1.35, 0]}>
          <cylinderGeometry args={[0.04, 0.035, 0.75, 10]} />
          <meshBasicMaterial color={NEUTRAL} />
        </mesh>
        <mesh ref={infLegR1} position={[0.14, -0.55, 0]}>
          <cylinderGeometry args={[0.05, 0.045, 0.9, 10]} />
          <meshBasicMaterial color={NEUTRAL} />
        </mesh>
        <mesh ref={infLegR2} position={[0.14, -1.35, 0]}>
          <cylinderGeometry args={[0.04, 0.035, 0.75, 10]} />
          <meshBasicMaterial color={NEUTRAL} />
        </mesh>
      </group>
    </group>
  );
}

export function SkeletonViewer({
  activeZone,
  accentColor,
  interactive = true,
  framing = "full",
}: Props) {
  const rotationY = useRef(0);
  const groupHandleRef = useRef<THREE.Group>(null);
  const isFocused = useIsFocused();

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: () => interactive,
        onPanResponderMove: (_, gesture) => {
          if (!interactive || !groupHandleRef.current) return;
          rotationY.current += gesture.dx * 0.005;
          groupHandleRef.current.rotation.y = rotationY.current;
        },
      }),
    [interactive],
  );

  const cameraZ = framing === "small" ? 6.5 : 5.2;

  return (
    <View
      style={StyleSheet.absoluteFill}
      {...(interactive ? panResponder.panHandlers : {})}
    >
      {isFocused && (
        <Canvas
          style={{ flex: 1, backgroundColor: "transparent" }}
          camera={{ position: [0, -0.1, cameraZ], fov: 45 }}
        >
          <group ref={groupHandleRef}>
            <Rig activeZone={activeZone} accentColor={accentColor} />
          </group>
        </Canvas>
      )}
    </View>
  );
}
