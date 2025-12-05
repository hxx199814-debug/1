import React from 'react';
import { ParticleShape } from '../types';
import { Settings, Maximize, Minimize } from 'lucide-react';

interface ControlsProps {
  shape: ParticleShape;
  setShape: (shape: ParticleShape) => void;
  color: string;
  setColor: (color: string) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

export const Controls: React.FC<ControlsProps> = ({ 
  shape, 
  setShape, 
  color, 
  setColor, 
  isFullscreen, 
  toggleFullscreen 
}) => {
  
  // Stop propagation so clicking controls doesn't trigger particle expansion
  const stopPropagation = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="absolute top-6 right-6 flex flex-col items-end gap-4 z-10"
      onMouseDown={stopPropagation}
      onTouchStart={stopPropagation}
    >
      {/* Main Panel */}
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl w-64 text-white transition-all duration-300 hover:bg-black/50">
        
        <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
          <Settings size={18} className="text-cyan-400" />
          <h2 className="text-sm font-semibold tracking-wide uppercase text-gray-200">Configuration</h2>
        </div>

        {/* Shape Selector */}
        <div className="mb-4">
          <label className="block text-xs text-gray-400 mb-2 uppercase font-bold tracking-wider">Particle Shape</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(ParticleShape).map((s) => (
              <button
                key={s}
                onClick={() => setShape(s)}
                className={`px-3 py-2 text-xs rounded-lg transition-all duration-200 border ${
                  shape === s 
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200' 
                    : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Color Picker */}
        <div className="mb-2">
          <label className="block text-xs text-gray-400 mb-2 uppercase font-bold tracking-wider">Theme Color</label>
          <div className="flex items-center gap-3 bg-white/5 p-2 rounded-lg">
            <input 
              type="color" 
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
              style={{ padding: 0 }}
            />
            <span className="text-xs font-mono text-gray-300">{color}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/10">
          <p className="text-[10px] text-gray-500 leading-relaxed text-center">
            Click & Hold scene to disperse particles
          </p>
        </div>
      </div>

      {/* Fullscreen Toggle */}
      <button 
        onClick={toggleFullscreen}
        className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors border border-white/10 shadow-lg group"
        title="Toggle Fullscreen"
      >
        {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
      </button>

    </div>
  );
};
