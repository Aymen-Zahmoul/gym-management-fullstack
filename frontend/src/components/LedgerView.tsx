import React, { useState } from 'react';
import {
  Receipt,
  CreditCard,
  Banknote,
  Landmark,
  Download,
  Search,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import type { Payment } from '../types';
import { SpotlightCard } from './ui/SpotlightCard';
import { ShinyButton } from './ui/ShinyButton';
import { useAnimeEntrance } from '../utils/animeAnimations';

interface LedgerViewProps {
  payments: Payment[];
}

const exportPaymentsToCSV = (payments: Payment[]) => {
  const headers = ['Reference', 'Adherent', 'Date Reglement', 'Mode de Paiement', 'Montant (TND)', 'Statut'];
  const rows = payments.map((p) => [
    `"${p.reference}"`,
    `"${p.userName || ''}"`,
    `"${p.datePaiement || ''}"`,
    p.modePaiement,
    Number(p.montant).toFixed(2),
    p.statut,
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  const today = new Date().toISOString().slice(0, 10);
  link.setAttribute('download', `journal_caisse_carthage_fitness_${today}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const LedgerView: React.FC<LedgerViewProps> = ({ payments }) => {
  const containerRef = useAnimeEntrance<HTMLDivElement>('.anime-item', [payments.length]);
  const [methodFilter, setMethodFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredPayments = payments.filter((p) => {
    const matchesMethod = methodFilter === 'ALL' || p.modePaiement === methodFilter;
    const matchesSearch =
      (p.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (p.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    return matchesMethod && matchesSearch;
  });

  const totalRevenue = filteredPayments.reduce((acc, p) => acc + Number(p.montant), 0);
  const avgAmount = filteredPayments.length > 0 ? totalRevenue / filteredPayments.length : 0;

  const exportCSV = () => {
    exportPaymentsToCSV(filteredPayments);
  };

  const getMethodBadge = (m: string) => {
    switch (m) {
      case 'CARTE_BANCAIRE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider bg-neutral-100 dark:bg-white/[0.05] text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-white/10">
            <CreditCard className="w-3 h-3 text-neutral-500" /> Carte Bancaire
          </span>
        );
      case 'ESPECES':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider bg-neutral-100 dark:bg-white/[0.05] text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-white/10">
            <Banknote className="w-3 h-3 text-neutral-500" /> Espèces Guichet
          </span>
        );
      case 'VIREMENT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider bg-neutral-100 dark:bg-white/[0.05] text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-white/10">
            <Landmark className="w-3 h-3 text-neutral-500" /> Virement Bancaire
          </span>
        );
      default:
        return <span className="text-xs text-neutral-500">{m}</span>;
    }
  };

  return (
    <div ref={containerRef} className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="anime-item relative overflow-hidden rounded-3xl border border-neutral-200/90 dark:border-white/[0.08] bg-white dark:bg-[#111215] p-8 sm:p-10 shadow-[0_4px_30px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_30px_-4px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full border border-bronze bg-bronze-subtle text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-900 dark:text-white">
              <Receipt className="w-3.5 h-3.5 text-bronze" />
              Journal Financier • HADID Byrsa
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight uppercase">
              Livre de Caisse & Règlements
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-2xl font-light leading-relaxed">
              Traçabilité comptable et audit des encaissements par carte bancaire, espèces et virements en Dinars Tunisiens (TND).
            </p>
          </div>

          <ShinyButton onClick={exportCSV} variant="secondary">
            <Download className="w-4 h-4" />
            Exporter CSV (Comptabilité)
          </ShinyButton>
        </div>
      </div>

      {/* Metrics Row with SpotlightCard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <SpotlightCard className="anime-item p-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                Total Encaissé
              </span>
              <p className="text-3xl font-black font-mono text-neutral-900 dark:text-white mt-1">
                {totalRevenue.toFixed(2)} <span className="text-sm font-light text-neutral-400">TND</span>
              </p>
              <p className="text-[11px] text-neutral-500 font-light mt-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Certifié en BDD
              </p>
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
                Transactions Validées
              </span>
              <p className="text-3xl font-black font-mono text-neutral-900 dark:text-white mt-1">
                {filteredPayments.length}
              </p>
              <p className="text-[11px] text-neutral-500 font-light mt-1">Reçus de paiement émis</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200/90 dark:border-white/10 flex items-center justify-center text-neutral-800 dark:text-neutral-200">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
        </SpotlightCard>

        <SpotlightCard className="anime-item p-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                Panier Moyen
              </span>
              <p className="text-3xl font-black font-mono text-neutral-900 dark:text-white mt-1">
                {avgAmount.toFixed(2)} <span className="text-sm font-light text-neutral-400">TND</span>
              </p>
              <p className="text-[11px] text-neutral-500 font-light mt-1 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Conforme prévisions
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200/90 dark:border-white/10 flex items-center justify-center text-neutral-800 dark:text-neutral-200">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
        </SpotlightCard>
      </div>

      {/* Filter and Search Bar */}
      <div className="anime-item flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Filtrer par référence ou nom d'adhérent..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#111215] border border-neutral-200/90 dark:border-white/[0.08] text-neutral-900 dark:text-white placeholder-neutral-400 text-xs focus:outline-none focus:border-neutral-400 dark:focus:border-white/30 transition-colors"
          />
        </div>

        <div className="flex gap-1 p-1 rounded-xl bg-white dark:bg-[#111215] border border-neutral-200/90 dark:border-white/[0.08] shadow-sm">
          {['ALL', 'CARTE_BANCAIRE', 'ESPECES', 'VIREMENT'].map((mode) => (
            <button
              key={mode}
              onClick={() => setMethodFilter(mode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider cursor-pointer transition-all ${
                methodFilter === mode
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {mode === 'ALL' ? 'Tous' : mode.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table with SpotlightCard container */}
      <div className="anime-item rounded-2xl border border-neutral-200/90 dark:border-white/[0.08] bg-white dark:bg-[#111215] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-white/[0.02] text-neutral-500 font-bold uppercase tracking-wider border-b border-neutral-100 dark:border-white/[0.06]">
              <tr>
                <th className="py-3.5 px-6">Référence Transaction</th>
                <th className="py-3.5 px-4">Adhérent Titulaire</th>
                <th className="py-3.5 px-4">Date de Règlement</th>
                <th className="py-3.5 px-4">Mode de Paiement</th>
                <th className="py-3.5 px-4">Montant TTC</th>
                <th className="py-3.5 px-6 text-right">Statut Caisse</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-white/[0.06] text-neutral-700 dark:text-neutral-300">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50/50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-6 font-mono font-bold text-neutral-900 dark:text-white">
                    {p.reference}
                  </td>
                  <td className="py-3.5 px-4 font-medium uppercase">
                    {p.userName || 'Adhérent CFT'}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-500">
                    {p.datePaiement ? p.datePaiement.replace('T', ' à ') : '2026-11-01'}
                  </td>
                  <td className="py-3.5 px-4">
                    {getMethodBadge(p.modePaiement)}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-neutral-900 dark:text-white text-sm">
                    {Number(p.montant).toFixed(2)} <span className="text-[10px] text-neutral-400 font-normal">TND</span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    {p.statut === 'PAYE' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider bg-[#758a7b]/15 text-[#758a7b] dark:text-[#a3b8a9] border border-[#758a7b]/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#758a7b]" />
                        Payé
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider bg-[#c87a32]/15 text-[#c87a32] border border-[#c87a32]/35 animate-pulse-subtle">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c87a32]" />
                        En Attente
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
