"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePreferences } from "@/hooks/usePreferences";

function g2(u: number, u0: number, su: number, v: number, v0: number, sv: number): number {
  const du = (u - u0) / su;
  const dv = (v - v0) / sv;
  return Math.exp(-0.5 * (du * du + dv * dv));
}

function g1(x: number, x0: number, s: number): number {
  const d = (x - x0) / s;
  return Math.exp(-0.5 * d * d);
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

const EYE_L_U = -0.31;
const EYE_R_U = 0.31;
const EYE_V = 0.19;
const EYE_RX = 0.135;
const EYE_RY = 0.068;

function isInsideEyeSocket(u: number, v: number): boolean {
  const dl = ((u - EYE_L_U) / (EYE_RX * 0.92)) ** 2 + ((v - EYE_V) / (EYE_RY * 0.92)) ** 2;
  const dr = ((u - EYE_R_U) / (EYE_RX * 0.92)) ** 2 + ((v - EYE_V) / (EYE_RY * 0.92)) ** 2;
  return dl < 1.0 || dr < 1.0;
}

function isInsideMaskSilhouette(u: number, v: number): boolean {
  const jawNarrow = v < 0 ? 1.0 - 0.24 * Math.pow(-v, 1.45) : 1.0 - 0.06 * Math.pow(v, 2.0);
  const effectiveU = u / Math.max(0.45, jawNarrow);
  const oval = effectiveU * effectiveU * 1.04 + ((v - 0.02) / 1.02) ** 2;
  return oval <= 1.0;
}

function evaluateAnatomicalFacePoint(
  rawU: number,
  rawV: number,
  surprise: number,
  blink: number
): [number, number, number] {
  let u = rawU;
  let v = rawV;

  const nosePinch = g2(u, 0, 0.22, v, 0.02, 0.28);
  u *= 1.0 - 0.26 * nosePinch;

  const lipDenseV = g2(u, 0, 0.36, v, -0.37, 0.13);
  v = v + (-0.37 - v) * 0.28 * lipDenseV;

  for (const eyeU of [EYE_L_U, EYE_R_U]) {
    const du = u - eyeU;
    const dv = v - EYE_V;
    const normDist = Math.sqrt((du / 0.24) ** 2 + (dv / 0.15) ** 2);
    if (normDist > 0.38 && normDist < 1.35) {
      const pull = Math.sin(((normDist - 0.38) / 0.97) * Math.PI) * 0.12;
      u -= (du / (normDist + 0.001)) * pull * 0.16;
      v -= (dv / (normDist + 0.001)) * pull * 0.09;
    }
  }

  const jawTaper = v < 0 ? 1.0 - 0.25 * Math.pow(-v, 1.48) : 1.0 - 0.07 * Math.pow(v, 1.8);
  const xWidth = 1.04 * jawTaper;
  const x = u * xWidth;

  const cylAngle = Math.min(1.22, Math.abs(u) * 1.18);
  let z = Math.cos(cylAngle) * 0.68;

  const verticalArch = 1.0 - 0.32 * v * v - (v < -0.55 ? 0.55 * Math.pow(-v - 0.55, 1.7) : 0);
  z *= Math.max(0.15, verticalArch);

  z += 0.16 * g1(v, 0.62, 0.34) * Math.cos(u * 1.1);
  z += 0.09 * g2(u, -0.28, 0.22, v, 0.33, 0.065);
  z += 0.09 * g2(u, 0.28, 0.22, v, 0.33, 0.065);
  z += 0.06 * g2(u, 0, 0.14, v, 0.31, 0.06);

  z -= 0.07 * g2(u, 0, 0.16, v, 0.23, 0.06);

  const socketL = g2(u, EYE_L_U, 0.155, v, EYE_V, 0.088);
  const socketR = g2(u, EYE_R_U, 0.155, v, EYE_V, 0.088);
  z -= 0.17 * (socketL + socketR);

  const lidRimL = g2(u, EYE_L_U, 0.135, v, EYE_V, 0.068) - g2(u, EYE_L_U, 0.095, v, EYE_V, 0.042);
  const lidRimR = g2(u, EYE_R_U, 0.135, v, EYE_V, 0.068) - g2(u, EYE_R_U, 0.095, v, EYE_V, 0.042);
  z += 0.065 * Math.max(0, lidRimL + lidRimR);

  const bridgeProfile =
    smoothstep(0.26, 0.06, v) * smoothstep(-0.14, -0.04, v) * 0.24 +
    g1(v, -0.06, 0.075) * 0.14;
  const noseBridgeWidth = g1(u, 0, 0.082 + Math.max(0, -v) * 0.045);
  z += bridgeProfile * noseBridgeWidth;

  z += 0.23 * g2(u, 0, 0.088, v, -0.085, 0.068);
  z += 0.10 * g2(u, -0.105, 0.055, v, -0.115, 0.048);
  z += 0.10 * g2(u, 0.105, 0.055, v, -0.115, 0.048);
  z -= 0.04 * g2(u, -0.055, 0.032, v, -0.145, 0.025);
  z -= 0.04 * g2(u, 0.055, 0.032, v, -0.145, 0.025);

  z += 0.14 * g2(u, -0.39, 0.21, v, -0.01, 0.19);
  z += 0.14 * g2(u, 0.39, 0.21, v, -0.01, 0.19);
  z -= 0.045 * g2(u, -0.44, 0.18, v, -0.34, 0.18);
  z -= 0.045 * g2(u, 0.44, 0.18, v, -0.34, 0.18);

  const maxillaMound = g2(u, 0, 0.28, v, -0.34, 0.16);
  z += 0.11 * maxillaMound;
  z -= 0.035 * g2(u, 0, 0.038, v, -0.24, 0.065);

  const lipWidthEnv = g1(u, 0, 0.22);
  const cupidsBow = 1.0 - 0.22 * g1(u, 0, 0.038);
  const upperLip = g1(v, -0.315, 0.034) * lipWidthEnv * cupidsBow;
  const lowerLip = g1(v, -0.415, 0.042) * g1(u, 0, 0.20);
  const mouthSeamCleft = g1(v, -0.362, 0.014) * g1(u, 0, 0.23);

  z += 0.145 * upperLip;
  z += 0.155 * lowerLip;
  z -= 0.085 * mouthSeamCleft;

  z -= 0.075 * g2(u, 0, 0.24, v, -0.52, 0.055);
  z += 0.155 * g2(u, 0, 0.22, v, -0.71, 0.145);

  let y = v * 1.34;

  const browInfluence = g2(u, -0.28, 0.20, v, 0.33, 0.08) + g2(u, 0.28, 0.20, v, 0.33, 0.08);
  y += surprise * 0.055 * browInfluence;

  if (v < -0.362) {
    const lowerJawWeight = smoothstep(-0.362, -0.45, v) * g1(u, 0, 0.55);
    y -= surprise * 0.095 * lowerJawWeight;
    z -= surprise * 0.03 * lowerJawWeight;
  }

  for (const eyeU of [EYE_L_U, EYE_R_U]) {
    const lidRegion = g2(u, eyeU, 0.14, v, EYE_V, 0.08);
    if (lidRegion > 0.05 && blink > 0.01) {
      y += (EYE_V * 1.34 - y) * blink * 0.65 * lidRegion;
    }
  }

  return [x, y, z];
}

function AnatomicalWireframeHead({
  isSurprised,
  pointerRef,
  surfaceColor,
  wireColor,
}: {
  isSurprised: boolean;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  surfaceColor: string;
  wireColor: string;
}) {
  const headGroupRef = useRef<THREE.Group>(null);
  const leftEyeGroupRef = useRef<THREE.Group>(null);
  const rightEyeGroupRef = useRef<THREE.Group>(null);
  const surpriseValRef = useRef(0);
  const blinkValRef = useRef(0);
  const nextBlinkTimeRef = useRef(2.4);

  const COLS = 50;
  const ROWS = 62;

  const baseTopology = useMemo(() => {
    const validGrid: boolean[][] = Array.from({ length: ROWS + 1 }, () =>
      Array(COLS + 1).fill(false)
    );
    const uvGrid: [number, number][][] = Array.from({ length: ROWS + 1 }, () =>
      Array(COLS + 1).fill([0, 0])
    );

    for (let r = 0; r <= ROWS; r++) {
      const rawV = 1.0 - (r / ROWS) * 2.0;
      for (let c = 0; c <= COLS; c++) {
        const rawU = -1.0 + (c / COLS) * 2.0;
        uvGrid[r][c] = [rawU, rawV];
        if (isInsideMaskSilhouette(rawU, rawV) && !isInsideEyeSocket(rawU, rawV)) {
          validGrid[r][c] = true;
        }
      }
    }

    const triIndices: number[] = [];
    const linePairs: [number, number][] = [];
    const indexMap = (r: number, c: number) => r * (COLS + 1) + c;

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const i00 = indexMap(r, c);
        const i10 = indexMap(r, c + 1);
        const i01 = indexMap(r + 1, c);
        const i11 = indexMap(r + 1, c + 1);

        if (validGrid[r][c] && validGrid[r][c + 1]) {
          linePairs.push([i00, i10]);
        }
        if (validGrid[r][c] && validGrid[r + 1][c]) {
          linePairs.push([i00, i01]);
        }
        if (
          validGrid[r][c] &&
          validGrid[r][c + 1] &&
          validGrid[r + 1][c] &&
          validGrid[r + 1][c + 1]
        ) {
          triIndices.push(i00, i01, i10, i10, i01, i11);
        }
      }
    }

    const vertexCount = (ROWS + 1) * (COLS + 1);
    const positions = new Float32Array(vertexCount * 3);
    const linePositions = new Float32Array(linePairs.length * 6);

    for (let r = 0; r <= ROWS; r++) {
      for (let c = 0; c <= COLS; c++) {
        const idx = indexMap(r, c) * 3;
        const [u, v] = uvGrid[r][c];
        const [x, y, z] = evaluateAnatomicalFacePoint(u, v, 0, 0);
        positions[idx] = x;
        positions[idx + 1] = y;
        positions[idx + 2] = z;
      }
    }

    for (let i = 0; i < linePairs.length; i++) {
      const [a, b] = linePairs[i];
      linePositions[i * 6] = positions[a * 3];
      linePositions[i * 6 + 1] = positions[a * 3 + 1];
      linePositions[i * 6 + 2] = positions[a * 3 + 2];
      linePositions[i * 6 + 3] = positions[b * 3];
      linePositions[i * 6 + 4] = positions[b * 3 + 1];
      linePositions[i * 6 + 5] = positions[b * 3 + 2];
    }

    const surfaceGeo = new THREE.BufferGeometry();
    surfaceGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    surfaceGeo.setIndex(triIndices);

    const wireGeo = new THREE.BufferGeometry();
    wireGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));

    const orbitalRingsPos: number[] = [];
    const RINGS = 4;
    const SEGMENTS = 28;
    for (const eyeU of [EYE_L_U, EYE_R_U]) {
      for (let ring = 0; ring < RINGS; ring++) {
        const scale = 0.88 + ring * 0.22;
        for (let s = 0; s < SEGMENTS; s++) {
          const a0 = (s / SEGMENTS) * Math.PI * 2;
          const a1 = ((s + 1) / SEGMENTS) * Math.PI * 2;
          const u0 = eyeU + Math.cos(a0) * EYE_RX * scale;
          const v0 = EYE_V + Math.sin(a0) * EYE_RY * scale;
          const u1 = eyeU + Math.cos(a1) * EYE_RX * scale;
          const v1 = EYE_V + Math.sin(a1) * EYE_RY * scale;
          const p0 = evaluateAnatomicalFacePoint(u0, v0, 0, 0);
          const p1 = evaluateAnatomicalFacePoint(u1, v1, 0, 0);
          orbitalRingsPos.push(p0[0], p0[1], p0[2] + 0.004, p1[0], p1[1], p1[2] + 0.004);
        }
      }
    }
    const orbitalGeo = new THREE.BufferGeometry();
    orbitalGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(orbitalRingsPos), 3)
    );

    const lipDetailPos: number[] = [];
    const LIP_COLS = 36;
    const LIP_ROWS = 9;
    for (let r = 0; r <= LIP_ROWS; r++) {
      const lv = -0.285 - (r / LIP_ROWS) * 0.165;
      for (let c = 0; c < LIP_COLS; c++) {
        const lu0 = -0.23 + (c / LIP_COLS) * 0.46;
        const lu1 = -0.23 + ((c + 1) / LIP_COLS) * 0.46;
        const p0 = evaluateAnatomicalFacePoint(lu0, lv, 0, 0);
        const p1 = evaluateAnatomicalFacePoint(lu1, lv, 0, 0);
        lipDetailPos.push(p0[0], p0[1], p0[2] + 0.005, p1[0], p1[1], p1[2] + 0.005);
      }
    }
    const lipGeo = new THREE.BufferGeometry();
    lipGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(lipDetailPos), 3)
    );

    return { uvGrid, linePairs, surfaceGeo, wireGeo, orbitalGeo, lipGeo };
  }, []);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    const targetSurprise = isSurprised ? 1.0 : 0.0;
    surpriseValRef.current = THREE.MathUtils.lerp(
      surpriseValRef.current,
      targetSurprise,
      Math.min(1, delta * 12)
    );

    if (t > nextBlinkTimeRef.current) {
      const blinkPhase = (t - nextBlinkTimeRef.current) / 0.18;
      if (blinkPhase <= 1.0) {
        blinkValRef.current = Math.sin(blinkPhase * Math.PI);
      } else {
        blinkValRef.current = 0;
        nextBlinkTimeRef.current = t + 2.8 + (Math.sin(t * 7.3) + 1) * 0.9;
      }
    }

    const sVal = surpriseValRef.current;
    const bVal = blinkValRef.current;

    if (sVal > 0.005 || bVal > 0.005) {
      const posAttr = baseTopology.surfaceGeo.getAttribute("position") as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      const lineAttr = baseTopology.wireGeo.getAttribute("position") as THREE.BufferAttribute;
      const lineArr = lineAttr.array as Float32Array;

      let ptr = 0;
      for (let r = 0; r <= ROWS; r++) {
        for (let c = 0; c <= COLS; c++) {
          const [u, v] = baseTopology.uvGrid[r][c];
          const [x, y, z] = evaluateAnatomicalFacePoint(u, v, sVal, bVal);
          posArr[ptr++] = x;
          posArr[ptr++] = y;
          posArr[ptr++] = z;
        }
      }
      posAttr.needsUpdate = true;

      const pairs = baseTopology.linePairs;
      for (let i = 0; i < pairs.length; i++) {
        const [a, b] = pairs[i];
        lineArr[i * 6] = posArr[a * 3];
        lineArr[i * 6 + 1] = posArr[a * 3 + 1];
        lineArr[i * 6 + 2] = posArr[a * 3 + 2];
        lineArr[i * 6 + 3] = posArr[b * 3];
        lineArr[i * 6 + 4] = posArr[b * 3 + 1];
        lineArr[i * 6 + 5] = posArr[b * 3 + 2];
      }
      lineAttr.needsUpdate = true;
    }

    const px = pointerRef.current.x;
    const py = pointerRef.current.y;

    if (headGroupRef.current) {
      const baseThreeQuarterYaw = -0.36;
      const basePitch = 0.03;
      const targetYaw = baseThreeQuarterYaw + px * 0.20 + Math.sin(t * 0.55) * 0.025;
      const targetPitch = basePitch - py * 0.12 + Math.cos(t * 0.45) * 0.02 - sVal * 0.05;
      headGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        headGroupRef.current.rotation.y,
        targetYaw,
        Math.min(1, delta * 6)
      );
      headGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        headGroupRef.current.rotation.x,
        targetPitch,
        Math.min(1, delta * 6)
      );
    }

    for (const eyeRef of [leftEyeGroupRef, rightEyeGroupRef]) {
      if (eyeRef.current) {
        eyeRef.current.rotation.y = THREE.MathUtils.lerp(
          eyeRef.current.rotation.y,
          px * 0.36,
          Math.min(1, delta * 10)
        );
        eyeRef.current.rotation.x = THREE.MathUtils.lerp(
          eyeRef.current.rotation.x,
          -py * 0.26,
          Math.min(1, delta * 10)
        );
        const lidScaleY = Math.max(0.08, 1.0 - bVal * 0.92 + sVal * 0.18);
        eyeRef.current.scale.set(1, lidScaleY, 1);
      }
    }
  });

  const leftSocketCenter = useMemo(
    () => evaluateAnatomicalFacePoint(EYE_L_U, EYE_V, 0, 0),
    []
  );
  const rightSocketCenter = useMemo(
    () => evaluateAnatomicalFacePoint(EYE_R_U, EYE_V, 0, 0),
    []
  );

  return (
    <group
      ref={headGroupRef}
      position={[0.04, -0.03, 0]}
      rotation={[0.03, -0.36, -0.02]}
      scale={0.72}
    >
      <mesh data-testid="face-occlusion-mesh" geometry={baseTopology.surfaceGeo}>
        <meshBasicMaterial
          color={surfaceColor}
          side={THREE.DoubleSide}
          polygonOffset
          polygonOffsetFactor={1.5}
          polygonOffsetUnits={1.5}
        />
      </mesh>

      <lineSegments geometry={baseTopology.wireGeo}>
        <lineBasicMaterial color={wireColor} transparent opacity={0.92} />
      </lineSegments>

      <group data-testid="face-eyebrow-group">
        <lineSegments geometry={baseTopology.orbitalGeo}>
          <lineBasicMaterial color={wireColor} transparent opacity={0.86} />
        </lineSegments>
      </group>

      <group data-testid="face-mouth-group">
        <lineSegments geometry={baseTopology.lipGeo}>
          <lineBasicMaterial color={wireColor} transparent opacity={0.94} />
        </lineSegments>
      </group>

      <group
        ref={leftEyeGroupRef}
        data-testid="face-eyeball-left"
        position={[leftSocketCenter[0], leftSocketCenter[1], leftSocketCenter[2] + 0.045]}
      >
        <mesh>
          <sphereGeometry args={[0.084, 16, 16]} />
          <meshBasicMaterial
            color={surfaceColor}
            polygonOffset
            polygonOffsetFactor={1}
            polygonOffsetUnits={1}
          />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[0.088, 2]} />
          <meshBasicMaterial color={wireColor} wireframe transparent opacity={0.94} />
        </mesh>
      </group>

      <group
        ref={rightEyeGroupRef}
        data-testid="face-eyeball-right"
        position={[rightSocketCenter[0], rightSocketCenter[1], rightSocketCenter[2] + 0.045]}
      >
        <mesh>
          <sphereGeometry args={[0.084, 16, 16]} />
          <meshBasicMaterial
            color={surfaceColor}
            polygonOffset
            polygonOffsetFactor={1}
            polygonOffsetUnits={1}
          />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[0.088, 2]} />
          <meshBasicMaterial color={wireColor} wireframe transparent opacity={0.94} />
        </mesh>
      </group>
    </group>
  );
}

export function InteractiveFace3D() {
  const { theme } = usePreferences();
  const [isSurprised, setIsSurprised] = useState(false);
  const pointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isDark = theme === "dark";
  const surfaceColor = isDark ? "#0B0D12" : "#FFFFFF";
  const wireColor = isDark ? "#F8FAFC" : "#111111";

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

  const handleFaceClick = () => {
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
      className={`relative w-full h-[320px] sm:h-[360px] lg:h-[400px] p-4 sm:p-6 overflow-hidden select-none flex items-center justify-center transition-colors duration-300 ${
        isDark ? "bg-[#0B0D12]" : "bg-white"
      }`}
    >
      <div
        data-testid="neural-face-trigger"
        data-surprised={isSurprised ? "true" : "false"}
        onClick={handleFaceClick}
        className="w-full h-full max-w-[340px] max-h-[340px] mx-auto cursor-pointer flex items-center justify-center"
      >
        <Canvas camera={{ position: [0, 0, 4.25], fov: 34 }} dpr={[1, 2]}>
          <AnatomicalWireframeHead
            isSurprised={isSurprised}
            pointerRef={pointerRef}
            surfaceColor={surfaceColor}
            wireColor={wireColor}
          />
        </Canvas>
      </div>
    </div>
  );
}

export default InteractiveFace3D;
