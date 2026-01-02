
import React, { useRef, useEffect, useState } from 'react';
import { FileText, Brain, Layers, Code, TrendingUp, Check, Zap, ArrowDown, FileCheck, Search, Database } from 'lucide-react';

// --- VISUAL COMPONENTS FOR EACH STEP ---

// Step 1: 3D Resume Upload Visual
const ResumeVisual = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className={`relative w-full h-80 flex items-center justify-center perspective-1000 transition-all duration-1000 ${isActive ? 'opacity-100 scale-100' : 'opacity-40 scale-90 blur-sm'}`}>
      {/* 3D Document Stack */}
      <div className="relative w-48 h-64 bg-white rounded-lg shadow-2xl transform rotate-x-12 rotate-y-12 rotate-z-2 transition-transform duration-500 hover:rotate-0 border border-gray-100">
        {/* Back Pages */}
        <div className="absolute top-2 left-2 w-full h-full bg-gray-200 rounded-lg -z-10 border border-gray-300"></div>
        <div className="absolute top-4 left-4 w-full h-full bg-gray-100 rounded-lg -z-20 border border-gray-200"></div>
        
        {/* Main Page Content */}
        <div className="w-full h-full p-6 flex flex-col gap-3 overflow-hidden page-flip">
           <div className="w-16 h-16 rounded-full bg-gray-100 mb-4 self-center"></div>
           <div className="w-full h-4 bg-gray-100 rounded"></div>
           <div className="w-3/4 h-3 bg-gray-100 rounded"></div>
           <div className="w-5/6 h-3 bg-gray-100 rounded"></div>
           
           <div className="mt-4 flex flex-wrap gap-2">
             <div className="w-12 h-4 bg-indigo-100 rounded"></div>
             <div className="w-16 h-4 bg-purple-100 rounded"></div>
             <div className="w-10 h-4 bg-pink-100 rounded"></div>
           </div>

           {/* Scan Line */}
           <div className="absolute top-0 left-0 w-full h-2 bg-cyan-400/50 blur-md shadow-[0_0_20px_rgba(34,211,238,0.8)] animate-[scan-down_3s_linear_infinite]"></div>
        </div>
      </div>

      {/* Floating Skill Tags */}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none">
           {['React', 'Node.js', 'System Design', 'Python'].map((tag, i) => (
             <div 
               key={i}
               className="absolute px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold rounded-full shadow-lg float-tag-anim"
               style={{ 
                 left: `${20 + i * 20}%`, 
                 bottom: '20%', 
                 animationDelay: `${i * 1.2}s` 
               }}
             >
               {tag}
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

// Step 2: Neural Network Visual
const NeuralVisual = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className={`relative w-full h-80 flex items-center justify-center transition-all duration-1000 ${isActive ? 'opacity-100 scale-100' : 'opacity-40 scale-90 blur-sm'}`}>
      <svg className="w-full h-full" viewBox="0 0 200 200">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Connections */}
        {[
          [50, 50, 100, 100], [50, 150, 100, 100], [150, 50, 100, 100], [150, 150, 100, 100],
          [100, 100, 100, 40], [100, 100, 40, 100], [100, 100, 160, 100], [100, 100, 100, 160]
        ].map((line, i) => (
          <line 
            key={i}
            x1={line[0]} y1={line[1]} x2={line[2]} y2={line[3]} 
            stroke="currentColor"
            strokeOpacity="0.3"
            strokeWidth="1"
            className="text-purple-400 dark:text-purple-600"
          />
        ))}

        {/* Pulse Packets */}
        {isActive && [
          [50, 50, 100, 100], [150, 150, 100, 100]
        ].map((line, i) => (
          <circle key={i} r="2" fill="#00f5ff" filter="url(#glow)">
            <animateMotion 
              dur="2s" 
              repeatCount="indefinite" 
              path={`M${line[0]},${line[1]} L${line[2]},${line[3]}`}
              begin={`${i}s`}
            />
          </circle>
        ))}

        {/* Nodes */}
        {[
          {x: 50, y: 50}, {x: 150, y: 50}, {x: 50, y: 150}, {x: 150, y: 150},
          {x: 100, y: 100, main: true}, {x: 100, y: 40}, {x: 40, y: 100}, {x: 160, y: 100}, {x: 100, y: 160}
        ].map((node, i) => (
          <circle 
            key={i}
            cx={node.x} cy={node.y} 
            r={node.main ? 8 : 4} 
            fill={node.main ? "#ec4899" : "#a855f7"}
            className="neural-node"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}

        {/* Center Text */}
        <text x="100" y="100" textAnchor="middle" dy="0.3em" fontSize="6" fill="white" fontWeight="bold">AI</text>
      </svg>
      
      {/* Floating Analysis Text */}
      <div className="absolute top-10 left-10 text-xs text-purple-600 dark:text-purple-400 font-mono animate-pulse">Analyzing Skills...</div>
      <div className="absolute bottom-10 right-10 text-xs text-cyan-600 dark:text-cyan-400 font-mono animate-pulse" style={{ animationDelay: '1s' }}>Matching Difficulty...</div>
    </div>
  );
};

// Step 3: Question Cards Visual
const QuestionsVisual = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className={`relative w-full h-80 flex items-center justify-center transition-all duration-1000 ${isActive ? 'opacity-100 scale-100' : 'opacity-40 scale-90 blur-sm'}`}>
      <div className="relative w-64 h-64">
        {[
          { color: 'border-green-500', rotate: '-6deg', translate: '-20px, -10px', diff: 'Easy' },
          { color: 'border-yellow-500', rotate: '3deg', translate: '20px, 10px', diff: 'Med' },
          { color: 'border-red-500', rotate: '-2deg', translate: '0, 0', diff: 'Hard' }
        ].map((card, i) => (
           <div 
             key={i}
             className={`
               absolute inset-0 bg-white dark:bg-gray-900 border-2 ${card.color} rounded-xl p-4 shadow-xl
               flex flex-col justify-between transform transition-all duration-700
             `}
             style={{ 
               transform: isActive ? `translate(${card.translate}) rotate(${card.rotate})` : 'translate(0,0) rotate(0)',
               zIndex: i,
               opacity: isActive ? 1 : 0
             }}
           >
             <div className="flex justify-between">
               <div className="w-8 h-8 rounded bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                 <Search size={16} className="text-gray-400 dark:text-white/50" />
               </div>
               <span className="text-xs font-bold text-gray-700 dark:text-white bg-gray-100 dark:bg-white/10 px-2 py-1 rounded">{card.diff}</span>
             </div>
             <div className="space-y-2">
               <div className="w-full h-2 bg-gray-200 dark:bg-white/20 rounded"></div>
               <div className="w-3/4 h-2 bg-gray-200 dark:bg-white/20 rounded"></div>
               <div className="w-1/2 h-2 bg-gray-200 dark:bg-white/20 rounded"></div>
             </div>
           </div>
        ))}
      </div>
    </div>
  );
};

// Step 4: Code Simulator Visual
const CodeVisual = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className={`relative w-full h-80 flex items-center justify-center transition-all duration-1000 ${isActive ? 'opacity-100 scale-100' : 'opacity-40 scale-90 blur-sm'}`}>
       <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-2xl">
          <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 flex gap-2 border-b border-gray-200 dark:border-gray-700">
             <div className="w-3 h-3 rounded-full bg-red-500"></div>
             <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
             <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="p-4 font-mono text-xs text-gray-800 dark:text-gray-300 space-y-1">
             <div className="flex gap-2">
               <span className="text-gray-400 dark:text-gray-600">1</span>
               <span className="text-purple-600 dark:text-purple-400">function</span> <span className="text-blue-600 dark:text-blue-400">solve</span>(nums) {'{'}
             </div>
             <div className="flex gap-2">
               <span className="text-gray-400 dark:text-gray-600">2</span>
               <span className="pl-4">let map = <span className="text-yellow-600 dark:text-yellow-400">new</span> Map();</span>
             </div>
             <div className="flex gap-2">
               <span className="text-gray-400 dark:text-gray-600">3</span>
               <span className="pl-4 text-green-600 dark:text-green-400">// Thinking...</span>
             </div>
             {isActive && (
               <div className="flex gap-2 animate-pulse">
                 <span className="text-gray-400 dark:text-gray-600">4</span>
                 <span className="pl-4 w-2 h-4 bg-cyan-500 block"></span>
               </div>
             )}
          </div>
          
          {/* Live Score Overlay */}
          <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur border border-green-500/30 p-3 rounded-lg shadow-lg flex items-center gap-3">
             <div className="relative w-10 h-10">
                <svg className="w-full h-full -rotate-90">
                   <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="4" fill="none" className="text-gray-200 dark:text-gray-600" />
                   <circle cx="20" cy="20" r="16" stroke="#10b981" strokeWidth="4" fill="none" strokeDasharray="100" strokeDashoffset={isActive ? "10" : "100"} className="transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-900 dark:text-white">90</div>
             </div>
             <div className="text-xs">
                <div className="text-gray-500 dark:text-gray-400">Accuracy</div>
                <div className="text-green-600 dark:text-green-400 font-bold">Excellent</div>
             </div>
          </div>
       </div>
    </div>
  );
};

// Step 5: Growth Chart Visual
const GrowthVisual = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className={`relative w-full h-80 flex items-center justify-center transition-all duration-1000 ${isActive ? 'opacity-100 scale-100' : 'opacity-40 scale-90 blur-sm'}`}>
       <div className="w-full max-w-sm h-64 bg-white/50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 relative overflow-hidden p-6 flex items-end justify-between gap-2 shadow-lg">
          {/* Bars */}
          {[30, 45, 60, 50, 75, 90, 85].map((h, i) => (
             <div key={i} className="w-full bg-gray-200 dark:bg-gray-800 rounded-t-sm relative group">
                <div 
                  className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-indigo-600 to-cyan-400 rounded-t-sm transition-all duration-1000 ease-out"
                  style={{ height: isActive ? `${h}%` : '0%' }}
                >
                   {/* Top glow */}
                   <div className="absolute top-0 left-0 w-full h-1 bg-white/50 shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
                </div>
             </div>
          ))}
          
          {/* Trophy Pop-in */}
          <div 
            className={`absolute top-4 right-4 bg-yellow-100 dark:bg-yellow-500/20 p-2 rounded-full border border-yellow-200 dark:border-yellow-500/50 transition-all duration-500 delay-1000 ${isActive ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 rotate-180'}`}
          >
             <Zap className="text-yellow-500 dark:text-yellow-400" size={24} />
          </div>
       </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

const ProcessFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  const steps = [
    {
      id: 1,
      title: "Upload Your Resume",
      desc: "Drop your CV. Our AI instantly analyzes your projects, skills, and experience level to build a custom profile.",
      icon: FileText,
      Visual: ResumeVisual,
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      title: "AI Deep Analysis",
      desc: "We don't just look for keywords. The AI builds a knowledge graph of your strengths and detects gaps in your stack.",
      icon: Brain,
      Visual: NeuralVisual,
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 3,
      title: "Generate Custom Questions",
      desc: "Get 10 tailored questions ranging from LeetCode-style DSA to system design scenarios relevant to your actual work.",
      icon: Layers,
      Visual: QuestionsVisual,
      color: "from-amber-500 to-orange-500"
    },
    {
      id: 4,
      title: "Practice & Evaluate",
      desc: "Answer with voice or text. Get instant, brutal feedback on correctness, efficiency, and communication clarity.",
      icon: Code,
      Visual: CodeVisual,
      color: "from-green-500 to-emerald-500"
    },
    {
      id: 5,
      title: "Track & Improve",
      desc: "Watch your scores rise. Get specific resource recommendations to patch weak spots before the real interview.",
      icon: TrendingUp,
      Visual: GrowthVisual,
      color: "from-indigo-500 to-violet-500"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setActiveStep(index);
          }
        });
      },
      { threshold: 0.5, rootMargin: "-10% 0px -10% 0px" }
    );

    stepsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative w-full bg-white dark:bg-[#0d0221] py-32 overflow-hidden transition-colors duration-500">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50 dark:from-[#0d0221] dark:via-[#1a0b3e] dark:to-[#0d0221]"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 animate-pulse"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 dark:from-cyan-400 dark:via-purple-400 dark:to-pink-400 mb-6 tracking-tight">
            Your Journey to Mastery
          </h2>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"></div>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Central Timeline Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 dark:bg-gray-800 -translate-x-1/2 hidden md:block">
            <div 
              className="w-full bg-gradient-to-b from-cyan-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out"
              style={{ height: `${(activeStep + 0.5) / steps.length * 100}%` }}
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)] border-2 border-purple-500"></div>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-32 md:space-y-48">
            {steps.map((step, idx) => {
              const isActive = activeStep === idx;
              const isLeft = idx % 2 === 0;

              return (
                <div 
                  key={idx}
                  ref={el => { stepsRef.current[idx] = el; }}
                  data-index={idx}
                  className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 relative ${isActive ? 'opacity-100' : 'opacity-40'} transition-opacity duration-700`}
                >
                  {/* Timeline Node (Mobile Only) */}
                  <div className="md:hidden flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br ${step.color} shadow-lg z-10`}>
                      <step.icon className="text-white" size={24} />
                    </div>
                    {idx !== steps.length - 1 && <div className="h-24 w-1 bg-gray-200 dark:bg-gray-800 my-2"></div>}
                  </div>

                  {/* Content Side */}
                  <div className={`flex-1 text-center ${isLeft ? 'md:text-right order-2 md:order-1' : 'md:text-left order-2 md:order-2'}`}>
                     <div className="inline-block relative">
                        <span className={`text-[120px] leading-none font-black text-gray-200 dark:text-white/5 absolute -top-10 ${isLeft ? '-right-10' : '-left-10'} select-none transition-colors duration-500`}>
                           0{step.id}
                        </span>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white relative z-10 mb-4">{step.title}</h3>
                     </div>
                     <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">{step.desc}</p>
                     
                     {/* Interactive Tag */}
                     <div className={`mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-700 delay-300`}>
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${step.color} animate-pulse`}></div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Live Interaction</span>
                     </div>
                  </div>

                  {/* Visual Side */}
                  <div className={`flex-1 order-1 ${isLeft ? 'md:order-2' : 'md:order-1'}`}>
                     <div className={`relative rounded-2xl p-1 bg-gradient-to-br ${step.color} shadow-lg dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] transform transition-transform duration-700 ${isActive ? 'scale-105' : 'scale-95'}`}>
                        <div className="bg-white dark:bg-[#0a0e27] rounded-xl overflow-hidden relative">
                           {/* Step Visual Component */}
                           <step.Visual isActive={isActive} />
                           
                           {/* Overlay Gradient */}
                           <div className="absolute inset-0 bg-gradient-to-t from-white/20 dark:from-[#0a0e27] to-transparent opacity-20 pointer-events-none"></div>
                        </div>
                     </div>
                  </div>

                  {/* Desktop Timeline Node */}
                  <div className={`hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gray-50 dark:bg-[#0d0221] border-4 border-gray-200 dark:border-gray-800 items-center justify-center z-20 transition-all duration-500 ${isActive ? 'border-transparent shadow-[0_0_30px_rgba(168,85,247,0.5)] scale-110' : ''}`}>
                     <div className={`w-full h-full rounded-full flex items-center justify-center bg-gradient-to-br ${step.color} opacity-0 ${isActive ? 'opacity-100' : ''} transition-opacity duration-500`}>
                        <step.icon className="text-white" size={28} />
                     </div>
                     {isActive && <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping"></div>}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessFlow;
