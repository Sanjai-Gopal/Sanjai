import React, { memo, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
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

/* ═══════════════════════════════════════════════════
   PREMIUM 3D PROJECT CARD
═══════════════════════════════════════════════════ */
const ProjectCard = memo(({ p, index }: { p: typeof PROJECTS[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [7, -7]), {
    stiffness: 180,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-7, 7]), {
    stiffness: 180,
    damping: 20,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <motion.article
      ref={cardRef}
      aria-label={`${p.title} — ${p.cat} — Result: ${p.result}`}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.88) 100%)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: 26,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.5)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: `
          0 4px 24px rgba(0,0,0,0.04),
          0 1px 4px rgba(0,0,0,0.03),
          inset 0 1px 0 rgba(255,255,255,0.8)
        `,
        rotateX,
        rotateY,
        transformPerspective: 850,
        transformStyle: 'preserve-3d',
      }}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0.5);
        mouseY.set(0.5);
      }}
      whileHover={{ y: -10, scale: 1.02 }}
    >
      {/* Ambient glow */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: -8,
          borderRadius: 'inherit',
          background: 'radial-gradient(circle, rgba(34,197,94,0.1), transparent 70%)',
          filter: 'blur(22px)',
          opacity: isHovered ? 1 : 0,
          pointerEvents: 'none',
          transition: 'opacity 0.35s ease',
          zIndex: -1,
        }}
      />

      {/* Image section */}
      <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', background: '#f5f5f0', flexShrink: 0 }}>
        <motion.div
          style={{ width: '100%', height: '100%', overflow: 'hidden' }}
          animate={{ scale: isHovered ? 1.04 : 1 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
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
        </motion.div>

        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.12) 0%, transparent 32%)', pointerEvents: 'none' }} aria-hidden="true" />

        {/* Light sweep animation */}
        {isHovered && (
          <motion.div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
            }}
            initial={{ transform: 'translateX(-100%)' }}
            animate={{ transform: 'translateX(100%)' }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
          />
        )}

        {/* Category badge */}
        <div style={{ position: 'absolute', top: 14, left: 14 }}>
          <span style={{
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            color: '#444',
            fontSize: 11,
            fontWeight: 700,
            padding: '5px 12px',
            borderRadius: 99,
            letterSpacing: '0.02em',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: '1px solid rgba(255,255,255,0.5)',
          }}>
            {p.cat}
          </span>
        </div>

        {/* Result badge */}
        <motion.div
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: 99,
            padding: '5px 12px',
            fontSize: 11,
            fontWeight: 700,
            color: '#15803d',
            boxShadow: '0 2px 10px rgba(34,197,94,0.15)',
          }}
          whileHover={{ scale: 1.05 }}
        >
          <TrendingUp size={11} aria-hidden="true" />
          {p.result}
        </motion.div>
      </div>

      {/* Content section */}
      <div style={{ padding: 'clamp(20px, 2.5vw, 28px)', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <motion.div
          className="display"
          style={{ fontWeight: 800, fontSize: 18, color: '#111', marginBottom: 10, letterSpacing: '-0.01em' }}
          animate={{ x: isHovered ? 4 : 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          {p.title}
        </motion.div>
        <p style={{ fontSize: 13, color: '#666', lineHeight: 1.75, marginBottom: 16, flexGrow: 1 }}>{p.desc}</p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
          {p.tags.map(t => (
            <span key={t} style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '5px 12px',
              borderRadius: 99,
              background: 'linear-gradient(135deg, #f5f5f0 0%, #e8e8e3 100%)',
              color: '#444',
              fontSize: 11,
              fontWeight: 600,
              border: '1px solid rgba(255,255,255,0.5)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              {t}
            </span>
          ))}
        </div>

        {/* Link */}
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: 16 }}>
          <motion.a
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              fontWeight: 700,
              color: '#111',
              transition: 'color 0.2s ease',
            }}
            whileHover={{ x: 4 }}
          >
            <ExternalLink size={12} aria-hidden="true" />
            <span style={{
              background: 'linear-gradient(90deg, #111 0%, transparent 100%)',
              backgroundSize: '100% 1px',
              backgroundPosition: '0 100%',
              backgroundRepeat: 'no-repeat',
            }}>
              View Live Site
            </span>
          </motion.a>
        </div>
      </div>
    </motion.article>
  );
});

export default memo(function Projects() {
  return (
    <section id="projects" className="section" aria-labelledby="projects-heading" style={{ background: '#f2f2ee', position: 'relative', overflow: 'hidden' }}>
      <ProjectsBg />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: 'clamp(40px, 5vw, 60px)' }}
        >
          <div className="label" aria-hidden="true">Portfolio</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 18 }}>
            <h2 id="projects-heading" className="display" style={{ fontWeight: 800, fontSize: 'clamp(2rem, 4.5vw, 3.4rem)', lineHeight: 1.05, letterSpacing: '-0.03em', color: '#111' }}>
              Real Results,<br /><span style={{ color: '#22c55e' }}>Real Businesses</span>
            </h2>
            <p style={{ fontSize: 14, color: '#666', maxWidth: 360, lineHeight: 1.75 }}>Every project is custom-built to match the business's brand and goals.</p>
          </div>
        </motion.div>

        <div className="grid-3" style={{ perspective: 1100 }}>
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} p={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
});
