
import React from 'react';
import { ArrowLeft, Mail, Linkedin, Clock, MessageSquare, Bug, HelpCircle, User, Code2, ExternalLink } from 'lucide-react';
import { GradientText } from './ui/Typography';

interface ContactPageProps {
  onBack: () => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-purple-500/30 overflow-x-hidden relative">
      
      {/* Cinematic Background */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[100px]"></div>
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
        
        {/* Main Content */}
        <div className="space-y-8 animate-slide-up-fade">
           
           {/* Header */}
           <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-[10px] font-bold uppercase tracking-widest mb-6">
                 <HelpCircle size={12} /> Support Channel
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                 Get in <GradientText className="from-purple-400 via-pink-400 to-purple-400">Touch</GradientText>
              </h1>
              <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
                 Need help? Found a bug? Want to collaborate?
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Primary Contact */}
              <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-purple-500/30 transition-colors group">
                 <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <User size={14} className="text-purple-400" /> Primary Contact
                 </h3>
                 
                 <div className="space-y-6">
                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 border border-white/5">
                          <Code2 size={20} />
                       </div>
                       <div>
                          <div className="text-xs text-gray-500 mb-1">Developer</div>
                          <div className="text-lg font-medium text-white">Divyansh Khandal</div>
                       </div>
                    </div>

                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 border border-white/5">
                          <Mail size={20} />
                       </div>
                       <div>
                          <div className="text-xs text-gray-500 mb-1">Email</div>
                          <a href="mailto:divyanshkhandal2005@gmail.com" className="text-lg font-medium text-white hover:text-purple-400 transition-colors underline decoration-white/20 underline-offset-4 hover:decoration-purple-400">
                             divyanshkhandal2005@gmail.com
                          </a>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Social & Feedback */}
              <div className="space-y-6">
                 
                 {/* LinkedIn */}
                 <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-blue-500/30 transition-colors group h-full flex flex-col justify-between">
                    <div>
                       <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                          <Linkedin size={14} className="text-blue-400" /> Found This Useful?
                       </h3>
                       
                       <a 
                          href="https://www.linkedin.com/in/divyansh-khandal-5b8b8b32b/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 rounded-xl bg-blue-600/10 border border-blue-500/20 hover:bg-blue-600/20 hover:border-blue-500/40 transition-all group/link mb-6"
                       >
                          <span className="font-medium text-blue-200">Connect on LinkedIn</span>
                          <ExternalLink size={16} className="text-blue-400 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                       </a>

                       <div className="flex items-start gap-3 text-sm text-gray-400">
                          <MessageSquare size={16} className="mt-1 text-gray-500 shrink-0" />
                          <p>
                             Share feedback—seriously, it fuels late-night coding.
                          </p>
                       </div>
                    </div>
                 </div>

              </div>

              {/* Office Hours - Full Width */}
              <div className="md:col-span-2 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-green-500/30 transition-colors flex flex-col md:flex-row items-center gap-6">
                 <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 border border-green-500/20 shrink-0">
                    <Clock size={24} />
                 </div>
                 <div className="flex-grow text-center md:text-left">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Office Hours</h3>
                    <p className="text-gray-300">
                       None—this is a side project. But I check emails daily and genuinely want to hear from you.
                    </p>
                 </div>
              </div>

           </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;
