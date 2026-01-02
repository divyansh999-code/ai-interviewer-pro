
import React, { useState, useEffect, useContext, Suspense } from 'react';
import { Github, Terminal, BarChart2, Loader2, Sparkles, PlusCircle, Home, BookOpen, User, Settings, LogOut, LogIn, Mic, FileText, ChevronRight } from 'lucide-react';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import LandingPage from './components/LandingPage';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import ScrollProgress from './components/ScrollProgress';
import { ScrollManager, ScrollContext } from './components/ScrollManager';
import Parallax from './components/Parallax';
import { generateInterviewQuestions, generateStudyPlan, generateNextAdaptiveQuestion } from './services/geminiService';
import { saveInterviewSession, saveQuestions, saveQuestionResult } from './services/databaseService';
import { GenerationState, Question, AnswerEvaluation, QuestionResult, WeakArea, StudyPlan as StudyPlanType, LiveFeedbackReport } from './types';
import Skeleton from './components/ui/Skeleton';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import Button from './components/ui/Button';
import ReportPage from './components/ReportPage';
import LiveInterview from './components/LiveInterview';
import LiveReportPage from './components/LiveReportPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';

// Lazy load heavy analysis components
const AnalysisDashboard = React.lazy(() => import('./components/AnalysisDashboard'));
const QuestionList = React.lazy(() => import('./components/QuestionList'));
const StudyPlan = React.lazy(() => import('./components/StudyPlan'));

// Navbar Component with Mobile Menu
const Navbar = ({ setView, view }: any) => {
  const { scrollDirection, scrollY } = useContext(ScrollContext);
  const { user, logout, isAuthenticated } = useAuth();
  const isScrolled = scrollY > 50;
  const isHidden = scrollDirection === 'down' && isScrolled;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when scrolling
  useEffect(() => {
    if (isScrolled) setIsMobileMenuOpen(false);
  }, [isScrolled]);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    // If not on landing page, go there first (though links are hidden otherwise)
    if (view !== 'landing') {
      setView('landing');
      // Give React a moment to render the landing page before scrolling
      setTimeout(() => {
        scrollToElement(id);
      }, 100);
    } else {
      scrollToElement(id);
    }
  };

  const scrollToElement = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 transform 
          ${isHidden && !isMobileMenuOpen ? '-translate-y-full' : 'translate-y-0'}
          ${isScrolled || isMobileMenuOpen ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 h-16' : 'bg-transparent h-20'}
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <button 
            className="flex items-center gap-2 cursor-pointer btn-spring touch-target focus:outline-none select-none logo-anim" 
            onClick={() => setView('landing')}
            aria-label="Go to home"
          >
            <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-600/20">
              <Terminal className="text-white w-5 h-5" />
            </div>
            <h1 className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 ${!isScrolled && !isMobileMenuOpen && view === 'landing' ? 'dark:text-white' : 'dark:text-white'}`}>
              AI Interviewer Pro
            </h1>
          </button>
          
          {/* Middle Links for Landing Page */}
          {view === 'landing' && (
             <div className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-gray-500 dark:text-gray-400">
                <a 
                  href="#features" 
                  onClick={(e) => handleScrollTo(e, 'features')}
                  className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Features
                </a>
                <a 
                  href="#how-it-works" 
                  onClick={(e) => handleScrollTo(e, 'how-it-works')}
                  className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Process
                </a>
                <a 
                  href="#faq" 
                  onClick={(e) => handleScrollTo(e, 'faq')}
                  className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  FAQ
                </a>
             </div>
          )}
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                    <img 
                      src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
                      alt="Avatar" 
                      className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden lg:inline">
                      {user?.name}
                    </span>
                 </div>
                 <button 
                   onClick={() => logout()}
                   className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors btn-spring"
                   title="Logout"
                 >
                   <LogOut size={20} />
                 </button>
              </div>
            ) : (
              <div className="flex gap-2">
                 <button 
                   onClick={() => setView('login')}
                   className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                 >
                   Login
                 </button>
                 <button 
                   onClick={() => setView('signup')}
                   className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30 btn-spring"
                 >
                   Get Started
                 </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button 
            className="md:hidden p-2 text-gray-500 dark:text-gray-300 touch-target relative w-10 h-10 flex items-center justify-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            <div className="relative w-6 h-6">
              <span className={`absolute top-1/2 left-0 w-full h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45' : '-translate-y-2'}`} />
              <span className={`absolute top-1/2 left-0 w-full h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`absolute top-1/2 left-0 w-full h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45' : 'translate-y-2'}`} />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Menu Drawer */}
      <nav 
        className={`fixed top-16 right-0 bottom-0 w-3/4 max-w-sm bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800 z-50 transform transition-transform duration-300 ease-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        aria-label="Mobile navigation"
      >
        <div className="p-6 flex flex-col gap-6 h-full safe-bottom">
          <div className="flex flex-col gap-4">
            <button onClick={() => { setView('landing'); setIsMobileMenuOpen(false); }} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200 font-medium active:scale-95">
              <Home size={20} /> Home
            </button>
            
            {view === 'landing' && (
              <>
                 <a href="#features" onClick={(e) => handleScrollTo(e, 'features')} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200 font-medium active:scale-95">
                   <Sparkles size={20} /> Features
                 </a>
                 <a href="#how-it-works" onClick={(e) => handleScrollTo(e, 'how-it-works')} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200 font-medium active:scale-95">
                   <BookOpen size={20} /> Process
                 </a>
                 <a href="#faq" onClick={(e) => handleScrollTo(e, 'faq')} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200 font-medium active:scale-95">
                   <BookOpen size={20} /> FAQ
                 </a>
              </>
            )}

            {isAuthenticated && (
              <>
                <button className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200 font-medium active:scale-95">
                  <User size={20} /> Profile
                </button>
                <button onClick={logout} className="flex items-center gap-4 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 font-medium active:scale-95">
                  <LogOut size={20} /> Logout
                </button>
              </>
            )}
            {!isAuthenticated && (
               <>
                 <button onClick={() => { setView('login'); setIsMobileMenuOpen(false); }} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200 font-medium active:scale-95">
                   <LogIn size={20} /> Login
                 </button>
                 <button onClick={() => { setView('signup'); setIsMobileMenuOpen(false); }} className="flex items-center gap-4 p-3 rounded-xl bg-indigo-600 text-white font-medium active:scale-95 shadow-lg shadow-indigo-600/20">
                   <Sparkles size={20} /> Get Started
                 </button>
               </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

const AppContent: React.FC = () => {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  
  // View Routing
  const [view, setView] = useState<'landing' | 'login' | 'signup' | 'app' | 'report' | 'live-interview' | 'live-report' | 'about' | 'contact'>('landing');
  const [resumeText, setResumeText] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("NORMAL");
  const [liveTranscript, setLiveTranscript] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [liveReportData, setLiveReportData] = useState<LiveFeedbackReport | null>(null);

  // Database Mapping State
  const [currentInterviewId, setCurrentInterviewId] = useState<string | null>(null);
  const [dbQuestionsMap, setDbQuestionsMap] = useState<Record<number, string>>({}); // Maps frontend index to DB UUID

  // Handle System Dark Mode Preference
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    if (!isAuthLoading) {
       if (isAuthenticated) {
          if (view !== 'report' && view !== 'live-interview' && view !== 'live-report' && view !== 'about' && view !== 'contact') setView('app');
       } else if (view === 'app' || view === 'report' || view === 'live-interview' || view === 'live-report') {
          setView('landing');
       }
    }
  }, [isAuthenticated, isAuthLoading]);

  const [state, setState] = useState<GenerationState>({
    isLoading: false,
    error: null,
    data: null,
  });

  const [history, setHistory] = useState<QuestionResult[]>([]);
  
  // Study Plan State
  const [activeStudyPlan, setActiveStudyPlan] = useState<StudyPlanType | null>(null);
  const [isLoadingStudyPlan, setIsLoadingStudyPlan] = useState(false);

  // Adaptive Question State
  const [isGeneratingAdaptive, setIsGeneratingAdaptive] = useState(false);
  const [adaptiveMessage, setAdaptiveMessage] = useState<string | null>(null);

  const handleResumeSubmit = async (text: string) => {
    setResumeText(text);
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await generateInterviewQuestions(text);
      
      // PERSIST TO DB
      if (user) {
        const difficulty = data.candidate_analysis.experience_level === "0-1 years" ? "EASY" : "NORMAL";
        const session = await saveInterviewSession(user.id, text, difficulty);
        
        if (session) {
           setCurrentInterviewId(session.id);
           const savedQs = await saveQuestions(session.id, data.questions);
           // Map array indices to DB UUIDs for later result saving
           const map: Record<number, string> = {};
           savedQs.forEach((q: any) => {
              map[q.question_index] = q.id;
           });
           setDbQuestionsMap(map);
        }
      }

      setState({ isLoading: false, error: null, data });
      setActiveStudyPlan(null);
      setHistory([]);
      setAdaptiveMessage(null);
    } catch (err: any) {
      setState({ isLoading: false, error: err.message, data: null });
    }
  };

  // Update selected difficulty based on resume analysis
  useEffect(() => {
    if (state.data?.candidate_analysis.experience_level) {
       const lvl = state.data.candidate_analysis.experience_level;
       if (lvl === "0-1 years") setSelectedDifficulty("EASY");
       else if (lvl === "1-2 years") setSelectedDifficulty("NORMAL");
       else setSelectedDifficulty("HARD");
    }
  }, [state.data]);

  const handleEvaluationComplete = async (question: Question, evaluation: AnswerEvaluation, answerText: string) => {
    const newResult: QuestionResult = {
      question,
      evaluation,
      timestamp: Date.now()
    };
    setHistory(prev => [...prev, newResult]);

    // PERSIST RESULT
    if (user && currentInterviewId) {
       // Find the question index to get the ID from our map
       const qIndex = state.data?.questions.findIndex(q => q.id === question.id);
       if (qIndex !== undefined && qIndex !== -1) {
          const dbQId = dbQuestionsMap[qIndex];
          if (dbQId) {
             await saveQuestionResult(user.id, dbQId, answerText, evaluation);
          }
       }
    }
  };

  const handleGenerateStudyPlan = async (area: WeakArea) => {
    setIsLoadingStudyPlan(true);
    try {
      const plan = await generateStudyPlan(area.area, area.gap_type);
      setActiveStudyPlan(plan);
    } catch (error) {
      console.error("Study plan generation failed", error);
    } finally {
      setIsLoadingStudyPlan(false);
    }
  };

  const handleGenerateAdaptive = async () => {
    if (!state.data) return;
    
    setIsGeneratingAdaptive(true);
    setAdaptiveMessage(null);
    try {
      const maxId = Math.max(...state.data.questions.map(q => q.id), 0);
      const nextId = maxId + 1;

      const response = await generateNextAdaptiveQuestion(
        history,
        nextId,
        state.data.candidate_analysis
      );

      const newQuestion = { ...response.next_question, isAdaptive: true };
      
      // Update state
      const newData = {
          ...state.data,
          questions: [...state.data.questions, newQuestion]
      };

      setState(prev => ({
        ...prev,
        data: newData
      }));

      // PERSIST ADAPTIVE QUESTION
      if (currentInterviewId) {
         const newIndex = newData.questions.length - 1;
         const saved = await saveQuestions(currentInterviewId, [newQuestion]);
         if (saved && saved[0]) {
             setDbQuestionsMap(prev => ({ ...prev, [newIndex]: saved[0].id }));
         }
      }

      setAdaptiveMessage(response.encouragement_message);

      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);

    } catch (error) {
      console.error("Adaptive generation failed", error);
    } finally {
      setIsGeneratingAdaptive(false);
    }
  };
  
  const handleLiveInterviewEnd = (transcript: { role: 'user' | 'model', text: string }[]) => {
      setLiveTranscript(transcript);
      // Reset report data so it regenerates for new session
      setLiveReportData(null);
      setView('live-report');
  };

  const handleLiveReportGenerated = (report: LiveFeedbackReport) => {
      setLiveReportData(report);
  };

  if (!loadingComplete || isAuthLoading) {
    return <Preloader onComplete={() => setLoadingComplete(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200 bg-gray-50 dark:bg-gray-950">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <ScrollProgress />
      <CustomCursor />
      
      {/* Navbar visible on pages except live-report, live-interview, about, and contact to avoid overlap/custom styling */}
      {(view !== 'live-report' && view !== 'live-interview' && view !== 'about' && view !== 'contact') && (
        <Navbar 
          setView={setView}
          view={view}
        />
      )}

      {/* View Routing */}
      {view === 'landing' && (
        <LandingPage 
          onGetStarted={() => setView(isAuthenticated ? 'app' : 'signup')} 
          onNavigate={setView}
        />
      )}
      
      {view === 'about' && (
        <AboutPage onBack={() => setView('landing')} />
      )}

      {view === 'contact' && (
        <ContactPage onBack={() => setView('landing')} />
      )}

      {view === 'login' && !isAuthenticated && (
        <LoginPage onNavigate={setView} />
      )}

      {view === 'signup' && !isAuthenticated && (
        <SignupPage onNavigate={setView} />
      )}

      {view === 'live-interview' && isAuthenticated && (
        <LiveInterview 
          resumeText={resumeText || "Candidate has not provided a resume text. Ask general questions."} 
          difficulty={selectedDifficulty}
          onEndSession={handleLiveInterviewEnd}
        />
      )}

      {view === 'live-report' && isAuthenticated && (
        <LiveReportPage
          resumeText={resumeText || "No resume provided."}
          difficulty={selectedDifficulty}
          transcript={liveTranscript}
          cachedReport={liveReportData}
          onReportGenerated={handleLiveReportGenerated}
          onBack={() => setView('app')}
        />
      )}

      {view === 'report' && isAuthenticated && (
        <ReportPage 
          history={history} 
          onBack={() => setView('app')}
          onGenerateStudyPlan={handleGenerateStudyPlan}
          isLoadingPlan={isLoadingStudyPlan}
        />
      )}

      {view === 'app' && isAuthenticated && (
        <main id="main-content" className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8 pt-24 focus:outline-none max-w-5xl" tabIndex={-1}>
          {/* Main App Dashboard Header */}
          {!state.data && !state.isLoading && (
            <div className="mb-12 text-center animate-fadeIn space-y-4">
              <Parallax speed={-0.1}>
                 <div className="inline-block p-3 rounded-full bg-indigo-600/10 dark:bg-indigo-900/30 mb-4">
                    <Terminal size={32} className="text-indigo-600 dark:text-indigo-400" />
                 </div>
                 <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    Welcome back, {user?.name}
                 </h2>
                 <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto mt-2">
                    Start a new session to continue your interview preparation.
                 </p>
              </Parallax>
            </div>
          )}

          {/* Section 1: Input */}
          <div className="relative z-10">
             <ResumeAnalyzer onSubmit={handleResumeSubmit} isLoading={state.isLoading} />
          </div>

          {state.error && (
            <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800 flex items-center justify-center animate-fadeIn" role="alert">
              {state.error}
            </div>
          )}

          {/* Section 2: Questions & Dashboard */}
          {state.data && (
            <div className="space-y-12 animate-fadeIn">
              
              {/* Voice Interview Card */}
              <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl p-8 relative overflow-hidden shadow-2xl group cursor-default">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
                 <div className="absolute top-0 right-0 p-12 opacity-10">
                    <Mic size={120} className="text-white" />
                 </div>
                 
                 <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                       <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-bold uppercase tracking-wider mb-3">
                          <Sparkles size={12} className="animate-pulse" /> New Feature
                       </div>
                       <h3 className="text-3xl font-bold text-white mb-2">Live Voice Interview</h3>
                       <p className="text-indigo-200 max-w-md mb-4">
                          Practice with our AI interviewer in real-time. Experience a realistic voice conversation powered by Gemini 2.5 Flash.
                       </p>
                       
                       {/* DIFFICULTY SELECTOR */}
                       <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                          <span className="text-xs font-bold text-indigo-300 uppercase self-center mr-2">Mode:</span>
                          {['EASY', 'NORMAL', 'HARD'].map((mode) => (
                             <button
                               key={mode}
                               onClick={() => setSelectedDifficulty(mode)}
                               className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                                 selectedDifficulty === mode 
                                   ? 'bg-white text-indigo-900 border-white shadow-lg' 
                                   : 'bg-transparent text-indigo-300 border-indigo-500/30 hover:bg-white/10 hover:border-white/50'
                               }`}
                             >
                               {mode}
                             </button>
                          ))}
                       </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 w-full md:w-auto">
                        <button 
                           onClick={() => setView('live-interview')}
                           className="px-6 py-3 bg-white text-indigo-900 font-bold rounded-full shadow-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 group-hover:scale-105 transform duration-300"
                        >
                           Start Session <Mic size={18} />
                        </button>
                        
                        {/* VIEW REPORT BUTTON - Only shows if a report exists */}
                        {liveReportData && (
                           <button 
                              onClick={() => setView('live-report')}
                              className="px-6 py-3 bg-indigo-950/50 border border-indigo-400/30 text-indigo-200 font-bold rounded-full hover:bg-indigo-900/50 hover:text-white transition-colors flex items-center justify-center gap-2"
                           >
                              <FileText size={18} /> View Last Report <ChevronRight size={16} />
                           </button>
                        )}
                    </div>
                 </div>
              </div>

              <div className="flex items-center gap-4 mb-2">
                  <div className="h-px bg-gray-200 dark:bg-gray-800 flex-grow"></div>
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Candidate Profile</span>
                  <div className="h-px bg-gray-200 dark:bg-gray-800 flex-grow"></div>
              </div>

              <Suspense fallback={<div className="grid grid-cols-3 gap-4"><Skeleton height={150} /><Skeleton height={150} /><Skeleton height={150} /></div>}>
                <AnalysisDashboard analysis={state.data.candidate_analysis} />
              </Suspense>
              
              <Suspense fallback={<div className="space-y-4"><Skeleton height={80} /><Skeleton height={80} /></div>}>
                <QuestionList 
                  questions={state.data.questions} 
                  onEvaluationComplete={handleEvaluationComplete}
                />
              </Suspense>

              <div className="py-12 flex flex-col items-center border-t border-gray-200 dark:border-gray-800">
                {adaptiveMessage && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl shadow-lg max-w-2xl w-full text-center animate-fadeIn flex items-center justify-center gap-2" role="status">
                    <Sparkles size={20} className="text-yellow-300" />
                    <p className="font-medium">{adaptiveMessage}</p>
                  </div>
                )}
                
                <button
                  onClick={handleGenerateAdaptive}
                  disabled={isGeneratingAdaptive || history.length === 0}
                  className={`
                    relative overflow-hidden group px-8 py-4 rounded-full font-bold text-lg shadow-xl transition-all transform hover:-translate-y-1 btn-spring touch-target
                    ${isGeneratingAdaptive || history.length === 0
                      ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-indigo-500/30'}
                  `}
                >
                  <div className="flex items-center gap-2 relative z-10">
                    {isGeneratingAdaptive ? (
                      <>
                        <Loader2 size={24} className="animate-spin" />
                        Designing Next Challenge...
                      </>
                    ) : (
                      <>
                        <PlusCircle size={24} />
                        Generate Next Adaptive Question
                      </>
                    )}
                  </div>
                </button>
                {history.length === 0 && !isGeneratingAdaptive && (
                     <p className="text-sm text-gray-400 mt-4">
                       Answer at least one question above to unlock adaptive mode.
                     </p>
                )}
              </div>

            </div>
          )}
        </main>
      )}

      {/* Floating Generate Report Button - Triggers view switch */}
      {view === 'app' && history.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40 animate-slide-up-fade">
          <Button
            onClick={() => setView('report')}
            className="rounded-full shadow-2xl shadow-indigo-600/30 px-6 py-4 text-base bg-indigo-600 hover:bg-indigo-700 text-white border-2 border-white/20 backdrop-blur-md"
          >
            <BarChart2 size={20} /> Generate Report
            <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs font-mono">
              {history.length}
            </span>
          </Button>
        </div>
      )}

      {activeStudyPlan && (
        <Suspense fallback={null}>
          <StudyPlan 
            plan={activeStudyPlan} 
            onClose={() => setActiveStudyPlan(null)} 
          />
        </Suspense>
      )}

      {/* Footer only on Landing page */}
      {(view === 'landing') && (
        <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-8 safe-bottom mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400 flex flex-col items-center gap-4">
            <p>© {new Date().getFullYear()} AI Interviewer Pro. Powered by Google Gemini.</p>
          </div>
        </footer>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ScrollManager>
        <AppContent />
      </ScrollManager>
    </AuthProvider>
  );
};

export default App;
