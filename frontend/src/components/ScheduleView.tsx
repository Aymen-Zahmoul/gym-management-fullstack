import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  AlertCircle,
  Plus,
  Search,
  UserCheck,
  MapPin,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Grid,
  CalendarDays,
  Send,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Flame,
  Info,
} from 'lucide-react';
import type { ClassSession, Member, FitnessClass, SchedulingRequest } from '../types';
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
  onRequestSchedule?: (data: Partial<SchedulingRequest>) => Promise<void>;
  schedulingRequests?: SchedulingRequest[];
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
  onRequestSchedule,
  schedulingRequests = [],
  currentUser,
}) => {
  const containerRef = useAnimeEntrance<HTMLDivElement>('.anime-schedule-item', [sessions.length]);
  const isMemberRole = currentUser?.role === 'MEMBER';
  const isCoachRole = currentUser?.role === 'COACH';
  const isAdminRole = currentUser?.role === 'ADMIN';

  // 1. Navigation / Display Modes
  // Default to calendar view for Admins & Coaches, list for Members (or switchable)
  const [displayMode, setDisplayMode] = useState<'calendar' | 'cards' | 'requests'>('calendar');
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('week');

  // Calendar Date State (Anchored in November 2026 for project demonstration)
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date(2026, 10, 2)); // 2 Nov 2026 (Monday)

  // Filtering State
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDay, setSelectedDay] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals State
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [isCoachRequestModalOpen, setIsCoachRequestModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<number>(() => {
    if (currentUser?.id) return currentUser.id;
    return members.length > 0 ? members[0].id : 1;
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  // Coach Scheduling Request Form
  const [coachRequestForm, setCoachRequestForm] = useState({
    activite: 'Boxe Anglaise & Sparring',
    classId: 1,
    joursSemaine: ['LUNDI', 'VENDREDI'],
    heureDebut: '17:00',
    heureFin: '19:00',
    dateDebut: '2026-11-09',
    dateFin: '2026-11-30',
    salle: 'Dojo & Ring 1',
    remarques: '',
  });

  // Admin Direct Session Form
  const [sessionFormData, setSessionFormData] = useState({
    classId: classes.length > 0 ? classes[0].id : 1,
    coachId: currentUser?.role === 'COACH' ? currentUser.id : 2,
    salle: 'Dojo & Ring 1',
    dateHeureDebut: '2026-11-04T18:00',
    dateHeureFin: '2026-11-04T19:15',
  });

  // Room Overlap Check for Admin direct creation
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

  // Date Navigation Helpers
  const handlePrevDate = () => {
    const d = new Date(currentDate);
    if (calendarView === 'month') {
      d.setMonth(d.getMonth() - 1);
    } else if (calendarView === 'week') {
      d.setDate(d.getDate() - 7);
    } else {
      d.setDate(d.getDate() - 1);
    }
    setCurrentDate(d);
  };

  const handleNextDate = () => {
    const d = new Date(currentDate);
    if (calendarView === 'month') {
      d.setMonth(d.getMonth() + 1);
    } else if (calendarView === 'week') {
      d.setDate(d.getDate() + 7);
    } else {
      d.setDate(d.getDate() + 1);
    }
    setCurrentDate(d);
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 10, 2));
  };

  // Format Helpers
  const monthNamesFr = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  const dayNamesFr = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const dayShortFr = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  const getWeekDays = (baseDate: Date) => {
    const current = new Date(baseDate);
    // Find Monday (0 is Sunday, 1 is Monday... so if 0, diff = -6, otherwise 1 - day)
    const day = current.getDay();
    const diff = current.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(current.setDate(diff));

    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      week.push(d);
    }
    return week;
  };

  const weekDays = getWeekDays(currentDate);

  // Month grid helpers
  const getMonthDays = (baseDate: Date) => {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const days = [];
    // Day of week of 1st day (Monday = 0, Sunday = 6)
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    // Previous month filler days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // Next month filler days to complete rows of 7
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const monthGridDays = getMonthDays(currentDate);

  // Filter sessions
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

  // Sessions for a specific date
  const getSessionsForDate = (date: Date) => {
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    return sessions.filter((s) => {
      if (!s.dateHeureDebut) return false;
      const dt = new Date(s.dateHeureDebut);
      return dt.getFullYear() === y && dt.getMonth() === m && dt.getDate() === d;
    });
  };

  // Hours range for Week View: 08:00 to 21:00
  const hoursRange = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSessionForBooking) return;
    try {
      setBookingLoading(true);
      await onBookSession(selectedSessionForBooking.id, Number(selectedMemberId));
      onCloseBookingModal();
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

  const handleCoachRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onRequestSchedule) return;
    try {
      setRequestLoading(true);
      await onRequestSchedule({
        coachId: currentUser?.id || 2,
        activite: coachRequestForm.activite,
        classId: coachRequestForm.classId,
        joursSemaine: coachRequestForm.joursSemaine.join(','),
        heureDebut: coachRequestForm.heureDebut,
        heureFin: coachRequestForm.heureFin,
        dateDebut: coachRequestForm.dateDebut,
        dateFin: coachRequestForm.dateFin,
        salle: coachRequestForm.salle,
        remarques: coachRequestForm.remarques,
      });
      setRequestSuccess(true);
      setTimeout(() => {
        setRequestSuccess(false);
        setIsCoachRequestModalOpen(false);
      }, 2000);
    } catch {
      // Handled in parent
    } finally {
      setRequestLoading(false);
    }
  };

  const toggleDaySelection = (dayCode: string) => {
    setCoachRequestForm((prev) => {
      const exists = prev.joursSemaine.includes(dayCode);
      return {
        ...prev,
        joursSemaine: exists
          ? prev.joursSemaine.filter((d) => d !== dayCode)
          : [...prev.joursSemaine, dayCode],
      };
    });
  };

  const categories = [
    { id: 'ALL', label: 'Toutes disciplines' },
    { id: 'ARTS_MARTIAUX', label: 'Arts Martiaux & Boxe' },
    { id: 'FORCE', label: 'Plateau Force & WOD' },
    { id: 'BIEN_ETRE', label: 'Sanctuaire Yoga' },
    { id: 'CARDIO', label: 'Suite Cardio Precision' },
  ];

  return (
    <div ref={containerRef} className="space-y-8 pb-16 font-sans">
      {/* 1. Header Banner */}
      <div className="anime-schedule-item relative overflow-hidden rounded-3xl border border-neutral-200/90 dark:border-white/[0.08] bg-white dark:bg-[#111215] p-8 sm:p-10 shadow-[0_4px_30px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_30px_-4px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full border border-bronze bg-bronze-subtle text-[10px] font-heading font-bold tracking-[0.2em] uppercase text-neutral-800 dark:text-neutral-200">
              <CalendarIcon className="w-3.5 h-3.5 text-bronze" />
              Système de Planification Officiel • HADID Byrsa
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-neutral-900 dark:text-white tracking-tight uppercase">
              Calendrier & Créneaux
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-2xl font-light leading-relaxed">
              Consultez les créneaux supervisés, les studios occupés et les plages disponibles. Les coachs peuvent soumettre des demandes récurrentes soumises à validation administrative.
            </p>
          </div>

          {/* Action Tools */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Coach Scheduling Request Button */}
            {(isCoachRole || isAdminRole) && onRequestSchedule && (
              <button
                onClick={() => setIsCoachRequestModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-bronze hover:bg-bronze-light text-neutral-950 font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
              >
                <Send className="w-4 h-4 text-neutral-950" />
                <span>Demander un Créneau</span>
              </button>
            )}

            {/* Admin Direct Session Creation */}
            {isAdminRole && (
              <ShinyButton onClick={() => setIsNewSessionModalOpen(true)} variant="primary">
                <Plus className="w-4 h-4" />
                Programmer Directement
              </ShinyButton>
            )}
          </div>
        </div>
      </div>

      {/* 2. Central Mode Switcher: Calendar vs Cards List vs Coach Requests */}
      <div className="anime-schedule-item flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center p-1 rounded-2xl bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200/90 dark:border-white/[0.08] w-fit">
          <button
            onClick={() => setDisplayMode('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              displayMode === 'calendar'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Vue Calendrier</span>
          </button>

          <button
            onClick={() => setDisplayMode('cards')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              displayMode === 'cards'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Vue Cartes Grille</span>
          </button>

          {(isCoachRole || isAdminRole) && schedulingRequests.length > 0 && (
            <button
              onClick={() => setDisplayMode('requests')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                displayMode === 'requests'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Demandes Coach ({schedulingRequests.length})</span>
            </button>
          )}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Filtrer cours, coach, studio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#111215] border border-neutral-200/90 dark:border-white/[0.08] text-neutral-900 dark:text-white placeholder-neutral-400 text-xs focus:outline-none focus:border-neutral-400 dark:focus:border-white/30"
          />
        </div>
      </div>

      {/* 3. CALENDAR INTERFACE (Monthly, Weekly, Daily) */}
      {displayMode === 'calendar' && (
        <div className="anime-schedule-item space-y-5">
          {/* Calendar Controls & Navigation Bar */}
          <div className="p-4 rounded-3xl bg-white dark:bg-[#111215] border border-neutral-200/90 dark:border-white/[0.08] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-sm">
            {/* Left: Date Selector Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevDate}
                aria-label="Période précédente"
                className="p-2 rounded-xl border border-neutral-200 dark:border-white/10 hover:border-bronze text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleToday}
                className="px-3.5 py-1.5 rounded-xl border border-neutral-200 dark:border-white/10 text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 hover:border-bronze transition-colors cursor-pointer"
              >
                Aujourd'hui
              </button>

              <button
                onClick={handleNextDate}
                aria-label="Période suivante"
                className="p-2 rounded-xl border border-neutral-200 dark:border-white/10 hover:border-bronze text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="pl-3 font-heading font-black text-base sm:text-lg text-neutral-950 dark:text-white uppercase tracking-tight">
                {calendarView === 'month' && `${monthNamesFr[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
                {calendarView === 'week' && `Semaine du ${weekDays[0].getDate()} ${monthNamesFr[weekDays[0].getMonth()]} au ${weekDays[6].getDate()} ${monthNamesFr[weekDays[6].getMonth()]}`}
                {calendarView === 'day' && `${dayNamesFr[currentDate.getDay()]} ${currentDate.getDate()} ${monthNamesFr[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
              </div>
            </div>

            {/* Right: View Granularity (Mois / Semaine / Jour) */}
            <div className="flex items-center p-1 rounded-2xl bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200/90 dark:border-white/[0.08] w-fit">
              {(['month', 'week', 'day'] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setCalendarView(view)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    calendarView === view
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {view === 'month' ? 'Mois' : view === 'week' ? 'Semaine' : 'Jour'}
                </button>
              ))}
            </div>
          </div>

          {/* 3.A WEEK VIEW (Hourly grid with Occupied vs Available Slots) */}
          {calendarView === 'week' && (
            <div className="overflow-x-auto rounded-3xl border border-neutral-200/90 dark:border-white/[0.08] bg-white dark:bg-[#111215] shadow-sm">
              <div className="min-w-[900px]">
                {/* Column Headers: Days of Week */}
                <div className="grid grid-cols-8 border-b border-neutral-200/90 dark:border-white/[0.08] bg-neutral-50/70 dark:bg-white/[0.02]">
                  <div className="p-3 text-center border-r border-neutral-200/70 dark:border-white/[0.06] text-[10px] font-mono uppercase text-neutral-400 font-bold">
                    Heure
                  </div>
                  {weekDays.map((d, i) => {
                    const isToday =
                      d.getDate() === currentDate.getDate() &&
                      d.getMonth() === currentDate.getMonth() &&
                      d.getFullYear() === currentDate.getFullYear();
                    return (
                      <div
                        key={i}
                        className={`p-3 text-center border-r border-neutral-200/70 dark:border-white/[0.06] last:border-r-0 ${
                          isToday ? 'bg-bronze/10' : ''
                        }`}
                      >
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          {dayShortFr[i]}
                        </span>
                        <span
                          className={`inline-block mt-0.5 text-sm font-black font-mono ${
                            isToday ? 'text-bronze' : 'text-neutral-900 dark:text-white'
                          }`}
                        >
                          {d.getDate()}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Hourly Rows */}
                <div className="divide-y divide-neutral-200/70 dark:divide-white/[0.06]">
                  {hoursRange.map((hour) => (
                    <div key={hour} className="grid grid-cols-8 min-h-[90px]">
                      {/* Hour Label */}
                      <div className="p-2 border-r border-neutral-200/70 dark:border-white/[0.06] text-center font-mono text-xs text-neutral-400 font-semibold flex items-center justify-center bg-neutral-50/40 dark:bg-white/[0.01]">
                        {hour}:00
                      </div>

                      {/* 7 Days Columns */}
                      {weekDays.map((dayDate, dayIdx) => {
                        const daySessions = getSessionsForDate(dayDate).filter((s) => {
                          const dt = new Date(s.dateHeureDebut);
                          return dt.getHours() === hour;
                        });

                        const hasSession = daySessions.length > 0;

                        return (
                          <div
                            key={dayIdx}
                            className={`p-1.5 border-r border-neutral-200/70 dark:border-white/[0.06] last:border-r-0 relative group transition-colors ${
                              hasSession
                                ? 'bg-neutral-50/50 dark:bg-white/[0.01]'
                                : 'hover:bg-neutral-50/70 dark:hover:bg-white/[0.02]'
                            }`}
                          >
                            {hasSession ? (
                              daySessions.map((session) => (
                                <div
                                  key={session.id}
                                  onClick={() => onOpenBookingModal(session)}
                                  className="w-full h-full p-2.5 rounded-2xl bg-[#fbfbfa] dark:bg-[#16171c] border border-bronze/40 hover:border-bronze shadow-sm cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between space-y-1.5"
                                >
                                  <div className="flex items-start justify-between gap-1">
                                    <span className="font-heading font-black text-xs uppercase tracking-tight text-neutral-900 dark:text-white truncate">
                                      {session.classTitle}
                                    </span>
                                    <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[8px] font-mono font-bold uppercase">
                                      {session.statut}
                                    </span>
                                  </div>

                                  <div className="text-[10px] text-neutral-500 space-y-0.5">
                                    <div className="flex items-center gap-1">
                                      <User className="w-3 h-3 text-bronze" />
                                      <span className="truncate">{session.coachName}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3 text-neutral-400" />
                                      <span className="truncate">{session.salle}</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between text-[9px] font-mono text-neutral-400 pt-1 border-t border-neutral-100 dark:border-white/[0.04]">
                                    <span>
                                      {session.dateHeureDebut?.substring(11, 16)} - {session.dateHeureFin?.substring(11, 16)}
                                    </span>
                                    <span className="text-bronze font-bold">
                                      {session.totalBookings || 0}/{session.capaciteMax || 20}
                                    </span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div
                                onClick={() => {
                                  if (isCoachRole || isAdminRole) {
                                    const y = dayDate.getFullYear();
                                    const m = String(dayDate.getMonth() + 1).padStart(2, '0');
                                    const d = String(dayDate.getDate()).padStart(2, '0');
                                    const h = String(hour).padStart(2, '0');
                                    const hEnd = String(hour + 1).padStart(2, '0');

                                    if (isCoachRole) {
                                      setCoachRequestForm((prev) => ({
                                        ...prev,
                                        dateDebut: `${y}-${m}-${d}`,
                                        dateFin: `${y}-${m}-${d}`,
                                        heureDebut: `${h}:00`,
                                        heureFin: `${hEnd}:00`,
                                      }));
                                      setIsCoachRequestModalOpen(true);
                                    } else if (isAdminRole) {
                                      setSessionFormData((prev) => ({
                                        ...prev,
                                        dateHeureDebut: `${y}-${m}-${d}T${h}:00`,
                                        dateHeureFin: `${y}-${m}-${d}T${hEnd}:00`,
                                      }));
                                      setIsNewSessionModalOpen(true);
                                    }
                                  }
                                }}
                                className={`w-full h-full rounded-2xl border border-dashed border-neutral-200 dark:border-white/[0.05] p-2 flex flex-col items-center justify-center text-center opacity-60 hover:opacity-100 transition-opacity ${
                                  isCoachRole || isAdminRole ? 'cursor-pointer hover:border-bronze hover:bg-bronze-subtle' : ''
                                }`}
                              >
                                <span className="text-[9px] font-mono text-neutral-400">
                                  {isCoachRole || isAdminRole ? '+ Créneau Libre' : 'Libre'}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3.B MONTH VIEW (Full Calendar Grid) */}
          {calendarView === 'month' && (
            <div className="rounded-3xl border border-neutral-200/90 dark:border-white/[0.08] bg-white dark:bg-[#111215] overflow-hidden shadow-sm">
              {/* Header Days */}
              <div className="grid grid-cols-7 border-b border-neutral-200/90 dark:border-white/[0.08] bg-neutral-50/70 dark:bg-white/[0.02]">
                {dayShortFr.map((day, idx) => (
                  <div key={idx} className="p-3 text-center text-xs font-bold uppercase tracking-wider text-neutral-400">
                    {day}
                  </div>
                ))}
              </div>

              {/* Day Cells */}
              <div className="grid grid-cols-7 divide-x divide-y divide-neutral-200/70 dark:divide-white/[0.06]">
                {monthGridDays.map((cell, idx) => {
                  const daySessions = getSessionsForDate(cell.date);
                  const isToday =
                    cell.date.getDate() === currentDate.getDate() &&
                    cell.date.getMonth() === currentDate.getMonth() &&
                    cell.date.getFullYear() === currentDate.getFullYear();

                  return (
                    <div
                      key={idx}
                      className={`min-h-[110px] p-2 flex flex-col justify-between transition-colors ${
                        !cell.isCurrentMonth
                          ? 'opacity-35 bg-neutral-50/40 dark:bg-white/[0.01]'
                          : isToday
                          ? 'bg-bronze-subtle'
                          : 'hover:bg-neutral-50/60 dark:hover:bg-white/[0.01]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                            isToday ? 'bg-bronze text-neutral-950' : 'text-neutral-700 dark:text-neutral-300'
                          }`}
                        >
                          {cell.date.getDate()}
                        </span>
                        {daySessions.length > 0 && (
                          <span className="text-[9px] font-mono text-bronze font-bold">
                            {daySessions.length} cours
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 my-1">
                        {daySessions.slice(0, 2).map((s) => (
                          <div
                            key={s.id}
                            onClick={() => onOpenBookingModal(s)}
                            className="p-1 rounded-lg bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200/80 dark:border-white/10 text-[10px] cursor-pointer hover:border-bronze truncate font-bold text-neutral-900 dark:text-white"
                          >
                            <span className="text-bronze mr-1 font-mono">{s.dateHeureDebut?.substring(11, 16)}</span>
                            <span>{s.classTitle}</span>
                          </div>
                        ))}
                        {daySessions.length > 2 && (
                          <span className="text-[9px] font-mono text-neutral-400 block text-center">
                            +{daySessions.length - 2} autres
                          </span>
                        )}
                      </div>

                      {cell.isCurrentMonth && daySessions.length === 0 && (
                        <div className="text-[9px] font-mono text-neutral-400 text-center py-1">
                          Libre
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3.C DAY VIEW (Focused timeline for single date) */}
          {calendarView === 'day' && (
            <div className="space-y-4">
              <div className="p-6 rounded-3xl bg-white dark:bg-[#111215] border border-neutral-200/90 dark:border-white/[0.08] shadow-sm">
                <div className="flex items-center justify-between border-b border-neutral-200/80 dark:border-white/[0.08] pb-4 mb-4">
                  <div>
                    <h2 className="text-xl font-heading font-black text-neutral-900 dark:text-white uppercase tracking-tight">
                      Planning Détaillé • {dayNamesFr[currentDate.getDay()]} {currentDate.getDate()} {monthNamesFr[currentDate.getMonth()]}
                    </h2>
                    <p className="text-xs text-neutral-500 font-light mt-0.5">
                      Occupation continue des studios et disponibilité pour encadrement personnalisé.
                    </p>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-xl bg-bronze/10 border border-bronze/30 text-bronze font-mono font-bold text-xs">
                    {getSessionsForDate(currentDate).length} séances programmées
                  </div>
                </div>

                <div className="divide-y divide-neutral-200/70 dark:divide-white/[0.06]">
                  {hoursRange.map((hour) => {
                    const sessionsAtHour = getSessionsForDate(currentDate).filter((s) => {
                      const dt = new Date(s.dateHeureDebut);
                      return dt.getHours() === hour;
                    });

                    return (
                      <div key={hour} className="py-4 flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="w-20 font-mono font-bold text-sm text-neutral-400">
                          {hour}:00
                        </div>

                        {sessionsAtHour.length > 0 ? (
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                            {sessionsAtHour.map((s) => (
                              <div
                                key={s.id}
                                onClick={() => onOpenBookingModal(s)}
                                className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200/90 dark:border-white/10 hover:border-bronze cursor-pointer transition-all flex items-center justify-between gap-4"
                              >
                                <div className="space-y-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="font-heading font-black text-sm uppercase text-neutral-900 dark:text-white">
                                      {s.classTitle}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold uppercase">
                                      {s.statut}
                                    </span>
                                  </div>
                                  <div className="text-xs text-neutral-500 flex items-center gap-3">
                                    <span className="flex items-center gap-1">
                                      <User className="w-3 h-3 text-bronze" /> {s.coachName}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3 text-neutral-400" /> {s.salle}
                                    </span>
                                  </div>
                                </div>

                                <div className="text-right">
                                  <span className="text-xs font-mono font-bold text-bronze block">
                                    {s.dateHeureDebut?.substring(11, 16)} - {s.dateHeureFin?.substring(11, 16)}
                                  </span>
                                  <span className="text-[10px] text-neutral-400 font-mono">
                                    {s.totalBookings || 0} / {s.capaciteMax || 20} places
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex-1 p-3 rounded-xl border border-dashed border-neutral-200 dark:border-white/[0.06] text-xs font-mono text-neutral-400 flex items-center justify-between">
                            <span>Créneau studio disponible</span>
                            {(isCoachRole || isAdminRole) && (
                              <button
                                onClick={() => {
                                  if (isCoachRole) setIsCoachRequestModalOpen(true);
                                  else setIsNewSessionModalOpen(true);
                                }}
                                className="text-bronze font-bold uppercase text-[10px] hover:underline"
                              >
                                + Réserver ce créneau
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. CARDS GRID VIEW (Original luxury catalogue view) */}
      {displayMode === 'cards' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
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

          {filteredSessions.length === 0 ? (
            <div className="anime-schedule-item p-16 rounded-3xl bg-white dark:bg-[#111215] border border-neutral-200/90 dark:border-white/[0.08] text-center space-y-3">
              <CalendarIcon className="w-12 h-12 text-neutral-400 mx-auto" />
              <p className="text-neutral-600 dark:text-neutral-400 font-light text-sm">
                Aucun cours ne correspond aux filtres sélectionnés.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSessions.map((session) => (
                <SpotlightCard
                  key={session.id}
                  className="anime-schedule-item p-6 rounded-3xl flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg bg-bronze/10 border border-bronze/30 text-bronze text-[10px] font-heading font-black uppercase tracking-wider">
                        {session.classTitle}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold uppercase">
                        {session.statut}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                        <Clock className="w-4 h-4 text-bronze flex-shrink-0" />
                        <span className="font-mono">
                          {session.dateHeureDebut?.substring(0, 10)} • {session.dateHeureDebut?.substring(11, 16)} - {session.dateHeureFin?.substring(11, 16)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                        <User className="w-4 h-4 text-bronze flex-shrink-0" />
                        <span>Coach : {session.coachName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                        <MapPin className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                        <span>{session.salle}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 dark:border-white/[0.08] flex items-center justify-between">
                    <span className="text-xs font-mono text-neutral-500">
                      Capacité : <strong className="text-neutral-900 dark:text-white">{session.totalBookings || 0}</strong> / {session.capaciteMax || 20}
                    </span>
                    <button
                      onClick={() => onOpenBookingModal(session)}
                      className="px-3.5 py-1.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold uppercase tracking-wider hover:bg-bronze transition-colors cursor-pointer"
                    >
                      Réserver
                    </button>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. COACH SCHEDULING REQUESTS LIST TAB */}
      {displayMode === 'requests' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#111215] border border-neutral-200/90 dark:border-white/[0.08] flex items-center justify-between">
            <div>
              <h2 className="text-lg font-heading font-black text-neutral-900 dark:text-white uppercase">
                Suivi des Demandes de Créneaux Déposées
              </h2>
              <p className="text-xs text-neutral-500 font-light mt-0.5">
                Statut officiel d'examen par la direction sportive HADID.
              </p>
            </div>
            {onRequestSchedule && (
              <button
                onClick={() => setIsCoachRequestModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-bronze text-neutral-950 text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
              >
                + Nouvelle Demande
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {schedulingRequests.map((req) => (
              <SpotlightCard key={req.id} className="p-6 rounded-3xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-bronze/10 text-bronze text-xs font-heading font-black uppercase">
                        {req.activite}
                      </span>
                      {req.statut === 'PENDING' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase flex items-center gap-1">
                          <Clock className="w-3 h-3" /> En attente de validation
                        </span>
                      )}
                      {req.statut === 'APPROVED' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Approuvée & Programmée
                        </span>
                      )}
                      {req.statut === 'REJECTED' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Rejetée
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                      <p><strong>Jours :</strong> {req.joursSemaine} • <strong>Horaires :</strong> {req.heureDebut} à {req.heureFin}</p>
                      <p><strong>Période :</strong> {req.dateDebut} au {req.dateFin} • <strong>Studio :</strong> {req.salle}</p>
                      {req.remarques && <p className="italic">"{req.remarques}"</p>}
                      {req.motifRejet && <p className="text-rose-500 font-semibold">Motif de rejet : {req.motifRejet}</p>}
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      )}

      {/* 6. MODAL: Coach Scheduling Request (Recurring Request Workflow) */}
      {isCoachRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-[#121316] border border-neutral-200 dark:border-white/10 p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-bronze/10 border border-bronze/30 text-[9px] font-bold tracking-widest text-bronze uppercase">
                  Workflow Validation Coach
                </div>
                <h3 className="text-xl font-heading font-black text-neutral-900 dark:text-white uppercase tracking-tight mt-1">
                  Demande de Créneau de Cours
                </h3>
              </div>
              <button
                onClick={() => setIsCoachRequestModalOpen(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Informative Disclaimer Banner */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-400 text-xs flex items-start gap-2.5">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Procédure officielle :</strong> La soumission de ce formulaire enregistre une demande auprès de l'administrateur. Le créneau n'est pas bloqué tant que la demande n'a pas été officiellement validée.
              </span>
            </div>

            {requestSuccess ? (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="font-heading font-black text-lg text-neutral-900 dark:text-white uppercase">
                  Demande Enregistrée !
                </h4>
                <p className="text-xs text-neutral-500">
                  Elle est transmise à l'administrateur pour vérification des conflits et validation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCoachRequestSubmit} className="space-y-4 text-xs">
                {/* Activity & Room */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Activité / Discipline
                    </label>
                    <select
                      value={coachRequestForm.activite}
                      onChange={(e) => setCoachRequestForm({ ...coachRequestForm, activite: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white font-medium"
                    >
                      <option value="Boxe Anglaise & Sparring">Boxe Anglaise & Sparring</option>
                      <option value="CrossFit WOD Haute Intensité">CrossFit WOD Haute Intensité</option>
                      <option value="Vinyasa Power Yoga">Vinyasa Power Yoga</option>
                      <option value="Spinning Indoor Cycling">Spinning Indoor Cycling</option>
                      <option value="Haltérophilie & Powerlifting">Haltérophilie & Powerlifting</option>
                      <option value="Pilates & Core Training">Pilates & Core Training</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Studio Demandé
                    </label>
                    <select
                      value={coachRequestForm.salle}
                      onChange={(e) => setCoachRequestForm({ ...coachRequestForm, salle: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white font-medium"
                    >
                      <option value="Dojo & Ring 1">Dojo & Ring 1</option>
                      <option value="Zone WOD Box">Zone WOD Box</option>
                      <option value="Studio Zen">Studio Zen</option>
                      <option value="Studio Vélo Spin">Studio Vélo Spin</option>
                      <option value="Plateau Musculation Libre">Plateau Musculation Libre</option>
                    </select>
                  </div>
                </div>

                {/* Recurring Days Selection */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Jours Récurrents Demandés
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'LUNDI', label: 'Lundi' },
                      { id: 'MARDI', label: 'Mardi' },
                      { id: 'MERCREDI', label: 'Mercredi' },
                      { id: 'JEUDI', label: 'Jeudi' },
                      { id: 'VENDREDI', label: 'Vendredi' },
                      { id: 'SAMEDI', label: 'Samedi' },
                      { id: 'DIMANCHE', label: 'Dimanche' },
                    ].map((d) => {
                      const isSelected = coachRequestForm.joursSemaine.includes(d.id);
                      return (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => toggleDaySelection(d.id)}
                          className={`px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider text-[11px] transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                              : 'bg-neutral-100 dark:bg-white/[0.04] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                          }`}
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Heure de Début
                    </label>
                    <input
                      type="time"
                      required
                      value={coachRequestForm.heureDebut}
                      onChange={(e) => setCoachRequestForm({ ...coachRequestForm, heureDebut: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Heure de Fin
                    </label>
                    <input
                      type="time"
                      required
                      value={coachRequestForm.heureFin}
                      onChange={(e) => setCoachRequestForm({ ...coachRequestForm, heureFin: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                {/* Period Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Période du (Date Début)
                    </label>
                    <input
                      type="date"
                      required
                      value={coachRequestForm.dateDebut}
                      onChange={(e) => setCoachRequestForm({ ...coachRequestForm, dateDebut: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Jusqu'au (Date Fin)
                    </label>
                    <input
                      type="date"
                      required
                      value={coachRequestForm.dateFin}
                      onChange={(e) => setCoachRequestForm({ ...coachRequestForm, dateFin: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                {/* Remarks */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Précisions & Objectifs Pédagogiques
                  </label>
                  <textarea
                    rows={2}
                    value={coachRequestForm.remarques}
                    onChange={(e) => setCoachRequestForm({ ...coachRequestForm, remarques: e.target.value })}
                    placeholder="Ex: Cycle de préparation physique pré-compétition ouvert aux adhérents confirmés..."
                    className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-400 text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsCoachRequestModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 text-xs font-semibold hover:text-neutral-900 dark:hover:text-white"
                  >
                    Annuler
                  </button>

                  <button
                    type="submit"
                    disabled={requestLoading}
                    className="px-5 py-2.5 rounded-xl bg-bronze hover:bg-bronze-light text-neutral-950 font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all"
                  >
                    <Send className="w-3.5 h-3.5 text-neutral-950" />
                    <span>{requestLoading ? 'Envoi en cours...' : 'Soumettre à l\'Administration'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 7. MODAL: Admin Direct Session Creation */}
      {isNewSessionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#121316] border border-neutral-200 dark:border-white/10 p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-3">
              <h3 className="font-heading font-black text-lg text-neutral-900 dark:text-white uppercase tracking-tight">
                Programmer Directement une Séance
              </h3>
              <button
                onClick={() => setIsNewSessionModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            {isRoomConflict && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Attention : Un créneau dans cette salle chevauche ces horaires.</span>
              </div>
            )}

            <form onSubmit={handleCreateSessionSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Cours / Discipline
                </label>
                <select
                  value={sessionFormData.classId}
                  onChange={(e) => setSessionFormData({ ...sessionFormData, classId: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white font-medium"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.titre} ({c.categorie})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Studio & Salle
                </label>
                <select
                  value={sessionFormData.salle}
                  onChange={(e) => setSessionFormData({ ...sessionFormData, salle: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white font-medium"
                >
                  <option value="Dojo & Ring 1">Dojo & Ring 1</option>
                  <option value="Zone WOD Box">Zone WOD Box</option>
                  <option value="Studio Zen">Studio Zen</option>
                  <option value="Studio Vélo Spin">Studio Vélo Spin</option>
                  <option value="Salle Principale">Salle Principale</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Début
                  </label>
                  <input
                    type="datetime-local"
                    value={sessionFormData.dateHeureDebut}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, dateHeureDebut: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Fin
                  </label>
                  <input
                    type="datetime-local"
                    value={sessionFormData.dateHeureFin}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, dateHeureFin: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewSessionModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold uppercase tracking-wider text-xs shadow-sm hover:bg-bronze transition-colors"
                >
                  Ajouter au Planning
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. MODAL: Booking / Session Details */}
      {selectedSessionForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#121316] border border-neutral-200 dark:border-white/10 p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-3">
              <div>
                <span className="text-[9px] font-mono uppercase text-bronze font-bold block">
                  Détails & Inscription
                </span>
                <h3 className="font-heading font-black text-lg text-neutral-900 dark:text-white uppercase tracking-tight">
                  {selectedSessionForBooking.classTitle}
                </h3>
              </div>
              <button
                onClick={onCloseBookingModal}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs bg-neutral-50 dark:bg-white/[0.02] p-4 rounded-2xl border border-neutral-200/60 dark:border-white/[0.04]">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Coach :</span>
                <span className="font-bold text-neutral-900 dark:text-white">{selectedSessionForBooking.coachName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Studio :</span>
                <span className="font-bold text-neutral-900 dark:text-white">{selectedSessionForBooking.salle}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Date & Horaires :</span>
                <span className="font-mono text-neutral-900 dark:text-white">
                  {selectedSessionForBooking.dateHeureDebut?.substring(0, 10)} ({selectedSessionForBooking.dateHeureDebut?.substring(11, 16)} - {selectedSessionForBooking.dateHeureFin?.substring(11, 16)})
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-neutral-200/50 dark:border-white/[0.04]">
                <span className="text-neutral-400">Places Occupées :</span>
                <span className="font-mono font-bold text-bronze">
                  {selectedSessionForBooking.totalBookings || 0} / {selectedSessionForBooking.capaciteMax || 20}
                </span>
              </div>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              {!isMemberRole && members.length > 0 && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Adhérent à Inscrire
                  </label>
                  <select
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-xs"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nomComplet} ({m.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onCloseBookingModal}
                  className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 text-xs font-semibold"
                >
                  Fermer
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="px-5 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold uppercase tracking-wider text-xs shadow-sm hover:bg-bronze transition-colors cursor-pointer"
                >
                  {bookingLoading ? 'Validation...' : 'Confirmer la Réservation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
