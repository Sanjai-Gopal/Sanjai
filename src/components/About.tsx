import React, { memo } from 'react';
import { motion } from 'motion/react';
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

const VP = { once: true, margin: '-80px' as const };
const TR = { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const };

export default memo(function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-heading" style={{ background: '#f2f2ee' }}>
      <div className="container">
        <div className="about-grid">

          {/* Profile image */}
          <motion.div
            style={{ display: 'flex', justifyContent: 'center' }}
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VP}
            transition={TR}
          >
            <div style={{ position: 'relative', width: '100%', maxWidth: 'clamp(260px, 50vw, 400px)' }}>
              <div aria-hidden="true" style={{ position: 'absolute', inset: -12, borderRadius: 28, background: 'linear-gradient(135deg, #dcfce7 0%, #f0fdf4 50%, #e8e8e3 100%)', zIndex: 0 }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ borderRadius: 24, overflow: 'hidden', aspectRatio: '1/1', boxShadow: '0 24px 64px rgba(0,0,0,0.13)' }}>
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
                </div>
                <div style={{ marginTop: 12, background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: 16, padding: '14px 16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <div className="display" style={{ fontWeight: 800, fontSize: 16, color: '#111', marginBottom: 2 }}>Sanjai G</div>
                  <div style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>Web Designer &amp; Developer</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulseDot 2s ease-in-out infinite' }} aria-hidden="true" />
                    <span style={{ fontSize: 12, color: '#666', fontWeight: 500 }}>Open for new projects</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VP}
            transition={{ ...TR, delay: 0.12 }}
          >
            <div className="label" aria-hidden="true">About Me</div>
            <h2 id="about-heading" className="display" style={{ fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: 1.05, letterSpacing: '-0.03em', color: '#111', marginBottom: 20 }}>
              Hi, I'm Sanjai —<br /><span style={{ color: '#22c55e' }}>Your Website Guy</span>
            </h2>
            <p style={{ fontSize: 15, color: '#666', lineHeight: 1.8, marginBottom: 14 }}>
              I'm a web designer and developer based in Salem, Tamil Nadu. I help local businesses — restaurants, salons, real estate agents, and shops — get online with a website that actually brings in customers.
            </p>
            <p style={{ fontSize: 15, color: '#666', lineHeight: 1.8, marginBottom: 28 }}>
              I handle everything: design, development, and launch. You don't need to know anything about tech. Just tell me what your business does, and I'll take care of the rest.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 32 }}>
              {CHECKLIST.map((t, i) => <div key={i} className="check-item">{t}</div>)}
            </div>

            <div className="steps-grid" role="list" aria-label="How it works">
              {STEPS.map((s, i) => (
                <div key={i} className="card" role="listitem" style={{ padding: '18px 16px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#22c55e', marginBottom: 7, letterSpacing: '0.04em' }} aria-hidden="true">{s.n}</div>
                  <div className="display" style={{ fontWeight: 700, fontSize: 13, color: '#111', marginBottom: 5, lineHeight: 1.3 }}>{s.t}</div>
                  <div style={{ fontSize: 12, color: '#999', lineHeight: 1.6 }}>{s.d}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});