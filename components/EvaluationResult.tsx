
import React, { useMemo } from 'react';
import { AnswerEvaluation } from '../types';
import { 
  CheckCircle2, BrainCircuit, Code2, MessageSquare, AlertTriangle, 
  TrendingUp, Award, Zap, Activity, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { Typewriter } from './ui/Typography';

interface EvaluationResultProps {
  evaluation: AnswerEvaluation;
}

// --- RADAR CHART COMPONENT (Theme Aware) ---
const RadarChart = ({ scores }: { scores: any }) => {
  // Config
  const size = 200;
  const center = size / 2;
  const radius = 70;
  const levels = 4;
  
  // Data Mapping
  const data = [
    { label: "Correctness", value: scores.correctness || 0 },
    { label: "Efficiency", value: scores.approach_quality || 0 },
    { label: "Style", value: scores.code_quality || 0 },
    { label: "Comms", value: scores.communication || 0 },
    { label: "Completeness", value: scores.completeness || 0 },
  ];

  const points = useMemo(() => {
    return data.map((d, i) => {
      const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
      const r = (d.value / 10) * radius; // value is 0-10
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x},${y}`;
    }).join(" ");
  }, [scores]);

  return (
    <div className="relative w-full h-[240px] flex items-center justify-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Grids */}
        {[...Array(levels)].map((_, level) => {
          const levelRadius = (radius / levels) * (level + 1);
          const levelPoints = data.map((_, i) => {
             const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
             const x = center + levelRadius * Math.cos(angle);
             const y = center + levelRadius * Math.sin(angle);
             return `${x},${y}`;
          }).join(" ");
          return (
            <polygon 
              key={level} 
              points={levelPoints} 
              fill="transparent" 
              stroke="currentColor" 
              strokeOpacity="0.1"
              strokeWidth="1" 
              className="text-gray-500 dark:text-gray-400"
            />
          );
        })}

        {/* Axes & Labels */}
        {data.map((d, i) => {
           const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
           const x = center + radius * Math.cos(angle);
           const y = center + radius * Math.sin(angle);
           const labelX = center + (radius + 20) * Math.cos(angle);
           const labelY = center + (radius + 15) * Math.sin(angle);
           return (
             <g key={i}>
                <line 
                  x1={center} y1={center} x2={x} y2={y} 
                  stroke="currentColor" 
                  strokeOpacity="0.1" 
                  className="text-gray-500 dark:text-gray-400"
                />
                <text 
                  x={labelX} 
                  y={labelY} 
                  textAnchor="middle" 
                  alignmentBaseline="middle" 
                  className="fill-gray-600 dark:fill-gray-400 text-[10px] uppercase font-bold font-mono"
                >
                  {d.label}
                </text>
             </g>
           );
        })}

        {/* The Data Polygon */}
        <polygon 
          points={points} 
          fill="rgba(99, 102, 241, 0.2)" 
          stroke="#6366f1" 
          strokeWidth="2" 
          className="drop-shadow-lg transition-all duration-1000 ease-out"
        />
        
        {/* Dots */}
        {points.split(" ").map((pt, i) => {
           const [x, y] = pt.split(",");
           return (
             <circle 
               key={i} 
               cx={x} cy={y} 
               r="3" 
               className="fill-indigo-500 dark:fill-indigo-400"
             />
           );
        })}
      </svg>
    </div>
  );
};


const EvaluationResult: React.FC<EvaluationResultProps> = ({ evaluation }) => {
  const overallScore = evaluation.scores.overall.toFixed(1);
  const isHighPerformance = evaluation.scores.overall >= 7;

  return (
    <div className="animate-slide-up-fade bg-white dark:bg-[#0a0e27] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xl mt-6">
      
      {/* HEADER: Score Summary */}
      <div className="grid grid-cols-1 md:grid-cols-12 border-b border-gray-200 dark:border-gray-800">
         {/* Left: Big Score */}
         <div className="md:col-span-4 p-8 flex flex-col items-center justify-center bg-white dark:bg-[#0d1021] relative overflow-hidden">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 bg-grid-small opacity-5 pointer-events-none"></div>
            {/* Center Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 text-center">
               <div className="text-sm font-mono text-gray-500 dark:text-indigo-300 uppercase tracking-widest mb-2">Total Score</div>
               <div className="text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                  {overallScore}
                  <span className="text-2xl text-gray-400 font-medium align-top ml-1">/10</span>
               </div>
               
               <div className={`mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase border shadow-sm ${
                 isHighPerformance 
                   ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
                   : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
               }`}>
                  {isHighPerformance ? <Award size={14} /> : <TrendingUp size={14} />}
                  {isHighPerformance ? 'Strong Performance' : 'Needs Practice'}
               </div>
            </div>
         </div>

         {/* Right: Radar Chart */}
         <div className="md:col-span-8 p-6 relative bg-gray-50 dark:bg-[#0b0e1b]">
            <div className="absolute top-4 right-4 flex gap-2">
               <span className="flex items-center gap-1 text-[10px] text-gray-400 uppercase font-mono">
                  <Activity size={12} /> Analysis
               </span>
            </div>
            <RadarChart scores={evaluation.scores} />
         </div>
      </div>

      {/* BODY: Detailed Feedback */}
      <div className="grid grid-cols-1 md:grid-cols-2">
         
         {/* Column 1: Textual Feedback */}
         <div className="p-8 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800">
            <h4 className="flex items-center gap-2 text-gray-900 dark:text-white font-bold mb-6">
               <MessageSquare size={18} className="text-indigo-500 dark:text-indigo-400 animate-pulse" />
               AI Feedback
            </h4>
            
            <div className="relative p-6 rounded-xl bg-indigo-50/50 dark:bg-white/5 border border-indigo-100 dark:border-white/10 overflow-hidden">
               {/* Background Scan Line */}
               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent -translate-y-full animate-[scan-down_2s_ease-in-out_1]"></div>
               
               <div className="relative z-10 prose prose-sm max-w-none text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                  <Typewriter text={evaluation.specific_feedback} speed={15} delay={300} />
               </div>
            </div>

            <div className="mt-8 space-y-6">
               <div className="opacity-0 animate-[slide-up-fade_0.5s_ease-out_1s_forwards]">
                  <h5 className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                     <CheckCircle2 size={14} /> Strengths
                  </h5>
                  <div className="flex flex-wrap gap-2">
                     {evaluation.strengths.map((str, i) => (
                        <span 
                          key={i} 
                          className="px-2.5 py-1.5 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs rounded-md border border-green-200 dark:border-green-900/30 animate-pop-in"
                          style={{ animationDelay: `${1000 + i * 100}ms`, opacity: 0, animationFillMode: 'forwards' }}
                        >
                           {str}
                        </span>
                     ))}
                  </div>
               </div>
               
               <div className="opacity-0 animate-[slide-up-fade_0.5s_ease-out_1.5s_forwards]">
                  <h5 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                     <AlertTriangle size={14} /> Areas to Improve
                  </h5>
                  <ul className="space-y-2">
                     {evaluation.improvement_areas.map((area, i) => (
                        <li 
                          key={i} 
                          className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 animate-slide-up-fade"
                          style={{ animationDelay: `${1500 + i * 100}ms`, opacity: 0, animationFillMode: 'forwards' }}
                        >
                           <span className="mt-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0"></span>
                           {area}
                        </li>
                     ))}
                  </ul>
               </div>
            </div>
         </div>

         {/* Column 2: Hiring Decision */}
         <div className="p-8 bg-gray-50 dark:bg-[#0d1021]">
            <h4 className="flex items-center gap-2 text-gray-900 dark:text-white font-bold mb-6">
               <Zap size={18} className="text-yellow-500 dark:text-yellow-400" />
               Hiring Signal
            </h4>

            <div className="space-y-4 mb-8">
               <MetricRow label="Algorithm Efficiency" value={evaluation.scores.approach_quality} />
               <MetricRow label="Code Cleanliness" value={evaluation.scores.code_quality} />
               <MetricRow label="Communication" value={evaluation.scores.communication} />
            </div>

            <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-800">
               <div className="flex justify-between items-center mb-4">
                  <span className="text-xs text-gray-500 uppercase font-mono">Recommendation</span>
                  <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                      evaluation.confidence === 'high' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                     {evaluation.confidence} Confidence
                  </span>
               </div>
               
               <div className={`
                  flex items-center gap-4 p-4 rounded-xl border-2 transition-colors duration-500
                  ${evaluation.would_hire 
                     ? 'border-green-200 bg-green-50 dark:border-green-500/30 dark:bg-green-500/10' 
                     : 'border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10'}
               `}>
                  <div className={`
                     p-2 rounded-full 
                     ${evaluation.would_hire ? 'bg-green-100 text-green-700 dark:bg-green-500 dark:text-black' : 'bg-red-100 text-red-700 dark:bg-red-500 dark:text-white'}
                  `}>
                     {evaluation.would_hire ? <ThumbsUp size={24} /> : <ThumbsDown size={24} />}
                  </div>
                  <div>
                     <div className={`font-bold text-lg ${evaluation.would_hire ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                        {evaluation.would_hire ? "Hire" : "No Hire"}
                     </div>
                     <div className="text-xs text-gray-500 dark:text-gray-400">
                        {evaluation.would_hire 
                           ? "Candidate fits the seniority profile." 
                           : "Candidate needs more preparation."}
                     </div>
                  </div>
               </div>
            </div>
         </div>

      </div>
    </div>
  );
};

// Helper for horizontal bars
const MetricRow = ({ label, value }: { label: string, value: number }) => (
  <div>
     <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        <span className="text-gray-900 dark:text-white font-mono">{value}/10</span>
     </div>
     <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
        <div 
           className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out"
           style={{ width: `${value * 10}%` }}
        ></div>
     </div>
  </div>
);

export default EvaluationResult;
