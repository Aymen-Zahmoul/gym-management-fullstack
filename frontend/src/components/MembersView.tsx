import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Trash2,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Clock,
  CreditCard,
  Download,
  LayoutGrid,
  List,
  X,
  Banknote,
  Landmark,
} from 'lucide-react';
import type { Member, MembershipPlan } from '../types';
import { SpotlightCard } from './ui/SpotlightCard';
import { ShinyButton } from './ui/ShinyButton';
import { useAnimeEntrance } from '../utils/animeAnimations';
import { api } from '../services/api';
import { getErrorMessage } from '../utils/errorUtils';

interface MembersViewProps {
  members: Member[];
  plans: MembershipPlan[];
  onCreateMember: (data: { nomComplet: string; email: string; telephone?: string; initialPlanId?: number }) => Promise<void>;
  onDeleteMember: (id: number) => Promise<void>;
  currentUser?: Member | null;
  onRefreshData?: () => Promise<void>;
}

export const MembersView: React.FC<MembersViewProps> = ({
  members,
  plans,
  onCreateMember,
  onDeleteMember,
  currentUser,
  onRefreshData,
}) => {
  const isAdmin = currentUser?.role === 'ADMIN';
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'UNPAID' | 'WITHOUT_PLAN'>('ALL');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [settleModalMember, setSettleModalMember] = useState<Member | null>(null);
  const [settleMethod, setSettleMethod] = useState<'ESPECES' | 'CARTE_BANCAIRE' | 'VIREMENT'>('ESPECES');
  const [settleLoading, setSettleLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nomComplet: '',
    email: '',
    telephone: '',
    initialPlanId: plans.length > 0 ? plans[0].id : 1,
  });

  useEffect(() => {
    if (!isModalOpen && !settleModalMember) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
        setSettleModalMember(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, settleModalMember]);

  // Calculate counters
  const paidCount = members.filter((m) => m.paymentStatut === 'PAYE').length;
  const unpaidCount = members.filter(
    (m) => m.paymentStatut === 'NON_PAYE' || m.paymentStatut === 'EN_ATTENTE'
  ).length;
  const withoutPlanCount = members.filter((m) => !m.activePlanName).length;

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.nomComplet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'PAID') {
      return m.paymentStatut === 'PAYE';
    } else if (statusFilter === 'UNPAID') {
      return m.paymentStatut === 'NON_PAYE' || m.paymentStatut === 'EN_ATTENTE';
    } else if (statusFilter === 'WITHOUT_PLAN') {
      return !m.activePlanName;
    }
    return true;
  });

  const containerRef = useAnimeEntrance<HTMLDivElement>('.anime-member-card', [
    filteredMembers.length,
    statusFilter,
    viewMode,
  ]);

  const exportCSV = () => {
    const headers = [
      'ID',
      'Nom Complet',
      'Email',
      'Telephone',
      'Statut Compte',
      'Statut Cotisation',
      'Dernier Montant (TND)',
      'Forfait Actif',
      'Date Inscription',
    ];
    const rows = filteredMembers.map((m) => [
      m.id,
      `"${m.nomComplet}"`,
      `"${m.email}"`,
      `"${m.telephone || ''}"`,
      m.statut,
      m.paymentStatut || 'NON_RENSEIGNE',
      m.lastPaymentAmount ? m.lastPaymentAmount.toFixed(2) : '0.00',
      `"${m.activePlanName || 'Aucun'}"`,
      `"${m.createdAt || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `adherents_hadid_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nomComplet || !formData.email) return;

    try {
      setLoading(true);
      await onCreateMember({
        nomComplet: formData.nomComplet,
        email: formData.email,
        telephone: formData.telephone,
        initialPlanId: Number(formData.initialPlanId),
      });
      setIsModalOpen(false);
      setFormData({
        nomComplet: '',
        email: '',
        telephone: '',
        initialPlanId: plans.length > 0 ? plans[0].id : 1,
      });
      if (onRefreshData) await onRefreshData();
    } catch {
      // Handled in parent
    } finally {
      setLoading(false);
    }
  };

  const handleSettlePayment = async () => {
    if (!settleModalMember) return;
    try {
      setSettleLoading(true);
      const amount = settleModalMember.lastPaymentAmount || 180.0;
      await api.createPayment({
        userId: settleModalMember.id,
        montant: amount,
        modePaiement: settleMethod,
        statut: 'PAYE',
        reference: `REG-${settleModalMember.id}-${Date.now().toString().slice(-4)}`,
      });
      setSettleModalMember(null);
      if (onRefreshData) await onRefreshData();
    } catch (err: unknown) {
      alert("Erreur lors de l'encaissement : " + getErrorMessage(err));
    } finally {
      setSettleLoading(false);
    }
  };

  const getStatusBadge = (member: Member) => {
    const status = member.paymentStatut;
    if (status === 'PAYE') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider bg-[#758a7b]/15 text-[#758a7b] dark:text-[#a3b8a9] border border-[#758a7b]/30">
          <CheckCircle className="w-3 h-3 text-[#758a7b]" />
          Cotisation Réglée
        </span>
      );
    }
    if (status === 'EN_ATTENTE') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider bg-[#c87a32]/15 text-[#c87a32] dark:text-[#e5a060] border border-[#c87a32]/35 animate-pulse-subtle">
          <Clock className="w-3 h-3 text-[#c87a32]" />
          En Attente • {member.lastPaymentAmount ? `${member.lastPaymentAmount} TND` : 'Validation'}
        </span>
      );
    }
    if (status === 'NON_PAYE') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider bg-[#f43f5e]/15 text-[#f43f5e] dark:text-[#fb7185] border border-[#f43f5e]/35 animate-pulse-subtle">
          <AlertTriangle className="w-3 h-3 text-[#f43f5e]" />
          Impayé • Régularisation
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider bg-neutral-100 dark:bg-white/[0.05] text-neutral-500 border border-neutral-200 dark:border-white/10">
        Sans Abonnement
      </span>
    );
  };

  const getCardBorderClass = (member: Member) => {
    if (member.paymentStatut === 'NON_PAYE') {
      return 'border-[#f43f5e]/40 dark:border-[#f43f5e]/30 shadow-[0_0_20px_-5px_rgba(244,63,94,0.15)]';
    }
    if (member.paymentStatut === 'EN_ATTENTE') {
      return 'border-[#c87a32]/40 dark:border-[#c87a32]/30 shadow-[0_0_20px_-5px_rgba(200,122,50,0.12)]';
    }
    if (member.activePlanName?.includes('VIP') || member.activePlanName?.includes('Annuel')) {
      return 'border-[#c5a880]/50 dark:border-[#c5a880]/40 shadow-[0_0_20px_-5px_rgba(197,168,128,0.15)]';
    }
    return 'border-neutral-200/90 dark:border-white/[0.08]';
  };

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Header Banner — Architectural Luxury */}
      <div className="relative overflow-hidden rounded-3xl border border-neutral-200/90 dark:border-white/[0.08] bg-white dark:bg-[#111215] p-8 sm:p-10 shadow-[0_4px_30px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_30px_-4px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full border border-bronze bg-bronze-subtle text-[10px] font-heading font-bold tracking-[0.2em] uppercase text-neutral-900 dark:text-white">
              <Users className="w-3.5 h-3.5 text-bronze" />
              Registre Officiel • HADID Byrsa
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-neutral-900 dark:text-white tracking-tight uppercase">
              Fichier des Adhérents
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-2xl font-light leading-relaxed">
              Consultez le statut comptable des membres, la validité de leurs forfaits et régularisez les cotisations en temps réel.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportCSV}
              className="px-4 py-2.5 rounded-xl border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-[#111215] text-xs font-heading font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>

            {isAdmin && (
              <ShinyButton onClick={() => setIsModalOpen(true)} variant="primary">
                <UserPlus className="w-4 h-4" />
                Inscrire un Membre
              </ShinyButton>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs, Search Bar & View Mode Toggle */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-[#111215] border border-neutral-200/90 dark:border-white/[0.08] text-neutral-900 dark:text-white placeholder-neutral-400 text-xs focus:outline-none focus:border-[#c5a880] dark:focus:border-[#c5a880]/50 transition-colors"
          />
        </div>

        {/* Dynamic Category Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1 p-1 rounded-2xl bg-white dark:bg-[#111215] border border-neutral-200/90 dark:border-white/[0.08] shadow-sm">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3.5 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider cursor-pointer transition-all ${
                statusFilter === 'ALL'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Tous ({members.length})
            </button>
            <button
              onClick={() => setStatusFilter('PAID')}
              className={`px-3.5 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider cursor-pointer transition-all flex items-center gap-1.5 ${
                statusFilter === 'PAID'
                  ? 'bg-[#758a7b] text-white shadow-sm'
                  : 'text-[#758a7b] dark:text-[#a3b8a9] hover:bg-[#758a7b]/10'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#758a7b]" />
              À Jour ({paidCount})
            </button>
            <button
              onClick={() => setStatusFilter('UNPAID')}
              className={`px-3.5 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider cursor-pointer transition-all flex items-center gap-1.5 ${
                statusFilter === 'UNPAID'
                  ? 'bg-[#f43f5e] text-white shadow-sm'
                  : 'text-[#f43f5e] dark:text-[#fb7185] hover:bg-[#f43f5e]/10'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e] animate-ping" />
              Impayés ({unpaidCount})
            </button>
            <button
              onClick={() => setStatusFilter('WITHOUT_PLAN')}
              className={`px-3.5 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider cursor-pointer transition-all ${
                statusFilter === 'WITHOUT_PLAN'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Sans Forfait ({withoutPlanCount})
            </button>
          </div>

          {/* Toggle Cards / Table */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-white dark:bg-[#111215] border border-neutral-200/90 dark:border-white/[0.08] shadow-sm">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950'
                  : 'text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
              title="Affichage Cartes Individuelles"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950'
                  : 'text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
              title="Affichage Tableau Haute Densité"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Visual Cards Mode */}
      {viewMode === 'cards' ? (
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMembers.map((m) => {
            const isUnpaid = m.paymentStatut === 'NON_PAYE' || m.paymentStatut === 'EN_ATTENTE';
            const isVip = m.activePlanName?.includes('VIP') || m.activePlanName?.includes('Annuel');

            return (
              <SpotlightCard
                key={m.id}
                className={`anime-member-card luxury-card p-7 sm:p-8 flex flex-col justify-between space-y-7 rounded-3xl ${getCardBorderClass(m)}`}
              >
                {/* Card Top: Avatar, Name, ID & Delete */}
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      {/* Avatar Monogram */}
                      <div
                        className={`w-13 h-13 rounded-2xl flex items-center justify-center font-heading font-black text-sm tracking-widest shadow-inner ${
                          m.paymentStatut === 'NON_PAYE'
                            ? 'bg-[#f43f5e]/15 text-[#f43f5e] border border-[#f43f5e]/30'
                            : m.paymentStatut === 'EN_ATTENTE'
                            ? 'bg-[#c87a32]/15 text-[#c87a32] border border-[#c87a32]/35'
                            : isVip
                            ? 'bg-[#c5a880]/20 text-[#c5a880] border border-[#c5a880]/40'
                            : 'bg-[#758a7b]/15 text-[#758a7b] dark:text-[#a3b8a9] border border-[#758a7b]/30'
                        }`}
                      >
                        {m.nomComplet.substring(0, 2).toUpperCase()}
                      </div>

                      <div className="space-y-0.5">
                        <div className="font-heading font-black text-neutral-900 dark:text-white text-base uppercase tracking-tight">
                          {m.nomComplet}
                        </div>
                        <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                          <span>CFT-{String(m.id).padStart(4, '0')}</span>
                          {m.statut === 'SUSPENDU' && (
                            <span className="text-[9px] font-heading font-bold text-amber-500 uppercase px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                              Compte Suspendu
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          if (confirm(`Confirmer la suppression du profil ${m.nomComplet} ?`)) {
                            onDeleteMember(m.id);
                          }
                        }}
                        className="p-2 rounded-xl text-neutral-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Supprimer ce membre"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-white/[0.06] flex items-center justify-between">
                    {getStatusBadge(m)}
                    {m.activePlanName && (
                      <span
                        className={`text-[10px] font-heading font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                          isVip
                            ? 'text-[#c5a880] bg-[#c5a880]/10 border border-[#c5a880]/30'
                            : 'text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-white/[0.04]'
                        }`}
                      >
                        {isVip ? 'PREMIUM VIP' : 'STANDARD'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Contact & Forfait Details */}
                <div className="space-y-3 text-xs text-neutral-600 dark:text-neutral-300 font-light border-t border-neutral-100 dark:border-white/[0.06] pt-4">
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-3.5 h-3.5 text-[#c5a880] flex-shrink-0" />
                    <span className="truncate">{m.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-3.5 h-3.5 text-[#c5a880] flex-shrink-0" />
                    <span>{m.telephone || 'Non renseigné'}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-light">Forfait Actif :</span>
                    <span className="font-heading font-bold text-xs uppercase text-neutral-900 dark:text-white">
                      {m.activePlanName || 'Aucun abonnement'}
                    </span>
                  </div>
                </div>

                {/* Card Footer: Date & Quick Actions */}
                <div className="pt-4 border-t border-neutral-100 dark:border-white/[0.06] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
                    Inscrit le {m.createdAt ? m.createdAt.slice(0, 10) : '2026-11-01'}
                  </span>

                  {/* 1-Click Settle Button if Unpaid or Pending */}
                  {isAdmin && isUnpaid ? (
                    <button
                      onClick={() => setSettleModalMember(m)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#c87a32] to-[#c5a880] hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      Régler Cotisation
                    </button>
                  ) : (
                    <span className="text-[10px] font-mono text-emerald-500 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Badge RFID Validé
                    </span>
                  )}
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      ) : (
        /* High-Density Table View */
        <div className="rounded-3xl border border-neutral-200/90 dark:border-white/[0.08] bg-white dark:bg-[#111215] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-white/[0.02] text-neutral-500 font-heading font-bold uppercase tracking-wider border-b border-neutral-100 dark:border-white/[0.06]">
                <tr>
                  <th className="py-4 px-6">Membre & Identifiant</th>
                  <th className="py-4 px-4">Contact</th>
                  <th className="py-4 px-4">Statut Cotisation</th>
                  <th className="py-4 px-4">Forfait Souscrit</th>
                  <th className="py-4 px-4">Montant Caisse</th>
                  <th className="py-4 px-4">Inscription</th>
                  {isAdmin && <th className="py-4 px-6 text-right">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-white/[0.06] text-neutral-700 dark:text-neutral-300">
                {filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-neutral-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-heading font-bold text-sm text-neutral-900 dark:text-white uppercase tracking-tight">
                        {m.nomComplet}
                      </div>
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
                        CFT-{String(m.id).padStart(4, '0')}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-neutral-900 dark:text-white font-medium">{m.email}</div>
                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400">{m.telephone || '—'}</div>
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(m)}</td>
                    <td className="py-4 px-4 font-heading font-bold uppercase text-xs text-neutral-800 dark:text-neutral-200">
                      {m.activePlanName || <span className="text-neutral-500 dark:text-neutral-400 italic">Aucun</span>}
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-neutral-900 dark:text-white">
                      {m.lastPaymentAmount ? `${m.lastPaymentAmount.toFixed(2)} TND` : '—'}
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                      {m.createdAt ? m.createdAt.slice(0, 10) : '2026-11-01'}
                    </td>
                    {isAdmin && (
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {(m.paymentStatut === 'NON_PAYE' || m.paymentStatut === 'EN_ATTENTE') && (
                            <button
                              onClick={() => setSettleModalMember(m)}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-heading font-bold uppercase text-white bg-[#c87a32] hover:bg-[#c87a32]/90 transition-colors"
                            >
                              Encaisser
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (confirm(`Confirmer la suppression de ${m.nomComplet} ?`)) {
                                onDeleteMember(m.id);
                              }
                            }}
                            className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Settle / Record Payment Modal */}
      {settleModalMember && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-settle-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSettleModalMember(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#111215] border border-neutral-200 dark:border-white/10 p-7 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/[0.06] pb-4">
              <div>
                <span className="text-[10px] uppercase font-heading font-bold tracking-[0.2em] text-[#c87a32]">
                  Caisse & Comptabilité
                </span>
                <h3 id="modal-settle-title" className="text-xl font-heading font-black text-neutral-900 dark:text-white uppercase tracking-tight">
                  Encaisser la Cotisation
                </h3>
              </div>
              <button
                onClick={() => setSettleModalMember(null)}
                aria-label="Fermer la fenêtre d'encaissement"
                className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/[0.06] space-y-2">
              <div className="text-xs text-neutral-500">Membre :</div>
              <div className="font-heading font-bold text-sm uppercase text-neutral-900 dark:text-white">
                {settleModalMember.nomComplet}
              </div>
              <div className="text-xs text-neutral-400 font-mono">{settleModalMember.email}</div>
              <div className="pt-2 flex justify-between items-center text-xs">
                <span className="text-neutral-400">Montant Forfait :</span>
                <span className="font-mono font-black text-base text-[#c5a880]">
                  {settleModalMember.lastPaymentAmount
                    ? `${settleModalMember.lastPaymentAmount.toFixed(2)} TND`
                    : '240.00 TND'}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-heading font-bold uppercase tracking-wider text-neutral-400">
                Mode de Règlement
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSettleMethod('ESPECES')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    settleMethod === 'ESPECES'
                      ? 'border-[#c5a880] bg-[#c5a880]/15 text-neutral-900 dark:text-white font-bold'
                      : 'border-neutral-200 dark:border-white/10 text-neutral-400 hover:border-neutral-300'
                  }`}
                >
                  <Banknote className="w-4 h-4 mx-auto mb-1 text-[#c5a880]" />
                  <span className="text-[10px] font-heading uppercase block">Espèces</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSettleMethod('CARTE_BANCAIRE')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    settleMethod === 'CARTE_BANCAIRE'
                      ? 'border-[#c5a880] bg-[#c5a880]/15 text-neutral-900 dark:text-white font-bold'
                      : 'border-neutral-200 dark:border-white/10 text-neutral-400 hover:border-neutral-300'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mx-auto mb-1 text-[#c5a880]" />
                  <span className="text-[10px] font-heading uppercase block">Carte</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSettleMethod('VIREMENT')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    settleMethod === 'VIREMENT'
                      ? 'border-[#c5a880] bg-[#c5a880]/15 text-neutral-900 dark:text-white font-bold'
                      : 'border-neutral-200 dark:border-white/10 text-neutral-400 hover:border-neutral-300'
                  }`}
                >
                  <Landmark className="w-4 h-4 mx-auto mb-1 text-[#c5a880]" />
                  <span className="text-[10px] font-heading uppercase block">Virement</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSettleModalMember(null)}
                className="flex-1 py-3 rounded-xl border border-neutral-200 dark:border-white/10 text-xs font-heading font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
              >
                Annuler
              </button>
              <ShinyButton
                onClick={handleSettlePayment}
                disabled={settleLoading}
                variant="primary"
                className="flex-1 justify-center"
              >
                {settleLoading ? 'Validation...' : 'Valider Paiement'}
              </ShinyButton>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-addmember-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#111215] border border-neutral-200 dark:border-white/10 p-7 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/[0.06] pb-4">
              <div>
                <span className="text-[10px] uppercase font-heading font-bold tracking-[0.2em] text-[#c5a880]">
                  Inscriptions
                </span>
                <h3 id="modal-addmember-title" className="text-xl font-heading font-black text-neutral-900 dark:text-white uppercase tracking-tight">
                  Nouvel Adhérent
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                aria-label="Fermer la fenêtre d'inscription"
                className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-heading font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Nom Complet
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Skander Riahi"
                  value={formData.nomComplet}
                  onChange={(e) => setFormData({ ...formData, nomComplet: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/10 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-heading font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Email de Contact
                </label>
                <input
                  type="email"
                  required
                  placeholder="skander.riahi@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/10 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-heading font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Téléphone Portable
                </label>
                <input
                  type="tel"
                  placeholder="+216 20 123 456"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/10 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-heading font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Forfait Initial
                </label>
                <select
                  value={formData.initialPlanId}
                  onChange={(e) => setFormData({ ...formData, initialPlanId: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/10 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-[#c5a880]"
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id} className="bg-neutral-900 text-white">
                      {p.nom} — {p.prix} TND ({p.dureeMois} mois)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-neutral-200 dark:border-white/10 text-xs font-heading font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <ShinyButton type="submit" disabled={loading} variant="primary" className="flex-1 justify-center">
                  {loading ? 'Création...' : 'Créer le Compte'}
                </ShinyButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
