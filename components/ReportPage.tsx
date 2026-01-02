
import React, { useEffect, useState } from 'react';
import { QuestionResult, WeaknessAnalysisResult, WeakArea } from '../types';
import { analyzeWeaknesses } from '../services/geminiService';
import WeaknessAnalysis from './WeaknessAnalysis';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import Button from './ui/Button';

interface ReportPageProps {
  history: QuestionResult[];
  onBack: () => void;
  onGenerateStudyPlan: (area: WeakArea) => void;
  isLoadingPlan: boolean;
}

const ReportPage: React.FC<ReportPageProps> = ({ history, onBack, onGenerateStudyPlan, isLoadingPlan }) => {
  const [analysis, setAnalysis] = useState<WeaknessAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateReport = async () => {
      try {
        setLoading(true);
        // Add a minimum delay to show the nice animation
        const [result] = await Promise.all([
          analyzeWeaknesses(history),
          new Promise(resolve => setTimeout(resolve, 2500))
        ]);
        setAnalysis(result);
      } catch (err) {
        setError("Failed to generate report. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    generateReport();
  }, [history]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-[#020410] flex flex-col items-center justify-center text-white">
        {/* Holographic Loader */}
        <div className="relative w-48 h-48 mb-8">
          <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full animate-[spin_4s_linear_infinite]"></div>
          <div className="absolute inset-4 border-4 border-t-purple-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-24 h-24 bg-indigo-600/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.4)] animate-pulse">
                <Sparkles size={40} className="text-cyan-400" />
             </div>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold mb-2 tracking-tight">Compiling Dossier</h2>
        <p className="text-gray-400 font-mono text-sm typewriter-cursor">
          Analyzing {history.length} data points...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-950">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-xl text-center max-w-md">
          <h3 className="text-red-600 dark:text-red-400 font-bold text-lg mb-2">Analysis Failed</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <Button onClick={onBack} variant="secondary">Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 pt-24 animate-fadeIn">
      {/* Navbar Placeholder for spacing is handled by App.tsx padding, 
          but we need a back button specific to this view */}
      <div className="fixed top-24 left-4 z-40 md:left-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur border border-gray-200 dark:border-gray-800 rounded-full text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shadow-sm group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>
      </div>

      <div className="container mx-auto px-4 max-w-5xl mt-12">
        {analysis && (
          <WeaknessAnalysis 
            analysis={analysis} 
            history={history}
            onGenerateStudyPlan={onGenerateStudyPlan}
            isLoadingPlan={isLoadingPlan}
          />
        )}
      </div>
    </div>
  );
};

export default ReportPage;
