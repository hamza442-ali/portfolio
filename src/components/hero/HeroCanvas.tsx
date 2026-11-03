"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Animated node graph: a cloud of points on a slowly rotating ellipsoid,
 * connected where they sit close together, with a faint wireframe core.
 * Kept deliberately cheap: one Points draw, one LineSegments draw, one mesh.
 */

const POINT_COUNT = 900;
const RADIUS = 2.6;
const LINK_DISTANCE = 0.55;
const MAX_LINKS = 1800;

const cyan = new THREE.Color("#22d3ee");
const violet = new THREE.Color("#a78bfa");
const white = new THREE.Color("#ffffff");

/** Small seeded PRNG (mulberry32) so the graph is identical on every render. */
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function useGraphGeometry() {
  return useMemo(() => {
    const positions = new Float32Array(POINT_COUNT * 3);
    const colors = new Float32Array(POINT_COUNT * 3);
    const pts: THREE.Vector3[] = [];
    const rand = seeded(20231011);

    // Fibonacci sphere, flattened into an ellipsoid and jittered for depth.
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < POINT_COUNT; i++) {
      const y = 1 - (i / (POINT_COUNT - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const jitter = 0.78 + rand() * 0.32;
      const v = new THREE.Vector3(
        Math.cos(theta) * r * RADIUS * 1.25 * jitter,
        y * RADIUS * 0.75 * jitter,
        Math.sin(theta) * r * RADIUS * jitter,
      );
      pts.push(v);
      positions.set([v.x, v.y, v.z], i * 3);

      const t = (v.x / (RADIUS * 1.25) + 1) / 2;
      const c = cyan.clone().lerp(violet, t);
      if (rand() < 0.08) c.lerp(white, 0.6);
      colors.set([c.r, c.g, c.b], i * 3);
    }

    // Links between near neighbours. Brute force is fine at this size (done once).
    const linkPositions: number[] = [];
    let links = 0;
    outer: for (let i = 0; i < POINT_COUNT; i++) {
      for (let j = i + 1; j < POINT_COUNT; j++) {
        if (pts[i].distanceToSquared(pts[j]) < LINK_DISTANCE * LINK_DISTANCE) {
          linkPositions.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
          if (++links >= MAX_LINKS) break outer;
        }
      }
    }

    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linkPositions, 3));

    return { pointGeo, lineGeo };
  }, []);
}

function Graph() {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const { pointGeo, lineGeo } = useGraphGeometry();
  const { pointer, size } = useThree();
  const target = useRef({ x: 0, y: 0 });
  // Push the graph to the right on wide screens so it never sits behind the copy.
  const offsetX = size.width >= 1536 ? 2.4 : size.width >= 1024 ? 1.9 : size.width >= 640 ? 0.8 : 0;

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    // Slow idle rotation plus gentle parallax toward the cursor.
    target.current.x = THREE.MathUtils.lerp(target.current.x, pointer.y * 0.25, 0.04);
    target.current.y = THREE.MathUtils.lerp(target.current.y, pointer.x * 0.35, 0.04);
    g.rotation.y = t * 0.06 + target.current.y;
    g.rotation.x = Math.sin(t * 0.15) * 0.08 + target.current.x;
    g.rotation.z = Math.sin(t * 0.1) * 0.04;
    g.position.x = THREE.MathUtils.lerp(g.position.x, offsetX, 0.05);
    if (core.current) {
      core.current.rotation.y -= delta * 0.12;
      core.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <group ref={group}>
      <points geometry={pointGeo}>
        <pointsMaterial
          vertexColors
          size={0.045}
          sizeAttenuation
          transparent
          opacity={0.8}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color="#67e8f9" transparent opacity={0.08} depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>
      <mesh ref={core} scale={1.05}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#a78bfa" wireframe transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

interface HeroCanvasProps {
  /** Pause rendering when the hero is off-screen. */
  active: boolean;
}

export default function HeroCanvas({ active }: HeroCanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6.5], fov: 50 }}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      <Graph />
    </Canvas>
  );
}
