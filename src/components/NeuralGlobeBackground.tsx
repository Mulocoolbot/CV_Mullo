"use client";

import { Component, useRef, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { usePreferences } from "@/hooks/usePreferences";
import type { ThemeMode } from "@/types/cv";

const GLOBE_RADIUS = 2.65;
const OCCLUSION_RADIUS = 2.63;
const LATITUDE_RINGS = 18;
const LONGITUDE_MERIDIANS = 24;
const RING_SEGMENTS = 72;

function buildGlobeGridPositions() {
  const vertices: number[] = [];

  for (let i = 1; i <= LATITUDE_RINGS; i += 1) {
    const phi = (i / (LATITUDE_RINGS + 1)) * Math.PI;
    const y = Math.cos(phi) * GLOBE_RADIUS;
    const ringRadius = Math.sin(phi) * GLOBE_RADIUS;

    for (let step = 0; step < RING_SEGMENTS; step += 1) {
      const thetaStart = (step / RING_SEGMENTS) * Math.PI * 2;
      const thetaEnd = ((step + 1) / RING_SEGMENTS) * Math.PI * 2;

      vertices.push(
        Math.cos(thetaStart) * ringRadius,
        y,
        Math.sin(thetaStart) * ringRadius,
        Math.cos(thetaEnd) * ringRadius,
        y,
        Math.sin(thetaEnd) * ringRadius
      );
    }
  }

  for (let j = 0; j < LONGITUDE_MERIDIANS; j += 1) {
    const theta = (j / LONGITUDE_MERIDIANS) * Math.PI * 2;
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);

    for (let step = 0; step < RING_SEGMENTS; step += 1) {
      const phiStart = (step / RING_SEGMENTS) * Math.PI;
      const phiEnd = ((step + 1) / RING_SEGMENTS) * Math.PI;

      const rStart = Math.sin(phiStart) * GLOBE_RADIUS;
      const rEnd = Math.sin(phiEnd) * GLOBE_RADIUS;

      vertices.push(
        rStart * cosTheta,
        Math.cos(phiStart) * GLOBE_RADIUS,
        rStart * sinTheta,
        rEnd * cosTheta,
        Math.cos(phiEnd) * GLOBE_RADIUS,
        rEnd * sinTheta
      );
    }
  }

  return new Float32Array(vertices);
}

const globeGridPositions = buildGlobeGridPositions();

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

function Y2KGridGlobe({ theme }: { theme: ThemeMode }) {
  const groupRef = useRef<Group>(null);
  const isDark = theme === "dark";

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y =
      (groupRef.current.rotation.y + delta * 0.18) % (Math.PI * 2);
  });

  return (
    <group rotation={[0.52, 0, -0.35]}>
      <group ref={groupRef}>
        <mesh>
          <sphereGeometry args={[OCCLUSION_RADIUS, 48, 48]} />
          <meshBasicMaterial
            color={isDark ? "#0A0A0C" : "#F7F6F2"}
            polygonOffset
            polygonOffsetFactor={1}
            polygonOffsetUnits={1}
          />
        </mesh>

        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[globeGridPositions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={isDark ? "#F4F4F6" : "#111111"}
            transparent
            opacity={isDark ? 0.22 : 0.16}
          />
        </lineSegments>
      </group>
    </group>
  );
}

export function NeuralGlobeBackground() {
  const { theme } = usePreferences();

  return (
    <div
      data-testid="neural-globe-bg"
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      <div data-testid="y2k-globe-meridians" className="h-full w-full">
        <GlobeCanvasBoundary>
          <Canvas camera={{ position: [0, 0, 5.8], fov: 45 }}>
            <Y2KGridGlobe theme={theme} />
          </Canvas>
        </GlobeCanvasBoundary>
      </div>
    </div>
  );
}
