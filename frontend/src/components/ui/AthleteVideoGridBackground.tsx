import React, { useEffect, useRef } from 'react';

interface AthleteClip {
  id: string;
  number: string;
  title: string;
  athlete: string;
  discipline: string;
  src: string;
}

const ATHLETE_CLIPS: AthleteClip[] = [
  {
    id: 'bodybuilding',
    number: '01',
    title: 'BODYBUILDING',
    athlete: 'CBum Style Set',
    discipline: 'Série Répétitive • Haltères & Poitrine',
    src: '/videos/bodybuilding.mp4',
  },
  {
    id: 'boxing',
    number: '02',
    title: 'BOXING',
    athlete: 'Boxer Combos',
    discipline: 'Frappes Ciblées • Sac & Ring',
    src: '/videos/boxing.mp4',
  },
  {
    id: 'running',
    number: '03',
    title: 'RUNNING',
    athlete: 'Sprint Piste',
    discipline: 'Cardio Vitesse & Foulée Continue',
    src: '/videos/running.mp4',
  },
  {
    id: 'swimming',
    number: '04',
    title: 'SWIMMING',
    athlete: 'Nageur Pro',
    discipline: 'Endurance Aquatique & Mouvement Répétitif',
    src: '/videos/swimming.mp4',
  },
];

export const AthleteVideoGridBackground: React.FC = () => {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    // Explicit trigger to ensure reliable, silent, uninterrupted loop across all browsers
    videoRefs.current.forEach((video) => {
      if (!video) return;
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('loop', '');
      video.setAttribute('autoplay', '');

      const startPlayback = () => {
        video.play().catch(() => {
          // Autoplay fallback silently handled
        });
      };

      if (video.readyState >= 2) {
        startPlayback();
      } else {
        video.addEventListener('loadeddata', startPlayback, { once: true });
      }
    });
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-neutral-950 select-none"
    >
      {/* 1. 4-Box Athlete Kinetic Grid (2x2 on mobile/tablet, 4 vertical columns on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 w-full h-full">
        {ATHLETE_CLIPS.map((clip, index) => (
          <div
            key={clip.id}
            className="relative w-full h-full overflow-hidden border-r border-b border-white/[0.08] bg-neutral-900"
          >
            {/* Background Looping Athlete Video */}
            <video
              ref={(el) => {
                videoRefs.current[index] = el;
              }}
              src={clip.src}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              onEnded={(e) => {
                e.currentTarget.currentTime = 0;
                e.currentTarget.play().catch(() => {});
              }}
              className="w-full h-full object-cover filter brightness-[0.82] contrast-125 transition-transform duration-1000 scale-[1.02]"
            />

            {/* Individual Tile Depth Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/60 pointer-events-none" />

            {/* Corner Badge with Athlete Discipline info */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/65 backdrop-blur-md border border-white/10 text-[9px] font-mono tracking-wider text-neutral-300 shadow-sm">
              <span className="text-[#c5a880] font-bold">{clip.number}</span>
              <span className="opacity-40">/</span>
              <span className="font-semibold uppercase tracking-widest text-white">{clip.title}</span>
            </div>

            {/* Bottom Live Loop Status */}
            <div className="absolute bottom-3 right-3 hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-md border border-white/10 text-[8px] font-mono tracking-widest uppercase text-neutral-400 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>LOOP</span>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Global Vignette & Scrim: guarantees that the central Login/SignUp Card has 100% legibility */}
      <div className="absolute inset-0 bg-black/55 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(12,13,16,0.6)_0%,_rgba(12,13,16,0.92)_100%)] pointer-events-none" />

      {/* 3. Subtle Warm Bronze Light in the Center behind the Card */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(176,120,69,0.14)_0%,_transparent_60%)] pointer-events-none" />

      {/* 4. Architectural Fine Grid Lines */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  );
};
