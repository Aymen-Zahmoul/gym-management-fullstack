import React from 'react';

interface HadidLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
}

export const HadidLogo: React.FC<HadidLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  onClick,
}) => {
  const sizeMap = {
    sm: { img: 'h-8 sm:h-9', text: 'text-sm', sub: 'text-[9px]' },
    md: { img: 'h-10 sm:h-12', text: 'text-base sm:text-lg', sub: 'text-[10px]' },
    lg: { img: 'h-14 sm:h-16', text: 'text-xl sm:text-2xl', sub: 'text-xs' },
    xl: { img: 'h-20 sm:h-24', text: 'text-3xl sm:text-4xl', sub: 'text-sm' },
  };

  const current = sizeMap[size];

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
    >
      {/* Hadid Monogram — 100% Borderless, Floating Seamlessly in the Corner */}
      <div className={`relative flex items-center justify-center ${current.img} group-hover:scale-105 transition-transform duration-300`}>
        <img
          src="/hadid-logo.jpg"
          alt="HADID حديد"
          className="h-full w-auto object-contain mix-blend-multiply dark:mix-blend-screen dark:invert filter contrast-125"
        />
      </div>

      {/* Clean Typographic Lockup */}
      <div className="flex flex-col">
        <div className="flex items-baseline gap-2.5">
          <span className={`font-black tracking-[0.26em] uppercase text-neutral-950 dark:text-white leading-none ${current.text}`}>
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
    </div>
  );
};
