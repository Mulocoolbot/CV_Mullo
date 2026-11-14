"use client";

import { Component, useRef, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { usePreferences } from "@/hooks/usePreferences";
import type { ThemeMode } from "@/types/cv";

const SPHERE_RADIUS = 2.65;
const NODE_COUNT = 130;
const LINK_THRESHOLD = 0.92;

function buildNeuralSphereData() {
  const nodes: [number, number, number][] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < NODE_COUNT; i += 1) {
    const unitY = 1 - (i / (NODE_COUNT - 1)) * 2;
    const ringRadius = Math.sqrt(Math.max(0, 1 - unitY * unitY));
    const theta = goldenAngle * i;

    nodes.push([
      Math.cos(theta) * ringRadius * SPHERE_RADIUS,
      unitY * SPHERE_RADIUS,
      Math.sin(theta) * ringRadius * SPHERE_RADIUS,
    ]);
  }

  const secondaryCoords: number[] = [];
  const tertiaryCoords: number[] = [];

  for (let i = 0; i < nodes.length; i += 1) {
    const [x, y, z] = nodes[i];
    const mod = i % 20;
    const isTertiary = mod === 0 || mod === 7 || mod === 14;
    if (isTertiary) {
      tertiaryCoords.push(x, y, z);
    } else {
      secondaryCoords.push(x, y, z);
    }
  }

  const synapseCoords: number[] = [];
  for (let i = 0; i < nodes.length; i += 1) {
    const [ax, ay, az] = nodes[i];
    for (let j = i + 1; j < nodes.length; j += 1) {
      const [bx, by, bz] = nodes[j];
      const dx = ax - bx;
      const dy = ay - by;
      const dz = az - bz;
      if (Math.hypot(dx, dy, dz) < LINK_THRESHOLD) {
        synapseCoords.push(ax, ay, az, bx, by, bz);
      }
    }
  }

  return {
    linePositions: new Float32Array(synapseCoords),
    cobaltNodePositions: new Float32Array(secondaryCoords),
    coralNodePositions: new Float32Array(tertiaryCoords),
  };
}

const neuralSphereData = buildNeuralSphereData();

class GlobeCanvasBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return null;
    }
    return this.props.children;
  }
}

function RotatingNeuralGlobe({ theme }: { theme: ThemeMode }) {
  const groupRef = useRef<Group>(null);
  const secondaryColor = theme === "light" ? "#2563EB" : "#3B82F6";

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.14;
    groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.25) * 0.12;
  });

  const nodeLayers = [
    {
      id: "cobalt-nodes",
      positions: neuralSphereData.cobaltNodePositions,
      color: secondaryColor,
      size: 0.055,
      opacity: theme === "light" ? 0.78 : 0.85,
    },
    {
      id: "coral-nodes",
      positions: neuralSphereData.coralNodePositions,
      color: "#FF5A36",
      size: 0.072,
      opacity: 0.92,
    },
  ];

  return (
    <group ref={groupRef}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[neuralSphereData.linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={secondaryColor}
          transparent
          opacity={theme === "light" ? 0.22 : 0.28}
        />
      </lineSegments>

      {nodeLayers.map((layer) => (
        <points key={layer.id}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[layer.positions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            color={layer.color}
            size={layer.size}
            sizeAttenuation
            transparent
            opacity={layer.opacity}
          />
        </points>
      ))}
    </group>
  );
}

export function NeuralGlobeBackground() {
  const { theme } = usePreferences();

  return (
    <div
      data-testid="neural-globe-bg"
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-45"
    >
      <GlobeCanvasBoundary>
        <Canvas camera={{ position: [0, 0, 5.8], fov: 45 }}>
          <RotatingNeuralGlobe theme={theme} />
        </Canvas>
      </GlobeCanvasBoundary>
    </div>
  );
}
