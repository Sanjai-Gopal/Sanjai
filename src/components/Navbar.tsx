import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowRight } from 'lucide-react';

const LINKS = [
  { id: 'services',     label: 'Services'  },
  { id: 'projects',     label: 'Portfolio' },
  { id: 'why',          label: 'Why Me'    },
  { id: 'testimonials', label: 'Reviews'   },
  { id: 'contact',      label: 'Contact'   },
];

interface NavbarProps {
  active: string;
  onNavigate: (id: string) => void;
}

const WaSvg = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default memo(function Navbar({ active, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let rafId: number;
    const fn = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setScrolled(window.scrollY > 40));
    };
    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => { window.removeEventListener('scroll', fn); cancelAnimationFrame(rafId); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener('resize', fn, { passive: true });
    return () => window.removeEventListener('resize', fn);
  }, []);

  const go = useCallback((id: string) => {
    setOpen(false);
    setTimeout(() => onNavigate(id), 60);
  }, [onNavigate]);

  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [open]);

  return (
    <>
      <header
        role="banner"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: scrolled
            ? 'linear-gradient(135deg, rgba(242,242,238,0.94) 0%, rgba(250,250,248,0.92) 100%)'
            : 'rgba(242,242,238,0.5)',
          backdropFilter: scrolled ? 'blur(24px)' : 'blur(8px)',
          WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'blur(8px)',
          borderBottom: scrolled
            ? '1px solid rgba(34,197,94,0.08)'
            : '1px solid transparent',
          boxShadow: scrolled
            ? '0 4px 24px rgba(0,0,0,0.04), 0 1px 4px rgba(0,0,0,0.02)'
            : 'none',
          transition: 'background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
        }}
      >
        <div style={{
          width: '100%',
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 clamp(16px, 3vw, 48px)',
          height: 68,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          boxSizing: 'border-box',
        }}>
          {/* Logo */}
          <motion.button
            onClick={() => go('home')}
            style={{
              fontSize: 23,
              fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
              fontWeight: 800,
              color: '#111',
              letterSpacing: '-0.04em',
              lineHeight: 1,
              padding: 0,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              flexShrink: 0,
              position: 'relative',
            }}
            aria-label="Go to home"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            sanjai
            <motion.span
              aria-hidden="true"
              style={{
                position: 'absolute',
                bottom: -4,
                left: 0,
                width: '100%',
                height: 2,
                background: 'linear-gradient(90deg, #22c55e, transparent)',
                borderRadius: 2,
              }}
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>

          {/* Desktop nav */}
          <nav
            aria-label="Primary navigation"
            className="navbar-desktop"
            style={{
              display: 'none',
              alignItems: 'center',
              gap: 3,
              borderRadius: 99,
              padding: '6px',
              background: scrolled
                ? 'rgba(255,255,255,0.7)'
                : 'rgba(255,255,255,0.5)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              flexShrink: 0,
              margin: '0 auto',
              boxShadow: scrolled
                ? '0 2px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.5)'
                : '0 1px 4px rgba(0,0,0,0.02)',
              border: '1px solid rgba(255,255,255,0.4)',
            }}
          >
            {LINKS.map(l => (
              <motion.button
                key={l.id}
                onClick={() => go(l.id)}
                style={{
                  background: active === l.id
                    ? 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)'
                    : 'transparent',
                  color: active === l.id ? '#fff' : '#555',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: 99,
                  padding: '8px 18px',
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  whiteSpace: 'nowrap',
                  lineHeight: 1,
                  transition: 'background 0.2s ease, color 0.2s ease',
                  boxShadow: active === l.id
                    ? '0 2px 8px rgba(0,0,0,0.15)'
                    : 'none',
                }}
                whileHover={{ scale: active === l.id ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-current={active === l.id ? 'page' : undefined}
              >
                {l.label}
              </motion.button>
            ))}
          </nav>

          {/* CTA button */}
          <motion.a
            href="https://wa.me/919363265552?text=Hi Sanjai, I need a website!"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-cta"
            style={{
              display: 'none',
              padding: '11px 22px',
              fontSize: 13,
              flexShrink: 0,
              marginLeft: 'auto',
              borderRadius: 99,
              background: 'linear-gradient(135deg, #111 0%, #222 100%)',
              color: '#fff',
              fontWeight: 600,
              fontFamily: 'inherit',
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 3px 12px rgba(0,0,0,0.15)',
            }}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            Book a Call
          </motion.a>

          {/* Mobile menu button */}
          <motion.button
            onClick={() => setOpen(v => !v)}
            className="navbar-burger"
            style={{
              width: 44,
              height: 44,
              background: open
                ? 'rgba(255,255,255,0.8)'
                : 'rgba(255,255,255,0.5)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              color: '#111',
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: 99,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginLeft: 'auto',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X size={20} strokeWidth={2.5} /> : <Menu size={20} strokeWidth={2.5} />}
          </motion.button>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 49,
              background: 'linear-gradient(135deg, #f2f2ee 0%, #fafaf8 50%, #f5f5f0 100%)',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Top bar */}
            <div style={{
              maxWidth: 1200,
              margin: '0 auto',
              padding: '0 clamp(16px, 3vw, 40px)',
              height: 68,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(34,197,94,0.08)',
              flexShrink: 0,
              width: '100%',
              boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}>
              <span style={{
                fontSize: 23,
                fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
                fontWeight: 800,
                color: '#111',
                letterSpacing: '-0.04em',
              }}>sanjai</span>
              <motion.button
                onClick={() => setOpen(false)}
                style={{
                  width: 44,
                  height: 44,
                  background: 'rgba(255,255,255,0.9)',
                  border: '1px solid rgba(255,255,255,0.5)',
                  borderRadius: 99,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#111',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Close menu"
              >
                <X size={20} strokeWidth={2.5} />
              </motion.button>
            </div>

            {/* Nav items */}
            <nav
              style={{
                maxWidth: 1200,
                margin: '0 auto',
                padding: '36px clamp(16px, 3vw, 40px)',
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'center',
                gap: 6,
                width: '100%',
                boxSizing: 'border-box',
              }}
              aria-label="Mobile navigation"
            >
              {LINKS.map((l, i) => (
                <motion.button
                  key={l.id}
                  onClick={() => go(l.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    textAlign: 'left',
                    border: 'none',
                    cursor: 'pointer',
                    background: 'transparent',
                    borderRadius: 18,
                    padding: '20px 22px',
                    fontFamily: 'inherit',
                  }}
                  initial={{ opacity: 0, x: 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.05, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ background: 'rgba(34,197,94,0.06)' }}
                  aria-current={active === l.id ? 'page' : undefined}
                >
                  <span style={{
                    fontSize: 'clamp(26px, 7vw, 40px)',
                    fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
                    fontWeight: 800,
                    color: active === l.id ? '#22c55e' : '#111',
                    letterSpacing: '-0.03em',
                    lineHeight: 1.1,
                  }}>
                    {l.label}
                  </span>
                  <ArrowRight
                    size={20}
                    style={{ color: active === l.id ? '#22c55e' : '#ccc', flexShrink: 0 }}
                    aria-hidden="true"
                  />
                </motion.button>
              ))}
            </nav>

            {/* Bottom CTA */}
            <motion.div
              style={{
                maxWidth: 1200,
                margin: '0 auto',
                padding: '0 clamp(16px, 3vw, 40px) 44px',
                flexShrink: 0,
                width: '100%',
                boxSizing: 'border-box',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <motion.a
                href="https://wa.me/919363265552"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '18px',
                  borderRadius: 18,
                  background: 'linear-gradient(135deg, #111 0%, #222 100%)',
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  textDecoration: 'none',
                  boxShadow: '0 5px 20px rgba(0,0,0,0.18)',
                }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <WaSvg /> Book a Free Call
              </motion.a>
              <p style={{ textAlign: 'center', marginTop: 14, fontSize: 12, color: '#888' }}>
                Replies within 2 hours · Salem, TN
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});
