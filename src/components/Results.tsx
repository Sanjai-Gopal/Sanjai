import React, { memo, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ResultsBg } from './BackgroundElements';

const NUMBERS = [
  { v: '10+',  l: 'Websites Launched'   },
  { v: '100%', l: 'Client Satisfaction' },
  { v: '7',    l: 'Days Avg. Delivery'  },
  { v: '₹2K+', l: 'Saved vs Agencies'  },
];

const LOGOS = [
  'Sanjai Restaurant', 'Noir Elite', 'Sanjai Estates',
  'Vilas Salon', 'Aurelie Bistro', 'Velora Coffee',
];

/* ═══════════════════════════════════════════════════
   PREMIUM 3D STAT CARD
═══════════════════════════════════════════════════ */
const StatCard = memo(({ n, index }: { n: typeof NUMBERS[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [8, -8]), {
    stiffness: 200, damping: 22,
  });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-8, 8]), {
    stiffness: 200, damping: 22,
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
        textAlign: 'center',
        padding: 'clamp(24px, 4vw, 40px) 16px',
        borderRadius: 24,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.92) 100%)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.5)',
        boxShadow: `
          0 4px 16px rgba(0,0,0,0.04),
          0 2px 6px rgba(0,0,0,0.02),
          inset 0 1px 0 rgba(255,255,255,0.8)
        `,
        rotateX,
        rotateY,
        transformPerspective: 900,
        transformStyle: 'preserve-3d',
        position: 'relative',
        overflow: 'hidden',
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0.5);
        mouseY.set(0.5);
      }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      {/* Ambient glow */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: -8, borderRadius: 'inherit',
          background: 'radial-gradient(circle, rgba(34,197,94,0.12), transparent 70%)',
          filter: 'blur(24px)',
          opacity: isHovered ? 1 : 0.5,
          pointerEvents: 'none',
          transition: 'opacity 0.35s ease',
          zIndex: -1,
        }}
      />

      {/* Inner highlight */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 100%)',
          borderRadius: '24px 24px 0 0',
          pointerEvents: 'none',
        }}
      />

      {/* Light sweep */}
      {isHovered && (
        <motion.div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          }}
          initial={{ transform: 'translateX(-100%)' }}
          animate={{ transform: 'translateX(100%)' }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        />
      )}

      <motion.div
        className="display"
        style={{
          fontWeight: 800,
          fontSize: 'clamp(2.2rem, 5.5vw, 3.8rem)',
          color: '#111',
          lineHeight: 1,
          letterSpacing: '-0.04em',
          marginBottom: 8,
          position: 'relative',
        }}
        animate={{ scale: isHovered ? 1.03 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {n.v}
      </motion.div>
      <div style={{
        fontSize: 'clamp(11px, 1.5vw, 13px)', fontWeight: 600, color: '#999',
        textTransform: 'uppercase', letterSpacing: '0.08em',
      }}>
        {n.l}
      </div>
    </motion.div>
  );
});

export default memo(function Results() {
  return (
    <section aria-labelledby="results-heading" style={{ background: '#f2f2ee', padding: 'clamp(56px, 7vw, 80px) 0', position: 'relative', overflow: 'hidden' }}>
      <ResultsBg />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <h2 id="results-heading" className="sr-only">Results and social proof</h2>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55 }}
        >
          {/* Stats row */}
          <div className="results-grid" style={{ marginBottom: 'clamp(40px, 6vw, 60px)', perspective: 1000 }}>
            {NUMBERS.map((n, i) => (
              <StatCard key={i} n={n} index={i} />
            ))}
          </div>

          {/* Client strip */}
          <motion.div
            style={{
              borderTop: '1px solid #f0f0ea',
              paddingTop: 'clamp(28px, 4vw, 40px)',
              textAlign: 'center',
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <p style={{ fontSize: 12, color: '#bbb', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>
              Trusted by businesses across Tamil Nadu
            </p>
            <div
              style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px 28px' }}
              role="list"
              aria-label="Client businesses"
            >
              {LOGOS.map((l, i) => (
                <motion.span
                  key={i}
                  role="listitem"
                  className="display"
                  style={{
                    fontSize: 'clamp(13px, 2vw, 16px)',
                    fontWeight: 700,
                    color: '#ccc',
                    letterSpacing: '-0.02em',
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.06, duration: 0.4 }}
                  whileHover={{ color: '#111', y: -2 }}
                >
                  {l}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});
