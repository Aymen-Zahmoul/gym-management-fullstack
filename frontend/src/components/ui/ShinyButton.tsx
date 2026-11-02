import React, { useState } from 'react';

interface ShinyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  className?: string;
}

interface Ripple {
  x: number;
  y: number;
  id: number;
}

export const ShinyButton: React.FC<ShinyButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  onClick,
  ...props
}) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [isTwitching, setIsTwitching] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsTwitching(true);
    setTimeout(() => setIsTwitching(false), 150);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { x, y, id: Date.now() };

    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 500);

    if (onClick) {
      onClick(e);
    }
  };

  const baseStyles =
    'relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 overflow-hidden cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:bg-black dark:hover:bg-neutral-100 shadow-sm active:scale-95',
    secondary:
      'bg-transparent border border-neutral-300 dark:border-neutral-700/80 hover:border-neutral-900 dark:hover:border-neutral-200 text-neutral-900 dark:text-neutral-100 active:scale-95',
    outline:
      'bg-neutral-100/80 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white active:scale-95',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-sm',
    success:
      'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm',
  };

  return (
    <button
      onClick={handleClick}
      className={`${baseStyles} ${variants[variant]} ${
        isTwitching ? 'scale-95' : 'hover:scale-[1.01]'
      } ${className}`}
      {...props}
    >
      {/* Subtle light shimmer */}
      <div className="absolute inset-0 -translate-x-full hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

      {/* Ripple */}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute rounded-full bg-white/20 pointer-events-none animate-ping"
          style={{
            left: r.x - 10,
            top: r.y - 10,
            width: 20,
            height: 20,
          }}
        />
      ))}

      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
};
