"use client";

import { Component, useRef, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, RoundedBox, Text } from "@react-three/drei";
import { Cpu, MapPin, ShieldCheck } from "lucide-react";
import type { Group } from "three";
import { profileData } from "@/data/profile";
import { accentPalette, usePreferences } from "@/hooks/usePreferences";
import type { ThemeMode } from "@/types/cv";

interface FloatingBadgeProps {
  accentHex: string;
  theme: ThemeMode;
}

function FloatingBadge({ accentHex, theme }: FloatingBadgeProps) {
  const meshRef = useRef<Group>(null);
  const surfaceColor = theme === "dark" ? "#18181b" : "#f4f4f5";
  const primaryTextColor = theme === "dark" ? "#fafafa" : "#09090b";
  const mutedTextColor = theme === "dark" ? "#a1a1aa" : "#52525b";

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.6) * 0.25;
  });

  return (
    <Float speed={2} rotationIntensity={0.35} floatIntensity={0.6}>
      <group ref={meshRef}>
        <RoundedBox args={[3.4, 2.1, 0.15]} radius={0.12} smoothness={4}>
          <meshStandardMaterial
            color={surfaceColor}
            roughness={0.25}
            metalness={0.6}
          />
        </RoundedBox>

        <RoundedBox
          args={[3.44, 2.14, 0.12]}
          radius={0.13}
          smoothness={4}
          position={[0, 0, -0.02]}
        >
          <meshStandardMaterial
            color={accentHex}
            emissive={accentHex}
            emissiveIntensity={0.35}
            roughness={0.3}
            metalness={0.8}
          />
        </RoundedBox>

        <Text
          position={[0, 0.42, 0.09]}
          fontSize={0.22}
          color={primaryTextColor}
          anchorX="center"
          anchorY="middle"
        >
          {profileData.name}
        </Text>

        <Text
          position={[0, 0.02, 0.09]}
          fontSize={0.15}
          color={accentHex}
          anchorX="center"
          anchorY="middle"
        >
          @Mulocoolbot • Full Stack
        </Text>

        <Text
          position={[0, -0.42, 0.09]}
          fontSize={0.13}
          color={mutedTextColor}
          anchorX="center"
          anchorY="middle"
        >
          {profileData.location}
        </Text>
      </group>
    </Float>
  );
}

class CanvasBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export function InteractiveCard3D() {
  const { enable3D, accent, theme, lang } = usePreferences();
  const currentAccent = accentPalette[accent];

  if (!enable3D) {
    return (
      <div
        data-testid="card-2d-fallback"
        className={`flex h-80 w-full flex-col justify-between rounded-3xl border ${currentAccent.border} p-6 shadow-lg lg:h-96 ${
          theme === "dark" ? "bg-zinc-900/70" : "bg-white/90"
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border ${currentAccent.border} px-3 py-1 font-mono text-xs font-medium ${currentAccent.text}`}
          >
            <Cpu aria-hidden="true" className="h-3.5 w-3.5" />
            <span>
              {lang === "en" ? "2D Performance Mode" : "Mode Performa 2D"}
            </span>
          </span>
          <ShieldCheck
            aria-hidden="true"
            className={`h-5 w-5 ${currentAccent.text}`}
          />
        </div>

        <div className="space-y-2">
          <p className={`font-mono text-sm font-semibold ${currentAccent.text}`}>
            @{profileData.handle}
          </p>
          <h2 className="text-2xl font-bold tracking-tight">
            {profileData.name}
          </h2>
          <p className="inline-flex items-center gap-1.5 text-sm opacity-80">
            <MapPin
              aria-hidden="true"
              className={`h-4 w-4 ${currentAccent.text}`}
            />
            <span>{profileData.location}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {profileData.roles.map((role) => (
            <span
              key={role}
              className={`rounded-lg border ${currentAccent.border} px-2.5 py-1 font-mono text-xs ${currentAccent.text}`}
            >
              {role}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid="card-3d-canvas"
      className={`relative h-80 w-full overflow-hidden rounded-3xl border ${currentAccent.border} shadow-lg lg:h-96 ${
        theme === "dark" ? "bg-zinc-900/50" : "bg-zinc-100/80"
      }`}
    >
      <CanvasBoundary
        fallback={
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 p-6 text-center">
            <p className="text-lg font-bold">{profileData.name}</p>
            <p className={`font-mono text-xs ${currentAccent.text}`}>
              @Mulocoolbot • Full Stack
            </p>
            <p className="text-xs opacity-75">{profileData.location}</p>
          </div>
        }
      >
        <Canvas camera={{ position: [0, 0, 3.8], fov: 45 }}>
          <ambientLight intensity={0.85} />
          <directionalLight
            position={[3, 4, 5]}
            intensity={1.5}
            color={currentAccent.hex}
          />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 1.6}
            minPolarAngle={Math.PI / 2.4}
          />
          <FloatingBadge accentHex={currentAccent.hex} theme={theme} />
        </Canvas>
      </CanvasBoundary>
    </div>
  );
}

