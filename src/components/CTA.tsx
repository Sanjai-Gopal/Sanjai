import React, { memo, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { MessageCircle, Mail } from 'lucide-react';

const TRUST_POINTS = ['No advance needed', 'Revision included', 'Delivered in 7 days', '1 month free support'];

/* ═══════════════════════════════════════════════════
   PREMIUM MAGNETIC BUTTON
═══════════════════════════════════════════════════ */
const MagneticButton = memo(({ children, href, primary = false, ariaLabel }: {
  children: React.ReactNode; href: string; primary?: boolean; ariaLabel: string;
}) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const x = useSpring(useTransform(mouseX, [0, 1], [-6, 6]), { stiffness: 200, damping: 25 });
  const y = useSpring(useTransform(mouseY, [0, 1], [-4, 4]), { stiffness: 200, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      aria-label={ariaLabel}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '18px 36px', borderRadius: 99,
        fontSize: 15, fontWeight: 700,
        fontFamily: 'inherit', cursor: 'pointer', textDecoration: 'none',
        background: primary
          ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
          : 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
        color: '#fff',
        border: primary ? 'none' : '1px solid rgba(255,255,255,0.15)',
        boxShadow: primary
          ? '0 8px 32px rgba(34,197,94,0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
          : '0 4px 16px rgba(0,0,0,0.2)',
        position: 'relative', overflow: 'hidden',
        x, y,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0.5);
        mouseY.set(0.5);
      }}
      whileHover={{ scale: 1.04, y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Light sweep */}
      {isHovered && (
        <motion.span
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            pointerEvents: 'none',
          }}
          initial={{ transform: 'translateX(-100%)' }}
          animate={{ transform: 'translateX(100%)' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      )}
      {children}
    </motion.a>
  );
});

export default memo(function CTA() {
  return (
    <section
      aria-labelledby="cta-heading"
      style={{
        background: 'linear-gradient(180deg, #0f0f0f 0%, #0a0a0a 50%, #0f0f0f 100%)',
        padding: 'clamp(80px, 10vw, 128px) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Dark background layer */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {/* Primary green glow top-center */}
        <div style={{
          position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)',
          width: 900, height: 600,
          background: 'radial-gradient(ellipse at center, rgba(34,197,94,0.18) 0%, rgba(34,197,94,0.06) 40%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
        {/* Left accent glow */}
        <div style={{
          position: 'absolute', top: '20%', left: '-10%',
          width: 500, height: 400,
          background: 'radial-gradient(ellipse at center, rgba(34,197,94,0.10) 0%, transparent 65%)',
          filter: 'blur(50px)',
        }} />
        {/* Right accent glow */}
        <div style={{
          position: 'absolute', top: '20%', right: '-10%',
          width: 500, height: 400,
          background: 'radial-gradient(ellipse at center, rgba(34,197,94,0.10) 0%, transparent 65%)',
          filter: 'blur(50px)',
        }} />
        {/* Subtle green dot grid */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cta-dots" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="#22c55e" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-dots)" />
        </svg>
        {/* Vignette edges */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.5) 100%)',
        }} />
        {/* Bottom fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 100,
          background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.3))',
        }} />
      </div>

      <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Badge */}
          <motion.div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(34,197,94,0.12)',
              border: '1px solid rgba(34,197,94,0.25)',
              color: '#22c55e',
              padding: '8px 20px', borderRadius: 99,
              fontSize: 13, fontWeight: 600,
              marginBottom: 'clamp(24px, 4vw, 36px)',
            }}
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.5 }}
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <motion.span
              style={{
                width: 7, height: 7, borderRadius: '50%', background: '#22c55e',
                display: 'inline-block', flexShrink: 0,
                boxShadow: '0 0 8px rgba(34,197,94,0.6)',
              }}
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden="true"
            />
            Ready to Start · Fast Delivery Guaranteed
          </motion.div>

          {/* Headline */}
          <motion.h2
            id="cta-heading"
            className="display"
            style={{
              fontWeight: 800,
              fontSize: 'clamp(2.2rem, 6vw, 4.2rem)',
              lineHeight: 1.0,
              letterSpacing: '-0.04em',
              color: '#fff',
              marginBottom: 'clamp(14px, 2.5vw, 20px)',
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Ready to Grow<br />
            <span style={{
              background: 'linear-gradient(135deg, #22c55e 0%, #4ade80 50%, #22c55e 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Your Business?</span>
          </motion.h2>

          <motion.p
            style={{
              fontSize: 'clamp(14px, 2vw, 17px)',
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.75,
              maxWidth: 480,
              margin: '0 auto clamp(32px, 5vw, 44px)',
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.55 }}
          >
            Let's build a website that brings you real customers. Message me today and your project can be live within a week.
          </motion.p>

          {/* CTAs */}
          <motion.div
            style={{
              display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center',
              marginBottom: 'clamp(32px, 5vw, 48px)',
            }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45, duration: 0.55 }}
          >
            <MagneticButton
              href="https://wa.me/919363265552?text=Hi Sanjai, I want a website for my business!"
              primary
              ariaLabel="Message Sanjai on WhatsApp to get started"
            >
              <MessageCircle size={17} aria-hidden="true" />
              WhatsApp Me Now
            </MagneticButton>
            <MagneticButton
              href="mailto:sanjai.sparkmail@gmail.com?subject=Website Enquiry"
              ariaLabel="Send Sanjai an email enquiry"
            >
              <Mail size={17} aria-hidden="true" />
              Send Email
            </MagneticButton>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            style={{
              display: 'flex', flexWrap: 'wrap', gap: 'clamp(12px, 3vw, 28px)',
              justifyContent: 'center',
              paddingTop: 'clamp(24px, 4vw, 36px)',
              borderTop: '1px solid rgba(255,255,255,0.08)',
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.55, duration: 0.5 }}
          >
            {TRUST_POINTS.map((t, i) => (
              <motion.div
                key={i}
                style={{ display: 'flex', alignItems: 'center', gap: 7 }}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + i * 0.08, duration: 0.4 }}
                whileHover={{ y: -2 }}
              >
                <span style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: '#22c55e', display: 'inline-block', flexShrink: 0,
                  boxShadow: '0 0 6px rgba(34,197,94,0.5)',
                }} aria-hidden="true" />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>
                  {t}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});
