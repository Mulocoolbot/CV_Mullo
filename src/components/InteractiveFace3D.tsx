"use client";

import {
  Component,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MathUtils, type Group } from "three";
import { themeTokens, usePreferences } from "@/hooks/usePreferences";
import type { ThemeMode } from "@/types/cv";

type Point3D = [number, number, number];

interface FacialNeuralData {
  primaryNodes: Float32Array;
  coralNodes: Float32Array;
  synapseLines: Float32Array;
  nodeCount: number;
  edgeCount: number;
}

interface EyeNeuralData {
  orbitalNodes: Float32Array;
  orbitalLines: Float32Array;
  irisNodes: Float32Array;
  irisLines: Float32Array;
}

interface BrowNeuralData {
  nodes: Float32Array;
  lines: Float32Array;
}

interface MouthNeuralData {
  upperLipNodes: Float32Array;
  upperLipLines: Float32Array;
  lowerLipNodes: Float32Array;
  lowerLipLines: Float32Array;
  webLines: Float32Array;
}

function buildLineBuffer(
  points: Point3D[],
  edges: [number, number][]
): Float32Array {
  const coords: number[] = [];
  for (const [a, b] of edges) {
    coords.push(...points[a], ...points[b]);
  }
  return new Float32Array(coords);
}

function buildFacialNeuralNetwork(): FacialNeuralData {
  const points: Point3D[] = [];

  const pushUniquePoint = (x: number, y: number, z: number, minGap = 0.1) => {
    const minGapSq = minGap * minGap;
    for (const [px, py, pz] of points) {
      const dx = x - px;
      const dy = y - py;
      const dz = z - pz;
      if (dx * dx + dy * dy + dz * dz < minGapSq) {
        return;
      }
    }
    points.push([
      Number(x.toFixed(4)),
      Number(y.toFixed(4)),
      Number(z.toFixed(4)),
    ]);
  };

  const sculptSurfacePoint = (t: number, theta: number): Point3D => {
    const y = t * 1.28;
    const rx =
      t >= 0
        ? 0.96 * Math.pow(Math.max(0.02, 1 - t * t * 0.86), 0.42)
        : 0.93 * Math.max(0.18, 1 - 0.64 * Math.pow(-t, 1.38));
    const rz =
      t >= 0
        ? 0.84 * Math.pow(Math.max(0.02, 1 - t * t * 0.82), 0.44)
        : 0.78 * Math.max(0.24, 1 - 0.56 * Math.pow(-t, 1.32));

    const nx = Math.sin(theta);
    const nz = Math.cos(theta);
    const absNx = Math.abs(nx);

    const x = nx * rx;
    let z = nz * rz + 0.04;

    if (nz > 0.08) {
      const browBoost =
        Math.exp(-Math.pow((t - 0.36) / 0.13, 2)) *
        Math.exp(-Math.pow(absNx / 0.68, 2)) *
        0.095;
      const socketRecess =
        Math.exp(-Math.pow((t - 0.16) / 0.15, 2)) *
        Math.exp(-Math.pow((absNx - 0.47) / 0.21, 2)) *
        -0.085;
      const noseRamp =
        t >= -0.14 && t <= 0.35 ? 1 - Math.abs(t + 0.08) / 0.48 : 0;
      const noseBoost =
        Math.max(0, noseRamp) * Math.exp(-Math.pow(absNx / 0.17, 2)) * 0.34;
      const cheekBoost =
        Math.exp(-Math.pow((t + 0.03) / 0.18, 2)) *
        Math.exp(-Math.pow((absNx - 0.58) / 0.24, 2)) *
        0.1;
      const templeIndent =
        Math.exp(-Math.pow((t - 0.28) / 0.19, 2)) *
        Math.exp(-Math.pow((absNx - 0.88) / 0.14, 2)) *
        -0.045;
      const muzzleBoost =
        Math.exp(-Math.pow((t + 0.41) / 0.22, 2)) *
        Math.exp(-Math.pow(absNx / 0.42, 2)) *
        0.075;
      const chinBoost =
        Math.exp(-Math.pow((t + 0.87) / 0.16, 2)) *
        Math.exp(-Math.pow(absNx / 0.34, 2)) *
        0.105;

      z +=
        browBoost +
        socketRecess +
        noseBoost +
        cheekBoost +
        templeIndent +
        muzzleBoost +
        chinBoost;
    }

    return [x, y, z];
  };

  pushUniquePoint(0, 1.32, 0.04, 0.05);

  const verticalSlices = 18;
  for (let v = 1; v < verticalSlices; v += 1) {
    const t = 1 - (2 * v) / verticalSlices;
    const frontCols = Math.max(10, Math.round(17 - Math.abs(t) * 4));

    for (let c = 0; c < frontCols; c += 1) {
      const ratio = frontCols === 1 ? 0 : (2 * c) / (frontCols - 1) - 1;
      const theta = ratio * Math.PI * 0.72;
      const [sx, sy, sz] = sculptSurfacePoint(t, theta);
      pushUniquePoint(sx, sy, sz);
    }

    if (t > -0.55) {
      for (const backTheta of [
        -Math.PI * 0.85,
        Math.PI * 0.85,
        -Math.PI * 0.95,
        Math.PI * 0.95,
        Math.PI,
      ]) {
        const [bx, by, bz] = sculptSurfacePoint(t, backTheta);
        pushUniquePoint(bx, by, bz, 0.16);
      }
    }
  }

  const noseLandmarks: Point3D[] = [
    [0, 0.44, 0.83],
    [0, 0.31, 0.9],
    [0, 0.16, 0.98],
    [0, 0.01, 1.07],
    [0, -0.11, 1.13],
    [0, -0.2, 0.97],
    [-0.1, 0.22, 0.84],
    [0.1, 0.22, 0.84],
    [-0.12, 0.03, 0.91],
    [0.12, 0.03, 0.91],
    [-0.18, -0.12, 0.88],
    [0.18, -0.12, 0.88],
    [-0.12, -0.18, 0.95],
    [0.12, -0.18, 0.95],
  ];
  for (const [nx, ny, nz] of noseLandmarks) {
    pushUniquePoint(nx, ny, nz, 0.085);
  }

  const philtrumAndJawLandmarks: Point3D[] = [
    [-0.07, -0.28, 0.86],
    [0.07, -0.28, 0.86],
    [-0.28, -0.26, 0.77],
    [0.28, -0.26, 0.77],
    [-0.44, -0.46, 0.65],
    [0.44, -0.46, 0.65],
    [-0.78, -0.34, 0.34],
    [0.78, -0.34, 0.34],
    [-0.64, -0.76, 0.35],
    [0.64, -0.76, 0.35],
    [-0.36, -1.08, 0.56],
    [0.36, -1.08, 0.56],
    [-0.15, -1.21, 0.68],
    [0.15, -1.21, 0.68],
    [0, -1.27, 0.7],
  ];
  for (const [jx, jy, jz] of philtrumAndJawLandmarks) {
    pushUniquePoint(jx, jy, jz, 0.095);
  }

  const cheekboneAndBrowLandmarks: Point3D[] = [
    [-0.72, 0.52, 0.56],
    [0.72, 0.52, 0.56],
    [-0.45, 0.58, 0.73],
    [0.45, 0.58, 0.73],
    [-0.18, 0.56, 0.84],
    [0.18, 0.56, 0.84],
    [-0.68, 0.04, 0.66],
    [0.68, 0.04, 0.66],
    [-0.86, 0.24, 0.38],
    [0.86, 0.24, 0.38],
    [-0.92, -0.06, 0.32],
    [0.92, -0.06, 0.32],
  ];
  for (const [cx, cy, cz] of cheekboneAndBrowLandmarks) {
    pushUniquePoint(cx, cy, cz, 0.095);
  }

  const interiorCount = 72;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < interiorCount; i += 1) {
    const t = 0.86 - (i / (interiorCount - 1)) * 1.58;
    const radialEnvelope = Math.sqrt(Math.max(0.08, 1 - t * t * 0.78));
    const layerScale = i % 2 === 0 ? 0.6 : 0.42;
    const angle = i * goldenAngle;
    const ix = Math.cos(angle) * radialEnvelope * 0.88 * layerScale;
    const iy = t * 1.14;
    const iz = Math.sin(angle) * radialEnvelope * 0.78 * layerScale;
    pushUniquePoint(ix, iy, iz, 0.13);
  }

  const maxEdgeDistance = 0.36;
  const maxDistSq = maxEdgeDistance * maxEdgeDistance;
  const lineCoords: number[] = [];
  let edgeCount = 0;

  for (let i = 0; i < points.length; i += 1) {
    const [ax, ay, az] = points[i];
    for (let j = i + 1; j < points.length; j += 1) {
      const [bx, by, bz] = points[j];
      const dx = ax - bx;
      const dy = ay - by;
      const dz = az - bz;
      const distSq = dx * dx + dy * dy + dz * dz;
      if (distSq < maxDistSq) {
        lineCoords.push(ax, ay, az, bx, by, bz);
        edgeCount += 1;
      }
    }
  }

  const primaryCoords: number[] = [];
  const coralCoords: number[] = [];

  for (let i = 0; i < points.length; i += 1) {
    if (i % 5 === 0) {
      coralCoords.push(...points[i]);
    } else {
      primaryCoords.push(...points[i]);
    }
  }

  return {
    primaryNodes: new Float32Array(primaryCoords),
    coralNodes: new Float32Array(coralCoords),
    synapseLines: new Float32Array(lineCoords),
    nodeCount: points.length,
    edgeCount,
  };
}

function buildNeuralEyeGeometry(): EyeNeuralData {
  const orbitalPoints: Point3D[] = [];
  const orbitalEdges: [number, number][] = [];

  for (let i = 0; i < 12; i += 1) {
    const angle = (i / 12) * Math.PI * 2;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    orbitalPoints.push([
      cos * 0.225,
      sin * 0.125 * (1 - 0.18 * cos * cos),
      -0.02 * Math.abs(cos),
    ]);
  }

  for (let i = 0; i < 12; i += 1) {
    const angle = ((i + 0.5) / 12) * Math.PI * 2;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    orbitalPoints.push([cos * 0.295, sin * 0.2, -0.045]);
  }

  for (let i = 0; i < 12; i += 1) {
    const next = (i + 1) % 12;
    const outerCurr = 12 + i;
    const outerPrev = 12 + ((i + 11) % 12);
    const outerNext = 12 + next;
    const outerSkip = 12 + ((i + 2) % 12);

    orbitalEdges.push([i, next]);
    orbitalEdges.push([outerCurr, outerNext]);
    orbitalEdges.push([i, outerCurr]);
    orbitalEdges.push([i, outerPrev]);
    orbitalEdges.push([outerCurr, outerSkip]);
  }

  const irisPoints: Point3D[] = [];
  const irisEdges: [number, number][] = [];

  for (let i = 0; i < 12; i += 1) {
    const angle = (i / 12) * Math.PI * 2;
    irisPoints.push([Math.cos(angle) * 0.1, Math.sin(angle) * 0.1, 0.032]);
  }

  for (let i = 0; i < 10; i += 1) {
    const angle = ((i + 0.35) / 10) * Math.PI * 2;
    irisPoints.push([
      Math.cos(angle) * 0.056,
      Math.sin(angle) * 0.056,
      0.042,
    ]);
  }

  for (let i = 0; i < 5; i += 1) {
    const angle = (i / 5) * Math.PI * 2;
    irisPoints.push([
      Math.cos(angle) * 0.024,
      Math.sin(angle) * 0.024,
      0.049,
    ]);
  }
  irisPoints.push([0, 0, 0.053]);

  for (let i = 0; i < 12; i += 1) {
    irisEdges.push([i, (i + 1) % 12]);
    const innerMatch = 12 + Math.round((i / 12) * 10) % 10;
    const innerNext = 12 + ((Math.round((i / 12) * 10) + 1) % 10);
    irisEdges.push([i, innerMatch]);
    irisEdges.push([i, innerNext]);
  }

  for (let i = 0; i < 10; i += 1) {
    const curr = 12 + i;
    const next = 12 + ((i + 1) % 10);
    const pupilMatch = 22 + (Math.floor(i / 2) % 5);
    const pupilNext = 22 + ((Math.floor(i / 2) + 1) % 5);
    irisEdges.push([curr, next]);
    irisEdges.push([curr, pupilMatch]);
    irisEdges.push([curr, pupilNext]);
  }

  for (let i = 0; i < 5; i += 1) {
    const pCurr = 22 + i;
    const pNext = 22 + ((i + 1) % 5);
    irisEdges.push([pCurr, pNext]);
    irisEdges.push([pCurr, 27]);
  }

  return {
    orbitalNodes: new Float32Array(orbitalPoints.flat()),
    orbitalLines: buildLineBuffer(orbitalPoints, orbitalEdges),
    irisNodes: new Float32Array(irisPoints.flat()),
    irisLines: buildLineBuffer(irisPoints, irisEdges),
  };
}

function buildNeuralBrowGeometry(direction: -1 | 1): BrowNeuralData {
  const browPoints: Point3D[] = [
    [-0.25 * direction, -0.045, -0.02],
    [-0.17 * direction, 0.015, 0.005],
    [-0.08 * direction, 0.048, 0.02],
    [0.01 * direction, 0.055, 0.024],
    [0.1 * direction, 0.046, 0.02],
    [0.18 * direction, 0.018, 0.008],
    [0.25 * direction, -0.02, -0.01],
    [-0.21 * direction, 0.005, -0.015],
    [-0.12 * direction, 0.068, 0.012],
    [-0.02 * direction, 0.09, 0.02],
    [0.08 * direction, 0.085, 0.018],
    [0.16 * direction, 0.055, 0.008],
    [0.23 * direction, 0.015, -0.01],
  ];

  const edges: [number, number][] = [];
  for (let i = 0; i < 6; i += 1) {
    edges.push([i, i + 1]);
  }
  for (let i = 7; i < 12; i += 1) {
    edges.push([i, i + 1]);
  }
  edges.push([0, 7]);
  edges.push([6, 12]);
  for (let i = 0; i < 6; i += 1) {
    edges.push([i, 7 + i]);
    edges.push([i + 1, 7 + i]);
  }

  return {
    nodes: new Float32Array(browPoints.flat()),
    lines: buildLineBuffer(browPoints, edges),
  };
}

function buildNeuralMouthGeometry(): MouthNeuralData {
  const upperPoints: Point3D[] = [];
  const lowerPoints: Point3D[] = [];

  for (let i = 0; i < 12; i += 1) {
    const t = (2 * i) / 11 - 1;
    const x = t * 0.27;
    const cupidsBow =
      Math.exp(-Math.pow((Math.abs(t) - 0.25) / 0.16, 2)) * 0.022 -
      Math.exp(-Math.pow(t / 0.11, 2)) * 0.014;
    const y = 0.064 * (1 - t * t) + cupidsBow;
    const z = 0.045 * (1 - t * t);
    upperPoints.push([x, y, z]);
  }

  for (let i = 0; i < 6; i += 1) {
    const t = ((2 * i) / 5 - 1) * 0.72;
    const x = t * 0.27;
    const y = 0.028 * (1 - t * t);
    const z = 0.03 * (1 - t * t);
    upperPoints.push([x, y, z]);
  }

  for (let i = 0; i < 12; i += 1) {
    const t = (2 * i) / 11 - 1;
    const x = t * 0.265;
    const y = -0.072 * (1 - t * t * 0.9);
    const z = 0.042 * (1 - t * t);
    lowerPoints.push([x, y, z]);
  }

  for (let i = 0; i < 6; i += 1) {
    const t = ((2 * i) / 5 - 1) * 0.72;
    const x = t * 0.265;
    const y = -0.028 * (1 - t * t * 0.9);
    const z = 0.026 * (1 - t * t);
    lowerPoints.push([x, y, z]);
  }

  const upperEdges: [number, number][] = [];
  for (let i = 0; i < 11; i += 1) {
    upperEdges.push([i, i + 1]);
  }
  for (let i = 12; i < 17; i += 1) {
    upperEdges.push([i, i + 1]);
  }
  upperEdges.push([0, 12], [1, 12], [2, 12], [3, 13], [4, 13], [5, 14]);
  upperEdges.push([6, 15], [7, 15], [8, 16], [9, 16], [10, 17], [11, 17]);
  upperEdges.push([2, 13], [5, 15], [6, 14], [9, 17]);

  const lowerEdges: [number, number][] = [];
  for (let i = 0; i < 11; i += 1) {
    lowerEdges.push([i, i + 1]);
  }
  for (let i = 12; i < 17; i += 1) {
    lowerEdges.push([i, i + 1]);
  }
  lowerEdges.push([0, 12], [1, 12], [2, 12], [3, 13], [4, 13], [5, 14]);
  lowerEdges.push([6, 15], [7, 15], [8, 16], [9, 16], [10, 17], [11, 17]);
  lowerEdges.push([2, 13], [5, 15], [6, 14], [9, 17]);

  const webCoords: number[] = [];
  const connectAcross = (ua: number, lb: number) => {
    webCoords.push(...upperPoints[ua], ...lowerPoints[lb]);
  };
  connectAcross(0, 0);
  connectAcross(11, 11);
  connectAcross(0, 12);
  connectAcross(12, 0);
  connectAcross(11, 17);
  connectAcross(17, 11);
  for (let i = 0; i < 6; i += 1) {
    connectAcross(12 + i, 12 + i);
    if (i < 5) {
      connectAcross(12 + i, 13 + i);
      connectAcross(13 + i, 12 + i);
    }
  }
  for (const idx of [1, 3, 5, 6, 8, 10]) {
    connectAcross(idx, idx);
  }

  return {
    upperLipNodes: new Float32Array(upperPoints.flat()),
    upperLipLines: buildLineBuffer(upperPoints, upperEdges),
    lowerLipNodes: new Float32Array(lowerPoints.flat()),
    lowerLipLines: buildLineBuffer(lowerPoints, lowerEdges),
    webLines: new Float32Array(webCoords),
  };
}

const facialNetwork = buildFacialNeuralNetwork();
const eyeGeometry = buildNeuralEyeGeometry();
const leftBrowGeometry = buildNeuralBrowGeometry(-1);
const rightBrowGeometry = buildNeuralBrowGeometry(1);
const mouthGeometry = buildNeuralMouthGeometry();

const BROW_BASE_Y = 0.44;
const CORAL_HEX = "#FF5A36";

class FaceCanvasBoundary extends Component<
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

function NeuralFaceMesh({
  isSurprised,
  theme,
}: {
  isSurprised: boolean;
  theme: ThemeMode;
}) {
  const headRef = useRef<Group>(null);
  const leftEyeGroup = useRef<Group>(null);
  const rightEyeGroup = useRef<Group>(null);
  const leftIrisGroup = useRef<Group>(null);
  const rightIrisGroup = useRef<Group>(null);
  const leftBrowGroup = useRef<Group>(null);
  const rightBrowGroup = useRef<Group>(null);
  const mouthGroup = useRef<Group>(null);
  const upperLipRef = useRef<Group>(null);
  const lowerLipRef = useRef<Group>(null);
  const mouthWebRef = useRef<Group>(null);

  const secondaryHex = themeTokens[theme].secondaryHex;
  const activeHex = isSurprised ? CORAL_HEX : secondaryHex;

  useFrame(({ clock, pointer }) => {
    const elapsed = clock.getElapsedTime();
    const blinkPhase = elapsed % 3.2;
    let blinkScaleY = 1;

    if (!isSurprised && blinkPhase < 0.18) {
      blinkScaleY = 1 - Math.sin((blinkPhase / 0.18) * Math.PI) * 0.95;
    }

    if (headRef.current) {
      const vibrationY = isSurprised ? Math.sin(elapsed * 46) * 0.042 : 0;
      const vibrationX = isSurprised ? Math.cos(elapsed * 38) * 0.02 : 0;

      headRef.current.rotation.y = MathUtils.lerp(
        headRef.current.rotation.y,
        pointer.x * 0.45 + vibrationY,
        0.14
      );
      headRef.current.rotation.x = MathUtils.lerp(
        headRef.current.rotation.x,
        -pointer.y * 0.32 + vibrationX,
        0.14
      );
      headRef.current.position.z = MathUtils.lerp(
        headRef.current.position.z,
        isSurprised ? -0.22 : 0,
        0.2
      );
    }

    const targetEyeScaleX = isSurprised ? 1.6 : 1;
    const targetEyeScaleY = isSurprised ? 1.6 : blinkScaleY;

    for (const eye of [leftEyeGroup.current, rightEyeGroup.current]) {
      if (!eye) continue;
      eye.scale.x = MathUtils.lerp(eye.scale.x, targetEyeScaleX, 0.24);
      eye.scale.y = MathUtils.lerp(eye.scale.y, targetEyeScaleY, 0.36);
    }

    const gazeX = pointer.x * 0.09;
    const gazeY = pointer.y * 0.09;
    for (const iris of [leftIrisGroup.current, rightIrisGroup.current]) {
      if (!iris) continue;
      iris.position.x = MathUtils.lerp(iris.position.x, gazeX, 0.24);
      iris.position.y = MathUtils.lerp(iris.position.y, gazeY, 0.24);
    }

    const targetBrowY = isSurprised ? BROW_BASE_Y + 0.14 : BROW_BASE_Y;
    for (const brow of [leftBrowGroup.current, rightBrowGroup.current]) {
      if (!brow) continue;
      brow.position.y = MathUtils.lerp(brow.position.y, targetBrowY, 0.24);
    }

    if (mouthGroup.current) {
      const pulse = isSurprised ? 1 + Math.sin(elapsed * 24) * 0.04 : 1;
      const targetScaleX = isSurprised ? 1.18 * pulse : 1;
      const targetScaleY = isSurprised ? 1.45 * pulse : 0.22;
      const targetScaleZ = isSurprised ? 1.1 : 1;

      mouthGroup.current.scale.set(
        MathUtils.lerp(mouthGroup.current.scale.x, targetScaleX, 0.26),
        MathUtils.lerp(mouthGroup.current.scale.y, targetScaleY, 0.26),
        MathUtils.lerp(mouthGroup.current.scale.z, targetScaleZ, 0.26)
      );
    }

    if (upperLipRef.current) {
      upperLipRef.current.position.y = MathUtils.lerp(
        upperLipRef.current.position.y,
        isSurprised ? 0.015 : 0,
        0.26
      );
    }
    if (lowerLipRef.current) {
      lowerLipRef.current.position.y = MathUtils.lerp(
        lowerLipRef.current.position.y,
        isSurprised ? -0.018 : 0,
        0.26
      );
    }
    if (mouthWebRef.current) {
      mouthWebRef.current.scale.y = MathUtils.lerp(
        mouthWebRef.current.scale.y,
        isSurprised ? 1.24 : 1,
        0.26
      );
    }
  });

  const eyeAnchors = [
    {
      id: "left-eye",
      position: [-0.46, 0.21, 0.72] as Point3D,
      eyeRef: leftEyeGroup,
      irisRef: leftIrisGroup,
    },
    {
      id: "right-eye",
      position: [0.46, 0.21, 0.72] as Point3D,
      eyeRef: rightEyeGroup,
      irisRef: rightIrisGroup,
    },
  ];

  const browAnchors = [
    {
      id: "left-brow",
      position: [-0.46, BROW_BASE_Y, 0.75] as Point3D,
      ref: leftBrowGroup,
      data: leftBrowGeometry,
    },
    {
      id: "right-brow",
      position: [0.46, BROW_BASE_Y, 0.75] as Point3D,
      ref: rightBrowGroup,
      data: rightBrowGeometry,
    },
  ];

  return (
    <group ref={headRef}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[facialNetwork.synapseLines, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={activeHex}
          transparent
          opacity={isSurprised ? 0.56 : 0.34}
        />
      </lineSegments>

      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[facialNetwork.primaryNodes, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color={activeHex}
          size={isSurprised ? 0.048 : 0.036}
          sizeAttenuation
        />
      </points>

      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[facialNetwork.coralNodes, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color={CORAL_HEX}
          size={isSurprised ? 0.056 : 0.044}
          sizeAttenuation
        />
      </points>

      {eyeAnchors.map((eye) => (
        <group key={eye.id} ref={eye.eyeRef} position={eye.position}>
          <lineSegments>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[eyeGeometry.orbitalLines, 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color={activeHex}
              transparent
              opacity={isSurprised ? 0.96 : 0.8}
            />
          </lineSegments>

          <points>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[eyeGeometry.orbitalNodes, 3]}
              />
            </bufferGeometry>
            <pointsMaterial
              color={activeHex}
              size={isSurprised ? 0.042 : 0.034}
              sizeAttenuation
            />
          </points>

          <group ref={eye.irisRef}>
            <lineSegments>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[eyeGeometry.irisLines, 3]}
                />
              </bufferGeometry>
              <lineBasicMaterial
                color={isSurprised ? CORAL_HEX : secondaryHex}
                transparent
                opacity={isSurprised ? 1 : 0.9}
              />
            </lineSegments>

            <points>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[eyeGeometry.irisNodes, 3]}
                />
              </bufferGeometry>
              <pointsMaterial
                color={isSurprised ? CORAL_HEX : secondaryHex}
                size={isSurprised ? 0.045 : 0.034}
                sizeAttenuation
              />
            </points>
          </group>
        </group>
      ))}

      {browAnchors.map((brow) => (
        <group key={brow.id} ref={brow.ref} position={brow.position}>
          <lineSegments>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[brow.data.lines, 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color={activeHex}
              transparent
              opacity={isSurprised ? 0.95 : 0.78}
            />
          </lineSegments>

          <points>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[brow.data.nodes, 3]}
              />
            </bufferGeometry>
            <pointsMaterial
              color={activeHex}
              size={isSurprised ? 0.042 : 0.034}
              sizeAttenuation
            />
          </points>
        </group>
      ))}

      <group ref={mouthGroup} position={[0, -0.5, 0.77]} scale={[1, 0.22, 1]}>
        <group ref={upperLipRef}>
          <lineSegments>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[mouthGeometry.upperLipLines, 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color={activeHex}
              transparent
              opacity={isSurprised ? 0.98 : 0.82}
            />
          </lineSegments>

          <points>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[mouthGeometry.upperLipNodes, 3]}
              />
            </bufferGeometry>
            <pointsMaterial
              color={activeHex}
              size={isSurprised ? 0.045 : 0.034}
              sizeAttenuation
            />
          </points>
        </group>

        <group ref={lowerLipRef}>
          <lineSegments>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[mouthGeometry.lowerLipLines, 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color={activeHex}
              transparent
              opacity={isSurprised ? 0.98 : 0.82}
            />
          </lineSegments>

          <points>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[mouthGeometry.lowerLipNodes, 3]}
              />
            </bufferGeometry>
            <pointsMaterial
              color={activeHex}
              size={isSurprised ? 0.045 : 0.034}
              sizeAttenuation
            />
          </points>
        </group>

        <group ref={mouthWebRef}>
          <lineSegments>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[mouthGeometry.webLines, 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color={isSurprised ? CORAL_HEX : secondaryHex}
              transparent
              opacity={isSurprised ? 0.88 : 0.56}
            />
          </lineSegments>
        </group>
      </group>
    </group>
  );
}

export function InteractiveFace3D() {
  const { theme, lang } = usePreferences();
  const tokens = themeTokens[theme];
  const [isSurprised, setIsSurprised] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleFaceClick = () => {
    setIsSurprised(true);
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setIsSurprised(false);
      timeoutRef.current = null;
    }, 950);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      data-testid="neural-face-trigger"
      data-cursor="pointer"
      data-surprised={isSurprised ? "true" : "false"}
      onClick={handleFaceClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleFaceClick();
        }
      }}
      aria-label={
        lang === "id"
          ? "Wajah Neural 3D interaktif, klik untuk reaksi terkejut"
          : "Interactive 3D Neural Face, click to trigger surprise reaction"
      }
      className={`relative h-80 w-full overflow-hidden rounded-3xl border shadow-lg backdrop-blur-md transition-colors lg:h-96 ${tokens.bgSurface} ${
        isSurprised ? "border-[#FF5A36]" : tokens.border
      }`}
    >
      <FaceCanvasBoundary fallback={<div className="h-full w-full" aria-hidden="true" />}>
        <Canvas camera={{ position: [0, 0, 4.15], fov: 42 }}>
          <NeuralFaceMesh isSurprised={isSurprised} theme={theme} />
        </Canvas>
      </FaceCanvasBoundary>
    </div>
  );
}
