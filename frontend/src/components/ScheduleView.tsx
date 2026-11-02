import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  AlertCircle,
  Plus,
  Search,
  UserCheck,
  MapPin,
  Sparkles,
} from 'lucide-react';
import type { ClassSession, Member, FitnessClass } from '../types';
import { SpotlightCard } from './ui/SpotlightCard';
import { ShinyButton } from './ui/ShinyButton';
import { useAnimeEntrance } from '../utils/animeAnimations';

interface ScheduleViewProps {
  sessions: ClassSession[];
  members: Member[];
  classes: FitnessClass[];
  selectedSessionForBooking: ClassSession | null;
  onCloseBookingModal: () => void;
  onOpenBookingModal: (session: ClassSession) => void;
  onBookSession: (sessionId: number, memberId: number) => Promise<void>;
  onCreateSession: (data: { classId: number; coachId: number; salle: string; dateHeureDebut: string; dateHeureFin: string }) => Promise<void>;
  currentUser?: Member | null;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  sessions,
  members,
  classes,
  selectedSessionForBooking,
  onCloseBookingModal,
  onOpenBookingModal,
  onBookSession,
  onCreateSession,
  currentUser,
}) => {
  const containerRef = useAnimeEntrance<HTMLDivElement>('.anime-item', [sessions.length]);
  const isMemberRole = currentUser?.role === 'MEMBER';
  const [selectedMemberId, setSelectedMemberId] = useState<number>(() => {
    if (currentUser?.id) return currentUser.id;
    return members.length > 0 ? members[0].id : 1;
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDay, setSelectedDay] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [sessionFormData, setSessionFormData] = useState({
    classId: classes.length > 0 ? classes[0].id : 1,
    coachId: currentUser?.role === 'COACH' ? currentUser.id : 2,
    salle: 'Dojo & Ring 1',
    dateHeureDebut: '2026-11-04T18:00',
    dateHeureFin: '2026-11-04T19:15',
  });

  // Check if room has an overlapping reservation
  const isRoomConflict = sessions.some((s) => {
    if (s.statut === 'ANNULEE') return false;
    if (s.salle !== sessionFormData.salle) return false;
    if (!s.dateHeureDebut || !s.dateHeureFin) return false;
    const startA = new Date(s.dateHeureDebut).getTime();
    const endA = new Date(s.dateHeureFin).getTime();
    const startB = new Date(sessionFormData.dateHeureDebut).getTime();
    const endB = new Date(sessionFormData.dateHeureFin).getTime();
    return startA < endB && endA > startB;
  });

  // Conflicting session info
  const conflictingSession = isRoomConflict
    ? sessions.find((s) => {
        if (s.statut === 'ANNULEE' || s.salle !== sessionFormData.salle) return false;
        const startA = new Date(s.dateHeureDebut).getTime();
        const endA = new Date(s.dateHeureFin).getTime();
        const startB = new Date(sessionFormData.dateHeureDebut).getTime();
        const endB = new Date(sessionFormData.dateHeureFin).getTime();
        return startA < endB && endA > startB;
      })
    : null;

  const categories = [
    { id: 'ALL', label: 'Toutes disciplines' },
    { id: 'ARTS_MARTIAUX', label: 'Arts Martiaux & Boxe' },
    { id: 'FORCE', label: 'Plateau Force & WOD' },
    { id: 'BIEN_ETRE', label: 'Sanctuaire Yoga' },
    { id: 'CARDIO', label: 'Suite Cardio Precision' },
  ];

  const days = [
    { id: 'ALL', label: 'Tous les jours' },
    { id: 'Lun', label: 'Lun' },
    { id: 'Mar', label: 'Mar' },
    { id: 'Mer', label: 'Mer' },
    { id: 'Jeu', label: 'Jeu' },
    { id: 'Ven', label: 'Ven' },
    { id: 'Sam', label: 'Sam' },
    { id: 'Dim', label: 'Dim' },
  ];

  const filteredSessions = sessions.filter((s) => {
    const cls = classes.find((c) => c.id === s.classId);
    const matchesCategory = selectedCategory === 'ALL' || (cls && cls.categorie === selectedCategory);
    const matchesSearch =
      (s.classTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (s.coachName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (s.salle?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    let matchesDay = true;
    if (selectedDay !== 'ALL' && s.dateHeureDebut) {
      const d = new Date(s.dateHeureDebut);
      const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
      matchesDay = dayNames[d.getDay()] === selectedDay;
    }

    return matchesCategory && matchesSearch && matchesDay;
  });

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSessionForBooking) return;
    try {
      setBookingLoading(true);
      await onBookSession(selectedSessionForBooking.id, Number(selectedMemberId));
      onCloseBookingModal();
    } catch {
      // Handled in parent
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCreateSessionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onCreateSession({
        classId: Number(sessionFormData.classId),
        coachId: Number(sessionFormData.coachId),
        salle: sessionFormData.salle,
        dateHeureDebut: sessionFormData.dateHeureDebut,
        dateHeureFin: sessionFormData.dateHeureFin,
      });
      setIsNewSessionModalOpen(false);
    } catch {
      // Handled in parent
    }
  };

  return (
    <div ref={containerRef} className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="anime-item relative overflow-hidden rounded-3xl border border-neutral-200/90 dark:border-white/[0.08] bg-white dark:bg-[#111215] p-8 sm:p-10 shadow-[0_4px_30px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_30px_-4px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full border border-bronze bg-bronze-subtle text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-900 dark:text-white">
              <Calendar className="w-3.5 h-3.5 text-bronze" />
              Grille Officielle des Studios • HADID Byrsa
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight uppercase">
              Planning & Réservations
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-2xl font-light leading-relaxed">
              Consultez les créneaux supervisés par nos coachs certifiés. Contrôle instantané de capacité et réservation directe liée à votre abonnement.
            </p>
          </div>

          {!isMemberRole && (
            <ShinyButton
              onClick={() => setIsNewSessionModalOpen(true)}
              variant="primary"
            >
              <Plus className="w-4 h-4" />
              Programmer une Séance
            </ShinyButton>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="anime-item space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === c.id
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                    : 'bg-white dark:bg-[#111215] border border-neutral-200/90 dark:border-white/[0.08] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Filtrer cours, coach, studio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#111215] border border-neutral-200/90 dark:border-white/[0.08] text-neutral-900 dark:text-white placeholder-neutral-400 text-xs focus:outline-none focus:border-neutral-400 dark:focus:border-white/30 transition-colors"
            />
          </div>
        </div>

        {/* Day Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white dark:bg-[#111215] border border-neutral-200/90 dark:border-white/[0.08] w-fit overflow-x-auto shadow-sm">
          {days.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDay(d.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedDay === d.id
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Sessions with SpotlightCard */}
      {filteredSessions.length === 0 ? (
        <div className="anime-item p-16 rounded-3xl bg-white dark:bg-[#111215] border border-neutral-200/90 dark:border-white/[0.08] text-center space-y-3 shadow-sm">
          <Calendar className="w-12 h-12 text-neutral-400 mx-auto" />
          <p className="text-neutral-600 dark:text-neutral-400 font-light text-sm">
            Aucun créneau ne correspond aux critères sélectionnés.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setSelectedDay('ALL');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-white/[0.05] text-neutral-900 dark:text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((s) => {
            const booked = s.totalBookings ?? 0;
            const max = s.capaciteMax ?? 20;
            const isFull = booked >= max;
            const percentage = Math.min(100, Math.round((booked / max) * 100));

            return (
              <SpotlightCard
                key={s.id}
                className="anime-item p-6 sm:p-7 flex flex-col justify-between"
              >
                <div className="space-y-5">
                  {/* Header card */}
                  <div className="flex items-start justify-between gap-2 border-b border-neutral-100 dark:border-white/[0.06] pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-[0.18em] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-white/[0.05] border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300">
                          Séance #{s.id}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400 uppercase">
                          {s.salle}
                        </span>
                      </div>
                      <h3 className="mt-2 text-lg font-bold text-neutral-900 dark:text-white uppercase tracking-tight">
                        {s.classTitle}
                      </h3>
                    </div>
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 ${
                        isFull
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          : 'bg-neutral-100 dark:bg-white/[0.05] text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-white/10'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isFull ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                      {isFull ? 'Complet' : `${max - booked} dispo`}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400 font-light">
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-neutral-400" />
                      <span>{s.dateHeureDebut ? s.dateHeureDebut.replace('T', ' à ') : ''}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <User className="w-4 h-4 text-neutral-400" />
                      <span>Coach : <strong className="text-neutral-900 dark:text-white font-medium">{s.coachName}</strong></span>
                    </div>
                  </div>

                  {/* Capacity progress */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-xs font-mono text-neutral-500 mb-1.5">
                      <span>Jauge d'accès</span>
                      <span className={percentage >= 90 ? 'text-amber-500 font-bold' : 'text-neutral-700 dark:text-neutral-300'}>
                        {booked} / {max} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-1 rounded-full bg-neutral-100 dark:bg-white/[0.08] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          percentage >= 90 ? 'bg-amber-500' : 'bg-neutral-900 dark:bg-white'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom action */}
                <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-white/[0.06] flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Accès Garanti</span>
                  <ShinyButton
                    disabled={isFull}
                    onClick={() => onOpenBookingModal(s)}
                    variant={isFull ? 'secondary' : 'primary'}
                    className="py-1.5 px-3.5 text-xs"
                  >
                    {isFull ? 'Complet' : 'Réserver'}
                  </ShinyButton>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      )}

      {/* Booking Modal */}
      {selectedSessionForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#111215] border border-neutral-200/90 dark:border-white/10 p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/[0.06] pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-400">Réservation</span>
                <h3 className="text-lg font-black text-neutral-900 dark:text-white uppercase tracking-tight">
                  {selectedSessionForBooking.classTitle}
                </h3>
                <p className="text-xs text-neutral-500 font-light mt-0.5">
                  Studio : {selectedSessionForBooking.salle} • Coach {selectedSessionForBooking.coachName}
                </p>
              </div>
              <button
                onClick={onCloseBookingModal}
                className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-500 mb-2">
                  {isMemberRole ? "Bénéficiaire" : "Sélectionner l'adhérent"}
                </label>
                {isMemberRole && currentUser ? (
                  <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/10">
                    <p className="font-bold text-neutral-900 dark:text-white text-sm">{currentUser.nomComplet}</p>
                    <p className="text-xs text-neutral-500 font-mono">{currentUser.email}</p>
                  </div>
                ) : (
                  <select
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-xs focus:outline-none focus:border-neutral-400"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nomComplet} ({m.email}) — Forfait : {m.activePlanName || 'Actif'}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/10 text-xs text-neutral-500 font-light space-y-1">
                <div className="flex items-center gap-1.5 text-neutral-900 dark:text-white font-semibold text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5 text-neutral-400" /> Validation Métier Java
                </div>
                <p>
                  Vérification atomique en base MySQL : absence de doublon et respect strict du plafond de capacité du studio.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-100 dark:border-white/[0.06]">
                <button
                  type="button"
                  onClick={onCloseBookingModal}
                  className="px-4 py-2 rounded-xl text-neutral-600 dark:text-neutral-400 text-xs font-semibold hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <ShinyButton type="submit" disabled={bookingLoading} variant="primary">
                  {bookingLoading ? 'Validation en cours...' : 'Confirmer la Réservation'}
                </ShinyButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Session Modal */}
      {isNewSessionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#111215] border border-neutral-200/90 dark:border-white/10 p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/[0.06] pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-400">Administration</span>
                <h3 className="text-lg font-black text-neutral-900 dark:text-white uppercase tracking-tight">
                  Programmer un Nouveau Créneau
                </h3>
              </div>
              <button
                onClick={() => setIsNewSessionModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSessionSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-500 mb-1.5">
                  Discipline / Cours :
                </label>
                <select
                  value={sessionFormData.classId}
                  onChange={(e) => setSessionFormData({ ...sessionFormData, classId: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-400"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.titre} ({c.categorie} — Capacité : {c.capaciteMax} pers.)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-heading font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Coach Responsable :
                  </label>
                  {currentUser?.role === 'COACH' ? (
                    <div className="w-full px-3 py-2.5 rounded-xl bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/10 text-xs text-neutral-900 dark:text-white font-heading font-bold">
                      {currentUser.nomComplet}
                      <span className="block text-[10px] font-mono text-[#c5a880] font-normal">
                        Spécialité : {currentUser.specialite || 'Coach Titulaire'}
                      </span>
                    </div>
                  ) : (
                    <select
                      value={sessionFormData.coachId}
                      onChange={(e) => setSessionFormData({ ...sessionFormData, coachId: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-400"
                    >
                      <option value={2}>Karim Ben Ali (Haltérophilie / Force)</option>
                      <option value={3}>Sarah Mansour (Yoga / Pilates)</option>
                      <option value={4}>Walid Gharbi (Cross-Training / WOD)</option>
                      <option value={15}>Yassine Dridi (Boxe & Muay Thai)</option>
                      <option value={16}>Nour Mehrez (Réathlétisation)</option>
                      <option value={17}>Sami Karray (Spinning RPM)</option>
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-heading font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Studio :
                  </label>
                  <select
                    value={sessionFormData.salle}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, salle: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-400"
                  >
                    <option value="Dojo & Ring 1">02. Dojo & Ring Officiel</option>
                    <option value="Plateau Force & Haltéro">01. Plateau Force & Haltéro</option>
                    <option value="Sanctuaire Yoga & Recovery">03. Sanctuaire Yoga</option>
                    <option value="Suite Cardio Precision">04. Suite Cardio Precision</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-heading font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Date & Heure Début :
                  </label>
                  <input
                    type="datetime-local"
                    value={sessionFormData.dateHeureDebut}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, dateHeureDebut: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-heading font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Date & Heure Fin :
                  </label>
                  <input
                    type="datetime-local"
                    value={sessionFormData.dateHeureFin}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, dateHeureFin: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-400"
                  />
                </div>
              </div>

              {/* Studio Availability Status Banner */}
              <div
                className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 ${
                  isRoomConflict
                    ? 'border-[#f43f5e]/40 bg-[#f43f5e]/10 text-[#f43f5e]'
                    : 'border-[#758a7b]/40 bg-[#758a7b]/10 text-[#758a7b] dark:text-[#a3b8a9]'
                }`}
              >
                <div className="font-heading font-bold text-xs uppercase tracking-wide">
                  {isRoomConflict ? (
                    <div>
                      ⚠️ Collision Studio : Le studio "{sessionFormData.salle}" est déjà réservé par{' '}
                      <strong>{conflictingSession?.coachName || 'un coach'}</strong> pour "
                      {conflictingSession?.classTitle || 'une séance'}" sur cette plage.
                    </div>
                  ) : (
                    <div>✅ Studio Disponible : Aucun créneau en conflit pour cette salle.</div>
                  )}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-100 dark:border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setIsNewSessionModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-neutral-600 dark:text-neutral-400 text-xs font-semibold hover:text-neutral-900 dark:hover:text-white"
                >
                  Annuler
                </button>
                <ShinyButton type="submit" disabled={isRoomConflict} variant="primary">
                  {isRoomConflict ? 'Studio Indisponible' : 'Confirmer la Réservation'}
                </ShinyButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
