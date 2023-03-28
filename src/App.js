import React, { Suspense, useMemo, useEffect } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import colorsPalettes from "nice-color-palettes";
import { Physics, useBox, useSphere, usePlane } from "@react-three/cannon";
import utils from "./utils";
import getDominos from "./helpers";
import "./styles.css";

const palette = colorsPalettes[10];

export default function App() {
  return (
    <Canvas shadows camera={{ position: [0, 4, 6] }}>
      <fog attach="fog" args={["#7C83FD", 0, 40]} />
      <OrbitControls />
      <ambientLight />
      <pointLight position={[10, 10, 10]} intensity={0.8} castShadow />
      <Suspense fallback={null}>
        <World />
      </Suspense>
    </Canvas>
  );
}

function World() {
  const [sphereMap, planeMap] = useTexture([
    "/map-sphere.jpg",
    "/map-plane.jpg"
  ]);
  return (
    <Physics
      allowSleep
      broadphase="Naive"
      iterations={20}
      tolerance={0.0001}
      defaultContactMaterial={{
        friction: 0.9,
        restitution: 0.7,
        contactEquationStiffness: 1e7,
        contactEquationRelaxation: 1,
        frictionEquationStiffness: 1e7,
        frictionEquationRelaxation: 2
      }}
    >
      <InstancedDominos />
      <Sphere
        map={sphereMap}
        color="#262A53"
        r={0.3}
        position={[-6, 0.4, -2]}
      />
      <Plane map={planeMap} />
    </Physics>
  );
}

function InstancedDominos() {
  const dominos = getDominos();
  const number = dominos.length;
  const args = [0.1, 1, 0.5];

  const [ref] = useBox((index) => ({
    ...dominos[index],
    mass: 1,
    args
  }));

  const colors = useMemo(() => {
    const array = new Float32Array(number * 3);
    const color = new THREE.Color();
    for (let i = 0; i < number; i++)
      color
        .set(utils.randChoise(palette))
        .convertSRGBToLinear()
        .toArray(array, i * 3);
    return array;
  }, [number]);

  return (
    <instancedMesh
      ref={ref}
      castShadow
      receiveShadow
      args={[null, null, number]}
    >
      <boxBufferGeometry attach="geometry" args={args}>
        <instancedBufferAttribute
          attachObject={["attributes", "color"]}
          args={[colors, 3]}
        />
      </boxBufferGeometry>
      <meshPhongMaterial attach="material" vertexColors={THREE.VertexColors} />
    </instancedMesh>
  );
}

function Sphere({ r = 0.5, position = [0, 2, 0], color, map }) {
  const [ref, api] = useSphere(() => ({
    mass: 1,
    args: r,
    position
  }));

  useEffect(() => {
    api.applyLocalForce([100, 0, 0], [0, 0, 0]);
  }, []);
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <sphereBufferGeometry args={[r, 32, 32]} />
      <meshPhongMaterial
        color={color}
        normalMap={map}
        normalScale={[1, 1]}
        normalMap-wrapS={THREE.RepeatWrapping}
        normalMap-wrapT={THREE.RepeatWrapping}
        normalMap-repeat={[10, 10]}
      />
    </mesh>
  );
}

function Plane({ map }) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0] }));
  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry args={[100, 100]} />
      <meshPhongMaterial
        color="#7C83FD"
        normalMap={map}
        normalScale={[1, 1]}
        normalMap-wrapS={THREE.RepeatWrapping}
        normalMap-wrapT={THREE.RepeatWrapping}
        normalMap-repeat={[10, 10]}
      />
    </mesh>
  );
}
