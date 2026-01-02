
import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Cpu, Activity, Scan, Fingerprint, Lock, Upload, FileUp, X, Terminal, Zap
} from 'lucide-react';
import Button from './ui/Button';
import InteractiveRobot from './InteractiveCube';
import { GradientText } from './ui/Typography';

interface ResumeAnalyzerProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

const COMMON_TECH_STACK = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'ruby', 'go', 'rust',
  'react', 'angular', 'vue', 'next.js', 'node', 'express', 'django', 'flask',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'ci/cd',
  'sql', 'nosql', 'mongodb', 'postgresql', 'redis', 'graphql',
  'machine learning', 'ai', 'tensorflow', 'pytorch', 'pandas', 'numpy',
  'html', 'css', 'sass', 'tailwind', 'redux', 'git', 'agile', 'scrum'
];

const ResumeAnalyzer: React.FC<ResumeAnalyzerProps> = ({ onSubmit, isLoading }) => {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [detectedSkills, setDetectedSkills] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync scanning state with loading state from parent
  useEffect(() => {
    if (!isLoading) {
      setIsScanning(false);
    }
  }, [isLoading]);

  // Real-time analysis of the resume text
  useEffect(() => {
    const lowerText = text.toLowerCase();
    const found = COMMON_TECH_STACK.filter(tech => lowerText.includes(tech));
    // Dedupe and limit
    setDetectedSkills([...new Set(found)].slice(0, 8));
  }, [text]);

  const handleSubmit = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    
    // Fix: Allow exactly 50 chars to match disabled state logic
    if (text.trim().length >= 50) {
      setIsScanning(true);
      // Simulate scanning delay for effect before actual submit
      setTimeout(() => {
        onSubmit(text);
      }, 1500);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const readFileContent = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setText(content);
      setFileName(file.name);
      setIsScanning(false);
    };
    
    // Simulate scan effect
    setIsScanning(true);
    
    // Simple text file handling
    if (file.type === 'text/plain' || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
      setTimeout(() => reader.readAsText(file), 800);
    } else {
      // For PDF/DOCX in this demo, we simulate extraction or show a message
      setTimeout(() => {
        setText(`[IMPORTED FILE: ${file.name}]\n\n(Note: In this demo environment, robust PDF/DOCX parsing requires a backend service. Please copy-paste the text content for the best analysis results.)\n\n...Simulated content extraction...`);
        setFileName(file.name);
        setIsScanning(false);
      }, 1500);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      readFileContent(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      readFileContent(e.target.files[0]);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const clearFile = () => {
    setText('');
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getWordCount = () => text.trim().split(/\s+/).filter(w => w.length > 0).length;
  const strength = Math.min(100, (text.length / 500) * 100);

  const isProcessing = isScanning || isLoading;

  return (
    <div className="w-full max-w-6xl mx-auto mb-12 animate-fadeIn relative z-10">
      
      {/* Header Section */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-900/10 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-4">
           <Cpu size={14} className="animate-pulse" /> Neural Ingestion Node
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
          Analyze <GradientText>Candidate Profile</GradientText>
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          Upload a resume or paste text below. Our AI scans for technical keywords, experience patterns, and knowledge gaps in real-time.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8 items-stretch min-h-[500px]">
        
        {/* LEFT COLUMN: 3D Visualization & Status */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          
          {/* 3D Agent Container */}
          <div className="relative h-64 lg:h-80 bg-[#0a0e27] rounded-2xl border border-white/10 overflow-hidden group">
             {/* Tech Grid Background */}
             <div className="absolute inset-0 bg-grid-small opacity-20"></div>
             
             {/* The 3D Component */}
             <div className="absolute inset-0 z-10">
                <InteractiveRobot className="w-full h-full" />
             </div>

             {/* HUD Overlays */}
             <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[10px] text-cyan-400 font-mono uppercase">
                   <Activity size={12} /> System Active
                </div>
                <div className="flex items-center gap-2 text-[10px] text-purple-400 font-mono uppercase">
                   <Fingerprint size={12} /> Biometrics: Null
                </div>
             </div>

             <div className="absolute bottom-4 right-4 z-20 text-right">
                <div className="text-2xl font-bold text-white tabular-nums">
                   {getWordCount()}
                </div>
                <div className="text-[10px] text-gray-500 font-mono uppercase">Words Detected</div>
             </div>
          </div>

          {/* Detected Skills Panel */}
          <div className="flex-grow bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 relative overflow-hidden">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                   <Scan size={16} className="text-cyan-400" />
                   Detected Signals
                </h3>
                <span className="text-[10px] text-gray-500 font-mono">{detectedSkills.length} MATCHES</span>
             </div>

             {detectedSkills.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-2 opacity-50 min-h-[100px]">
                   <Scan size={24} className="animate-pulse" />
                   <span className="text-xs">Waiting for input stream...</span>
                </div>
             ) : (
                <div className="flex flex-wrap gap-2 content-start">
                   {detectedSkills.map((skill, i) => (
                      <span 
                        key={skill} 
                        className="animate-pop-in px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono uppercase flex items-center gap-1.5"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                         <Zap size={10} fill="currentColor" /> {skill}
                      </span>
                   ))}
                </div>
             )}
          </div>
        </div>

        {/* RIGHT COLUMN: The Terminal Input */}
        <div className="lg:col-span-3 relative">
          
          <form className="h-full flex flex-col" onSubmit={(e) => e.preventDefault()}>
            <div 
              className={`
                relative flex-grow rounded-2xl bg-[#0d1117] border transition-all duration-300 overflow-hidden flex flex-col
                ${isFocused || isDragging ? 'border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)]' : 'border-white/10'}
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
               
               {/* Terminal Header */}
               <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                       <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                       <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                       <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
                       <Lock size={10} /> 
                       {fileName ? fileName : 'resume_context.txt'}
                    </div>
                  </div>
                  
                  {/* File Upload Trigger */}
                  <div className="flex items-center gap-2">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept=".txt,.md,.pdf,.docx"
                      onChange={handleFileSelect}
                    />
                    <button 
                      type="button"
                      onClick={triggerFileUpload}
                      className="flex items-center gap-2 px-3 py-1 rounded hover:bg-white/10 text-xs font-mono text-cyan-400 border border-transparent hover:border-cyan-500/30 transition-all"
                    >
                      <Upload size={12} /> IMPORT_FILE
                    </button>
                    {fileName && (
                       <button 
                         type="button" 
                         onClick={clearFile}
                         className="p-1 hover:text-red-400 text-gray-500 transition-colors"
                       >
                         <X size={12} />
                       </button>
                    )}
                  </div>
               </div>

               {/* Editor Area */}
               <div className="relative flex-grow flex">
                  {/* Line Numbers */}
                  <div className="hidden sm:flex flex-col items-end px-3 py-4 text-gray-700 font-mono text-xs select-none bg-[#0a0c10] border-r border-white/5 min-w-[3rem]">
                     {[...Array(20)].map((_, i) => (
                        <div key={i} className="leading-6">{i + 1}</div>
                     ))}
                  </div>

                  {/* Textarea */}
                  <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    disabled={isProcessing}
                    className="w-full h-full bg-transparent text-gray-300 font-mono text-sm p-4 outline-none resize-none leading-6 custom-scrollbar placeholder-gray-700 relative z-10"
                    placeholder="// Paste candidate resume text here...&#10;// OR Drag & Drop a file to import automatically.&#10;//&#10;// Example:&#10;// Senior Frontend Engineer with 5 years experience in React, TypeScript..."
                  />

                  {/* Drag Overlay */}
                  {isDragging && (
                    <div className="absolute inset-0 z-30 bg-[#0d1117]/90 flex flex-col items-center justify-center border-2 border-dashed border-cyan-500/50 m-4 rounded-xl backdrop-blur-sm animate-pulse">
                       <FileUp size={48} className="text-cyan-400 mb-4" />
                       <h3 className="text-xl font-bold text-white">Drop Resume File</h3>
                       <p className="text-cyan-400/70 font-mono text-sm mt-2">INITIALIZING UPLOAD PROTOCOL...</p>
                    </div>
                  )}

                  {/* Scanning Effect Overlay */}
                  {isScanning && (
                    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden bg-[#0d1117]/80 flex items-center justify-center backdrop-blur-sm">
                       <div className="w-full h-1 absolute top-0 bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,1)] animate-scan-down opacity-80"></div>
                       <div className="text-center">
                          <Terminal size={32} className="text-cyan-400 mx-auto mb-4 animate-spin" />
                          <div className="text-cyan-300 font-mono text-sm tracking-widest">
                            READING DATA STREAM...
                          </div>
                       </div>
                    </div>
                  )}
               </div>

               {/* Footer / Stats */}
               <div className="px-4 py-2 bg-white/5 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500 font-mono uppercase">
                  <div className="flex items-center gap-4">
                     <span>Ln {text.split('\n').length}, Col {text.length}</span>
                     <span>UTF-8</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <span>Signal Strength:</span>
                     <div className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${strength > 80 ? 'bg-green-500' : strength > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${strength}%` }}
                        ></div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end gap-4">
               {/* 
                 Updated Button logic to prevent double-click requirement.
                 - type="button" prevents form submit conflict.
                 - onMouseDown preventDefault prevents textarea blur, stopping re-renders.
                 - onClick manually triggers submit logic.
               */}
               <Button
                 type="button"
                 onClick={handleSubmit}
                 onMouseDown={(e) => e.preventDefault()}
                 disabled={text.trim().length < 50 || isProcessing}
                 variant={isProcessing ? 'secondary' : 'primary'}
                 className={`w-full sm:w-auto px-8 py-4 text-base group ${isProcessing ? 'bg-gray-800 text-cyan-400 border-cyan-500/30' : ''}`}
                 isLoading={isLoading} 
               >
                 {isProcessing ? (
                    <>
                      <Terminal className="animate-spin mr-2" size={18} /> PROCESSING DATA STREAM...
                    </>
                 ) : (
                    <>
                      <Sparkles size={18} className="text-yellow-300 group-hover:scale-125 transition-transform" />
                      INITIATE INTERVIEW SEQUENCE
                    </>
                 )}
               </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
