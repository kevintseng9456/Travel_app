import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { SphereGeometry, MeshBasicMaterial, InstancedMesh, Object3D } from 'three';

const StarBackground = () => {
  const starsRef = useRef();
  const starCount = 5000;
  const radius = 120;

  useEffect(() => {
    if (starsRef.current) {
      const dummy = new Object3D();
      for (let i = 0; i < starCount; i++) {
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        const randomseed = Math.random()*2+0.6;

        const x = radius * Math.sin(phi) * Math.cos(theta)*randomseed;
        const y = radius * Math.sin(phi) * Math.sin(theta)*randomseed;
        const z = radius * Math.cos(phi)*randomseed;

        dummy.position.set(x, y, z);
        dummy.updateMatrix();
        starsRef.current.setMatrixAt(i, dummy.matrix);
      }
      starsRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [starCount, radius]);

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <instancedMesh ref={starsRef} args={[null, null, starCount]}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshBasicMaterial color={0xffffff} />
    </instancedMesh>
  );
};

export default StarBackground;
