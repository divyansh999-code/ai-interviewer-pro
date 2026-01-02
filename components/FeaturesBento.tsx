
import React, { useState, useEffect, useRef } from 'react';
import { 
  Code2, Target, Zap, TrendingUp, CheckCircle, 
  BrainCircuit, Terminal, BarChart2, MessageSquare, Layers
} from 'lucide-react';

// --- Sub-Components for Card Internals ---

// Feature 1: AI Analysis Visualization (Radar Chart)
const RadarChart = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { label: 'DSA', val: 90 },
    { label: 'Sys Design', val: 75 },
    { label: 'Coding', val: 85 },
    { label: 'Comm', val: 70 },
    { label: 'Prob Solving', val: 88 }
  ];

  return (
    <div ref={ref} className="w-full h-full flex items-center justify-center relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-50"></div>
      
      <div className="relative w-48 h-48 md:w-56 md:h-56">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
          {/* Axis Lines */}
          {[0, 72, 144, 216, 288].map((deg, i) => (
             <line key={i} x1="50" y1="50" x2="100" y2="50" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" transform={`rotate(${deg} 50 50)`} className="text-gray-400 dark:text-white" />
          ))}
          {/* Concentric Polygons */}
          {[0.3, 0.6, 0.9].map((scale, i) => (
            <polygon key={i} points="100,50 65.45,97.55 9.55,79.39 9.55,20.61 65.45,2.45" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" transform={`scale(${scale}) translate(${50 - 50 * scale}, ${50 - 50 * scale})`} className="text-gray-400 dark:text-white" />
          ))}
          
          {/* Data Path */}
          <polygon 
            points="95,50 61,85 15,75 18,25 64,5" 
            fill="rgba(99, 102, 241, 0.2)" 
            stroke="#6366f1" 
            strokeWidth="1.5"
            className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
            style={{ transformOrigin: 'center' }}
          />
        </svg>

        {/* Floating Stat Labels */}
        {stats.map((stat, i) => {
           const angle = (i * 72 - 90) * (Math.PI / 180);
           const r = 50; // percentage
           const x = 50 + r * Math.cos(angle);
           const y = 50 + r * Math.sin(angle);
           return (
             <div 
               key={i}
               className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
               style={{ left: `${x}%`, top: `${y}%` }}
             >
                <div className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-white shadow-sm group-hover:scale-150 transition-transform"></div>
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 border border-gray-200 dark:border-gray-700 pointer-events-none shadow-lg">
                   {stat.label}: {stat.val}%
                </div>
             </div>
           )
        })}
      </div>
    </div>
  );
};

// Feature 2: Adaptive Questions Demo
const AdaptiveDemo = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const questions = [
    { diff: 'Easy', color: 'text-green-600 dark:text-green-400', label: 'Arrays', q: 'Find duplicates...' },
    { diff: 'Medium', color: 'text-amber-600 dark:text-amber-400', label: 'Trees', q: 'Level order...' },
    { diff: 'Hard', color: 'text-red-600 dark:text-red-400', label: 'DP', q: 'Min path sum...' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % questions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col justify-between relative p-6">
      <div className="space-y-4 relative z-10">
        {questions.map((q, i) => (
          <div 
            key={i}
            className={`
              p-4 rounded-xl border transition-all duration-500 transform
              ${i === activeIdx 
                ? 'bg-white/80 dark:bg-gray-800/80 border-indigo-500 shadow-lg scale-105 opacity-100 translate-x-0' 
                : 'bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 scale-95 opacity-40 translate-x-4'}
            `}
          >
            <div className="flex justify-between items-center mb-2">
              <span className={`text-xs font-bold ${q.color}`}>{q.diff}</span>
              <span className="text-[10px] text-gray-500">{q.label}</span>
            </div>
            <div className="h-2 w-3/4 bg-gray-200 dark:bg-gray-700/50 rounded mb-2"></div>
            <div className="h-2 w-1/2 bg-gray-200 dark:bg-gray-700/50 rounded"></div>
          </div>
        ))}
      </div>
      
      {/* Background Difficulty Indicator */}
      <div className="absolute bottom-0 left-0 h-1 bg-gray-200 dark:bg-gray-800 w-full">
        <div 
          className="h-full bg-gradient-to-r from-green-400 via-amber-400 to-red-400 transition-all duration-500"
          style={{ width: `${(activeIdx + 1) * 33}%` }}
        ></div>
      </div>
    </div>
  );
};

// Feature 3: Real-Time Evaluation Engine (Hero)
const CodeEngine = () => {
  const [code, setCode] = useState("");
  const fullCode = `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const comp = target - nums[i];
    if (map.has(comp)) {
      return [map.get(comp), i];
    }
    map.set(nums[i], i);
  }
}`;
  const [score, setScore] = useState(0);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullCode.length) {
        setCode(fullCode.slice(0, i));
        setScore(Math.min(100, Math.floor((i / fullCode.length) * 95) + 5)); // Fake score calc
        i++;
      } else {
        setTimeout(() => { i = 0; setCode(""); setScore(0); }, 2000); // Reset
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="h-full flex flex-col md:flex-row gap-4 p-6 relative overflow-hidden">
      <div className="flex-1 bg-gray-50 dark:bg-gray-950 rounded-lg p-4 font-mono text-xs text-gray-800 dark:text-gray-300 relative border border-gray-200 dark:border-gray-800 shadow-inner overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-6 bg-gray-100 dark:bg-gray-900 flex items-center px-2 gap-1.5 border-b border-gray-200 dark:border-gray-800">
           <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
           <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
           <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
        </div>
        <pre className="mt-4 whitespace-pre-wrap relative z-10">
          <span className="text-pink-600 dark:text-pink-400">function</span> <span className="text-blue-600 dark:text-blue-400">twoSum</span>{code}
          <span className="cursor-blink w-2 h-4 bg-indigo-500 inline-block align-middle ml-1"></span>
        </pre>
      </div>

      <div className="w-full md:w-1/3 bg-white/80 dark:bg-gray-900/80 rounded-lg p-4 border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center relative z-10">
         <div className="relative w-24 h-24 mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="50%" cy="50%" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100 dark:text-gray-800" />
              <circle 
                cx="50%" cy="50%" r="40" 
                stroke={score > 80 ? '#10b981' : score > 50 ? '#f59e0b' : '#ef4444'} 
                strokeWidth="8" 
                fill="transparent" 
                strokeDasharray={circumference} 
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{score}</span>
              <span className="text-[10px] text-gray-500">SCORE</span>
            </div>
         </div>
         
         {score > 90 && (
           <div className="absolute top-2 right-2 animate-bounce">
              <span className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-xs px-2 py-1 rounded-full border border-green-200 dark:border-green-500/30">
                 OPTIMAL
              </span>
           </div>
         )}

         <div className="w-full space-y-2">
            <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400">
               <span>Time Comp.</span>
               <span className={score > 80 ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}>O(n)</span>
            </div>
            <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400">
               <span>Space Comp.</span>
               <span className={score > 80 ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}>O(n)</span>
            </div>
         </div>
      </div>
    </div>
  );
};

// Feature 4: Study Plan (Timeline)
const StudyTimeline = () => {
  return (
    <div className="h-full p-6 flex flex-col relative overflow-hidden">
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800"></div>
      {[
        { label: 'Arrays', status: 'done' },
        { label: 'Linked Lists', status: 'current' },
        { label: 'Trees', status: 'locked' }
      ].map((step, i) => (
        <div key={i} className="relative pl-8 pb-6 last:pb-0 group">
          <div className={`
             absolute left-[-5px] top-1 w-3 h-3 rounded-full border-2 z-10 transition-all duration-300
             ${step.status === 'done' ? 'bg-green-500 border-green-500' : 
               step.status === 'current' ? 'bg-indigo-600 border-indigo-400 ring-4 ring-indigo-500/20' : 
               'bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700'}
          `}></div>
          <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700/50 group-hover:border-indigo-500/30 group-hover:translate-x-1 transition-all">
             <div className="flex justify-between items-center">
                <span className={`text-sm font-medium ${step.status === 'locked' ? 'text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
                  {step.label}
                </span>
                {/* Icons can be added here if needed */}
             </div>
           </div>
        </div>
      ))}
    </div>
  );
};

// Feature 5: Difficulty Adaptation
const DifficultyStairs = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(prev => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex items-end justify-center p-6 gap-2">
       {[0, 1, 2].map((s) => (
         <div key={s} className="flex flex-col items-center gap-2 w-1/3">
            {step === s && (
               <div className="mb-2 animate-bounce">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                    <TrendingUp size={16} className="text-white" />
                 </div>
               </div>
            )}
            <div 
              className={`
                w-full rounded-t-lg transition-all duration-500 border-t border-x border-white/10
                ${s === 0 ? 'h-12 bg-green-500/20' : s === 1 ? 'h-20 bg-amber-500/20' : 'h-32 bg-red-500/20'}
                ${step === s ? 'bg-opacity-40 border-t-indigo-500/50 shadow-lg' : 'bg-opacity-10'}
              `}
            ></div>
            <span className="text-[10px] text-gray-500 uppercase font-bold">Lvl {s+1}</span>
         </div>
       ))}
    </div>
  );
};

// Feature 6: Feedback Dashboard
const FeedbackDash = () => {
  return (
     <div className="h-full p-6 flex flex-col justify-center">
        <div className="grid grid-cols-3 gap-4 mb-4">
           {[
             { icon: CheckCircle, label: 'Correct', score: '9/10', color: 'text-green-500' },
             { icon: BrainCircuit, label: 'Logic', score: '8/10', color: 'text-blue-500' },
             { icon: Code2, label: 'Clean', score: '7/10', color: 'text-purple-500' }
           ].map((item, i) => (
             <div key={i} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-sm">
                <item.icon size={20} className={`mx-auto mb-2 ${item.color}`} />
                <div className="text-lg font-bold text-gray-900 dark:text-white">{item.score}</div>
                <div className="text-[10px] text-gray-500 uppercase">{item.label}</div>
             </div>
           ))}
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-lg p-3 flex gap-3 items-start">
           <MessageSquare size={16} className="text-indigo-500 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
           <div className="space-y-1 w-full">
              <div className="h-1.5 w-full bg-indigo-200 dark:bg-indigo-500/20 rounded animate-pulse"></div>
              <div className="h-1.5 w-3/4 bg-indigo-200 dark:bg-indigo-500/20 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
           </div>
        </div>
     </div>
  );
};

// --- Main Bento Grid Component ---

const BentoCard = ({ 
  children, 
  className, 
  title, 
  icon: Icon,
  delay = 0 
}: { 
  children?: React.ReactNode, 
  className?: string, 
  title: string, 
  icon: any,
  delay?: number 
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const maxRot = 3;
    
    const rotateY = ((x - centerX) / centerX) * maxRot;
    const rotateX = ((centerY - y) / centerY) * maxRot;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`bento-card group relative rounded-3xl bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-white/5 backdrop-blur-xl transition-all duration-700 ease-out will-change-transform shadow-lg dark:shadow-none ${className}`}
      style={{ 
        opacity: inView ? 1 : 0,
        transform: inView 
          ? `translateY(0) perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${rotation.x !== 0 ? 1.01 : 1})` 
          : 'translateY(20px)',
        transitionDelay: `${delay}ms`
      }}
    >
      {/* Static Border on Hover for Light Mode */}
      <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-indigo-500/20 dark:group-hover:border-white/10 transition-colors pointer-events-none"></div>

      {/* Header */}
      <div className="absolute top-6 left-6 z-20 flex items-center gap-2 pointer-events-none">
        <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/20 group-hover:border-indigo-100 dark:group-hover:border-indigo-500/30 transition-colors">
          <Icon size={16} className="text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors" />
        </div>
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{title}</span>
      </div>

      {/* Content Container */}
      <div className="w-full h-full pt-14">
        {children}
      </div>
    </div>
  );
};

const FeaturesBento = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top } = container.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      container.style.setProperty('--mouse-x', `${x}px`);
      container.style.setProperty('--mouse-y', `${y}px`);
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="py-32 bg-gray-50 dark:bg-[#0a0e27] relative overflow-hidden transition-colors duration-500">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-300/20 dark:bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-normal"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-300/20 dark:bg-purple-900/10 rounded-full blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-normal"></div>

      <div className="container mx-auto px-4 relative z-10 max-w-[1400px]">
        <div className="text-center mb-20">
           <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
             Everything You Need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-600 dark:from-cyan-400 dark:to-purple-500">Crack the Code</span>
           </h2>
           <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
             A complete ecosystem designed to transform your interview preparation from guesswork to science.
           </p>
        </div>

        {/* BENTO GRID */}
        <div 
          ref={containerRef}
          className="bento-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[300px] gap-6"
        >
          {/* Item 1: Real-Time Evaluation Engine (Hero) */}
          <BentoCard 
            title="Real-Time Evaluation Engine" 
            icon={Terminal} 
            className="lg:col-span-2 lg:row-span-2"
          >
            <CodeEngine />
          </BentoCard>

          {/* Item 2: Adaptive Questions */}
          <BentoCard 
            title="Adaptive Difficulty" 
            icon={Target} 
            className="lg:col-span-1 lg:row-span-2"
            delay={100}
          >
            <AdaptiveDemo />
          </BentoCard>

          {/* Item 3: Study Plan */}
          <BentoCard 
            title="Personalized Roadmap" 
            icon={Layers} 
            className="lg:col-span-1 lg:row-span-1"
            delay={200}
          >
            <StudyTimeline />
          </BentoCard>

          {/* Item 4: Level Up System */}
          <BentoCard 
            title="Level Up System" 
            icon={TrendingUp} 
            className="lg:col-span-1 lg:row-span-1"
            delay={300}
          >
            <DifficultyStairs />
          </BentoCard>

          {/* Item 5: AI Analysis */}
          <BentoCard 
            title="Deep Skill Analysis" 
            icon={BarChart2} 
            className="lg:col-span-2 lg:row-span-1"
            delay={400}
          >
            <div className="h-full flex items-center justify-around">
               <div className="text-left space-y-2 pl-6 hidden md:block">
                 <div className="text-xs text-gray-500 uppercase tracking-widest">Your Strongest Skill</div>
                 <div className="text-2xl font-bold text-gray-900 dark:text-white">Data Structures</div>
                 <div className="text-sm text-green-600 dark:text-green-400 font-mono">+12% vs last week</div>
               </div>
               <RadarChart />
            </div>
          </BentoCard>

          {/* Item 6: Feedback */}
          <BentoCard 
            title="Instant Feedback" 
            icon={Zap} 
            className="lg:col-span-2 lg:row-span-1"
            delay={500}
          >
            <FeedbackDash />
          </BentoCard>

        </div>
      </div>
    </section>
  );
};

export default FeaturesBento;
