import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface HeatmapCell {
  day: string;
  hour: string;
  intensity: number; // 0 to 4
  count: number;
}

export const BklitPeakHourHeatmap: React.FC = () => {
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const hours = ['08h', '10h', '12h', '14h', '16h', '18h', '20h'];

  const data: HeatmapCell[] = [
    // Lundi
    { day: 'Lun', hour: '08h', intensity: 2, count: 18 },
    { day: 'Lun', hour: '10h', intensity: 1, count: 10 },
    { day: 'Lun', hour: '12h', intensity: 3, count: 28 },
    { day: 'Lun', hour: '14h', intensity: 1, count: 12 },
    { day: 'Lun', hour: '16h', intensity: 2, count: 22 },
    { day: 'Lun', hour: '18h', intensity: 4, count: 42 },
    { day: 'Lun', hour: '20h', intensity: 3, count: 30 },
    // Mardi
    { day: 'Mar', hour: '08h', intensity: 2, count: 16 },
    { day: 'Mar', hour: '10h', intensity: 1, count: 11 },
    { day: 'Mar', hour: '12h', intensity: 3, count: 26 },
    { day: 'Mar', hour: '14h', intensity: 1, count: 9 },
    { day: 'Mar', hour: '16h', intensity: 3, count: 25 },
    { day: 'Mar', hour: '18h', intensity: 4, count: 44 },
    { day: 'Mar', hour: '20h', intensity: 2, count: 24 },
    // Mercredi
    { day: 'Mer', hour: '08h', intensity: 2, count: 19 },
    { day: 'Mer', hour: '10h', intensity: 2, count: 15 },
    { day: 'Mer', hour: '12h', intensity: 3, count: 32 },
    { day: 'Mer', hour: '14h', intensity: 2, count: 18 },
    { day: 'Mer', hour: '16h', intensity: 3, count: 29 },
    { day: 'Mer', hour: '18h', intensity: 4, count: 46 },
    { day: 'Mer', hour: '20h', intensity: 3, count: 28 },
    // Jeudi
    { day: 'Jeu', hour: '08h', intensity: 1, count: 14 },
    { day: 'Jeu', hour: '10h', intensity: 1, count: 10 },
    { day: 'Jeu', hour: '12h', intensity: 2, count: 22 },
    { day: 'Jeu', hour: '14h', intensity: 1, count: 8 },
    { day: 'Jeu', hour: '16h', intensity: 2, count: 21 },
    { day: 'Jeu', hour: '18h', intensity: 4, count: 39 },
    { day: 'Jeu', hour: '20h', intensity: 2, count: 20 },
    // Vendredi
    { day: 'Ven', hour: '08h', intensity: 2, count: 17 },
    { day: 'Ven', hour: '10h', intensity: 1, count: 12 },
    { day: 'Ven', hour: '12h', intensity: 3, count: 27 },
    { day: 'Ven', hour: '14h', intensity: 1, count: 10 },
    { day: 'Ven', hour: '16h', intensity: 3, count: 28 },
    { day: 'Ven', hour: '18h', intensity: 4, count: 48 },
    { day: 'Ven', hour: '20h', intensity: 3, count: 32 },
    // Samedi
    { day: 'Sam', hour: '08h', intensity: 1, count: 12 },
    { day: 'Sam', hour: '10h', intensity: 3, count: 34 },
    { day: 'Sam', hour: '12h', intensity: 4, count: 45 },
    { day: 'Sam', hour: '14h', intensity: 3, count: 26 },
    { day: 'Sam', hour: '16h', intensity: 3, count: 30 },
    { day: 'Sam', hour: '18h', intensity: 2, count: 22 },
    { day: 'Sam', hour: '20h', intensity: 1, count: 14 },
    // Dimanche
    { day: 'Dim', hour: '08h', intensity: 1, count: 8 },
    { day: 'Dim', hour: '10h', intensity: 3, count: 31 },
    { day: 'Dim', hour: '12h', intensity: 3, count: 33 },
    { day: 'Dim', hour: '14h', intensity: 2, count: 16 },
    { day: 'Dim', hour: '16h', intensity: 2, count: 19 },
    { day: 'Dim', hour: '18h', intensity: 1, count: 11 },
    { day: 'Dim', hour: '20h', intensity: 0, count: 6 },
  ];

  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null);

  const getCellColor = (intensity: number) => {
    switch (intensity) {
      case 4:
        return 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 shadow-sm';
      case 3:
        return 'bg-neutral-600 dark:bg-neutral-300';
      case 2:
        return 'bg-neutral-400 dark:bg-neutral-500';
      case 1:
        return 'bg-neutral-200 dark:bg-white/[0.15]';
      default:
        return 'bg-neutral-100 dark:bg-white/[0.04]';
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between text-xs">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.18em] text-neutral-500 dark:text-neutral-400 block">
            Matrice d'Affluence
          </span>
          <h3 className="text-base font-bold text-neutral-900 dark:text-white uppercase tracking-tight mt-0.5">
            Densité d'Occupation Hebdomadaire
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
          <span>Calme</span>
          <span className="w-2.5 h-2.5 rounded-sm bg-neutral-100 dark:bg-white/[0.04]" />
          <span className="w-2.5 h-2.5 rounded-sm bg-neutral-200 dark:bg-white/[0.15]" />
          <span className="w-2.5 h-2.5 rounded-sm bg-neutral-400 dark:bg-neutral-500" />
          <span className="w-2.5 h-2.5 rounded-sm bg-neutral-600 dark:bg-neutral-300" />
          <span className="w-2.5 h-2.5 rounded-sm bg-neutral-900 dark:bg-white" />
          <span>Pic</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-1">
        <div className="min-w-[420px]">
          {/* Header hours */}
          <div className="grid grid-cols-8 gap-1.5 mb-1.5 text-center text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
            <div />
            {hours.map((h) => (
              <div key={h}>{h}</div>
            ))}
          </div>

          {/* Rows by day */}
          {days.map((day) => (
            <div key={day} className="grid grid-cols-8 gap-1.5 items-center mb-1.5">
              <span className="text-[10px] font-mono uppercase text-neutral-500 text-right pr-2">{day}</span>
              {hours.map((hour) => {
                const cell = data.find((d) => d.day === day && d.hour === hour) || {
                  day,
                  hour,
                  intensity: 0,
                  count: 0,
                };
                return (
                  <div
                    key={`${day}-${hour}`}
                    onMouseEnter={() => setHoveredCell(cell)}
                    onMouseLeave={() => setHoveredCell(null)}
                    className={`h-7 rounded-lg transition-transform duration-200 cursor-pointer hover:scale-105 border border-neutral-200/40 dark:border-white/[0.04] ${getCellColor(
                      cell.intensity
                    )}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Tooltip feedback */}
      <div className="min-h-[32px] flex items-center justify-between text-xs px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/[0.06]">
        {hoveredCell ? (
          <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
            <span className="font-bold text-neutral-900 dark:text-white uppercase text-[11px]">
              {hoveredCell.day} à {hoveredCell.hour} :
            </span>
            <span className="font-mono font-semibold">{hoveredCell.count} sportifs en séance</span>
            <span className="text-[10px] text-neutral-400 font-light">
              ({hoveredCell.intensity === 4 ? 'Heure de pointe maximale' : hoveredCell.intensity >= 2 ? 'Affluence modérée' : 'Idéal pour s’entraîner au calme'})
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 text-[11px] font-light">
            <Info className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
            <span>Survolez une cellule pour consulter la télémétrie horaire des studios.</span>
          </div>
        )}
      </div>
    </div>
  );
};
