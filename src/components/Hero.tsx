import React, { useState, useEffect, useRef, memo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { HeroBg } from './BackgroundElements';

const WORDS   = ['Restaurants', 'Salons', 'Real Estate', 'Cafés', 'Local Shops', 'Startups'];
const MARQUEE = ['React', 'Next.js', 'Tailwind CSS', 'Node.js', 'TypeScript', 'SEO Optimization', 'WhatsApp Integration', 'Figma', 'PostgreSQL', 'Framer Motion'];
const MARQUEE_DUPED = [...MARQUEE, ...MARQUEE];

/* ═══════════════════════════════════════════════════
   PREMIUM FLOATING GLASS PANEL
═══════════════════════════════════════════════════ */
const FloatingGlassPanel = memo(({
  children,
  delay = 0,
  x = 0,
  y = 0,
  rotate = 0,
  style,
}: {
  children?: React.ReactNode;
  delay?: number;
  x?: number;
  y?: number;
  rotate?: number;
  style?: React.CSSProperties;
}) => (
  <motion.div
    style={{
      position: 'absolute',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.65) 100%)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(255,255,255,0.5)',
      borderRadius: 18,
      boxShadow: `
        0 8px 32px rgba(0,0,0,0.08),
        0 2px 8px rgba(0,0,0,0.04),
        inset 0 1px 0 rgba(255,255,255,0.8)
      `,
      x,
      y,
      rotate,
      ...style,
    }}
    initial={{ opacity: 0, y: y + 30, rotate: rotate - 8 }}
    animate={{
      opacity: 1,
      y: [y, y - 12, y],
      rotate: [rotate, rotate + 1.5, rotate],
    }}
    transition={{
      opacity: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
      y: { duration: 7, delay: delay + 0.5, repeat: Infinity, ease: 'easeInOut' },
      rotate: { duration: 9, delay, repeat: Infinity, ease: 'easeInOut' },
    }}
    aria-hidden="true"
  >
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '40%',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)',
      borderRadius: '18px 18px 0 0',
    }} />
    {children}
  </motion.div>
));

/* ═══════════════════════════════════════════════════
   PREMIUM 3D RING
═══════════════════════════════════════════════════ */
const RotatingRing = memo(({ size, top, left, right, borderWidth = 2, delay = 0 }: {
  size: number;
  top?: string;
  left?: string;
  right?: string;
  borderWidth?: number;
  delay?: number;
}) => (
  <motion.div
    style={{
      position: 'absolute',
      width: size,
      height: size,
      top,
      left,
      right,
      borderRadius: '50%',
      border: `${borderWidth}px solid rgba(34,197,94,0.12)`,
      boxShadow: `0 0 24px rgba(34,197,94,0.06), inset 0 0 24px rgba(34,197,94,0.06)`,
      pointerEvents: 'none',
    }}
    animate={{
      rotate: [0, 360],
      scale: [1, 1.02, 1],
    }}
    transition={{
      rotate: { duration: 28, delay, repeat: Infinity, ease: 'linear' },
      scale: { duration: 7, delay, repeat: Infinity, ease: 'easeInOut' },
    }}
    aria-hidden="true"
  />
));

/* ═══════════════════════════════════════════════════
   PREMIUM STAT CARD (3D Floating)
═══════════════════════════════════════════════════ */
const StatCard = memo(({ v, l, index }: { v: string; l: string; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [5, -5]), {
    stiffness: 180,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-5, 5]), {
    stiffness: 180,
    damping: 22,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <motion.div
      ref={cardRef}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 700,
        transformStyle: 'preserve-3d',
        zIndex: isHovered ? 10 : 1,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0.5);
        mouseY.set(0.5);
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 + 0.5, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Ambient glow */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: -6,
          borderRadius: 22,
          background: 'radial-gradient(circle, rgba(34,197,94,0.12), transparent 70%)',
          filter: 'blur(16px)',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.35s ease',
          pointerEvents: 'none',
        }}
      />

      <div style={{
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.88) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.55)',
        borderRadius: 18,
        padding: 'clamp(16px, 2.5vw, 24px) clamp(10px, 1.5vw, 18px)',
        textAlign: 'center',
        boxShadow: `
          0 6px 20px rgba(0,0,0,0.05),
          0 2px 6px rgba(0,0,0,0.03),
          inset 0 1px 0 rgba(255,255,255,0.9),
          inset 0 -1px 0 rgba(0,0,0,0.01)
        `,
        transition: 'box-shadow 0.3s ease',
      }}>
        {/* Inner highlight */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '32%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.45) 0%, transparent 100%)',
            borderRadius: '18px 18px 0 0',
            pointerEvents: 'none',
          }}
        />

        <div className="display" style={{
          fontWeight: 800,
          fontSize: 'clamp(17px, 3.5vw, 27px)',
          color: '#111',
          lineHeight: 1,
          marginBottom: 5,
          letterSpacing: '-0.02em',
        }}>
          {v}
        </div>
        <div style={{
          fontSize: 'clamp(9px, 1.4vw, 12px)',
          color: '#888',
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          lineHeight: 1.3,
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
  children,
  variant = 'dark',
  href,
  onClick
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

  const springX = useSpring(useTransform(mouseX, [0, 1], [-4, 4]), {
    stiffness: 140,
    damping: 14,
  });
  const springY = useSpring(useTransform(mouseY, [0, 1], [-3, 3]), {
    stiffness: 140,
    damping: 14,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const variants: Record<string, { bg: string; color: string; border: string; glow: string }> = {
    dark: {
      bg: 'linear-gradient(135deg, #111 0%, #222 100%)',
      color: '#fff',
      border: 'rgba(255,255,255,0.1)',
      glow: 'rgba(0,0,0,0.22)',
    },
    ghost: {
      bg: 'transparent',
      color: '#111',
      border: 'rgba(17,17,17,0.9)',
      glow: 'rgba(17,17,17,0.12)',
    },
    green: {
      bg: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
      color: '#fff',
      border: 'rgba(34,197,94,0.25)',
      glow: 'rgba(34,197,94,0.3)',
    },
  };

  const v = variants[variant];

  const content = (
    <motion.div
      ref={buttonRef}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '17px 34px',
        borderRadius: 99,
        fontSize: 15,
        fontWeight: 600,
        fontFamily: 'inherit',
        cursor: 'pointer',
        textDecoration: 'none',
        background: v.bg,
        color: v.color,
        border: `1.5px solid ${v.border}`,
        boxShadow: `
          0 5px 22px ${v.glow},
          inset 0 1px 0 ${variant === 'ghost' ? 'transparent' : 'rgba(255,255,255,0.12)'}
        `,
        x: springX,
        y: springY,
        overflow: 'hidden',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0.5);
        mouseY.set(0.5);
      }}
      whileHover={{ scale: 1.03, y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Glow effect */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: -2,
          borderRadius: 'inherit',
          background: `radial-gradient(circle, ${v.glow}, transparent 70%)`,
          filter: 'blur(10px)',
          opacity: isHovered ? 1 : 0,
          pointerEvents: 'none',
          transition: 'opacity 0.35s ease',
          zIndex: -1,
        }}
      />

      {/* Light sweep */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
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
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none', display: 'inline-flex' }}
        whileHover={{ scale: 1.01 }}
      >
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
   FLOATING GEOMETRIC SHAPES
═══════════════════════════════════════════════════ */
const FloatingShapes = memo(({ reduced }: { reduced: boolean }) => {
  if (reduced) return null;

  return (
    <>
      {/* Floating cube */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '12%',
          left: '7%',
          width: 55,
          height: 55,
          transformStyle: 'preserve-3d',
          transformPerspective: 700,
        }}
        animate={{
          rotateX: [0, 360],
          rotateY: [0, 360],
          y: [0, -18, 8, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      >
        {[0, 90, 180, 270].map((deg) => (
          <div
            key={deg}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(34,197,94,0.04) 100%)',
              border: '1px solid rgba(34,197,94,0.18)',
              backdropFilter: 'blur(4px)',
              transform: `rotateY(${deg}deg) translateZ(28px)`,
            }}
          />
        ))}
      </motion.div>

      {/* Floating triangle */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '72%',
          right: '10%',
          width: 38,
          height: 38,
        }}
        animate={{
          y: [0, -28, 0],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div style={{
          width: 0,
          height: 0,
          borderLeft: '19px solid transparent',
          borderRight: '19px solid transparent',
          borderBottom: '33px solid rgba(34,197,94,0.1)',
          filter: 'drop-shadow(0 4px 10px rgba(34,197,94,0.08))',
        }} />
      </motion.div>

      {/* Floating diamond */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '28%',
          right: '5%',
          width: 28,
          height: 28,
        }}
        animate={{
          y: [0, 18, -8, 0],
          rotate: [0, 90, 180, 270, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      >
        <div style={{
          width: 0,
          height: 0,
          borderLeft: '14px solid transparent',
          borderRight: '14px solid transparent',
          borderBottom: '24px solid rgba(34,197,94,0.08)',
        }} />
      </motion.div>
    </>
  );
});

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
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const fn = (e: MediaQueryListEvent) => setReduced(e.matches);
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
        paddingBottom: 'clamp(80px, 12vw, 110px)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Premium 3D Background */}
      <HeroBg />

      {/* Floating geometric shapes */}
      <FloatingShapes reduced={reduced} />

      {/* Rotating rings */}
      {!reduced && (
        <>
          <RotatingRing size={280} top="-50px" left="4%" delay={0} />
          <RotatingRing size={160} top="62%" right="7%" delay={3} />
          <RotatingRing size={90} top="18%" right="16%" delay={6} borderWidth={1} />
        </>
      )}

      {/* Floating glass panels */}
      {!reduced && (
        <>
          <FloatingGlassPanel
            delay={0.25}
            x={-35}
            y={-180}
            rotate={-10}
            style={{
              top: '16%',
              left: '4%',
              width: 95,
              height: 110,
              zIndex: 1,
            }}
          >
            <div style={{ padding: 18, opacity: 0 }}>
              <div style={{ fontSize: 10, color: '#888', marginBottom: 4 }}>PROJECT</div>
              <div style={{ fontSize: 14, color: '#111', fontWeight: 700 }}>Active</div>
            </div>
          </FloatingGlassPanel>

          <FloatingGlassPanel
            delay={0.55}
            x={35}
            y={75}
            rotate={7}
            style={{
              top: '20%',
              right: '5%',
              width: 105,
              height: 75,
              zIndex: 1,
            }}
          >
            <div style={{ padding: 15, opacity: 0 }}>
              <div style={{ fontSize: 18, color: '#22c55e', fontWeight: 800 }}>7d</div>
              <div style={{ fontSize: 9, color: '#888' }}>Delivery</div>
            </div>
          </FloatingGlassPanel>

          <FloatingGlassPanel
            delay={0.85}
            x={-28}
            y={-90}
            rotate={-5}
            style={{
              bottom: '22%',
              left: '2%',
              width: 85,
              height: 85,
              zIndex: 1,
            }}
          >
            <div style={{ padding: 15, opacity: 0 }}>
              <div style={{ fontSize: 20, color: '#111', fontWeight: 800 }}>100%</div>
              <div style={{ fontSize: 9, color: '#888' }}>Satisfaction</div>
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
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.18, duration: 0.45 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 9,
              background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
              color: '#15803d',
              padding: '10px 22px',
              borderRadius: 99,
              fontSize: 'clamp(12px, 2.5vw, 13px)',
              fontWeight: 600,
              border: '1px solid rgba(34,197,94,0.22)',
              marginBottom: 'clamp(28px, 5vw, 46px)',
              whiteSpace: 'nowrap',
              flexWrap: 'nowrap',
              boxShadow: `
                0 4px 14px rgba(34,197,94,0.12),
                inset 0 1px 0 rgba(255,255,255,0.5)
              `,
            }}
          >
            <motion.span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#22c55e',
                display: 'inline-block',
                flexShrink: 0,
                boxShadow: '0 0 6px rgba(34,197,94,0.55)',
              }}
              animate={{ scale: [1, 1.25, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden="true"
            />
            Available for new projects · 7-day delivery guaranteed
          </motion.div>

          {/* Headline */}
          <h1
            className="display"
            style={{ fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.04em', color: '#111', marginBottom: 'clamp(24px, 4vw, 38px)' }}
          >
            <motion.span
              style={{ display: 'block', fontSize: 'clamp(2rem, 5.5vw, 5rem)' }}
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.75, ease: EASE }}
            >
              We build websites that
            </motion.span>
            <motion.span
              style={{ display: 'block', position: 'relative', fontSize: 'clamp(2.2rem, 6.5vw, 5.8rem)', marginTop: 5 }}
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.75, ease: EASE }}
            >
              grow your business
              <motion.span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  bottom: -7,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '62%',
                  height: 5,
                  background: 'linear-gradient(90deg, #22c55e, #16a34a)',
                  borderRadius: 99,
                  boxShadow: '0 0 18px rgba(34,197,94,0.35)',
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.1, duration: 0.55, ease: EASE }}
              />
            </motion.span>
          </h1>

          {/* Subtitle with typewriter */}
          <motion.p
            style={{ fontSize: 'clamp(14px, 2vw, 18px)', color: '#666', lineHeight: 1.78, maxWidth: 530, margin: '0 auto clamp(32px, 5vw, 50px)', padding: '0 4px' }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.58, duration: 0.55, ease: EASE }}
          >
            Custom websites for{' '}
            <span
              aria-label={`${txt} — and more business types`}
              style={{
                color: '#111',
                fontWeight: 700,
                borderBottom: '3px solid #22c55e',
                paddingBottom: 2,
                display: 'inline-block',
                minWidth: '10ch',
                textAlign: 'left',
              }}
            >
              {txt}
              {!reduced && (
                <span
                  aria-hidden="true"
                  style={{
                    display: 'inline-block',
                    width: 2,
                    height: '1.1em',
                    background: '#111',
                    verticalAlign: 'middle',
                    marginLeft: 2,
                    animation: 'blink 1s step-end infinite',
                  }}
                />
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
            id="hero-stats"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 'clamp(12px, 2vw, 16px)',
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
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          overflow: 'hidden',
          borderTop: '1px solid rgba(34,197,94,0.08)',
          padding: '15px 0',
          background: 'linear-gradient(180deg, transparent, rgba(34,197,94,0.015))'
        }}
      >
        <div className="marquee" style={{ display: 'flex', gap: 56, width: 'max-content' }}>
          {MARQUEE_DUPED.map((t, i) => (
            <span key={i} style={{ fontSize: 11, fontWeight: 700, color: '#6b6b6b', whiteSpace: 'nowrap', letterSpacing: '0.12em', textTransform: 'uppercase', flexShrink: 0 }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
});
