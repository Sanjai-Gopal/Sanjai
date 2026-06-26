import React, { memo, useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';

/* ═══════════════════════════════════════════════════
   PREMIUM GLASS CARD
   Awwwards-quality floating glass card with 3D tilt
═══════════════════════════════════════════════════ */

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  tiltStrength?: number;
  glowColor?: string;
  hoverScale?: number;
}

export const GlassCard = memo(({
  children,
  className = '',
  style = {},
  tiltStrength = 8,
  glowColor = 'rgba(34, 197, 94, 0.15)',
  hoverScale = 1.02,
}: GlassCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [tiltStrength, -tiltStrength]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-tiltStrength, tiltStrength]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      ref={cardRef}
      className={className}
      style={{
        ...style,
        rotateX,
        rotateY,
        transformPerspective: 1200,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        scale: hoverScale,
        y: -8,
        transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Ambient glow layer */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: -2,
          borderRadius: 'inherit',
          background: `radial-gradient(circle at 50% 50%, ${glowColor}, transparent 70%)`,
          opacity: isHovered ? 1 : 0,
          filter: 'blur(20px)',
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />

      {/* Glass surface */}
      <div
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.5)',
          borderRadius: 'inherit',
          boxShadow: `
            0 4px 24px rgba(0,0,0,0.06),
            0 1px 2px rgba(0,0,0,0.04),
            inset 0 1px 0 rgba(255,255,255,0.8),
            inset 0 -1px 0 rgba(0,0,0,0.02)
          `,
          overflow: 'hidden',
        }}
      >
        {/* Inner highlight */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '30%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Moving gradient on hover */}
        <motion.div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(34,197,94,0.06), transparent 40%)`,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
          }}
        />

        {children}
      </div>
    </motion.div>
  );
});

/* ═══════════════════════════════════════════════════
   PREMIUM DARK GLASS CARD
═══════════════════════════════════════════════════ */

export const DarkGlassCard = memo(({
  children,
  className = '',
  style = {},
  tiltStrength = 8,
  glowColor = 'rgba(34, 197, 94, 0.25)',
}: GlassCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [tiltStrength, -tiltStrength]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-tiltStrength, tiltStrength]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <motion.div
      ref={cardRef}
      className={className}
      style={{
        ...style,
        rotateX,
        rotateY,
        transformPerspective: 1200,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0.5);
        mouseY.set(0.5);
      }}
      whileHover={{ scale: 1.02, y: -6 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Glow */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: -4,
          borderRadius: 'inherit',
          background: `radial-gradient(circle at 50% 50%, ${glowColor}, transparent 60%)`,
          opacity: isHovered ? 1 : 0.5,
          filter: 'blur(24px)',
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />

      <div
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, rgba(17,17,17,0.95) 0%, rgba(30,30,30,0.9) 100%)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 'inherit',
          boxShadow: `
            0 8px 32px rgba(0,0,0,0.3),
            0 2px 8px rgba(0,0,0,0.2),
            inset 0 1px 0 rgba(255,255,255,0.06),
            inset 0 -1px 0 rgba(0,0,0,0.2)
          `,
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </motion.div>
  );
});

/* ═══════════════════════════════════════════════════
   FLOATING 3D SPHERE
═══════════════════════════════════════════════════ */

interface FloatingSphereProps {
  size: number;
  color?: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  blur?: number;
  opacity?: number;
  animate?: boolean;
  delay?: number;
}

export const FloatingSphere = memo(({
  size,
  color = 'rgba(34, 197, 94, 0.3)',
  top,
  left,
  right,
  bottom,
  blur = 40,
  opacity = 1,
  animate = true,
  delay = 0,
}: FloatingSphereProps) => {
  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: size,
        height: size,
        top,
        left,
        right,
        bottom,
        borderRadius: '50%',
        background: `radial-gradient(circle at 30% 30%, ${color}, transparent 70%)`,
        filter: `blur(${blur}px)`,
        opacity,
        pointerEvents: 'none',
        willChange: 'transform',
      }}
      animate={animate ? {
        y: [0, -30, 10, -20, 0],
        scale: [1, 1.05, 0.95, 1.02, 1],
      } : undefined}
      transition={{
        duration: 20,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
});

/* ═══════════════════════════════════════════════════
   MESH GRADIENT - Aurora-like animated background
═══════════════════════════════════════════════════ */

export const MeshGradient = memo(({
  colors = ['rgba(34,197,94,0.15)', 'rgba(16,185,129,0.1)', 'rgba(5,150,105,0.08)'],
  animate = true,
}: {
  colors?: string[];
  animate?: boolean;
}) => {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          width: '150%',
          height: '150%',
          top: '-25%',
          left: '-25%',
        }}
        animate={animate ? {
          rotate: [0, 360],
        } : undefined}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {/* Blob 1 */}
        <motion.div
          style={{
            position: 'absolute',
            width: '60%',
            height: '60%',
            top: '10%',
            left: '10%',
            borderRadius: '50%',
            background: `radial-gradient(ellipse at center, ${colors[0]}, transparent 70%)`,
            filter: 'blur(60px)',
          }}
          animate={{
            x: [0, 50, -30, 20, 0],
            y: [0, -40, 30, -20, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {/* Blob 2 */}
        <motion.div
          style={{
            position: 'absolute',
            width: '50%',
            height: '50%',
            top: '40%',
            right: '10%',
            borderRadius: '50%',
            background: `radial-gradient(ellipse at center, ${colors[1]}, transparent 70%)`,
            filter: 'blur(50px)',
          }}
          animate={{
            x: [0, -40, 30, -20, 0],
            y: [0, 30, -20, 40, 0],
          }}
          transition={{
            duration: 30,
            delay: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {/* Blob 3 */}
        <motion.div
          style={{
            position: 'absolute',
            width: '40%',
            height: '40%',
            bottom: '10%',
            left: '30%',
            borderRadius: '50%',
            background: `radial-gradient(ellipse at center, ${colors[2]}, transparent 70%)`,
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, 30, -20, 10, 0],
            y: [0, -20, 30, -10, 0],
          }}
          transition={{
            duration: 35,
            delay: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
    </div>
  );
});

/* ═══════════════════════════════════════════════════
   AURORA LIGHT BEAM
═══════════════════════════════════════════════════ */

export const AuroraBeam = memo(({
  color = 'rgba(34,197,94,0.3)',
  width = 300,
  angle = -45,
  top = '20%',
  left = '-10%',
}: {
  color?: string;
  width?: number;
  angle?: number;
  top?: string;
  left?: string;
}) => {
  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top,
        left,
        width,
        height: '200%',
        background: `linear-gradient(${angle}deg, transparent, ${color}, transparent)`,
        transform: `rotate(${angle}deg)`,
        transformOrigin: 'top left',
        filter: 'blur(30px)',
        pointerEvents: 'none',
        opacity: 0.6,
      }}
      animate={{
        opacity: [0.4, 0.7, 0.4],
        x: [0, 50, 0],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
});

/* ═══════════════════════════════════════════════════
   FLOATING RING - 3D rotating ring
═══════════════════════════════════════════════════ */

export const FloatingRing = memo(({
  size = 200,
  color = 'rgba(34,197,94,0.2)',
  top,
  left,
  right,
  bottom,
  thickness = 2,
}: {
  size?: number;
  color?: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  thickness?: number;
}) => {
  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: size,
        height: size,
        top,
        left,
        right,
        bottom,
        borderRadius: '50%',
        border: `${thickness}px solid ${color}`,
        boxShadow: `0 0 40px ${color}, inset 0 0 40px ${color}`,
        pointerEvents: 'none',
        willChange: 'transform',
      }}
      animate={{
        rotate: [0, 360],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 25,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
});

/* ═══════════════════════════════════════════════════
   FLOATING CUBE - 3D rotating cube
═══════════════════════════════════════════════════ */

export const FloatingCube = memo(({
  size = 80,
  color = 'rgba(34,197,94,0.15)',
  top,
  left,
}: {
  size?: number;
  color?: string;
  top?: string;
  left?: string;
}) => {
  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: size,
        height: size,
        top,
        left,
        transformStyle: 'preserve-3d',
        transformPerspective: 800,
        pointerEvents: 'none',
      }}
      animate={{
        rotateX: [0, 360],
        rotateY: [0, 360],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {/* Front */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: color,
          border: `1px solid rgba(34,197,94,0.3)`,
          transform: `translateZ(${size / 2}px)`,
          backdropFilter: 'blur(4px)',
        }}
      />
      {/* Back */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: color,
          border: `1px solid rgba(34,197,94,0.3)`,
          transform: `translateZ(-${size / 2}px) rotateY(180deg)`,
          backdropFilter: 'blur(4px)',
        }}
      />
      {/* Left */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: color,
          border: `1px solid rgba(34,197,94,0.3)`,
          transform: `translateX(-${size / 2}px) rotateY(-90deg)`,
          transformOrigin: 'center left',
          backdropFilter: 'blur(4px)',
        }}
      />
      {/* Right */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: color,
          border: `1px solid rgba(34,197,94,0.3)`,
          transform: `translateX(${size / 2}px) rotateY(90deg)`,
          transformOrigin: 'center right',
          backdropFilter: 'blur(4px)',
        }}
      />
    </motion.div>
  );
});

/* ═══════════════════════════════════════════════════
   GRAIN NOISE OVERLAY
═══════════════════════════════════════════════════ */

export const GrainNoise = memo(({ opacity = 0.03 }: { opacity?: number }) => {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity,
        mixBlendMode: 'overlay',
      }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
});

/* ═══════════════════════════════════════════════════
   FLOATING IMAGE - 3D image with hover tilt
═══════════════════════════════════════════════════ */

interface FloatingImageProps {
  src: string;
  srcSet?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export const FloatingImage = memo(({
  src,
  srcSet,
  alt,
  width = 400,
  height = 400,
  className = '',
}: FloatingImageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [8, -8]), {
    stiffness: 200,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-8, 8]), {
    stiffness: 200,
    damping: 25,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <motion.div
      ref={containerRef}
      className={className}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0.5);
        mouseY.set(0.5);
      }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Shadow layer */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '20px -20px',
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.25) 0%, transparent 70%)',
          filter: 'blur(30px)',
          transform: 'translateZ(-50px)',
          pointerEvents: 'none',
        }}
      />

      {/* Image container */}
      <div
        style={{
          position: 'relative',
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: `
            0 25px 50px rgba(0,0,0,0.15),
            0 10px 20px rgba(0,0,0,0.1),
            inset 0 1px 0 rgba(255,255,255,0.3)
          `,
          border: '1px solid rgba(255,255,255,0.2)',
        }}
      >
        {/* Inner glow */}
        <motion.div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {srcSet ? (
          <picture>
            <source srcSet={srcSet} type="image/webp" />
            <img
              src={src}
              alt={alt}
              width={width}
              height={height}
              loading="lazy"
              decoding="async"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </picture>
        ) : (
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading="lazy"
            decoding="async"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        )}
      </div>
    </motion.div>
  );
});

/* ═══════════════════════════════════════════════════
   PREMIUM BUTTON - Glass button with glow
═══════════════════════════════════════════════════ */

interface PremiumButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'glass' | 'green';
  className?: string;
  style?: React.CSSProperties;
}

export const PremiumButton = memo(({
  children,
  href,
  onClick,
  variant = 'primary',
  className = '',
  style = {},
}: PremiumButtonProps) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springX = useSpring(useTransform(mouseX, [0, 1], [-3, 3]), {
    stiffness: 200,
    damping: 20,
  });
  const springY = useSpring(useTransform(mouseY, [0, 1], [-3, 3]), {
    stiffness: 200,
    damping: 20,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const variants: Record<string, { bg: string; color: string; border: string; glow: string }> = {
    primary: {
      bg: 'linear-gradient(135deg, #111 0%, #222 100%)',
      color: '#fff',
      border: 'rgba(255,255,255,0.1)',
      glow: 'rgba(0,0,0,0.3)',
    },
    secondary: {
      bg: 'transparent',
      color: '#111',
      border: '#111',
      glow: 'rgba(17,17,17,0.2)',
    },
    glass: {
      bg: 'rgba(255,255,255,0.08)',
      color: '#fff',
      border: 'rgba(255,255,255,0.15)',
      glow: 'rgba(255,255,255,0.1)',
    },
    green: {
      bg: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
      color: '#fff',
      border: 'rgba(34,197,94,0.3)',
      glow: 'rgba(34,197,94,0.4)',
    },
  };

  const v = variants[variant];

  const content = (
    <motion.div
      ref={buttonRef}
      className={className}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '14px 28px',
        borderRadius: 99,
        fontSize: 15,
        fontWeight: 600,
        fontFamily: 'inherit',
        cursor: 'pointer',
        textDecoration: 'none',
        background: v.bg,
        color: v.color,
        border: `1.5px solid ${v.border}`,
        boxShadow: `
          0 4px 16px ${v.glow},
          inset 0 1px 0 rgba(255,255,255,0.1)
        `,
        x: springX,
        y: springY,
        overflow: 'hidden',
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0.5);
        mouseY.set(0.5);
      }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Glow effect */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: -2,
          borderRadius: 'inherit',
          background: `radial-gradient(circle at 50% 50%, ${v.glow}, transparent 70%)`,
          filter: 'blur(8px)',
          opacity: isHovered ? 1 : 0,
          pointerEvents: 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Light sweep */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          transform: 'translateX(-100%)',
        }}
        animate={isHovered ? { transform: 'translateX(100%)' } : { transform: 'translateX(-100%)' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />

      {children}
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit' }}>
      {content}
    </button>
  );
});

/* ═══════════════════════════════════════════════════
   PERSPECTIVE GRID
═══════════════════════════════════════════════════ */

export const PerspectiveGrid = memo(({
  color = 'rgba(34,197,94,0.08)',
  size = 60,
  perspective = 1000,
}: {
  color?: string;
  size?: number;
  perspective?: number;
}) => {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        perspective,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformStyle: 'preserve-3d',
          transform: `perspective(${perspective}px) rotateX(60deg) translateY(-50%)`,
          transformOrigin: 'center center',
          height: '200%',
        }}
      >
        <svg
          width="100%"
          height="100%"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          <defs>
            <pattern id="perspective-grid" width={size} height={size} patternUnits="userSpaceOnUse">
              <path d={`M ${size} 0 L 0 0 0 ${size}`} fill="none" stroke={color} strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#perspective-grid)" />
        </svg>
      </div>
    </div>
  );
});

/* ═══════════════════════════════════════════════════
   FLOATING ICON
═══════════════════════════════════════════════════ */

export const FloatingIcon = memo(({
  icon,
  size = 48,
  bgSize = 64,
  bgColor = 'rgba(34,197,94,0.1)',
  iconColor = '#22c55e',
  glow = true,
}: {
  icon: React.ReactNode;
  size?: number;
  bgSize?: number;
  bgColor?: string;
  iconColor?: string;
  glow?: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      style={{
        width: bgSize,
        height: bgSize,
        borderRadius: 16,
        background: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxShadow: glow ? `0 0 ${isHovered ? 30 : 20}px rgba(34,197,94,0.2)` : undefined,
        transition: 'box-shadow 0.3s ease',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div style={{ fontSize: size, color: iconColor, display: 'flex' }}>
        {icon}
      </div>
    </motion.div>
  );
});

/* ═══════════════════════════════════════════════════
   LIGHT SWEEP ANIMATION
═══════════════════════════════════════════════════ */

export const LightSweep = memo(({ trigger }: { trigger: boolean }) => {
  return (
    <AnimatePresence>
      {trigger && (
        <motion.div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
            pointerEvents: 'none',
          }}
          initial={{ transform: 'translateX(-100%)' }}
          animate={{ transform: 'translateX(100%)' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
      )}
    </AnimatePresence>
  );
});

/* ═══════════════════════════════════════════════════
   DEPTH LAYERS COMPONENT
═══════════════════════════════════════════════════ */

export const DepthLayers = memo(({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ position: 'relative', transformStyle: 'preserve-3d', perspective: 1200 }}>
      {children}
    </div>
  );
});

export default function Premium3DElements() { return null; }
