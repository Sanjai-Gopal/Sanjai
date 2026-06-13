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
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    let rafId: number;
    const fn = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setScrolled(window.scrollY > 50));
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
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          background: scrolled ? 'rgba(242,242,238,0.96)' : '#f2f2ee',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0,0,0,0.07)' : '1px solid transparent',
          transition: 'background 0.35s ease, border-color 0.35s ease',
        }}
      >
        <div style={{
          width: '100%', maxWidth: 1200, margin: '0 auto',
          padding: '0 clamp(16px, 3vw, 48px)',
          height: 64, display: 'flex', alignItems: 'center', gap: 8,
          boxSizing: 'border-box',
        }}>
          <button
            onClick={() => go('home')}
            style={{ fontSize: 22, fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontWeight: 800, color: '#111', letterSpacing: '-0.04em', lineHeight: 1, padding: 0, background: 'transparent', border: 'none', cursor: 'pointer', flexShrink: 0 }}
            aria-label="Go to home"
          >
            sanjai
          </button>

          <nav
            aria-label="Primary navigation"
            className="navbar-desktop"
            style={{ display: 'none', alignItems: 'center', gap: 2, borderRadius: 99, padding: '5px', background: '#e8e8e3', flexShrink: 0, margin: '0 auto' }}
          >
            {LINKS.map(l => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                style={{
                  background: active === l.id ? '#111' : 'transparent',
                  color: active === l.id ? '#fff' : '#666',
                  border: 'none', cursor: 'pointer', borderRadius: 99,
                  padding: '7px 14px', fontSize: 13, fontWeight: 600,
                  fontFamily: 'inherit', whiteSpace: 'nowrap',
                  transition: 'background 0.18s ease, color 0.18s ease', lineHeight: 1,
                }}
                aria-current={active === l.id ? 'page' : undefined}
                onMouseEnter={e => { if (active !== l.id) (e.currentTarget as HTMLElement).style.color = '#111'; }}
                onMouseLeave={e => { if (active !== l.id) (e.currentTarget as HTMLElement).style.color = '#666'; }}
              >
                {l.label}
              </button>
            ))}
          </nav>

          <a
            href="https://wa.me/919363265552?text=Hi Sanjai, I need a website!"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-cta btn btn-dark"
            style={{ display: 'none', padding: '10px 20px', fontSize: 13, flexShrink: 0, marginLeft: 'auto' }}
          >
            Book a Call
          </a>

          <button
            onClick={() => setOpen(v => !v)}
            className="navbar-burger"
            style={{
              width: 40, height: 40,
              background: open ? '#e8e8e3' : 'transparent',
              color: '#111', border: 'none', borderRadius: 99,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, marginLeft: 'auto', transition: 'background 0.2s ease',
            }}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X size={20} strokeWidth={2.5} /> : <Menu size={20} strokeWidth={2.5} />}
          </button>
        </div>
      </header>

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
            transition={{ type: 'tween', duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'fixed', inset: 0, zIndex: 49, background: '#f2f2ee', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{
              maxWidth: 1200, margin: '0 auto',
              padding: '0 clamp(16px, 3vw, 40px)',
              height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              borderBottom: '1px solid rgba(0,0,0,0.06)', flexShrink: 0, width: '100%',
              boxSizing: 'border-box',
            }}>
              <span style={{ fontSize: 22, fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontWeight: 800, color: '#111', letterSpacing: '-0.04em' }}>sanjai</span>
              <button
                onClick={() => setOpen(false)}
                style={{ width: 40, height: 40, background: '#e8e8e3', border: 'none', borderRadius: 99, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111' }}
                aria-label="Close menu"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            <nav
              style={{
                maxWidth: 1200, margin: '0 auto',
                padding: '32px clamp(16px, 3vw, 40px)',
                display: 'flex', flexDirection: 'column', flex: 1,
                justifyContent: 'center', gap: 4, width: '100%',
                boxSizing: 'border-box',
              }}
              aria-label="Mobile navigation"
            >
              {LINKS.map((l, i) => (
                <motion.button
                  key={l.id}
                  onClick={() => go(l.id)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer',
                    background: 'transparent', borderRadius: 16, padding: '18px 20px',
                    fontFamily: 'inherit',
                  }}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.05, ease: [0.16, 1, 0.3, 1] }}
                  aria-current={active === l.id ? 'page' : undefined}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.04)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <span style={{
                    fontSize: 'clamp(24px, 7vw, 36px)',
                    fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
                    fontWeight: 800,
                    color: active === l.id ? '#22c55e' : '#111',
                    letterSpacing: '-0.03em', lineHeight: 1.1,
                  }}>
                    {l.label}
                  </span>
                  <ArrowRight size={20} style={{ color: active === l.id ? '#22c55e' : '#ccc', flexShrink: 0 }} aria-hidden="true" />
                </motion.button>
              ))}
            </nav>

            <motion.div
              style={{
                maxWidth: 1200, margin: '0 auto',
                padding: '0 clamp(16px, 3vw, 40px) 40px',
                flexShrink: 0, width: '100%',
                boxSizing: 'border-box',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <a
                href="https://wa.me/919363265552"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-dark"
                style={{ fontSize: 16, borderRadius: 16, width: '100%', justifyContent: 'center', display: 'flex' }}
              >
                <WaSvg /> Book a Free Call
              </a>
              <p style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: '#aaa' }}>Replies within 2 hours · Salem, TN</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});
