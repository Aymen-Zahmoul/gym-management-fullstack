import React from 'react';

interface BklitDonutChartProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  subLabel?: string;
  color?: string;
}

export const BklitDonutChart: React.FC<BklitDonutChartProps> = ({
  value,
  max,
  size = 140,
  strokeWidth = 10,
  label,
  subLabel,
  color,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-neutral-200 dark:stroke-white/[0.08] transition-colors"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color || 'currentColor'}
          className="text-neutral-900 dark:text-white transition-all duration-1000 ease-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-black font-mono text-neutral-900 dark:text-white tracking-tight">
          {label ?? `${percentage}%`}
        </span>
        {subLabel && (
          <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mt-0.5">
            {subLabel}
          </span>
        )}
      </div>
    </div>
  );
};
