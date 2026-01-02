
import React, { useState, useRef, useEffect } from 'react';
import { Question, AnswerEvaluation } from '../types';
import { 
  ChevronDown, Clock, Target, Lightbulb, ArrowRight, 
  BrainCircuit, Play, Send, CheckCircle2, Code2, 
  Cpu, Terminal, Zap, Hash, AlignLeft, Lock, Unlock, FileText
} from 'lucide-react';
import { evaluateAnswer } from '../services/geminiService';
import EvaluationResult from './EvaluationResult';
import Button from './ui/Button';
import Skeleton from './ui/Skeleton';

interface QuestionListProps {
  questions: Question[];
  onEvaluationComplete?: (question: Question, evaluation: AnswerEvaluation, answerText: string) => void;
}

// --- Difficulty Badge ---
const DifficultyBadge = ({ level }: { level: string }) => {
  const styles = {
    Easy: 'text-emerald-600 bg-emerald-100 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-400/10 dark:border-emerald-400/20',
    Medium: 'text-amber-600 bg-amber-100 border-amber-200 dark:text-amber-400 dark:bg-amber-400/10 dark:border-amber-400/20',
    Hard: 'text-rose-600 bg-rose-100 border-rose-200 dark:text-rose-400 dark:bg-rose-400/10 dark:border-rose-400/20',
  };
  
  const activeStyle = styles[level as keyof typeof styles] || styles.Medium;

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${activeStyle}`}>
      {level}
    </span>
  );
};

// --- Question Item Component ---
const QuestionItem: React.FC<{ 
  question: Question; 
  index: number;
  onEvaluationComplete?: (question: Question, evaluation: AnswerEvaluation, answerText: string) => void; 
}> = ({ question, index, onEvaluationComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(null);
  
  const contentRef = useRef<HTMLDivElement>(null);

  const handleSubmitAnswer = async () => {
    if (!answerText.trim()) return;
    setIsEvaluating(true);
    try {
      const result = await evaluateAnswer(question, answerText);
      setEvaluation(result);
      if (onEvaluationComplete) {
        onEvaluationComplete(question, result, answerText);
      }
    } catch (error) {
      console.error("Evaluation failed", error);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Determine Node State
  const isCompleted = !!evaluation;
  const isActive = isOpen && !isCompleted;

  return (
    <div className="relative pl-8 md:pl-12 group">
      {/* Timeline Line */}
      <div className="absolute left-[11px] md:left-[19px] top-0 bottom-0 w-[2px] bg-gray-200 dark:bg-gray-800 group-last:bottom-auto group-last:h-6"></div>
      
      {/* Node Indicator */}
      <div className={`
        absolute left-[3px] md:left-[11px] top-6 w-[18px] h-[18px] rounded-full border-2 z-10 flex items-center justify-center transition-all duration-300 
        ${isCompleted 
          ? 'border-emerald-500 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
          : isActive 
            ? 'border-indigo-500 bg-white dark:bg-[#0a0e27] shadow-[0_0_15px_rgba(99,102,241,0.5)]' 
            : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0a0e27]'}
      `}>
        {isCompleted && <CheckCircle2 size={10} className="text-white" />}
        {isActive && <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></div>}
      </div>

      {/* Main Card */}
      <div 
        className={`
          relative mb-4 rounded-xl border transition-all duration-500 overflow-hidden
          ${isActive 
            ? 'bg-white dark:bg-[#0f1229] border-indigo-200 dark:border-indigo-500/30 shadow-lg' 
            : 'bg-white dark:bg-[#0d1021] border-gray-200 dark:border-white/5 hover:border-indigo-200 dark:hover:border-white/10'}
        `}
      >
        {/* Card Header */}
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="p-5 cursor-pointer flex items-center justify-between"
        >
          <div className="flex flex-col gap-1">
             <div className="flex items-center gap-3">
               <h3 className={`font-semibold text-base md:text-lg transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-gray-200'}`}>
                 {question.question}
               </h3>
               {isActive && <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse md:hidden"></span>}
             </div>
             
             <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
                <span>MODULE 0{index + 1}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                <span className="flex items-center gap-1"><Clock size={10} /> {question.time_limit_minutes} MIN</span>
                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                <span className="text-gray-500 dark:text-gray-400">{question.topic}</span>
             </div>
          </div>

          <div className="flex items-center gap-4">
             <DifficultyBadge level={question.difficulty} />
             <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} />
          </div>
        </div>

        {/* Expandable Content */}
        <div 
          ref={contentRef}
          className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
        >
          <div className="overflow-hidden">
            <div className="p-6 pt-0 border-t border-gray-100 dark:border-white/5">
              
              {/* --- ACTION AREA --- */}
              {!isAnswering && !evaluation && (
                <div className="mt-6 flex flex-col items-center justify-center py-8 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg border border-dashed border-indigo-200 dark:border-indigo-500/20">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-500/20 rounded-full text-indigo-600 dark:text-indigo-400 mb-3">
                     <Terminal size={24} />
                  </div>
                  <h4 className="text-gray-900 dark:text-white font-medium mb-1">Interactive Coding Environment</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-sm text-center">
                    Write your solution or explanation below. The AI will evaluate your approach, correctness, and style.
                  </p>
                  <Button 
                    onClick={() => setIsAnswering(true)}
                    className="px-6 py-2"
                  >
                    Start Challenge
                  </Button>
                </div>
              )}

              {/* --- INPUT AREA (VS Code Style) --- */}
              {isAnswering && !evaluation && (
                <div className="mt-6 animate-slide-up-fade">
                  <div className="bg-[#0b0e1b] rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-2xl">
                    {/* Editor Tabs */}
                    <div className="flex items-center px-0 bg-[#161b2e] border-b border-gray-700 overflow-x-auto no-scrollbar">
                       <div className="px-4 py-2 bg-[#0b0e1b] text-indigo-300 text-xs font-mono border-t-2 border-t-indigo-500 flex items-center gap-2">
                          <Code2 size={12} /> solution.ts <span className="ml-2 hover:bg-white/10 rounded p-0.5 cursor-pointer">×</span>
                       </div>
                       <div className="px-4 py-2 text-gray-500 text-xs font-mono flex items-center gap-2 hover:bg-white/5 cursor-pointer transition-colors">
                          <FileText size={12} /> readme.md
                       </div>
                    </div>
                    
                    <div className="flex relative min-h-[250px]">
                       {/* Line Numbers */}
                       <div className="py-4 px-3 text-right bg-[#0b0e1b] text-gray-600 font-mono text-xs border-r border-gray-800 select-none w-10 flex-shrink-0">
                          {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => <div key={n}>{n}</div>)}
                       </div>
                       
                       <textarea
                         value={answerText}
                         onChange={(e) => setAnswerText(e.target.value)}
                         disabled={isEvaluating}
                         className="w-full bg-[#0b0e1b] text-gray-300 font-mono text-sm p-4 outline-none resize-none leading-relaxed"
                         placeholder="// Write your approach here..."
                         autoFocus
                         spellCheck={false}
                       />
                    </div>
                    
                    {/* Status Bar */}
                    <div className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-mono flex justify-between items-center">
                       <div className="flex gap-4">
                          <span>Spaces: 2</span>
                          <span>UTF-8</span>
                          <span>TypeScript</span>
                       </div>
                       <div className="flex gap-2 items-center">
                          {isEvaluating ? <span className="flex items-center gap-1"><Cpu size={10} className="animate-spin" /> Processing</span> : <span>Ready</span>}
                       </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-4">
                     <button 
                       onClick={() => setIsAnswering(false)} 
                       className="px-4 py-2 text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                     >
                       Cancel
                     </button>
                     <Button
                       onClick={handleSubmitAnswer}
                       isLoading={isEvaluating}
                       disabled={!answerText.trim()}
                       className="px-6 py-2 text-xs"
                     >
                       <Send size={14} /> Submit Code
                     </Button>
                  </div>
                </div>
              )}

              {/* --- EVALUATION RESULT --- */}
              {evaluation && (
                <div className="mt-6">
                  <EvaluationResult evaluation={evaluation} />
                </div>
              )}

              {/* --- HINTS (Bottom) --- */}
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/5 grid md:grid-cols-2 gap-6">
                 <div>
                    <h5 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                       <Lightbulb size={12} className="text-amber-500" /> Key Concepts
                    </h5>
                    <div className="flex flex-wrap gap-2">
                       {question.key_concepts.map((concept, idx) => (
                          <span key={idx} className="px-2 py-1 text-[10px] font-mono bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-700">
                             {concept}
                          </span>
                       ))}
                    </div>
                 </div>
                 {question.follow_up && (
                    <div>
                       <h5 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <Target size={12} className="text-purple-500" /> Challenge Extension
                       </h5>
                       <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                          {question.follow_up}
                       </p>
                    </div>
                 )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main List Component ---
const QuestionList: React.FC<QuestionListProps> = ({ questions, onEvaluationComplete }) => {
  return (
    <div className="w-full max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
         <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-600/20">
               <AlignLeft size={20} className="text-white" />
            </div>
            Interview Roadmap
         </h2>
         <div className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800">
            {questions.length} LEVELS
         </div>
      </div>

      <div className="relative">
         {questions.map((q, index) => (
           <div 
             key={q.id} 
             className="animate-slide-up-fade"
             style={{ animationDelay: `${index * 100}ms` }}
           >
             <QuestionItem 
               question={q} 
               index={index}
               onEvaluationComplete={onEvaluationComplete}
             />
           </div>
         ))}
      </div>
      
      {/* End Decorator */}
      <div className="pl-12 relative animate-fade-in opacity-50 delay-1000 mt-2">
         <div className="w-2 h-2 bg-gray-300 dark:bg-gray-700 rounded-full mb-1 ml-[4px]"></div>
         <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-800 rounded-full mb-1 ml-[5px]"></div>
         <div className="w-1 h-1 bg-gray-500 dark:bg-gray-900 rounded-full ml-[6px]"></div>
      </div>
    </div>
  );
};

export default QuestionList;
