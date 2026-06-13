import React, { useState, useEffect, useCallback, useRef, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';

// Lazy-load all below-fold sections
const About        = lazy(() => import('./components/About'));
const Services     = lazy(() => import('./components/Services'));
const Results      = lazy(() => import('./components/Results'));
const Projects     = lazy(() => import('./components/Projects'));
const WhyMe        = lazy(() => import('./components/WhyMe'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const CTA          = lazy(() => import('./components/CTA'));
const Contact      = lazy(() => import('./components/Contact'));

const SectionFallback = () => <div className="section-placeholder" aria-hidden="true" />;

const WA_ICON = (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="white" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const SECTIONS = ['home', 'about', 'services', 'projects', 'why', 'testimonials', 'contact'];

function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let rafId: number;
    const fn = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
        if (barRef.current) barRef.current.style.width = `${pct}%`;
      });
    };
    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => { window.removeEventListener('scroll', fn); cancelAnimationFrame(rafId); };
  }, []);
  return (
    <div
      ref={barRef}
      className="scroll-progress"
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
}

function useActiveSection() {
  const [active, setActive] = useState('home');
  useEffect(() => {
    let rafId: number;
    const fn = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const y = window.scrollY + window.innerHeight * 0.38;
        for (const id of SECTIONS) {
          const el = document.getElementById(id);
          if (el && y >= el.offsetTop && y < el.offsetTop + el.offsetHeight) {
            setActive(prev => prev === id ? prev : id);
            break;
          }
        }
      });
    };
    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => { window.removeEventListener('scroll', fn); cancelAnimationFrame(rafId); };
  }, []);
  return active;
}

function LazySection({ children, id }: { children: React.ReactNode; id?: string }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin: '200px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} id={id} style={{ minWidth: 0, width: '100%', overflowX: 'hidden' }}>
      {visible
        ? <Suspense fallback={<SectionFallback />}>{children}</Suspense>
        : <SectionFallback />
      }
    </div>
  );
}

export default function App() {
  const active = useActiveSection();

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }
  }, []);

  return (
    <div style={{ background: '#f2f2ee', minHeight: '100vh', overflowX: 'hidden', width: '100%' }}>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <ScrollProgress />
      <Navbar active={active} onNavigate={scrollTo} />

      <main id="main-content" style={{ overflowX: 'hidden', width: '100%' }}>
        {/* Hero loads eagerly */}
        <div id="home" style={{ overflowX: 'hidden' }}>
          <Hero onDown={() => scrollTo('about')} />
        </div>

        <LazySection id="about-wrapper"><About /></LazySection>
        <LazySection><Services /></LazySection>
        <LazySection><Results /></LazySection>
        <LazySection><Projects /></LazySection>
        <LazySection><WhyMe /></LazySection>
        <LazySection><Testimonials /></LazySection>
        <LazySection><CTA /></LazySection>
        <LazySection><Contact /></LazySection>
      </main>

      <a
        href="https://wa.me/919363265552?text=Hi Sanjai, I need a website!"
        target="_blank"
        rel="noopener noreferrer"
        className="float-wa"
        aria-label="Chat on WhatsApp"
      >
        {WA_ICON}
      </a>
    </div>
  );
}
