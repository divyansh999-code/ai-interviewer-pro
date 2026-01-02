
import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, Github, Linkedin, Heart, 
  ArrowUp, Mail, Globe
} from 'lucide-react';

// Hook for magnetic effect
const useMagnetic = () => {
  const ref = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 };
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    if (Math.abs(distanceX) < 50 && Math.abs(distanceY) < 50) {
      setPosition({ x: distanceX * 0.2, y: distanceY * 0.2 });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return { ref, position, handleMouseMove, handleMouseLeave };
};

const MagneticLink = ({ href, onClick, children, Icon }: { href: string, onClick?: (e: React.MouseEvent) => void, children?: React.ReactNode, Icon?: any }) => {
  const { ref, position, handleMouseMove, handleMouseLeave } = useMagnetic();

  return (
    <a
      ref={ref}
      href={href}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick(e);
        }
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 group w-fit link-underline"
    >
      {Icon && (
        <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-cyan-400">
          <Icon size={14} />
        </span>
      )}
      <span className="relative">
        {children}
      </span>
    </a>
  );
};

const SocialIcon = ({ Icon, href }: { Icon: any, href: string }) => {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-300 group relative overflow-hidden btn-spring"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <Icon size={18} className="relative z-10 group-hover:scale-110 transition-transform" />
    </a>
  );
};

interface FooterProps {
  onNavigate?: (view: any) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [konamiIndex, setKonamiIndex] = useState(0);
  
  // Back to Top Logic
  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Konami Code
  useEffect(() => {
    const code = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    const handler = (e: KeyboardEvent) => {
      if (e.key === code[konamiIndex]) {
        const nextIndex = konamiIndex + 1;
        if (nextIndex === code.length) {
          alert("Cheat Code Activated! 🎮 (Simulated Easter Egg)");
          setKonamiIndex(0);
        } else {
          setKonamiIndex(nextIndex);
        }
      } else {
        setKonamiIndex(0);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [konamiIndex]);

  return (
    <footer className="relative bg-[#050713] pt-20 pb-10 overflow-hidden">
      {/* Background Noise */}
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none"></div>
      
      {/* Glowing Top Border */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50 animate-pulse"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 max-w-4xl mx-auto">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="bg-gradient-to-br from-indigo-600 to-cyan-600 p-2.5 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-indigo-900/20 btn-spring">
                <Terminal className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-cyan-200 transition-all">
                  AI Interviewer Pro
                </h3>
                <p className="text-xs text-gray-500 font-mono">v2.5.0-beta</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Master your technical interview with the power of generative AI. 
              Personalized questions, real-time feedback, and success.
            </p>
            <div className="flex gap-4">
              <SocialIcon Icon={Github} href="https://github.com/divyansh999-code" />
              <SocialIcon Icon={Linkedin} href="https://www.linkedin.com/in/divyansh-khandal-5b8b8b32b/" />
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-4 bg-purple-500 rounded-full"></span> Company
            </h4>
            <ul className="space-y-3">
              <li>
                <MagneticLink 
                  href="#" 
                  Icon={Globe} 
                  onClick={() => onNavigate && onNavigate('about')}
                >
                  About Us
                </MagneticLink>
              </li>
              <li>
                <MagneticLink 
                  href="#" 
                  Icon={Mail}
                  onClick={() => onNavigate && onNavigate('contact')}
                >
                  Contact Support
                </MagneticLink>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-end items-center gap-4">
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-1 text-sm text-gray-500">
               Made with <Heart size={14} className="text-red-500 animate-heartbeat fill-red-500" /> by 
               <span className="text-white font-medium hover:text-cyan-400 cursor-pointer transition-colors link-underline">Divyansh Khandal</span>
             </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 p-3 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all duration-500 transform hover:-translate-y-1 btn-spring ${showTopBtn ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
      >
        <ArrowUp size={20} className="animate-bounce" />
      </button>
    </footer>
  );
};

export default Footer;
