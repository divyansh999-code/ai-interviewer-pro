
import React from 'react';
import { ArrowLeft, Heart, Zap, Brain, Target, Mail, Globe, Code2, Sparkles } from 'lucide-react';
import { GradientText } from './ui/Typography';
import Button from './ui/Button';

interface AboutPageProps {
  onBack: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
      
      {/* Cinematic Background */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/10 rounded-full blur-[100px]"></div>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
         <div className="absolute inset-0 bg-grid-small opacity-[0.03]"></div>
      </div>

      {/* Navbar / Back Button */}
      <nav className="fixed top-0 left-0 right-0 z-40 p-6">
         <div className="max-w-7xl mx-auto">
            <button onClick={onBack} className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group px-4 py-2 rounded-full bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10">
               <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
               <span className="font-mono text-xs tracking-widest uppercase">Back to Home</span>
            </button>
         </div>
      </nav>

      <div className="container mx-auto px-4 pt-32 pb-20 relative z-10 max-w-4xl">
        
        {/* Main Content Card */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden animate-slide-up-fade">
           
           {/* Decorative Elements */}
           <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
              <Code2 size={400} />
           </div>
           
           {/* Header */}
           <div className="mb-12 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-[10px] font-bold uppercase tracking-widest mb-6">
                 <Sparkles size={12} /> The Story
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                 About <GradientText>AI Interviewer Pro</GradientText>
              </h1>
              <p className="text-lg text-gray-400 leading-relaxed max-w-3xl">
                 AI Interviewer Pro is a project built by <span className="text-white font-semibold">Divyansh Khandal</span>, an AI and Data Science student from Rajasthan. 
                 Born from late-night coding sessions and the frustration of stale interview prep platforms, this tool solves one problem: 
                 <span className="text-cyan-200 block mt-2 font-medium">making technical interview practice feel real.</span>
              </p>
           </div>

           {/* What We Believe Section */}
           <div className="mb-16">
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                 <Heart className="text-pink-500 fill-pink-500" size={24} /> What We Believe
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Card 1 */}
                 <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:bg-white/10 transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400 group-hover:scale-110 transition-transform">
                       <Brain size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">AI should teach, not test</h3>
                    <p className="text-sm text-gray-400">Feedback matters more than scores. We prioritize explaining 'why' over just telling you if you're wrong.</p>
                 </div>

                 {/* Card 2 */}
                 <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-500/30 hover:bg-white/10 transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4 text-cyan-400 group-hover:scale-110 transition-transform">
                       <Zap size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Practice beats theory</h3>
                    <p className="text-sm text-gray-400">Voice interviews &gt; reading question banks. The pressure of real-time interaction builds true confidence.</p>
                 </div>

                 {/* Card 3 */}
                 <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/30 hover:bg-white/10 transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition-transform">
                       <Target size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Personalization is key</h3>
                    <p className="text-sm text-gray-400">Your resume, your level, your gaps. Generic questions don't help you stand out. Tailored ones do.</p>
                 </div>
              </div>
           </div>

           {/* Footer / Signature */}
           <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                 <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px]">
                    <img 
                       src="https://api.dicebear.com/7.x/avataaars/svg?seed=Divyansh" 
                       alt="Divyansh Khandal" 
                       className="w-full h-full rounded-full bg-black"
                    />
                 </div>
                 <div>
                    <div className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-1">Creator</div>
                    <div className="text-white font-serif text-xl">Divyansh Khandal</div>
                 </div>
              </div>

              <a 
                 href="mailto:divyanshkhandal2005@gmail.com"
                 className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group"
              >
                 <Mail size={18} className="text-gray-400 group-hover:text-cyan-400 transition-colors" />
                 <span className="text-gray-300 group-hover:text-white">divyanshkhandal2005@gmail.com</span>
              </a>
           </div>

        </div>
      </div>
    </div>
  );
};

export default AboutPage;
