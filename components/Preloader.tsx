
import React, { useEffect, useState } from 'react';
import { Terminal } from 'lucide-react';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const duration = 2500; // 2.5s simulated load
    const intervalTime = 20;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const easeOutQuad = (t: number) => t * (2 - t);
      const newProgress = Math.min(100, Math.round(easeOutQuad(currentStep / steps) * 100));
      
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setIsExiting(true);
        setTimeout(onComplete, 800); // Wait for exit animation
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0e27] transition-all duration-800 ease-in-out ${isExiting ? 'opacity-0 pointer-events-none scale-110' : 'opacity-100'}`}
    >
      {/* Animated Mesh Background */}
      <div className="absolute inset-0 preloader-mesh opacity-20"></div>
      
      <div className="relative flex flex-col items-center">
        {/* Animated Rings */}
        <div className="relative w-32 h-32 mb-8">
          {/* Track */}
          <svg className="w-full h-full transform -rotate-90">
            <circle 
              cx="50%" cy="50%" r="45" 
              stroke="rgba(255,255,255,0.1)" 
              strokeWidth="2" 
              fill="transparent" 
            />
            {/* Progress */}
            <circle 
              cx="50%" cy="50%" r="45" 
              stroke="#00f5ff" 
              strokeWidth="3" 
              fill="transparent" 
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-75 ease-out"
            />
          </svg>
          
          {/* Logo Center */}
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,245,255,0.3)] animate-pulse">
                <Terminal size={32} className="text-white" />
             </div>
          </div>

          {/* Orbiting Particles */}
          <div className="absolute inset-0 animate-[spin_3s_linear_infinite]">
             <div className="absolute top-0 left-1/2 w-2 h-2 bg-white rounded-full -translate-x-1/2 shadow-[0_0_10px_white]"></div>
          </div>
        </div>

        {/* Counter */}
        <div className="text-4xl font-bold text-white tabular-nums tracking-tighter mb-2">
          {progress}%
        </div>
        <div className="text-cyan-400 text-sm font-mono uppercase tracking-widest animate-pulse">
          Initializing Neural Core...
        </div>
      </div>
    </div>
  );
};

export default Preloader;
