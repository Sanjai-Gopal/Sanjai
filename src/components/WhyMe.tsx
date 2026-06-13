import React, { memo } from 'react';
import { motion } from 'motion/react';
import { WhyMeBg } from './BackgroundElements';

const ZapIcon    = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const StarIcon   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const ShieldIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const PhoneIcon  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>;

const REASONS = [
  { Icon: ZapIcon,    title: 'Fast Delivery',   desc: 'Most websites are ready in 5–7 days. I work fast without cutting corners on quality.' },
  { Icon: StarIcon,   title: 'Premium Design',  desc: 'Every website is custom-designed — not a template. Your business deserves to stand out.' },
  { Icon: ShieldIcon, title: 'Ongoing Support', desc: "After launch, I'm still here. Updates, fixes, and changes — all handled quickly." },
  { Icon: PhoneIcon,  title: 'Mobile First',    desc: 'Over 80% of customers browse on phones. Every site I build looks perfect on all screens.' },
];

export default memo(function WhyMe() {
  return (
    <section id="why" className="section" aria-labelledby="whyme-heading" style={{ background: '#fff' }}>
      <div className="container">
        <div className="whyme-grid">

          {/* Left copy */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="label" aria-hidden="true">Why Me</div>
            <h2 id="whyme-heading" className="display" style={{
              fontWeight: 800,
              fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
              lineHeight: 1.05, letterSpacing: '-0.03em',
              color: '#111', marginBottom: 20,
            }}>
              Why Choose<br /><span style={{ color: '#22c55e' }}>Sanjai?</span>
            </h2>
            <p style={{ fontSize: 15, color: '#666', lineHeight: 1.8, marginBottom: 32, maxWidth: 460 }}>
              I don't just build websites. I build tools that help your business grow. Every decision I make is focused on one thing — getting you more customers.
            </p>
            <a
              href="https://wa.me/919363265552?text=Hi Sanjai, I want to discuss my website project."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-dark"
              aria-label="Chat with Sanjai on WhatsApp to discuss your project"
            >
              Let's Talk
            </a>
          </motion.div>

          {/* Right cards */}
          <motion.div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}
            role="list"
            aria-label="Reasons to choose Sanjai"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {REASONS.map((r, i) => (
              <div
                key={i}
                role="listitem"
                style={{
                  background: '#fff',
                  border: '1.5px solid #e8e8e3',
                  borderRadius: 18,
                  padding: 'clamp(18px, 2.5vw, 26px)',
                  transition: 'box-shadow 0.25s ease, border-color 0.25s ease, transform 0.22s ease',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = '0 10px 36px rgba(0,0,0,0.09)';
                  el.style.borderColor = '#22c55e';
                  el.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = 'none';
                  el.style.borderColor = '#e8e8e3';
                  el.style.transform = 'translateY(0)';
                }}
              >
                <div className="icon-box" style={{ background: '#f5f5f0', color: '#111', marginBottom: 14, width: 44, height: 44, borderRadius: 12 }}>
                  <r.Icon />
                </div>
                <div className="display" style={{ fontWeight: 700, fontSize: 15, color: '#111', marginBottom: 7 }}>
                  {r.title}
                </div>
                <div style={{ fontSize: 13, color: '#888', lineHeight: 1.65 }}>
                  {r.desc}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
});
