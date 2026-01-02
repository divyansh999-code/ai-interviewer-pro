
import React, { useMemo } from 'react';
import { WeaknessAnalysisResult, WeakArea, QuestionResult } from '../types';
import { AlertCircle, TrendingUp, CheckCircle, BookOpen, Target, ArrowRight, Lightbulb, Hexagon, BarChart2, Zap } from 'lucide-react';
import { Typewriter } from './ui/Typography';

interface WeaknessAnalysisProps {
  analysis: WeaknessAnalysisResult;
  history?: QuestionResult[]; // Added history for aggregate calc
  onGenerateStudyPlan: (area: WeakArea) => void;
  isLoadingPlan: boolean;
}

// --- VISUALS ---

const AggregateRadar = ({ history }: { history: QuestionResult[] }) => {
  // Aggregate scores
  const metrics = {
    correctness: 0, efficiency: 0, style: 0, comms: 0, completeness: 0
  };
  
  history.forEach(h => {
    metrics.correctness += h.evaluation.scores.correctness;
    metrics.efficiency += h.evaluation.scores.approach_quality;
    metrics.style += h.evaluation.scores.code_quality;
    metrics.comms += h.evaluation.scores.communication;
    metrics.completeness += h.evaluation.scores.completeness;
  });

  const count = history.length || 1;
  const data = [
    { label: "Correctness", value: metrics.correctness / count },
    { label: "Efficiency", value: metrics.efficiency / count },
    { label: "Style", value: metrics.style / count },
    { label: "Comms", value: metrics.comms / count },
    { label: "Robustness", value: metrics.completeness / count },
  ];

  // SVG Logic
  const size = 260;
  const center = size / 2;
  const radius = 90;
  
  const points = data.map((d, i) => {
    const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
    const r = (d.value / 10) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="relative w-full h-[300px] flex items-center justify-center bg-white dark:bg-[#0d1021] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-inner">
      <div className="absolute top-4 left-4 text-xs font-bold uppercase text-gray-400 flex items-center gap-2">
        <Hexagon size={14} /> Skill Topology
      </div>
      <svg width={size} height={size} className="overflow-visible">
        {/* Web */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale, level) => (
           <polygon 
             key={level}
             points={data.map((_, i) => {
               const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
               const r = radius * scale;
               return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
             }).join(" ")}
             fill="none"
             stroke="currentColor"
             className="text-gray-200 dark:text-gray-800"
             strokeWidth="1"
           />
        ))}
        {/* Axes */}
        {data.map((d, i) => {
           const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
           const x = center + radius * Math.cos(angle);
           const y = center + radius * Math.sin(angle);
           // Label Pos
           const lx = center + (radius + 25) * Math.cos(angle);
           const ly = center + (radius + 15) * Math.sin(angle);
           return (
             <g key={i}>
                <line x1={center} y1={center} x2={x} y2={y} stroke="currentColor" className="text-gray-200 dark:text-gray-800" />
                <text x={lx} y={ly} textAnchor="middle" alignmentBaseline="middle" className="text-[10px] font-bold fill-gray-500 dark:fill-gray-400 uppercase tracking-wider">{d.label}</text>
             </g>
           )
        })}
        {/* Data */}
        <polygon points={points} fill="rgba(99, 102, 241, 0.15)" stroke="#6366f1" strokeWidth="2" className="drop-shadow-xl filter" />
        {points.split(" ").map((pt, i) => {
           const [x,y] = pt.split(",");
           return <circle key={i} cx={x} cy={y} r="4" className="fill-white stroke-indigo-600 dark:stroke-indigo-400" strokeWidth="2" />
        })}
      </svg>
    </div>
  );
};

const GradeBadge = ({ score }: { score: number }) => {
  let grade = 'F';
  let color = 'text-red-500 border-red-500 bg-red-50 dark:bg-red-900/20';
  
  if (score >= 9) { grade = 'A+'; color = 'text-emerald-500 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'; }
  else if (score >= 8) { grade = 'A'; color = 'text-green-500 border-green-500 bg-green-50 dark:bg-green-900/20'; }
  else if (score >= 7) { grade = 'B'; color = 'text-blue-500 border-blue-500 bg-blue-50 dark:bg-blue-900/20'; }
  else if (score >= 6) { grade = 'C'; color = 'text-yellow-500 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'; }
  else if (score >= 4) { grade = 'D'; color = 'text-orange-500 border-orange-500 bg-orange-50 dark:bg-orange-900/20'; }

  return (
    <div className={`w-24 h-24 flex items-center justify-center rounded-2xl border-4 ${color} shadow-lg backdrop-blur-sm`}>
       <span className="text-5xl font-black tracking-tighter">{grade}</span>
    </div>
  );
};

const WeaknessAnalysis: React.FC<WeaknessAnalysisProps> = ({ analysis, history = [], onGenerateStudyPlan, isLoadingPlan }) => {
  // Calculate aggregate score
  const avgScore = history.length 
    ? history.reduce((acc, curr) => acc + curr.evaluation.scores.overall, 0) / history.length 
    : 0;

  return (
    <div className="space-y-8 animate-slide-up-fade">
      
      {/* 1. HERO HEADER */}
      <div className="relative bg-white dark:bg-[#0d1021] rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden group">
         {/* Dynamic accent background */}
         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50/50 to-transparent dark:via-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 transform translate-x-[-100%] group-hover:translate-x-[100%]"></div>
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
         
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <GradeBadge score={avgScore} />
            <div className="flex-grow text-center md:text-left">
               <div className="text-sm font-mono text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">Final Assessment</div>
               <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Performance Dossier</h1>
               <p className="text-gray-600 dark:text-gray-400 max-w-xl">
                 Analysis based on {history.length} interview questions. 
                 <span className="ml-2 inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <Zap size={10} className="text-yellow-500" /> AI GENERATED
                 </span>
               </p>
            </div>
            
            <div className="hidden md:block text-right">
               <div className="text-sm text-gray-500 font-medium">Overall Rating</div>
               <div className="text-5xl font-mono font-bold text-gray-900 dark:text-white tabular-nums tracking-tighter">
                 {avgScore.toFixed(1)}<span className="text-2xl text-gray-400 font-normal">/10</span>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* 2. RADAR CHART */}
         <div className="lg:col-span-1">
            <AggregateRadar history={history} />
            
            {/* Immediate Priority Card */}
            <div className="mt-6 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
               <div className="relative z-10">
                  <div className="flex items-center gap-2 text-indigo-200 text-xs font-bold uppercase tracking-widest mb-3">
                     <Target size={14} /> Immediate Focus
                  </div>
                  <p className="text-lg font-bold leading-relaxed">
                    "{analysis.next_focus}"
                  </p>
               </div>
            </div>
         </div>

         {/* 3. DETAILED BREAKDOWN */}
         <div className="lg:col-span-2 space-y-6">
            
            {/* Weaknesses */}
            <div className="bg-white dark:bg-[#0d1021] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
               <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400"><AlertCircle size={18} /></div>
                  Critical Gaps Identified
               </h3>
               
               <div className="space-y-4">
                  {analysis.weak_areas.map((area, idx) => (
                     <div key={idx} className="group relative bg-gray-50 dark:bg-gray-900/40 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:border-red-200 dark:hover:border-red-900/30 transition-all">
                        <div className="flex justify-between items-start mb-3">
                           <div>
                              <div className="flex items-center gap-3 mb-1">
                                 <h4 className="font-bold text-gray-900 dark:text-white text-base">{area.area}</h4>
                                 <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                    area.severity === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                                 }`}>
                                    {area.severity} Priority
                                 </span>
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 font-mono uppercase">{area.gap_type} Gap</div>
                           </div>
                           <button
                              onClick={() => onGenerateStudyPlan(area)}
                              disabled={isLoadingPlan}
                              className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors flex items-center gap-1.5 shadow-sm"
                           >
                              <Lightbulb size={12} /> Fix This
                           </button>
                        </div>
                        
                        <div className="text-sm text-gray-600 dark:text-gray-300 mb-3 pl-3 border-l-2 border-red-400/30">
                           <span className="font-semibold text-gray-900 dark:text-gray-100">Evidence:</span> {area.evidence}
                        </div>
                        <p className="text-xs text-gray-500 italic">
                           Impact: {area.impact}
                        </p>
                     </div>
                  ))}
                  {analysis.weak_areas.length === 0 && (
                     <div className="text-center py-8 text-gray-500 italic">
                        No critical weaknesses detected. Outstanding work.
                     </div>
                  )}
               </div>
            </div>

            {/* Strengths & Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white dark:bg-[#0d1021] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                     <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded text-green-600 dark:text-green-400"><CheckCircle size={14} /></div>
                     Strengths
                  </h3>
                  <div className="flex flex-wrap gap-2">
                     {analysis.strong_areas.map((area, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-300 rounded-lg text-xs font-medium border border-green-100 dark:border-green-900/30">
                           {area}
                        </span>
                     ))}
                  </div>
               </div>

               <div className="bg-white dark:bg-[#0d1021] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                     <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400"><BookOpen size={14} /></div>
                     Action Plan
                  </h3>
                  <div className="space-y-3">
                     {analysis.recommendations.slice(0, 2).map((rec, idx) => (
                        <div key={idx} className="flex gap-3 items-start">
                           <div className="min-w-[18px] h-[18px] rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold mt-0.5">
                              {idx + 1}
                           </div>
                           <div>
                              <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{rec.action}</p>
                              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{rec.estimated_time}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
};

export default WeaknessAnalysis;
