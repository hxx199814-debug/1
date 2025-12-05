import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { ParticleSystem } from './ParticleSystem';
import { ParticleShape } from '../types';

interface SceneProps {
  shape: ParticleShape;
  color: string;
  isExpanded: boolean;
  onExpandChange: (expanded: boolean) => void;
}

const Rig = () => {
  // Add a subtle overall camera movement
  useFrame((state) => {
    state.camera.position.lerp(new THREE.Vector3(state.pointer.x * 2, state.pointer.y * 2, 25), 0.05);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

const RotatingGroup = ({ children }: { children?: React.ReactNode }) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
      groupRef.current.rotation.z += delta * 0.05;
    }
  });
  return <group ref={groupRef}>{children}</group>;
};

export const Scene: React.FC<SceneProps> = ({ shape, color, isExpanded, onExpandChange }) => {
  
  const handlePointerDown = () => {
    onExpandChange(true);
  };

  const handlePointerUp = () => {
    onExpandChange(false);
  };

  return (
    <div 
      className="w-full h-full cursor-pointer"
      onMouseDown={handlePointerDown}
      onMouseUp={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchEnd={handlePointerUp}
      onMouseLeave={handlePointerUp} // Safety release
    >
      <Canvas
        camera={{ position: [0, 0, 30], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]} // Handle high DPI screens
      >
        <color attach="background" args={['#050505']} />
        
        {/* Lights */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color={color} />

        {/* Background Atmosphere */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        {/* Main Content */}
        <RotatingGroup>
          <ParticleSystem 
            count={1500} 
            shape={shape} 
            color={color} 
            isExpanded={isExpanded} 
          />
        </RotatingGroup>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          enableRotate={true} 
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
        
        {/* Camera Rig disabled to allow OrbitControls to work smoothly, 
            or we can use it for parallax if we disable OrbitControls */}
        {/* <Rig /> */}
        
      </Canvas>
    </div>
  );
};