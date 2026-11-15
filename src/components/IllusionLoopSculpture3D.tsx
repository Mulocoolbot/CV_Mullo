"use client";

import { Component, useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  BufferAttribute,
  BufferGeometry,
  Quaternion,
  Vector3,
  type Group,
} from "three";
import { usePreferences } from "@/hooks/usePreferences";
import type { ThemeMode } from "@/types/cv";

export interface IllusionLoopSculptureProps {
  variant: "rubik" | "trefoil";
  className?: string;
}

const KNOT_MAJOR_RADIUS = 1.05;
const KNOT_MINOR_RADIUS = 0.42;
const TUBE_RADIUS = 0.34;
const OCCLUSION_RADIUS = 0.328;
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

const AXES: readonly AxisName[] = ["x", "y", "z"];

const AXIS_VECTORS: Record<AxisName, Vector3> = {
  x: new Vector3(1, 0, 0),
  y: new Vector3(0, 1, 0),
  z: new Vector3(0, 0, 1),
};

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

interface KnotScratch {
  prev: Vector3;
  next: Vector3;
  tangent: Vector3;
  radial: Vector3;
  center: Vector3;
  normal: Vector3;
  binormal: Vector3;
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
        center.x + (normal.x * cosP + binormal.x * sinP) * OCCLUSION_RADIUS;
      tubePositions[outIdx + 1] =
        center.y + (normal.y * cosP + binormal.y * sinP) * OCCLUSION_RADIUS;
      tubePositions[outIdx + 2] =
        center.z + (normal.z * cosP + binormal.z * sinP) * OCCLUSION_RADIUS;
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
    const uRing = (((k / CONTOUR_RING_COUNT) * twoPi + flowOffset) % twoPi);
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

function TrefoilIllusionSculpture({
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
          <bufferAttribute
            attach="index"
            args={[buffers.tubeIndices, 1]}
          />
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

function RubikIllusionSculpture({
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

class SculptureCanvasBoundary extends Component<
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

export function IllusionLoopSculpture3D({
  variant,
  className,
}: IllusionLoopSculptureProps) {
  const { theme }: { theme: ThemeMode } = usePreferences();
  const strokeColor = theme === "dark" ? "#F4F4F6" : "#111111";
  const accentColor = "#2563EB";
  const occlusionColor = theme === "dark" ? "#0A0A0C" : "#F7F6F2";

  return (
    <div
      data-testid={
        variant === "rubik" ? "sculpture-rubik-cube" : "sculpture-trefoil-knot"
      }
      data-loop-mode="seamless-3d"
      aria-hidden="true"
      className={className}
    >
      <SculptureCanvasBoundary>
        <Canvas camera={{ position: [0, 0, 4.2], fov: 40 }}>
          {variant === "rubik" ? (
            <RubikIllusionSculpture
              strokeColor={strokeColor}
              occlusionColor={occlusionColor}
            />
          ) : (
            <TrefoilIllusionSculpture
              strokeColor={strokeColor}
              accentColor={accentColor}
              occlusionColor={occlusionColor}
            />
          )}
        </Canvas>
      </SculptureCanvasBoundary>
    </div>
  );
}

export default IllusionLoopSculpture3D;
