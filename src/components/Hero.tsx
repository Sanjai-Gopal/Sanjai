import React, { useState, useEffect, useRef, memo } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { HeroBg } from './BackgroundElements';

const WORDS   = ['Restaurants', 'Salons', 'Real Estate', 'Cafés', 'Local Shops', 'Startups'];
const MARQUEE = ['React', 'Next.js', 'Tailwind CSS', 'Node.js', 'TypeScript', 'SEO Optimization', 'WhatsApp Integration', 'Figma', 'PostgreSQL', 'Framer Motion'];
const MARQUEE_DUPED = [...MARQUEE, ...MARQUEE];

const WaIcon = memo(() => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
));

const STATS = [
  { v: '10+',     l: 'Projects Delivered' },
  { v: '100%',    l: 'Client Satisfaction' },
  { v: '7 Days',  l: 'Avg. Delivery' },
  { v: '1 Month', l: 'Free Support' },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export default memo(function Hero({ onDown }: { onDown: () => void }) {
  const [idx, setIdx]   = useState(0);
  const [txt, setTxt]   = useState('');
  const [del, setDel]   = useState(false);
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
        paddingTop: 'clamp(96px, 16vw, 132px)',
        paddingBottom: 'clamp(80px, 12vw, 104px)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Premium 3D Background */}
      <HeroBg />

      <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1, width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          {/* Availability badge */}
          <div
            role="status"
            aria-label="Currently available for new projects"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#dcfce7', color: '#15803d',
              padding: '8px 18px', borderRadius: 99,
              fontSize: 'clamp(12px, 2.5vw, 13px)', fontWeight: 600,
              border: '1px solid #bbf7d0',
              marginBottom: 'clamp(24px, 5vw, 40px)',
              whiteSpace: 'nowrap',
              flexWrap: 'nowrap',
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulseDot 2s ease-in-out infinite', flexShrink: 0 }} aria-hidden="true" />
            Available for new projects · 7-day delivery guaranteed
          </div>

          {/* Headline */}
          <h1
            className="display"
            style={{ fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.04em', color: '#111', marginBottom: 'clamp(20px, 4vw, 32px)' }}
          >
            <span style={{ display: 'block', fontSize: 'clamp(2rem, 5.5vw, 4.8rem)' }}>We build websites that</span>
            <span style={{ display: 'block', position: 'relative', fontSize: 'clamp(2.2rem, 6.5vw, 5.6rem)', marginTop: 4 }}>
              grow your business
              <span aria-hidden="true" style={{
                position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)',
                width: '60%', height: 5,
                background: 'linear-gradient(90deg, #22c55e, #16a34a)',
                borderRadius: 99,
              }} />
            </span>
          </h1>

          {/* Subtitle with typewriter */}
          <p
            style={{ fontSize: 'clamp(14px, 2vw, 17px)', color: '#777', lineHeight: 1.8, maxWidth: 520, margin: '0 auto clamp(28px, 5vw, 44px)', padding: '0 4px' }}
          >
            Custom websites for{' '}
            <span
              aria-label={`${txt} — and more business types`}
              style={{
                color: '#111', fontWeight: 700,
                borderBottom: '2.5px solid #22c55e',
                paddingBottom: 2, display: 'inline-block',
                minWidth: '9ch', textAlign: 'left',
              }}
            >
              {txt}
              {!reduced && (
                <span aria-hidden="true" style={{
                  display: 'inline-block', width: 2, height: '1em',
                  background: '#111', verticalAlign: 'middle', marginLeft: 1,
                  animation: 'blink 1s step-end infinite',
                }} />
              )}
            </span>
            {' '}— designed to bring in more customers, calls, and sales.
          </p>

          {/* CTAs */}
          <div
            style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 'clamp(40px, 7vw, 64px)' }}
          >
            <a
              href="https://wa.me/919363265552?text=Hi Sanjai, I need a website for my business."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-dark"
              aria-label="Book a call on WhatsApp"
            >
              <WaIcon /> Book a Call
            </a>
            <button onClick={onDown} className="btn btn-ghost" aria-label="View portfolio">
              View Portfolio <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>

          {/* Stats grid */}
          <div
            id="hero-stats"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 'clamp(8px, 2vw, 14px)',
              maxWidth: 580,
              margin: '0 auto',
            }}
          >
            {STATS.map((s, i) => (
              <div key={i} style={{
                background: '#fff',
                border: '1.5px solid #e8e8e3',
                borderRadius: 16,
                padding: 'clamp(14px, 2.5vw, 20px) clamp(8px, 1.5vw, 14px)',
                textAlign: 'center',
              }}>
                <div className="display" style={{ fontWeight: 800, fontSize: 'clamp(15px, 3.2vw, 22px)', color: '#111', lineHeight: 1, marginBottom: 5 }}>
                  {s.v}
                </div>
                <div style={{ fontSize: 'clamp(9px, 1.4vw, 11px)', color: '#aaa', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1.3 }}>
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Tech marquee */}
      <div aria-hidden="true" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, overflow: 'hidden', borderTop: '1px solid #e5e5e0', padding: '14px 0' }}>
        <div className="marquee" style={{ display: 'flex', gap: 56, width: 'max-content' }}>
          {MARQUEE_DUPED.map((t, i) => (
            <span key={i} style={{ fontSize: 11, fontWeight: 700, color: '#555555', whiteSpace: 'nowrap', letterSpacing: '0.1em', textTransform: 'uppercase', flexShrink: 0 }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
});
