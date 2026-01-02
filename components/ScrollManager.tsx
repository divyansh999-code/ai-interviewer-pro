
import React, { useEffect, useRef, useState } from 'react';

export const ScrollContext = React.createContext<{
  scrollDirection: 'up' | 'down';
  scrollY: number;
}>({
  scrollDirection: 'down',
  scrollY: 0,
});

export const ScrollManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [scrollY, setScrollY] = useState(0);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const updateScroll = () => {
      const currentScroll = window.scrollY;
      
      setScrollY(currentScroll);
      
      const direction = currentScroll > lastScrollY.current ? 'down' : 'up';
      // Only update direction if it actually changed to avoid re-renders
      if (direction !== (lastScrollY.current > currentScroll ? 'up' : 'down')) {
        setScrollDirection(direction);
      }
      
      lastScrollY.current = currentScroll;
      ticking.current = false;
    };

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateScroll);
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <ScrollContext.Provider value={{ scrollDirection, scrollY }}>
      {children}
    </ScrollContext.Provider>
  );
};
