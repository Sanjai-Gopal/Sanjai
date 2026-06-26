import React, { memo, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ServicesBg } from './BackgroundElements';

const MonitorIcon = memo(() => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>);
const ZapIcon     = memo(() => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>);
const StoreIcon   = memo(() => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>);
const CheckIcon   = memo(() => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>);

const SERVICES = [
  { Icon: MonitorIcon, title: 'Business Website', desc: 'A clean, fast, mobile-friendly website that represents your brand and converts visitors into customers.', features: ['Custom Design', 'Mobile Responsive', 'SEO Optimized', 'Contact Form', 'Google Maps'], price: '₹4,999', popular: false },
  { Icon: ZapIcon,     title: 'Landing Page',     desc: 'A high-converting single page built to turn visitors into leads — perfect for offers and ad campaigns.', features: ['Conversion Focused', 'Lightning Fast', 'WhatsApp Button', 'Analytics Ready', 'Free Revision'], price: '₹2,999', popular: true },
  { Icon: StoreIcon,   title: 'Online Store',     desc: 'Start selling online with a professional store — product listings, payments, and order management.',    features: ['Product Catalog', 'Payment Gateway', 'Order Management', 'Mobile Ready', 'Inventory Tracking'], price: '₹9,999', popular: false },
];

/* ═══════════════════════════════════════════════════
   PREMIUM 3D SERVICE CARD
═══════════════════════════════════════════════════ */
const ServiceCard = memo(({ s, index }: { s: typeof SERVICES[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [6, -6]), {
    stiffness: 200,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-6, 6]), {
    stiffness: 200,
    damping: 22,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <motion.article
      ref={cardRef}
      aria-label={`${s.title} — starting from ${s.price}${s.popular ? ' — Most popular' : ''}`}
      style={{
        position: 'relative',
        background: s.popular
          ? 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)'
          : 'linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.88) 100%)',
        backdropFilter: s.popular ? 'blur(16px)' : 'blur(12px)',
        WebkitBackdropFilter: s.popular ? 'blur(16px)' : 'blur(12px)',
        border: s.popular ? '2px solid #111' : '1px solid rgba(255,255,255,0.5)',
        borderRadius: 26,
        padding: 'clamp(24px, 3vw, 36px)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: s.popular
          ? '0 20px 50px rgba(0,0,0,0.2), 0 0 40px rgba(34,197,94,0.08)'
          : '0 4px 20px rgba(0,0,0,0.04), 0 1px 4px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.8)',
        rotateX,
        rotateY,
        transformPerspective: 900,
        transformStyle: 'preserve-3d',
        overflow: 'hidden',
      }}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.12, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
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
          position: 'absolute',
          inset: -6,
          borderRadius: 'inherit',
          background: s.popular
            ? 'radial-gradient(circle, rgba(34,197,94,0.15), transparent 70%)'
            : 'radial-gradient(circle, rgba(34,197,94,0.1), transparent 70%)',
          filter: 'blur(20px)',
          opacity: isHovered ? 1 : 0.6,
          pointerEvents: 'none',
          transition: 'opacity 0.35s ease',
          zIndex: -1,
        }}
      />

      {/* Inner highlight */}
      {!s.popular && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '35%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)',
            borderRadius: '26px 26px 0 0',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Light sweep */}
      {isHovered && !s.popular && (
        <motion.div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
          }}
          initial={{ transform: 'translateX(-100%)' }}
          animate={{ transform: 'translateX(100%)' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
      )}

      {/* Popular badge */}
      {s.popular && (
        <motion.div
          aria-label="Most popular service"
          style={{
            position: 'absolute',
            top: -14,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            color: '#fff',
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: '0.08em',
            padding: '6px 22px',
            borderRadius: 99,
            whiteSpace: 'nowrap',
            boxShadow: '0 5px 15px rgba(34,197,94,0.35)',
          }}
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: index * 0.12 + 0.3, duration: 0.4 }}
        >
          MOST POPULAR
        </motion.div>
      )}

      {/* Icon */}
      <motion.div
        style={{
          width: 52,
          height: 52,
          borderRadius: 16,
          background: s.popular ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #f5f5f0 0%, #e8e8e3 100%)',
          color: s.popular ? '#fff' : '#111',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 22,
          boxShadow: s.popular ? '0 4px 15px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.05)',
        }}
        animate={{ scale: isHovered ? 1.08 : 1, rotate: isHovered ? [0, -2, 2, 0] : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <s.Icon />
      </motion.div>

      {/* Title */}
      <div className="display" style={{ fontWeight: 800, fontSize: 21, color: s.popular ? '#fff' : '#111', marginBottom: 12, letterSpacing: '-0.01em' }}>
        {s.title}
      </div>

      {/* Description */}
      <p style={{ fontSize: 14, lineHeight: 1.72, color: s.popular ? 'rgba(255,255,255,0.6)' : '#666', marginBottom: 26, flexGrow: 1 }}>
        {s.desc}
      </p>

      {/* Features */}
      <ul style={{ display: 'flex', flexDirection: 'column', gap: 11, listStyle: 'none', padding: 0, margin: '0 0 32px 0' }}>
        {s.features.map((f, j) => (
          <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <motion.div
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                flexShrink: 0,
                background: s.popular ? 'rgba(34,197,94,0.18)' : 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#16a34a',
                boxShadow: '0 2px 8px rgba(34,197,94,0.15)',
              }}
              whileHover={{ scale: 1.15 }}
            >
              <CheckIcon />
            </motion.div>
            <span style={{ fontSize: 13, fontWeight: 500, color: s.popular ? 'rgba(255,255,255,0.75)' : '#555' }}>
              {f}
            </span>
          </li>
        ))}
      </ul>

      {/* Price section */}
      <div style={{ borderTop: `1px solid ${s.popular ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`, paddingTop: 26, marginTop: 'auto' }}>
        <div style={{ marginBottom: 18 }}>
          <span className="display" style={{ fontWeight: 800, fontSize: 35, color: s.popular ? '#fff' : '#111', letterSpacing: '-0.02em' }}>
            {s.price}
          </span>
          <span style={{ fontSize: 13, marginLeft: 6, color: s.popular ? 'rgba(255,255,255,0.35)' : '#bbb' }}>onwards</span>
        </div>
        <motion.a
          href={`https://wa.me/919363265552?text=Hi Sanjai, I am interested in your ${encodeURIComponent(s.title)} package.`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            borderRadius: 14,
            background: s.popular ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 'linear-gradient(135deg, #111 0%, #222 100%)',
            color: '#fff',
            fontSize: 14,
            fontWeight: 700,
            padding: '15px',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            textDecoration: 'none',
            boxShadow: s.popular
              ? '0 6px 22px rgba(34,197,94,0.3)'
              : '0 4px 16px rgba(0,0,0,0.15)',
          }}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Get Started
        </motion.a>
      </div>

      {/* Edge glow effect for popular card */}
      {s.popular && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            border: '1px solid rgba(34,197,94,0.2)',
            pointerEvents: 'none',
          }}
        />
      )}
    </motion.article>
  );
});

export default memo(function Services() {
  return (
    <section id="services" className="section" aria-labelledby="services-heading" style={{ background: '#fff', position: 'relative', overflow: 'hidden' }}>
      <ServicesBg />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: 'clamp(40px, 6vw, 65px)' }}
        >
          <div className="label" aria-hidden="true">Services</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 18 }}>
            <h2 id="services-heading" className="display" style={{ fontWeight: 800, fontSize: 'clamp(2rem, 4.5vw, 3.4rem)', lineHeight: 1.05, letterSpacing: '-0.03em', color: '#111' }}>
              What I Build<br /><span style={{ color: '#22c55e' }}>For You</span>
            </h2>
            <p style={{ fontSize: 14, color: '#666', maxWidth: 400, lineHeight: 1.75 }}>Every package includes custom design, mobile layout, fast loading, and 1 month of free support after launch.</p>
          </div>
        </motion.div>

        <div className="grid-3" style={{ alignItems: 'stretch', perspective: 1100 }}>
          {SERVICES.map((s, i) => (
            <ServiceCard key={i} s={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
});
