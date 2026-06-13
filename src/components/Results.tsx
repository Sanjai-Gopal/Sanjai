import React, { memo } from 'react';
import { motion } from 'motion/react';
import { ResultsBg } from './BackgroundElements';

const NUMBERS = [
  { v: '10+',  l: 'Websites Launched'   },
  { v: '100%', l: 'Client Satisfaction' },
  { v: '7',    l: 'Days Avg. Delivery'  },
  { v: '₹2K+', l: 'Saved vs Agencies'  },
];

const LOGOS = [
  'Sanjai Restaurant', 'Noir Elite', 'Sanjai Estates',
  'Vilas Salon', 'Aurelie Bistro', 'Velora Coffee',
];

export default memo(function Results() {
  return (
    <section aria-labelledby="results-heading" style={{ background: '#fff', padding: 'clamp(56px, 7vw, 80px) 0' }}>
      <div className="container">
        <h2 id="results-heading" className="sr-only">Results and social proof</h2>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55 }}
        >
          {/* Stats row */}
          <div className="results-grid" style={{ marginBottom: 'clamp(40px, 6vw, 60px)' }}>
            {NUMBERS.map((n, i) => (
              <div
                key={i}
                style={{
                  textAlign: 'center',
                  padding: 'clamp(24px, 4vw, 40px) 16px',
                  borderRadius: 20,
                  background: '#f9f9f7',
                  border: '1.5px solid #e8e8e3',
                }}
              >
                <div className="display" style={{
                  fontWeight: 800,
                  fontSize: 'clamp(2.2rem, 5.5vw, 3.8rem)',
                  color: '#111',
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                  marginBottom: 8,
                }}>
                  {n.v}
                </div>
                <div style={{
                  fontSize: 'clamp(11px, 1.5vw, 13px)', fontWeight: 600, color: '#aaa',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                }}>
                  {n.l}
                </div>
              </div>
            ))}
          </div>

          {/* Client strip */}
          <div style={{
            borderTop: '1px solid #f0f0ea',
            paddingTop: 'clamp(28px, 4vw, 40px)',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 12, color: '#bbb', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>
              Trusted by businesses across Tamil Nadu
            </p>
            <div
              style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px 28px' }}
              role="list"
              aria-label="Client businesses"
            >
              {LOGOS.map((l, i) => (
                <span
                  key={i}
                  role="listitem"
                  className="display"
                  style={{
                    fontSize: 'clamp(13px, 2vw, 16px)',
                    fontWeight: 700,
                    color: '#ccc',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});
