
import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, Target, Building2, Clock, 
  Star, Quote, Zap, Award, CheckCircle,
  TrendingUp, Users, Sparkles
} from 'lucide-react';
import { RevealText, GradientText, Highlight } from './ui/Typography';

// --- Utility: Count Up Hook ---
const useCountUp = (end: number, duration: number = 2000, start: boolean = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Ease Out Expo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(easeProgress * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, start]);

  return count;
};

// --- Sub-Component: Statistic Card (Number) ---
const StatCard = ({ 
  icon: Icon, 
  end, 
  suffix = "", 
  label, 
  delay = 0,
  inView 
}: { 
  icon: React.ElementType, 
  end: number, 
  suffix?: string, 
  label: string, 
  delay?: number,
  inView: boolean
}) => {
  const count = useCountUp(end, 2000, inView);
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    if (count === end && inView) {
      setShowSparkles(true);
      const t = setTimeout(() => setShowSparkles(false), 2000);
      return () => clearTimeout(t);
    }
  }, [count, end, inView]);

  return (
    <div className="relative group p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm hover:shadow-lg dark:hover:bg-white/10 transition-all duration-500 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className={`relative p-3 rounded-xl bg-indigo-50 dark:bg-gradient-to-br dark:from-indigo-500/20 dark:to-purple-500/20 group-hover:scale-110 transition-transform duration-500`}>
          <Icon 
            size={32} 
            className={`text-indigo-600 dark:text-white transition-all duration-1000 ${inView ? 'stroke-draw' : 'opacity-0'}`} 
            style={{ transitionDelay: `${delay}ms` }}
          />
          <div className="absolute inset-0 bg-indigo-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        {showSparkles && (
          <Sparkles className="text-yellow-400 animate-bounce absolute top-4 right-4" size={20} />
        )}
      </div>
      
      <div className="relative">
        <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-1 tabular-nums">
          {count.toLocaleString()}{suffix}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 font-medium">{label}</p>
      </div>
    </div>
  );
};

// --- Sub-Component: Circular Stat ---
const CircularStat = ({ 
  end, 
  label, 
  inView 
}: { 
  end: number, 
  label: string, 
  inView: boolean 
}) => {
  const count = useCountUp(end, 2500, inView);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (count / 100) * circumference;

  return (
    <div className="relative group p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm flex flex-col items-center justify-center hover:shadow-lg dark:hover:bg-white/10 transition-colors">
      <div className="relative w-40 h-40 mb-4">
        {/* Background Ring */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%" cy="50%" r={radius}
            stroke="currentColor"
            strokeOpacity="0.1"
            strokeWidth="12"
            fill="transparent"
            className="text-gray-400 dark:text-white"
          />
          {/* Progress Ring */}
          <circle
            cx="50%" cy="50%" r={radius}
            stroke="url(#gradient)"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={inView ? strokeDashoffset : circumference}
            strokeLinecap="round"
            className="transition-all duration-100 ease-out"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-900 dark:text-white tabular-nums">{count}%</span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Success</span>
        </div>
      </div>
      <p className="text-gray-500 dark:text-gray-400 font-medium text-center">{label}</p>
    </div>
  );
};

// --- Sub-Component: Testimonial Card ---
interface TestimonialData {
  name: string;
  role: string;
  img: string;
  stars: number;
  text: string;
}

const TestimonialCard: React.FC<{ data: TestimonialData }> = ({ data }) => (
  <div className="w-[320px] h-[180px] flex-shrink-0 mx-4 p-6 rounded-2xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 backdrop-blur-md hover:shadow-xl transition-all duration-300 group cursor-default relative overflow-hidden">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 p-[2px]">
          <img 
            src={data.img} 
            alt={data.name} 
            loading="lazy" 
            decoding="async" 
            className="w-full h-full rounded-full object-cover border-2 border-white dark:border-[#0a0e27]" 
          />
        </div>
        <div>
          <h4 className="text-gray-900 dark:text-white font-bold text-sm leading-tight">{data.name}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">{data.role}</p>
        </div>
      </div>
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={12} className={`${i < data.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'} transition-all duration-500 group-hover:scale-110`} style={{ transitionDelay: `${i * 50}ms` }} />
        ))}
      </div>
    </div>
    <div className="relative">
      <Quote size={24} className="absolute -top-2 -left-2 text-indigo-100 dark:text-white/5 transition-colors" />
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed pl-4 border-l-2 border-indigo-500/30 group-hover:border-indigo-500 transition-colors line-clamp-3 group-hover:line-clamp-none">
        "{data.text}"
      </p>
    </div>
  </div>
);

// --- Sub-Component: Interactive Graph ---
const SuccessGraph = ({ inView }: { inView: boolean }) => {
  return (
    <div className="w-full h-48 relative overflow-hidden rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm p-4 group shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-50 dark:from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Grid Lines */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-20 pointer-events-none">
        <div className="w-full h-px bg-gray-400 dark:bg-white"></div>
        <div className="w-full h-px bg-gray-400 dark:bg-white"></div>
        <div className="w-full h-px bg-gray-400 dark:bg-white"></div>
      </div>

      <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
        <path
          d="M0,150 C100,140 200,100 300,80 C400,60 500,90 600,50 C700,10 800,30 900,10"
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          className={`transition-all duration-[3000ms] ease-out ${inView ? 'animate-draw' : 'opacity-0'}`}
        />
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        
        {/* Interactive Points */}
        {[
          { cx: "0%", cy: 150, val: "Start" },
          { cx: "33%", cy: 80, val: "Month 1" },
          { cx: "66%", cy: 50, val: "Month 2" },
          { cx: "100%", cy: 10, val: "Hired" }
        ].map((pt, i) => (
          <g key={i} className="group/point">
            <circle cx={pt.cx} cy={pt.cy} r="6" fill="white" stroke="#6366f1" strokeWidth="2" className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ transitionDelay: `${i * 500}ms` }} />
            <circle cx={pt.cx} cy={pt.cy} r="12" fill="currentColor" fillOpacity="0.1" className="text-indigo-500 opacity-0 group-hover:opacity-100 animate-ping" />
            <rect x={parseFloat(pt.cx) > 80 ? "85%" : pt.cx} y={pt.cy - 40} width="80" height="30" rx="4" fill="#1e293b" className="opacity-0 group-hover/point:opacity-100 transition-opacity" />
            <text x={parseFloat(pt.cx) > 80 ? "89%" : parseFloat(pt.cx) + 2 + "%"} y={pt.cy - 20} fill="white" fontSize="10" textAnchor="middle" className="opacity-0 group-hover/point:opacity-100 transition-opacity pointer-events-none">
              {pt.val}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

// --- Main Component ---
const StatsSection = () => {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const testimonials = [
    { name: "Sarah J.", role: "SDE I", img: "https://i.pravatar.cc/100?img=1", stars: 5, text: "The adaptive questions were spot on. Got placed at Amazon!" },
    { name: "Rahul M.", role: "Data Scientist", img: "https://i.pravatar.cc/100?img=3", stars: 5, text: "Resume analysis found gaps I didn't know I had. Lifesaver." },
    { name: "Emily R.", role: "Frontend Dev", img: "https://i.pravatar.cc/100?img=5", stars: 5, text: "Real-time feedback helped me fix my communication style." },
    { name: "David K.", role: "Backend Eng", img: "https://i.pravatar.cc/100?img=8", stars: 4, text: "Harder than real interviews, which made the actual one easy." },
    { name: "Priya S.", role: "Full Stack", img: "https://i.pravatar.cc/100?img=9", stars: 5, text: "The system design questions are gold. Highly recommend." },
  ];

  const companies = [
    { name: "Google", icon: Trophy },
    { name: "Amazon", icon: Target },
    { name: "Microsoft", icon: Building2 },
    { name: "Netflix", icon: Zap },
    { name: "Meta", icon: Users },
    { name: "Apple", icon: Award },
  ];

  return (
    <section ref={sectionRef} className="relative w-full min-h-[800px] bg-gray-50 dark:bg-[#0a0e27] overflow-hidden py-24 transition-colors duration-500">
      {/* Backgrounds */}
      <div className="absolute inset-0 bg-topographic opacity-5 dark:opacity-20 z-0"></div>
      
      {/* Diagonal Split */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/50 dark:from-indigo-900/20 to-purple-100/50 dark:to-purple-900/20 z-0 transform -skew-y-3 scale-110 origin-top-left border-b border-gray-200 dark:border-white/5"></div>

      {/* Floating Badges */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {[
          { text: "Top Rated", top: "10%", left: "5%", delay: "0s" },
          { text: "AI Powered", top: "20%", right: "10%", delay: "1s" },
          { text: "Free Forever", bottom: "15%", left: "10%", delay: "2s" },
          { text: "Expert Verified", bottom: "30%", right: "5%", delay: "3s" }
        ].map((badge, i) => (
          <div 
            key={i}
            className="absolute px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md text-xs font-bold text-gray-800 dark:text-white shadow-lg float-sine transition-transform hover:scale-110"
            style={{ 
              top: badge.top, 
              left: badge.left, 
              right: badge.right, 
              bottom: badge.bottom, 
              animationDelay: badge.delay 
            }}
          >
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-2 animate-pulse"></span>
            {badge.text}
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-20">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left Column: Stats Grid (50%) */}
          <div className="w-full lg:w-1/2">
            <div className="mb-12">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-4">
                  <TrendingUp size={12} /> Live Metrics
               </div>
               <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                 Proven Results, <br />
                 <GradientText className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-600 dark:from-cyan-400 dark:to-purple-400"> backed by data.</GradientText>
               </h2>
               <RevealText delay={200}>
                 <p className="text-gray-600 dark:text-gray-400 text-lg">
                   Join thousands of developers who transformed their interview preparation with <Highlight>AI Interviewer Pro</Highlight>.
                 </p>
               </RevealText>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <StatCard 
                icon={Trophy} 
                end={10000} 
                suffix="+" 
                label="Questions Generated" 
                delay={0}
                inView={inView}
              />
              <CircularStat 
                end={95} 
                label="Interview Success Rate" 
                inView={inView}
              />
              <StatCard 
                icon={Building2} 
                end={500} 
                suffix="+" 
                label="Companies Covered" 
                delay={200}
                inView={inView}
              />
              <StatCard 
                icon={Clock} 
                end={24} 
                suffix="/7" 
                label="AI Availability" 
                delay={400}
                inView={inView}
              />
            </div>
          </div>

          {/* Right Column: Social Proof & Graph (50%) */}
          <div className="w-full lg:w-1/2 space-y-12">
            
            {/* Interactive Graph */}
            <div className="space-y-4">
               <div className="flex justify-between items-end">
                  <h3 className="text-gray-900 dark:text-white font-bold text-xl">Success Trajectory</h3>
                  <span className="text-cyan-600 dark:text-cyan-400 text-sm font-mono">+140% improvement</span>
               </div>
               <SuccessGraph inView={inView} />
            </div>

            {/* Testimonials Carousel */}
            <div className="relative">
               <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-6 pl-4 border-l-4 border-purple-500">What Students Say</h3>
               <div className="flex overflow-hidden relative mask-image-gradient">
                  <div className="flex animate-scroll-left hover:pause gap-4 py-4">
                     {[...testimonials, ...testimonials].map((t, i) => (
                        <TestimonialCard key={i} data={t} />
                     ))}
                  </div>
                  {/* Fade Edges (Adjusted for Light Mode visibility) */}
                  <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-50 dark:from-[#0a0e27] to-transparent z-10"></div>
                  <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-50 dark:from-[#0a0e27] to-transparent z-10"></div>
               </div>
            </div>

            {/* Logo Ticker */}
            <div className="pt-8 border-t border-gray-200 dark:border-white/10">
              <p className="text-center text-gray-500 text-sm mb-6 uppercase tracking-widest">Candidates hired at</p>
              <div className="flex overflow-hidden relative opacity-60 hover:opacity-100 transition-opacity duration-500">
                <div className="flex animate-scroll-right gap-12 items-center">
                  {[...companies, ...companies].map((c, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer group">
                       <c.icon size={24} className="group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" />
                       <span className="font-bold text-xl">{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
