
import React, { useRef, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
  withParticles?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  withParticles = true,
  className = '',
  onClick,
  disabled,
  ...props 
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);

  const createParticles = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!withParticles || disabled || isLoading) return;

    // Check for reduce motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const btn = btnRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const colors = variant === 'primary' 
      ? ['#ffffff', '#a5b4fc', '#c4b5fd'] 
      : ['#6366f1', '#a855f7', '#ec4899'];

    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('span');
      particle.classList.add('particle');
      
      // Randomize physics
      const angle = (Math.random() * 360) * (Math.PI / 180);
      const dist = Math.random() * 40 + 20;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;
      
      const size = Math.random() * 3 + 2;
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.setProperty('--tx', `${tx}px`);
      particle.style.setProperty('--ty', `${ty}px`);
      
      btn.appendChild(particle);
      
      setTimeout(() => particle.remove(), 600);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Haptic feedback for touch devices
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    
    createParticles(e);
    if (onClick) onClick(e);
  };

  const baseStyles = "relative overflow-hidden rounded-xl font-semibold transition-all btn-spring disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 touch-target";
  
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 border border-transparent",
    secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 shadow-sm",
    outline: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20",
    ghost: "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
  };

  return (
    <button
      ref={btnRef}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={handleClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin" size={18} />
          <span className="opacity-80">Loading...</span>
        </>
      ) : children}
    </button>
  );
};

export default Button;
