import * as THREE from 'three';
import { ParticleShape } from '../types';

export const generateParticleTexture = (shape: ParticleShape): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  const cx = 64;
  const cy = 64;
  const radius = 50;

  ctx.clearRect(0, 0, 128, 128);
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.save();
  ctx.translate(cx, cy);

  switch (shape) {
    case ParticleShape.Circle:
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();
      // Add a soft glow gradient
      {
        const gradient = ctx.createRadialGradient(0, 0, radius * 0.2, 0, 0, radius);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = gradient;
        ctx.fill();
      }
      break;

    case ParticleShape.Star:
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * radius, Math.sin((18 + i * 72) * Math.PI / 180) * radius);
        ctx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * (radius * 0.4), Math.sin((54 + i * 72) * Math.PI / 180) * (radius * 0.4));
      }
      ctx.closePath();
      ctx.fill();
      break;

    case ParticleShape.Snowflake:
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      for (let i = 0; i < 6; i++) {
        ctx.save();
        ctx.rotate((i * 60 * Math.PI) / 180);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, radius);
        // Branches
        ctx.moveTo(0, radius * 0.5);
        ctx.lineTo(radius * 0.3, radius * 0.7);
        ctx.moveTo(0, radius * 0.5);
        ctx.lineTo(-radius * 0.3, radius * 0.7);
        ctx.moveTo(0, radius * 0.8);
        ctx.lineTo(radius * 0.2, radius * 0.9);
        ctx.moveTo(0, radius * 0.8);
        ctx.lineTo(-radius * 0.2, radius * 0.9);
        ctx.stroke();
        ctx.restore();
      }
      break;
    
    case ParticleShape.Heart:
       ctx.beginPath();
       // Heart shape formula logic suitable for canvas bezier
       ctx.moveTo(0, -10);
       ctx.bezierCurveTo(0, -25, -50, -25, -50, 10);
       ctx.bezierCurveTo(-50, 40, 0, 60, 0, 60);
       ctx.bezierCurveTo(0, 60, 50, 40, 50, 10);
       ctx.bezierCurveTo(50, -25, 0, -25, 0, -10);
       ctx.fill();
       break;

    case ParticleShape.Petal:
       ctx.beginPath();
       ctx.moveTo(0, 0);
       ctx.quadraticCurveTo(30, -40, 0, -60);
       ctx.quadraticCurveTo(-30, -40, 0, 0);
       ctx.fill();
       // Rotate and draw duplicates to look like a floating flower
       for(let j=0; j<3; j++) {
           ctx.rotate((120 * Math.PI) / 180);
           ctx.beginPath();
           ctx.moveTo(0, 0);
           ctx.quadraticCurveTo(30, -40, 0, -60);
           ctx.quadraticCurveTo(-30, -40, 0, 0);
           ctx.fill();
       }
       break;
  }

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};
