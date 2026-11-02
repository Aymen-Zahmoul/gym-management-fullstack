import React from 'react';
import {
  Users,
  Dumbbell,
  Calendar,
  Banknote,
  Clock,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Award,
  Zap,
  UserCheck,
  Activity,
  Layers,
  AlertTriangle,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';
import type { DashboardStats, ClassSession, Member, MembershipPlan } from '../types';
import { SpotlightCard } from './ui/SpotlightCard';
import { AnimatedCounter } from './ui/AnimatedCounter';
import { ShinyButton } from './ui/ShinyButton';
import { BklitDonutChart } from './ui/BklitDonutChart';
import { BklitBarChart } from './ui/BklitBarChart';
import { BklitPeakHourHeatmap } from './ui/BklitPeakHourHeatmap';
import { useAnimeEntrance } from '../utils/animeAnimations';

interface DashboardViewProps {
  stats: DashboardStats | null;
  sessions: ClassSession[];
  members: Member[];
  plans?: MembershipPlan[];
  onNavigate: (tab: string) => void;
  onOpenBookingModal: (session: ClassSession) => void;
  onOpenQuickCheckIn?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  sessions,
  members,
  onNavigate,
  onOpenBookingModal,
  onOpenQuickCheckIn,
}) => {
  const containerRef = useAnimeEntrance<HTMLDivElement>('.anime-item', [stats, sessions.length, members.length]);

  const weeklyData = [
    { day: 'Lun', count: 18, capacity: 20 },
    { day: 'Mar', count: 14, capacity: 20 },
    { day: 'Mer', count: 20, capacity: 22 },
    { day: 'Jeu', count: 16, capacity: 20 },
    { day: 'Ven', count: 19, capacity: 20 },
    { day: 'Sam', count: 22, capacity: 25 },
    { day: 'Dim', count: 12, capacity: 18 },
  ];

  const totalOccupied = sessions.reduce((acc, s) => acc + (s.totalBookings ?? 0), 0);
  const totalCapacity = sessions.reduce((acc, s) => acc + (s.capaciteMax ?? 20), 0);
  const occupancyPercent = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

  // Unpaid analysis
  const unpaidMembers = members.filter(
    (m) => m.paymentStatut === 'NON_PAYE' || m.paymentStatut === 'EN_ATTENTE'
  );
  const unpaidCount = unpaidMembers.length;
  const unpaidTotalEstimate = unpaidMembers.reduce((acc, m) => acc + (m.lastPaymentAmount || 240), 0);

  return (
    <div ref={containerRef} className="space-y-8 pb-12 font-sans">
      {/* Architectural Header Banner */}
      <div className="anime-item relative overflow-hidden rounded-3xl border border-neutral-200/90 dark:border-white/[0.08] bg-white dark:bg-[#111215] p-8 sm:p-10 shadow-[0_4px_30px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_30px_-4px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full border border-bronze bg-bronze-subtle text-[10px] font-heading font-bold tracking-[0.2em] uppercase text-neutral-900 dark:text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880] animate-ping" />
              Supervision Opérationnelle • HADID Byrsa
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-neutral-900 dark:text-white tracking-tight uppercase">
              Tableau de Bord Exécutif
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-2xl font-light leading-relaxed">
              Supervision en direct de la fréquentation des 4 studios, du journal d'encaissements MySQL et du suivi rigoureux des cotisations adhérents.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onOpenQuickCheckIn && (
              <ShinyButton onClick={onOpenQuickCheckIn} variant="primary">
                <UserCheck className="w-4 h-4" />
                Pointage RFID
              </ShinyButton>
            )}
            <ShinyButton onClick={() => onNavigate('members')} variant="secondary">
              <Users className="w-4 h-4" />
              Fichier Adhérents
            </ShinyButton>
            <ShinyButton onClick={() => onNavigate('ledger')} variant="outline">
              <Banknote className="w-4 h-4" />
              Livre de Caisse
            </ShinyButton>
          </div>
        </div>
      </div>

      {/* Impayés Operational Alert Banner */}
      {unpaidCount > 0 && (
        <div className="anime-item rounded-3xl border border-[#f43f5e]/40 bg-gradient-to-r from-[#f43f5e]/15 via-[#f43f5e]/5 to-transparent p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(244,63,94,0.15)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#f43f5e]/20 border border-[#f43f5e]/40 flex items-center justify-center text-[#f43f5e] flex-shrink-0 animate-pulse-subtle">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <div className="font-heading font-black text-sm uppercase tracking-wider text-[#f43f5e] flex items-center gap-2">
                <span>Alerte Trésorerie & Recouvrement</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f43f5e] text-white font-mono">
                  {unpaidCount} dossiers
                </span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 font-light max-w-2xl">
                <strong className="text-neutral-900 dark:text-white font-semibold">
                  {unpaidMembers.map((m) => m.nomComplet).slice(0, 3).join(', ')}
                  {unpaidCount > 3 ? ` et ${unpaidCount - 3} autres` : ''}
                </strong> ont des règlements en attente ou impayés (~{unpaidTotalEstimate.toFixed(0)} TND).
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('members')}
            className="px-4 py-2.5 rounded-xl bg-[#f43f5e] text-white hover:bg-[#e11d48] text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shadow-sm self-end md:self-auto"
          >
            Voir les Impayés <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Cards — Multi-Color Architectural Hierarchy */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Damascus Bronze — Total Inscrits */}
        <SpotlightCard className="anime-item luxury-card p-6 border-[#c5a880]/30 shadow-[0_4px_20px_-4px_rgba(197,168,128,0.12)]">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-heading font-bold uppercase tracking-[0.18em] text-[#c5a880]">
                Membres Actifs
              </span>
              <div className="mt-2 text-3xl font-heading font-black text-neutral-900 dark:text-white tracking-tight">
                {stats ? <AnimatedCounter value={stats.totalMembers} /> : '—'}
              </div>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 font-light">
                <strong className="text-neutral-900 dark:text-white font-semibold">{stats?.activeMembers ?? 0}</strong> cotisations validées
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#c5a880]/15 border border-[#c5a880]/30 flex items-center justify-center text-[#c5a880]">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-white/[0.06] flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
            <span>HADID Byrsa</span>
            <span className="flex items-center gap-1.5 font-medium text-[#c5a880]">
              <ShieldCheck className="w-3.5 h-3.5" /> Synchronisé MySQL
            </span>
          </div>
        </SpotlightCard>

        {/* KPI 2: Mineral Sage — Recettes Encaissées */}
        <SpotlightCard className="anime-item luxury-card p-6 border-[#758a7b]/35 shadow-[0_4px_20px_-4px_rgba(117,138,123,0.12)]">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-heading font-bold uppercase tracking-[0.18em] text-[#758a7b] dark:text-[#a3b8a9]">
                Recettes Réglées
              </span>
              <div className="mt-2 text-3xl font-heading font-black text-neutral-900 dark:text-white tracking-tight">
                {stats ? <AnimatedCounter value={Number(stats.totalRevenue)} decimals={2} suffix=" TND" /> : '—'}
              </div>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 font-light">
                Journal de caisse certifié
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#758a7b]/15 border border-[#758a7b]/30 flex items-center justify-center text-[#758a7b]">
              <Banknote className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-white/[0.06] flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
            <span>Journal de caisse</span>
            <span className="flex items-center gap-1.5 font-medium text-[#758a7b] dark:text-[#a3b8a9]">
              <TrendingUp className="w-3.5 h-3.5" /> Clôturé
            </span>
          </div>
        </SpotlightCard>

        {/* KPI 3: Coral Crimson — Cotisations Impayées / En Attente */}
        <SpotlightCard className="anime-item luxury-card p-6 border-[#f43f5e]/35 shadow-[0_4px_20px_-4px_rgba(244,63,94,0.12)]">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-heading font-bold uppercase tracking-[0.18em] text-[#f43f5e]">
                Impayés & Attente
              </span>
              <div className="mt-2 text-3xl font-heading font-black text-neutral-900 dark:text-white tracking-tight">
                <AnimatedCounter value={unpaidCount} />
              </div>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 font-light">
                ~<strong className="text-[#f43f5e] font-semibold">{unpaidTotalEstimate.toFixed(0)} TND</strong> à encaisser
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#f43f5e]/15 border border-[#f43f5e]/30 flex items-center justify-center text-[#f43f5e]">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-white/[0.06] flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
            <span>Régularisation</span>
            <button
              onClick={() => onNavigate('members')}
              className="text-[#f43f5e] font-heading font-bold text-[10px] uppercase tracking-wider hover:underline flex items-center gap-1 cursor-pointer"
            >
              Régulariser <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </SpotlightCard>

        {/* KPI 4: Burnished Ochre — Séances & Studios */}
        <SpotlightCard className="anime-item luxury-card p-6 border-[#c87a32]/35 shadow-[0_4px_20px_-4px_rgba(200,122,50,0.12)]">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-heading font-bold uppercase tracking-[0.18em] text-[#c87a32]">
                Créneaux & Studios
              </span>
              <div className="mt-2 text-3xl font-heading font-black text-neutral-900 dark:text-white tracking-tight">
                {stats ? <AnimatedCounter value={stats.upcomingSessions} /> : '—'}
              </div>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 font-light">
                <strong className="text-neutral-900 dark:text-white font-semibold">{stats?.totalBookings ?? 0}</strong> réservations validées
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#c87a32]/15 border border-[#c87a32]/30 flex items-center justify-center text-[#c87a32]">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-white/[0.06] flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
            <span>Taux de présence</span>
            <span className="flex items-center gap-1.5 font-medium text-[#c87a32]">
              <Activity className="w-3.5 h-3.5" /> {occupancyPercent}% rempli
            </span>
          </div>
        </SpotlightCard>
      </div>

      {/* Visual Data Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Weekly Activity Bar Chart */}
        <SpotlightCard className="anime-item lg:col-span-2 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-heading font-bold tracking-[0.18em] text-[#c5a880]">
                Télémétrie
              </span>
              <h2 className="text-base font-heading font-bold text-neutral-900 dark:text-white uppercase tracking-tight">
                Fréquentation Hebdomadaire des Studios
              </h2>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 border border-neutral-200 dark:border-white/10 px-2.5 py-1 rounded-lg">
              Temps Réel
            </span>
          </div>
          <BklitBarChart data={weeklyData} />
        </SpotlightCard>

        {/* Chart 2: Circular Capacity Gauge */}
        <SpotlightCard className="anime-item p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-heading font-bold tracking-[0.18em] text-[#758a7b]">
                  Jauge Studios
                </span>
                <h2 className="text-base font-heading font-bold text-neutral-900 dark:text-white uppercase tracking-tight">
                  Taux d'Occupation
                </h2>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-[#758a7b] animate-ping" />
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light mb-6">
              Rapport global d'occupation des créneaux hebdomadaires enregistrés sur le serveur Java pur.
            </p>
          </div>

          <div className="flex justify-center py-4">
            <BklitDonutChart
              value={totalOccupied}
              max={totalCapacity > 0 ? totalCapacity : 100}
              size={160}
              strokeWidth={10}
              label={`${occupancyPercent}%`}
              subLabel="Taux Global"
              color="#c5a880"
            />
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-white/[0.06] text-xs text-neutral-500 flex items-center justify-between font-mono">
            <span>Inscrits : <strong className="text-neutral-900 dark:text-white font-bold">{totalOccupied}</strong></span>
            <span>Capacité : <strong className="text-neutral-900 dark:text-white font-bold">{totalCapacity}</strong></span>
          </div>
        </SpotlightCard>
      </div>

      {/* Heatmap Section */}
      <SpotlightCard className="anime-item p-6 sm:p-8">
        <BklitPeakHourHeatmap />
      </SpotlightCard>

      {/* Prochaines Séances & Derniers Adhérents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Séances */}
        <SpotlightCard className="anime-item lg:col-span-2 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/[0.06] pb-4">
            <div>
              <span className="text-[10px] uppercase font-heading font-bold tracking-[0.18em] text-[#c5a880]">
                Planning 7 Jours
              </span>
              <h2 className="text-base font-heading font-bold text-neutral-900 dark:text-white uppercase tracking-tight">
                Prochaines Séances Programmées
              </h2>
            </div>
            <button
              onClick={() => onNavigate('schedule')}
              className="text-xs font-heading font-semibold uppercase tracking-wider text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              Grille complète <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-white/[0.06]">
            {sessions.slice(0, 4).map((s) => {
              const booked = s.totalBookings ?? 0;
              const max = s.capaciteMax ?? 20;
              const percentage = Math.min(100, Math.round((booked / max) * 100));

              return (
                <div key={s.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-heading font-bold text-neutral-900 dark:text-white text-sm group-hover:text-[#c5a880] transition-colors">
                        {s.classTitle}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-white/[0.05] border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300">
                        {s.salle}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-neutral-500 font-light">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#c5a880]" />
                        {s.dateHeureDebut ? s.dateHeureDebut.replace('T', ' à ') : 'Date non définie'}
                      </span>
                      <span>Coach : <strong className="text-neutral-700 dark:text-neutral-300 font-normal">{s.coachName}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-28 text-right">
                      <div className="flex justify-between text-[11px] mb-1 font-mono text-neutral-500">
                        <span>Places</span>
                        <span className={percentage >= 90 ? 'text-[#c87a32] font-semibold' : 'text-neutral-700 dark:text-neutral-300'}>
                          {booked} / {max}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-neutral-100 dark:bg-white/[0.08] overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            percentage >= 90 ? 'bg-[#c87a32]' : 'bg-[#c5a880]'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    <ShinyButton
                      onClick={() => onOpenBookingModal(s)}
                      variant="outline"
                      className="py-1 px-3 text-xs"
                    >
                      Réserver
                    </ShinyButton>
                  </div>
                </div>
              );
            })}
          </div>
        </SpotlightCard>

        {/* Right: Derniers Adhérents with Status Tags */}
        <SpotlightCard className="anime-item p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/[0.06] pb-4">
            <div>
              <span className="text-[10px] uppercase font-heading font-bold tracking-[0.18em] text-[#c5a880]">
                Registre Adhérents
              </span>
              <h2 className="text-base font-heading font-bold text-neutral-900 dark:text-white uppercase tracking-tight">
                Derniers Profils
              </h2>
            </div>
            <button
              onClick={() => onNavigate('members')}
              className="text-xs font-heading font-semibold uppercase tracking-wider text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              Tous <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {members.slice(0, 5).map((m) => {
              const isPaid = m.paymentStatut === 'PAYE';
              const isPending = m.paymentStatut === 'EN_ATTENTE';
              const isUnpaid = m.paymentStatut === 'NON_PAYE';

              return (
                <div
                  key={m.id}
                  className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/[0.06] flex items-center justify-between hover:border-[#c5a880]/40 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="font-heading font-bold text-neutral-900 dark:text-white text-xs uppercase tracking-tight">
                      {m.nomComplet}
                    </div>
                    <div className="text-[11px] text-neutral-500 font-light truncate max-w-[140px]">{m.email}</div>
                  </div>

                  <div className="text-right">
                    {isPaid && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider bg-[#758a7b]/15 text-[#758a7b] dark:text-[#a3b8a9] border border-[#758a7b]/30">
                        Payé
                      </span>
                    )}
                    {isPending && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider bg-[#c87a32]/15 text-[#c87a32] border border-[#c87a32]/35">
                        En Attente
                      </span>
                    )}
                    {isUnpaid && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider bg-[#f43f5e]/15 text-[#f43f5e] border border-[#f43f5e]/35">
                        Impayé
                      </span>
                    )}
                    {!m.paymentStatut && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider bg-neutral-100 dark:bg-white/[0.05] text-neutral-400 border border-neutral-200 dark:border-white/10">
                        Actif
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <ShinyButton
              onClick={() => onNavigate('members')}
              variant="secondary"
              className="w-full text-center"
            >
              + Gérer Fichier Adhérents
            </ShinyButton>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
};
