import React, { useState } from 'react';
import { X, Search, CheckCircle2, ShieldCheck, UserCheck } from 'lucide-react';
import { Member } from '../../types';
import { ShinyButton } from './ShinyButton';

interface QuickCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
}

export const QuickCheckInModal: React.FC<QuickCheckInModalProps> = ({ isOpen, onClose, members }) => {
  const [query, setQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [checkInSuccess, setCheckInSuccess] = useState(false);

  if (!isOpen) return null;

  const filteredMembers = query.trim()
    ? members.filter(
        (m) =>
          m.nomComplet.toLowerCase().includes(query.toLowerCase()) ||
          m.email.toLowerCase().includes(query.toLowerCase()) ||
          String(m.id).includes(query)
      )
    : members.slice(0, 5);

  const handleConfirmCheckIn = () => {
    if (!selectedMember) return;
    setCheckInSuccess(true);
    setTimeout(() => {
      setCheckInSuccess(false);
      setSelectedMember(null);
      setQuery('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#111215] border border-neutral-200/90 dark:border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-white/[0.05] border border-neutral-200 dark:border-white/10 flex items-center justify-center text-neutral-900 dark:text-white">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-400">Contrôle d'Accès</span>
              <h3 className="text-lg font-black text-neutral-900 dark:text-white uppercase tracking-tight">
                Borne de Pointage NFC / RFID
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-sm"
          >
            ✕
          </button>
        </div>

        {checkInSuccess ? (
          <div className="py-8 text-center space-y-3 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-neutral-100 dark:bg-white/[0.05] border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-emerald-500" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-emerald-500">Accès Autorisé</span>
              <h4 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight mt-1">
                Bienvenue, {selectedMember?.nomComplet}
              </h4>
              <p className="text-xs text-neutral-500 font-light mt-1">
                Abonnement : <strong className="text-neutral-900 dark:text-white font-medium">{selectedMember?.activePlanName ?? 'Formule Standard'}</strong> • Badge Validé
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Scanner badge RFID ou chercher par nom / email..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200 dark:border-white/10 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-white/30"
              />
            </div>

            {/* Members Quick List */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {filteredMembers.map((m) => {
                const isSelected = selectedMember?.id === m.id;

                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMember(m)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-950 shadow-sm'
                        : 'border-neutral-200/80 dark:border-white/[0.06] bg-neutral-50/50 dark:bg-white/[0.02] hover:border-neutral-300 dark:hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold uppercase">{m.nomComplet}</div>
                      <div className={`text-[10px] font-mono ${isSelected ? 'opacity-70' : 'text-neutral-400'}`}>
                        CFT-2026-{String(m.id).padStart(4, '0')} • {m.email}
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                          isSelected
                            ? 'border-current opacity-80'
                            : 'border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300'
                        }`}
                      >
                        {m.activePlanName || 'Actif'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-neutral-100 dark:border-white/[0.06] flex items-center justify-between">
              <span className="text-[10px] font-mono text-neutral-400">
                {selectedMember ? `Adhérent sélectionné : #${selectedMember.id}` : 'Sélectionnez un adhérent'}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:hover:text-white text-xs font-semibold"
                >
                  Annuler
                </button>
                <ShinyButton
                  disabled={!selectedMember}
                  onClick={handleConfirmCheckIn}
                  variant="primary"
                >
                  Valider le Passage
                </ShinyButton>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
