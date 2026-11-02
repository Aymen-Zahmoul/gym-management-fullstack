import React from 'react';

interface HadidLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  showText?: boolean;
  layout?: 'horizontal' | 'stacked' | 'emblem-only';
  className?: string;
  onClick?: () => void;
}

export const HadidLogo: React.FC<HadidLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  showText = true,
  layout = 'horizontal',
  className = '',
  onClick,
}) => {
  const sizeMap = {
    sm: { img: 'h-8 sm:h-9', text: 'text-sm', sub: 'text-[9px]' },
    md: { img: 'h-10 sm:h-12', text: 'text-base sm:text-lg', sub: 'text-[10px]' },
    lg: { img: 'h-14 sm:h-16', text: 'text-xl sm:text-2xl', sub: 'text-xs' },
    xl: { img: 'h-24 sm:h-28', text: 'text-2xl sm:text-3xl', sub: 'text-xs' },
  };

  const current = sizeMap[size];

  // 1. Emblem Only — Perfectly Centered or Standalone
  if (layout === 'emblem-only') {
    return (
      <div
        onClick={onClick}
        className={`relative inline-flex items-center justify-center ${current.img} select-none ${
          onClick ? 'cursor-pointer hover:scale-105 transition-transform duration-300' : ''
        } ${className}`}
      >
        <img
          src="/hadid-logo.jpg"
          alt="HADID حديد"
          className="h-full w-auto object-contain mix-blend-multiply dark:mix-blend-screen dark:invert filter contrast-125"
        />
      </div>
    );
  }

  // 2. Stacked — Vertically Centered Symmetry (Ideal for Login, Hero, Portals)
  if (layout === 'stacked') {
    return (
      <div
        onClick={onClick}
        className={`flex flex-col items-center justify-center text-center select-none ${
          onClick ? 'cursor-pointer group' : ''
        } ${className}`}
      >
        <div className={`relative flex items-center justify-center ${current.img} group-hover:scale-105 transition-transform duration-300`}>
          <img
            src="/hadid-logo.jpg"
            alt="HADID حديد"
            className="h-full w-auto object-contain mix-blend-multiply dark:mix-blend-screen dark:invert filter contrast-125"
          />
        </div>

        {showText && (
          <div className="mt-3 flex flex-col items-center text-center">
            <div className="flex items-baseline justify-center gap-2">
              <span className={`font-black tracking-[0.24em] uppercase text-neutral-950 dark:text-white leading-none ${current.text}`}>
                HADID
              </span>
              <span className="text-bronze font-semibold text-xs sm:text-sm tracking-wider font-sans">
                حديد
              </span>
            </div>
            {showSubtitle && (
              <span className={`text-neutral-400 font-mono tracking-[0.25em] uppercase mt-1.5 ${current.sub}`}>
                Byrsa Sanctuary • Tunis
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  // 3. Horizontal — Classic Header / Navbar Lockup (Default)
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3.5 select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
    >
      <div className={`relative flex items-center justify-center ${current.img} group-hover:scale-105 transition-transform duration-300 flex-shrink-0`}>
        <img
          src="/hadid-logo.jpg"
          alt="HADID حديد"
          className="h-full w-auto object-contain mix-blend-multiply dark:mix-blend-screen dark:invert filter contrast-125"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <span className={`font-black tracking-[0.24em] uppercase text-neutral-950 dark:text-white leading-none ${current.text}`}>
              HADID
            </span>
            <span className="text-bronze font-semibold text-xs sm:text-sm tracking-wider font-sans">
              حديد
            </span>
          </div>
          {showSubtitle && (
            <span className={`text-neutral-400 font-mono tracking-[0.25em] uppercase mt-1 ${current.sub}`}>
              Byrsa Sanctuary • Tunis
            </span>
          )}
        </div>
      )}
    </div>
  );
};
