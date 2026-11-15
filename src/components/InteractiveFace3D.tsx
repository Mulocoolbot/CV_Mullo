"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePreferences } from "@/hooks/usePreferences";

const RING_COUNT = 44;
const SEGMENTS = 128;

function computeRingGeometryPoint(
  s: number,
  theta: number,
  t: number,
  impulse: number
): [number, number, number] {
  const clampedS = Math.max(0, Math.min(1, s));
  const majorA =
    1.32 * (1 - clampedS) +
    0.64 * clampedS +
    0.12 * Math.sin(Math.PI * clampedS);
  const minorB =
    1.32 * Math.pow(1 - clampedS, 1.42) +
    (0.21 + impulse * 0.06) * clampedS;

  const twistAngle =
    0.76 +
    Math.pow(1 - clampedS, 1.08) * (2.55 + impulse * 0.55) +
    Math.sin(t * 0.9 - clampedS * Math.PI * 1.5) * 0.14;

  const u = majorA * Math.cos(theta);
  const v = minorB * Math.sin(theta);

  const cosPsi = Math.cos(twistAngle);
  const sinPsi = Math.sin(twistAngle);

  const x = u * cosPsi - v * sinPsi;
  const y = u * sinPsi + v * cosPsi;
  const z =
    0.34 *
      Math.sin(Math.PI * clampedS) *
      Math.cos(2 * theta - t * 1.8 + clampedS * 2.2) -
    0.14 * Math.cos(Math.PI * clampedS);

  return [x, y, z];
}

function OpticalVortexTorus({
  isSurprised,
  pointerRef,
  isDark,
}: {
  isSurprised: boolean;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  isDark: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const flowPhaseRef = useRef(0);
  const waveTimeRef = useRef(0);
  const impulseRef = useRef(0);

  const ringBuffers = useMemo(() => {
    const outerBoundaryGeo = new THREE.BufferGeometry();
    const innerBoundaryGeo = new THREE.BufferGeometry();
    const coralWaveGeo = new THREE.BufferGeometry();
    const cobaltWaveGeo = new THREE.BufferGeometry();
    const primaryCoreGeo = new THREE.BufferGeometry();

    const makeSegBuffer = (ringTotal: number) =>
      new Float32Array(ringTotal * SEGMENTS * 6);

    outerBoundaryGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(makeSegBuffer(3), 3)
    );
    innerBoundaryGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(makeSegBuffer(2), 3)
    );
    coralWaveGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(makeSegBuffer(10), 3)
    );
    cobaltWaveGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(makeSegBuffer(16), 3)
    );
    primaryCoreGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(makeSegBuffer(18), 3)
    );

    return {
      outerBoundaryGeo,
      innerBoundaryGeo,
      coralWaveGeo,
      cobaltWaveGeo,
      primaryCoreGeo,
    };
  }, []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const targetImpulse = isSurprised ? 1.0 : 0.0;
    impulseRef.current = THREE.MathUtils.lerp(
      impulseRef.current,
      targetImpulse,
      Math.min(1, dt * 10)
    );

    const speedMult = 1.0 + impulseRef.current * 2.4;
    flowPhaseRef.current = (flowPhaseRef.current + dt * 0.55 * speedMult) % 1.0;
    waveTimeRef.current += dt * speedMult;

    const t = waveTimeRef.current;
    const phase = flowPhaseRef.current;
    const imp = impulseRef.current;

    const writeRingIntoArray = (
      targetArray: Float32Array,
      ringOffsetIndex: number,
      sValue: number
    ) => {
      let base = ringOffsetIndex * SEGMENTS * 6;
      let prev = computeRingGeometryPoint(sValue, 0, t, imp);

      for (let seg = 1; seg <= SEGMENTS; seg++) {
        const theta = (seg / SEGMENTS) * Math.PI * 2;
        const curr = computeRingGeometryPoint(sValue, theta, t, imp);

        targetArray[base++] = prev[0];
        targetArray[base++] = prev[1];
        targetArray[base++] = prev[2];
        targetArray[base++] = curr[0];
        targetArray[base++] = curr[1];
        targetArray[base++] = curr[2];

        prev = curr;
      }
    };

    const outerAttr = ringBuffers.outerBoundaryGeo.getAttribute(
      "position"
    ) as THREE.BufferAttribute;
    const outerArr = outerAttr.array as Float32Array;
    writeRingIntoArray(outerArr, 0, 0.0);
    writeRingIntoArray(outerArr, 1, 0.018);
    writeRingIntoArray(outerArr, 2, 0.036);
    outerAttr.needsUpdate = true;

    const innerAttr = ringBuffers.innerBoundaryGeo.getAttribute(
      "position"
    ) as THREE.BufferAttribute;
    const innerArr = innerAttr.array as Float32Array;
    writeRingIntoArray(innerArr, 0, 0.985);
    writeRingIntoArray(innerArr, 1, 1.0);
    innerAttr.needsUpdate = true;

    const coralAttr = ringBuffers.coralWaveGeo.getAttribute(
      "position"
    ) as THREE.BufferAttribute;
    const coralArr = coralAttr.array as Float32Array;

    const cobaltAttr = ringBuffers.cobaltWaveGeo.getAttribute(
      "position"
    ) as THREE.BufferAttribute;
    const cobaltArr = cobaltAttr.array as Float32Array;

    const primaryAttr = ringBuffers.primaryCoreGeo.getAttribute(
      "position"
    ) as THREE.BufferAttribute;
    const primaryArr = primaryAttr.array as Float32Array;

    let coralIdx = 0;
    let cobaltIdx = 0;
    let primaryIdx = 0;

    for (let i = 0; i < RING_COUNT; i++) {
      const s = 0.04 + ((i + phase) / RING_COUNT) * 0.94;
      if (i < 6 || i % 9 === 0) {
        if (coralIdx < 10) writeRingIntoArray(coralArr, coralIdx++, s);
      } else if (i % 2 === 0 && cobaltIdx < 16) {
        writeRingIntoArray(cobaltArr, cobaltIdx++, s);
      } else if (primaryIdx < 18) {
        writeRingIntoArray(primaryArr, primaryIdx++, s);
      }
    }

    coralAttr.needsUpdate = true;
    cobaltAttr.needsUpdate = true;
    primaryAttr.needsUpdate = true;

    if (groupRef.current) {
      const px = pointerRef.current.x;
      const py = pointerRef.current.y;
      const targetRotY = px * 0.42 + Math.sin(t * 0.45) * 0.18;
      const targetRotX = -py * 0.36 + Math.cos(t * 0.35) * 0.14;
      const targetRotZ = Math.sin(t * 0.25) * 0.08 + imp * 0.25;

      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotY,
        Math.min(1, dt * 6)
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotX,
        Math.min(1, dt * 6)
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        targetRotZ,
        Math.min(1, dt * 6)
      );
    }
  });

  const primaryColor = isDark ? "#F8FAFC" : "#111111";
  const cobaltColor = "#2563EB";
  const coralColor = "#FF5A36";
  const coreSurfaceColor = isDark ? "#12151E" : "#FFFFFF";

  return (
    <group ref={groupRef} scale={0.92}>
      <mesh data-testid="face-occlusion-mesh" position={[0, 0, -0.25]}>
        <circleGeometry args={[0.38, 32]} />
        <meshBasicMaterial color={coreSurfaceColor} side={THREE.DoubleSide} />
      </mesh>

      <lineSegments geometry={ringBuffers.outerBoundaryGeo}>
        <lineBasicMaterial color={coralColor} transparent opacity={0.95} />
      </lineSegments>

      <lineSegments geometry={ringBuffers.coralWaveGeo}>
        <lineBasicMaterial
          color={coralColor}
          transparent
          opacity={isSurprised ? 0.95 : 0.78}
        />
      </lineSegments>

      <lineSegments geometry={ringBuffers.cobaltWaveGeo}>
        <lineBasicMaterial color={cobaltColor} transparent opacity={0.88} />
      </lineSegments>

      <lineSegments geometry={ringBuffers.primaryCoreGeo}>
        <lineBasicMaterial color={primaryColor} transparent opacity={0.92} />
      </lineSegments>

      <lineSegments geometry={ringBuffers.innerBoundaryGeo}>
        <lineBasicMaterial
          color={isSurprised ? coralColor : cobaltColor}
          transparent
          opacity={0.98}
        />
      </lineSegments>

      <group data-testid="face-eyebrow-group" />
      <group data-testid="face-mouth-group" />
      <group data-testid="face-eyeball-left" />
      <group data-testid="face-eyeball-right" />
    </group>
  );
}

export function InteractiveFace3D() {
  const { theme } = usePreferences();
  const [isSurprised, setIsSurprised] = useState(false);
  const pointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isDark = theme === "dark";

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
      const ny = (e.clientY / Math.max(1, window.innerHeight)) * 2 - 1;
      pointerRef.current = { x: nx, y: ny };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleVortexClick = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsSurprised(true);
    timeoutRef.current = setTimeout(() => {
      setIsSurprised(false);
    }, 950);
  };

  return (
    <div
      data-testid="card-3d-canvas"
      data-theme-mode={theme}
      className={`relative w-full h-full min-h-[380px] lg:min-h-[440px] p-4 sm:p-6 overflow-hidden select-none flex items-center justify-center transition-colors duration-300 ${
        isDark ? "bg-[#12151E]" : "bg-white"
      }`}
    >
      <div
        data-testid="neural-face-trigger"
        data-surprised={isSurprised ? "true" : "false"}
        onClick={handleVortexClick}
        className="w-full h-full max-w-[390px] max-h-[390px] mx-auto cursor-pointer flex items-center justify-center"
      >
        <Canvas camera={{ position: [0, 0, 3.65], fov: 38 }} dpr={[1, 2]}>
          <OpticalVortexTorus
            isSurprised={isSurprised}
            pointerRef={pointerRef}
            isDark={isDark}
          />
        </Canvas>
      </div>
    </div>
  );
}

export default InteractiveFace3D;
