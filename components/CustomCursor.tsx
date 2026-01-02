
import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';

const THEMES = {
  default: { colors: ['#00f5ff', '#b000ff', '#ff00ff'], type: 'circle' },
  hero: { colors: ['#7c3aed', '#22d3ee', '#f472b6'], type: 'star' },
  features: { colors: ['#2563eb', '#4ade80', '#ffffff'], type: 'bolt' },
  stats: { colors: ['#22c55e', '#f97316', '#06b6d4'], type: 'number' },
  cta: { colors: ['#ef4444', '#eab308', '#3b82f6', '#a855f7', '#ec4899'], type: 'confetti' },
};

const CustomCursor = () => {
  // --- Refs ---
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  
  // --- State ---
  const [isActive, setIsActive] = useState(false);
  const [config, setConfig] = useState({
    reduceMotion: false,
    paused: false
  });

  // --- Logic Refs ---
  const cursor = useRef({ x: -100, y: -100 });
  const outer = useRef({ x: -100, y: -100 });
  
  // Interactions
  const hoverState = useRef<'default' | 'text' | 'button' | 'link' | 'input' >('default');
  
  // Theme State
  const currentTheme = useRef<keyof typeof THEMES>('default');
  
  // Performance
  const particlePool = useRef<any[]>([]);

  // Init Particle Pool
  if (particlePool.current.length === 0) {
    for (let i = 0; i < 30; i++) {
      particlePool.current.push({
        active: false,
        x: 0, y: 0, vx: 0, vy: 0,
        size: 0, color: '#fff', life: 0,
      });
    }
  }

  useEffect(() => {
    // 1. Config Check
    const updateConfig = () => {
      setConfig({
        reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        paused: localStorage.getItem('cursor-paused') === 'true'
      });
    };
    updateConfig();
    
    // 2. Initial Setup
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    // 3. Section Observer (Theme Changing)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (id === 'section-hero') currentTheme.current = 'hero';
          else if (id === 'section-features') currentTheme.current = 'features';
          else if (id === 'section-stats') currentTheme.current = 'stats';
          else if (id === 'section-cta') currentTheme.current = 'cta';
          else currentTheme.current = 'default';
        }
      });
    }, { threshold: 0.2 });

    ['section-hero', 'section-features', 'section-stats', 'section-cta'].forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // 4. Input Detection
    const onMouseMove = (e: MouseEvent) => {
      if (!isActive) {
        setIsActive(true);
        document.body.classList.add('use-custom-cursor');
        // Initial set
        cursor.current = { x: e.clientX, y: e.clientY };
        outer.current = { x: e.clientX, y: e.clientY };
      }

      const x = e.clientX;
      const y = e.clientY;
      cursor.current = { x, y };

      // CRITICAL: Update Inner Cursor Immediately (No Lag)
      if (innerRef.current) {
         innerRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }

      // Check Hover State
      const target = e.target as HTMLElement;
      const tag = target.tagName.toLowerCase();
      
      if (target.closest('button') || tag === 'button') hoverState.current = 'button';
      else if (target.closest('a')) hoverState.current = 'link';
      else if (tag === 'input' || tag === 'textarea') hoverState.current = 'input';
      else hoverState.current = 'default';
    };

    const onMouseDown = () => {
       if (!config.reduceMotion) spawnBurst(cursor.current.x, cursor.current.y);
       if (innerRef.current) innerRef.current.style.transform += ` scale(0.8)`; 
    };
    
    const onMouseUp = () => {
       if (innerRef.current) {
           innerRef.current.style.transform = `translate3d(${cursor.current.x}px, ${cursor.current.y}px, 0) translate(-50%, -50%)`;
       }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      document.body.classList.remove('use-custom-cursor');
      observer.disconnect();
    };
  }, [isActive, config]);

  const spawnBurst = (x: number, y: number) => {
    const palette = THEMES[currentTheme.current].colors;
    let spawned = 0;
    const pool = particlePool.current;
    const count = 8;
    
    for (let i = 0; i < pool.length; i++) {
      const p = pool[i];
      if (!p.active) {
        const angle = (Math.PI * 2 * spawned) / count;
        const speed = Math.random() * 2 + 2;
        p.active = true;
        p.x = x; p.y = y;
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;
        p.size = Math.random() * 3 + 2;
        p.color = palette[Math.floor(Math.random() * palette.length)];
        p.life = 1;
        spawned++;
        if (spawned >= count) break;
      }
    }
  };

  // --- Animation Loop ---
  useEffect(() => {
    if (!isActive || config.paused) return;

    let lastTime = 0;

    const animate = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;
      // Normalize dt to prevent huge jumps on lag spikes
      const dtFactor = Math.min(dt / 16.67, 2); 

      // SMOOTH LERP PHYSICS
      // Factor: 0.15 provides a nice "buttery" feel. 
      // Higher = faster/snappier, Lower = slower/laggier.
      const lerpFactor = (hoverState.current === 'button' ? 0.2 : 0.15) * dtFactor;

      outer.current.x += (cursor.current.x - outer.current.x) * lerpFactor;
      outer.current.y += (cursor.current.y - outer.current.y) * lerpFactor;

      // Render Outer Ring
      if (outerRef.current) {
         let width = 40, height = 40, border = '2px';
         let rot = 0;
         
         if (hoverState.current === 'button') { width = 60; height = 60; }
         else if (hoverState.current === 'link') { width = 60; height = 60; border = '1px'; }
         else if (hoverState.current === 'input') { width = 0; height = 0; }

         // Slight scale deformation based on distance moved (velocity approximation)
         const dx = cursor.current.x - outer.current.x;
         const dy = cursor.current.y - outer.current.y;
         const dist = Math.sqrt(dx*dx + dy*dy);
         
         const scaleX = 1 + Math.min(dist * 0.005, 0.15);
         const scaleY = 1 - Math.min(dist * 0.005, 0.15);
         
         if (dist > 1) rot = Math.atan2(dy, dx) * (180/Math.PI);

         outerRef.current.style.width = `${width}px`;
         outerRef.current.style.height = `${height}px`;
         outerRef.current.style.borderWidth = border;
         
         const targetColor = THEMES[currentTheme.current].colors[0];
         outerRef.current.style.borderColor = targetColor;
         if (innerRef.current) innerRef.current.style.backgroundColor = targetColor;

         // Use translate3d for GPU acceleration
         outerRef.current.style.transform = `translate3d(${outer.current.x}px, ${outer.current.y}px, 0) translate(-50%, -50%) rotate(${rot}deg) scale(${scaleX}, ${scaleY})`;
      }

      // Render Particles
      if (canvasRef.current) {
         const ctx = canvasRef.current.getContext('2d');
         if (ctx) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            for(let i=0; i<particlePool.current.length; i++){
               const p = particlePool.current[i];
               if(p.active){
                  p.life -= 0.05 * dtFactor;
                  p.x += p.vx * dtFactor; 
                  p.y += p.vy * dtFactor;
                  
                  if(p.life <= 0) p.active = false;
                  else {
                     ctx.fillStyle = p.color;
                     ctx.globalAlpha = p.life;
                     ctx.beginPath();
                     ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
                     ctx.fill();
                  }
               }
            }
         }
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isActive, config]);

  if (!isActive) return null;

  return (
    <div className="custom-cursor-container fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {!config.reduceMotion && (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      )}
      
      {/* Outer Ring */}
      <div 
        ref={outerRef} 
        className="absolute rounded-full border border-cyan-400 flex items-center justify-center will-change-transform transition-[width,height,border-color] duration-300 ease-out"
        style={{ width: '40px', height: '40px' }}
      />
      
      {/* Inner Dot */}
      <div 
        ref={innerRef} 
        className="absolute w-2 h-2 bg-cyan-400 rounded-full will-change-transform mix-blend-difference"
      />
    </div>
  );
};

export default CustomCursor;
