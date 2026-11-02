import React, { useState } from 'react';

interface BklitBarChartProps {
  data: { day: string; count: number; capacity: number }[];
}

export const BklitBarChart: React.FC<BklitBarChartProps> = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const maxVal = Math.max(...data.map((d) => d.capacity), 25);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-neutral-500 font-light">
        <span className="text-[11px] uppercase tracking-wider text-neutral-400">
          Inscriptions en Direct vs Plafond Studio
        </span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider">
            <span className="w-2 h-2 rounded-sm bg-neutral-900 dark:bg-white" /> Inscrits
          </span>
          <span className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider">
            <span className="w-2 h-2 rounded-sm bg-neutral-200 dark:bg-white/[0.08]" /> Capacité Max
          </span>
        </div>
      </div>

      <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-neutral-100 dark:border-white/[0.06]">
        {data.map((item, idx) => {
          const heightPercent = Math.min(100, Math.round((item.count / maxVal) * 100));
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center gap-2.5 group relative cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip on hover */}
              {isHovered && (
                <div className="absolute -top-10 px-2.5 py-1 rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-[10px] font-mono font-bold whitespace-nowrap shadow-xl z-20 animate-in fade-in zoom-in-95">
                  {item.count} / {item.capacity} ({Math.round((item.count / item.capacity) * 100)}%)
                </div>
              )}

              {/* Bar container */}
              <div className="w-full max-w-[36px] h-36 bg-neutral-100 dark:bg-white/[0.04] rounded-lg flex items-end overflow-hidden border border-neutral-200/60 dark:border-white/[0.06] p-0.5">
                <div
                  className={`w-full rounded-md transition-all duration-500 ease-out ${
                    isHovered
                      ? 'bg-neutral-900 dark:bg-white shadow-md'
                      : 'bg-neutral-700 dark:bg-neutral-300'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>

              {/* Day label */}
              <span
                className={`text-[10px] font-mono uppercase tracking-wider transition-colors ${
                  isHovered ? 'text-neutral-900 dark:text-white font-bold' : 'text-neutral-400'
                }`}
              >
                {item.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
