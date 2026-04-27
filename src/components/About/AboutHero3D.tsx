"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";

function Scene({ animate }: { animate: boolean }) {
  const primary = useMemo(() => new THREE.Color("#BC0A18"), []);
  const gold = useMemo(() => new THREE.Color("#D4AF37"), []);

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 3]} intensity={1.2} />
      <pointLight position={[-4, -2, -2]} intensity={0.8} color={gold} />

      <Float
        enabled={animate}
        speed={0.8}
        rotationIntensity={0.9}
        floatIntensity={0.9}
      >
        <mesh rotation={[0.3, 0.6, 0]}>
          <torusKnotGeometry args={[1.05, 0.32, 180, 18]} />
          <meshStandardMaterial
            color={primary}
            roughness={0.15}
            metalness={0.55}
            emissive={primary}
            emissiveIntensity={0.14}
          />
        </mesh>
      </Float>

      <mesh position={[0, -2.0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.6, 3.2, 64]} />
        <meshStandardMaterial
          color={gold}
          roughness={0.45}
          metalness={0.2}
          emissive={gold}
          emissiveIntensity={0.08}
          transparent
          opacity={0.35}
        />
      </mesh>

      <Environment preset="city" />
    </>
  );
}

export default function AboutHero3D() {
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const apply = () => setAnimate(!mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0.4, 4.6], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Scene animate={animate} />
    </Canvas>
  );
}

