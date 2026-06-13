import React, { memo } from 'react';
import { motion } from 'motion/react';
import { ServicesBg } from './BackgroundElements';

const MonitorIcon = memo(() => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>);
const ZapIcon     = memo(() => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>);
const StoreIcon   = memo(() => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>);
const CheckIcon   = memo(() => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>);

const SERVICES = [
  { Icon: MonitorIcon, title: 'Business Website', desc: 'A clean, fast, mobile-friendly website that represents your brand and converts visitors into customers.', features: ['Custom Design', 'Mobile Responsive', 'SEO Optimized', 'Contact Form', 'Google Maps'], price: '₹4,999', popular: false },
  { Icon: ZapIcon,     title: 'Landing Page',     desc: 'A high-converting single page built to turn visitors into leads — perfect for offers and ad campaigns.', features: ['Conversion Focused', 'Lightning Fast', 'WhatsApp Button', 'Analytics Ready', 'Free Revision'], price: '₹2,999', popular: true },
  { Icon: StoreIcon,   title: 'Online Store',     desc: 'Start selling online with a professional store — product listings, payments, and order management.',    features: ['Product Catalog', 'Payment Gateway', 'Order Management', 'Mobile Ready', 'Inventory Tracking'], price: '₹9,999', popular: false },
];

export default memo(function Services() {
  return (
    <section id="services" className="section" aria-labelledby="services-heading" style={{ background: '#fff' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: 'clamp(40px, 6vw, 60px)' }}
        >
          <div className="label" aria-hidden="true">Services</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <h2 id="services-heading" className="display" style={{ fontWeight: 800, fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', lineHeight: 1.05, letterSpacing: '-0.03em', color: '#111' }}>
              What I Build<br /><span style={{ color: '#22c55e' }}>For You</span>
            </h2>
            <p style={{ fontSize: 15, color: '#777', maxWidth: 380, lineHeight: 1.75 }}>Every package includes custom design, mobile layout, fast loading, and 1 month of free support after launch.</p>
          </div>
        </motion.div>

        <motion.div
          className="grid-3"
          style={{ alignItems: 'stretch' }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          {SERVICES.map((s, i) => (
            <article
              key={i}
              aria-label={`${s.title} — starting from ${s.price}${s.popular ? ' — Most popular' : ''}`}
              style={{
                position: 'relative',
                background: s.popular ? '#111' : '#fff',
                border: s.popular ? '2px solid #111' : '1.5px solid #e8e8e3',
                borderRadius: 22,
                padding: 'clamp(24px, 3vw, 32px)',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: s.popular ? '0 24px 60px rgba(0,0,0,0.18)' : '0 2px 8px rgba(0,0,0,0.03)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(-6px)';
                el.style.boxShadow = s.popular ? '0 32px 72px rgba(0,0,0,0.25)' : '0 16px 48px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = s.popular ? '0 24px 60px rgba(0,0,0,0.18)' : '0 2px 8px rgba(0,0,0,0.03)';
              }}
            >
              {s.popular && (
                <div aria-label="Most popular service" style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#22c55e', color: '#fff', fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', padding: '5px 18px', borderRadius: 99, whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(34,197,94,0.35)' }}>
                  MOST POPULAR
                </div>
              )}
              <div className="icon-box" style={{ background: s.popular ? 'rgba(255,255,255,0.1)' : '#f5f5f0', color: s.popular ? '#fff' : '#111', marginBottom: 20 }}>
                <s.Icon />
              </div>
              <div className="display" style={{ fontWeight: 800, fontSize: 20, color: s.popular ? '#fff' : '#111', marginBottom: 10 }}>{s.title}</div>
              <p style={{ fontSize: 14, lineHeight: 1.72, color: s.popular ? 'rgba(255,255,255,0.6)' : '#777', marginBottom: 24, flexGrow: 1 }}>{s.desc}</p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, listStyle: 'none', padding: 0, margin: '0 0 28px 0' }}>
                {s.features.map((f, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, background: s.popular ? 'rgba(34,197,94,0.18)' : '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}><CheckIcon /></div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: s.popular ? 'rgba(255,255,255,0.75)' : '#555' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <div style={{ borderTop: `1px solid ${s.popular ? 'rgba(255,255,255,0.1)' : '#f0f0ea'}`, paddingTop: 24, marginTop: 'auto' }}>
                <div style={{ marginBottom: 16 }}>
                  <span className="display" style={{ fontWeight: 800, fontSize: 32, color: s.popular ? '#fff' : '#111' }}>{s.price}</span>
                  <span style={{ fontSize: 13, marginLeft: 6, color: s.popular ? 'rgba(255,255,255,0.35)' : '#bbb' }}>onwards</span>
                </div>
                <a
                  href={`https://wa.me/919363265552?text=Hi Sanjai, I am interested in your ${encodeURIComponent(s.title)} package.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                  style={{ display: 'flex', justifyContent: 'center', width: '100%', borderRadius: 14, background: s.popular ? '#22c55e' : '#111', color: '#fff', fontSize: 14, fontWeight: 700, padding: '14px' }}
                >
                  Get Started
                </a>
              </div>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
});
