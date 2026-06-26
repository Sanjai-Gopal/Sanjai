import React, { memo, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { TestimonialsBg } from './BackgroundElements';

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const TESTIMONIALS = [
  {
    name: 'Ramesh Kumar',   biz: 'Ramesh Catering Services', loc: 'Salem, TN',
    text: 'Sanjai built our website in just 5 days. Our phone has been ringing non-stop since the launch. Best investment we made for the business.',
    init: 'RK', color: '#22c55e',
  },
  {
    name: 'Priya Sharma',   biz: 'Priya Beauty Studio',      loc: 'Coimbatore, TN',
    text: 'Very professional work. The website looks exactly how I imagined — clean, beautiful, and easy to use. My clients love it. Highly recommend!',
    init: 'PS', color: '#8b5cf6',
  },
  {
    name: 'Arun Vijay',     biz: 'AV Properties',            loc: 'Chennai, TN',
    text: 'Sanjai understood our requirements quickly and delivered beyond expectations. We started receiving enquiries within the first week of going live.',
    init: 'AV', color: '#f59e0b',
  },
  {
    name: 'Likitha Sanjai', biz: "Likitha's Café",             loc: 'Maldives, SL',
    text: 'Affordable, fast, and high quality. Sanjai was always available to answer my questions and made the whole process stress-free. 10/10.',
    init: 'LS', color: '#f43f5e',
  },
];

function Stars({ label }: { label?: string }) {
  return (
    <div style={{ display: 'flex', gap: 3 }} role="img" aria-label={label ?? '5 out of 5 stars'}>
      {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PREMIUM GLASS TESTIMONIAL CARD
═══════════════════════════════════════════════════ */
const TestimonialCard = memo(({ t, index }: { t: typeof TESTIMONIALS[0]; index: number }) => {
  const cardRef = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [5, -5]), {
    stiffness: 180,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-5, 5]), {
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
    <motion.figure
      ref={cardRef}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.5)',
        borderRadius: 24,
        padding: 'clamp(24px, 3vw, 32px)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: `
          0 6px 24px rgba(0,0,0,0.05),
          0 2px 6px rgba(0,0,0,0.03),
          inset 0 1px 0 rgba(255,255,255,0.8)
        `,
        rotateX,
        rotateY,
        transformPerspective: 800,
        transformStyle: 'preserve-3d',
        margin: 0,
        overflow: 'hidden',
        position: 'relative',
      }}
      initial={{ opacity: 0, y: 28 }}
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
      whileHover={{ y: -6, scale: 1.02 }}
    >
      {/* Quotation glow */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${t.color}12 0%, transparent 70%)`,
          filter: 'blur(30px)',
          pointerEvents: 'none',
        }}
        animate={{ opacity: isHovered ? 1 : 0.6, scale: isHovered ? 1.2 : 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />

      {/* Inner highlight */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '30%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      <Stars />

      {/* Quote mark */}
      <div aria-hidden="true" style={{
        fontSize: 56,
        lineHeight: 1,
        color: `${t.color}15`,
        fontFamily: 'Georgia, serif',
        marginTop: 8,
        marginBottom: -14,
        fontWeight: 400,
        userSelect: 'none',
      }}>
        "
      </div>

      <blockquote style={{ margin: 0, padding: 0, flexGrow: 1, position: 'relative' }}>
        <p style={{
          fontSize: 14,
          color: '#444',
          lineHeight: 1.75,
          marginBottom: 26,
          fontStyle: 'italic',
        }}>
          {t.text}
        </p>
      </blockquote>

      <figcaption style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <motion.div
          style={{
            width: 46,
            height: 46,
            borderRadius: '50%',
            flexShrink: 0,
            background: `linear-gradient(135deg, ${t.color}18 0%, ${t.color}08 100%)`,
            border: `2px solid ${t.color}25`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 800,
            color: t.color,
            fontFamily: 'Bricolage Grotesque, sans-serif',
            boxShadow: `0 4px 12px ${t.color}15`,
          }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
        >
          {t.init}
        </motion.div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>{t.name}</div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 3 }}>{t.biz} · {t.loc}</div>
        </div>
      </figcaption>
    </motion.figure>
  );
});

export default memo(function Testimonials() {
  return (
    <section id="testimonials" aria-labelledby="testimonials-heading" className="section" style={{ background: '#f2f2ee', position: 'relative', overflow: 'hidden' }}>
      <TestimonialsBg />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: 'clamp(38px, 5vw, 56px)' }}
        >
          <div className="label" aria-hidden="true">Reviews</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 18 }}>
            <h2 id="testimonials-heading" className="display" style={{
              fontWeight: 800,
              fontSize: 'clamp(2rem, 4.5vw, 3.4rem)',
              lineHeight: 1.05, letterSpacing: '-0.03em', color: '#111',
            }}>
              What Clients<br /><span style={{ color: '#22c55e' }}>Are Saying</span>
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Stars label="Average rating 4.9 out of 5" />
              <span style={{ fontSize: 14, color: '#666', fontWeight: 500 }}>4.9 / 5 average</span>
            </div>
          </div>
        </motion.div>

        <div className="grid-2" style={{ perspective: 1000 }}>
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={i} t={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
});
