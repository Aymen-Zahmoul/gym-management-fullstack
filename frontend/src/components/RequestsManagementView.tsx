import React, { useState } from 'react';
import {
  UserCheck,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  MapPin,
  Search,
  ShieldCheck,
  Phone,
  Mail,
} from 'lucide-react';
import type { CoachCollaborationRequest, SchedulingRequest, ClassSession } from '../types';
import { SpotlightCard } from './ui/SpotlightCard';
import { useAnimeEntrance } from '../utils/animeAnimations';

interface RequestsManagementViewProps {
  schedulingRequests: SchedulingRequest[];
  coachRequests: CoachCollaborationRequest[];
  onApproveScheduling: (id: number) => Promise<void>;
  onRejectScheduling: (id: number, motif?: string) => Promise<void>;
  onApproveCoach: (id: number) => Promise<void>;
  onRejectCoach: (id: number, motif?: string) => Promise<void>;
  onCheckConflicts: (id: number) => Promise<ClassSession[]>;
  onRefreshData?: () => Promise<void>;
}

export const RequestsManagementView: React.FC<RequestsManagementViewProps> = ({
  schedulingRequests,
  coachRequests,
  onApproveScheduling,
  onRejectScheduling,
  onApproveCoach,
  onRejectCoach,
  onCheckConflicts,
  onRefreshData,
}) => {
  const containerRef = useAnimeEntrance<HTMLDivElement>('.anime-request-item', [
    schedulingRequests.length,
    coachRequests.length,
  ]);

  const [activeTab, setActiveTab] = useState<'scheduling' | 'coaches'>('scheduling');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');

  // Conflict Checking State
  const [checkingConflictId, setCheckingConflictId] = useState<number | null>(null);
  const [conflictResults, setConflictResults] = useState<{ [id: number]: ClassSession[] }>({});

  // Reject Modal
  const [rejectModalData, setRejectModalData] = useState<{
    isOpen: boolean;
    type: 'scheduling' | 'coach';
    id: number;
    name: string;
  }>({
    isOpen: false,
    type: 'scheduling',
    id: 0,
    name: '',
  });
  const [rejectMotif, setRejectMotif] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const pendingSchedCount = schedulingRequests.filter((r) => r.statut === 'PENDING').length;
  const pendingCoachCount = coachRequests.filter((r) => r.statut === 'PENDING').length;

  const filteredScheduling = schedulingRequests.filter((r) => {
    const matchesStatus = statusFilter === 'ALL' || r.statut === statusFilter;
    const matchesSearch =
      (r.activite?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (r.coachNomComplet?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (r.salle?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    return matchesStatus && matchesSearch;
  });

  const filteredCoaches = coachRequests.filter((r) => {
    const matchesStatus = statusFilter === 'ALL' || r.statut === statusFilter;
    const matchesSearch =
      (r.coachNomComplet?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (r.specialites?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (r.coachEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    return matchesStatus && matchesSearch;
  });

  const handleRunConflictCheck = async (id: number) => {
    try {
      setCheckingConflictId(id);
      const conflicts = await onCheckConflicts(id);
      setConflictResults((prev) => ({ ...prev, [id]: conflicts }));
    } catch {
      // handled
    } finally {
      setCheckingConflictId(null);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectModalData.id) return;
    try {
      setActionLoading(true);
      if (rejectModalData.type === 'scheduling') {
        await onRejectScheduling(rejectModalData.id, rejectMotif || undefined);
      } else {
        await onRejectCoach(rejectModalData.id, rejectMotif || undefined);
      }
      setRejectModalData({ isOpen: false, type: 'scheduling', id: 0, name: '' });
      setRejectMotif('');
      if (onRefreshData) await onRefreshData();
    } catch {
      // handled
    } finally {
      setActionLoading(false);
    }
  };

  const handleDirectApproveScheduling = async (id: number) => {
    try {
      setActionLoading(true);
      await onApproveScheduling(id);
      if (onRefreshData) await onRefreshData();
    } finally {
      setActionLoading(false);
    }
  };

  const handleDirectApproveCoach = async (id: number) => {
    try {
      setActionLoading(true);
      await onApproveCoach(id);
      if (onRefreshData) await onRefreshData();
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="space-y-8 pb-16 font-sans">
      {/* Header Banner */}
      <div className="anime-request-item relative overflow-hidden rounded-3xl border border-neutral-200/90 dark:border-white/[0.08] bg-white dark:bg-[#111215] p-8 sm:p-10 shadow-[0_4px_30px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_30px_-4px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full border border-bronze bg-bronze-subtle text-[10px] font-heading font-bold tracking-[0.2em] uppercase text-neutral-800 dark:text-neutral-200">
              <ShieldCheck className="w-3.5 h-3.5 text-bronze" />
              Direction & Validations Administratives • HADID Byrsa
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-neutral-900 dark:text-white tracking-tight uppercase">
              Gestion des Demandes
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-2xl font-light leading-relaxed">
              Examen officiel des demandes de créneaux déposées par les coachs et validation des dossiers de collaboration pour affiliation au club.
            </p>
          </div>

          {/* Quick Pending Stats Pills */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400">
              <span className="text-[10px] font-mono uppercase tracking-wider block font-bold">Créneaux en attente</span>
              <span className="text-2xl font-black font-mono">{pendingSchedCount}</span>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-400">
              <span className="text-[10px] font-mono uppercase tracking-wider block font-bold">Candidatures Coach</span>
              <span className="text-2xl font-black font-mono">{pendingCoachCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Mode Tabs & Filter Bar */}
      <div className="anime-request-item space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Main Category Tabs */}
          <div className="flex items-center p-1 rounded-2xl bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200/90 dark:border-white/[0.08] w-fit">
            <button
              onClick={() => setActiveTab('scheduling')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'scheduling'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Créneaux & Planning</span>
              {pendingSchedCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-500 text-neutral-950 font-bold">
                  {pendingSchedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('coaches')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'coaches'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Collaborations Coachs</span>
              {pendingCoachCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-blue-500 text-white font-bold">
                  {pendingCoachCount}
                </span>
              )}
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Rechercher coach, activité, salle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#111215] border border-neutral-200/90 dark:border-white/[0.08] text-neutral-900 dark:text-white placeholder-neutral-400 text-xs focus:outline-none focus:border-neutral-400 dark:focus:border-white/30"
            />
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white dark:bg-[#111215] border border-neutral-200/90 dark:border-white/[0.08] w-fit shadow-sm">
          {[
            { id: 'PENDING', label: 'En Attente' },
            { id: 'APPROVED', label: 'Approuvées' },
            { id: 'REJECTED', label: 'Refusées' },
            { id: 'ALL', label: 'Toutes les demandes' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setStatusFilter(s.id as any)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === s.id
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: Scheduling Requests List */}
      {activeTab === 'scheduling' && (
        <div className="space-y-4">
          {filteredScheduling.length === 0 ? (
            <div className="anime-request-item p-12 text-center rounded-3xl bg-white dark:bg-[#111215] border border-neutral-200/90 dark:border-white/[0.08] space-y-2">
              <Calendar className="w-10 h-10 text-neutral-400 mx-auto" />
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                Aucune demande de créneau ne correspond à ce filtre.
              </p>
            </div>
          ) : (
            filteredScheduling.map((req) => {
              const conflicts = conflictResults[req.id];
              const isCheckingThis = checkingConflictId === req.id;

              return (
                <SpotlightCard
                  key={req.id}
                  className="anime-request-item p-6 sm:p-7 rounded-3xl border border-neutral-200/90 dark:border-white/[0.08]"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Left: Request Details */}
                    <div className="space-y-3 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="px-2.5 py-1 rounded-lg bg-bronze/10 border border-bronze/30 text-bronze text-xs font-heading font-black uppercase tracking-wider">
                          {req.activite}
                        </span>

                        {req.statut === 'PENDING' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            En Attente d'Approbation
                          </span>
                        )}
                        {req.statut === 'APPROVED' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Approuvée • Séances Confirmées
                          </span>
                        )}
                        {req.statut === 'REJECTED' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            Refusée
                          </span>
                        )}

                        <span className="text-[11px] font-mono text-neutral-400">
                          ID: #{req.id}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs pt-1">
                        <div>
                          <span className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider block">
                            Coach Responsable
                          </span>
                          <span className="font-bold text-neutral-900 dark:text-white">
                            {req.coachNomComplet || `Coach #${req.coachId}`}
                          </span>
                          {req.coachTelephone && (
                            <span className="text-neutral-500 block text-[11px]">
                              {req.coachTelephone}
                            </span>
                          )}
                        </div>

                        <div>
                          <span className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider block">
                            Jours & Horaires Demandés
                          </span>
                          <span className="font-bold text-neutral-900 dark:text-white">
                            {req.joursSemaine}
                          </span>
                          <span className="text-neutral-500 block text-[11px] font-mono">
                            {req.heureDebut?.substring(0, 5)} – {req.heureFin?.substring(0, 5)}
                          </span>
                        </div>

                        <div>
                          <span className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider block">
                            Période & Studio
                          </span>
                          <span className="font-bold text-neutral-900 dark:text-white">
                            {req.dateDebut} au {req.dateFin}
                          </span>
                          <span className="text-neutral-500 block text-[11px] flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-bronze" />
                            {req.salle || 'Salle Principale'}
                          </span>
                        </div>
                      </div>

                      {req.remarques && (
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-white/[0.02] p-2.5 rounded-xl border border-neutral-200/50 dark:border-white/[0.04] italic">
                          "{req.remarques}"
                        </p>
                      )}

                      {req.motifRejet && (
                        <p className="text-xs text-rose-600 dark:text-rose-400 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                          Motif de refus : {req.motifRejet}
                        </p>
                      )}

                      {/* Conflicts Alert Box */}
                      {conflicts !== undefined && (
                        <div
                          className={`p-3 rounded-xl border text-xs ${
                            conflicts.length === 0
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                              : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-400'
                          }`}
                        >
                          {conflicts.length === 0 ? (
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                              <span>Aucun conflit de créneau détecté dans cette salle sur toute la période.</span>
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 font-bold">
                                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                <span>Attention : {conflicts.length} séance(s) en conflit détectée(s) :</span>
                              </div>
                              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                                {conflicts.slice(0, 3).map((c) => (
                                  <li key={c.id}>
                                    {c.classTitle} ({c.coachName}) le {c.dateHeureDebut?.substring(0, 16)} dans {c.salle}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right: Administrative Actions */}
                    {req.statut === 'PENDING' && (
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
                        <button
                          onClick={() => handleRunConflictCheck(req.id)}
                          disabled={isCheckingThis}
                          className="px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-white/10 hover:border-bronze text-neutral-700 dark:text-neutral-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                          <span>{isCheckingThis ? 'Vérification...' : 'Vérifier Conflits'}</span>
                        </button>

                        <button
                          onClick={() => handleDirectApproveScheduling(req.id)}
                          disabled={actionLoading}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approuver</span>
                        </button>

                        <button
                          onClick={() =>
                            setRejectModalData({
                              isOpen: true,
                              type: 'scheduling',
                              id: req.id,
                              name: `${req.activite} (${req.coachNomComplet})`,
                            })
                          }
                          disabled={actionLoading}
                          className="px-3.5 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-600 hover:text-white text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Rejeter</span>
                        </button>
                      </div>
                    )}
                  </div>
                </SpotlightCard>
              );
            })
          )}
        </div>
      )}

      {/* SECTION 2: Coach Collaboration Requests List */}
      {activeTab === 'coaches' && (
        <div className="space-y-4">
          {filteredCoaches.length === 0 ? (
            <div className="anime-request-item p-12 text-center rounded-3xl bg-white dark:bg-[#111215] border border-neutral-200/90 dark:border-white/[0.08] space-y-2">
              <UserCheck className="w-10 h-10 text-neutral-400 mx-auto" />
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                Aucune demande d'affiliation coach ne correspond à ce filtre.
              </p>
            </div>
          ) : (
            filteredCoaches.map((req) => (
              <SpotlightCard
                key={req.id}
                className="anime-request-item p-6 sm:p-7 rounded-3xl border border-neutral-200/90 dark:border-white/[0.08]"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left: Coach Profile */}
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-bronze/10 border border-bronze/30 text-bronze font-black flex items-center justify-center text-xs">
                        HD
                      </div>
                      <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                        {req.coachNomComplet}
                      </h3>

                      {req.statut === 'PENDING' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          En Attente de Validation
                        </span>
                      )}
                      {req.statut === 'APPROVED' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Affilié Officiellement
                        </span>
                      )}
                      {req.statut === 'REJECTED' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          Dossier Décliné
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                      <div>
                        <span className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider block">
                          Spécialités
                        </span>
                        <span className="font-bold text-neutral-900 dark:text-white">
                          {req.specialites}
                        </span>
                        <span className="text-neutral-500 block text-[11px]">
                          Expérience : {req.anneesExperience} an(s)
                        </span>
                      </div>

                      <div>
                        <span className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider block">
                          Coordonnées
                        </span>
                        <span className="text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-bronze" /> {req.coachEmail}
                        </span>
                        {req.coachTelephone && (
                          <span className="text-neutral-500 block text-[11px] flex items-center gap-1">
                            <Phone className="w-3 h-3 text-bronze" /> {req.coachTelephone}
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider block">
                          Club Cible
                        </span>
                        <span className="font-bold text-neutral-900 dark:text-white">
                          {req.gymNom || 'HADID Byrsa'}
                        </span>
                        <span className="text-neutral-500 block text-[11px]">
                          Date : {req.createdAt?.substring(0, 10)}
                        </span>
                      </div>
                    </div>

                    {req.bio && (
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-white/[0.02] p-2.5 rounded-xl border border-neutral-200/50 dark:border-white/[0.04]">
                        {req.bio}
                      </p>
                    )}

                    {req.motifRejet && (
                      <p className="text-xs text-rose-600 dark:text-rose-400 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                        Motif : {req.motifRejet}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  {req.statut === 'PENDING' && (
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
                      <button
                        onClick={() => handleDirectApproveCoach(req.id)}
                        disabled={actionLoading}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Accepter Collaboration</span>
                      </button>

                      <button
                        onClick={() =>
                          setRejectModalData({
                            isOpen: true,
                            type: 'coach',
                            id: req.id,
                            name: req.coachNomComplet || 'Coach',
                          })
                        }
                        disabled={actionLoading}
                        className="px-3.5 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-600 hover:text-white text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Décliner</span>
                      </button>
                    </div>
                  )}
                </div>
              </SpotlightCard>
            ))
          )}
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalData.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#121316] border border-neutral-200 dark:border-white/10 p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-black text-base text-neutral-900 dark:text-white uppercase">
                  Motif du Rejet
                </h3>
                <p className="text-xs text-neutral-500">{rejectModalData.name}</p>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                Raison / Commentaires pour le demandeur (optionnel)
              </label>
              <textarea
                rows={3}
                value={rejectMotif}
                onChange={(e) => setRejectMotif(e.target.value)}
                placeholder="Ex: Créneau non compatible avec le planning, ou profil nécessitant des certifications complémentaires..."
                className="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-400"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalData({ isOpen: false, type: 'scheduling', id: 0, name: '' })}
                className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-white/10 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
              >
                {actionLoading ? 'Traitement...' : 'Confirmer le Rejet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
