
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

interface InteractiveRobotProps {
  className?: string;
  onClick?: () => void;
}

const InteractiveRobot: React.FC<InteractiveRobotProps> = ({ className, onClick }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  
  // Logic State
  const mouseRef = useRef({ x: 0, y: 0 });
  const robotGroupRef = useRef<THREE.Group | null>(null);
  const eyesGroupRef = useRef<THREE.Group | null>(null);
  const ringsRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- 1. SETUP ---
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.appendChild(renderer.domElement);

    // --- 2. MATERIALS ---
    const obsidianMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f111a,
      metalness: 0.8,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 1.0,
      iridescence: 0.3,
      iridescenceIOR: 1.3
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e1b4b,
      metalness: 0.1,
      roughness: 0.0,
      transmission: 0.6,
      thickness: 1.5,
      transparent: true,
      opacity: 0.3,
    });

    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x00f5ff });
    const eyeCoreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const accentMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x4c1d95,
      emissiveIntensity: 0.2
    });

    // --- 3. BUILD ---
    const robotGroup = new THREE.Group();
    scene.add(robotGroup);
    robotGroupRef.current = robotGroup;

    // Core & Shell
    robotGroup.add(new THREE.Mesh(new THREE.IcosahedronGeometry(1.5, 10), obsidianMat));
    robotGroup.add(new THREE.Mesh(new THREE.IcosahedronGeometry(1.6, 10), glassMat));

    // Eyes
    const eyesGroup = new THREE.Group();
    robotGroup.add(eyesGroup);
    eyesGroupRef.current = eyesGroup;

    const createEye = (x: number) => {
        const eyeWrapper = new THREE.Group();
        eyeWrapper.position.set(x, 0.1, 1.45);
        
        eyeWrapper.add(new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.02, 16, 32), accentMat));
        
        const iris = new THREE.Mesh(new THREE.CircleGeometry(0.28, 32), eyeMat);
        iris.position.z = 0.01;
        eyeWrapper.add(iris);

        const pupil = new THREE.Mesh(new THREE.CircleGeometry(0.12, 32), eyeCoreMat);
        pupil.position.z = 0.02;
        eyeWrapper.add(pupil);

        return eyeWrapper;
    };

    const leftEye = createEye(-0.6);
    const rightEye = createEye(0.6);
    leftEye.rotation.z = 0.1;
    rightEye.rotation.z = -0.1;
    eyesGroup.add(leftEye);
    eyesGroup.add(rightEye);

    // Rings
    const ringsGroup = new THREE.Group();
    robotGroup.add(ringsGroup);
    ringsRef.current = ringsGroup;

    const r1 = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.03, 16, 100), accentMat);
    r1.rotation.x = Math.PI / 2;
    ringsGroup.add(r1);

    const r2 = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.01, 16, 100), new THREE.MeshBasicMaterial({ color: 0x00f5ff, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending }));
    r2.rotation.y = Math.PI / 4;
    ringsGroup.add(r2);

    // --- 4. LIGHTING ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    
    const keyLight = new THREE.DirectionalLight(0xdbeafe, 2);
    keyLight.position.set(5, 5, 10);
    scene.add(keyLight);

    const rimLightLeft = new THREE.SpotLight(0x00f5ff, 5);
    rimLightLeft.position.set(-10, 5, -5);
    rimLightLeft.lookAt(0, 0, 0);
    scene.add(rimLightLeft);
    
    const rimLightRight = new THREE.SpotLight(0xd946ef, 5);
    rimLightRight.position.set(10, 5, -5);
    rimLightRight.lookAt(0, 0, 0);
    scene.add(rimLightRight);

    scene.add(new THREE.PointLight(0x7c3aed, 1)); // Bottom fill

    // --- 5. ANIMATION ---
    const onMouseMove = (e: MouseEvent) => {
        // Global mouse tracking - calculate relative to center of screen for look-at
        // This ensures tracking works even if the canvas is small
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -(e.clientY / window.innerHeight) * 2 + 1;
        mouseRef.current = { x, y };
    };

    const clock = new THREE.Clock();
    let frameId = 0;

    const animate = () => {
        const time = clock.getElapsedTime();

        if (eyesGroup) {
            const targetX = mouseRef.current.x * 1.5; 
            const targetY = mouseRef.current.y * 1.5;
            eyesGroup.rotation.y += (targetX - eyesGroup.rotation.y) * 0.2;
            eyesGroup.rotation.x += (-targetY - eyesGroup.rotation.x) * 0.2;
        }

        if (robotGroup) {
            const targetBodyX = mouseRef.current.x * 0.5;
            const targetBodyY = mouseRef.current.y * 0.5;
            robotGroup.rotation.y += (targetBodyX - robotGroup.rotation.y) * 0.05;
            robotGroup.rotation.x += (-targetBodyY - robotGroup.rotation.x) * 0.05;
            robotGroup.position.y = Math.sin(time) * 0.15;
        }

        if (ringsRef.current) {
            const speed = Math.abs(mouseRef.current.x) + Math.abs(mouseRef.current.y);
            ringsRef.current.rotation.x += 0.005 + (speed * 0.02);
            ringsRef.current.rotation.y += 0.01 + (speed * 0.02);
            ringsRef.current.children[1].rotation.x -= 0.02;
        }

        renderer.render(scene, camera);
        frameId = requestAnimationFrame(animate);
    };

    animate();

    const handleClick = () => {
        gsap.fromTo(eyeMat.color, { r: 1, g: 1, b: 1 }, { r: 0, g: 0.96, b: 1, duration: 0.5 });
        gsap.to(robotGroup.scale, { x: 1.1, y: 1.1, z: 1.1, duration: 0.1, yoyo: true, repeat: 1 });
        if(ringsRef.current) {
            gsap.to(ringsRef.current.rotation, { z: ringsRef.current.rotation.z + Math.PI, duration: 1, ease: "back.out(1.7)" });
        }
        if (onClick) onClick();
    };

    window.addEventListener('mousemove', onMouseMove);
    const canvas = renderer.domElement;
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('mouseenter', () => setIsHovering(true));
    canvas.addEventListener('mouseleave', () => setIsHovering(false));

    // Responsive Handling
    const resizeObserver = new ResizeObserver(() => {
         if (!mountRef.current) return;
         const w = mountRef.current.clientWidth;
         const h = mountRef.current.clientHeight;
         camera.aspect = w / h;
         camera.updateProjectionMatrix();
         renderer.setSize(w, h);
    });
    resizeObserver.observe(mountRef.current);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('click', handleClick);
      resizeObserver.disconnect();
      cancelAnimationFrame(frameId);
      renderer.dispose();
      obsidianMat.dispose(); glassMat.dispose(); eyeMat.dispose(); accentMat.dispose();
    };
  }, [onClick]);

  return (
    <div className={`relative group ${className}`}>
        <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-pointer z-10" />
        
        {/* Themed Glow Backdrop */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-indigo-600/10 rounded-full blur-[60px] pointer-events-none -z-10 transition-all duration-700 ${isHovering ? 'scale-125 bg-indigo-500/20' : 'scale-100'}`} />
    </div>
  );
};

export default InteractiveRobot;
