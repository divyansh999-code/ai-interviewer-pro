
import React, { useState, useEffect } from 'react';
import { ArrowRight, Play, Star, CheckCircle, Zap } from 'lucide-react';

const CallToAction = ({ onGetStarted }: { onGetStarted: () => void }) => {
  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add("ripple");

    const existingRipple = button.getElementsByClassName("ripple")[0];
    if (existingRipple) existingRipple.remove();

    button.appendChild(circle);
    
    // Trigger action after ripple starts
    setTimeout(() => onGetStarted(), 300);
  };

  return (
    <section className="relative min-h-[80vh] w-full bg-gray-100 dark:bg-[#050713] overflow-hidden flex items-center justify-center py-20 transition-colors duration-500">
      
      {/* Background Aurora */}
      <div className="absolute inset-0 bg-aurora opacity-10 dark:opacity-30"></div>
      
      {/* Floating 3D Shapes (CSS Art) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         {/* Dodecahedron-ish shape */}
         <div className="absolute top-[15%] left-[10%] w-32 h-32 border border-gray-300 dark:border-white/10 rounded-full float-3d opacity-20" style={{ animationDelay: '0s' }}></div>
         <div className="absolute top-[20%] right-[15%] w-48 h-48 border border-cyan-500/10 rounded-full float-3d opacity-20" style={{ animationDelay: '2s' }}></div>
         <div className="absolute bottom-[10%] left-[20%] w-24 h-24 border border-purple-500/10 rotate-45 float-3d opacity-20" style={{ animationDelay: '4s' }}></div>
         
         {/* Particle Constellation */}
         <svg className="absolute inset-0 w-full h-full opacity-20">
            <line x1="10%" y1="10%" x2="20%" y2="30%" stroke="currentColor" strokeWidth="0.5" className="text-gray-400 dark:text-white" />
            <line x1="20%" y1="30%" x2="50%" y2="20%" stroke="currentColor" strokeWidth="0.5" className="text-gray-400 dark:text-white" />
            <circle cx="10%" cy="10%" r="2" fill="currentColor" className="text-gray-400 dark:text-white" />
            <circle cx="20%" cy="30%" r="2" fill="currentColor" className="text-gray-400 dark:text-white" />
            <circle cx="50%" cy="20%" r="2" fill="currentColor" className="text-gray-400 dark:text-white" />
         </svg>
      </div>

      {/* Main Glass Container */}
      <div className="relative z-10 w-full max-w-5xl mx-4 p-8 md:p-16 rounded-3xl glass-panel text-center border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-white/30 dark:bg-transparent backdrop-blur-xl">
        
        {/* Orbiting Testimonials */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block">
           <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-300 dark:border-white/5 animate-[spin_60s_linear_infinite]">
              {/* Card 1 */}
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-3 rounded-xl border border-gray-200 dark:border-white/10 shadow-xl flex items-center gap-3 animate-[spin_60s_linear_infinite_reverse]"
              >
                 <img src="https://i.pravatar.cc/100?img=12" alt="User" loading="lazy" decoding="async" className="w-8 h-8 rounded-full border border-gray-300 dark:border-white/20" />
                 <div className="text-left">
                    <div className="flex text-yellow-400 text-[10px]"><Star size={8} fill="currentColor" /><Star size={8} fill="currentColor" /><Star size={8} fill="currentColor" /><Star size={8} fill="currentColor" /><Star size={8} fill="currentColor" /></div>
                    <p className="text-[10px] text-gray-700 dark:text-gray-300 line-clamp-1">"Landed Google!"</p>
                 </div>
              </div>
              
              {/* Card 2 */}
              <div 
                className="absolute bottom-[20%] left-[10%] w-48 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-3 rounded-xl border border-gray-200 dark:border-white/10 shadow-xl flex items-center gap-3 animate-[spin_60s_linear_infinite_reverse]"
              >
                 <img src="https://i.pravatar.cc/100?img=33" alt="User" loading="lazy" decoding="async" className="w-8 h-8 rounded-full border border-gray-300 dark:border-white/20" />
                 <div className="text-left">
                    <div className="flex text-yellow-400 text-[10px]"><Star size={8} fill="currentColor" /><Star size={8} fill="currentColor" /><Star size={8} fill="currentColor" /><Star size={8} fill="currentColor" /><Star size={8} fill="currentColor" /></div>
                    <p className="text-[10px] text-gray-700 dark:text-gray-300 line-clamp-1">"Insane feedback."</p>
                 </div>
              </div>

              {/* Card 3 */}
              <div 
                className="absolute bottom-[20%] right-[10%] w-48 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-3 rounded-xl border border-gray-200 dark:border-white/10 shadow-xl flex items-center gap-3 animate-[spin_60s_linear_infinite_reverse]"
              >
                 <img src="https://i.pravatar.cc/100?img=59" alt="User" loading="lazy" decoding="async" className="w-8 h-8 rounded-full border border-gray-300 dark:border-white/20" />
                 <div className="text-left">
                    <div className="flex text-yellow-400 text-[10px]"><Star size={8} fill="currentColor" /><Star size={8} fill="currentColor" /><Star size={8} fill="currentColor" /><Star size={8} fill="currentColor" /><Star size={8} fill="currentColor" /></div>
                    <p className="text-[10px] text-gray-700 dark:text-gray-300 line-clamp-1">"Confidence booster."</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Content */}
        <div className="relative z-20 flex flex-col items-center">
           
           <h2 
             className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight animate-clip-reveal relative"
             data-text="Ready to Ace Your Next Interview?"
           >
             Ready to Ace Your <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 dark:from-cyan-400 dark:via-purple-400 dark:to-pink-400 glitch-effect inline-block">
               Next Interview?
             </span>
           </h2>

           <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl animate-[fadeIn_1s_ease-out_0.5s_forwards] opacity-0">
             Transform your preparation from stressful cramming to confident execution with personalized AI simulations.
           </p>

           <div className="flex flex-col sm:flex-row gap-6 items-center">
              {/* Primary Button */}
              <button 
                onClick={createRipple}
                className="relative overflow-hidden group w-72 h-16 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black font-bold text-lg shadow-[0_0_30px_rgba(0,0,0,0.2)] dark:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] active:scale-95"
              >
                 <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 <span className="relative z-10 flex items-center justify-center gap-2">
                    Start Free Interview Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                 </span>
              </button>

              {/* Secondary Button */}
              <button className="flex items-center gap-3 px-8 py-4 rounded-full border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white font-semibold hover:bg-gray-100 dark:hover:bg-white/10 transition-all group">
                 <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play size={14} fill="currentColor" />
                 </div>
                 Watch Demo
              </button>
           </div>

           {/* Trust Signals */}
           <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                 <CheckCircle size={16} className="text-green-600 dark:text-green-500" /> No Credit Card Required
              </div>
              <div className="flex items-center gap-2">
                 <CheckCircle size={16} className="text-green-600 dark:text-green-500" /> Free Forever Tier
              </div>
              <div className="flex items-center gap-2">
                 <CheckCircle size={16} className="text-green-600 dark:text-green-500" /> 2-min Setup
              </div>
           </div>

        </div>
      </div>
    </section>
  );
};

export default CallToAction;
