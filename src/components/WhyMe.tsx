import React, { memo, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { WhyMeBg } from './BackgroundElements';

const ZapIcon    = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const StarIcon   = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const ShieldIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const PhoneIcon  = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>;

const REASONS = [
  { Icon: ZapIcon,    title: 'Fast Delivery',   desc: 'Most websites are ready in 5–7 days. I work fast without cutting corners on quality.' },
  { Icon: StarIcon,   title: 'Premium Design',  desc: 'Every website is custom-designed — not a template. Your business deserves to stand out.' },
  { Icon: ShieldIcon, title: 'Ongoing Support', desc: "After launch, I'm still here. Updates, fixes, and changes — all handled quickly." },
  { Icon: PhoneIcon,  title: 'Mobile First',    desc: 'Over 80% of customers browse on phones. Every site I build looks perfect on all screens.' },
];

/* ═══════════════════════════════════════════════════
   PREMIUM FEATURE CARD WITH 3D TILT
═══════════════════════════════════════════════════ */
const FeatureCard = memo(({ r, index }: { r: typeof REASONS[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [6, -6]), {
    stiffness: 180,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-6, 6]), {
    stiffness: 180,
    damping: 20,
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
      role="listitem"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.88) 100%)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.5)',
        borderRadius: 22,
        padding: 'clamp(22px, 2.5vw, 30px)',
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
        rotateX,
        rotateY,
        transformPerspective: 800,
        transformStyle: 'preserve-3d',
        position: 'relative',
        overflow: 'hidden',
      }}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0.5);
        mouseY.set(0.5);
      }}
      whileHover={{ y: -5, scale: 1.03 }}
    >
      {/* Ambient glow */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: -6,
          borderRadius: 'inherit',
          background: 'radial-gradient(circle, rgba(34,197,94,0.1), transparent 70%)',
          filter: 'blur(18px)',
          opacity: isHovered ? 1 : 0,
          pointerEvents: 'none',
          transition: 'opacity 0.35s ease',
          zIndex: -1,
        }}
      />

      {/* Inner highlight */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '32%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)',
          borderRadius: '22px 22px 0 0',
          pointerEvents: 'none',
        }}
      />

      {/* Icon */}
      <motion.div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 48,
          height: 48,
          borderRadius: 14,
          background: 'linear-gradient(135deg, #f5f5f0 0%, #e8e8e3 100%)',
          color: '#111',
          marginBottom: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
        }}
        animate={{ scale: isHovered ? 1.1 : 1, rotate: isHovered ? [0, -3, 3, 0] : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <r.Icon />
      </motion.div>

      <div className="display" style={{ fontWeight: 700, fontSize: 16, color: '#111', marginBottom: 8, letterSpacing: '-0.01em' }}>
        {r.title}
      </div>

      <div style={{ fontSize: 13, color: '#666', lineHeight: 1.65 }}>
        {r.desc}
      </div>
    </motion.div>
  );
});

export default memo(function WhyMe() {
  return (
    <section id="why" className="section" aria-labelledby="whyme-heading" style={{ background: '#fff', position: 'relative', overflow: 'hidden' }}>
      <WhyMeBg />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="whyme-grid">

          {/* Left copy */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="label" aria-hidden="true">Why Me</div>
            <h2 id="whyme-heading" className="display" style={{
              fontWeight: 800,
              fontSize: 'clamp(2rem, 4.5vw, 3.4rem)',
              lineHeight: 1.05, letterSpacing: '-0.03em',
              color: '#111', marginBottom: 22,
            }}>
              Why Choose<br /><span style={{ color: '#22c55e' }}>Sanjai?</span>
            </h2>
            <p style={{ fontSize: 15, color: '#666', lineHeight: 1.8, marginBottom: 36, maxWidth: 480 }}>
              I don't just build websites. I build tools that help your business grow. Every decision I make is focused on one thing — getting you more customers.
            </p>
            <motion.a
              href="https://wa.me/919363265552?text=Hi Sanjai, I want to discuss my website project."
              target="_blank"
              rel="noopener noreferrer"
              style={{
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
                background: 'linear-gradient(135deg, #111 0%, #222 100%)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 5px 22px rgba(0,0,0,0.2)',
              }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              aria-label="Chat with Sanjai on WhatsApp to discuss your project"
            >
              Let's Talk
            </motion.a>
          </motion.div>

          {/* Right cards */}
          <motion.div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, perspective: 1000 }}
            role="list"
            aria-label="Reasons to choose Sanjai"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            {REASONS.map((r, i) => (
              <FeatureCard key={i} r={r} index={i} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
});
