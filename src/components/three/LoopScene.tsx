import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * The loop motif: abstracted material fragments (metal / polymer / glass) that
 * assemble into a torus. `morph` 0 = straight linear line, 1 = closed loop.
 */

type FragmentSpec = {
  kind: 0 | 1 | 2;
  t: number;
  offset: THREE.Vector3;
  spin: THREE.Vector3;
  scale: number;
};

const MATERIALS = [
  // metal: rough copper
  { color: "#b8763b", metalness: 0.6, roughness: 0.42, opacity: 1 },
  // polymer: waxy translucent
  { color: "#3f7c92", metalness: 0.1, roughness: 0.62, opacity: 0.9 },
  // glass: cullet
  { color: "#79c9b4", metalness: 0.15, roughness: 0.12, opacity: 0.42 },
] as const;

function useFragments(count: number) {
  return useMemo<FragmentSpec[]>(() => {
    const rng = (seed: number) => {
      const x = Math.sin(seed * 127.1) * 43758.5453;
      return x - Math.floor(x);
    };
    return Array.from({ length: count }, (_, i) => ({
      kind: (i % 3) as 0 | 1 | 2,
      t: i / count,
      offset: new THREE.Vector3(
        (rng(i + 1) - 0.5) * 0.5,
        (rng(i + 2) - 0.5) * 0.5,
        (rng(i + 3) - 0.5) * 0.5,
      ),
      spin: new THREE.Vector3(rng(i + 4), rng(i + 5), rng(i + 6)).multiplyScalar(1.6),
      scale: 0.55 + rng(i + 7) * 0.6,
    }));
  }, [count]);
}

function FragmentSwarm({
  count,
  morph,
  assemble,
}: {
  count: number;
  morph: number;
  assemble: number;
}) {
  const fragments = useFragments(count);
  const groups = useRef<(THREE.Group | null)[]>([]);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const R = 2.35;
    const r = 0.62;

    fragments.forEach((f, i) => {
      const g = groups.current[i];
      if (!g) return;
      const angle = f.t * Math.PI * 2;

      // Loop position (torus tube)
      const loop = new THREE.Vector3(
        Math.cos(angle) * (R + Math.cos(angle * 3 + time * 0.2) * r * 0.4),
        Math.sin(angle) * (R + Math.sin(angle * 3 + time * 0.2) * r * 0.4),
        Math.sin(angle * 2 + time * 0.15) * r,
      );

      // Linear "take-make-waste" position: a straight decaying line
      const line = new THREE.Vector3(
        (f.t - 0.5) * 11,
        -Math.pow(Math.max(0, f.t - 0.72) * 3.4, 2) * 2.4,
        f.offset.z * 0.6,
      );

      const m = THREE.MathUtils.clamp(morph, 0, 1);
      const eased = m * m * (3 - 2 * m);
      dummy.position.lerpVectors(line, loop, eased);

      // Assembly: fragments drift in from a scattered cloud
      const a = THREE.MathUtils.clamp(assemble, 0, 1);
      const scatter = f.offset.clone().multiplyScalar((1 - a) * 18);
      g.position.copy(dummy.position).add(scatter).add(f.offset.clone().multiplyScalar(0.5));

      g.rotation.x += 0.0016 * f.spin.x * (1 + (1 - a) * 4);
      g.rotation.y += 0.0021 * f.spin.y * (1 + (1 - a) * 4);
      g.rotation.z += 0.0011 * f.spin.z;
      const s = f.scale * (0.35 + a * 0.65);
      g.scale.setScalar(s);
    });
  });

  return (
    <group>
      {fragments.map((f, i) => {
        const mat = MATERIALS[f.kind];
        return (
          <group key={i} ref={(el) => void (groups.current[i] = el)}>
            <mesh castShadow={false} receiveShadow={false}>
              {f.kind === 0 ? (
                <boxGeometry args={[0.42, 0.2, 0.24]} />
              ) : f.kind === 1 ? (
                <sphereGeometry args={[0.16, 10, 8]} />
              ) : (
                <tetrahedronGeometry args={[0.24, 0]} />
              )}
              <meshStandardMaterial
                color={mat.color}
                metalness={mat.metalness}
                roughness={mat.roughness}
                emissive={mat.color}
                emissiveIntensity={0.04}
                transparent={mat.opacity < 1}
                opacity={mat.opacity}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function LoopRibbon({ morph }: { morph: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * 0.05;
    const m = THREE.MathUtils.clamp(morph, 0, 1);
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.opacity = 0.06 + m * 0.16;
    ref.current.scale.setScalar(0.9 + m * 0.1);
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2.6, 0, 0]}>
      <torusGeometry args={[2.35, 0.05, 12, 128]} />
      <meshStandardMaterial
        color="#e0a05c"
        emissive="#c9762f"
        emissiveIntensity={1.6}
        transparent
        opacity={0.14}
      />
    </mesh>
  );
}

export default function LoopScene({
  morph = 1,
  assemble = 1,
  count = 96,
}: {
  morph?: number;
  assemble?: number;
  count?: number;
}) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0.4, 8.4], fov: 42 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <hemisphereLight args={["#ffd7a8", "#0d2a24", 0.45]} />
      <ambientLight intensity={0.22} />
      <directionalLight position={[4, 6, 5]} intensity={1.1} color="#ffdcb0" />
      <directionalLight position={[-5, -2, -3]} intensity={0.75} color="#5fd6bb" />
      <pointLight position={[0, 0, 3]} intensity={8} distance={12} color="#ffb774" />
      <group rotation={[0.18, 0, 0]}>
        <LoopRibbon morph={morph} />
        <FragmentSwarm count={count} morph={morph} assemble={assemble} />
      </group>
    </Canvas>
  );
}
