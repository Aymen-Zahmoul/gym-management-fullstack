import React, { useState } from 'react';
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  QrCode,
  ShieldCheck,
  Dumbbell,
  ArrowRight,
  Sparkles,
  CreditCard,
  AlertTriangle,
  Banknote,
  Landmark,
  Check,
  X,
  Users,
} from 'lucide-react';
import type { Member, ClassSession, MembershipPlan } from '../types';
import { SpotlightCard } from './ui/SpotlightCard';
import { ShinyButton } from './ui/ShinyButton';
import { useAnimeEntrance } from '../utils/animeAnimations';
import { HadidLogo } from './ui/HadidLogo';
import { api } from '../services/api';

interface MemberSpaceViewProps {
  currentUser: Member;
  plans: MembershipPlan[];
  sessions: ClassSession[];
  onNavigateToSchedule: () => void;
  onNavigateToCoaches?: () => void;
  onRefreshData?: () => Promise<void>;
}

export const MemberSpaceView: React.FC<MemberSpaceViewProps> = ({
  currentUser,
  plans,
  sessions,
  onNavigateToSchedule,
  onNavigateToCoaches,
  onRefreshData,
}) => {
  const containerRef = useAnimeEntrance<HTMLDivElement>('.anime-member-space', [currentUser.id]);
  const userPlan = plans.find((p) => p.nom === currentUser.activePlanName) || plans[0];

  const isUnpaid = currentUser.paymentStatut === 'NON_PAYE';
  const isPending = currentUser.paymentStatut === 'EN_ATTENTE';
  const isPaid = currentUser.paymentStatut === 'PAYE';

  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<number>(userPlan?.id || 1);
  const [paymentMethod, setPaymentMethod] = useState<'CARTE_BANCAIRE' | 'ESPECES' | 'VIREMENT'>('CARTE_BANCAIRE');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const chosenPlan = plans.find((p) => p.id === selectedPlanId) || userPlan;

  const handlePaySubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setPaymentLoading(true);
      const amount = chosenPlan ? chosenPlan.prix : 240.0;
      await api.createPayment({
        userId: currentUser.id,
        montant: amount,
        modePaiement: paymentMethod,
        statut: 'PAYE',
        reference: `ONLINE-PAY-${currentUser.id}-${Date.now().toString().slice(-4)}`,
      });

      setPaymentSuccess(true);
      if (onRefreshData) {
        await onRefreshData();
      }
      setTimeout(() => {
        setPaymentSuccess(false);
        setIsPaymentModalOpen(false);
      }, 2500);
    } catch (err: any) {
      alert('Erreur lors du paiement : ' + err.message);
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="space-y-8 pb-12 font-sans">
      {/* Top Banner / Architectural Welcome */}
      <div className="anime-member-space relative overflow-hidden rounded-3xl border border-neutral-200/90 dark:border-white/[0.08] bg-white dark:bg-[#111215] p-8 sm:p-10 shadow-[0_4px_30px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_30px_-4px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full border border-bronze bg-bronze-subtle text-[10px] font-heading font-bold tracking-[0.2em] uppercase text-neutral-800 dark:text-neutral-200">
              <ShieldCheck className="w-3.5 h-3.5 text-bronze" />
              Espace Membre Titulaire • HADID Byrsa
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-neutral-900 dark:text-white tracking-tight uppercase">
              Bienvenue, {currentUser.nomComplet}
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-xl font-light leading-relaxed">
              Consultez la validité de votre badge RFID, réglez votre cotisation en ligne et réservez vos séances de coaching d'élite.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onNavigateToCoaches && (
              <ShinyButton onClick={onNavigateToCoaches} variant="secondary">
                <Users className="w-4 h-4 text-[#c5a880]" />
                Catalogue des Coachs
              </ShinyButton>
            )}
            <ShinyButton onClick={onNavigateToSchedule} variant="primary">
              <Calendar className="w-4 h-4" />
              Réserver un Studio
            </ShinyButton>
          </div>
        </div>
      </div>

      {/* Unpaid / Pending Alert Banner (If Applicable) */}
      {(isUnpaid || isPending) && (
        <div
          className={`anime-member-space rounded-3xl p-6 sm:p-7 border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
            isUnpaid
              ? 'border-[#f43f5e]/40 bg-gradient-to-r from-[#f43f5e]/15 via-[#f43f5e]/5 to-transparent'
              : 'border-[#c87a32]/40 bg-gradient-to-r from-[#c87a32]/15 via-[#c87a32]/5 to-transparent'
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse-subtle ${
                isUnpaid ? 'bg-[#f43f5e]/20 text-[#f43f5e]' : 'bg-[#c87a32]/20 text-[#c87a32]'
              }`}
            >
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <div
                className={`font-heading font-black text-sm uppercase tracking-wider ${
                  isUnpaid ? 'text-[#f43f5e]' : 'text-[#c87a32]'
                }`}
              >
                {isUnpaid ? 'Cotisation Impayée • Régularisation Requise' : 'Paiement en Attente de Validation'}
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 font-light">
                {isUnpaid
                  ? 'Votre badge RFID d\'accès aux 4 studios nécessite le règlement de votre abonnement pour être actif.'
                  : 'Votre dernier règlement est en cours de traitement par l\'administration comptable.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className={`px-5 py-2.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider text-white flex items-center gap-2 cursor-pointer shadow-sm self-end md:self-auto transition-opacity hover:opacity-90 ${
              isUnpaid ? 'bg-[#f43f5e]' : 'bg-[#c87a32]'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Payer Mon Abonnement</span>
          </button>
        </div>
      )}

      {/* Grid: Digital Pass & Membership Details & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Digital Membership Pass Card (Architectural Metal Aesthetic) */}
        <SpotlightCard className="anime-member-space luxury-card p-7 flex flex-col justify-between space-y-6 border-neutral-200/90 dark:border-[#c5a880]/30 shadow-sm">
          <div>
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/[0.06] pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <HadidLogo size="sm" layout="emblem-only" />
                <span className="font-heading font-black text-xs tracking-[0.18em] text-neutral-900 dark:text-white uppercase">
                  Pass RFID Titulaire
                </span>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider ${
                  isPaid
                    ? 'bg-[#758a7b]/15 text-[#758a7b] dark:text-[#a3b8a9] border border-[#758a7b]/30'
                    : isPending
                    ? 'bg-[#c87a32]/15 text-[#c87a32] border border-[#c87a32]/35'
                    : 'bg-[#f43f5e]/15 text-[#f43f5e] border border-[#f43f5e]/35'
                }`}
              >
                {isPaid ? 'Régularisé' : isPending ? 'En Attente' : 'Impayé'}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase font-heading font-bold tracking-wider text-neutral-400">Titulaire</p>
                <p className="text-base font-heading font-black text-neutral-900 dark:text-white uppercase mt-0.5">
                  {currentUser.nomComplet}
                </p>
                <p className="text-xs text-neutral-500 font-light font-mono">{currentUser.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <p className="text-[10px] uppercase font-heading font-bold tracking-wider text-neutral-400">Identifiant Unique</p>
                  <p className="text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200 mt-0.5">
                    CFT-2026-{String(currentUser.id).padStart(4, '0')}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-heading font-bold tracking-wider text-neutral-400">Téléphone</p>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 mt-0.5 font-light">
                    {currentUser.telephone || 'Non renseigné'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 dark:border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-neutral-500">
              <QrCode className="w-8 h-8 text-neutral-900 dark:text-white" />
              <span className="text-[10px] font-mono leading-tight">
                {isPaid ? 'Accès immédiat tourniquets' : 'Badge suspendu (Règlement)'}
              </span>
            </div>
            <span className="text-[10px] font-heading font-bold tracking-widest uppercase text-[#c5a880]">
              Carthage Byrsa
            </span>
          </div>
        </SpotlightCard>

        {/* Active Subscription Details */}
        <SpotlightCard className="anime-member-space luxury-card p-7 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/[0.06] pb-4 mb-5">
              <span className="text-[10px] font-heading font-bold uppercase tracking-[0.18em] text-[#c5a880] flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                Formule Souscrite
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider bg-neutral-100 dark:bg-white/[0.05] border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300">
                {currentUser.activePlanName ? 'Souscrit' : 'Sans Abonnement'}
              </span>
            </div>

            <h3 className="text-xl font-heading font-black text-neutral-900 dark:text-white uppercase tracking-tight mb-2">
              {currentUser.activePlanName || userPlan?.nom || 'Abonnement Standard'}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6 font-light leading-relaxed">
              {userPlan?.description || 'Accès cardio, musculation et vestiaires avec casiers sécurisés.'}
            </p>

            <div className="space-y-2.5 text-xs text-neutral-700 dark:text-neutral-300 font-light">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880]" />
                <span>Accès plateau musculation & cardio 7j/7</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880]" />
                <span>Cours collectifs inclus (WOD, Boxe, Yoga)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880]" />
                <span>Vestiaires, douches & sauna finlandais</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 dark:border-white/[0.06] flex items-center justify-between text-xs">
            <div>
              <span className="text-neutral-400 uppercase tracking-wider text-[10px] block">Statut Cotisation :</span>
              <span
                className={`font-heading font-bold text-xs uppercase ${
                  isPaid ? 'text-[#758a7b]' : isPending ? 'text-[#c87a32]' : 'text-[#f43f5e]'
                }`}
              >
                {isPaid ? 'En Règle' : isPending ? 'En Attente' : 'Non Réglée'}
              </span>
            </div>

            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-heading font-bold text-xs uppercase tracking-wider hover:bg-[#c5a880] dark:hover:bg-[#c5a880] transition-colors cursor-pointer"
            >
              {isPaid ? 'Prolonger' : 'Régler (En Ligne)'}
            </button>
          </div>
        </SpotlightCard>

        {/* Quick Tips & Next Session */}
        <SpotlightCard className="anime-member-space luxury-card p-7 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/[0.06] pb-4 mb-5">
              <span className="text-[10px] font-heading font-bold uppercase tracking-[0.18em] text-neutral-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#c5a880]" />
                Horaires d'Ouverture Club
              </span>
            </div>

            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/[0.06]">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">Lundi au Vendredi</span>
                  <span className="font-mono text-neutral-900 dark:text-white font-bold">06:00 — 23:00</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">Samedi & Dimanche</span>
                  <span className="font-mono text-neutral-900 dark:text-white font-bold">07:00 — 21:00</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/[0.06] text-xs text-neutral-500 font-light space-y-1">
                <p className="font-heading font-bold text-neutral-900 dark:text-white text-[11px] uppercase tracking-wider">
                  Accès Libre Aux 4 Studios
                </p>
                <p className="leading-relaxed">
                  Serviette obligatoire. Réservez vos créneaux collectifs ou contactez un coach privé dans le catalogue.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 dark:border-white/[0.06] flex items-center gap-2">
            <ShinyButton onClick={onNavigateToSchedule} variant="outline" className="w-full text-center text-xs py-2.5">
              <Calendar className="w-3.5 h-3.5" />
              Planning des Créneaux
            </ShinyButton>
          </div>
        </SpotlightCard>
      </div>

      {/* Member Online Subscription Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#111215] border border-neutral-200 dark:border-white/10 p-7 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/[0.06] pb-4">
              <div>
                <span className="text-[10px] uppercase font-heading font-bold tracking-[0.2em] text-[#c5a880]">
                  Règlement Sécurisé • HADID Byrsa
                </span>
                <h3 className="text-xl sm:text-2xl font-heading font-black text-neutral-900 dark:text-white uppercase tracking-tight">
                  Payer Mon Abonnement
                </h3>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!paymentSuccess ? (
              <form onSubmit={handlePaySubscription} className="space-y-5">
                {/* 1. Choose Plan */}
                <div className="space-y-2">
                  <label className="text-[11px] font-heading font-bold uppercase tracking-wider text-neutral-400">
                    Formule d'Abonnement Souhaitée
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {plans.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedPlanId(p.id)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          selectedPlanId === p.id
                            ? 'border-[#c5a880] bg-[#c5a880]/15 shadow-sm'
                            : 'border-neutral-200 dark:border-white/10 hover:border-neutral-300'
                        }`}
                      >
                        <div className="font-heading font-bold text-xs uppercase text-neutral-900 dark:text-white truncate">
                          {p.nom.split(' ')[0]} {p.nom.split(' ')[1] || ''}
                        </div>
                        <div className="font-heading font-black text-sm text-[#c5a880] mt-1">
                          {p.prix} <span className="text-[10px] font-normal">TND</span>
                        </div>
                        <span className="text-[10px] text-neutral-400">{p.dureeMois} mois</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Choose Payment Method */}
                <div className="space-y-2">
                  <label className="text-[11px] font-heading font-bold uppercase tracking-wider text-neutral-400">
                    Mode de Règlement
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CARTE_BANCAIRE')}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        paymentMethod === 'CARTE_BANCAIRE'
                          ? 'border-[#c5a880] bg-[#c5a880]/15 font-bold'
                          : 'border-neutral-200 dark:border-white/10 text-neutral-400'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 mx-auto mb-1 text-[#c5a880]" />
                      <span className="text-[10px] font-heading uppercase block text-neutral-900 dark:text-white">
                        Carte Bancaire
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('ESPECES')}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        paymentMethod === 'ESPECES'
                          ? 'border-[#c5a880] bg-[#c5a880]/15 font-bold'
                          : 'border-neutral-200 dark:border-white/10 text-neutral-400'
                      }`}
                    >
                      <Banknote className="w-5 h-5 mx-auto mb-1 text-[#c5a880]" />
                      <span className="text-[10px] font-heading uppercase block text-neutral-900 dark:text-white">
                        Guichet Club
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('VIREMENT')}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        paymentMethod === 'VIREMENT'
                          ? 'border-[#c5a880] bg-[#c5a880]/15 font-bold'
                          : 'border-neutral-200 dark:border-white/10 text-neutral-400'
                      }`}
                    >
                      <Landmark className="w-5 h-5 mx-auto mb-1 text-[#c5a880]" />
                      <span className="text-[10px] font-heading uppercase block text-neutral-900 dark:text-white">
                        Virement
                      </span>
                    </button>
                  </div>
                </div>

                {/* Amount Summary */}
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-neutral-400">
                      Montant Total TTC :
                    </span>
                    <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      {chosenPlan?.nom || 'Abonnement'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-heading font-black text-2xl text-[#c5a880]">
                      {chosenPlan ? chosenPlan.prix.toFixed(2) : '240.00'}
                    </span>
                    <span className="text-xs font-bold text-neutral-400 ml-1">TND</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPaymentModalOpen(false)}
                    className="flex-1 py-3 rounded-xl border border-neutral-200 dark:border-white/10 text-xs font-heading font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
                  >
                    Annuler
                  </button>
                  <ShinyButton
                    type="submit"
                    disabled={paymentLoading}
                    variant="primary"
                    className="flex-1 justify-center"
                  >
                    {paymentLoading ? 'Traitement en cours...' : 'Confirmer le Règlement'}
                  </ShinyButton>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-4 py-4 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-500">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="font-heading font-black text-xl uppercase text-neutral-900 dark:text-white">
                  Paiement Validé avec Succès !
                </h4>
                <p className="text-xs text-neutral-500 leading-relaxed font-light">
                  Votre transaction a été enregistrée sur le serveur MySQL. Votre badge RFID est à jour et débloqué pour tous les tourniquets de Byrsa.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
