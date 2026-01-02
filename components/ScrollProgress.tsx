
import React, { useEffect, useState } from 'react';

const ScrollProgress = () => {
  const [scrollWidth, setScrollWidth] = useState(0);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      setScrollWidth(progress);

      // Determine active section based on progress (approximate 4 sections)
      setActiveSection(Math.floor(progress / 25));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Progress Line */}
      <div className="fixed top-0 left-0 w-full h-[3px] z-[10000] bg-transparent pointer-events-none">
        <div 
          className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 transition-all duration-100 ease-out relative"
          style={{ width: `${scrollWidth}%` }}
        >
          {/* Leading Glow */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-20 h-[10px] bg-white blur-md opacity-50"></div>
          
          {/* Milestone Pulse */}
          {(Math.round(scrollWidth) === 25 || Math.round(scrollWidth) === 50 || Math.round(scrollWidth) === 75) && (
             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full animate-ping"></div>
          )}
        </div>
      </div>

      {/* Side Indicators */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-[9990] flex flex-col gap-3 hidden md:flex">
        {[0, 1, 2, 3].map((i) => (
          <div 
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 border border-white/20 
              ${activeSection === i ? 'bg-cyan-400 scale-125 border-cyan-400 shadow-[0_0_10px_rgba(0,245,255,0.5)]' : 'bg-transparent'}
            `}
          />
        ))}
      </div>
    </>
  );
};

export default ScrollProgress;
