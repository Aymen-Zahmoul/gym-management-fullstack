import React from 'react';

interface GridBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export const GridBackground: React.FC<GridBackgroundProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative w-full overflow-hidden transition-colors duration-500 ${className}`}>
      {/* 1. Multi-Color Architectural Ambient Glows (Breaks boring monochrome) */}
      {/* Top-Right: Warm Damascus Bronze Luminous Aura */}
      <div
        className="pointer-events-none fixed -top-32 -right-32 w-[650px] h-[650px] rounded-full blur-[140px] opacity-25 dark:opacity-30 z-0 transition-opacity duration-700"
        style={{
          background: 'radial-gradient(circle, #c5a880 0%, rgba(197, 168, 128, 0.4) 45%, transparent 70%)',
        }}
      />

      {/* Mid-Left: Mineral Sage Organic Aura (Wellness & Strength balance) */}
      <div
        className="pointer-events-none fixed top-[38%] -left-36 w-[550px] h-[550px] rounded-full blur-[150px] opacity-20 dark:opacity-25 z-0 transition-opacity duration-700"
        style={{
          background: 'radial-gradient(circle, #758a7b 0%, rgba(117, 138, 123, 0.35) 50%, transparent 75%)',
        }}
      />

      {/* Lower-Right: Burnished Ochre Kinetic Glow */}
      <div
        className="pointer-events-none fixed top-[70%] -right-28 w-[500px] h-[500px] rounded-full blur-[160px] opacity-15 dark:opacity-20 z-0 transition-opacity duration-700"
        style={{
          background: 'radial-gradient(circle, #c87a32 0%, rgba(200, 122, 50, 0.3) 50%, transparent 75%)',
        }}
      />

      {/* 2. Precision Architectural Hairline Grid with Elliptical Radial Mask */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-40 dark:opacity-25"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(197, 168, 128, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(197, 168, 128, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 90% 80% at 50% 30%, #000 40%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 30%, #000 40%, transparent 95%)',
        }}
      />

      {/* 3. Subtle Crosshair Coordinates (Engineering / CAD aesthetic) */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-15 dark:opacity-20 hidden md:block"
        style={{
          backgroundImage: `radial-gradient(circle, #c5a880 1px, transparent 1px)`,
          backgroundSize: '192px 192px',
          maskImage: 'radial-gradient(ellipse 85% 75% at 50% 40%, #000 30%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 75% at 50% 40%, #000 30%, transparent 90%)',
        }}
      />

      {/* Technical Blueprint Margin Stamp (Pure Architectural Flavor) */}
      <div className="pointer-events-none fixed bottom-6 left-8 z-0 hidden xl:flex items-center gap-3 text-[9px] font-mono tracking-[0.25em] uppercase text-neutral-400/40 dark:text-neutral-500/30">
        <span>HADID BYRSA • ARCHITECTURAL GRID</span>
        <span>•</span>
        <span>36.8528° N, 10.3233° E</span>
        <span>•</span>
        <span>ALT 65M</span>
      </div>

      {/* Page Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
