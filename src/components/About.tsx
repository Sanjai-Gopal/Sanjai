import React, { memo, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { AboutBg } from './BackgroundElements';

const STEPS = [
  { n: '01', t: 'Tell Me Your Idea',  d: 'Share what your business does and what you need.' },
  { n: '02', t: 'I Design & Build',   d: 'Custom design, full development — handled by me.' },
  { n: '03', t: 'Review & Launch',    d: 'You approve, we go live — usually within 7 days.' },
];

const CHECKLIST = [
  'Custom design — never a template',
  'Works perfectly on all phones & computers',
  'Delivered within 7 days, guaranteed',
  'Free support for 1 month after launch',
];

/* ═══════════════════════════════════════════════════
   PREMIUM FLOATING IMAGE
═══════════════════════════════════════════════════ */
const FloatingProfile = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [6, -6]), {
    stiffness: 150,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-6, 6]), {
    stiffness: 150,
    damping: 18,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <motion.div
      ref={containerRef}
      style={{
        display: 'flex',
        justifyContent: 'center',
        perspective: 1000,
        width: '100%',
        maxWidth: 'clamp(260px, 50vw, 400px)',
      }}
      initial={{ opacity: 0, x: -35 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0.5);
        mouseY.set(0.5);
      }}
    >
      <motion.div
        style={{
          position: 'relative',
          width: '100%',
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{ y: [0, -12, 6, -8, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Background glow */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: -16,
            borderRadius: 32,
            background: 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(16,185,129,0.08) 50%, rgba(34,197,94,0.05) 100%)',
            filter: 'blur(25px)',
            zIndex: -1,
          }}
        />

        {/* Shadow layer */}
        <motion.div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: -40,
            left: '15%',
            right: '15%',
            height: 50,
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.18), transparent 75%)',
            filter: 'blur(25px)',
            transform: 'translateZ(-60px)',
          }}
          animate={{ opacity: isHovered ? 0.6 : 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Main image container */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              borderRadius: 28,
              overflow: 'hidden',
              aspectRatio: '1/1',
              boxShadow: `
                0 28px 70px rgba(0,0,0,0.15),
                0 10px 25px rgba(0,0,0,0.1),
                inset 0 1px 0 rgba(255,255,255,0.2)
              `,
              border: '1px solid rgba(255,255,255,0.25)',
            }}
          >
            <motion.div
              style={{ width: '100%', height: '100%' }}
              animate={{ scale: isHovered ? 1.02 : 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <picture>
                <source srcSet="/images/profile-400.avif 400w, /images/profile.avif 800w" type="image/avif" sizes="(max-width: 640px) 260px, 400px" />
                <source srcSet="/images/profile-400.webp 400w, /images/profile-800.webp 800w" type="image/webp" sizes="(max-width: 640px) 260px, 400px" />
                <img
                  src="/images/profile.jpg"
                  alt="Sanjai Gopal — Web Designer and Developer based in Salem, Tamil Nadu"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  width="400"
                  height="400"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 88%', display: 'block' }}
                />
              </picture>
            </motion.div>

            {/* Light sweep */}
            {isHovered && (
              <motion.div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                }}
                initial={{ transform: 'translateX(-100%)' }}
                animate={{ transform: 'translateX(100%)' }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              />
            )}
          </div>

          {/* Info card */}
          <motion.div
            style={{
              marginTop: 14,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.92) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: 18,
              padding: '16px 18px',
              boxShadow: '0 6px 28px rgba(0,0,0,0.08)',
              border: '1px solid rgba(255,255,255,0.5)',
            }}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="display" style={{ fontWeight: 800, fontSize: 17, color: '#111', marginBottom: 3 }}>Sanjai G</div>
            <div style={{ fontSize: 13, color: '#22c55e', fontWeight: 600 }}>Web Designer &amp; Developer</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
              <motion.span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#22c55e',
                  display: 'inline-block',
                  boxShadow: '0 0 8px rgba(34,197,94,0.5)',
                }}
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                aria-hidden="true"
              />
              <span style={{ fontSize: 13, color: '#555', fontWeight: 500 }}>Open for new projects</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
});

/* ═══════════════════════════════════════════════════
   STEP CARD
═══════════════════════════════════════════════════ */
const StepCard = memo(({ s, index }: { s: typeof STEPS[0]; index: number }) => (
  <motion.div
    className="card"
    role="listitem"
    style={{
      padding: '20px 18px',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.88) 100%)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.5)',
    }}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.08 + 0.3, duration: 0.5 }}
    whileHover={{ y: -4, scale: 1.02 }}
  >
    <div style={{ fontSize: 11, fontWeight: 700, color: '#22c55e', marginBottom: 8, letterSpacing: '0.05em' }} aria-hidden="true">
      {s.n}
    </div>
    <div className="display" style={{ fontWeight: 700, fontSize: 14, color: '#111', marginBottom: 6, lineHeight: 1.3 }}>{s.t}</div>
    <div style={{ fontSize: 12, color: '#777', lineHeight: 1.6 }}>{s.d}</div>
  </motion.div>
));

const VP = { once: true, margin: '-80px' as const };

export default memo(function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-heading" style={{ background: '#f2f2ee' }}>
      <div className="container">
        <div className="about-grid">

          {/* Profile image */}
          <FloatingProfile />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VP}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="label" aria-hidden="true">About Me</div>
            <h2 id="about-heading" className="display" style={{ fontWeight: 800, fontSize: 'clamp(1.9rem, 4vw, 3rem)', lineHeight: 1.05, letterSpacing: '-0.03em', color: '#111', marginBottom: 22 }}>
              Hi, I'm Sanjai —<br /><span style={{ color: '#22c55e' }}>Your Website Guy</span>
            </h2>
            <p style={{ fontSize: 15, color: '#555', lineHeight: 1.8, marginBottom: 16 }}>
              I'm a web designer and developer based in Salem, Tamil Nadu. I help local businesses — restaurants, salons, real estate agents, and shops — get online with a website that actually brings in customers.
            </p>
            <p style={{ fontSize: 15, color: '#555', lineHeight: 1.8, marginBottom: 32 }}>
              I handle everything: design, development, and launch. You don't need to know anything about tech. Just tell me what your business does, and I'll take care of the rest.
            </p>

            {/* Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36 }}>
              {CHECKLIST.map((t, i) => (
                <motion.div
                  key={i}
                  className="check-item"
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  {t}
                </motion.div>
              ))}
            </div>

            {/* Steps */}
            <div
              className="steps-grid"
              role="list"
              aria-label="How it works"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}
            >
              {STEPS.map((s, i) => (
                <StepCard key={i} s={s} index={i} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});
