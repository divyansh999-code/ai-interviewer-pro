
import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top', 
  delay = 300 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounting, setIsMounting] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  const show = () => {
    timeoutRef.current = window.setTimeout(() => {
      setIsMounting(true);
      setIsVisible(true);
    }, delay);
  };

  const hide = () => {
    clearTimeout(timeoutRef.current);
    setIsVisible(false);
    setTimeout(() => setIsMounting(false), 200); // Wait for exit anim
  };

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative inline-block" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {children}
      {isMounting && (
        <div 
          className={`
            absolute z-50 px-3 py-2 text-xs font-semibold text-white bg-gray-900 rounded-lg shadow-xl whitespace-nowrap pointer-events-none
            ${positions[position]}
            ${isVisible ? 'tooltip-anim' : 'opacity-0 scale-95 transition-all duration-150'}
          `}
        >
          {content}
          {/* Arrow */}
          <div 
            className={`
              absolute w-2 h-2 bg-gray-900 transform rotate-45
              ${position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' : ''}
              ${position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' : ''}
              ${position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' : ''}
              ${position === 'right' ? 'left-[-4px] top-1/2 -translate-y-1/2' : ''}
            `}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
