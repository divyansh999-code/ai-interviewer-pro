
import React, { useEffect, useRef, useState } from 'react';

// Split Text Component for Character Animations
export const SplitText = ({ text, className = "", delay = 0 }: { text: string, className?: string, delay?: number }) => {
  return (
    <span className={`inline-block ${className}`} aria-label={text}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="char-enter inline-block will-change-transform"
          style={{ 
            animationDelay: `${delay + i * 35 + (Math.random() * 20 - 10)}ms`,
            whiteSpace: char === ' ' ? 'pre' : 'normal'
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
};

// Gradient Text Component
export const GradientText = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => {
  return (
    <span className={`text-gradient-flow ${className}`}>
      {children}
    </span>
  );
};

// Blur Reveal Component for Scroll Entrances
export const RevealText = ({ children, className = "", threshold = 0.2, delay = 0 }: { children?: React.ReactNode, className?: string, threshold?: number, delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        // Small delay before setting visible to allow for smooth hydration
        setTimeout(() => setIsVisible(true), delay);
        observer.disconnect();
      }
    }, { threshold });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, delay]);

  return (
    <div ref={ref} className={`blur-reveal ${isVisible ? 'visible' : ''} ${className}`}>
      {children}
    </div>
  );
};

// Highlight Component for Emphasis
export const Highlight = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.5 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className={`highlight-sweep px-1 rounded ${isVisible ? 'visible' : ''} ${className}`}>
      {children}
    </span>
  );
};

// Drop Cap Wrapper
export const DropCap = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => {
  return (
    <div className={`drop-cap ${className}`}>
      {children}
    </div>
  );
};

// Interactive Keyword
export const Keyword = ({ children }: { children?: React.ReactNode }) => {
  return (
    <span className="keyword-glow font-semibold text-cyan-400 cursor-default">
      {children}
    </span>
  );
};

// Typewriter Component (Enhanced)
export const Typewriter = ({ text, delay = 0, speed = 30, className = "" }: { text: string, delay?: number, speed?: number, className?: string }) => {
  const [displayText, setDisplayText] = useState("");
  const [startTyping, setStartTyping] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStartTyping(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!startTyping) return;

    let i = 0;
    // For longer text, we might want to add multiple chars per frame to speed it up visually
    // if speed is very low. Here we keep it simple.
    const interval = setInterval(() => {
      if (i <= text.length) {
        setDisplayText(text.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, startTyping, speed]);

  return (
    <span className={`typewriter-cursor ${className}`}>
      {displayText}
    </span>
  );
};
