import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { MaterialFamily } from "@/lib/mock-data";

/** Abstracted 3D specimens: metal ingots, polymer pellets, glass cullet shards. */

const LOOKS: Record<MaterialFamily, { color: string; metalness: number; roughness: number; opacity: number }> = {
  metals: { color: "#d9954f", metalness: 0.45, roughness: 0.3, opacity: 1 },
  polymers: { color: "#4a8ba3", metalness: 0.1, roughness: 0.55, opacity: 0.95 },
  glass: { color: "#79c9b4", metalness: 0.15, roughness: 0.1, opacity: 0.5 },
};

function Specimens({ family, density }: { family: MaterialFamily; density: number }) {
  const group = useRef<THREE.Group>(null);
  const look = LOOKS[family];

  const pieces = useMemo(() => {
    const rng = (s: number) => {
      const x = Math.sin(s * 91.7) * 21748.11;
      return x - Math.floor(x);
    };
    return Array.from({ length: density }, (_, i) => ({
      pos: [
        (rng(i + 1) - 0.5) * 2.2,
        (rng(i + 2) - 0.5) * 1.1,
        (rng(i + 3) - 0.5) * 1.4,
      ] as [number, number, number],
      rot: [rng(i + 4) * 6, rng(i + 5) * 6, rng(i + 6) * 6] as [number, number, number],
      scale: 0.7 + rng(i + 7) * 0.7,
    }));
  }, [density]);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.28;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.06;
  });

  return (
    <group ref={group}>
      {pieces.map((p, i) => (
        <mesh key={i} position={p.pos} rotation={p.rot} scale={p.scale}>
          {family === "metals" ? (
            <boxGeometry args={[0.7, 0.26, 0.34]} />
          ) : family === "polymers" ? (
            <capsuleGeometry args={[0.11, 0.16, 4, 8]} />
          ) : (
            <tetrahedronGeometry args={[0.3, 0]} />
          )}
          <meshStandardMaterial
            color={look.color}
            metalness={look.metalness}
            roughness={look.roughness}
            emissive={look.color}
            emissiveIntensity={0.05}
            transparent={look.opacity < 1}
            opacity={look.opacity}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function SpecimenScene({
  family,
  density = 14,
}: {
  family: MaterialFamily;
  density?: number;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.6, 4], fov: 40 }}
      gl={{ antialias: true }}
      style={{ background: "transparent" }}
    >
      <hemisphereLight args={["#ffd7a8", "#0d2a24", 0.5]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 4, 4]} intensity={1.4} color="#ffd9ab" />
      <directionalLight position={[-3, -1, -2]} intensity={0.5} color="#77e2c4" />
      <Specimens family={family} density={density} />
    </Canvas>
  );
}
