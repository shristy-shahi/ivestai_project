"use client";
import { useRef, useMemo } from "react";
import { useFrame, Canvas } from "@react-three/fiber";
import { Float, Stars, Ring } from "@react-three/drei";
import * as THREE from "three";

function ParticleWave() {
  const count = 4000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (i % 80) * 0.25 - 10;
      const z = Math.floor(i / 80) * 0.25 - 6;
      pos[i * 3] = x;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = z;
    }
    return pos;
  }, [count]);

  const geometryRef = useRef<THREE.BufferGeometry>(null);

  useFrame(({ clock }) => {
    if (!geometryRef.current) return;
    const pos = geometryRef.current.attributes.position.array as Float32Array;
    const t = clock.getElapsedTime() * 0.5;
    
    for (let i = 0; i < count; i++) {
      const x = pos[i * 3];
      const z = pos[i * 3 + 2];
      // Smooth rolling wave effect combining two sine waves
      const y = Math.sin(x * 0.5 + t) * 0.6 + Math.sin(z * 0.4 + t * 0.8) * 0.6;
      pos[i * 3 + 1] = y;
    }
    geometryRef.current.attributes.position.needsUpdate = true;
  });

  return (
    <points position={[0, -2, 0]}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.035} 
        color="#3b82f6" 
        transparent 
        opacity={0.5} 
        blending={THREE.AdditiveBlending} 
        depthWrite={false} 
      />
    </points>
  );
}

function FloatingRings() {
  return (
    <group>
      <Float speed={2} rotationIntensity={1.5} floatIntensity={1.5}>
        <Ring args={[2.4, 2.43, 64]} position={[-3, 1, -2]} rotation={[Math.PI / 3, 0, 0]}>
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.3} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
        </Ring>
      </Float>
      <Float speed={1.5} rotationIntensity={2} floatIntensity={2}>
        <Ring args={[3.2, 3.22, 64]} position={[3, 0, -4]} rotation={[Math.PI / 4, Math.PI / 6, 0]}>
          <meshBasicMaterial color="#10b981" transparent opacity={0.2} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
        </Ring>
      </Float>
      <Float speed={2.5} rotationIntensity={1} floatIntensity={1}>
        <Ring args={[1.5, 1.52, 64]} position={[0, 2, -6]} rotation={[-Math.PI / 4, 0, Math.PI / 8]}>
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.4} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
        </Ring>
      </Float>
    </group>
  );
}

function DataStreams() {
  const count = 40;
  const data = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 15,
      y: (Math.random() - 0.5) * 10,
      z: (Math.random() - 0.5) * 15 - 5,
      speed: Math.random() * 0.8 + 0.2,
      scale: Math.random() * 0.8 + 0.2,
      color: Math.random() > 0.5 ? "#10b981" : "#3b82f6",
    }));
  }, [count]);

  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child: any, i) => {
      child.position.y += data[i].speed * delta * 2;
      if (child.position.y > 5) {
        child.position.y = -5;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {data.map((d, i) => (
        <mesh key={i} position={[d.x, d.y, d.z]}>
          <boxGeometry args={[0.02, d.scale, 0.02]} />
          <meshBasicMaterial color={d.color} transparent opacity={0.3} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
}

export default function StockMarketScene() {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {/* Background glow */}
      <div style={{ 
        position: "absolute", inset: 0, 
        background: "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.06) 0%, var(--bg-base) 60%)" 
      }} />
      
      <Canvas 
        camera={{ position: [0, 2, 8], fov: 45 }} 
        gl={{ antialias: true, alpha: true }}
      >
        <fog attach="fog" args={["#0a0f1c", 5, 20]} />
        <ambientLight intensity={0.5} />
        
        {/* Subtle slow moving stars */}
        <Stars radius={50} depth={50} count={1500} factor={4} saturation={0} fade speed={0.5} />
        
        {/* Animated wave of particles */}
        <ParticleWave />
        
        {/* Ascending data bars */}
        <DataStreams />
        
        {/* Abstract glowing rings */}
        <FloatingRings />
      </Canvas>
      
      {/* Edge vignette to blend perfectly with background */}
      <div style={{ 
        position: "absolute", inset: 0, 
        background: "radial-gradient(ellipse at center, transparent 30%, var(--bg-base) 100%)" 
      }} />
    </div>
  );
}
