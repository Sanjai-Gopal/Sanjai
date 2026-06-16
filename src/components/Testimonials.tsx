import React, { memo } from 'react';
import { motion } from 'motion/react';
import { TestimonialsBg } from './BackgroundElements';

const StarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="#f59e0b" aria-hidden="true">
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
    name: 'Likitha Sanjai', biz: "Likitha's Café",             loc: 'Trichy, TN',
    text: 'Affordable, fast, and high quality. Sanjai was always available to answer my questions and made the whole process stress-free. 10/10.',
    init: 'MK', color: '#f43f5e',
  },
];

function Stars({ label }: { label?: string }) {
  return (
    <div style={{ display: 'flex', gap: 3 }} role="img" aria-label={label ?? '5 out of 5 stars'}>
      {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
    </div>
  );
}

export default memo(function Testimonials() {
  return (
    <section id="testimonials" aria-labelledby="testimonials-heading" className="section" style={{ background: '#f2f2ee' }}>
      <div className="container">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: 'clamp(36px, 5vw, 52px)' }}
        >
          <div className="label" aria-hidden="true">Reviews</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <h2 id="testimonials-heading" className="display" style={{
              fontWeight: 800,
              fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
              lineHeight: 1.05, letterSpacing: '-0.03em', color: '#111',
            }}>
              What Clients<br /><span style={{ color: '#22c55e' }}>Are Saying</span>
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Stars label="Average rating 4.9 out of 5" />
              <span style={{ fontSize: 14, color: '#666', fontWeight: 500 }}>4.9 / 5 average</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="grid-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          {TESTIMONIALS.map((t, i) => (
            <figure
              key={i}
              style={{
                background: '#fff',
                border: '1.5px solid #e8e8e3',
                borderRadius: 20,
                padding: 'clamp(22px, 3vw, 30px)',
                display: 'flex', flexDirection: 'column',
                transition: 'box-shadow 0.25s ease, transform 0.22s ease',
                margin: 0,
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = '0 10px 40px rgba(0,0,0,0.08)';
                el.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = 'none';
                el.style.transform = 'translateY(0)';
              }}
            >
              <Stars />
              <div aria-hidden="true" style={{
                fontSize: 52, lineHeight: 1, color: '#e8e8e3',
                fontFamily: 'Georgia, serif',
                marginTop: 6, marginBottom: -10,
                fontWeight: 400, userSelect: 'none',
              }}>
                "
              </div>
              <blockquote style={{ margin: 0, padding: 0, flexGrow: 1 }}>
                <p style={{
                  fontSize: 14, color: '#444', lineHeight: 1.78,
                  marginBottom: 24,
                  fontStyle: 'italic',
                }}>
                  {t.text}
                </p>
              </blockquote>
              <figcaption style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                  background: t.color + '15',
                  border: `2px solid ${t.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 800, color: t.color,
                  fontFamily: 'Bricolage Grotesque, sans-serif',
                }} aria-hidden="true">
                  {t.init}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>{t.biz} · {t.loc}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
});
