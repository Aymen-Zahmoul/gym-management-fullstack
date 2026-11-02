import React from 'react';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  from?: string;
  via?: string;
  to?: string;
  animate?: boolean;
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  className = '',
  from = 'from-neutral-950 dark:from-white',
  via,
  to = 'to-neutral-500 dark:to-neutral-400',
  animate = false,
}) => {
  return (
    <span
      className={`inline-block text-transparent bg-clip-text bg-gradient-to-r ${from} ${
        via ? via : ''
      } ${to} ${animate ? 'animate-gradient bg-[length:200%_auto]' : ''} ${className}`}
    >
      {children}
    </span>
  );
};
