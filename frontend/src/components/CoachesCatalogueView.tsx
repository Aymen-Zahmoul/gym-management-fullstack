import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Search,
  Award,
  Calendar,
  Check,
  X,
} from 'lucide-react';
import type { Coach, Member } from '../types';
import { SpotlightCard } from './ui/SpotlightCard';
import { ShinyButton } from './ui/ShinyButton';
import { useAnimeEntrance } from '../utils/animeAnimations';

interface CoachesCatalogueViewProps {
  coaches: Coach[];
  currentUser?: Member | null;
  onNavigateToSchedule?: () => void;
}

export const CoachesCatalogueView: React.FC<CoachesCatalogueViewProps> = ({
  coaches,
  currentUser: _currentUser,
  onNavigateToSchedule: _onNavigateToSchedule,
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [selectedSport, setSelectedSport] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookingModalCoach, setBookingModalCoach] = useState<Coach | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [bookingDate, setBookingDate] = useState<string>('2026-11-05T10:00');
  const [bookingObjective, setBookingObjective] = useState<string>('Perfectionnement technique & Force');

  // Extract unique cities
  const cities = ['ALL', 'Carthage', 'La Marsa', 'Tunis', 'Gammarth', 'Sidi Bou Said', 'Ariana'];

  const sports = [
    { id: 'ALL', label: 'Toutes Spécialités' },
    { id: 'FORCE', label: 'Haltérophilie & Force', filter: 'Force' },
    { id: 'BOXE', label: 'Boxe & Combat', filter: 'Boxe' },
    { id: 'YOGA', label: 'Yoga & Mobilité', filter: 'Yoga' },
    { id: 'WOD', label: 'Cross-Training WOD', filter: 'Cross' },
    { id: 'CARDIO', label: 'Cardio & RPM', filter: 'Cardio' },
  ];

  const filteredCoaches = coaches.filter((c) => {
    const matchesCity = selectedCity === 'ALL' || c.ville?.toLowerCase() === selectedCity.toLowerCase();
    
    let matchesSport = true;
    if (selectedSport !== 'ALL') {
      const sportObj = sports.find((s) => s.id === selectedSport);
      if (sportObj?.filter) {
        matchesSport = c.specialite?.toLowerCase().includes(sportObj.filter.toLowerCase()) ?? false;
      }
    }

    const matchesSearch =
      (c.nomComplet.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.specialite?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (c.ville?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (c.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    return matchesCity && matchesSport && matchesSearch;
  });

  const containerRef = useAnimeEntrance<HTMLDivElement>('.anime-coach-card', [
    filteredCoaches.length,
    selectedCity,
    selectedSport,
  ]);

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingModalCoach(null);
    }, 2200);
  };

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-neutral-200/90 dark:border-white/[0.08] bg-white dark:bg-[#111215] p-8 sm:p-10 shadow-[0_4px_30px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_30px_-4px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full border border-bronze bg-bronze-subtle text-[10px] font-heading font-bold tracking-[0.2em] uppercase text-neutral-900 dark:text-white">
              <Award className="w-3.5 h-3.5 text-bronze" />
              Corps Enseignant • HADID Byrsa & Grand Tunis
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-neutral-900 dark:text-white tracking-tight uppercase">
              Catalogue des Coachs Partenaires
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-2xl font-light leading-relaxed">
              Consultez les profils certifiés, leurs spécialités sportives, leurs tarifs horaires en Dinars Tunisiens (TND) et réservez votre accompagnement personnalisé par ville.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-4 py-2 rounded-2xl bg-neutral-100 dark:bg-white/[0.05] border border-neutral-200 dark:border-white/10 font-mono text-xs font-bold text-neutral-800 dark:text-neutral-200">
              {filteredCoaches.length} coachs disponibles
            </span>
          </div>
        </div>
      </div>

      {/* Filter Row: Cities, Disciplines & Search */}
      <div className="space-y-4">
        {/* City Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-white dark:bg-[#111215] border border-neutral-200/90 dark:border-white/[0.08] shadow-sm overflow-x-auto">
          <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-neutral-400 px-3 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#c5a880]" /> Villes :
          </span>
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCity === city
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {city === 'ALL' ? 'Toutes les villes' : city}
            </button>
          ))}
        </div>

        {/* Sport Filter & Search Input */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Rechercher par nom de coach, discipline, ville..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-[#111215] border border-neutral-200/90 dark:border-white/[0.08] text-neutral-900 dark:text-white placeholder-neutral-400 text-xs focus:outline-none focus:border-[#c5a880]"
            />
          </div>

          <div className="flex flex-wrap gap-1 p-1 rounded-2xl bg-white dark:bg-[#111215] border border-neutral-200/90 dark:border-white/[0.08] shadow-sm">
            {sports.map((sp) => (
              <button
                key={sp.id}
                onClick={() => setSelectedSport(sp.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedSport === sp.id
                    ? 'bg-[#c5a880] text-neutral-950 font-black shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {sp.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Coaches Cards Grid */}
      <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCoaches.map((coach) => (
          <SpotlightCard
            key={coach.id}
            className="anime-coach-card luxury-card p-8 rounded-3xl border border-neutral-200/90 dark:border-white/[0.08] bg-white dark:bg-[#111215] flex flex-col justify-between space-y-7 shadow-sm hover:border-bronze/50 transition-all"
          >
            {/* Header: Avatar, Name, City Badge */}
            <div className="space-y-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#c5a880]/15 border border-[#c5a880]/30 flex items-center justify-center font-heading font-black text-base text-[#c5a880] tracking-wider shadow-inner">
                    {coach.nomComplet.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-neutral-900 dark:text-white text-lg uppercase tracking-tight">
                      {coach.nomComplet}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-light mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#c5a880]" />
                      <span>{coach.ville || 'Carthage'}</span>
                    </div>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/25">
                  Disponible
                </span>
              </div>

              {/* Specialty Tag */}
              <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-100 dark:border-white/[0.06] space-y-1">
                <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-neutral-400 block">
                  Discipline Principale
                </span>
                <p className="font-heading font-bold text-xs uppercase text-neutral-900 dark:text-white tracking-wide">
                  {coach.specialite || 'Préparation Physique Générale'}
                </p>
              </div>

              {/* Bio Summary */}
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light leading-relaxed line-clamp-3">
                {coach.bio || 'Entraînement athlétique de haute précision, programmation sur-mesure et suivi postural.'}
              </p>

              {/* Schedule Availability */}
              <div className="flex items-center gap-2.5 text-xs text-neutral-500 dark:text-neutral-400 font-light pt-1">
                <Clock className="w-3.5 h-3.5 text-[#c5a880] flex-shrink-0" />
                <span className="truncate">{coach.disponibilite || 'Sur rendez-vous'}</span>
              </div>
            </div>

            {/* Card Footer: Pricing & Booking Action */}
            <div className="pt-5 border-t border-neutral-100 dark:border-white/[0.06] space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-neutral-400">
                  Tarif Séance Privée :
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-heading font-black text-2xl text-neutral-900 dark:text-white">
                    {coach.tarifHoraire ? coach.tarifHoraire.toFixed(0) : '60'}
                  </span>
                  <span className="font-heading font-bold text-xs text-[#c5a880]">TND / heure</span>
                </div>
              </div>

              <ShinyButton
                onClick={() => setBookingModalCoach(coach)}
                variant="primary"
                className="w-full text-xs justify-center py-3.5 rounded-2xl"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Réserver ce Coach</span>
              </ShinyButton>
            </div>
          </SpotlightCard>
        ))}
      </div>

      {/* Private Coaching Booking Modal */}
      {bookingModalCoach && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#111215] border border-neutral-200 dark:border-white/10 p-7 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/[0.06] pb-4">
              <div>
                <span className="text-[10px] uppercase font-heading font-bold tracking-[0.2em] text-[#c5a880]">
                  Coaching Privé Sur-Mesure
                </span>
                <h3 className="text-xl font-heading font-black text-neutral-900 dark:text-white uppercase tracking-tight">
                  Demande de Créneau
                </h3>
              </div>
              <button
                onClick={() => setBookingModalCoach(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!bookingSuccess ? (
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                {/* Coach Summary Box */}
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/[0.06] space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-heading font-bold text-sm uppercase text-neutral-900 dark:text-white">
                      {bookingModalCoach.nomComplet}
                    </span>
                    <span className="font-mono font-bold text-xs text-[#c5a880]">
                      {bookingModalCoach.tarifHoraire ? `${bookingModalCoach.tarifHoraire} TND` : '60 TND'} / séance
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">{bookingModalCoach.specialite}</p>
                  <p className="text-[11px] text-neutral-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#c5a880]" /> {bookingModalCoach.ville}
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-heading font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Date & Heure Souhaitée
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/10 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-[#c5a880]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-heading font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Objectif de la Séance
                  </label>
                  <select
                    value={bookingObjective}
                    onChange={(e) => setBookingObjective(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/10 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-[#c5a880]"
                  >
                    <option value="Perfectionnement technique & Force">Perfectionnement technique & Force</option>
                    <option value="Correction posturale & Mobilité">Correction posturale & Mobilité</option>
                    <option value="Préparation physique haute intensité">Préparation physique haute intensité</option>
                    <option value="Cardio training & Perte de masse grasse">Cardio training & Perte de masse grasse</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setBookingModalCoach(null)}
                    className="flex-1 py-3 rounded-xl border border-neutral-200 dark:border-white/10 text-xs font-heading font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
                  >
                    Annuler
                  </button>
                  <ShinyButton type="submit" variant="primary" className="flex-1 justify-center">
                    Confirmer la Demande
                  </ShinyButton>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-4 py-4 animate-in zoom-in-95">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-500">
                  <Check className="w-7 h-7" />
                </div>
                <h4 className="font-heading font-black text-lg uppercase text-neutral-900 dark:text-white">
                  Demande Envoyée au Coach
                </h4>
                <p className="text-xs text-neutral-500 leading-relaxed font-light">
                  {bookingModalCoach.nomComplet} a reçu votre demande de coaching privé à {bookingModalCoach.ville}. Vous recevrez une notification par SMS / Email.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
