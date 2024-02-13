import React, { Suspense } from "react";
import { Canvas } from "react-three-fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

const Model = ({ url }) => {
  const { scene } = useGLTF(url);

  // Set realistic materials for all meshes in the scene
  scene.traverse((child) => {
    if (child.isMesh) {
      // Use physically-based rendering (PBR) materials
      child.material.envMapIntensity = 2; // Adjust the environment map intensity
      child.material.metalness = 0.1; // Set metalness for a more realistic look
      child.material.roughness = 0.5; // Set roughness for reflections
      child.material.needsUpdate = true; // Ensure material updates are applied
    }
  });

  return <primitive object={scene} />;
};

const ModelViewer = ({ modelUrl, environmentMapUrl }) => {
  return (
    <Canvas camera={{ position: [0, 0, 0.8], fov: 45, near: 0.1, far: 100 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} />

      <Suspense fallback={null}>
        <Model url={modelUrl} />
        {environmentMapUrl && <EnvironmentMap url={environmentMapUrl} />}
      </Suspense>

      <OrbitControls />
    </Canvas>
  );
};

const EnvironmentMap = ({ url }) => {
  return (
    <mesh>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={useGLTF.preload(url)} side={THREE.BackSide} />
    </mesh>
  );
};

export default ModelViewer;
