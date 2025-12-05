import React, { useState, useEffect } from 'react';
import { Scene } from './components/Scene';
import { Controls } from './components/Controls';
import { ParticleShape } from './types';

const App: React.FC = () => {
  const [shape, setShape] = useState<ParticleShape>(ParticleShape.Snowflake);
  const [color, setColor] = useState<string>('#00ffff');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Handle Fullscreen logic
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false));
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden select-none font-sans">
      
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <Scene 
          shape={shape} 
          color={color} 
          isExpanded={isExpanded}
          onExpandChange={setIsExpanded}
        />
      </div>

      {/* UI Layer */}
      <Controls 
        shape={shape}
        setShape={setShape}
        color={color}
        setColor={setColor}
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
      />

      {/* Overlay Title / Instructions (Optional, minimalist) */}
      <div className="absolute top-6 left-6 pointer-events-none z-10 text-white opacity-80">
        <h1 className="text-2xl font-bold tracking-tight">Ethereal</h1>
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">Interactive Particle System</p>
      </div>

    </div>
  );
};

export default App;
