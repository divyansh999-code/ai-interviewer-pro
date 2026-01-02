
import React, { useRef, useEffect } from 'react';

interface ParallaxProps {
  children: React.ReactNode;
  speed?: number; // negative for slower (background), positive for faster
  className?: string;
}

const Parallax: React.FC<ParallaxProps> = ({ children, speed = 0.5, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const scrolled = window.scrollY;
      const val = scrolled * speed;
      // Use translate3d for GPU acceleration
      ref.current.style.transform = `translate3d(0, ${val}px, 0)`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
};

export default Parallax;
