/**
 * BackgroundElements — Premium 3D Animation System
 * Awwwards-level immersive 3D effects with original light theme
 * GPU-accelerated, zero layout shift, fully accessible
 */
import React, { useEffect, useRef, useState, memo } from 'react';
import { motion, useTransform, useMotionValue, useSpring } from 'motion/react';

/* ═══════════════════════════════════════════════════
   SHARED HOOKS & UTILITIES
═══════════════════════════════════════════════════ */

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const fn = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  return reduced;
}

function useMouse() {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      x.set(e.clientX / window.innerWidth);
      y.set(e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', fn, { passive: true });
    return () => window.removeEventListener('mousemove', fn);
  }, [x, y]);
  return { x, y };
}

/* ═══════════════════════════════════════════════════
   SHARED PRIMITIVES FOR 3D EFFECTS
═══════════════════════════════════════════════════ */

const FloatingOrb = memo(({
  size, top, left, color, delay = 0, dur = 12, opacity = 1,
}: {
  size: number; top: string; left: string; color: string;
  delay?: number; dur?: number; opacity?: number;
}) => (
  <motion.div
    aria-hidden="true"
    style={{
      position: 'absolute', width: size, height: size,
      top, left, borderRadius: '50%',
      background: color, opacity,
      willChange: 'transform',
      pointerEvents: 'none',
    }}
    animate={{ y: [0, -16, 8, -12, 0], x: [0, 10, -6, 4, 0], scale: [1, 1.02, 0.98, 1.01, 1] }}
    transition={{ duration: dur, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
));

const Ring3D = memo(({
  size, top, left, color = 'rgba(34,197,94,0.15)', delay = 0, dur = 14,
}: {
  size: number; top: string; left: string; color?: string; delay?: number; dur?: number;
}) => (
  <motion.div
    aria-hidden="true"
    style={{
      position: 'absolute', width: size, height: size, top, left,
      border: `1.5px solid ${color}`, borderRadius: '50%',
      willChange: 'transform', pointerEvents: 'none',
    }}
    animate={{ rotate: [0, 360], scale: [1, 1.08, 1] }}
    transition={{ duration: dur, delay, repeat: Infinity, ease: 'linear' }}
  />
));

const Blob3D = memo(({
  top, left, size = 400, color, delay = 0, opacity = 0.07,
}: {
  top: string; left: string; size?: number; color: string; delay?: number; opacity?: number;
}) => (
  <motion.svg
    aria-hidden="true"
    viewBox="0 0 200 200"
    style={{
      position: 'absolute', top, left, width: size, height: size,
      opacity, pointerEvents: 'none', willChange: 'transform',
    }}
    animate={{ rotate: [0, 360] }}
    transition={{ duration: 30, delay, repeat: Infinity, ease: 'linear' }}
  >
    <motion.path
      fill={color}
      animate={{
        d: [
          'M40,-62C52,-54,62,-42,68,-28C74,-14,76,2,72,17C68,32,58,46,44,57C30,68,12,75,-6,74C-24,73,-42,64,-56,50C-70,36,-80,18,-78,1C-76,-16,-62,-32,-48,-45C-34,-58,-20,-68,-4,-70C12,-72,28,-70,40,-62Z',
          'M42,-58C54,-48,62,-32,66,-16C70,0,70,16,64,30C58,44,46,56,31,64C16,72,-2,76,-20,72C-38,68,-56,56,-66,40C-76,24,-78,4,-74,-14C-70,-32,-60,-48,-46,-58C-32,-68,-14,-72,2,-72C18,-72,30,-68,42,-58Z',
          'M38,-56C50,-46,60,-32,66,-16C72,0,74,18,68,34C62,50,48,64,32,70C16,76,-2,74,-18,68C-34,62,-48,52,-60,38C-72,24,-82,6,-78,-10C-74,-26,-56,-40,-40,-50C-24,-60,-10,-66,4,-66C18,-66,26,-66,38,-56Z',
          'M40,-62C52,-54,62,-42,68,-28C74,-14,76,2,72,17C68,32,58,46,44,57C30,68,12,75,-6,74C-24,73,-42,64,-56,50C-70,36,-80,18,-78,1C-76,-16,-62,-32,-48,-45C-34,-58,-20,-68,-4,-70C12,-72,28,-70,40,-62Z',
        ],
      }}
      transition={{ duration: 20, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  </motion.svg>
));

const Noise = memo(({ opacity = 0.03 }: { opacity?: number }) => (
  <svg
    aria-hidden="true"
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <filter id="noise-filter">
      <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise-filter)" />
  </svg>
));

const Grid = memo(({ color = 'rgba(34,197,94,0.06)', size = 60 }: { color?: string; size?: number }) => (
  <svg
    aria-hidden="true"
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id={`grid-${size}`} width={size} height={size} patternUnits="userSpaceOnUse">
        <path d={`M ${size} 0 L 0 0 0 ${size}`} fill="none" stroke={color} strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill={`url(#grid-${size})`} />
  </svg>
));

const DotMatrix = memo(({ color = 'rgba(0,0,0,0.05)', gap = 36, r = 1 }: {
  color?: string; gap?: number; r?: number;
}) => (
  <svg
    aria-hidden="true"
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id={`dots-${gap}`} width={gap} height={gap} patternUnits="userSpaceOnUse">
        <circle cx={gap / 2} cy={gap / 2} r={r} fill={color} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill={`url(#dots-${gap})`} />
  </svg>
));

const Wave3D = memo(({
  color = 'rgba(34,197,94,0.06)', bottom = '0', flip = false,
}: {
  color?: string; bottom?: string; flip?: boolean;
}) => (
  <div
    aria-hidden="true"
    style={{
      position: 'absolute', bottom, left: 0, right: 0,
      transform: flip ? 'scaleY(-1)' : undefined,
      pointerEvents: 'none',
    }}
  >
    <motion.svg
      viewBox="0 0 1440 80"
      style={{ width: '100%', display: 'block' }}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <motion.path
        fill={color}
        animate={{
          d: [
            'M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z',
            'M0,20 C360,60 720,0 1080,40 C1260,60 1380,20 1440,30 L1440,80 L0,80 Z',
            'M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z',
          ],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.svg>
  </div>
));

const Particles3D = memo(({ count = 10, color = 'rgba(34,197,94,0.3)' }: {
  count?: number; color?: string;
}) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: `${(i * 47 + 13) % 97}%`,
    y: `${(i * 31 + 7) % 93}%`,
    r: 1 + (i % 3) * 0.5,
    dur: 8 + (i % 7) * 2,
    delay: (i * 0.5) % 10,
  }));
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute', left: p.x, top: p.y,
            width: p.r * 2, height: p.r * 2, borderRadius: '50%',
            background: color, willChange: 'transform',
          }}
          animate={{ y: [-8, 8, -8], opacity: [0.25, 0.6, 0.25] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
});

const GlowBeam = memo(({
  top, left, width = 400, angle = 35, color, opacity = 0.06,
}: {
  top: string; left: string; width?: number; angle?: number; color: string; opacity?: number;
}) => (
  <div
    aria-hidden="true"
    style={{
      position: 'absolute', top, left,
      width, height: 2,
      background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
      transform: `rotate(${angle}deg)`,
      transformOrigin: 'center',
      opacity, filter: 'blur(1px)',
      pointerEvents: 'none',
    }}
  />
));

// Spotlight removed — was visually heavy with mouse-tracking glow

const ScanLine = memo(({
  top, color = 'rgba(34,197,94,0.6)', opacity = 0.06,
}: {
  top: string; color?: string; opacity?: number;
}) => (
  <div
    aria-hidden="true"
    style={{
      position: 'absolute', top, left: 0, right: 0, height: 1,
      background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
      opacity, pointerEvents: 'none',
    }}
  />
));

/* ═══════════════════════════════════════════════════
   SECTION BACKGROUNDS
═══════════════════════════════════════════════════ */

export const HeroBg = memo(() => {
  const reduced = useReducedMotion();
  const { x: mx, y: my } = useMouse();
  const ox = useTransform(mx, [0, 1], [-20, 20]);
  const oy = useTransform(my, [0, 1], [-12, 12]);
  const sox = useSpring(ox, { stiffness: 40, damping: 25 });
  const soy = useSpring(oy, { stiffness: 40, damping: 25 });
  const orb1x = useTransform(mx, [0,1], [-10,10]);
  const orb1y = useTransform(my, [0,1], [-6,6]);
  const orb2x = useTransform(mx, [0,1], [6,-12]);
  const orb2y = useTransform(my, [0,1], [5,-8]);

  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, #f2f2ee 0%, #fafaf8 40%, #f5f5f0 100%)',
      }} />

      <motion.div
        style={{
          position: 'absolute', inset: '-50%', translateX: reduced ? 0 : sox, translateY: reduced ? 0 : soy,
          background: 'radial-gradient(ellipse 80% 50% at 30% 40%, rgba(34,197,94,0.06) 0%, transparent 60%)',
          willChange: 'transform',
        }}
      />

      {!reduced && (
        <motion.div
          style={{ position: 'absolute', inset: '-20%' }}
          animate={{ rotate: [0, 2, -1, 0], scale: [1, 1.02, 0.99, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 60% 40% at 70% 60%, rgba(34,197,94,0.04) 0%, transparent 55%)',
          }} />
        </motion.div>
      )}

      <div style={{
        position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
        width: '140%', height: '60%',
        background: 'radial-gradient(ellipse 80% 100% at 50% 0%, rgba(34,197,94,0.04) 0%, transparent 70%)',
      }} />

      <Grid color="rgba(34,197,94,0.03)" size={80} />
      <DotMatrix color="rgba(0,0,0,0.04)" gap={48} r={0.8} />

      {!reduced && (
        <>
          <motion.div style={{ position: 'absolute', inset: 0, translateX: orb1x, translateY: orb1y }}>
            <FloatingOrb size={450} top="-180px" left="-80px"
              color="radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)"
              dur={18} delay={0} />
          </motion.div>
          <motion.div style={{ position: 'absolute', inset: 0, translateX: orb2x, translateY: orb2y }}>
            <FloatingOrb size={350} top="-80px" left="55%"
              color="radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)"
              dur={14} delay={3} />
          </motion.div>
          <FloatingOrb size={260} top="55%" left="75%"
            color="radial-gradient(circle, rgba(34,197,94,0.04) 0%, transparent 70%)"
            dur={16} delay={6} />
        </>
      )}

      {!reduced && (
        <>
          <Ring3D size={140} top="8%" left="5%" color="rgba(34,197,94,0.06)" dur={25} delay={0} />
          <Ring3D size={80} top="15%" left="88%" color="rgba(34,197,94,0.05)" dur={20} delay={4} />
        </>
      )}

      <ScanLine top="38%" color="rgba(34,197,94,0.6)" opacity={0.03} />
      <ScanLine top="72%" color="rgba(34,197,94,0.6)" opacity={0.02} />

      <GlowBeam top="30%" left="-200px" width={600} angle={-8} color="rgba(34,197,94,0.5)" opacity={0.04} />
      <GlowBeam top="60%" left="30%" width={400} angle={12} color="rgba(34,197,94,0.5)" opacity={0.03} />

      <Noise opacity={0.02} />

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 85% 80% at 50% 50%, transparent 50%, rgba(0,0,0,0.05) 100%)',
      }} />

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 100,
        background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.03))',
      }} />
    </div>
  );
});

export const AboutBg = memo(() => {
  const reduced = useReducedMotion();
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(160deg, #f2f2ee 0%, #fafaf8 50%, #f0f0ec 100%)',
      }} />

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 55% 70% at -5% 50%, rgba(34,197,94,0.05) 0%, transparent 60%)',
      }} />

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 50% 60% at 105% 50%, rgba(34,197,94,0.04) 0%, transparent 55%)',
      }} />

      <Grid color="rgba(34,197,94,0.02)" size={70} />
      <DotMatrix color="rgba(0,0,0,0.03)" gap={40} r={0.6} />

      {!reduced && (
        <>
          <motion.div
            style={{
              position: 'absolute', top: '10%', right: '-5%',
              width: 240, height: 160, borderRadius: 20,
              background: 'rgba(34,197,94,0.025)',
              border: '1px solid rgba(34,197,94,0.06)',
              backdropFilter: 'blur(6px)',
              willChange: 'transform',
            }}
            animate={{ y: [0, -12, 6, -8, 0], rotate: [-3, -1.5, -4, -2, -3] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            style={{
              position: 'absolute', top: '55%', right: '5%',
              width: 100, height: 100, borderRadius: '50%',
              background: 'rgba(34,197,94,0.02)',
              border: '1px solid rgba(34,197,94,0.05)',
              backdropFilter: 'blur(3px)',
              willChange: 'transform',
            }}
            animate={{ y: [0, -10, 6, 0], scale: [1, 1.03, 0.98, 1] }}
            transition={{ duration: 11, delay: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      {!reduced && (
        <>
          <FloatingOrb size={450} top="-120px" left="55%"
            color="radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)"
            dur={20} delay={0} />
          <FloatingOrb size={300} top="50%" left="-80px"
            color="radial-gradient(circle, rgba(34,197,94,0.04) 0%, transparent 70%)"
            dur={15} delay={4} />
        </>
      )}

      {!reduced && (
        <>
          <Ring3D size={200} top="-50px" left="65%" color="rgba(34,197,94,0.04)" dur={30} />
        </>
      )}

      <ScanLine top="55%" color="rgba(34,197,94,0.6)" opacity={0.02} />
      <Noise opacity={0.015} />

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.04) 100%)',
      }} />
    </div>
  );
});

export const ServicesBg = memo(() => {
  const reduced = useReducedMotion();
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(170deg, #f2f2ee 0%, #fafaf8 60%, #f5f5f0 100%)',
      }} />

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(34,197,94,0.04) 0%, transparent 65%)',
      }} />

      {!reduced && (
        <motion.div
          style={{ position: 'absolute', inset: 0 }}
          animate={{ opacity: [0.7, 1, 0.8, 1, 0.7] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 60% 40% at 10% 20%, rgba(34,197,94,0.04) 0%, transparent 55%)',
          }} />
        </motion.div>
      )}

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 55% 45% at 95% 90%, rgba(34,197,94,0.035) 0%, transparent 55%)',
      }} />

      <Grid color="rgba(34,197,94,0.025)" size={64} />
      <DotMatrix color="rgba(0,0,0,0.03)" gap={32} r={0.6} />

      {!reduced && (
        <>
          <FloatingOrb size={500} top="-150px" left="30%"
            color="radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)"
            dur={22} delay={0} />
          <FloatingOrb size={300} top="60%" left="70%"
            color="radial-gradient(circle, rgba(34,197,94,0.04) 0%, transparent 70%)"
            dur={16} delay={5} />
        </>
      )}

      {!reduced && (
        <>
          <Ring3D size={160} top="-40px" left="-40px" color="rgba(34,197,94,0.05)" dur={28} />
        </>
      )}

      <GlowBeam top="20%" left="-10%" width={600} angle={6} color="rgba(34,197,94,0.5)" opacity={0.035} />
      <GlowBeam top="70%" left="20%" width={450} angle={-4} color="rgba(34,197,94,0.5)" opacity={0.025} />

      {!reduced && <Particles3D count={8} color="rgba(34,197,94,0.25)" />}

      <Noise opacity={0.015} />

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 95% 90% at 50% 50%, transparent 50%, rgba(0,0,0,0.03) 100%)',
      }} />
    </div>
  );
});

export const ResultsBg = memo(() => {
  const reduced = useReducedMotion();
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #f2f2ee 0%, #f5f8f5 50%, #f2f2ee 100%)',
      }} />

      <Grid color="rgba(34,197,94,0.03)" size={44} />

      {!reduced && (
        <FloatingOrb size={650} top="-150px" left="50%"
          color="radial-gradient(circle, rgba(34,197,94,0.04) 0%, transparent 65%)"
          dur={22} opacity={1} />
      )}

      <GlowBeam top="50%" left="0%" width={900} angle={0} color="rgba(34,197,94,0.4)" opacity={0.025} />

      {!reduced && <Particles3D count={8} color="rgba(34,197,94,0.2)" />}

      <Noise opacity={0.015} />
    </div>
  );
});

export const ProjectsBg = memo(() => {
  const reduced = useReducedMotion();
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(145deg, #f2f2ee 0%, #fafaf8 55%, #f5f5f0 100%)',
      }} />

      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(45deg, rgba(34,197,94,0.03) 0%, transparent 40%, rgba(34,197,94,0.02) 100%)',
      }} />

      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
        background: 'radial-gradient(ellipse 90% 100% at 50% 0%, rgba(34,197,94,0.04) 0%, transparent 65%)',
      }} />

      <Grid color="rgba(34,197,94,0.02)" size={72} />
      <DotMatrix color="rgba(0,0,0,0.035)" gap={36} r={0.6} />

      {!reduced && (
        <>
          <FloatingOrb size={550} top="-250px" left="20%"
            color="radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)"
            dur={26} delay={0} />
          <FloatingOrb size={350} top="50%" left="65%"
            color="radial-gradient(circle, rgba(34,197,94,0.04) 0%, transparent 70%)"
            dur={18} delay={5} />
        </>
      )}

      {!reduced && (
        <>
          <Ring3D size={220} top="-50px" left="80%" color="rgba(34,197,94,0.04)" dur={32} />
        </>
      )}

      {!reduced && <Wave3D color="rgba(34,197,94,0.025)" bottom="0" />}

      <Noise opacity={0.015} />

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 85% 80% at 50% 50%, transparent 50%, rgba(0,0,0,0.035) 100%)',
      }} />
    </div>
  );
});

export const WhyMeBg = memo(() => {
  const reduced = useReducedMotion();
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(155deg, #f2f2ee 0%, #fafaf8 50%, #f5f5f0 100%)',
      }} />

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 50% 80% at -5% 50%, rgba(34,197,94,0.05) 0%, transparent 58%)',
      }} />

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 45% 60% at 108% 50%, rgba(34,197,94,0.035) 0%, transparent 55%)',
      }} />

      <Grid color="rgba(34,197,94,0.02)" size={65} />
      <DotMatrix color="rgba(0,0,0,0.03)" gap={44} r={0.7} />

      {!reduced && (
        <>
          <FloatingOrb size={500} top="10%" left="-150px"
            color="radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)"
            dur={20} delay={0} />
          <FloatingOrb size={300} top="50%" left="60%"
            color="radial-gradient(circle, rgba(34,197,94,0.04) 0%, transparent 70%)"
            dur={15} delay={4} />
        </>
      )}

      {!reduced && (
        <>
          <Ring3D size={180} top="-35px" left="48%" color="rgba(34,197,94,0.04)" dur={28} />
        </>
      )}

      {!reduced && <Particles3D count={6} color="rgba(34,197,94,0.2)" />}

      <ScanLine top="45%" color="rgba(34,197,94,0.6)" opacity={0.025} />

      <Noise opacity={0.015} />

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 85% 80% at 50% 50%, transparent 48%, rgba(0,0,0,0.03) 100%)',
      }} />
    </div>
  );
});

export const TestimonialsBg = memo(() => {
  const reduced = useReducedMotion();
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(170deg, #f5f5f0 0%, #fafaf8 50%, #f2f2ee 100%)',
      }} />

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 75% 60% at 50% 50%, rgba(34,197,94,0.04) 0%, transparent 60%)',
      }} />

      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '45%',
        background: 'radial-gradient(ellipse 80% 100% at 50% 0%, rgba(34,197,94,0.035) 0%, transparent 65%)',
      }} />

      <Grid color="rgba(34,197,94,0.02)" size={60} />
      <DotMatrix color="rgba(0,0,0,0.03)" gap={40} r={0.6} />

      {!reduced && (
        <>
          <motion.div
            style={{
              position: 'absolute', top: '5%', left: '2%',
              width: 80, height: 80, borderRadius: '50%',
              border: '1px solid rgba(34,197,94,0.06)',
              background: 'rgba(34,197,94,0.02)',
              willChange: 'transform',
            }}
            animate={{ y: [0, -12, 6, 0], rotate: [0, 5, -3, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            style={{
              position: 'absolute', bottom: '12%', right: '4%',
              width: 60, height: 60, borderRadius: 12,
              border: '1px solid rgba(34,197,94,0.05)',
              background: 'rgba(34,197,94,0.015)',
              transform: 'rotate(30deg)',
              willChange: 'transform',
            }}
            animate={{ y: [0, 10, -6, 0], rotate: [30, 36, 24, 30] }}
            transition={{ duration: 14, delay: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      {!reduced && (
        <>
          <FloatingOrb size={450} top="-120px" left="30%"
            color="radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)"
            dur={22} delay={0} />
          <FloatingOrb size={300} top="55%" left="70%"
            color="radial-gradient(circle, rgba(34,197,94,0.04) 0%, transparent 70%)"
            dur={16} delay={6} />
        </>
      )}

      {!reduced && (
        <>
          <Ring3D size={200} top="-50px" left="15%" color="rgba(34,197,94,0.04)" dur={30} />
        </>
      )}

      {!reduced && <Particles3D count={8} color="rgba(34,197,94,0.2)" />}

      <Noise opacity={0.015} />

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 90% 85% at 50% 50%, transparent 52%, rgba(0,0,0,0.03) 100%)',
      }} />
    </div>
  );
});

export const CTABg = memo(() => {
  const reduced = useReducedMotion();
  const { x: mx, y: my } = useMouse();
  const ox = useTransform(mx, [0, 1], [-12, 12]);
  const oy = useTransform(my, [0, 1], [-8, 8]);
  const sox = useSpring(ox, { stiffness: 40, damping: 25 });
  const soy = useSpring(oy, { stiffness: 40, damping: 25 });
  const ctaOrbX = useTransform(mx, [0,1], [-15, 15]);
  const ctaOrbY = useTransform(my, [0,1], [-8, 8]);

  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(160deg, #f2f2ee 0%, #fafaf8 50%, #f5f5f0 100%)',
      }} />

      {!reduced && (
        <motion.div
          style={{
            position: 'absolute', inset: '-30%',
            translateX: sox, translateY: soy,
            willChange: 'transform',
          }}
        >
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(34,197,94,0.06) 0%, transparent 60%)',
          }} />
        </motion.div>
      )}

      <div style={{
        position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
        width: '120%', height: '70%',
        background: 'radial-gradient(ellipse 80% 100% at 50% 0%, rgba(34,197,94,0.05) 0%, transparent 65%)',
      }} />

      <Grid color="rgba(34,197,94,0.025)" size={60} />

      {!reduced && (
        <motion.div
          style={{
            position: 'absolute', inset: 0,
            translateX: ctaOrbX,
            translateY: ctaOrbY,
          }}
        >
          <FloatingOrb size={500} top="-180px" left="50%"
            color="radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 68%)"
            dur={20} delay={0} />
        </motion.div>
      )}

      {!reduced && (
        <>
          <FloatingOrb size={300} top="40%" left="-60px"
            color="radial-gradient(circle, rgba(34,197,94,0.04) 0%, transparent 70%)"
            dur={15} delay={3} />
          <FloatingOrb size={300} top="40%" left="75%"
            color="radial-gradient(circle, rgba(34,197,94,0.04) 0%, transparent 70%)"
            dur={17} delay={6} />
        </>
      )}

      {!reduced && (
        <>
          <Ring3D size={240} top="-80px" left="50%" color="rgba(34,197,94,0.05)" dur={40} />
          <Ring3D size={350} top="-140px" left="50%" color="rgba(34,197,94,0.025)" dur={55} delay={5} />
        </>
      )}

      {!reduced && <Particles3D count={10} color="rgba(34,197,94,0.25)" />}

      <Noise opacity={0.015} />

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 75% 65% at 50% 50%, transparent 40%, rgba(0,0,0,0.04) 100%)',
      }} />
    </div>
  );
});

export const ContactBg = memo(() => {
  const reduced = useReducedMotion();
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(150deg, #f2f2ee 0%, #fafaf8 45%, #f5f5f0 100%)',
      }} />

      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
        background: 'radial-gradient(ellipse 80% 100% at 50% 0%, rgba(34,197,94,0.04) 0%, transparent 65%)',
      }} />

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
        background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(34,197,94,0.035) 0%, transparent 65%)',
      }} />

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 40% 50% at 0% 50%, rgba(34,197,94,0.03) 0%, transparent 55%)',
      }} />

      <Grid color="rgba(34,197,94,0.02)" size={62} />
      <DotMatrix color="rgba(0,0,0,0.03)" gap={38} r={0.6} />

      {!reduced && (
        <>
          <FloatingOrb size={500} top="-150px" left="30%"
            color="radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)"
            dur={22} delay={0} />
          <FloatingOrb size={350} top="50%" left="65%"
            color="radial-gradient(circle, rgba(34,197,94,0.04) 0%, transparent 70%)"
            dur={18} delay={5} />
        </>
      )}

      {!reduced && (
        <>
          <Ring3D size={200} top="-55px" left="70%" color="rgba(34,197,94,0.04)" dur={32} />
        </>
      )}

      {!reduced && <Particles3D count={10} color="rgba(34,197,94,0.25)" />}

      {!reduced && <Wave3D color="rgba(34,197,94,0.025)" bottom="auto" />}

      <Noise opacity={0.015} />

      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 85% 80% at 50% 50%, transparent 50%, rgba(0,0,0,0.03) 100%)',
      }} />
    </div>
  );
});

export default function BackgroundElements() { return null; }
