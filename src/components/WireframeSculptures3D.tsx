"use client";

import {
  Component,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  MathUtils,
  Quaternion,
  Vector3,
  type Group,
} from "three";
import { useMobileDevice } from "@/hooks/useMobileDevice";
import { usePreferences } from "@/hooks/usePreferences";
import type { ThemeMode } from "@/types/cv";

const GLOBE_RADIUS = 2.65;
const GLOBE_OCCLUSION_RADIUS = 2.63;
const LATITUDE_RINGS = 18;
const LONGITUDE_MERIDIANS = 24;
const GLOBE_RING_SEGMENTS = 72;

const VORTEX_RING_COUNT = 44;
const VORTEX_SEGMENTS = 128;

const KNOT_MAJOR_RADIUS = 1.05;
const KNOT_MINOR_RADIUS = 0.42;
const TUBE_RADIUS = 0.34;
const TUBE_OCCLUSION_RADIUS = 0.328;
const KNOT_STEPS = 180;
const TUBE_RADIAL_STEPS = 24;
const LONGITUDINAL_STRANDS = 20;
const CONTOUR_RING_COUNT = 36;
const RING_STEPS = 28;
const FLOW_SPEED = 0.85;

const SUBCUBE_SIZE = 0.6;
const CUBE_SPACING = 0.66;
const GRID_COORDS = [-1, 0, 1] as const;

type AxisName = "x" | "y" | "z";
type GridCoord = -1 | 0 | 1;

interface ActiveTurnState {
  axis: AxisName;
  layer: GridCoord;
  dir: 1 | -1;
  progress: number;
}

interface KnotScratch {
  prev: Vector3;
  next: Vector3;
  tangent: Vector3;
  radial: Vector3;
  center: Vector3;
  normal: Vector3;
  binormal: Vector3;
}

const AXES: readonly AxisName[] = ["x", "y", "z"];

const AXIS_VECTORS: Record<AxisName, Vector3> = {
  x: new Vector3(1, 0, 0),
  y: new Vector3(0, 1, 0),
  z: new Vector3(0, 0, 1),
};

class CanvasErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

function buildMeridianGridPositions() {
  const vertices: number[] = [];

  for (let i = 1; i <= LATITUDE_RINGS; i += 1) {
    const phi = (i / (LATITUDE_RINGS + 1)) * Math.PI;
    const y = Math.cos(phi) * GLOBE_RADIUS;
    const ringRadius = Math.sin(phi) * GLOBE_RADIUS;

    for (let step = 0; step < GLOBE_RING_SEGMENTS; step += 1) {
      const thetaStart = (step / GLOBE_RING_SEGMENTS) * Math.PI * 2;
      const thetaEnd = ((step + 1) / GLOBE_RING_SEGMENTS) * Math.PI * 2;

      vertices.push(
        Math.cos(thetaStart) * ringRadius,
        y,
        Math.sin(thetaStart) * ringRadius,
        Math.cos(thetaEnd) * ringRadius,
        y,
        Math.sin(thetaEnd) * ringRadius,
      );
    }
  }

  for (let j = 0; j < LONGITUDE_MERIDIANS; j += 1) {
    const theta = (j / LONGITUDE_MERIDIANS) * Math.PI * 2;
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);

    for (let step = 0; step < GLOBE_RING_SEGMENTS; step += 1) {
      const phiStart = (step / GLOBE_RING_SEGMENTS) * Math.PI;
      const phiEnd = ((step + 1) / GLOBE_RING_SEGMENTS) * Math.PI;
      const rStart = Math.sin(phiStart) * GLOBE_RADIUS;
      const rEnd = Math.sin(phiEnd) * GLOBE_RADIUS;

      vertices.push(
        rStart * cosTheta,
        Math.cos(phiStart) * GLOBE_RADIUS,
        rStart * sinTheta,
        rEnd * cosTheta,
        Math.cos(phiEnd) * GLOBE_RADIUS,
        rEnd * sinTheta,
      );
    }
  }

  return new Float32Array(vertices);
}

const meridianGridPositions = buildMeridianGridPositions();

function MeridianGlobeMesh({ theme }: { theme: ThemeMode }) {
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
          <sphereGeometry args={[GLOBE_OCCLUSION_RADIUS, 48, 48]} />
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
              args={[meridianGridPositions, 3]}
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

export function MeridianGlobeBackground() {
  const { theme } = usePreferences();
  const { isMobile } = useMobileDevice();

  return (
    <div
      data-testid="neural-globe-bg"
      data-theme-mode={theme}
      data-globe-style="y2k-meridian"
      data-mobile-optimized={isMobile ? "true" : "false"}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      <div data-testid="y2k-globe-meridians" className="h-full w-full">
        <CanvasErrorBoundary>
          <Canvas
            camera={{ position: [0, 0, 5.8], fov: 45 }}
            dpr={isMobile ? [1, 1] : [1, 1.5]}
          >
            <MeridianGlobeMesh theme={theme} />
          </Canvas>
        </CanvasErrorBoundary>
      </div>
    </div>
  );
}

function computeVortexPoint(
  s: number,
  theta: number,
  t: number,
  impulse: number,
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

function OpticalVortexMesh({
  isSurprised,
  pointerRef,
  isDark,
  isMobile,
}: {
  isSurprised: boolean;
  pointerRef: MutableRefObject<{ x: number; y: number }>;
  isDark: boolean;
  isMobile: boolean;
}) {
  const groupRef = useRef<Group>(null);
  const flowPhaseRef = useRef(0);
  const waveTimeRef = useRef(0);
  const impulseRef = useRef(0);

  const ringBuffers = useMemo(() => {
    const createBufferGeometry = (ringTotal: number) => {
      const geo = new BufferGeometry();
      geo.setAttribute(
        "position",
        new BufferAttribute(
          new Float32Array(ringTotal * VORTEX_SEGMENTS * 6),
          3,
        ),
      );
      return geo;
    };

    return {
      outerBoundaryGeo: createBufferGeometry(3),
      innerBoundaryGeo: createBufferGeometry(2),
      coralWaveGeo: createBufferGeometry(10),
      cobaltWaveGeo: createBufferGeometry(16),
      primaryCoreGeo: createBufferGeometry(18),
    };
  }, []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const targetImpulse = isSurprised ? 1.0 : 0.0;
    impulseRef.current = MathUtils.lerp(
      impulseRef.current,
      targetImpulse,
      Math.min(1, dt * 10),
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
      sValue: number,
    ) => {
      let base = ringOffsetIndex * VORTEX_SEGMENTS * 6;
      let prev = computeVortexPoint(sValue, 0, t, imp);

      for (let seg = 1; seg <= VORTEX_SEGMENTS; seg++) {
        const theta = (seg / VORTEX_SEGMENTS) * Math.PI * 2;
        const curr = computeVortexPoint(sValue, theta, t, imp);

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
      "position",
    ) as BufferAttribute;
    const outerArr = outerAttr.array as Float32Array;
    writeRingIntoArray(outerArr, 0, 0.0);
    writeRingIntoArray(outerArr, 1, 0.018);
    writeRingIntoArray(outerArr, 2, 0.036);
    outerAttr.needsUpdate = true;

    const innerAttr = ringBuffers.innerBoundaryGeo.getAttribute(
      "position",
    ) as BufferAttribute;
    const innerArr = innerAttr.array as Float32Array;
    writeRingIntoArray(innerArr, 0, 0.985);
    writeRingIntoArray(innerArr, 1, 1.0);
    innerAttr.needsUpdate = true;

    const coralAttr = ringBuffers.coralWaveGeo.getAttribute(
      "position",
    ) as BufferAttribute;
    const cobaltAttr = ringBuffers.cobaltWaveGeo.getAttribute(
      "position",
    ) as BufferAttribute;
    const primaryAttr = ringBuffers.primaryCoreGeo.getAttribute(
      "position",
    ) as BufferAttribute;

    const coralArr = coralAttr.array as Float32Array;
    const cobaltArr = cobaltAttr.array as Float32Array;
    const primaryArr = primaryAttr.array as Float32Array;

    let coralIdx = 0;
    let cobaltIdx = 0;
    let primaryIdx = 0;
    const ringStep = isMobile ? 2 : 1;

    for (let i = 0; i < VORTEX_RING_COUNT; i += ringStep) {
      const s = 0.04 + ((i + phase) / VORTEX_RING_COUNT) * 0.94;
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
    ringBuffers.coralWaveGeo.setDrawRange(0, coralIdx * VORTEX_SEGMENTS * 2);
    ringBuffers.cobaltWaveGeo.setDrawRange(0, cobaltIdx * VORTEX_SEGMENTS * 2);
    ringBuffers.primaryCoreGeo.setDrawRange(
      0,
      primaryIdx * VORTEX_SEGMENTS * 2,
    );

    if (groupRef.current) {
      const px = pointerRef.current.x;
      const py = pointerRef.current.y;
      const targetRotY = px * 0.42 + Math.sin(t * 0.45) * 0.18;
      const targetRotX = -py * 0.36 + Math.cos(t * 0.35) * 0.14;
      const targetRotZ = Math.sin(t * 0.25) * 0.08 + imp * 0.25;

      groupRef.current.rotation.y = MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotY,
        Math.min(1, dt * 6),
      );
      groupRef.current.rotation.x = MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotX,
        Math.min(1, dt * 6),
      );
      groupRef.current.rotation.z = MathUtils.lerp(
        groupRef.current.rotation.z,
        targetRotZ,
        Math.min(1, dt * 6),
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
        <meshBasicMaterial color={coreSurfaceColor} side={DoubleSide} />
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

export function OpticalVortexSculpture() {
  const { theme } = usePreferences();
  const { isMobile } = useMobileDevice();
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
      data-mobile-optimized={isMobile ? "true" : "false"}
      className={`relative w-full h-full overflow-hidden select-none flex items-center justify-center transition-colors duration-300 ${
        isMobile
          ? "min-h-[230px] max-h-[250px] p-3"
          : "min-h-[380px] lg:min-h-[440px] p-4 sm:p-6"
      } ${isDark ? "bg-[#12151E]" : "bg-white"}`}
    >
      <div
        data-testid="vortex-sculpture-trigger"
        data-surprised={isSurprised ? "true" : "false"}
        onClick={handleVortexClick}
        className="w-full h-full max-w-[390px] max-h-[390px] mx-auto cursor-pointer flex items-center justify-center"
      >
        <div
          data-testid="neural-face-trigger"
          data-surprised={isSurprised ? "true" : "false"}
          onClick={handleVortexClick}
          onTouchStart={handleVortexClick}
          className="w-full h-full flex items-center justify-center"
        >
          <CanvasErrorBoundary>
            <Canvas
              camera={{ position: [0, 0, 3.65], fov: 38 }}
              dpr={isMobile ? [1, 1] : [1, 2]}
            >
              <OpticalVortexMesh
                isSurprised={isSurprised}
                pointerRef={pointerRef}
                isDark={isDark}
                isMobile={isMobile}
              />
            </Canvas>
          </CanvasErrorBoundary>
        </div>
      </div>
    </div>
  );
}

function createKnotScratch(): KnotScratch {
  return {
    prev: new Vector3(),
    next: new Vector3(),
    tangent: new Vector3(),
    radial: new Vector3(),
    center: new Vector3(),
    normal: new Vector3(),
    binormal: new Vector3(),
  };
}

function evaluateKnotCenter(u: number, time: number, target: Vector3) {
  const phi = 3 * u;
  const theta = 2 * u;
  const radialBreath = 1 + 0.045 * Math.sin(time * 1.4 + phi);
  const axialBreath = 1 + 0.06 * Math.cos(time * 1.15 + theta);
  const ringRadius =
    (KNOT_MAJOR_RADIUS + KNOT_MINOR_RADIUS * Math.cos(phi)) * radialBreath;
  target.set(
    ringRadius * Math.cos(theta),
    ringRadius * Math.sin(theta),
    KNOT_MINOR_RADIUS * Math.sin(phi) * axialBreath,
  );
}

function evaluateKnotFrame(u: number, time: number, scratch: KnotScratch) {
  const eps = 0.002;
  evaluateKnotCenter(u, time, scratch.center);
  evaluateKnotCenter(u - eps, time, scratch.prev);
  evaluateKnotCenter(u + eps, time, scratch.next);
  scratch.tangent.subVectors(scratch.next, scratch.prev).normalize();
  scratch.radial.set(Math.cos(2 * u), Math.sin(2 * u), 0);
  scratch.binormal.crossVectors(scratch.tangent, scratch.radial).normalize();
  scratch.normal.crossVectors(scratch.binormal, scratch.tangent).normalize();
}

function buildLinearSegmentIndices(lineCount: number, stepsPerLine: number) {
  const stride = stepsPerLine + 1;
  const indices = new Uint16Array(lineCount * stepsPerLine * 2);
  let cursor = 0;
  for (let line = 0; line < lineCount; line++) {
    const base = line * stride;
    for (let step = 0; step < stepsPerLine; step++) {
      indices[cursor++] = base + step;
      indices[cursor++] = base + step + 1;
    }
  }
  return indices;
}

function buildClosedLoopIndices(loopCount: number, sidesPerLoop: number) {
  const indices = new Uint16Array(loopCount * sidesPerLoop * 2);
  let cursor = 0;
  for (let loop = 0; loop < loopCount; loop++) {
    const base = loop * sidesPerLoop;
    for (let side = 0; side < sidesPerLoop; side++) {
      indices[cursor++] = base + side;
      indices[cursor++] = base + ((side + 1) % sidesPerLoop);
    }
  }
  return indices;
}

function buildTubeIndices(longSteps: number, radialSteps: number) {
  const stride = radialSteps + 1;
  const indices = new Uint16Array(longSteps * radialSteps * 6);
  let cursor = 0;
  for (let i = 0; i < longSteps; i++) {
    for (let j = 0; j < radialSteps; j++) {
      const a = i * stride + j;
      const b = (i + 1) * stride + j;
      const c = (i + 1) * stride + (j + 1);
      const d = i * stride + (j + 1);
      indices[cursor++] = a;
      indices[cursor++] = d;
      indices[cursor++] = b;
      indices[cursor++] = d;
      indices[cursor++] = c;
      indices[cursor++] = b;
    }
  }
  return indices;
}

function updateTrefoilBuffers(
  time: number,
  tubePositions: Float32Array,
  strokeStrandPositions: Float32Array,
  accentStrandPositions: Float32Array,
  strokeRingPositions: Float32Array,
  accentRingPositions: Float32Array,
  scratch: KnotScratch,
) {
  const flowOffset = time * FLOW_SPEED;
  const tubeStride = TUBE_RADIAL_STEPS + 1;
  const strandStride = KNOT_STEPS + 1;
  const twoPi = Math.PI * 2;

  for (let i = 0; i <= KNOT_STEPS; i++) {
    const u = (i / KNOT_STEPS) * twoPi;
    evaluateKnotFrame(u, time, scratch);
    const { center, normal, binormal } = scratch;

    const tubeRowOffset = i * tubeStride * 3;
    for (let j = 0; j <= TUBE_RADIAL_STEPS; j++) {
      const phi = (j / TUBE_RADIAL_STEPS) * twoPi;
      const cosP = Math.cos(phi);
      const sinP = Math.sin(phi);
      const outIdx = tubeRowOffset + j * 3;
      tubePositions[outIdx] =
        center.x + (normal.x * cosP + binormal.x * sinP) * TUBE_OCCLUSION_RADIUS;
      tubePositions[outIdx + 1] =
        center.y + (normal.y * cosP + binormal.y * sinP) * TUBE_OCCLUSION_RADIUS;
      tubePositions[outIdx + 2] =
        center.z + (normal.z * cosP + binormal.z * sinP) * TUBE_OCCLUSION_RADIUS;
    }

    const torsionWave = 0.48 * Math.sin(3 * (u - flowOffset));
    let strokeIdx = 0;
    let accentIdx = 0;

    for (let s = 0; s < LONGITUDINAL_STRANDS; s++) {
      const baseAngle = (s / LONGITUDINAL_STRANDS) * twoPi;
      const phi = baseAngle + u + torsionWave;
      const cosP = Math.cos(phi);
      const sinP = Math.sin(phi);
      const px =
        center.x + (normal.x * cosP + binormal.x * sinP) * TUBE_RADIUS;
      const py =
        center.y + (normal.y * cosP + binormal.y * sinP) * TUBE_RADIUS;
      const pz =
        center.z + (normal.z * cosP + binormal.z * sinP) * TUBE_RADIUS;

      if (s === 0 || s === 10) {
        const outIdx = (accentIdx * strandStride + i) * 3;
        accentStrandPositions[outIdx] = px;
        accentStrandPositions[outIdx + 1] = py;
        accentStrandPositions[outIdx + 2] = pz;
        accentIdx++;
      } else {
        const outIdx = (strokeIdx * strandStride + i) * 3;
        strokeStrandPositions[outIdx] = px;
        strokeStrandPositions[outIdx + 1] = py;
        strokeStrandPositions[outIdx + 2] = pz;
        strokeIdx++;
      }
    }
  }

  let strokeRingSlot = 0;
  let accentRingSlot = 0;

  for (let k = 0; k < CONTOUR_RING_COUNT; k++) {
    const uRing = ((k / CONTOUR_RING_COUNT) * twoPi + flowOffset) % twoPi;
    evaluateKnotFrame(uRing, time, scratch);
    const { center, normal, binormal } = scratch;
    const isAccentRing = k % 12 === 0;
    const targetArray = isAccentRing ? accentRingPositions : strokeRingPositions;
    const baseVertex =
      (isAccentRing ? accentRingSlot++ : strokeRingSlot++) * RING_STEPS;

    for (let m = 0; m < RING_STEPS; m++) {
      const phi = (m / RING_STEPS) * twoPi;
      const cosP = Math.cos(phi);
      const sinP = Math.sin(phi);
      const outIdx = (baseVertex + m) * 3;
      targetArray[outIdx] =
        center.x + (normal.x * cosP + binormal.x * sinP) * TUBE_RADIUS;
      targetArray[outIdx + 1] =
        center.y + (normal.y * cosP + binormal.y * sinP) * TUBE_RADIUS;
      targetArray[outIdx + 2] =
        center.z + (normal.z * cosP + binormal.z * sinP) * TUBE_RADIUS;
    }
  }
}

function TrefoilKnotMesh({
  strokeColor,
  accentColor,
  occlusionColor,
}: {
  strokeColor: string;
  accentColor: string;
  occlusionColor: string;
}) {
  const groupRef = useRef<Group>(null);
  const tubePosRef = useRef<BufferAttribute>(null);
  const strokeStrandPosRef = useRef<BufferAttribute>(null);
  const accentStrandPosRef = useRef<BufferAttribute>(null);
  const strokeRingPosRef = useRef<BufferAttribute>(null);
  const accentRingPosRef = useRef<BufferAttribute>(null);

  const buffers = useMemo(() => {
    const scratch = createKnotScratch();
    const tubeVertexCount = (KNOT_STEPS + 1) * (TUBE_RADIAL_STEPS + 1);
    const tubePositions = new Float32Array(tubeVertexCount * 3);
    const tubeIndices = buildTubeIndices(KNOT_STEPS, TUBE_RADIAL_STEPS);

    const accentStrandCount = 2;
    const strokeStrandCount = LONGITUDINAL_STRANDS - accentStrandCount;
    const strandVertexPerLine = KNOT_STEPS + 1;

    const strokeStrandPositions = new Float32Array(
      strokeStrandCount * strandVertexPerLine * 3,
    );
    const strokeStrandIndices = buildLinearSegmentIndices(
      strokeStrandCount,
      KNOT_STEPS,
    );

    const accentStrandPositions = new Float32Array(
      accentStrandCount * strandVertexPerLine * 3,
    );
    const accentStrandIndices = buildLinearSegmentIndices(
      accentStrandCount,
      KNOT_STEPS,
    );

    const accentRingCount = 3;
    const strokeRingCount = CONTOUR_RING_COUNT - accentRingCount;

    const strokeRingPositions = new Float32Array(
      strokeRingCount * RING_STEPS * 3,
    );
    const strokeRingIndices = buildClosedLoopIndices(
      strokeRingCount,
      RING_STEPS,
    );

    const accentRingPositions = new Float32Array(
      accentRingCount * RING_STEPS * 3,
    );
    const accentRingIndices = buildClosedLoopIndices(
      accentRingCount,
      RING_STEPS,
    );

    updateTrefoilBuffers(
      0,
      tubePositions,
      strokeStrandPositions,
      accentStrandPositions,
      strokeRingPositions,
      accentRingPositions,
      scratch,
    );

    return {
      scratch,
      tubePositions,
      tubeIndices,
      strokeStrandPositions,
      strokeStrandIndices,
      accentStrandPositions,
      accentStrandIndices,
      strokeRingPositions,
      strokeRingIndices,
      accentRingPositions,
      accentRingIndices,
    };
  }, []);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    updateTrefoilBuffers(
      elapsed,
      buffers.tubePositions,
      buffers.strokeStrandPositions,
      buffers.accentStrandPositions,
      buffers.strokeRingPositions,
      buffers.accentRingPositions,
      buffers.scratch,
    );

    if (tubePosRef.current) tubePosRef.current.needsUpdate = true;
    if (strokeStrandPosRef.current) {
      strokeStrandPosRef.current.needsUpdate = true;
    }
    if (accentStrandPosRef.current) {
      accentStrandPosRef.current.needsUpdate = true;
    }
    if (strokeRingPosRef.current) strokeRingPosRef.current.needsUpdate = true;
    if (accentRingPosRef.current) accentRingPosRef.current.needsUpdate = true;

    if (groupRef.current) {
      groupRef.current.rotation.set(
        0.42 + Math.cos(elapsed * 0.28) * 0.14,
        0.25 + Math.sin(elapsed * 0.35) * 0.18,
        0,
      );
    }
  });

  return (
    <group ref={groupRef} scale={0.76} rotation={[0.42, 0.25, 0]}>
      <mesh>
        <bufferGeometry>
          <bufferAttribute
            ref={tubePosRef}
            attach="attributes-position"
            args={[buffers.tubePositions, 3]}
          />
          <bufferAttribute attach="index" args={[buffers.tubeIndices, 1]} />
        </bufferGeometry>
        <meshBasicMaterial
          color={occlusionColor}
          polygonOffset
          polygonOffsetFactor={1}
          polygonOffsetUnits={1}
        />
      </mesh>

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            ref={strokeStrandPosRef}
            attach="attributes-position"
            args={[buffers.strokeStrandPositions, 3]}
          />
          <bufferAttribute
            attach="index"
            args={[buffers.strokeStrandIndices, 1]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={strokeColor} transparent opacity={0.84} />
      </lineSegments>

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            ref={accentStrandPosRef}
            attach="attributes-position"
            args={[buffers.accentStrandPositions, 3]}
          />
          <bufferAttribute
            attach="index"
            args={[buffers.accentStrandIndices, 1]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={accentColor} />
      </lineSegments>

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            ref={strokeRingPosRef}
            attach="attributes-position"
            args={[buffers.strokeRingPositions, 3]}
          />
          <bufferAttribute
            attach="index"
            args={[buffers.strokeRingIndices, 1]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={strokeColor} transparent opacity={0.78} />
      </lineSegments>

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            ref={accentRingPosRef}
            attach="attributes-position"
            args={[buffers.accentRingPositions, 3]}
          />
          <bufferAttribute
            attach="index"
            args={[buffers.accentRingIndices, 1]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={accentColor} />
      </lineSegments>
    </group>
  );
}

export function TrefoilKnotSculpture({
  className = "w-full h-full",
}: {
  className?: string;
}) {
  const { theme } = usePreferences();
  const { isMobile } = useMobileDevice();
  const strokeColor = theme === "dark" ? "#F4F4F6" : "#111111";
  const accentColor = "#2563EB";
  const occlusionColor = theme === "dark" ? "#0A0A0C" : "#F7F6F2";

  return (
    <div
      data-testid="sculpture-trefoil-knot"
      data-loop-mode="rope-flow"
      data-theme-mode={theme}
      data-mobile-optimized={isMobile ? "true" : "false"}
      aria-hidden="true"
      className={isMobile ? "w-full h-28 md:h-40" : className}
    >
      <CanvasErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 4.2], fov: 40 }}
          dpr={isMobile ? [1, 1] : [1, 2]}
        >
          <TrefoilKnotMesh
            strokeColor={strokeColor}
            accentColor={accentColor}
            occlusionColor={occlusionColor}
          />
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}

function appendFaceSquareSegments(
  segments: number[],
  faceAxis: AxisName,
  faceSign: 1 | -1,
  offset: number,
  halfSize: number,
) {
  const pushPoint = (a: number, b: number) => {
    if (faceAxis === "x") {
      segments.push(faceSign * offset, a, b);
    } else if (faceAxis === "y") {
      segments.push(a, faceSign * offset, b);
    } else {
      segments.push(a, b, faceSign * offset);
    }
  };

  const corners: readonly [number, number][] = [
    [-halfSize, -halfSize],
    [halfSize, -halfSize],
    [halfSize, halfSize],
    [-halfSize, halfSize],
  ];

  for (let i = 0; i < 4; i++) {
    const [a0, b0] = corners[i];
    const [a1, b1] = corners[(i + 1) % 4];
    pushPoint(a0, b0);
    pushPoint(a1, b1);
  }
}

function buildSubCubeWireGeometry() {
  const outerSegments: number[] = [];
  const innerSegments: number[] = [];
  const halfOuter = 0.296;
  const halfInner = 0.214;

  for (const axis of AXES) {
    for (const sign of [-1, 1] as const) {
      appendFaceSquareSegments(outerSegments, axis, sign, 0.301, halfOuter);
      appendFaceSquareSegments(innerSegments, axis, sign, 0.302, halfInner);
    }
  }

  const outerGeo = new BufferGeometry();
  outerGeo.setAttribute(
    "position",
    new BufferAttribute(new Float32Array(outerSegments), 3),
  );

  const innerGeo = new BufferGeometry();
  innerGeo.setAttribute(
    "position",
    new BufferAttribute(new Float32Array(innerSegments), 3),
  );

  return { outerGeo, innerGeo };
}

function rotateGridCoord90(
  coord: [GridCoord, GridCoord, GridCoord],
  axis: AxisName,
  dir: 1 | -1,
) {
  const [x, y, z] = coord;
  if (axis === "x") {
    coord[1] = (Math.round(-dir * z) || 0) as GridCoord;
    coord[2] = (Math.round(dir * y) || 0) as GridCoord;
  } else if (axis === "y") {
    coord[0] = (Math.round(dir * z) || 0) as GridCoord;
    coord[2] = (Math.round(-dir * x) || 0) as GridCoord;
  } else {
    coord[0] = (Math.round(-dir * y) || 0) as GridCoord;
    coord[1] = (Math.round(dir * x) || 0) as GridCoord;
  }
}

function pickNextTurn(prev: ActiveTurnState): ActiveTurnState {
  for (;;) {
    const axis = AXES[Math.floor(Math.random() * AXES.length)];
    const layer = GRID_COORDS[Math.floor(Math.random() * GRID_COORDS.length)];
    const dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1;
    const isImmediateUndo =
      axis === prev.axis && layer === prev.layer && dir === -prev.dir;
    if (!isImmediateUndo) {
      return { axis, layer, dir, progress: 0 };
    }
  }
}

function RubiksCubeMesh({
  strokeColor,
  occlusionColor,
}: {
  strokeColor: string;
  occlusionColor: string;
}) {
  const assemblyRef = useRef<Group>(null);
  const cubieRefs = useRef<(Group | null)[]>([]);

  const initialCoords = useMemo(() => {
    const list: [GridCoord, GridCoord, GridCoord][] = [];
    for (const gx of GRID_COORDS) {
      for (const gy of GRID_COORDS) {
        for (const gz of GRID_COORDS) {
          list.push([gx, gy, gz]);
        }
      }
    }
    return list;
  }, []);

  const coordsRef = useRef<[GridCoord, GridCoord, GridCoord][]>(
    initialCoords.map(([gx, gy, gz]) => [gx, gy, gz]),
  );

  const activeTurnRef = useRef<ActiveTurnState>({
    axis: "y",
    layer: 1,
    dir: 1,
    progress: 0,
  });

  const turnScratch = useMemo(
    () => ({
      quat: new Quaternion(),
      pos: new Vector3(),
    }),
    [],
  );

  const wireGeos = useMemo(() => buildSubCubeWireGeometry(), []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    let turn = activeTurnRef.current;
    turn.progress += dt * 1.85;

    if (turn.progress >= 1) {
      const finishedAxisIndex = AXES.indexOf(turn.axis);
      for (let i = 0; i < coordsRef.current.length; i++) {
        if (coordsRef.current[i][finishedAxisIndex] === turn.layer) {
          rotateGridCoord90(coordsRef.current[i], turn.axis, turn.dir);
        }
      }
      turn = pickNextTurn(turn);
      activeTurnRef.current = turn;
    }

    const t = Math.min(1, turn.progress);
    const eased = t * t * (3 - 2 * t);
    const angle = eased * turn.dir * (Math.PI / 2);
    const axisIndex = AXES.indexOf(turn.axis);
    turnScratch.quat.setFromAxisAngle(AXIS_VECTORS[turn.axis], angle);

    for (let i = 0; i < coordsRef.current.length; i++) {
      const cubie = cubieRefs.current[i];
      if (!cubie) continue;
      const [gx, gy, gz] = coordsRef.current[i];
      turnScratch.pos.set(
        gx * CUBE_SPACING,
        gy * CUBE_SPACING,
        gz * CUBE_SPACING,
      );

      if (coordsRef.current[i][axisIndex] === turn.layer) {
        turnScratch.pos.applyQuaternion(turnScratch.quat);
        cubie.position.copy(turnScratch.pos);
        cubie.quaternion.copy(turnScratch.quat);
      } else {
        cubie.position.copy(turnScratch.pos);
        cubie.quaternion.identity();
      }
    }

    if (assemblyRef.current) {
      assemblyRef.current.rotation.set(
        0.52,
        state.clock.getElapsedTime() * 0.18,
        0.18,
      );
    }
  });

  return (
    <group ref={assemblyRef} scale={0.84} rotation={[0.52, 0, 0.18]}>
      {initialCoords.map(([gx, gy, gz], index) => (
        <group
          key={`${gx}-${gy}-${gz}`}
          ref={(el) => {
            cubieRefs.current[index] = el;
          }}
          position={[gx * CUBE_SPACING, gy * CUBE_SPACING, gz * CUBE_SPACING]}
        >
          <mesh>
            <boxGeometry args={[SUBCUBE_SIZE, SUBCUBE_SIZE, SUBCUBE_SIZE]} />
            <meshBasicMaterial
              color={occlusionColor}
              polygonOffset
              polygonOffsetFactor={1}
              polygonOffsetUnits={1}
            />
          </mesh>
          <lineSegments geometry={wireGeos.outerGeo}>
            <lineBasicMaterial
              color={strokeColor}
              transparent
              opacity={0.9}
            />
          </lineSegments>
          <lineSegments geometry={wireGeos.innerGeo}>
            <lineBasicMaterial
              color={strokeColor}
              transparent
              opacity={0.62}
            />
          </lineSegments>
        </group>
      ))}
    </group>
  );
}

export function RubiksCubeSculpture({
  className = "w-full h-full",
}: {
  className?: string;
}) {
  const { theme } = usePreferences();
  const { isMobile } = useMobileDevice();
  const strokeColor = theme === "dark" ? "#F4F4F6" : "#111111";
  const occlusionColor = theme === "dark" ? "#0A0A0C" : "#F7F6F2";

  return (
    <div
      data-testid="sculpture-rubiks-cube"
      data-slice-mode="all-9-random"
      data-loop-mode="seamless-3d"
      data-theme-mode={theme}
      data-mobile-optimized={isMobile ? "true" : "false"}
      aria-hidden="true"
      className={isMobile ? "w-full h-28 md:h-40" : className}
    >
      <div
        data-testid="sculpture-rubik-cube"
        data-slice-mode="all-9-random"
        data-loop-mode="seamless-3d"
        className="w-full h-full"
      >
        <CanvasErrorBoundary>
          <Canvas
            camera={{ position: [0, 0, 4.2], fov: 40 }}
            dpr={isMobile ? [1, 1] : [1, 2]}
          >
            <RubiksCubeMesh
              strokeColor={strokeColor}
              occlusionColor={occlusionColor}
            />
          </Canvas>
        </CanvasErrorBoundary>
      </div>
    </div>
  );
}
