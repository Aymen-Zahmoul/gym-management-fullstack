import React, { useEffect, useRef } from 'react';

interface LiveBackgroundProps {
  particleCount?: number;
  interactive?: boolean;
}

export const LiveBackground: React.FC<LiveBackgroundProps> = ({
  particleCount = 42,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse coordinates for gentle interactive attraction
    const mouse = { x: -1000, y: -1000, active: false };
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const handleMouseLeave = () => {
      mouse.active = false;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Generate Luxury Kinetic Particles (Bronze #B07845 and Silver #A8A9AD)
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseAlpha: number;
      color: string;
      pulseSpeed: number;
      pulseOffset: number;
    }

    const particles: Particle[] = [];
    const colors = [
      'rgba(176, 120, 69, ',  // Bronze #B07845
      'rgba(203, 178, 150, ', // Warm Gold/Light Bronze #CBB296
      'rgba(168, 169, 173, ', // Metallic Silver #A8A9AD
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.8 + 0.8,
        baseAlpha: Math.random() * 0.4 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulseSpeed: 0.02 + Math.random() * 0.03,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    let tick = 0;

    const render = () => {
      tick += 1;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle ambient pulsing light at center-top
      const pulseAura = Math.sin(tick * 0.015) * 0.03 + 0.08;
      const gradient = ctx.createRadialGradient(
        width * 0.5,
        height * 0.35,
        20,
        width * 0.5,
        height * 0.35,
        width * 0.55
      );
      gradient.addColorStop(0, `rgba(176, 120, 69, ${pulseAura})`);
      gradient.addColorStop(0.5, 'rgba(176, 120, 69, 0.02)');
      gradient.addColorStop(1, 'rgba(16, 16, 16, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Connect nearby particles with refined architectural hairline links
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 120;

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.14;
            ctx.strokeStyle = `rgba(176, 120, 69, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // 3. Update & render particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries smoothly
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Gentle cursor push/pull
        if (mouse.active) {
          const mdx = mouse.x - p.x;
          const mdy = mouse.y - p.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 140 && mdist > 0) {
            const force = (1 - mdist / 140) * 0.6;
            p.x -= (mdx / mdist) * force;
            p.y -= (mdy / mdist) * force;
          }
        }

        // Particle rendering with subtle breathing opacity
        const alpha = p.baseAlpha + Math.sin(tick * p.pulseSpeed + p.pulseOffset) * 0.15;
        ctx.fillStyle = `${p.color}${Math.max(0.05, alpha)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleCount, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full opacity-70 dark:opacity-85"
      style={{ display: 'block' }}
    />
  );
};
