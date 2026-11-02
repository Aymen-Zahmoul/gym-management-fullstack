import React, { useState } from 'react';
import {
  Award,
  Search,
  CheckCircle2,
  Clock,
  Banknote,
  ShieldCheck,
  Sparkles,
  UserCheck,
  ChevronRight,
} from 'lucide-react';
import type { MembershipPlan, Member } from '../types';
import { SpotlightCard } from './ui/SpotlightCard';
import { ShinyButton } from './ui/ShinyButton';
import { useAnimeEntrance } from '../utils/animeAnimations';

interface PlansViewProps {
  plans: MembershipPlan[];
  members?: Member[];
  onAssignPlan?: (memberId: number, planId: number) => Promise<void>;
}

export const PlansView: React.FC<PlansViewProps> = ({ plans, members = [], onAssignPlan }) => {
  const containerRef = useAnimeEntrance<HTMLDivElement>('.anime-item', [plans.length]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlanForAssign, setSelectedPlanForAssign] = useState<MembershipPlan | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<number>(members.length > 0 ? members[0].id : 1);
  const [assignSuccess, setAssignSuccess] = useState<string | null>(null);

  const filteredPlans = plans.filter(
    (p) =>
      p.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const avgPrice =
    plans.length > 0
      ? (plans.reduce((acc, p) => acc + Number(p.prix), 0) / plans.length).toFixed(2)
      : '0.00';

  const unlimitedCount = plans.filter((p) => p.accesCoursIllimite).length;

  const handleConfirmAssign = async () => {
    if (!selectedPlanForAssign) return;
    try {
      if (onAssignPlan) {
        await onAssignPlan(selectedMemberId, selectedPlanForAssign.id);
      }
      const member = members.find((m) => m.id === selectedMemberId);
      setAssignSuccess(`Formule "${selectedPlanForAssign.nom}" assignée avec succès à ${member?.nomComplet || 'l’adhérent'} !`);
      setTimeout(() => {
        setAssignSuccess(null);
        setSelectedPlanForAssign(null);
      }, 2500);
    } catch {
      // Handled in parent
    }
  };

  return (
    <div ref={containerRef} className="space-y-8 pb-12">
      {/* Architectural Header Banner */}
      <div className="anime-item relative overflow-hidden rounded-3xl border border-neutral-200/90 dark:border-white/[0.08] bg-white dark:bg-[#111215] p-8 sm:p-10 shadow-[0_4px_30px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_30px_-4px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full border border-bronze bg-bronze-subtle text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-900 dark:text-white">
              <Award className="w-3.5 h-3.5 text-bronze" />
              Catalogue Officiel des Formules • HADID Byrsa
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight uppercase">
              Gestion des Abonnements
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-2xl font-light leading-relaxed">
              Supervision de la grille tarifaire, conditions d'accès aux studios (Force, Boxe, Yoga, Cardio) et durées de cotisation en Dinars Tunisiens (TND).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Rechercher une formule..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200 dark:border-white/10 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-white/30 w-64 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Operational KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <SpotlightCard className="anime-item p-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                Formules Actives
              </span>
              <p className="text-3xl font-black font-mono text-neutral-900 dark:text-white mt-1">{plans.length}</p>
              <p className="text-[11px] text-neutral-500 font-light mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Disponibles en caisse
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200/90 dark:border-white/10 flex items-center justify-center text-neutral-800 dark:text-neutral-200">
              <Award className="w-5 h-5" />
            </div>
          </div>
        </SpotlightCard>

        <SpotlightCard className="anime-item p-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                Tarif Moyen
              </span>
              <p className="text-3xl font-black font-mono text-neutral-900 dark:text-white mt-1">
                {avgPrice} <span className="text-sm font-light text-neutral-400">TND</span>
              </p>
              <p className="text-[11px] text-neutral-500 font-light mt-1">Base catalogue officielle</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200/90 dark:border-white/10 flex items-center justify-center text-neutral-800 dark:text-neutral-200">
              <Banknote className="w-5 h-5" />
            </div>
          </div>
        </SpotlightCard>

        <SpotlightCard className="anime-item p-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                Accès Tous Cours
              </span>
              <p className="text-3xl font-black font-mono text-neutral-900 dark:text-white mt-1">
                {unlimitedCount} <span className="text-sm font-light text-neutral-400">/ {plans.length}</span>
              </p>
              <p className="text-[11px] text-neutral-500 font-light mt-1">Formules illimitées</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200/90 dark:border-white/10 flex items-center justify-center text-neutral-800 dark:text-neutral-200">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </SpotlightCard>

        <SpotlightCard className="anime-item p-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                Garantie d'Accès
              </span>
              <p className="text-2xl font-black font-mono text-neutral-900 dark:text-white mt-1">Badge RFID</p>
              <p className="text-[11px] text-neutral-500 font-light mt-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Accès 7j/7 Illimité
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200/90 dark:border-white/10 flex items-center justify-center text-neutral-800 dark:text-neutral-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </SpotlightCard>
      </div>

      {/* Luxury Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <SpotlightCard
            key={plan.id}
            className="anime-item p-8 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/[0.06] pb-4 mb-6">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-white/[0.05] border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300">
                  {plan.dureeMois} {plan.dureeMois === 1 ? 'Mois' : 'Mois'}
                </span>
                <span className="text-[10px] font-mono text-neutral-400">PLAN-0{plan.id}</span>
              </div>

              <h3 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">
                {plan.nom}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 font-light leading-relaxed min-h-[48px]">
                {plan.description}
              </p>

              <div className="my-6 pt-6 border-t border-neutral-100 dark:border-white/[0.06]">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black font-mono text-neutral-900 dark:text-white tracking-tight">
                    {Number(plan.prix).toFixed(0)}
                  </span>
                  <span className="text-sm font-semibold text-neutral-400">TND TTC</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mt-1">
                  Cotisation {plan.dureeMois} mois • Accès Badge RFID
                </span>
              </div>

              <ul className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-300 mb-8 font-light">
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-white" />
                  Accès libre 7j/7 aux plateaux force & cardio
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-white" />
                  {plan.accesCoursIllimite
                    ? 'Tous cours collectifs inclus (WOD, Boxe, Yoga)'
                    : 'Option cours collectifs à la séance'}
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-white" />
                  Vestiaires haut de gamme, douches & sauna
                </li>
              </ul>
            </div>

            <ShinyButton
              onClick={() => setSelectedPlanForAssign(plan)}
              variant="primary"
              className="w-full text-center py-2.5"
            >
              <UserCheck className="w-4 h-4" />
              Assigner à un Adhérent
            </ShinyButton>
          </SpotlightCard>
        ))}
      </div>

      {/* Plan Assignment Modal */}
      {selectedPlanForAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#111215] p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/[0.06] pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-400">Caisse & Guichet</span>
                <h3 className="text-lg font-black text-neutral-900 dark:text-white uppercase tracking-tight">
                  Assigner {selectedPlanForAssign.nom}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPlanForAssign(null)}
                className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {assignSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {assignSuccess}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/10">
                  <div className="text-xs text-neutral-500">Tarif à régler en caisse :</div>
                  <div className="text-2xl font-black font-mono text-neutral-900 dark:text-white mt-1">
                    {Number(selectedPlanForAssign.prix).toFixed(2)} TND
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">
                    Durée : {selectedPlanForAssign.dureeMois} mois • Écrit dans la table `subscriptions`
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 uppercase tracking-wider text-[10px]">
                    Sélectionner l'adhérent bénéficiaire :
                  </label>
                  <select
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-400"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nomComplet} ({m.email}) — Actuel : {m.activePlanName || 'Aucun'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <ShinyButton onClick={handleConfirmAssign} variant="primary" className="flex-1 text-center">
                    Confirmer l'Assignation
                  </ShinyButton>
                  <ShinyButton
                    onClick={() => setSelectedPlanForAssign(null)}
                    variant="outline"
                    className="flex-1 text-center"
                  >
                    Annuler
                  </ShinyButton>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
