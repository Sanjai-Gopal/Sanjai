import React, { memo } from 'react';
import { motion } from 'motion/react';
import { ProjectsBg } from './BackgroundElements';
import { TrendingUp, ExternalLink } from 'lucide-react';

const PROJECTS = [
  { id: 'p1', title: 'Sanjai Restaurant',    cat: 'Restaurant',   desc: 'Full website with digital menu, photo gallery, and online table booking system. Helped the client get 40% more walk-ins.',   tags: ['Website Design','Digital Menu','Booking System'], img: 'sanjai_restaurant_3d_1779609123912', result: '+40% Walk-ins',   href: 'https://sanjai-restaurant.vercel.app/'   },
  { id: 'p2', title: 'Noir Elite Barbershop',cat: 'Salon',         desc: 'Dark-themed site with appointment booking, stylist profiles, and service pricing. Their calendar filled in week one.',        tags: ['Website Design','Appointment Booking'],            img: 'noir_elite_3d_1779609143469',        result: 'Fully Booked',    href: 'https://noir-elite.vercel.app/'          },
  { id: 'p3', title: 'Sanjai Estates',       cat: 'Real Estate',  desc: 'Property listing platform with search filters, virtual tour links, and lead capture forms. Tripled their enquiries.',        tags: ['Website Design','Lead Capture','Listings'],        img: 'sanjai_estates_3d_1779609159297',    result: '3× Enquiries',    href: 'https://sanjai-estates.vercel.app/'      },
  { id: 'p4', title: 'Vilas Luxury Salon',   cat: 'Beauty Salon', desc: 'Elegant website with service menu, before/after gallery, and WhatsApp booking integration. Doubled appointments.',           tags: ['Website Design','WhatsApp Booking'],               img: 'vilas_salon_3d_1779609174443',       result: '2× Appointments', href: 'https://vilas-luxury-salon.vercel.app/'  },
  { id: 'p5', title: 'Aurelie Restaurant',   cat: 'Café',         desc: 'Premium café website with digital menu, Instagram feed integration, and loyalty program signup page.',                       tags: ['Website Design','Digital Menu','Integration'],     img: 'aurelie_bistro_3d_1779609193458',    result: '+60% Orders',     href: 'https://aurelie-restaurant.vercel.app/' },
  { id: 'p6', title: 'Velora Coffee',        cat: 'Coffee Shop',  desc: 'Warm, inviting website with online menu, store locator map, and newsletter subscription for promotions.',                    tags: ['Website Design','Online Menu'],                    img: 'velora_coffee_3d_1779609208836',     result: '500+ Subscribers',href: 'https://velora-coffee.vercel.app/'       },
];

const ProjectCard = memo(({ p }: { p: typeof PROJECTS[0] }) => (
  <article
    aria-label={`${p.title} — ${p.cat} — Result: ${p.result}`}
    style={{
      background: '#fff', borderRadius: 20, overflow: 'hidden',
      border: '1.5px solid #e8e8e3', display: 'flex', flexDirection: 'column',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
    }}
    onMouseEnter={e => {
      const el = e.currentTarget as HTMLElement;
      el.style.transform = 'translateY(-5px)';
      el.style.boxShadow = '0 16px 48px rgba(0,0,0,0.11)';
    }}
    onMouseLeave={e => {
      const el = e.currentTarget as HTMLElement;
      el.style.transform = 'translateY(0)';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
    }}
  >
    <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', background: '#f0f0ec', flexShrink: 0 }}>
      <picture>
        <source
          srcSet={`/images/${p.img}-400.webp 400w, /images/${p.img}-800.webp 800w`}
          type="image/webp"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
        />
        <img
          src={`/images/${p.img}.jpg`}
          alt={`${p.title} — website screenshot`}
          loading="lazy"
          decoding="async"
          width="800"
          height="500"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </picture>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.18) 0%, transparent 40%)', pointerEvents: 'none' }} aria-hidden="true" />
      <div style={{ position: 'absolute', top: 12, left: 12 }}>
        <span style={{ background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', color: '#444', fontSize: 11, fontWeight: 700, padding: '4px 11px', borderRadius: 99, letterSpacing: '0.02em' }}>{p.cat}</span>
      </div>
      <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', alignItems: 'center', gap: 4, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 99, padding: '4px 10px', fontSize: 11, fontWeight: 700, color: '#15803d' }}>
        <TrendingUp size={10} aria-hidden="true" />{p.result}
      </div>
    </div>
    <div style={{ padding: 'clamp(18px, 2.5vw, 24px)', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <div className="display" style={{ fontWeight: 800, fontSize: 17, color: '#111', marginBottom: 8 }}>{p.title}</div>
      <p style={{ fontSize: 13, color: '#777', lineHeight: 1.7, marginBottom: 14, flexGrow: 1 }}>{p.desc}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 16 }}>
        {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
      </div>
      <div style={{ borderTop: '1px solid #f0f0ea', paddingTop: 14 }}>
        <a
          href={p.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: '#111', transition: 'color 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#22c55e'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#111'; }}
          aria-label={`View live website for ${p.title}`}
        >
          <ExternalLink size={11} aria-hidden="true" />View Live Site
        </a>
      </div>
    </div>
  </article>
));

export default memo(function Projects() {
  return (
    <section id="projects" className="section" aria-labelledby="projects-heading" style={{ background: '#f2f2ee' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: 'clamp(36px, 5vw, 56px)' }}
        >
          <div className="label" aria-hidden="true">Portfolio</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <h2 id="projects-heading" className="display" style={{ fontWeight: 800, fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', lineHeight: 1.05, letterSpacing: '-0.03em', color: '#111' }}>
              Real Results,<br /><span style={{ color: '#22c55e' }}>Real Businesses</span>
            </h2>
            <p style={{ fontSize: 15, color: '#777', maxWidth: 340, lineHeight: 1.75 }}>Every project is custom-built to match the business's brand and goals.</p>
          </div>
        </motion.div>

        <motion.div
          className="grid-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          {PROJECTS.map(p => <ProjectCard key={p.id} p={p} />)}
        </motion.div>
      </div>
    </section>
  );
});
