import React, { Suspense, useEffect, useRef } from "react";
import { Canvas } from "react-three-fiber";
import { OrbitControls, Environment, useFBX, useGLTF } from "@react-three/drei";

const Model = ({ url, onClick }) => {
  if (!url) {
    return null;
  }

  // Check if the URL ends with ".fbx" to determine if it's an FBX model
  if (url.toLowerCase().endsWith(".fbx")) {
    const fbx = useFBX(url);
    return fbx ? (
      <primitive object={fbx} scale={0.005} onClick={onClick} />
    ) : null;
  }

  // Otherwise, assume it's a GLB model
  const { scene } = useGLTF(url);
  return scene ? <primitive object={scene} onClick={onClick} /> : null;
};

const ModelViewer = ({ modelUrl }) => {
  const group = useRef();

  useEffect(() => {
    if (group.current) {
      const boundingBox = new THREE.Box3().setFromObject(group.current);
      const center = boundingBox.getCenter(new THREE.Vector3());
      const size = boundingBox.getSize(new THREE.Vector3());

      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = 45;
      const cameraZ = Math.abs((maxDim / 2) * Math.tan((fov * Math.PI) / 360));
      const camera = group.current.getObjectByName("camera");

      if (camera) {
        camera.position.set(center.x, center.y, cameraZ);
        camera.lookAt(center.x, center.y, 0);
      }
    }
  }, [modelUrl]);

  return (
    <Canvas
      camera={{ position: [-0.5, 1, 2], fov: 45, near: 0.1, far: 100 }}
      shadows
      style={{ background: "#000000" }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight
        position={[3.3, 1.0, 4.4]}
        castShadow
        intensity={Math.PI * 2}
      />
      <directionalLight position={[0, 1, 0]} intensity={0.5} />
      <directionalLight position={[0, -1, 0]} intensity={0.5} />

      <group ref={group}>
        <Suspense fallback={null}>
          <Model url={modelUrl} />
        </Suspense>
      </group>

      <OrbitControls target={[0, 1, 0]} />
      {/* <Environment preset="city" background></Environment> */}
    </Canvas>
  );
};

export default ModelViewer;

// const Scene = () => {
//   const fbx = useFBX("https://klass-vr-file.s3.ap-south-1.amazonaws.com/3dmodels%2F997c0716-8ac1-445a-a2cf-e79f3c63eb11.fbx");

//   return <primitive object={fbx} scale={0.005} />;
// };

// const ModelViewer = () => {
//   return (
//     <div className="App">
//       <Canvas>
//         <Suspense fallback={null}>
//           <Scene />
//           <OrbitControls />
//           <Environment preset="sunset" background />
//         </Suspense>
//       </Canvas>
//     </div>
//   );
// };
