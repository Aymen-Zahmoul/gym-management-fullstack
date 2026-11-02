import React, { useEffect, useState } from 'react';
import { animateCounter } from '../../utils/animeAnimations';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 900,
  prefix = '',
  suffix = '',
  decimals = 0,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    animateCounter(0, value, (current) => setCount(current), {
      duration,
      ease: 'outExpo',
    });
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {count.toLocaleString('fr-FR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
};
