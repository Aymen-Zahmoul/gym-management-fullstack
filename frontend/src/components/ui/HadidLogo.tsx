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
    sm: { img: 'h-7 sm:h-8', textImg: 'h-4 sm:h-4.5', sub: 'text-[8px]' },
    md: { img: 'h-8 sm:h-9', textImg: 'h-4.5 sm:h-5', sub: 'text-[9px]' },
    lg: { img: 'h-12 sm:h-14', textImg: 'h-6 sm:h-7', sub: 'text-[11px]' },
    xl: { img: 'h-20 sm:h-24', textImg: 'h-10 sm:h-12', sub: 'text-xs' },
  };

  const current = sizeMap[size];

  // 1. Emblem Only — Standalone HD Mark
  if (layout === 'emblem-only') {
    return (
      <div
        onClick={onClick}
        className={`relative inline-flex items-center justify-center ${current.img} select-none ${
          onClick ? 'cursor-pointer hover:scale-105 transition-transform duration-300' : ''
        } ${className}`}
      >
        <img
          src="/hadid-emblem-light.png"
          alt="HADID حديد"
          className="h-full w-auto object-contain dark:hidden"
        />
        <img
          src="/hadid-emblem-dark.png"
          alt="HADID حديد"
          className="h-full w-auto object-contain hidden dark:block"
        />
      </div>
    );
  }

  // 2. Stacked — Vertically Centered Symmetry (Login, Hero, Portals)
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
            src="/hadid-logo-light.png"
            alt="HADID حديد"
            className="h-full w-auto object-contain dark:hidden"
          />
          <img
            src="/hadid-logo-dark.png"
            alt="HADID حديد"
            className="h-full w-auto object-contain hidden dark:block"
          />
        </div>

        {showText && showSubtitle && (
          <span className={`text-neutral-500 dark:text-neutral-400 font-mono tracking-[0.25em] uppercase mt-2 ${current.sub}`}>
            Byrsa Sanctuary • Tunis
          </span>
        )}
      </div>
    );
  }

  // 3. Horizontal — Classic Header / Navbar Lockup (Default)
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 sm:gap-3 select-none ${
        onClick ? 'cursor-pointer group' : ''
      } ${className}`}
    >
      <div className={`relative flex items-center justify-center ${current.img} group-hover:scale-105 transition-transform duration-300 flex-shrink-0`}>
        <img
          src="/hadid-emblem-light.png"
          alt="HADID حديد"
          className="h-full w-auto object-contain dark:hidden"
        />
        <img
          src="/hadid-emblem-dark.png"
          alt="HADID حديد"
          className="h-full w-auto object-contain hidden dark:block"
        />
      </div>

      {showText && (
        <div className="flex flex-col justify-center">
          <div className={`flex items-center ${current.textImg}`}>
            <img
              src="/hadid-wordmark-light.png"
              alt="HADID حديد"
              className="h-full w-auto object-contain dark:hidden"
            />
            <img
              src="/hadid-wordmark-dark.png"
              alt="HADID حديد"
              className="h-full w-auto object-contain hidden dark:block"
            />
          </div>
          {showSubtitle && (
            <span className={`hidden xl:inline text-neutral-500 dark:text-neutral-400 font-mono tracking-[0.22em] uppercase mt-0.5 ${current.sub}`}>
              Byrsa Sanctuary • Tunis
            </span>
          )}
        </div>
      )}
    </div>
  );
};
