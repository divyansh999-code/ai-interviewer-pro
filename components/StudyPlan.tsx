
import React, { useEffect, useRef } from 'react';
import { StudyPlan as StudyPlanType } from '../types';
import { BookOpen, Youtube, Code2, Link as LinkIcon, Clock, CheckSquare, X } from 'lucide-react';

interface StudyPlanProps {
  plan: StudyPlanType;
  onClose: () => void;
}

const StudyPlan: React.FC<StudyPlanProps> = ({ plan, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(document.activeElement as HTMLElement);

  // Lock body scroll and handle focus when open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    // Focus the modal container on mount
    modalRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      // Restore focus to triggering element
      triggerRef.current?.focus();
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="study-plan-title"
    >
      {/* 
        Responsive Container:
        - Desktop: Centered modal (max-w-2xl)
        - Mobile: Bottom sheet (fixed bottom, full width, rounded top)
      */}
      <div 
        ref={modalRef}
        tabIndex={-1}
        className="
          bg-white dark:bg-gray-800 shadow-2xl flex flex-col w-full outline-none
          md:rounded-2xl md:max-w-2xl md:max-h-[90vh] md:relative
          max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:rounded-t-3xl max-md:max-h-[85vh] max-md:animate-slide-up
        "
      >
        {/* Mobile Pull Indicator */}
        <div className="md:hidden w-full flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>

        <div className="flex-shrink-0 bg-indigo-600 p-6 flex justify-between items-start max-md:rounded-t-3xl">
          <div>
            <h2 id="study-plan-title" className="text-2xl font-bold text-white flex items-center gap-2">
              <BookOpen size={28} />
              <span className="truncate max-w-[200px] md:max-w-none">{plan.topic}</span>
            </h2>
            <p className="text-indigo-100 mt-1 flex items-center gap-2 text-sm">
              <Clock size={14} /> Est. Time: {plan.estimated_mastery_time}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors touch-target focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Close study plan"
          >
            <span className="hidden md:inline">Close</span>
            <X size={24} className="md:hidden" />
          </button>
        </div>

        <div className="p-6 space-y-8 overflow-y-auto overscroll-contain flex-grow safe-bottom">
          {/* Learning Path */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-bold">1</span>
              Curated Learning Path
            </h3>
            <div className="space-y-4">
              {plan.learning_path.map((resource) => (
                <div key={resource.step} className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors group">
                  <div className="mt-1 flex-shrink-0">
                    {resource.resource_type === 'video' && <Youtube className="text-red-500" size={24} aria-hidden="true" />}
                    {resource.resource_type === 'article' && <BookOpen className="text-blue-500" size={24} aria-hidden="true" />}
                    {resource.resource_type === 'practice' && <Code2 className="text-green-500" size={24} aria-hidden="true" />}
                    {resource.resource_type === 'course' && <LinkIcon className="text-purple-500" size={24} aria-hidden="true" />}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="hover:underline touch-target md:inline md:h-auto">
                          {resource.title}
                        </a>
                      </h4>
                      {(resource.duration || resource.count) && (
                        <span className="text-xs font-medium px-2 py-1 bg-white dark:bg-gray-800 rounded text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {resource.duration || resource.count}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                      {resource.why_recommended}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Practice Problems */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-bold">2</span>
              Practice Problems
            </h3>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-5 border border-indigo-100 dark:border-indigo-800">
              <ul className="space-y-3">
                {plan.practice_problems.map((problem, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
                    <CheckSquare size={18} className="text-indigo-500 dark:text-indigo-400 flex-shrink-0" aria-hidden="true" />
                    <span className="font-medium">{problem}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-center flex-shrink-0 safe-bottom">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Click links to open resources in a new tab.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudyPlan;
