import React, { memo } from 'react';
import { motion } from 'motion/react';
import { CTABg } from './BackgroundElements';
import { MessageCircle, Mail } from 'lucide-react';

const TRUST_POINTS = ['No advance needed', 'Revision included', 'Delivered in 7 days', '1 month free support'];

export default memo(function CTA() {
  return (
    <section
      aria-labelledby="cta-heading"
      style={{
        background: '#0f0f0f',
        padding: 'clamp(80px, 10vw, 128px) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div aria-hidden="true" style={{
        position: 'absolute', top: -160, left: '50%', transform: 'translateX(-50%)',
        width: 700, height: 400,
        background: 'radial-gradient(ellipse at center, rgba(34,197,94,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.25)',
            color: '#22c55e',
            padding: '8px 20px', borderRadius: 99,
            fontSize: 13, fontWeight: 600,
            marginBottom: 'clamp(24px, 4vw, 36px)',
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', background: '#22c55e',
              display: 'inline-block', animation: 'pulseDot 2s ease-in-out infinite',
              flexShrink: 0,
            }} aria-hidden="true" />
            Ready to Start · Fast Delivery Guaranteed
          </div>

          {/* Headline */}
          <h2 id="cta-heading" className="display" style={{
            fontWeight: 800,
            fontSize: 'clamp(2.2rem, 6vw, 4.2rem)',
            lineHeight: 1.0,
            letterSpacing: '-0.04em',
            color: '#fff',
            marginBottom: 'clamp(14px, 2.5vw, 20px)',
          }}>
            Ready to Grow<br />
            <span style={{ color: '#22c55e' }}>Your Business?</span>
          </h2>

          <p style={{
            fontSize: 'clamp(14px, 2vw, 17px)',
            color: 'rgba(255,255,255,0.45)',
            lineHeight: 1.75,
            maxWidth: 480,
            margin: '0 auto clamp(32px, 5vw, 44px)',
          }}>
            Let's build a website that brings you real customers. Message me today and your project can be live within a week.
          </p>

          {/* CTAs */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center',
            marginBottom: 'clamp(32px, 5vw, 48px)',
          }}>
            <a
              href="https://wa.me/919363265552?text=Hi Sanjai, I want a website for my business!"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-green"
              aria-label="Message Sanjai on WhatsApp to get started"
            >
              <MessageCircle size={17} aria-hidden="true" />
              WhatsApp Me Now
            </a>
            <a
              href="mailto:sanjai.sparkmail@gmail.com?subject=Website Enquiry"
              className="btn btn-glass"
              aria-label="Send Sanjai an email enquiry"
            >
              <Mail size={17} aria-hidden="true" />
              Send Email
            </a>
          </div>

          {/* Trust strip */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 'clamp(12px, 3vw, 28px)',
            justifyContent: 'center',
            paddingTop: 'clamp(24px, 4vw, 36px)',
            borderTop: '1px solid rgba(255,255,255,0.07)',
          }}>
            {TRUST_POINTS.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: '#22c55e', display: 'inline-block', flexShrink: 0,
                }} aria-hidden="true" />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
                  {t}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
});
