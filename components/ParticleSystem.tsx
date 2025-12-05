import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ParticleShape } from '../types';
import { generateParticleTexture } from '../utils/textureGenerator';

interface ParticleSystemProps {
  count: number;
  shape: ParticleShape;
  color: string;
  isExpanded: boolean;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({ count, shape, color, isExpanded }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const expansionFactor = useRef(1.0); // Track current expansion state for smooth animation
  
  // Create a dummy object for matrix calculations
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate the texture based on the selected shape
  const texture = useMemo(() => {
    return generateParticleTexture(shape);
  }, [shape]);

  // Initialize particle data
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      // Create a concentrated sphere (initial state)
      // Use cubic root for uniform spherical distribution, or standard random for denser core
      // We want a "small ball" initially, so we limit the radius significantly
      const r = Math.pow(Math.random(), 1/3) * 4; // Radius ranges from 0 to 4
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      temp.push({
        initialPos: new THREE.Vector3(x, y, z),
        // Slower inherent velocity for a calmer look
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01
        ),
        rotSpeed: (Math.random() - 0.5) * 0.01,
        scale: Math.random() * 0.5 + 0.5,
        phase: Math.random() * Math.PI * 2
      });
    }
    return temp;
  }, [count]);

  // Animation Loop
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Smoothly interpolate expansion
    // Target: 1.0 (compact) vs 6.0 (dispersed)
    const targetExpansion = isExpanded ? 6.0 : 1.0;
    
    // Lerp factor controls the speed of dispersion/gathering
    // 0.03 is slow and smooth
    expansionFactor.current = THREE.MathUtils.lerp(expansionFactor.current, targetExpansion, 0.03);
    const currentExpansion = expansionFactor.current;

    particles.forEach((particle, i) => {
      const { initialPos, rotSpeed, scale, phase } = particle;
      
      // Calculate breathing motion (always active)
      const driftX = Math.sin(time * 0.5 + phase) * 0.5;
      const driftY = Math.cos(time * 0.3 + phase) * 0.5;
      const driftZ = Math.sin(time * 0.4 + phase) * 0.5;
      
      // Apply expansion to the position
      // We scale the initial position vector outwards
      const x = (initialPos.x + driftX) * currentExpansion;
      const y = (initialPos.y + driftY) * currentExpansion;
      const z = (initialPos.z + driftZ) * currentExpansion;

      dummy.position.set(x, y, z);
      
      // Rotation
      dummy.rotation.set(
        time * rotSpeed + phase, 
        time * rotSpeed + phase, 
        0
      );

      // Scale logic
      // Pulse + expand slightly when dispersed
      const pulse = 1 + Math.sin(time * 2 + phase) * 0.1;
      const expansionScaleBoost = THREE.MathUtils.lerp(1.0, 1.5, (currentExpansion - 1) / 5);
      const finalScale = scale * pulse * expansionScaleBoost;
      
      dummy.scale.set(finalScale, finalScale, finalScale);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {/* Slightly smaller particles for the denser core look */}
      <planeGeometry args={[0.8, 0.8]} />
      <meshBasicMaterial 
        map={texture} 
        color={color} 
        transparent 
        depthWrite={false} 
        blending={THREE.AdditiveBlending}
        opacity={0.6}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
};