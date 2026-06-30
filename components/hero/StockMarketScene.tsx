"use client";
import { useRef, useMemo } from "react";
import { useFrame, Canvas } from "@react-three/fiber";
import { Float, Text, Grid, Stars, Line, Html } from "@react-three/drei";
import * as THREE from "three";

// High-tech financial nodes
const NODES = [
  { id: "NVDA", color: "#00d1b2", x: 0, y: 0, z: 0, size: 0.5 },
  { id: "AI-1", color: "#ff6b35", x: 2.5, y: 1.5, z: -1, size: 0.3 },
  { id: "AAPL", color: "#ffd166", x: -2.5, y: 0.8, z: -0.5, size: 0.4 },
  { id: "AI-2", color: "#ff6b35", x: 1.5, y: -1.5, z: 0.6, size: 0.3 },
  { id: "MSFT", color: "#00d1b2", x: -1.8, y: -1.2, z: 0.8, size: 0.4 },
  { id: "DATA", color: "#f9fafb", x: 3.0, y: -0.5, z: -1.5, size: 0.2 },
  { id: "RISK", color: "#ef476f", x: -3.0, y: -0.2, z: -1.0, size: 0.25 },
];

// Define connections between nodes
const CONNECTIONS = [
  [0, 1], [0, 2], [0, 3], [0, 4], 
  [1, 5], [2, 6], [3, 5], [4, 6]
];

function DataNetwork() {
  const points = useMemo(() => NODES.map(n => new THREE.Vector3(n.x, n.y, n.z)), []);
  
  return (
    <group>
      {/* Nodes */}
      {NODES.map((node, i) => (
        <Float key={i} speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
          <group position={[node.x, node.y, node.z]}>
            <mesh>
              <icosahedronGeometry args={[node.size, 1]} />
              <meshStandardMaterial 
                color={node.color} 
                wireframe={node.id.startsWith("AI")} 
                emissive={node.color}
                emissiveIntensity={0.8}
                transparent opacity={0.9}
              />
            </mesh>
            {/* Outer glow */}
            <mesh scale={1.4}>
              <icosahedronGeometry args={[node.size, 1]} />
              <meshBasicMaterial color={node.color} transparent opacity={0.15} blending={THREE.AdditiveBlending} />
            </mesh>
            {/* Minimalist label */}
            <Html center position={[0, -node.size - 0.3, 0]}>
              <div style={{
                color: node.color, fontSize: "10px", fontWeight: "bold", letterSpacing: "2px",
                fontFamily: "monospace", textShadow: `0 0 10px ${node.color}`,
                pointerEvents: "none"
              }}>
                {node.id}
              </div>
            </Html>
          </group>
        </Float>
      ))}

      {/* Connections */}
      {CONNECTIONS.map(([startIdx, endIdx], i) => (
        <ConnectionLine key={i} start={points[startIdx]} end={points[endIdx]} color={NODES[endIdx].color} />
      ))}
    </group>
  );
}

function ConnectionLine({ start, end, color }: { start: THREE.Vector3, end: THREE.Vector3, color: string }) {
  const lineRef = useRef<any>(null);
  const materialRef = useRef<any>(null);
  
  // Pulse the lines
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.opacity = 0.2 + Math.sin(clock.elapsedTime * 2 + start.x) * 0.15;
    }
  });

  return (
    <Line 
      ref={lineRef}
      points={[start, end]} 
      color={color} 
      lineWidth={1} 
      transparent 
      opacity={0.3}
    >
      <lineBasicMaterial ref={materialRef} attach="material" color={color} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </Line>
  );
}

function AnimatedGrid() {
  const gridRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    // Scroll the grid forward towards the user
    const z = (clock.elapsedTime * 0.5) % 1;
    if (gridRef.current) {
      gridRef.current.position.z = z;
    }
  });

  return (
    <group ref={gridRef}>
      <Grid 
        position={[0, -3, 0]} 
        args={[30, 30]} 
        cellSize={1} 
        cellThickness={1} 
        cellColor="#00d1b2" 
        sectionSize={5} 
        sectionThickness={1.5} 
        sectionColor="#ff6b35" 
        fadeDistance={20} 
        fadeStrength={1.5}
      />
    </group>
  );
}

export default function StockMarketScene() {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {/* Fallback gradient while loading */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle at 50% 50%, rgba(0, 209, 178, 0.05) 0%, #0a0a0f 70%)"
      }} />
      
      <Canvas
        camera={{ position: [0, 2, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00d1b2" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff6b35" />
        
        {/* Deep space stars */}
        <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
        
        {/* Centerpiece Network */}
        <DataNetwork />
        
        {/* Cyber floor */}
        <AnimatedGrid />
      </Canvas>
      
      {/* Vignette overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 40%, #0a0a0f 100%)"
      }} />
    </div>
  );
}
