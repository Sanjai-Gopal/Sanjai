import React, { useState, useEffect, useRef, memo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { HeroBg } from './BackgroundElements';

const WORDS   = ['Restaurants', 'Salons', 'Real Estate', 'Cafés', 'Local Shops', 'Startups'];
const MARQUEE = ['React', 'Next.js', 'Tailwind CSS', 'Node.js', 'TypeScript', 'SEO Optimization', 'WhatsApp Integration', 'Figma', 'PostgreSQL', 'Framer Motion'];
const MARQUEE_DUPED = [...MARQUEE, ...MARQUEE];

/* ═══════════════════════════════════════════════════
   GRADIENT GLOWING RING
═══════════════════════════════════════════════════ */
const GlowRing = memo(({ size, top, left, right, delay = 0, speed = 28, opacity = 0.07 }: {
  size: number; top?: string; left?: string; right?: string;
  delay?: number; speed?: number; opacity?: number;
}) => (
  <motion.div
    aria-hidden="true"
    style={{
      position: 'absolute',
      width: size,
      height: size,
      top,
      left,
      right,
      borderRadius: '50%',
      border: '1.5px solid transparent',
      backgroundImage: `conic-gradient(from 0deg, transparent 0%, rgba(34,197,94,${opacity}) 20%, rgba(34,197,94,${opacity * 0.4}) 50%, transparent 70%)`,
      backgroundOrigin: 'border-box',
      WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
      WebkitMaskComposite: 'destination-out',
      maskComposite: 'exclude',
      pointerEvents: 'none',
      willChange: 'transform',
    }}
    animate={{ rotate: [0, 360] }}
    transition={{ duration: speed, delay, repeat: Infinity, ease: 'linear' }}
  />
));

/* ═══════════════════════════════════════════════════
   STATIC AMBIENT RING (no conic gradient)
═══════════════════════════════════════════════════ */
const AmbientRing = memo(({ size, top, left, right, delay = 0 }: {
  size: number; top?: string; left?: string; right?: string; delay?: number;
}) => (
  <motion.div
    aria-hidden="true"
    style={{
      position: 'absolute',
      width: size,
      height: size,
      top,
      left,
      right,
      borderRadius: '50%',
      border: '1px solid rgba(34,197,94,0.05)',
      boxShadow: '0 0 18px rgba(34,197,94,0.02), inset 0 0 18px rgba(34,197,94,0.015)',
      pointerEvents: 'none',
    }}
    animate={{ scale: [1, 1.03, 1], opacity: [0.5, 0.8, 0.5] }}
    transition={{ duration: 7, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
));

/* ═══════════════════════════════════════════════════
   PREMIUM FLOATING GLASS PANEL (content visible)
═══════════════════════════════════════════════════ */
const FloatingGlassPanel = memo(({
  children,
  delay = 0,
  floatY = -10,
  rotate = 0,
  style,
}: {
  children?: React.ReactNode;
  delay?: number;
  floatY?: number;
  rotate?: number;
  style?: React.CSSProperties;
}) => (
  <motion.div
    style={{
      position: 'absolute',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.78) 100%)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      border: '1px solid rgba(255,255,255,0.65)',
      borderRadius: 18,
      boxShadow: `
        0 8px 28px rgba(0,0,0,0.06),
        0 2px 8px rgba(0,0,0,0.04),
        inset 0 1px 0 rgba(255,255,255,0.85),
        inset 0 -1px 0 rgba(0,0,0,0.015)
      `,
      overflow: 'hidden',
      ...style,
    }}
    initial={{ opacity: 0, y: 25, rotate: rotate - 6, scale: 0.92 }}
    animate={{
      opacity: 1,
      y: [0, floatY, 0],
      rotate: [rotate, rotate + 1, rotate],
      scale: 1,
    }}
    transition={{
      opacity: { duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] },
      scale:   { duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] },
      y:       { duration: 8, delay: delay + 0.5, repeat: Infinity, ease: 'easeInOut' },
      rotate:  { duration: 10, delay, repeat: Infinity, ease: 'easeInOut' },
    }}
    aria-hidden="true"
  >
    {/* Top gloss */}
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)',
      borderRadius: '18px 18px 0 0',
      pointerEvents: 'none',
    }} />
    {children}
  </motion.div>
));

/* ═══════════════════════════════════════════════════
   3D PERSPECTIVE GRID
═══════════════════════════════════════════════════ */
const PerspGrid = memo(() => (
  <div
    aria-hidden="true"
    style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      height: 240, pointerEvents: 'none', overflow: 'hidden',
      perspective: 400, perspectiveOrigin: '50% 0%',
    }}
  >
    <motion.div
      style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(34,197,94,0.08) 1px, transparent 1px),
          linear-gradient(90deg, rgba(34,197,94,0.08) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
        transform: 'rotateX(55deg) translateY(-20px) scale(1.6)',
        transformOrigin: 'bottom center',
        maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 40%, black 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 40%, black 100%)',
      }}
      animate={{ y: ['-20px', '8px', '-20px'] }}
      transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
    />
    {/* Glow line on horizon */}
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 1,
      background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.3), transparent)',
    }} />
  </div>
));

/* ═══════════════════════════════════════════════════
   FLOATING CUBE (true 3D with faces)
═══════════════════════════════════════════════════ */
const Cube3D = memo(({ top, left, size = 52, delay = 0 }: {
  top: string; left: string; size?: number; delay?: number;
}) => {
  const half = size / 2;
  const faceStyle: React.CSSProperties = {
    position: 'absolute',
    width: size,
    height: size,
    background: 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(34,197,94,0.03) 100%)',
    border: '1px solid rgba(34,197,94,0.2)',
    backdropFilter: 'blur(3px)',
  };
  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'absolute', top, left,
        width: size, height: size,
        transformStyle: 'preserve-3d',
        perspective: 600,
      }}
      animate={{ rotateX: [0, 360], rotateY: [0, 360], y: [0, -20, 8, 0] }}
      transition={{ duration: 22, delay, repeat: Infinity, ease: 'linear' }}
    >
      <div style={{ ...faceStyle, transform: `translateZ(${half}px)` }} />
      <div style={{ ...faceStyle, transform: `rotateY(180deg) translateZ(${half}px)` }} />
      <div style={{ ...faceStyle, transform: `rotateY(90deg) translateZ(${half}px)` }} />
      <div style={{ ...faceStyle, transform: `rotateY(-90deg) translateZ(${half}px)` }} />
      <div style={{ ...faceStyle, transform: `rotateX(90deg) translateZ(${half}px)` }} />
      <div style={{ ...faceStyle, transform: `rotateX(-90deg) translateZ(${half}px)` }} />
    </motion.div>
  );
});

/* ═══════════════════════════════════════════════════
   PREMIUM STAT CARD (3D Floating)
═══════════════════════════════════════════════════ */
const StatCard = memo(({ v, l, index }: { v: string; l: string; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [5, -5]), { stiffness: 200, damping: 22 });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-5, 5]), { stiffness: 200, damping: 22 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <motion.div
      ref={cardRef}
      style={{ rotateX, rotateY, transformPerspective: 700, transformStyle: 'preserve-3d', zIndex: isHovered ? 10 : 1, position: 'relative' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); mouseX.set(0.5); mouseY.set(0.5); }}
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.09 + 0.55, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.03 }}
    >
      {/* Ambient glow */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: -6, borderRadius: 20,
          background: 'radial-gradient(circle, rgba(34,197,94,0.08), transparent 70%)',
          filter: 'blur(14px)',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.35s ease',
          pointerEvents: 'none',
        }}
      />

      <div style={{
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.9) 100%)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.55)',
        borderRadius: 18,
        padding: 'clamp(14px, 2.2vw, 22px) clamp(10px, 1.4vw, 16px)',
        textAlign: 'center',
        boxShadow: `
          0 6px 20px rgba(0,0,0,0.05),
          0 2px 6px rgba(0,0,0,0.03),
          inset 0 1px 0 rgba(255,255,255,0.9),
          inset 0 -1px 0 rgba(0,0,0,0.01)
        `,
        overflow: 'hidden',
      }}>
        {/* Top gloss */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '38%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)',
          borderRadius: '18px 18px 0 0', pointerEvents: 'none',
        }} />
        {/* Light sweep on hover */}
        {isHovered && (
          <motion.div aria-hidden="true" style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
          }}
          initial={{ transform: 'translateX(-100%)' }}
          animate={{ transform: 'translateX(100%)' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          />
        )}
        <div className="display" style={{
          fontWeight: 800, fontSize: 'clamp(17px, 3.5vw, 27px)',
          color: '#111', lineHeight: 1, marginBottom: 5, letterSpacing: '-0.02em',
        }}>
          {v}
        </div>
        <div style={{
          fontSize: 'clamp(9px, 1.4vw, 11px)', color: '#666', fontWeight: 600,
          letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1.3,
        }}>
          {l}
        </div>
      </div>
    </motion.div>
  );
});

/* ═══════════════════════════════════════════════════
   PREMIUM BUTTON COMPONENT
═══════════════════════════════════════════════════ */
const WaIcon = memo(() => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
));

const PremiumButton = memo(({
  children, variant = 'dark', href, onClick,
}: {
  children: React.ReactNode;
  variant?: 'dark' | 'ghost' | 'green';
  href?: string;
  onClick?: () => void;
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springX = useSpring(useTransform(mouseX, [0, 1], [-5, 5]), { stiffness: 150, damping: 16 });
  const springY = useSpring(useTransform(mouseY, [0, 1], [-3, 3]), { stiffness: 150, damping: 16 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const variants: Record<string, { bg: string; color: string; border: string; glow: string; shadow: string }> = {
    dark: {
      bg: 'linear-gradient(135deg, #111 0%, #222 100%)',
      color: '#fff', border: 'rgba(255,255,255,0.1)',
      glow: 'rgba(0,0,0,0.12)',
      shadow: '0 4px 20px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.1)',
    },
    ghost: {
      bg: 'rgba(255,255,255,0.55)',
      color: '#111', border: 'rgba(17,17,17,0.6)',
      glow: 'rgba(17,17,17,0.05)',
      shadow: '0 3px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7)',
    },
    green: {
      bg: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
      color: '#fff', border: 'rgba(34,197,94,0.25)',
      glow: 'rgba(34,197,94,0.2)',
      shadow: '0 4px 20px rgba(34,197,94,0.22), inset 0 1px 0 rgba(255,255,255,0.18)',
    },
  };

  const v = variants[variant];

  const content = (
    <motion.div
      ref={buttonRef}
      style={{
        position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 9,
        padding: '15px 30px', borderRadius: 99, fontSize: 14, fontWeight: 600,
        fontFamily: 'inherit', cursor: 'pointer', textDecoration: 'none',
        background: v.bg, color: v.color, border: `1.5px solid ${v.border}`,
        boxShadow: v.shadow, x: springX, y: springY, overflow: 'hidden',
        backdropFilter: variant === 'ghost' ? 'blur(8px)' : 'none',
        WebkitBackdropFilter: variant === 'ghost' ? 'blur(8px)' : 'none',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); mouseX.set(0.5); mouseY.set(0.5); }}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Outer glow */}
      <motion.div aria-hidden="true" style={{
        position: 'absolute', inset: -4, borderRadius: 'inherit',
        background: `radial-gradient(circle, ${v.glow}, transparent 70%)`,
        filter: 'blur(12px)',
        opacity: isHovered ? 1 : 0,
        pointerEvents: 'none', transition: 'opacity 0.35s ease', zIndex: -1,
      }} />
      {/* Light sweep */}
      <motion.div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
        transform: 'translateX(-100%)',
      }}
      animate={isHovered ? { transform: 'translateX(100%)' } : { transform: 'translateX(-100%)' }}
      transition={{ duration: 0.65, ease: 'easeInOut' }}
      />
      {children}
    </motion.div>
  );

  if (href) {
    return (
      <motion.a href={href} target="_blank" rel="noopener noreferrer"
        style={{ textDecoration: 'none', display: 'inline-flex' }}>
        {content}
      </motion.a>
    );
  }

  return (
    <button onClick={onClick} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit' }}>
      {content}
    </button>
  );
});

/* ═══════════════════════════════════════════════════
   FLOATING DIAMOND
═══════════════════════════════════════════════════ */
const FloatingDiamond = memo(() => (
  <motion.div
    aria-hidden="true"
    style={{ position: 'absolute', top: '28%', right: '6%', width: 32, height: 32 }}
    animate={{ y: [0, -22, 10, 0], rotate: [0, 90, 180, 270, 360] }}
    transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
  >
    <div style={{
      width: 0, height: 0,
      borderLeft: '16px solid transparent', borderRight: '16px solid transparent',
      borderBottom: '28px solid rgba(34,197,94,0.12)',
      filter: 'drop-shadow(0 4px 12px rgba(34,197,94,0.15))',
    }} />
  </motion.div>
));

/* ═══════════════════════════════════════════════════
   MAIN HERO COMPONENT
═══════════════════════════════════════════════════ */
const STATS = [
  { v: '10+',     l: 'Projects Delivered' },
  { v: '100%',    l: 'Client Satisfaction' },
  { v: '7 Days',  l: 'Avg. Delivery' },
  { v: '1 Month', l: 'Free Support' },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export default memo(function Hero({ onDown }: { onDown: () => void }) {
  const [idx, setIdx] = useState(0);
  const [txt, setTxt] = useState('');
  const [del, setDel] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [isWide, setIsWide] = useState(() => window.innerWidth >= 1100);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const fn = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1100px)');
    setIsWide(mq.matches);
    const fn = (e: MediaQueryListEvent) => setIsWide(e.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (reduced) { setTxt(WORDS[0]); return; }
    const w = WORDS[idx];
    if (!del && txt.length < w.length) {
      timerRef.current = setTimeout(() => setTxt(w.slice(0, txt.length + 1)), 80);
    } else if (!del && txt.length === w.length) {
      timerRef.current = setTimeout(() => setDel(true), 2400);
    } else if (del && txt.length > 0) {
      timerRef.current = setTimeout(() => setTxt(w.slice(0, txt.length - 1)), 40);
    } else {
      setDel(false);
      setIdx(i => (i + 1) % WORDS.length);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [txt, del, idx, reduced]);

  return (
    <section
      aria-label="Hero — Web designer and developer for local businesses"
      style={{
        background: '#f2f2ee',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 'clamp(96px, 16vw, 140px)',
        paddingBottom: 'clamp(100px, 14vw, 130px)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Premium 3D Background */}
      <HeroBg />

      {/* Perspective grid at bottom */}
      <PerspGrid />

      {/* Gradient glowing rings */}
      {!reduced && (
        <>
          <GlowRing size={260} top="-50px" left="3%" delay={0} speed={30} opacity={0.08} />
          <AmbientRing size={260} top="-50px" left="3%" delay={0} />
          <GlowRing size={140} top="58%" right="6%" delay={3} speed={22} opacity={0.06} />
          <AmbientRing size={140} top="58%" right="6%" delay={3} />
        </>
      )}

      {/* Floating glass panels — desktop only (>= 1100px) */}
      {!reduced && isWide && (
        <>
          <FloatingGlassPanel delay={0.3} floatY={-12} rotate={-6} style={{ top: '62%', left: '2%', width: 110, zIndex: 1 }}>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: 8, fontWeight: 700, color: '#999', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>Status</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 5px rgba(34,197,94,0.5)', flexShrink: 0 }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#111' }}>Available</span>
              </div>
              <div style={{ fontSize: 9, color: '#777', lineHeight: 1.3 }}>Open for projects</div>
            </div>
          </FloatingGlassPanel>

          <FloatingGlassPanel delay={0.55} floatY={-10} rotate={5} style={{ top: '58%', right: '2%', width: 100, zIndex: 1 }}>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: 8, fontWeight: 700, color: '#999', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>Delivery</div>
              <div className="display" style={{ fontSize: 20, fontWeight: 800, color: '#22c55e', lineHeight: 1 }}>7d</div>
              <div style={{ fontSize: 9, color: '#777', marginTop: 2 }}>Guaranteed</div>
            </div>
          </FloatingGlassPanel>
        </>
      )}

      <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 2, width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE }}
        >
          {/* Availability badge */}
          <motion.div
            role="status"
            aria-label="Currently available for new projects"
            initial={{ opacity: 0, scale: 0.88, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.5, ease: EASE }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 9,
              background: 'linear-gradient(135deg, rgba(220,252,231,0.95) 0%, rgba(187,247,208,0.9) 100%)',
              color: '#15803d', padding: '10px 22px', borderRadius: 99,
              fontSize: 'clamp(12px, 2.5vw, 13px)', fontWeight: 600,
              border: '1px solid rgba(34,197,94,0.25)',
              marginBottom: 'clamp(28px, 5vw, 46px)', whiteSpace: 'nowrap',
              boxShadow: '0 4px 18px rgba(34,197,94,0.15), inset 0 1px 0 rgba(255,255,255,0.6)',
              backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            }}
            whileHover={{ scale: 1.04, y: -2 }}
          >
            <motion.span
              style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', flexShrink: 0, boxShadow: '0 0 8px rgba(34,197,94,0.6)' }}
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.65, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden="true"
            />
            Available for new projects · 7-day delivery guaranteed
          </motion.div>

          {/* Headline */}
          <h1 className="display" style={{ fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.04em', color: '#111', marginBottom: 'clamp(24px, 4vw, 38px)' }}>
            <motion.span
              style={{ display: 'block', fontSize: 'clamp(2rem, 5.5vw, 5rem)' }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.75, ease: EASE }}
            >
              We build websites that
            </motion.span>
            <motion.span
              style={{ display: 'block', position: 'relative', fontSize: 'clamp(2.2rem, 6.5vw, 5.8rem)', marginTop: 5 }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.75, ease: EASE }}
            >
              grow your business
              {/* Animated underline */}
              <motion.span
                aria-hidden="true"
                style={{
                  position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)',
                  width: '65%', height: 6,
                  background: 'linear-gradient(90deg, #22c55e, #4ade80, #22c55e)',
                  backgroundSize: '200% 100%',
                  borderRadius: 99,
                  boxShadow: '0 0 20px rgba(34,197,94,0.4), 0 2px 8px rgba(34,197,94,0.2)',
                  animation: 'gradientShift 3s linear infinite',
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.1, duration: 0.65, ease: EASE }}
              />
            </motion.span>
          </h1>

          {/* Subtitle with typewriter */}
          <motion.p
            style={{ fontSize: 'clamp(14px, 2vw, 18px)', color: '#555', lineHeight: 1.78, maxWidth: 530, margin: '0 auto clamp(32px, 5vw, 50px)', padding: '0 4px' }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.58, duration: 0.55, ease: EASE }}
          >
            Custom websites for{' '}
            <span
              aria-label={`${txt} — and more business types`}
              style={{
                color: '#111', fontWeight: 700,
                borderBottom: '3px solid #22c55e', paddingBottom: 2,
                display: 'inline-block', minWidth: '10ch', textAlign: 'left',
              }}
            >
              {txt}
              {!reduced && (
                <span aria-hidden="true" style={{
                  display: 'inline-block', width: 2, height: '1.1em', background: '#111',
                  verticalAlign: 'middle', marginLeft: 2, animation: 'blink 1s step-end infinite',
                }} />
              )}
            </span>
            {' '}— designed to bring in more customers, calls, and sales.
          </motion.p>

          {/* CTAs */}
          <motion.div
            style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', marginBottom: 'clamp(48px, 7vw, 68px)' }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.72, duration: 0.55, ease: EASE }}
          >
            <PremiumButton href="https://wa.me/919363265552?text=Hi Sanjai, I need a website for my business." variant="dark">
              <WaIcon /> Book a Call
            </PremiumButton>
            <PremiumButton onClick={onDown} variant="ghost">
              View Portfolio <ArrowRight size={17} aria-hidden="true" />
            </PremiumButton>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="hero-stats-grid"
            style={{
              display: 'grid',
              gap: 'clamp(10px, 2vw, 16px)',
              maxWidth: 590,
              margin: '0 auto',
              perspective: 900,
            }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.55 }}
          >
            {STATS.map((s, i) => (
              <StatCard key={i} v={s.v} l={s.l} index={i} />
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Tech marquee */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, overflow: 'hidden',
          borderTop: '1px solid rgba(34,197,94,0.1)', padding: '16px 0',
          background: 'linear-gradient(180deg, transparent, rgba(34,197,94,0.02))',
          zIndex: 3,
        }}
      >
        <div className="marquee" style={{ display: 'flex', gap: 56, width: 'max-content' }}>
          {MARQUEE_DUPED.map((t, i) => (
            <span key={i} style={{
              fontSize: 11, fontWeight: 700, color: '#6b6b6b',
              whiteSpace: 'nowrap', letterSpacing: '0.12em', textTransform: 'uppercase', flexShrink: 0,
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
});
