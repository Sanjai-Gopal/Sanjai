import { useCallback, useEffect, useRef, useState } from 'react';
import { useMotionValue, useSpring, useTransform } from 'motion/react';

/* ═══════════════════════════════════════════════════
   Mouse Position Hook - Tracks mouse for parallax/tilt
═══════════════════════════════════════════════════ */

export function useMousePosition() {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return { mouseX, mouseY };
}

/* ═══════════════════════════════════════════════════
   3D Tilt Hook - Premium card rotation effect
═══════════════════════════════════════════════════ */

export function use3DTilt(strength: number = 15, perspective: number = 1000) {
  const ref = useRef<HTMLElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);
    rotateX.set(-y * strength);
    rotateY.set(x * strength);
  }, [strength, rotateX, rotateY]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return {
    ref,
    style: {
      rotateX: springRotateX,
      rotateY: springRotateY,
      transformPerspective: perspective,
    },
    handlers: { onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave },
  };
}

/* ═══════════════════════════════════════════════════
   Magnetic Button Hook - Premium magnetic hover
═══════════════════════════════════════════════════ */

export function useMagnetic(strength: number = 0.3) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  }, [strength, x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return {
    ref,
    style: { x: springX, y: springY },
    handlers: { onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave },
  };
}

/* ═══════════════════════════════════════════════════
   Scroll Progress Hook - 3D scroll effects
═══════════════════════════════════════════════════ */

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId: number;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const current = window.scrollY;
        setProgress(total > 0 ? current / total : 0);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return progress;
}

/* ═══════════════════════════════════════════════════
   In View Hook - Optimized intersection observer
═══════════════════════════════════════════════════ */

export function useInView(threshold: number = 0.2, margin: string = '-50px') {
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold, rootMargin: margin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, margin]);

  return { ref, isInView };
}

/* ═══════════════════════════════════════════════════
   Reduced Motion Hook
═══════════════════════════════════════════════════ */

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);

    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}

/* ═══════════════════════════════════════════════════
   Glitch Text Hook
═══════════════════════════════════════════════════ */

export function useGlitchChar(text: string, interval: number = 50) {
  const [displayText, setDisplayText] = useState(text);
  const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/';

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (Math.random() > 0.95) {
        const pos = Math.floor(Math.random() * text.length);
        const char = glitchChars[Math.floor(Math.random() * glitchChars.length)];
        setDisplayText(text.slice(0, pos) + char + text.slice(pos + 1));
        setTimeout(() => setDisplayText(text), 100);
      }
    }, interval);

    return () => clearInterval(intervalId);
  }, [text, interval, glitchChars]);

  return displayText;
}

/* ═══════════════════════════════════════════════════
   Parallax Transform Hook
═══════════════════════════════════════════════════ */

export function useParallax(strength: number = 50) {
  const { mouseY } = useMousePosition();
  const y = useTransform(mouseY, [0, 1], [-strength, strength]);
  return useSpring(y, { stiffness: 50, damping: 20 });
}
